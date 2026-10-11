# Rename and publish the TRAYN prototypes

The local migration was executed and verified on 11 October 2026. The steps below retain the original migration procedure; do not rerun the source moves against the completed layout.

- Starting repository: `acoaria4/traynnutrition3`
- Starting folder: `G:\Programs\traynnutrition3`
- Previous site: commit `80ce629` (`Initial commit`)
- Current Under Tension site plus all three opening studies: commit `9d74a99`
- At inspection, `main` was clean and matched the local `origin/main` reference at `9d74a99`.

## Execution record

- Repository and local folder already used `trayn-nutrition-prototypes` when execution began.
- Created `codex/before-versioned-layout` at `9d74a99` and performed the migration on `main`.
- Restored all 56 archived v1 files from `80ce629` unchanged; moved all 112 current source files into v2 and retained this guide under `v2/docs/`.
- Added the root version chooser, repository README and ignore rules, and replaced the root workflow with the combined v1/v2 Pages deployment.
- Installed all three lockfiles; both source checks and all 15 unit tests passed. Both production builds passed under their final `/trayn-nutrition-prototypes/v1/` and `/trayn-nutrition-prototypes/v2/` prefixes.
- Browser hosting verification passed for both versions, covering routes, images, fonts, product selection, direct reloads, history navigation, 404 recovery and content without JavaScript. V2 static verification checked all four draft/comparison pages and 330 HTML/CSS references.
- Verified the assembled chooser, both product reloads, all three draft selectors and the root fallback at desktop (1440 px) and phone (390 px) widths. Validated the combined workflow YAML.
- Verification exposed two existing v2 issues: the study renderer failed to remove a multiline `noscript` fallback, and the hosting checker treated superseded iframe requests as missing assets. The renderer now removes the fallback; the checker waits for iframe content and verifies cancelled resources directly. These are the only changes to the preserved version source files.

Public deployment status is verified separately through GitHub Actions; successful local checks do not establish that the public URLs are live.

The intended result is one repository, one Pages deployment, and two independent source packages:

```text
trayn-nutrition-prototypes/
  .git/                         existing Git history
  .github/workflows/pages.yml   the active deployment workflow
  .gitattributes
  .gitignore
  README.md
  index.html                    version chooser
  v1/                           source snapshot from 80ce629
  v2/                           current complete project
    prototypes/openings/        all three original opening studies
  dist/                         combined build output; ignored
```

Both existing Vite configurations already accept nested `SITE_BASE_PATH` values. The packages must be built with different bases; moving source folders alone does not configure deployment.

## 1. Confirm the starting point and preserve a reference

Use PowerShell. Stop the site's development/preview servers before moving folders. Do not terminate unrelated Node processes.

```powershell
Set-Location -LiteralPath 'G:\Programs\traynnutrition3'
git status --short
git log --oneline -2
```

The first command should show no changes, and the newest commit should be `9d74a99`. This guide itself will appear as an untracked file if it has not been committed; that is expected and it will move into `v2/docs/`. If you have other changes, save and review them before proceeding.

Create a local recovery reference:

```powershell
git branch codex/before-versioned-layout 9d74a99
```

If the branch already exists, leave it in place. Do not force-reset it.

## 2. Rename the existing repository on GitHub

Open `https://github.com/acoaria4/traynnutrition3/settings`.

Under **General → Repository name**, change the name to:

```text
trayn-nutrition-prototypes
```

Click **Rename**. Keep the existing repository and its history; a second repository is unnecessary. If GitHub says the name is already taken, resolve that name conflict first.

GitHub redirects the old repository URL, but it does **not** redirect old project Pages URLs. The new Pages URL must be shared after deployment. See [GitHub's repository rename instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository).

## 3. Rename the local folder and update its remote

Close the project in editors if they hold the directory open. Use a separate PowerShell window from the parent directory:

```powershell
Set-Location -LiteralPath 'G:\Programs'
if (Test-Path -LiteralPath 'G:\Programs\trayn-nutrition-prototypes') {
  throw 'The destination folder already exists. Inspect it before continuing.'
}
Rename-Item -LiteralPath 'G:\Programs\traynnutrition3' -NewName 'trayn-nutrition-prototypes'
Set-Location -LiteralPath 'G:\Programs\trayn-nutrition-prototypes'
git remote set-url origin https://github.com/acoaria4/trayn-nutrition-prototypes.git
git remote -v
```

Reopen `G:\Programs\trayn-nutrition-prototypes` as the project in Codex/your editor. Renaming the folder does not rename Git branches, and `main` should remain the deployment branch.

## 4. Move the current project into v2

Run this once from the renamed root. It keeps `.git`, `.github`, and `.gitattributes` at the repository root. Everything else currently in the project, including its `.gitignore`, source, assets, drafts, documentation and local build folders, moves intact into `v2`.

```powershell
$ErrorActionPreference = 'Stop'
$traynRoot = 'G:\Programs\trayn-nutrition-prototypes'
if ((Get-Location).Path -ne $traynRoot) { throw 'Open the renamed project root first.' }
if (Test-Path -LiteralPath "$traynRoot\v2") { throw 'v2 already exists; do not rerun this move.' }
if (Test-Path -LiteralPath "$traynRoot\v1") { throw 'v1 already exists; inspect the migration state first.' }

$traynKeep = @('.git', '.github', '.gitattributes')
$traynItems = @(Get-ChildItem -LiteralPath $traynRoot -Force |
  Where-Object { $_.Name -notin $traynKeep })
$traynV2 = Join-Path $traynRoot 'v2'
New-Item -ItemType Directory -Path $traynV2 | Out-Null

foreach ($traynItem in $traynItems) {
  if ([IO.Path]::GetDirectoryName($traynItem.FullName) -ne $traynRoot) {
    throw 'A move source is outside the intended project root.'
  }
  Move-Item -LiteralPath $traynItem.FullName -Destination $traynV2
}
```

Do not move `.git` into either version. Git will recognize the source moves when the changes are staged.

## 5. Restore the original site into v1

Export the old commit into a separate folder without changing the current branch or reverting the current work:

```powershell
$traynArchive = Join-Path ([IO.Path]::GetTempPath()) ('trayn-v1-' + [guid]::NewGuid() + '.zip')
git archive --format=zip --output="$traynArchive" 80ce629
if ($LASTEXITCODE -ne 0) { throw 'Could not export the v1 commit.' }
Expand-Archive -LiteralPath $traynArchive -DestinationPath "$traynRoot\v1"
Remove-Item -LiteralPath $traynArchive
```

`v1` now contains the committed old source, including its own lockfile and `.gitignore`. Its archived `.github` folder is historical; only `.github/workflows/` at the repository root runs workflows. Keep v1's source unchanged for a faithful comparison.

## 6. Add root-level repository files and the version chooser

Create a new root `.gitignore` with the following contents. Keep both `v1/.gitignore` and `v2/.gitignore`: they exclude each version's generated HTML and local captures.

```gitignore
node_modules/
dist/
.cache/
.vite/
test-results/
playwright-report/
coverage/
*.log
.env
.env.*
!.env.example
!.env.*.example
.envrc
.secrets/
*.pem
*.key
*.p12
*.pfx
.DS_Store
Thumbs.db
Desktop.ini
.idea/
.vscode/
```

Do not copy the old `/index.html` ignore into this root file: the new root chooser is authored source and must be committed.

Create root `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>TRAYN Nutrition — Prototypes</title>
    <style>
      body { margin: 0; background: #111; color: #f2f0eb; font: 18px/1.6 system-ui, sans-serif; }
      main { max-width: 780px; margin: auto; padding: 64px 24px; }
      h1 { line-height: 1.1; font-size: clamp(36px, 8vw, 72px); }
      a { color: inherit; display: block; padding: 20px 0; border-bottom: 1px solid #555; }
      a:focus-visible { outline: 3px solid #e54848; outline-offset: 4px; }
      p { color: #bbb; }
    </style>
  </head>
  <body>
    <main>
      <p>TRAYN NUTRITION / DESIGN REVIEW</p>
      <h1>Choose a version.</h1>
      <p>Explore the original website, the selected direction, and the three opening studies.</p>
      <nav aria-label="Website versions">
        <a href="/trayn-nutrition-prototypes/v1/">V1 — Original website</a>
        <a href="/trayn-nutrition-prototypes/v2/">V2 — Under Tension</a>
        <a href="/trayn-nutrition-prototypes/v2/drafts/">Compare all three opening studies</a>
      </nav>
      <p>Design and packaging concepts. Not for sale.</p>
    </main>
  </body>
</html>
```

The explicit paths also work when this chooser is served as the deployment's root 404 page. These paths assume the standard GitHub Pages project URL, with no custom domain.

Create a root `README.md` that names the repository, links to the version chooser and both versions, identifies `80ce629` as the v1 source, and explains that the three opening studies remain under `v2/prototypes/openings/`. The earlier documentation remains under each version's `docs/` and `README.md`.

## 7. Replace the root Pages workflow

Replace `.github/workflows/pages.yml` with the following. It installs all three lockfiles, runs source/data checks, builds each version at its own URL prefix, and deploys one combined artifact.

```yaml
name: Deploy TRAYN prototype versions

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: github-pages
  cancel-in-progress: false

jobs:
  pages:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: '24'
          cache: npm
          cache-dependency-path: |
            v1/package-lock.json
            v2/package-lock.json
            v2/prototypes/openings/package-lock.json
      - name: Read Pages configuration
        id: pages
        uses: actions/configure-pages@v6
      - name: Install dependencies
        run: |
          npm ci --prefix v1
          npm ci --prefix v2
          npm ci --prefix v2/prototypes/openings
      - name: Check both versions
        run: |
          npm --prefix v1 run check
          npm --prefix v1 test
          npm --prefix v2 run check
          npm --prefix v2 test
      - name: Build both versions
        env:
          PAGES_BASE: ${{ steps.pages.outputs.base_path }}
        run: |
          SITE_BASE_PATH="${PAGES_BASE%/}/v1/" npm --prefix v1 run build
          SITE_BASE_PATH="${PAGES_BASE%/}/v2/" npm --prefix v2 run build
          SITE_BASE_PATH="${PAGES_BASE%/}/v2/" npm --prefix v2 run test:hosting:static
      - name: Assemble the Pages artifact
        run: |
          mkdir -p dist
          cp index.html dist/index.html
          cp index.html dist/404.html
          cp -R v1/dist dist/v1
          cp -R v2/dist dist/v2
          touch dist/.nojekyll
          test -f dist/v1/index.html
          test -f dist/v2/index.html
          test -f dist/v2/drafts/index.html
          test -f dist/v2/drafts/quiet.html
          test -f dist/v2/drafts/tension.html
          test -f dist/v2/drafts/flavour.html
      - name: Upload the combined website
        uses: actions/upload-pages-artifact@v5
        with:
          path: dist
          include-hidden-files: true
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v5
```

The root workflow must stay at the root. Do not choose a branch `/docs` publishing source for these unbuilt Vite packages. See [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## 8. Build and preview locally before pushing

From the renamed repository root, install using the three existing lockfiles:

```powershell
npm ci --prefix v1
npm ci --prefix v2
npm ci --prefix v2/prototypes/openings
npm --prefix v1 run check
npm --prefix v1 test
npm --prefix v2 run check
npm --prefix v2 test

$env:SITE_BASE_PATH = '/trayn-nutrition-prototypes/v1/'
npm --prefix v1 run build

$env:SITE_BASE_PATH = '/trayn-nutrition-prototypes/v2/'
npm --prefix v2 run build
npm --prefix v2 run test:hosting:static
```

Stop if any command fails. If the machine's npm launcher has the same issue observed during earlier development, run the CLI directly instead of each `npm` command: `node 'E:\nodejs\node_modules\npm\bin\npm-cli.js'` followed by the same arguments.

Preview each build in a separate terminal, using the matching environment value:

```powershell
# Terminal one, from the repository root
$env:SITE_BASE_PATH = '/trayn-nutrition-prototypes/v1/'
npm --prefix v1 run preview -- --port 4173
```

```powershell
# Terminal two, from the repository root
$env:SITE_BASE_PATH = '/trayn-nutrition-prototypes/v2/'
npm --prefix v2 run preview -- --port 4174
```

Check:

- `http://127.0.0.1:4173/trayn-nutrition-prototypes/v1/`
- `http://127.0.0.1:4174/trayn-nutrition-prototypes/v2/`
- `http://127.0.0.1:4174/trayn-nutrition-prototypes/v2/drafts/`

Try a product detail link, reload that direct link, and switch all three drafts. Check one desktop and one phone-sized viewport. Local previews do not prove that the future public deployment works.

## 9. Enable Pages, commit and push

On the renamed GitHub repository, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. Keep the current visibility unless you deliberately want to change it; Pages eligibility for a private repository depends on your GitHub plan.

Review the complete migration, including new source files:

```powershell
git status --short
git diff --stat
git add -A
git diff --cached --check
git diff --cached --stat
```

The staged changes should contain the two version source packages, the chooser, root README/ignore file and workflow. They should not contain `node_modules`, any `dist` folder, `.env`, caches or temporary screenshots. After that review:

```powershell
git commit -m "Organize TRAYN prototypes into v1 and v2"
git push origin main
```

Use the repository's normal Git sign-in flow if prompted. Do not force-push. If `main` has advanced remotely, reconcile those changes before pushing.

## 10. Verify the deployment and share the new URLs

In **Actions**, open **Deploy TRAYN prototype versions** and wait for the deployment step to succeed. If the workflow ran before Pages was enabled, enable Pages and rerun the failed workflow. Then visit:

| Destination | Expected URL after successful deployment |
| --- | --- |
| Version chooser | `https://acoaria4.github.io/trayn-nutrition-prototypes/` |
| V1 original site | `https://acoaria4.github.io/trayn-nutrition-prototypes/v1/` |
| V2 Under Tension | `https://acoaria4.github.io/trayn-nutrition-prototypes/v2/` |
| Three-draft comparison | `https://acoaria4.github.io/trayn-nutrition-prototypes/v2/drafts/` |
| Quiet Before | `https://acoaria4.github.io/trayn-nutrition-prototypes/v2/drafts/quiet.html` |
| Under Tension study | `https://acoaria4.github.io/trayn-nutrition-prototypes/v2/drafts/tension.html` |
| Flavour Study | `https://acoaria4.github.io/trayn-nutrition-prototypes/v2/drafts/flavour.html` |

Verify the chooser links, v1/v2 product pages and reloads, all draft selectors, packaging images, and the root fallback at a deliberately nonexistent URL. Share the chooser for general feedback, or the comparison URL for feedback on the three opening directions. These URLs are expected deployment destinations, not claims that the migration is already live.

The source versions retain their own product and concept disclosures. This migration changes organization and hosting paths, not the design or product claims.
