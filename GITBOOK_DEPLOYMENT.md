# GitBook Deployment Guide — NuVision User Manual

This document is the deliverable for the GitBook compatibility audit and deployment.
It contains: (1) the audit results, (2) the changes made, (3) step-by-step deployment
instructions, (4) configuration references, (5) success criteria, and (6) a deployment
checklist.

- **Repository root:** `/Users/deepakkumarc/work/pemvish/repos/userguide`
- **GitBook content root:** `./docs/`
- **Entry page:** `docs/README.md`
- **Navigation:** `docs/SUMMARY.md`
- **Config:** `.gitbook.yaml` (repo root)

---

## 1. Compatibility Audit Results

| Check | Result |
| --- | --- |
| `.gitbook.yaml` present & valid | **PASS** — created (root `./docs/`, readme `README.md`, summary `SUMMARY.md`) |
| Legacy `book.json` required | **N/A** — modern GitBook.com uses `.gitbook.yaml`; `book.json` is only for the deprecated `gitbook-cli` toolchain |
| `SUMMARY.md` valid & complete | **PASS** — 60 entries, 0 broken links |
| Every `.md` listed in `SUMMARY.md` | **PASS** — all 61 markdown files listed (Application_List.md added) |
| All internal links/images resolve | **PASS** — 0 broken references |
| Markdown encoding | **PASS** — UTF-8, no BOM, no CRLF, every page starts with a single `# H1` |
| GitBook `{% %}` template blocks | **PASS** — none present (no unsupported templating) |
| Asset linking | **PASS** — no inline `data:` URIs; images are real files with relative paths |
| Unsupported HTML | **PASS** — no raw HTML tags requiring special handling |
| Path characters | **PASS** — no spaces or special characters in file/folder names |

**Problem found and fixed:** `docs/modules/application-portfolio/Application_List.md`
was the only page missing from `SUMMARY.md`, and it was also the only file using
inline base64 `data:image/png;base64,…` images (an asset-linking anti-pattern that
bloats pages and is not portable). Both issues are now resolved.

---

## 2. Changes Made for GitBook Compatibility

1. **Created `.gitbook.yaml`** (repo root) — declares `./docs/` as the content root and
   points GitBook at `README.md` / `SUMMARY.md`. Without this, GitBook would look for the
   summary at the repository root and the build would fail to find navigation.
2. **Updated `docs/SUMMARY.md`** — added the missing entry so all content is reachable in
   the sidebar:
   ```markdown
   * [Application Portfolio Management](modules/application-portfolio/README.md)
     * [Application Inventory](modules/application-portfolio/application-inventory.md)
     * [Application List](modules/application-portfolio/Application_List.md)
     * [Rationalisation Scoring](modules/application-portfolio/rationalisation-scoring.md)
     * [Bulk Import](modules/application-portfolio/bulk-import.md)
   ```
3. **Extracted embedded base64 images** in `docs/modules/application-portfolio/Application_List.md`
   into real asset files (page size reduced from ~372 KB to ~4 KB):
   - `docs/modules/application-portfolio/images/saas-software-as-a-service-diagram.png`
   - `docs/modules/application-portfolio/images/cloud-services-iaas-paas-saas.png`

   References were rewritten to relative paths, e.g.
   `![SaaS diagram](images/saas-software-as-a-service-diagram.png)`.
4. **Regenerated the docs manifest** (`npm run generate-manifest`) so the Node tooling
   (`docs/manifest.json`, `assets/js/docs_manifest.js`) stays in sync with the new files —
   now 18 directories / 64 files / 82 items.

Non-markdown files inside `docs/` (`manifest.json`, `nuvision-user-manual.txt`, and the
`images/*.png` assets) are **safe for GitBook**: only files listed in `SUMMARY.md` are
published as pages, and GitBook does not render `.json`/`.txt` as pages. They are left in
place because the local Node server and manifest generator depend on those paths. The
`.png` files are linked from `Application_List.md` and therefore published as assets.

---

## 3. Deployment Prerequisites

| Requirement | Version / Notes |
| --- | --- |
| Node.js | `>= 18.0.0` (verified on `v20.18.2`) |
| npm | bundled with Node (verified `11.0.0`) |
| Git | any recent version |
| GitBook account | <https://app.gitbook.com> (free tier is sufficient) |
| Remote host | GitHub or GitLab repository |

> On this machine Node is not on `PATH` by default. Prefix commands with:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v20.18.2/bin:$PATH"
> ```

---

## 4. Deployment Instructions

### Step 1 — GitBook account and repository setup

1. Create/sign in to a GitBook account at <https://app.gitbook.com>.
2. Create an **empty** GitHub (or GitLab) repository, e.g. `nuvision-userguide`.
   Do **not** initialize it with a README — this project already has one.
3. In GitBook: **Create a new space → Sync with Git**.
4. Choose the Git provider (GitHub/GitLab), authorize GitBook, and select the repository
   and branch (e.g. `main`).
5. Set the **content root** if prompted. Because `.gitbook.yaml` already declares
   `root: ./docs/`, GitBook will detect the structure automatically after the first sync.
6. Save. GitBook will import once content is pushed (Step 4).

### Step 2 — Local configuration and validation

```bash
# From the repository root
export PATH="$HOME/.nvm/versions/node/v20.18.2/bin:$PATH"

# Install dependencies (none beyond the standard library are required)
npm install

# Regenerate navigation/manifest artifacts
npm run generate-manifest

# Run the functional test suite (must be 5/5 passing)
npm test
```

Expected test output ends with:
```
# tests 5
# pass 5
# fail 0
```

Also confirm the configuration file is present and correct:
```bash
cat .gitbook.yaml
```
```yaml
root: ./docs/
structure:
  readme: README.md
  summary: SUMMARY.md
```

### Step 3 — Git repository initialization and remote connection

The project is **not yet a Git repository**. Initialize and connect it:

```bash
# Initialize and set the default branch
git init
git branch -M main

# Connect to the remote (replace <your-org> and <your-repo>)
git remote add origin https://github.com/<your-org>/<your-repo>.git

# Stage the content and configuration
git add .gitbook.yaml docs/ assets/ scripts/ tests/ serve.js package.json package-lock.json .gitignore README.md
git status
```

> `.gitignore` already excludes `node_modules/`, logs, and caches. Never commit
> `node_modules/`.

Commit:
```bash
git commit -m "$(cat <<'EOF'
Add GitBook configuration and fix navigation/assets for GitBook compatibility

- Add .gitbook.yaml (content root: ./docs/)
- Add Application_List.md to SUMMARY.md navigation
- Extract inline base64 images into real asset files
EOF
)"
```

### Step 4 — Build verification and local preview testing

**A. Node.js dev server (project preview)**

```bash
npm start          # serves http://localhost:8080
# or a custom port:
PORT=9099 npm start
```

Verify these return the expected results:
| URL | Expected |
| --- | --- |
| `http://localhost:8080/` | `200 text/html` (the manual UI) |
| `http://localhost:8080/api/docs` | `200 application/json`, 82 items |
| `http://localhost:8080/docs/README.md` | `200` with markdown body |
| `http://localhost:8080/nope` | `404` |

**B. Optional — GitBook-compatible local render (legacy `gitbook-cli`)**

Only needed if you want to reproduce GitBook's own renderer locally. The legacy CLI
requires an **old** Node version (10.x/12.x) — it fails on Node 18+. Use a version
manager such as `nvm`:

```bash
nvm install 10.24.1 && nvm use 10.24.1
npm install -g gitbook-cli
cd docs
gitbook serve      # http://localhost:4000
gitbook build      # writes docs/_book/
```

> Recommended path: rely on GitBook.com's own preview (Step 5), which always uses the
> current renderer and needs no local toolchain.

### Step 5 — Deployment workflow and push

```bash
# Ensure the working tree is clean and tests pass
npm test
git status

# Push to the branch GitBook is syncing
git push -u origin main
```

GitBook detects the push and syncs automatically. For subsequent updates:

```bash
git add <changed files>
git commit -m "Describe the documentation change"
git push
```

If the GitHub repo already has commits and the push is rejected:
```bash
git pull --rebase origin main
git push
```
Do **not** force-push to `main`.

### Step 6 — Post-deployment validation

1. In GitBook, open the space and confirm the sync status shows **Synced** (no errors).
2. Confirm the sidebar shows the full table of contents (5 top-level sections, 60 entries).
3. Open the landing page — it must be `NuVision User Manual` from `docs/README.md`.
4. Open **Modules → Application Portfolio Management → Application List** and confirm both
   diagrams render (no broken-image icons).
5. Click through the Introduction / Modules / Configuration / Help sections and confirm all
   links resolve in-app (no 404s).
6. Use GitBook's **Share → Publish** (or set the space to public) if you need a public URL.
7. Re-verify `SUMMARY.md` and `README.md` exist and are the declared `structure` files.

### Step 7 — Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| GitBook shows **no navigation / empty sidebar** | `SUMMARY.md` not found | Confirm `.gitbook.yaml` has `root: ./docs/` and `structure.summary: SUMMARY.md` |
| GitBook imports the **wrong landing page** | It found the repo-root `README.md` (the Node project README) | Keep `root: ./docs/` so GitBook uses `docs/README.md` |
| **Broken image** in Application List | Image file not committed | `git add docs/modules/application-portfolio/images/` and push |
| **Broken link** between pages | Wrong relative path or a page not in `SUMMARY.md` | Add the page to `SUMMARY.md` and use paths relative to the current `.md` |
| `gitbook-cli` crashes with `natives` / `graceful-fs` errors | Legacy CLI on modern Node | Run it under Node 10/12, or use GitBook.com's preview instead |
| `npm test` fails / flaky | Test files mutate the shared `docs/` tree in parallel | Always run via `npm test` (pins `--test-concurrency=1`) |
| `command not found: node` | Node not on `PATH` | `export PATH="$HOME/.nvm/versions/node/v20.18.2/bin:$PATH"` |
| Push rejected (non-fast-forward) | Remote has newer commits | `git pull --rebase origin main` then push |
| GitBook sync stuck on **Importing** | Large/complex first import | Re-sync from the space settings; confirm the branch name matches |

---

## 5. Configuration Reference

`.gitbook.yaml` (current, minimal & valid):

```yaml
root: ./docs/

structure:
  readme: README.md
  summary: SUMMARY.md
```

Optional keys you can add later (commented example):

```yaml
# redirects:
#   old/page-path: new/page-path
#
# variables:
#   product: NuVision
```

`SUMMARY.md` structure (excerpt):

```markdown
# Summary
* [NuVision User Manual](README.md)

## Introduction
* [Platform Overview](introduction/platform-overview/README.md)
  * [What is NuVision](introduction/platform-overview/what-is-nuvision.md)

## Modules
* [Application Portfolio Management](modules/application-portfolio/README.md)
  * [Application Inventory](modules/application-portfolio/application-inventory.md)
  * [Application List](modules/application-portfolio/Application_List.md)
```

Rules followed:
- Every link in `SUMMARY.md` is relative to `docs/` and resolves to an existing file.
- Nested items use **2-space** indentation.
- Group headings use `##`; the root list uses a single top-level `*` entry.
- Every content page begins with exactly one `# H1`.

---

## 6. Success Criteria

The deployment is successful when **all** of the following hold:

- [ ] `npm test` reports **5 passing, 0 failing**.
- [ ] `.gitbook.yaml` exists at the repo root with `root: ./docs/`.
- [ ] `SUMMARY.md` lists every `.md` file (60 entries, 0 broken links).
- [ ] The local server returns `200` for `/`, `/api/docs`, and a sample `.md` page;
      `404` for unknown paths.
- [ ] GitBook shows the space as **Synced** with a complete sidebar.
- [ ] The landing page renders from `docs/README.md`.
- [ ] Both Application List diagrams render.
- [ ] No broken internal links or images anywhere in the published space.

---

## 7. Deployment Checklist

**One-time setup**
- [ ] GitBook account created and signed in.
- [ ] Empty GitHub/GitLab repository created (no initial commit).
- [ ] GitBook space created and connected via **Git Sync** to the repo + branch.

**Local configuration**
- [ ] Node `>= 18` available (`export PATH=…` if needed).
- [ ] `npm install` completed.
- [ ] `npm run generate-manifest` run (18 dirs / 64 files / 82 items).
- [ ] `.gitbook.yaml` present and correct.
- [ ] `SUMMARY.md` lists all 61 `.md` files.
- [ ] `npm test` → 5/5 passing.

**Repository & push**
- [ ] `git init` + `git branch -M main`.
- [ ] `git remote add origin <repo-url>`.
- [ ] `node_modules/` excluded via `.gitignore`.
- [ ] `git add` covers `.gitbook.yaml`, `docs/`, `assets/`, `scripts/`, `tests/`, `serve.js`,
      `package.json`, `package-lock.json`, `.gitignore`, `README.md`.
- [ ] Committed with a descriptive message.
- [ ] `git push -u origin main` succeeded.

**Verification**
- [ ] Node dev server preview OK (`/`, `/api/docs`, sample page, 404).
- [ ] GitBook sync shows **Synced**.
- [ ] Sidebar shows all 5 sections / 60 entries.
- [ ] Landing page = `docs/README.md`.
- [ ] Application List diagrams render.
- [ ] No broken links/images.
- [ ] Public sharing configured (if required).

**Ongoing updates**
- [ ] Edit markdown under `docs/`, add new pages to `SUMMARY.md`.
- [ ] Re-run `npm test`.
- [ ] `git commit` + `git push`; confirm GitBook re-syncs.
