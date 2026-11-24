/**
 * manual.js  –  NuVision User Manual – UI Controller & Hierarchical Docs Navigator
 * PEMVISH LLC
 *
 * Responsibilities:
 *  - Left-hand dynamic hierarchical Docs Navigation Tree:
 *      * Displays all folders, subfolders, and separate .md files in docs/
 *      * Human-readable proper names rather than raw filenames
 *      * Each file links directly to its separate .md file for individual reading & updating
 *      * Expand/collapse toggles with proper multi-level indentation
 *      * Responsive across desktop (fixed sidebar) and mobile (offcanvas)
 *      * Instant search filtering and Expand/Collapse All toggle
 *  - Separate Markdown Document Reader View:
 *      * Fetches live .md file from disk via HTTP with manifest fallback for offline file://
 *      * Renders rich Markdown via Marked.js with syntax highlighting via Prism.js
 *      * Breadcrumb navigation and GitBook-style Prev/Next sequential paging
 *      * Deep linking via URL hash (#doc=path/to/file.md) for sharing and bookmarking
 *      * Raw markdown source toggle & direct file link
 *  - Docs Directory Explorer:
 *      * Real-time enumeration of docs/ directory, tree view, table view, and live /api/docs sync
 *  - Dynamic on-page Table of Contents (TOC)
 *  - Global search with highlighting
 */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── State ───────────────────────────────────────────────── */
  let currentDocsManifest = window.DOCS_MANIFEST || null;
  let activeDocsView = 'tree'; // 'tree' or 'table'
  let allSidebarExpanded = false;
  let currentActiveDocPath = null;
  let rawSourceVisible = false;

  /* ── Sequential File List for Prev/Next Paging ───────────── */
  function getSequentialFileList() {
    if (!currentDocsManifest || !currentDocsManifest.items) return [];
    return currentDocsManifest.items.filter(item => !item.isDir && (item.name.endsWith('.md') || item.name.endsWith('.txt')));
  }

  /* ══════════════════════════════════════════════════════════
     DYNAMIC HIERARCHICAL SIDEBAR NAVIGATION ENGINE
  ══════════════════════════════════════════════════════════ */

  function buildSidebarTree(manifest, containerId, filterText = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tree = manifest ? manifest.tree : null;
    if (!tree) {
      container.innerHTML = `<div class="p-3 text-white-50 small">Loading documentation tree...</div>`;
      return;
    }

    let html = '';

    // Fixed Top Shortcuts (Home & Docs Explorer)
    if (!filterText) {
      html += `
        <div class="pv-side-node mb-2">
          <div class="pv-side-row" onclick="showManualHome(this)" title="Manual Overview and Cover">
            <span class="pv-side-caret" style="opacity:0;"><i class="bi bi-dot"></i></span>
            <i class="bi bi-house text-primary pv-side-icon"></i>
            <span class="pv-side-title fw-bold">Manual Home</span>
          </div>
          <div class="pv-side-row" onclick="showDocsExplorer(this)" title="Explore Docs Files and Metadata">
            <span class="pv-side-caret" style="opacity:0;"><i class="bi bi-dot"></i></span>
            <i class="bi bi-folder2-open text-info pv-side-icon"></i>
            <span class="pv-side-title fw-bold">Docs Directory Explorer</span>
          </div>
        </div>
        <div class="border-top border-secondary border-opacity-25 my-2"></div>
      `;
    }

    // Recursive node builder
    function renderNode(node, depth = 0) {
      if (!node) return { html: '', matches: false };

      const isDir = !!node.isDir;
      const rawName = node.name;
      const title = node.title || node.displayName || rawName;
      const path = node.path || '';
      const targetAnchor = node.targetAnchor || '';
      const children = node.children || [];

      // Check if node matches filter
      const matchesSelf = !filterText ||
        title.toLowerCase().includes(filterText) ||
        rawName.toLowerCase().includes(filterText) ||
        path.toLowerCase().includes(filterText);

      let childHtml = '';
      let anyChildMatches = false;

      if (isDir) {
        children.forEach(child => {
          const res = renderNode(child, depth + 1);
          if (res.html) {
            childHtml += res.html;
            if (res.matches) anyChildMatches = true;
          }
        });
      }

      if (filterText && !matchesSelf && !anyChildMatches) {
        return { html: '', matches: false };
      }

      // Default expand top-level folders or when searching
      const isExpanded = filterText ? anyChildMatches : (depth <= 1 || allSidebarExpanded);

      // Icon determination
      let icon = '';
      if (isDir) {
        icon = `<i class="bi bi-folder-fill text-warning pv-side-icon"></i>`;
      } else if (rawName.endsWith('.md')) {
        icon = `<i class="bi bi-file-earmark-code text-info pv-side-icon"></i>`;
      } else if (rawName.endsWith('.txt')) {
        icon = `<i class="bi bi-file-earmark-text text-warning pv-side-icon"></i>`;
      } else {
        icon = `<i class="bi bi-file-earmark text-secondary pv-side-icon"></i>`;
      }

      const caret = isDir
        ? `<span class="pv-side-caret ${isExpanded ? 'expanded' : ''}" onclick="toggleSidebarNode(event, this)"><i class="bi bi-chevron-right"></i></span>`
        : `<span class="pv-side-caret" style="opacity:0;"><i class="bi bi-dot"></i></span>`;

      const badge = isDir && children.length > 0
        ? `<span class="pv-side-badge">${children.length}</span>`
        : '';

      const isActive = (!isDir && path === currentActiveDocPath) ? 'active' : '';

      const nodeHtml = `
        <div class="pv-side-node" data-path="${path}" data-anchor="${targetAnchor}">
          <div class="pv-side-row ${isActive}" onclick="handleSidebarClick('${path}', '${targetAnchor}', ${isDir}, this)" title="${title} (docs/${path || ''})">
            ${caret}
            ${icon}
            <span class="pv-side-title">${title}</span>
            ${badge}
          </div>
          ${isDir ? `<div class="pv-side-children ${isExpanded ? '' : 'collapsed'}">${childHtml}</div>` : ''}
        </div>
      `;

      return { html: nodeHtml, matches: matchesSelf || anyChildMatches };
    }

    // Render all direct children of docs root
    const rootChildren = tree.children || [];
    let treeBodyHtml = '';
    rootChildren.forEach(child => {
      const res = renderNode(child, 0);
      if (res.html) treeBodyHtml += res.html;
    });

    if (!treeBodyHtml) {
      treeBodyHtml = `<div class="p-3 text-white-50 small">No matching documentation items found.</div>`;
    }

    container.innerHTML = html + treeBodyHtml;
  }

  // Toggle node expand/collapse
  window.toggleSidebarNode = function (event, caretElement) {
    if (event) event.stopPropagation();
    const node = caretElement.closest('.pv-side-node');
    if (!node) return;
    const childrenContainer = node.querySelector(':scope > .pv-side-children');
    if (childrenContainer) {
      const isCollapsed = childrenContainer.classList.toggle('collapsed');
      caretElement.classList.toggle('expanded', !isCollapsed);
    }
  };

  // Handle item selection in sidebar
  window.handleSidebarClick = function (path, targetAnchor, isDir, rowElement) {
    if (isDir) {
      // Toggle directory expansion
      const node = rowElement.closest('.pv-side-node');
      const childrenContainer = node ? node.querySelector(':scope > .pv-side-children') : null;
      const caret = rowElement.querySelector('.pv-side-caret');
      if (childrenContainer) {
        const isCollapsed = childrenContainer.classList.toggle('collapsed');
        if (caret) caret.classList.toggle('expanded', !isCollapsed);
      }

      // Check if folder has a README.md inside it to view
      const dirReadme = path ? `${path}/README.md` : 'README.md';
      const fileList = getSequentialFileList();
      const hasReadme = fileList.some(f => f.path === dirReadme);
      if (hasReadme) {
        loadMarkdownDocument(dirReadme);
      }
      return;
    }

    // Direct link to separate markdown or text file
    if (path.endsWith('.md') || path.endsWith('.txt')) {
      loadMarkdownDocument(path);
    } else if (targetAnchor) {
      navigateTo(targetAnchor);
    }
  };

  /* ══════════════════════════════════════════════════════════
     SEPARATE MARKDOWN DOCUMENT LOADER & RENDERER
  ══════════════════════════════════════════════════════════ */

  // Apply the active highlight and expand parent folders for a doc path.
  // Called both when opening a document and after the tree is rebuilt by a
  // docs sync, so navigation state stays consistent.
  function applyActiveDocHighlight(relPath) {
    $$('.pv-side-row').forEach(el => el.classList.remove('active'));
    if (!relPath) return;

    $$(`.pv-side-node[data-path="${relPath}"] > .pv-side-row`).forEach(el => el.classList.add('active'));

    let activeNode = $(`.pv-side-node[data-path="${relPath}"]`);
    while (activeNode) {
      const parentChildren = activeNode.closest('.pv-side-children');
      if (parentChildren) {
        parentChildren.classList.remove('collapsed');
        const parentNode = parentChildren.closest('.pv-side-node');
        if (parentNode) {
          const caret = parentNode.querySelector(':scope > .pv-side-row .pv-side-caret');
          if (caret) caret.classList.add('expanded');
          activeNode = parentNode;
          continue;
        }
      }
      break;
    }
  }

  async function loadMarkdownDocument(relPath, pushHash = true) {
    currentActiveDocPath = relPath;

    // Show Reader view, hide general cover and chapters
    const readerView = document.getElementById('docReaderView');
    const coverView = document.getElementById('cover');
    const chaptersView = document.getElementById('chaptersContainer');
    const explorerView = document.getElementById('docs-explorer');
    const banner = document.getElementById('activeDocBanner');

    if (readerView) readerView.classList.remove('d-none');
    if (coverView) coverView.classList.add('d-none');
    if (chaptersView) chaptersView.classList.add('d-none');
    if (explorerView) explorerView.classList.add('d-none');
    if (banner) banner.classList.remove('d-none');

    // Update active highlight & expand parents across sidebars
    applyActiveDocHighlight(relPath);

    // Find item metadata in manifest
    const items = currentDocsManifest ? currentDocsManifest.items : [];
    const item = items.find(i => i.path === relPath) || {
      name: relPath.split('/').pop(),
      title: relPath.split('/').pop().replace(/\.md$/, '').replace(/[-_]/g, ' '),
      path: relPath,
      sizeFormatted: 'Live',
      mtime: 'Recently updated'
    };

    // Update Banner
    const bannerTitle = document.getElementById('activeDocTitle');
    const bannerPath = document.getElementById('activeDocPath');
    const bannerBadge = document.getElementById('activeDocBadge');
    if (bannerTitle) bannerTitle.textContent = item.title;
    if (bannerPath) bannerPath.textContent = `docs/${relPath}`;
    if (bannerBadge) bannerBadge.textContent = relPath.endsWith('.md') ? 'Markdown' : 'Text';

    // Update Document Header
    const docTitleEl = document.getElementById('docArticleTitle');
    const docPathEl = document.getElementById('docMetaPath');
    const docSizeEl = document.getElementById('docMetaSize');
    const docTimeEl = document.getElementById('docMetaTime');
    const docTypeEl = document.getElementById('docMetaType');
    const openRawLink = document.getElementById('btnOpenRawTab');

    if (docTitleEl) docTitleEl.textContent = item.title;
    if (docPathEl) docPathEl.textContent = `docs/${relPath}`;
    if (docSizeEl) docSizeEl.textContent = item.sizeFormatted || 'Loaded';
    if (docTimeEl) docTimeEl.textContent = item.mtime || 'Active';
    if (docTypeEl) docTypeEl.textContent = relPath.endsWith('.md') ? 'Markdown Document' : 'Text Document';
    if (openRawLink) openRawLink.href = `docs/${relPath}`;

    // Update Breadcrumbs
    buildBreadcrumbs(relPath, item.title);

    // Fetch and Render Content
    const markdownBody = document.getElementById('docMarkdownBody');
    const rawSourceEl = document.getElementById('docRawSource');
    if (markdownBody) {
      markdownBody.innerHTML = `
        <div class="text-center py-5 text-muted">
          <div class="spinner-border spinner-border-sm text-primary me-2"></div>
          Loading <code>docs/${relPath}</code>...
        </div>
      `;
    }

    let rawMarkdown = '';
    try {
      // Live fetch with cache-busting so disk edits are immediately reflected
      const res = await fetch(`docs/${relPath}?t=${Date.now()}`);
      if (res.ok) {
        rawMarkdown = await res.text();
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      // Offline file:// fallback from preloaded manifest
      if (item && item.content) {
        rawMarkdown = item.content;
      } else {
        rawMarkdown = `# ${item.title}\n\nUnable to fetch file live. Viewing offline stub for \`docs/${relPath}\`.`;
      }
    }

    // Render with Marked.js
    if (markdownBody) {
      if (window.marked && relPath.endsWith('.md')) {
        markdownBody.innerHTML = marked.parse(rawMarkdown);
      } else {
        markdownBody.innerHTML = `<pre class="p-3 bg-light rounded border"><code>${escapeHtml(rawMarkdown)}</code></pre>`;
      }

      // Resolve relative asset paths & intercept internal document links
      rewriteRenderedLinks(markdownBody, relPath);

      // Syntax highlight code blocks
      if (window.Prism) {
        Prism.highlightAllUnder(markdownBody);
      }

      // Build on-page TOC for the current document
      buildArticleToc();
    }

    // Set raw source code view
    if (rawSourceEl) {
      rawSourceEl.querySelector('code').textContent = rawMarkdown;
      if (window.Prism) Prism.highlightElement(rawSourceEl.querySelector('code'));
    }

    // Configure Prev / Next Pagination Buttons
    updateDocPagination(relPath);

    // Update URL hash for bookmarking & sharing
    if (pushHash) {
      window.history.pushState(null, '', `#doc=${encodeURIComponent(relPath)}`);
    }

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close offcanvas if open (mobile)
    const offcanvas = document.getElementById('sidebarOffcanvas');
    if (offcanvas) {
      const bsOC = bootstrap.Offcanvas.getInstance(offcanvas);
      if (bsOC) bsOC.hide();
    }
  }

  // Escape HTML helper
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Expose the reader on window so inline handlers (Docs Explorer tree/table,
  // rendered Markdown links) can open documents without a full page reload.
  window.loadMarkdownDocument = loadMarkdownDocument;

  /* ── Relative path resolution for Markdown assets & links ─── */
  // Resolve a reference found inside `docPath` (a docs-relative path) into a
  // repository-root-relative path, honouring ./ and ../ segments. The reader
  // view always lives at the repo root (index.html), so this keeps images and
  // links working regardless of how deeply nested the source .md file is.
  function resolveFromRepo(docPath, ref) {
    const refStr = String(ref);
    // A leading "/" is treated as repository-root-relative (the reader view
    // lives at the repo root); everything else is relative to the source file.
    const rootRelative = refStr.startsWith('/');
    const baseParts = rootRelative
      ? []
      : ['docs', ...(docPath.includes('/') ? docPath.slice(0, docPath.lastIndexOf('/')).split('/') : [])];
    const out = [...baseParts];
    for (const part of refStr.split('/')) {
      if (part === '' || part === '.') continue;
      if (part === '..') { if (out.length) out.pop(); continue; }
      out.push(part);
    }
    return out.join('/');
  }

  const EXTERNAL_RE = /^(https?:|mailto:|tel:|data:|ftp:|\/\/)/i;

  // Rewrite links/images inside a freshly rendered Markdown document so that:
  //  - relative images resolve to their real on-disk location
  //  - relative .md/.txt links open in the in-page reader (no full reload)
  //  - relative non-doc assets open in a new tab from the correct location
  //  - external links open safely in a new tab
  function rewriteRenderedLinks(container, docPath) {
    if (!container) return;

    container.querySelectorAll('img[src]').forEach(img => {
      const src = img.getAttribute('src');
      if (!src || EXTERNAL_RE.test(src)) return;
      img.setAttribute('src', resolveFromRepo(docPath, src));
      img.setAttribute('loading', 'lazy');
    });

    container.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('?')) return;

      if (EXTERNAL_RE.test(href)) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
        return;
      }

      const hashIdx = href.indexOf('#');
      const rawPath = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
      const rawHash = hashIdx >= 0 ? href.slice(hashIdx) : '';
      if (!rawPath) return;

      const resolved = resolveFromRepo(docPath, rawPath);

      if (/\.(md|txt)$/i.test(resolved)) {
        // Only docs/ content can be opened by the in-page reader.
        if (resolved.startsWith('docs/')) {
          const docRel = resolved.slice('docs/'.length);
          a.setAttribute('href', `#doc=${encodeURIComponent(docRel)}`);
          a.removeAttribute('target');
          a.addEventListener('click', (evt) => {
            evt.preventDefault();
            loadMarkdownDocument(docRel);
          });
        } else {
          a.setAttribute('href', resolved);
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener');
        }
        return;
      }

      // Non-markdown relative asset (pdf, png, csv, …)
      a.setAttribute('href', resolved + rawHash);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  }

  // Breadcrumbs builder
  function buildBreadcrumbs(relPath, activeTitle) {
    const breadcrumb = document.getElementById('docBreadcrumb');
    if (!breadcrumb) return;

    const parts = relPath.split('/');
    let html = `<li class="breadcrumb-item"><a href="#" onclick="showManualHome(event)" class="text-decoration-none">Home</a></li>`;

    let currentAccPath = '';
    for (let i = 0; i < parts.length - 1; i++) {
      currentAccPath += (currentAccPath ? '/' : '') + parts[i];
      const dirTitle = currentDocsManifest
        ? (currentDocsManifest.items.find(it => it.isDir && it.path === currentAccPath)?.title || parts[i])
        : parts[i];
      html += `<li class="breadcrumb-item text-muted">${dirTitle}</li>`;
    }

    html += `<li class="breadcrumb-item active text-dark fw-semibold" aria-current="page">${activeTitle}</li>`;
    breadcrumb.innerHTML = html;
  }

  // Prev / Next Pagination Controller
  function updateDocPagination(currentPath) {
    const fileList = getSequentialFileList();
    const currentIndex = fileList.findIndex(f => f.path === currentPath);

    const prevBtn = document.getElementById('btnPrevDoc');
    const nextBtn = document.getElementById('btnNextDoc');
    const prevLabel = document.getElementById('prevDocLabel');
    const nextLabel = document.getElementById('nextDocLabel');

    if (currentIndex > 0) {
      const prevFile = fileList[currentIndex - 1];
      if (prevBtn && prevLabel) {
        prevBtn.classList.remove('d-none');
        prevLabel.textContent = prevFile.title;
        prevBtn.onclick = () => loadMarkdownDocument(prevFile.path);
      }
    } else if (prevBtn) {
      prevBtn.classList.add('d-none');
    }

    if (currentIndex >= 0 && currentIndex < fileList.length - 1) {
      const nextFile = fileList[currentIndex + 1];
      if (nextBtn && nextLabel) {
        nextBtn.classList.remove('d-none');
        nextLabel.textContent = nextFile.title;
        nextBtn.onclick = () => loadMarkdownDocument(nextFile.path);
      }
    } else if (nextBtn) {
      nextBtn.classList.add('d-none');
    }
  }

  // Build On-Page TOC dynamically for current document
  function buildArticleToc() {
    const toc = document.getElementById('onPageToc');
    if (!toc) return;

    const headings = $$('#docMarkdownBody h1, #docMarkdownBody h2, #docMarkdownBody h3');
    if (!headings.length) {
      toc.innerHTML = `<span class="text-muted small">No section headings</span>`;
      return;
    }

    let html = '';
    headings.forEach((h, idx) => {
      if (!h.id) h.id = `heading-${idx}`;
      const level = h.tagName.toLowerCase();
      const cls = level === 'h3' ? ' toc-h3' : (level === 'h1' ? ' fw-bold' : '');
      html += `<a href="#${h.id}" class="${cls}" onclick="scrollToHeading(event, '${h.id}')">${h.textContent.trim()}</a>`;
    });
    toc.innerHTML = html;
  }

  window.scrollToHeading = function (e, id) {
    if (e) e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Switch back to Manual Home view
  window.showManualHome = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    currentActiveDocPath = null;

    const readerView = document.getElementById('docReaderView');
    const coverView = document.getElementById('cover');
    const chaptersView = document.getElementById('chaptersContainer');
    const explorerView = document.getElementById('docs-explorer');
    const banner = document.getElementById('activeDocBanner');

    if (readerView) readerView.classList.add('d-none');
    if (coverView) coverView.classList.remove('d-none');
    if (chaptersView) chaptersView.classList.remove('d-none');
    if (explorerView) explorerView.classList.remove('d-none');
    if (banner) banner.classList.add('d-none');

    $$('.pv-side-row').forEach(el => el.classList.remove('active'));
    window.history.pushState(null, '', '#cover');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const offcanvas = document.getElementById('sidebarOffcanvas');
    if (offcanvas) {
      const bsOC = bootstrap.Offcanvas.getInstance(offcanvas);
      if (bsOC) bsOC.hide();
    }
  };

  // Switch to Docs Directory Explorer view
  window.showDocsExplorer = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    showManualHome();
    const explorer = document.getElementById('docs-explorer');
    if (explorer) {
      explorer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Helper for quick-nav cards / buttons
  window.navigateTo = function (id) {
    // If we're currently in reader view and target is a chapter section, switch back
    const target = document.getElementById(id);
    if (target) {
      showManualHome();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /* ── Sidebar Controls ─────────────────────────────────────── */
  function initSidebarControls() {
    const searchInputs = ['sideNavSearch', 'mobileSideNavSearch'];
    searchInputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          const q = input.value.trim().toLowerCase();
          if (currentDocsManifest) {
            buildSidebarTree(currentDocsManifest, 'sidebarTreeContainer', q);
            buildSidebarTree(currentDocsManifest, 'mobileSidebarContent', q);
          }
        });
      }
    });

    const btnToggleAll = document.getElementById('btnToggleAllSidebar');
    if (btnToggleAll) {
      btnToggleAll.addEventListener('click', () => {
        allSidebarExpanded = !allSidebarExpanded;
        btnToggleAll.innerHTML = allSidebarExpanded
          ? '<i class="bi bi-arrows-collapse me-1"></i>Collapse All'
          : '<i class="bi bi-arrows-expand me-1"></i>Expand All';

        $$('.pv-side-children').forEach(el => {
          el.classList.toggle('collapsed', !allSidebarExpanded);
        });
        $$('.pv-side-caret').forEach(el => {
          el.classList.toggle('expanded', allSidebarExpanded);
        });
      });
    }

    // Toggle Raw Source Button
    const btnToggleRaw = document.getElementById('btnToggleRaw');
    if (btnToggleRaw) {
      btnToggleRaw.addEventListener('click', () => {
        rawSourceVisible = !rawSourceVisible;
        const markdownBody = document.getElementById('docMarkdownBody');
        const rawSourceEl = document.getElementById('docRawSource');
        const rawLabel = document.getElementById('rawToggleLabel');

        if (rawSourceVisible) {
          if (markdownBody) markdownBody.classList.add('d-none');
          if (rawSourceEl) rawSourceEl.classList.remove('d-none');
          if (rawLabel) rawLabel.textContent = 'View Rendered';
        } else {
          if (markdownBody) markdownBody.classList.remove('d-none');
          if (rawSourceEl) rawSourceEl.classList.add('d-none');
          if (rawLabel) rawLabel.textContent = 'View Source';
        }
      });
    }
  }

  /* ── Handle Hash Change (Deep Linking) ───────────────────── */
  function handleUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#doc=')) {
      const docPath = decodeURIComponent(hash.substring(5));
      loadMarkdownDocument(docPath, false);
    } else if (hash === '#docs-explorer') {
      showDocsExplorer();
    } else if (hash && hash !== '#cover') {
      const target = document.getElementById(hash.substring(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  /* ── Back-to-top ─────────────────────────────────────────── */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Search (Main Content) ─────────────────────────────────── */
  function initSearch() {
    const input = document.getElementById('manualSearch');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = input.value.trim();
        if (q.length < 2) {
          clearHighlights();
          return;
        }
        highlightText(q);
      }, 250);
    });
  }

  function clearHighlights() {
    $$('mark.pv-hl').forEach(m => {
      const parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });
  }

  function highlightText(query) {
    clearHighlights();
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const walk = (node) => {
      if (node.nodeType === 3) {
        const val = node.nodeValue;
        if (regex.test(val)) {
          const frag = document.createDocumentFragment();
          val.split(regex).forEach((part, i) => {
            if (i % 2 === 1) {
              const mark = document.createElement('mark');
              mark.className = 'pv-hl';
              mark.textContent = part;
              frag.appendChild(mark);
            } else if (part) {
              frag.appendChild(document.createTextNode(part));
            }
          });
          node.parentNode.replaceChild(frag, node);
        }
        regex.lastIndex = 0;
      } else if (node.nodeType === 1 && !['SCRIPT', 'STYLE', 'MARK'].includes(node.tagName)) {
        [...node.childNodes].forEach(walk);
      }
    };
    walk(document.getElementById('mainContent'));
  }

  /* ══════════════════════════════════════════════════════════
     DOCS DIRECTORY EXPLORER ENGINE
  ══════════════════════════════════════════════════════════ */

  function updateDocsUI(manifest) {
    if (!manifest) return;
    currentDocsManifest = manifest;

    // 1. Update Left Navigation Panel Trees
    buildSidebarTree(manifest, 'sidebarTreeContainer');
    buildSidebarTree(manifest, 'mobileSidebarContent');

    // Re-apply the currently open document's highlight/expansion after the
    // tree is rebuilt so navigation state stays consistent across syncs.
    applyActiveDocHighlight(currentActiveDocPath);

    // 2. Update KPI counters
    const stats = manifest.stats || {};
    const kpiTotal = document.getElementById('kpiTotalItems');
    const kpiDirs = document.getElementById('kpiDirectories');
    const kpiFiles = document.getElementById('kpiFiles');
    const kpiSize = document.getElementById('kpiTotalSize');

    if (kpiTotal) kpiTotal.textContent = stats.totalItems || 0;
    if (kpiDirs) kpiDirs.textContent = stats.totalDirectories || 0;
    if (kpiFiles) kpiFiles.textContent = stats.totalFiles || 0;
    if (kpiSize) kpiSize.textContent = stats.totalSizeFormatted || '0 B';

    // 3. Update Docs Explorer Views
    const searchInput = document.getElementById('docsSearchInput');
    const filterText = searchInput ? searchInput.value.trim().toLowerCase() : '';
    renderDocsExplorerTree(manifest.tree, filterText);
    renderDocsExplorerTable(manifest.items || [], filterText);
  }

  // Recursive Tree in Explorer
  function renderDocsExplorerTree(treeNode, filterText = '') {
    const container = document.getElementById('docsTreeView');
    if (!container || !treeNode) return;

    function buildNodeHtml(node, isRoot = false) {
      if (!node) return { html: '', matches: false };

      const isDir = !!node.isDir;
      const rawName = node.name;
      const title = isRoot ? 'docs/' : (node.title || node.displayName || rawName);
      const path = node.path || '';
      const children = node.children || [];

      const matchesSelf = !filterText ||
        title.toLowerCase().includes(filterText) ||
        rawName.toLowerCase().includes(filterText) ||
        path.toLowerCase().includes(filterText);

      let childHtml = '';
      let anyChildMatches = false;

      if (isDir) {
        children.forEach(child => {
          const res = buildNodeHtml(child);
          if (res.html) {
            childHtml += res.html;
            if (res.matches) anyChildMatches = true;
          }
        });
      }

      if (filterText && !matchesSelf && !anyChildMatches && !isRoot) {
        return { html: '', matches: false };
      }

      const shouldAutoExpand = isRoot || (filterText && anyChildMatches);
      const icon = isDir
        ? '<i class="bi bi-folder-fill text-warning me-1"></i>'
        : (rawName.endsWith('.md')
            ? '<i class="bi bi-file-earmark-code text-success me-1"></i>'
            : (rawName.endsWith('.txt')
                ? '<i class="bi bi-file-earmark-text text-primary me-1"></i>'
                : '<i class="bi bi-file-earmark text-secondary me-1"></i>'));

      const typeBadge = isDir
        ? `<span class="pv-badge pv-badge-dir">directory</span>`
        : (rawName.endsWith('.md')
            ? `<span class="pv-badge pv-badge-md">.md</span>`
            : `<span class="pv-badge pv-badge-txt">.txt</span>`);

      const meta = isDir
        ? `${children.length} items &nbsp;|&nbsp; ${node.mtime || ''}`
        : `${node.sizeFormatted || '0 B'} &nbsp;|&nbsp; ${node.mtime || ''}`;

      const toggleCaret = isDir
        ? `<span class="pv-tree-toggle ${shouldAutoExpand ? 'expanded' : ''}"><i class="bi bi-chevron-right"></i></span>`
        : `<span class="pv-tree-toggle" style="opacity:0;"><i class="bi bi-dot"></i></span>`;

      const clickHandler = isDir
        ? `onclick="toggleExplorerTreeNode(this)"`
        : (path ? `onclick="loadMarkdownDocument('${path}')"` : '');

      let html = `
        <div class="pv-tree-node">
          <div class="pv-tree-row" ${clickHandler} title="${title} (docs/${path || ''})">
            ${toggleCaret}
            ${icon}
            <span class="fw-semibold text-dark">${title}</span>
            <small class="text-muted ms-1 font-monospace" style="font-size:0.75rem;">(${rawName})</small>
            ${typeBadge}
            <div class="pv-tree-meta">
              <span>${meta}</span>
              ${!isDir && path ? `<a href="docs/${path}" target="_blank" class="btn btn-sm btn-link p-0 text-decoration-none" title="Open file"><i class="bi bi-box-arrow-up-right"></i></a>` : ''}
            </div>
          </div>
          ${isDir ? `<div class="pv-tree-children ${shouldAutoExpand ? '' : 'collapsed'}">${childHtml}</div>` : ''}
        </div>
      `;

      return { html, matches: matchesSelf || anyChildMatches };
    }

    const result = buildNodeHtml(treeNode, true);
    container.innerHTML = result.html || '<div class="text-muted p-3">No matching files or folders found.</div>';
  }

  // Flat Table in Explorer
  function renderDocsExplorerTable(items, filterText = '') {
    const tbody = document.getElementById('docsTableBody');
    if (!tbody) return;

    const filtered = items.filter(item => {
      if (!filterText) return true;
      const title = item.title || item.displayName || '';
      return item.name.toLowerCase().includes(filterText) ||
             title.toLowerCase().includes(filterText) ||
             item.path.toLowerCase().includes(filterText) ||
             item.type.toLowerCase().includes(filterText);
    });

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No matching items found.</td></tr>`;
      return;
    }

    const sorted = [...filtered].sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.path.localeCompare(b.path);
    });

    let html = '';
    sorted.forEach(item => {
      const isDir = item.isDir;
      const title = item.title || item.displayName || item.name;
      const icon = isDir
        ? '<i class="bi bi-folder-fill text-warning me-2"></i>'
        : (item.name.endsWith('.md')
            ? '<i class="bi bi-file-earmark-code text-success me-2"></i>'
            : (item.name.endsWith('.txt')
                ? '<i class="bi bi-file-earmark-text text-primary me-2"></i>'
                : '<i class="bi bi-file-earmark text-secondary me-2"></i>'));

      const typeBadge = isDir
        ? `<span class="pv-badge pv-badge-dir">Directory</span>`
        : (item.name.endsWith('.md')
            ? `<span class="pv-badge pv-badge-md">Markdown</span>`
            : (item.name.endsWith('.txt')
                ? `<span class="pv-badge pv-badge-txt">Plain Text</span>`
                : `<span class="pv-badge pv-badge-other">${item.type}</span>`));

      const pathDisplay = isDir
        ? `<strong>${title}</strong> <span class="text-muted small">(${item.path}/)</span>`
        : `<a href="#doc=${encodeURIComponent(item.path)}" onclick="loadMarkdownDocument('${item.path}')" class="text-decoration-none fw-medium text-primary">${title}</a> <span class="text-muted small">(${item.path})</span>`;

      html += `
        <tr>
          <td>${icon} ${pathDisplay}</td>
          <td>${typeBadge}</td>
          <td class="text-nowrap small text-muted">${item.sizeFormatted}</td>
          <td class="text-nowrap small text-muted">${item.mtime}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  window.toggleExplorerTreeNode = function (rowElement) {
    const parentNode = rowElement.closest('.pv-tree-node');
    if (!parentNode) return;
    const childrenContainer = parentNode.querySelector(':scope > .pv-tree-children');
    const caret = rowElement.querySelector('.pv-tree-toggle');
    if (childrenContainer) {
      const isCollapsed = childrenContainer.classList.toggle('collapsed');
      if (caret) caret.classList.toggle('expanded', !isCollapsed);
    }
  };

  // Dynamic Docs API Fetcher & Synchronizer
  async function fetchLiveDocs() {
    const icon = document.getElementById('refreshIcon');
    const statusText = document.getElementById('docsLiveStatus');

    if (icon) icon.classList.add('spin-animation');
    if (statusText) statusText.textContent = 'Updating...';

    try {
      const response = await fetch('/api/docs?t=' + Date.now());
      if (!response.ok) throw new Error('API returned status ' + response.status);
      const manifest = await response.json();
      updateDocsUI(manifest);
      lastManifestSignature = manifestSignature(manifest);
      setSyncStatus('Live Synced', true);
      console.log('✅ Real-time docs enumerated from /api/docs:', manifest.stats);
    } catch (err) {
      try {
        const jsonRes = await fetch('docs/manifest.json?t=' + Date.now());
        if (jsonRes.ok) {
          const manifest = await jsonRes.json();
          updateDocsUI(manifest);
          lastManifestSignature = manifestSignature(manifest);
          setSyncStatus('Manifest Synced', true);
          return;
        }
      } catch (e2) {}

      if (window.DOCS_MANIFEST) {
        updateDocsUI(window.DOCS_MANIFEST);
        lastManifestSignature = manifestSignature(window.DOCS_MANIFEST);
        setSyncStatus('Preloaded', true);
      }
    } finally {
      if (icon) {
        setTimeout(() => icon.classList.remove('spin-animation'), 500);
      }
    }
  }

  /* ══════════════════════════════════════════════════════════
     AUTOMATIC DOCS DISCOVERY & SYNCHRONISATION
     Polls the /api/docs endpoint (which rescans docs/ on every request) so
     brand-new Markdown files or folders appear in the navigation UI on their
     own — no manual refresh, configuration or code changes required.
  ══════════════════════════════════════════════════════════ */
  let autoSyncTimer = null;
  let lastManifestSignature = null;

  // Lightweight fingerprint of the docs tree used to detect changes.
  function manifestSignature(manifest) {
    if (!manifest || !manifest.items) return '';
    const maxTs = manifest.items.reduce((acc, it) => Math.max(acc, it.timestamp || 0), 0);
    const stats = manifest.stats || {};
    return `${stats.totalItems || manifest.items.length}:${stats.totalFiles || ''}:${maxTs}`;
  }

  function setSyncStatus(text, ok = true) {
    const statusText = document.getElementById('docsLiveStatus');
    const badge = document.getElementById('docsLiveBadge');
    if (statusText) statusText.textContent = text;
    if (badge) {
      badge.classList.toggle('bg-success-subtle', ok);
      badge.classList.toggle('text-success', ok);
      badge.classList.toggle('bg-warning-subtle', !ok);
      badge.classList.toggle('text-warning', !ok);
    }
  }

  async function pollDocsForChanges() {
    // Skip work while the tab is hidden to avoid pointless traffic.
    if (document.visibilityState === 'hidden') return;
    try {
      const res = await fetch('/api/docs?t=' + Date.now());
      if (!res.ok) return;
      const manifest = await res.json();
      const signature = manifestSignature(manifest);
      if (signature === lastManifestSignature) return;

      // A new file/folder (or edit) was detected — refresh the whole UI.
      lastManifestSignature = signature;
      updateDocsUI(manifest);
      const stats = manifest.stats || {};
      setSyncStatus(`Auto-synced · ${stats.totalFiles || 0} files`, true);
      console.log('🔄 Docs changed on disk — navigation updated automatically:', stats);

      // Brief visual pulse on the refresh control as feedback.
      const icon = document.getElementById('refreshIcon');
      if (icon) {
        icon.classList.add('spin-animation');
        setTimeout(() => icon.classList.remove('spin-animation'), 800);
      }
    } catch (err) {
      setSyncStatus('Sync paused', false);
    }
  }

  function startAutoSync(intervalMs = 5000) {
    if (!window.location.protocol.startsWith('http')) return; // needs the dev server
    if (autoSyncTimer) return;
    autoSyncTimer = setInterval(pollDocsForChanges, intervalMs);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') pollDocsForChanges();
    });
  }

  function initDocsExplorer() {
    if (window.DOCS_MANIFEST) {
      updateDocsUI(window.DOCS_MANIFEST);
    }

    if (window.location.protocol.startsWith('http')) {
      fetchLiveDocs();
      startAutoSync();
    }

    const btnRefresh = document.getElementById('btnRefreshDocs');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => fetchLiveDocs());
    }

    const searchInput = document.getElementById('docsSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        if (currentDocsManifest) {
          renderDocsExplorerTree(currentDocsManifest.tree, q);
          renderDocsExplorerTable(currentDocsManifest.items || [], q);
        }
      });
    }

    const btnTree = document.getElementById('btnViewTree');
    const btnTable = document.getElementById('btnViewTable');
    const treeView = document.getElementById('docsTreeView');
    const tableView = document.getElementById('docsTableView');

    if (btnTree && btnTable && treeView && tableView) {
      btnTree.addEventListener('click', () => {
        btnTree.classList.add('active');
        btnTable.classList.remove('active');
        treeView.classList.remove('d-none');
        tableView.classList.add('d-none');
        activeDocsView = 'tree';
      });

      btnTable.addEventListener('click', () => {
        btnTable.classList.add('active');
        btnTree.classList.remove('active');
        tableView.classList.remove('d-none');
        treeView.classList.add('d-none');
        activeDocsView = 'table';
      });
    }
  }

  /* ── Init ─────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initBackToTop();
    initSearch();
    initSidebarControls();
    initDocsExplorer();

    // Deep link check on load & listen to hash changes
    handleUrlHash();
    window.addEventListener('hashchange', handleUrlHash);
  });

})();
