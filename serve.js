#!/usr/bin/env node
/**
 * serve.js  –  Local Development Server with Real-time Docs Enumeration API
 * PEMVISH User Guide
 *
 * Features:
 * - Serves static files on port 8080 (or custom PORT env variable)
 * - Provides /api/docs endpoint: dynamically scans the 'docs' directory on EVERY request
 *   ensuring that newly created or modified files/folders are instantly enumerated
 *   with accurate names, types, sizes, and modification timestamps.
 * - Automatically keeps assets/js/docs_manifest.js and docs/manifest.json synchronized.
 */

'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const { scan_docs_directory, jsonDumps } = require('./scripts/generate_docs_manifest.js');

const PORT = parseInt(process.env.PORT || '8080', 10);
const REPO_ROOT = __dirname;
const DOCS_DIR = path.join(REPO_ROOT, 'docs');
const ASSETS_JS_DIR = path.join(REPO_ROOT, 'assets', 'js');

// Extension → MIME type map (mirrors the subset of Python's mimetypes used by this site).
const MIME_TYPES = {
  '.html': 'text/html',
  '.htm': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain',
  '.xml': 'text/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/vnd.microsoft.icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.webmanifest': 'application/manifest+json',
};

/** Guess a Content-Type from a file name (defaults to text/plain, like Python). */
function guessType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME_TYPES[ext] || 'text/plain';
  // Python appends charset for text types lacking one.
  if (type.startsWith('text/') && !type.includes('charset=')) {
    return `${type}; charset=utf-8`;
  }
  return type;
}

/** Normalize an RFC 1123 (GMT) timestamp for the Last-Modified header. */
function toHttpDate(date) {
  return date.toUTCString();
}

/**
 * Translate a request URL path into an absolute filesystem path, mirroring
 * SimpleHTTPRequestHandler.translate_path (query/fragment stripped, decoded,
 * normalized, and restricted to the served directory).
 * Returns null when the path escapes REPO_ROOT.
 */
function translatePath(urlPath) {
  let p = urlPath.split('?')[0].split('#')[0];
  try {
    p = decodeURIComponent(p);
  } catch (e) {
    /* keep raw on malformed escapes */
  }
  // Collapse redundant separators and resolve "." / ".." segments.
  const normalized = path.normalize(p);
  const full = path.resolve(REPO_ROOT, '.' + path.sep + normalized);
  if (full !== REPO_ROOT && !full.startsWith(REPO_ROOT + path.sep)) {
    return null;
  }
  return full;
}

/** Render a minimal directory listing (parity with SimpleHTTPRequestHandler). */
function renderDirectoryListing(dirPath, displayPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const rows = entries
    .map((e) => {
      const name = e.isDirectory() ? `${e.name}/` : e.name;
      const href = encodeURIComponent(name);
      return `<li><a href="${href}">${name}</a></li>`;
    })
    .join('\n');
  return (
    '<!DOCTYPE HTML>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
    `<title>Directory listing for ${displayPath}</title>\n</head>\n<body>\n` +
    `<h1>Directory listing for ${displayPath}</h1>\n<hr>\n<ul>\n${rows}\n</ul>\n<hr>\n</body>\n</html>\n`
  );
}

/** Send a file (or directory) response for a static request. */
function sendStatic(req, res, method) {
  if (method !== 'GET' && method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  const fullPath = translatePath(req.url);
  if (fullPath === null) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('File not found');
    return;
  }

  let target = fullPath;
  let stat;
  try {
    stat = fs.statSync(target);
  } catch (e) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('File not found');
    return;
  }

  if (stat.isDirectory()) {
    const index = path.join(target, 'index.html');
    if (fs.existsSync(index) && fs.statSync(index).isFile()) {
      target = index;
      stat = fs.statSync(target);
    } else {
      const body = Buffer.from(renderDirectoryListing(target, req.url.split('?')[0]), 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': body.length,
        'Last-Modified': toHttpDate(stat.mtime),
      });
      res.end(method === 'HEAD' ? undefined : body);
      return;
    }
  }

  const body = fs.readFileSync(target);
  res.writeHead(200, {
    'Content-Type': guessType(target),
    'Content-Length': body.length,
    'Last-Modified': toHttpDate(stat.mtime),
  });
  res.end(method === 'HEAD' ? undefined : body);
}

/** Handle /api/docs: rescan docs on every request and mirror the manifest files. */
function handleApiDocs(res, method) {
  const manifest = scan_docs_directory(DOCS_DIR);

  // Sync to docs_manifest.js in-flight
  try {
    const js_path = path.join(ASSETS_JS_DIR, 'docs_manifest.js');
    fs.writeFileSync(
      js_path,
      '/** Autogenerated docs manifest */\nwindow.DOCS_MANIFEST = ' + jsonDumps(manifest) + ';\n',
      'utf8'
    );
  } catch (e) {
    /* ignore sync failures, matching the original server */
  }

  const data = Buffer.from(jsonDumps(manifest), 'utf8');
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': data.length,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
  res.end(method === 'HEAD' ? undefined : data);
}

function requestHandler(req, res) {
  const method = req.method || 'GET';
  const urlPath = req.url || '/';

  if (urlPath === '/api/docs' || urlPath.startsWith('/api/docs?')) {
    handleApiDocs(res, method);
    logRequest(req, res);
    return;
  }

  sendStatic(req, res, method);
  logRequest(req, res);
}

/** Log a request line to stderr, mirroring BaseHTTPRequestHandler.log_message. */
function logRequest(req, res) {
  const address = req.socket.remoteAddress || '-';
  const status = res.statusCode;
  const now = new Date();
  const stamp = `${String(now.getDate()).padStart(2, '0')}/${now.toLocaleString('en-US', { month: 'short' })}/${now.getFullYear()} ` +
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  process.stderr.write(`${address} - - [${stamp}] "${req.method} ${req.url} HTTP/${req.httpVersion}" ${status} -\n`);
}

/** Create (but do not start) the HTTP server. */
function createServer() {
  return http.createServer(requestHandler);
}

function run_server() {
  process.chdir(REPO_ROOT);
  const httpd = createServer();
  httpd.listen(PORT, () => {
    console.log(`🚀 PEMVISH User Guide server running at http://localhost:${PORT}`);
    console.log(`📁 Real-time Docs API available at http://localhost:${PORT}/api/docs`);
  });

  const shutdown = () => {
    console.log('\nShutting down server...');
    httpd.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = { createServer, run_server, requestHandler };

if (require.main === module) {
  run_server();
}
