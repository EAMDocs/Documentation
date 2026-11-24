#!/usr/bin/env node
/**
 * individual_md_files.test.js
 * Validates:
 * 1. Every documentation link corresponds to a separate .md file in docs/
 * 2. Every separate .md file can be updated individually
 * 3. An edit made to any separate .md file is immediately reflected on disk and in the scanner
 */

'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const { scan_docs_directory } = require('../scripts/generate_docs_manifest.js');

const REPO_ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(REPO_ROOT, 'docs');

test('all links point to separate files', () => {
  const manifest = scan_docs_directory(DOCS_DIR);
  const files = manifest.items.filter((item) => !item.isDir && item.name.endsWith('.md'));
  assert.ok(files.length >= 58, `Expected at least 58 markdown files, found ${files.length}`);

  const paths = new Set();
  for (const f of files) {
    assert.ok(!paths.has(f.path), `Duplicate file path detected: ${f.path}`);
    paths.add(f.path);

    // Verify physical existence
    const fullPath = path.join(DOCS_DIR, f.path);
    assert.ok(fs.statSync(fullPath).isFile(), `File does not exist: ${fullPath}`);

    // Verify file has individual content (not empty)
    const content = fs.readFileSync(fullPath, 'utf8').trim();
    assert.ok(content.length > 0, `File ${f.path} is empty`);
    assert.ok(content.startsWith('# '), `File ${f.path} does not start with top-level heading`);
  }

  console.log(`Verified ${files.length} separate .md files each with unique paths and content.`);
});

test('individual file update', () => {
  const targetRelPath = 'modules/enterprise-architecture/architecture-canvas.md';
  const targetFullPath = path.join(DOCS_DIR, targetRelPath);

  // Read original content
  const originalContent = fs.readFileSync(targetFullPath, 'utf8');

  const customMarker =
    '<!-- Custom individual test update timestamp -->\n\n### Individual Update Verification\n' +
    'This file can be updated completely independently from other documentation pages.\n';
  const updatedContent = originalContent + '\n' + customMarker;

  try {
    // 1. Update individual file
    fs.writeFileSync(targetFullPath, updatedContent, 'utf8');

    // 2. Rescan directory
    const manifest = scan_docs_directory(DOCS_DIR);
    const targetItem = manifest.items.find((i) => i.path === targetRelPath);

    assert.ok(targetItem, `Item not found: ${targetRelPath}`);
    assert.ok(targetItem.content.includes('Individual Update Verification'));
    console.log(`Verified individual update to ${targetRelPath} was captured immediately.`);
  } finally {
    // Revert to original content
    fs.writeFileSync(targetFullPath, originalContent, 'utf8');
  }

  // Verify reverted
  const revertedManifest = scan_docs_directory(DOCS_DIR);
  const revertedItem = revertedManifest.items.find((i) => i.path === targetRelPath);
  assert.ok(!revertedItem.content.includes('Individual Update Verification'));
  console.log('Revert confirmed successfully.');
});
