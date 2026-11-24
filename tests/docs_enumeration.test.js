#!/usr/bin/env node
/**
 * docs_enumeration.test.js
 * Validates:
 * 1. Correct recursive enumeration of all subdirectories and files in docs/
 * 2. Human-readable proper names rather than raw filenames for all items
 * 3. Accurate metadata: file names, types, sizes, depth, and modification timestamps
 * 4. No omission of any filesystem items
 * 5. Dynamic update detection and title formatting when new files/folders are generated
 * 6. Dynamic DocsHandler /api/docs response payload
 */

'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const { scan_docs_directory } = require('../scripts/generate_docs_manifest.js');
const { createServer } = require('../serve.js');

const REPO_ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(REPO_ROOT, 'docs');

/**
 * Reproduce Python's os.stat().st_mtime (integer seconds + nanoseconds * 1e-9)
 * so that timestamps can be compared bit-for-bit with the scanner output.
 */
function pyMtime(fullPath) {
  const st = fs.statSync(fullPath, { bigint: true });
  return Number(st.mtimeNs / 1000000000n) + Number(st.mtimeNs % 1000000000n) * 1e-9;
}

/** Recursively collect docs-relative directory and file paths (mirrors os.walk). */
function walkFs(docsDir) {
  const fsDirs = [];
  const fsFiles = [];
  (function walk(root) {
    const entries = fs.readdirSync(root, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
    let files = entries.filter((e) => e.isFile()).map((e) => e.name).sort();
    files = files.filter((f) => f !== 'manifest.json');
    if (root !== docsDir) fsDirs.push(path.relative(docsDir, root));
    for (const f of files) fsFiles.push(path.relative(docsDir, path.join(root, f)));
    for (const d of dirs) walk(path.join(root, d));
  })(docsDir);
  return { fsDirs, fsFiles };
}

/** Perform a GET request against a running server. */
function httpGet(port, urlPath) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port, path: urlPath }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      })
      .on('error', reject);
  });
}

test('complete enumeration and metadata', () => {
  const manifest = scan_docs_directory(DOCS_DIR);
  const items = manifest.items;

  const { fsDirs, fsFiles } = walkFs(DOCS_DIR);
  const manifestPaths = {};
  for (const item of items) manifestPaths[item.path] = item;

  // 1. Verify no omission of directories & check human-readable titles
  for (const d of fsDirs) {
    assert.ok(d in manifestPaths, `Directory omitted: ${d}`);
    const item = manifestPaths[d];
    assert.strictEqual(item.isDir, true);
    assert.strictEqual(item.type, 'Directory');
    assert.strictEqual(item.name, path.basename(d));
    assert.ok(item.title, `Directory missing title: ${d}`);
    assert.ok(!item.title.includes('-'), `Directory title contains raw hyphen: ${item.title}`);
    assert.ok(item.depth >= 0);
    assert.strictEqual(item.timestamp, pyMtime(path.join(DOCS_DIR, d)));
  }

  // 2. Verify no omission of files & check human-readable titles
  for (const f of fsFiles) {
    assert.ok(f in manifestPaths, `File omitted: ${f}`);
    const item = manifestPaths[f];
    assert.strictEqual(item.isDir, false);
    assert.strictEqual(item.name, path.basename(f));
    assert.ok(item.title, `File missing title: ${f}`);
    assert.ok(!item.title.endsWith('.md'), `File title contains raw extension: ${item.title}`);
    assert.ok(!item.title.endsWith('.txt'), `File title contains raw extension: ${item.title}`);
    assert.ok(item.depth >= 0);
    const fullPath = path.join(DOCS_DIR, f);
    const st = fs.statSync(fullPath);
    assert.strictEqual(item.size, st.size);
    assert.strictEqual(item.timestamp, pyMtime(fullPath));
    if (f.endsWith('.md')) {
      assert.strictEqual(item.type, 'Markdown Document');
    } else if (f.endsWith('.txt')) {
      assert.strictEqual(item.type, 'Text Document');
    }
  }

  // 3. Verify total counts match exactly
  assert.strictEqual(manifest.stats.totalDirectories, fsDirs.length);
  assert.strictEqual(manifest.stats.totalFiles, fsFiles.length);
  assert.strictEqual(manifest.stats.totalItems, fsDirs.length + fsFiles.length);
  console.log(
    `Verified ${fsDirs.length} directories and ${fsFiles.length} files with proper human-readable titles successfully.`
  );
});

test('dynamic update on new content', () => {
  const initialManifest = scan_docs_directory(DOCS_DIR);
  const initialItemsCount = initialManifest.stats.totalItems;
  const initialFilesCount = initialManifest.stats.totalFiles;

  const testFolder = path.join(DOCS_DIR, 'modules', 'dynamic-test-module');
  const testFile = path.join(testFolder, 'dynamic-sample.md');
  const testContent = '# Dynamic Sample Topic\n';

  try {
    fs.mkdirSync(testFolder, { recursive: true });
    fs.writeFileSync(testFile, testContent, 'utf8');

    // Re-scan dynamically
    const updatedManifest = scan_docs_directory(DOCS_DIR);
    const updatedPaths = {};
    for (const item of updatedManifest.items) updatedPaths[item.path] = item;

    const relFolder = path.relative(DOCS_DIR, testFolder);
    const relFile = path.relative(DOCS_DIR, testFile);

    assert.ok(relFolder in updatedPaths, 'New folder not found in dynamic scan');
    assert.ok(relFile in updatedPaths, 'New file not found in dynamic scan');

    // Verify folder title
    assert.strictEqual(updatedPaths[relFolder].title, 'Dynamic Test Module');

    // Verify file title from top heading
    const fileItem = updatedPaths[relFile];
    assert.strictEqual(fileItem.name, 'dynamic-sample.md');
    assert.strictEqual(fileItem.title, 'Dynamic Sample Topic');
    assert.strictEqual(fileItem.type, 'Markdown Document');
    assert.strictEqual(fileItem.size, Buffer.byteLength(testContent, 'utf8'));

    assert.strictEqual(updatedManifest.stats.totalItems, initialItemsCount + 2);
    assert.strictEqual(updatedManifest.stats.totalFiles, initialFilesCount + 1);
    console.log('Dynamic update test passed: new content detected with proper human-readable titles.');
  } finally {
    if (fs.existsSync(testFolder)) fs.rmSync(testFolder, { recursive: true, force: true });
  }

  // After cleanup, verify count returns to original
  const cleanManifest = scan_docs_directory(DOCS_DIR);
  assert.strictEqual(cleanManifest.stats.totalItems, initialItemsCount);
  console.log('Cleanup verified: item count returned to original baseline.');
});

test('docs handler api', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const res = await httpGet(port, '/api/docs');
    assert.strictEqual(res.status, 200);
    assert.ok(
      String(res.headers['content-type']).includes('application/json'),
      'Content-Type is not application/json'
    );

    const data = JSON.parse(res.body);
    assert.ok('stats' in data);
    assert.ok('items' in data);
    assert.ok('tree' in data);
    assert.ok(data.stats.totalItems > 0);

    // Verify first item has title
    assert.ok('title' in data.items[0]);
    console.log(
      `Mock handler /api/docs returned 200 with ${data.stats.totalItems} enumerated items and valid titles.`
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
