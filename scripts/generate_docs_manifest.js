#!/usr/bin/env node
/**
 * generate_docs_manifest.js
 * Scans the 'docs' directory recursively and generates:
 *  1. assets/js/docs_manifest.js (for direct file:// or static hosting)
 *  2. docs/manifest.json (for API consumers / tooling)
 *
 * Enumerates all directories, subdirectories, and separate markdown/doc files with complete metadata:
 * - Human-readable proper names (title / displayName)
 * - Target navigation anchors
 * - File names & relative paths
 * - File types & extensions
 * - File content (for instant offline viewing)
 * - Sizes (bytes & formatted)
 * - Modification timestamps (ISO & formatted)
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Known acronyms for consistent capitalization
const ACRONYMS = {
  eam: 'EAM',
  apm: 'APM',
  itam: 'ITAM',
  sam: 'SAM',
  ham: 'HAM',
  eol: 'EOL',
  eos: 'EOS',
  cve: 'CVE',
  sla: 'SLA',
  kpi: 'KPI',
  itsm: 'ITSM',
  cmdb: 'CMDB',
  sso: 'SSO',
  api: 'API',
  rest: 'REST',
  hr: 'HR',
  nist: 'NIST',
  soc: 'SOC',
  saas: 'SaaS',
  ui: 'UI',
  it: 'IT',
  md: 'Markdown',
  txt: 'Plain Text',
};

const ANCHOR_MAP = {
  // Platform Overview
  'introduction/platform-overview/README.md': 'overview',
  'introduction/platform-overview/what-is-nuvision.md': 'h-overview',
  'introduction/platform-overview/core-design-principles.md': 'h-overview',
  'introduction/platform-overview/technical-architecture.md': 'h-overview-arch',
  'introduction/platform-overview/core-pillars.md': 'h-overview-pillars',
  'introduction/platform-overview': 'overview',

  // Getting Started
  'introduction/getting-started/README.md': 'getting-started',
  'introduction/getting-started/prerequisites.md': 'h-gs-prereq',
  'introduction/getting-started/account-activation.md': 'h-gs-activation',
  'introduction/getting-started/first-login.md': 'h-gs-login',
  'introduction/getting-started/user-roles-and-permissions.md': 'h-gs-roles',
  'introduction/getting-started': 'getting-started',

  // EAM
  'modules/enterprise-architecture/README.md': 'eam',
  'modules/enterprise-architecture/architecture-canvas.md': 'h-eam-canvas',
  'modules/enterprise-architecture/business-capability-mapping.md': 'h-eam-capabilities',
  'modules/enterprise-architecture/architecture-roadmap.md': 'h-eam-roadmap',
  'modules/enterprise-architecture/supported-viewpoints.md': 'eam',
  'modules/enterprise-architecture': 'eam',

  // APM
  'modules/application-portfolio/README.md': 'apm',
  'modules/application-portfolio/application-inventory.md': 'h-apm-inventory',
  'modules/application-portfolio/rationalisation-scoring.md': 'h-apm-score',
  'modules/application-portfolio/bulk-import.md': 'h-apm-import',
  'modules/application-portfolio': 'apm',

  // ITAM
  'modules/it-asset-management/README.md': 'itam',
  'modules/it-asset-management/asset-discovery.md': 'h-itam-discovery',
  'modules/it-asset-management/asset-lifecycle-states.md': 'h-itam-lifecycle',
  'modules/it-asset-management/ghost-asset-detection.md': 'itam',
  'modules/it-asset-management/software-asset-management.md': 'h-itam-sam',
  'modules/it-asset-management/hardware-asset-management.md': 'h-itam-ham',
  'modules/it-asset-management': 'itam',

  // Risk
  'modules/risk-and-obsolescence/README.md': 'risk',
  'modules/risk-and-obsolescence/risk-dashboard.md': 'h-risk-dashboard',
  'modules/risk-and-obsolescence/eol-and-eos-tracking.md': 'h-risk-eol',
  'modules/risk-and-obsolescence/risk-scoring-model.md': 'h-risk-scoring',
  'modules/risk-and-obsolescence/risk-response-workflow.md': 'risk',
  'modules/risk-and-obsolescence': 'risk',

  // Business Portfolio
  'modules/business-portfolio/README.md': 'bpm',
  'modules/business-portfolio/strategic-initiatives.md': 'h-bpm-initiatives',
  'modules/business-portfolio/roadmap-planning.md': 'h-bpm-roadmap',
  'modules/business-portfolio/kpi-dashboards.md': 'h-bpm-kpi',
  'modules/business-portfolio': 'bpm',

  // Vendor
  'modules/vendor-portfolio/README.md': 'vendor',
  'modules/vendor-portfolio/vendor-register.md': 'h-vendor-register',
  'modules/vendor-portfolio/contract-tracking.md': 'h-vendor-contracts',
  'modules/vendor-portfolio': 'vendor',

  // Integrations
  'configuration/integrations/README.md': 'integrations',
  'configuration/integrations/itsm-and-cmdb.md': 'h-int-itsm',
  'configuration/integrations/cloud-platforms.md': 'h-int-cloud',
  'configuration/integrations/hr-and-identity.md': 'h-int-hr',
  'configuration/integrations/setting-up-a-connector.md': 'h-int-setup',
  'configuration/integrations/rest-api.md': 'integrations',
  'configuration/integrations': 'integrations',

  // Admin
  'configuration/administration/README.md': 'admin',
  'configuration/administration/user-management.md': 'h-admin-users',
  'configuration/administration/single-sign-on.md': 'h-admin-sso',
  'configuration/administration/audit-logs.md': 'h-admin-audit',
  'configuration/administration/backup-and-data-export.md': 'h-admin-backup',
  'configuration/administration': 'admin',

  // Reports
  'configuration/reports-and-dashboards/README.md': 'reports',
  'configuration/reports-and-dashboards/report-builder.md': 'h-reports-builder',
  'configuration/reports-and-dashboards/dashboard-widgets.md': 'h-reports-dashboards',
  'configuration/reports-and-dashboards/standard-reports.md': 'reports',
  'configuration/reports-and-dashboards': 'reports',

  // Support
  'help/support-and-troubleshooting/README.md': 'support',
  'help/support-and-troubleshooting/support-channels.md': 'h-support-channels',
  'help/support-and-troubleshooting/sla-response-times.md': 'h-support-sla',
  'help/support-and-troubleshooting/common-issues.md': 'h-support-faq',
  'help/support-and-troubleshooting/release-notes.md': 'h-support-release',
  'help/support-and-troubleshooting': 'support',

  // Glossary
  'help/glossary/README.md': 'glossary',
  'help/glossary': 'glossary',

  // Root
  'README.md': 'cover',
  'SUMMARY.md': 'docs-explorer',
  'nuvision-user-manual.txt': 'docs-explorer',
};

/**
 * POSIX-style dirname matching Python's os.path.dirname for docs-relative paths
 * (Python returns "" for a bare filename; Node's path.dirname returns ".").
 */
function dirnamePosix(p) {
  const i = p.lastIndexOf('/');
  return i === -1 ? '' : p.slice(0, i);
}

/** Count path separators (equivalent to Python str.count(os.sep)). */
function countSeparators(p) {
  let n = 0;
  for (let i = 0; i < p.length; i += 1) if (p[i] === '/') n += 1;
  return n;
}

/** Two-digit zero padding. */
function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Local "YYYY-MM-DD HH:MM:SS" (matches Python strftime). */
function formatDateTime(date) {
  return (
    `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ` +
    `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
  );
}

/** Local ISO-8601 string, omitting fractional seconds when zero (matches Python datetime.isoformat). */
function formatIsoDate(date, micros) {
  let s =
    `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}` +
    `T${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
  if (micros > 0) s += `.${String(micros).padStart(6, '0')}`;
  return s;
}

/** Collect high-precision file metadata (nanosecond resolution, mirroring Python os.stat). */
function statInfo(fullPath) {
  const st = fs.statSync(fullPath, { bigint: true });
  const mtimeNs = st.mtimeNs; // BigInt nanoseconds
  // Python's os.stat().st_mtime is computed as (integer seconds) + (nanoseconds * 1e-9),
  // which can differ from Number(ns)/1e9 by 1 ULP. Reproduce it exactly.
  const sec = Number(mtimeNs / 1000000000n);
  const nsec = Number(mtimeNs % 1000000000n);
  const timestamp = sec + nsec * 1e-9;
  // Python datetime.fromtimestamp(): us = round(modf(t)[0] * 1e6), with carry into seconds.
  let integerPart = Math.floor(timestamp);
  let micros = Math.round((timestamp - integerPart) * 1e6);
  if (micros >= 1000000) {
    integerPart += 1;
    micros -= 1000000;
  }
  return {
    size: Number(st.size),
    timestamp,
    date: new Date(integerPart * 1000),
    micros,
  };
}

function format_size(size_bytes) {
  if (size_bytes < 1024) {
    return `${size_bytes} B`;
  } else if (size_bytes < 1024 * 1024) {
    return `${(size_bytes / 1024).toFixed(1)} KB`;
  }
  return `${(size_bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function get_file_type(name, is_dir) {
  if (is_dir) {
    return 'Directory';
  }
  const ext = path.extname(name).toLowerCase();
  if (ext === '.md') {
    return 'Markdown Document';
  } else if (ext === '.txt') {
    return 'Text Document';
  } else if (['.json', '.yaml', '.yml'].includes(ext)) {
    return 'Config Document';
  } else if (['.png', '.jpg', '.jpeg', '.svg', '.gif'].includes(ext)) {
    return 'Image';
  }
  return 'File';
}

const SMALL_WORDS = ['and', 'or', 'the', 'of', 'in', 'to', 'for', 'with'];

/** Convert kebab-case or snake_case to Title Case preserving known acronyms. */
function to_title_case(slug) {
  const words = String(slug).split(/[-_\s]+/);
  const titled = [];
  for (const w of words) {
    const lower_w = w.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(ACRONYMS, lower_w)) {
      titled.push(ACRONYMS[lower_w]);
    } else if (SMALL_WORDS.includes(lower_w) && titled.length > 0) {
      titled.push(lower_w);
    } else {
      titled.push(w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    }
  }
  return titled.join(' ');
}

function load_summary_titles(docs_dir) {
  const summary_path = path.join(docs_dir, 'SUMMARY.md');
  const titles = {};
  if (fs.existsSync(summary_path)) {
    try {
      const content = fs.readFileSync(summary_path, 'utf8');
      for (const line of content.split('\n')) {
        const m = line.match(/\[(.*?)\]\((.*?)\)/);
        if (m) {
          const t = m[1].trim();
          const p = m[2].trim();
          titles[p] = t;
        }
      }
    } catch (e) {
      /* ignore */
    }
  }
  return titles;
}

/** Read the first line of a file, or null when unavailable. */
function firstLineOf(fullPath) {
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const nl = content.indexOf('\n');
    const first = nl === -1 ? content : content.slice(0, nl);
    return first.trim();
  } catch (e) {
    return null;
  }
}

function get_human_readable_title(name, rel_path, is_dir, docs_dir, summary_titles) {
  // 1. Special root files
  if (rel_path === 'README.md') {
    return 'Getting Started & User Manual';
  } else if (rel_path === 'SUMMARY.md') {
    return 'Table of Contents (Summary)';
  } else if (rel_path === 'nuvision-user-manual.txt') {
    return 'Full User Manual (Single File Text)';
  }

  // 2. Match exact path in SUMMARY.md
  if (Object.prototype.hasOwnProperty.call(summary_titles, rel_path)) {
    return summary_titles[rel_path];
  }

  // 3. For directories, check if <dir>/README.md has a title in SUMMARY.md or in its first line
  if (is_dir) {
    const dir_readme = `${rel_path}/README.md`;
    if (Object.prototype.hasOwnProperty.call(summary_titles, dir_readme)) {
      return summary_titles[dir_readme];
    }

    const full_readme = path.join(docs_dir, rel_path, 'README.md');
    if (fs.existsSync(full_readme)) {
      const first_line = firstLineOf(full_readme);
      if (first_line && first_line.startsWith('# ')) {
        return first_line.slice(2).trim();
      }
    }

    const top_dirs = {
      introduction: 'Introduction',
      modules: 'Modules',
      configuration: 'Configuration and Administration',
      help: 'Help and Reference',
    };
    if (Object.prototype.hasOwnProperty.call(top_dirs, rel_path)) {
      return top_dirs[rel_path];
    }

    return to_title_case(name);
  }

  // 4. If markdown file, try reading top heading
  if (name.endsWith('.md')) {
    const full_file = path.join(docs_dir, rel_path);
    if (fs.existsSync(full_file)) {
      const first_line = firstLineOf(full_file);
      if (first_line && first_line.startsWith('# ')) {
        return first_line.slice(2).trim();
      }
    }
  }

  // 5. Fallback: clean title casing
  const base_name = path.parse(name).name;
  return to_title_case(base_name);
}

function get_target_anchor(rel_path) {
  if (Object.prototype.hasOwnProperty.call(ANCHOR_MAP, rel_path)) {
    return ANCHOR_MAP[rel_path];
  }
  const parent = dirnamePosix(rel_path);
  if (Object.prototype.hasOwnProperty.call(ANCHOR_MAP, parent)) {
    return ANCHOR_MAP[parent];
  }
  return '';
}

function scan_docs_directory(docs_dir) {
  const flat_items = [];
  const summary_titles = load_summary_titles(docs_dir);

  // Mirror Python's os.walk top-down traversal (sorted dirs, sorted files).
  function walk(root) {
    const entries = fs.readdirSync(root, { withFileTypes: true });
    const dirs = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .sort()
      .filter((f) => f !== 'manifest.json');

    // Enumerate the directory itself (the docs root is represented by the tree root)
    if (root !== docs_dir) {
      const rel_dir = path.relative(docs_dir, root);
      const info = statInfo(root);
      const depth = countSeparators(rel_dir);
      const dir_name = path.basename(root);
      const title = get_human_readable_title(dir_name, rel_dir, true, docs_dir, summary_titles);
      flat_items.push({
        name: dir_name,
        title,
        displayName: title,
        path: rel_dir,
        targetAnchor: get_target_anchor(rel_dir),
        type: 'Directory',
        isDir: true,
        extension: '',
        size: info.size,
        sizeFormatted: format_size(info.size),
        mtime: formatDateTime(info.date),
        isoDate: formatIsoDate(info.date, info.micros),
        timestamp: info.timestamp,
        depth,
      });
    }

    for (const f of files) {
      const full_path = path.join(root, f);
      const rel_path = path.relative(docs_dir, full_path);
      const info = statInfo(full_path);
      const depth = countSeparators(rel_path);
      const ext = path.extname(f).toLowerCase();
      const title = get_human_readable_title(f, rel_path, false, docs_dir, summary_titles);

      // Read content for instant offline viewing/fallback
      let content = '';
      if (ext === '.md' || ext === '.txt') {
        try {
          content = fs.readFileSync(full_path, 'utf8');
        } catch (e) {
          content = '';
        }
      }

      flat_items.push({
        name: f,
        title,
        displayName: title,
        path: rel_path,
        targetAnchor: get_target_anchor(rel_path),
        type: get_file_type(f, false),
        isDir: false,
        extension: ext,
        size: info.size,
        sizeFormatted: format_size(info.size),
        mtime: formatDateTime(info.date),
        isoDate: formatIsoDate(info.date, info.micros),
        timestamp: info.timestamp,
        depth,
        content,
      });
    }

    for (const d of dirs) {
      walk(path.join(root, d));
    }
  }

  walk(docs_dir);

  // Build hierarchical tree
  function build_tree(items) {
    const root = {
      name: 'docs',
      title: 'Documentation Root',
      displayName: 'Documentation',
      path: '',
      isDir: true,
      type: 'Directory',
      targetAnchor: 'docs-explorer',
      children: [],
    };
    const lookup = { '': root };

    // Sort items so parents exist before children, directories first, then files
    const sorted_items = [...items].sort((a, b) => {
      const da = countSeparators(a.path);
      const db = countSeparators(b.path);
      if (da !== db) return da - db;
      const ia = a.isDir ? 0 : 1;
      const ib = b.isDir ? 0 : 1;
      if (ia !== ib) return ia - ib;
      if (a.path < b.path) return -1;
      if (a.path > b.path) return 1;
      return 0;
    });

    for (const item of sorted_items) {
      const p = item.path;
      const parent_path = dirnamePosix(p);
      const node = Object.assign({}, item);
      if (item.isDir) {
        node.children = [];
        lookup[p] = node;
      }

      const parent_node = Object.prototype.hasOwnProperty.call(lookup, parent_path) ? lookup[parent_path] : root;
      if (!parent_node.children) parent_node.children = [];
      parent_node.children.push(node);
    }

    function sort_children(n) {
      if (n.children && n.children.length) {
        n.children.sort((c, d) => {
          const ca = c.isDir ? 0 : 1;
          const da = d.isDir ? 0 : 1;
          if (ca !== da) return ca - da;
          const ta = c.title || c.name;
          const td = d.title || d.name;
          if (ta < td) return -1;
          if (ta > td) return 1;
          return 0;
        });
        for (const c of n.children) sort_children(c);
      }
    }
    sort_children(root);

    return root;
  }

  const tree = build_tree(flat_items);

  const total_directories = flat_items.filter((i) => i.isDir).length;
  const total_files = flat_items.filter((i) => !i.isDir).length;
  const total_size = flat_items.filter((i) => !i.isDir).reduce((s, i) => s + i.size, 0);

  return {
    generatedAt: formatDateTime(new Date()),
    docsRoot: 'docs',
    stats: {
      totalItems: flat_items.length,
      totalDirectories: total_directories,
      totalFiles: total_files,
      totalSizeBytes: total_size,
      totalSizeFormatted: format_size(total_size),
    },
    items: flat_items,
    tree,
  };
}

/**
 * Serialize with 2-space indentation while escaping all non-ASCII characters,
 * matching Python's json.dumps(..., indent=2) which defaults to ensure_ascii=True.
 */
function jsonDumps(obj) {
  return JSON.stringify(obj, null, 2).replace(/[\u007f-\uffff]/g, (ch) =>
    '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0')
  );
}

function main() {
  const repo_root = path.resolve(__dirname, '..');
  const docs_dir = path.join(repo_root, 'docs');
  const assets_js_dir = path.join(repo_root, 'assets', 'js');

  fs.mkdirSync(assets_js_dir, { recursive: true });

  const manifest = scan_docs_directory(docs_dir);

  // 1. Output JS file
  const js_output_path = path.join(assets_js_dir, 'docs_manifest.js');
  fs.writeFileSync(
    js_output_path,
    '/**\n * Autogenerated docs manifest containing all files, folders, metadata, and contents\n */\n' +
      'window.DOCS_MANIFEST = ' +
      jsonDumps(manifest) +
      ';\n',
    'utf8'
  );
  console.log(`Wrote ${js_output_path}`);

  // 2. Output JSON file
  const json_output_path = path.join(docs_dir, 'manifest.json');
  fs.writeFileSync(json_output_path, jsonDumps(manifest), 'utf8');
  console.log(`Wrote ${json_output_path}`);

  console.log(
    `Manifest generated successfully: ${manifest.stats.totalDirectories} directories, ` +
      `${manifest.stats.totalFiles} files (${manifest.stats.totalItems} total items).`
  );
}

module.exports = {
  scan_docs_directory,
  format_size,
  get_file_type,
  get_human_readable_title,
  get_target_anchor,
  to_title_case,
  load_summary_titles,
  jsonDumps,
  ACRONYMS,
  ANCHOR_MAP,
};

if (require.main === module) {
  main();
}
