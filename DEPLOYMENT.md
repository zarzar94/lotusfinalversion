# Deployment - GitHub Pages + Notion Embed

## A) Build and verify locally
```bash
npm install
npm run qa:assets   # optional: verify public assets
npm run build
```
`vite.config.ts` uses `base: process.env.BASE_PATH || './'`, so static hosting works under a root or subpath when `BASE_PATH` is set.

## B) GitHub Pages (Actions workflow included)
1) Push to `main` (or trigger `workflow_dispatch`). Workflow: `.github/workflows/deploy.yml`.
2) The workflow runs `npm ci`, `npm run build`, and uploads `/dist` with `BASE_PATH` set to `/<repo-name>/`.
3) In GitHub Pages settings, pick **GitHub Actions** for build and deployment. The workflow publishes automatically.

Notes:
- If you rename the repo or use a custom domain, update `BASE_PATH` accordingly or leave it empty for root hosting.
- Keep `public/fonts/` bundled so PDFs render Arabic text.

### Private repo workaround (public deploy-only repo)
If GitHub Pages is not available for your private source repo, deploy only the built `/dist` output to a separate **public** repo and enable Pages there.

Example (deploy repo created for this project):
- Repo: `https://github.com/zarzar94/lotusfinalversion-site`
- Pages: `https://zarzar94.github.io/lotusfinalversion-site/`

Deploy from your source repo:
```powershell
# Build with the deploy repo name as the base path
$env:BASE_PATH = "/lotusfinalversion-site/"
npm run build

# Copy dist -> deploy repo checkout, then commit + push
$deploy = "..\\lotusfinalversion-site"
Get-ChildItem -Force $deploy | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
Copy-Item -Path .\\dist\\* -Destination $deploy -Recurse -Force
cd $deploy
git add -A
git commit -m "deploy: update site"
git push
```

## C) Manual gh-pages alternative
If you prefer a `gh-pages` branch:
```bash
npm run build
npx gh-pages -d dist -b gh-pages
```
Ensure `BASE_PATH` matches the published subpath.

Notes:
- `dist/assets/_commonjsHelpers-*.js` starts with `_` so you must publish with `.nojekyll` (included via `public/.nojekyll`).
- In GitHub Pages settings, switch **Build and deployment** to **Deploy from a branch** and select `gh-pages / (root)`.

## D) Notion embed
1) Deploy to a public URL (e.g., GitHub Pages).
2) In Notion: paste the URL and choose **Embed**.
3) The provided CSP allows embedding (`frame-ancestors` not locked down). If you add extra headers, avoid `X-Frame-Options: DENY` or `frame-ancestors 'none'`.

## E) WhatsApp configuration
Set environment variables before building:
```
VITE_CLINIC_PHONE=+9715XXXXXXXX   # required for WhatsApp CTA
VITE_CLINIC_EMAIL=info@example.com   # optional
```
