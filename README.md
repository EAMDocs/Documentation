# NuVision User Manual – Project Structure

An interactive, GitBook-style user manual built with vanilla JS/CSS and served by a
lightweight **Node.js** development server. The server exposes a real-time Docs
enumeration API (`/api/docs`) that rescans the `docs/` folder on every request, so new
Markdown files and folders appear in the UI automatically — no manual configuration.

## Prerequisites

- **Node.js ≥ 18** (tested on Node 20)
- **npm** (bundled with Node.js)

Check your versions:

```bash
node -v
npm -v
```

> No third-party runtime dependencies are required. Bootstrap, Bootstrap Icons, Prism.js,
> and marked.js are loaded from a CDN inside `index.html`.

## Project Structure

```
userguide/
├── index.html                      # Main GitBook-style manual (Bootstrap 5)
├── serve.js                        # Node.js dev server + real-time Docs API (/api/docs)
├── package.json                    # Project metadata and npm scripts
├── README.md                       # This file
│
├── scripts/
│   ├── generate_docs_manifest.js   # Scans docs/ → docs_manifest.js + manifest.json
│   └── populate_markdown_files.js  # (Re)generates the individual Markdown files
│
├── tests/
│   ├── docs_enumeration.test.js    # Enumeration, metadata, dynamic update, /api/docs
│   └── individual_md_files.test.js # Per-file integrity and live update behaviour
│
├── docs/                           # Standardized GitBook documentation root
│   ├── README.md                   # GitBook landing page / root intro
│   ├── SUMMARY.md                  # GitBook table of contents and navigation hierarchy
│   ├── manifest.json               # Generated docs manifest (metadata + contents)
│   ├── nuvision-user-manual.txt    # Complete manual as plain text
│   ├── introduction/               # Platform overview and onboarding guides
│   ├── modules/                    # EAM, APM, ITAM, Risk, Business & Vendor modules
│   ├── configuration/              # Integrations, Administration, Reports
│   └── help/                       # Support, Troubleshooting, Glossary
│
└── assets/
    ├── css/
    │   └── manual.css              # Custom GitBook-style stylesheet
    └── js/
        ├── chapters.js             # Chapter content (HTML strings)
        ├── docs_manifest.js        # Generated docs manifest (window.DOCS_MANIFEST)
        └── manual.js               # UI controller (sidebar, TOC, live reader)
```

## About PEMVISH & NuVision

**PEMVISH LLC** is an enterprise software company founded in 2022, headquartered in Princeton, NJ. Their flagship product **NuVision** is a SOC 2 compliant, serverless SaaS platform serving as a unified command centre for:

- Enterprise Architecture Management (EAM)
- Application Portfolio Management (APM) & App Rationalization
- IT Asset Management (ITAM) — including SAM & HAM
- Technology Risk & Obsolescence Management
- Business Portfolio & Roadmap Planning
- Vendor Portfolio Management

## Setup & Installation

Clone the repository, then install dependencies (there are none by default, but this keeps `npm` state consistent):

```bash
npm install
```

## Running Locally

```bash
# Start the development server (default port 8080) with the real-time Docs API
npm start            # or: node serve.js

# Custom port
PORT=3000 npm start  # or: PORT=3000 node serve.js
```

Then open <http://localhost:8080> in your browser. On startup the server prints:

```
🚀 PEMVISH User Guide server running at http://localhost:8080
📁 Real-time Docs API available at http://localhost:8080/api/docs
```

### Other ways to run

```bash
# Direct browser access (static files only — no /api/docs)
open index.html

# Any Node.js static host / dev server, e.g.:
npx serve .
```

> Tip: `npx serve .` (or opening `index.html` directly) uses the pre-generated
> `assets/js/docs_manifest.js`. To pick up newly added files, run
> `npm run generate-manifest` first, or use `npm start` which rescans automatically.

## Real-time Docs API

`serve.js` provides `GET /api/docs`, which scans `docs/` on **every** request and returns the
full manifest as JSON:

```jsonc
{
  "generatedAt": "2026-11-24 22:40:08",
  "docsRoot": "docs",
  "stats": { "totalItems": 79, "totalDirectories": 17, "totalFiles": 62, "...": "..." },
  "items": [ /* flat list: name, title, path, type, size, mtime, content, ... */ ],
  "tree":  { /* hierarchical navigation tree */ }
}
```

On each call it also keeps `assets/js/docs_manifest.js` synchronized, so static hosting stays
current. Responses include `Access-Control-Allow-Origin: *` and no-cache headers.

## Separate Markdown Files & Individual Updating

Every section and topic in the left navigation panel links to its own **distinct `.md` file** in `docs/`:

- **Separate `.md` files** organized in hierarchical folders (`introduction/`, `modules/`, `configuration/`, `help/`).
- **Individual Updating**: Any `.md` file can be opened, updated, and committed independently.
- **Dynamic Live Reader**: When running with `npm start`, clicking any item in the left navigation panel immediately loads the live content of that separate `.md` file from disk via `fetch()` and renders it with `marked.js` and `prism.js`.
- **GitBook Navigation**: Includes dynamic breadcrumbs, next/previous sequential page buttons, raw markdown source toggle, and deep-link URL hashes (e.g. `#doc=modules/it-asset-management/asset-discovery.md`).
- **Auto-discovery**: New `.md` files or subfolders added to `docs/` are detected automatically by the `/api/docs` polling and appear in the navigation within seconds.

## Generating the Docs Manifest

Regenerate the static manifest files (`assets/js/docs_manifest.js` and `docs/manifest.json`) without starting the server:

```bash
npm run generate-manifest   # or: node scripts/generate_docs_manifest.js
```

## (Re)Populating the Markdown Files

To (re)generate the individual Markdown documents under `docs/` from the built-in content set:

```bash
npm run populate            # or: node scripts/populate_markdown_files.js
```

## Testing

Run the automated test suite (Node's built-in test runner, no external test framework required):

```bash
npm test                    # or: node --test --test-concurrency=1 tests/
```

> Test files are executed sequentially (concurrency 1) because they exercise the shared
> `docs/` tree (creating and editing files in place).

The suite verifies:

- Complete recursive enumeration of every file/folder in `docs/` with accurate metadata.
- Human-readable titles and consistent file types.
- Dynamic detection of newly added files/folders.
- The `/api/docs` HTTP response contract (`200`, `application/json`, `stats`/`items`/`tree`).
- Per-file integrity (unique paths, non-empty content, top-level headings) and live per-file updates.

## Deployment

The project is a self-contained static site plus an optional Node.js server.

**Static hosting** (GitHub Pages, S3, Netlify, Nginx, …): deploy the repository contents
(`index.html`, `assets/`, `docs/`). Run `npm run generate-manifest` beforehand so the manifest
is current, or have your CI run it during the build.

**Node.js server** (for the live `/api/docs` behaviour):

```bash
PORT=8080 node serve.js
```

Run it behind a reverse proxy (Nginx, etc.) or a process manager (systemd, PM2, or a container).
The server binds to all interfaces on `PORT` (default `8080`) and serves static files from the
project root, along with the `/api/docs` endpoint.

## Extending the Manual

### Adding a new topic

1. Create a new `.md` file anywhere under `docs/` (e.g. `docs/modules/my-module/my-topic.md`).
2. Start with a top-level heading, e.g.:

```markdown
# My Topic

Content here...
```

3. That's it — with `npm start` running, the file is detected automatically and appears in the
   navigation. To refresh the static manifest used by plain static hosting, run
   `npm run generate-manifest`.

### Adding a new chapter to the JS-rendered manual

1. Open `assets/js/chapters.js`
2. Add a new object to the `MANUAL_CHAPTERS` array:

```js
{
  id: 'my-chapter',         // Unique anchor ID
  label: 'My Chapter',      // Sidebar label
  icon: 'bi-star',          // Bootstrap Icon class
  group: 'Modules',         // Sidebar group heading
  content: `
    <h2 id="h-my-chapter">My Chapter</h2>
    <p>Content here...</p>
  `
}
```

The sidebar and navigation update automatically.

### Updating the text manual

Edit `docs/nuvision-user-manual.txt` directly. This is the source-of-truth
plain-text version for printing or distribution.

## Technology Stack

| Component      | Technology                  |
|----------------|-----------------------------|
| Runtime        | Node.js ≥ 18 (CommonJS)     |
| Server         | Node.js `http` module       |
| Framework      | Bootstrap 5.3 (CDN)         |
| Icons          | Bootstrap Icons 1.11 (CDN)  |
| Markdown       | marked.js 12.0.2 (CDN)      |
| Code highlight | Prism.js (CDN)              |
| Fonts          | System UI stack             |
| Tests          | Node.js built-in `node:test`|

---

© 2024 PEMVISH LLC · https://pemvish.com
