# Deployment — GitHub Pages + Notion Embed

## A) Deploy to GitHub Pages (Vite + React)

### 1) Install & build
```bash
npm install
npm run build
```

### 2) Verify vite base path
This project uses `base: './'` in `vite.config.ts` which is suitable for GitHub Pages.

### 3) Typical GitHub Pages deployment options
#### Option 1: GitHub Actions (recommended)
- Enable GitHub Actions in your repo
- Use an Actions workflow to build and publish `/dist` to Pages

Example workflow: `.github/workflows/deploy.yml`
```yaml
name: Deploy to Pages
on:
  push:
    branches: [ main ]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

#### Option 2: gh-pages branch (manual)
- Use a package like `gh-pages` to publish `dist/` to `gh-pages` branch.

## B) Embed in Notion

### 1) After you deploy
Copy your GitHub Pages URL, e.g.:
- `https://<username>.github.io/<repo>/`

### 2) In Notion
- Paste the URL
- Choose **Embed**

### 3) Notes
- GitHub Pages typically allows embedding.
- If you see a blank frame, check:
  - Your site does not send `X-Frame-Options: DENY`
  - Your site does not set CSP `frame-ancestors 'none'`

## C) WhatsApp number configuration
Set your WhatsApp number as an environment variable for builds:

Create `.env`:
```bash
VITE_CLINIC_PHONE=9715XXXXXXXX
```

This ensures the WhatsApp CTA opens the correct clinic chat.
