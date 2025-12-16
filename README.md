# Lotus / Berard AIT Sound Lab (React + Vite)

Arabic-first, RTL landing/prototype for the Berard Auditory Integration Training (AIT) program. Built with Vite + TypeScript + React; includes an in-browser screening lab, PDF exports, and GitHub Pages deployment.

## Highlights
- 57-slide PPTX viewer with search/filter, modal preview, keyboard navigation, and a slides-summary PDF export. Assets load from `public/assets/pptx_slides` and downloads include `berard-profile.pdf`.
- Interactive checklist (Arabic + English labels) with recommendation messaging, official PDF download, and "your selections" PDF export (embeds Cairo fonts for RTL text).
- Screening Lab: attention Go/No-Go, frequency discrimination (adaptive 2IFC), sequencing demo, subjective questionnaire, and a multi-test suite with headphone check plus CSV/PDF export of results.
- Clinic contact via WhatsApp deep link, optional email link, and floating WhatsApp FAB. Phone defaults to `VITE_CLINIC_PHONE` but can be overridden.
- RTL-first UI, CSP locked to self-hosted assets (no external scripts), and BASE_URL-aware asset helper for GitHub Pages.

## Requirements
- Node.js 20+
- npm (ships with Node)
- Media assets merged (see "Media restore" below)

## Quick start
```bash
npm install
npm run dev
```
Visit the printed localhost URL. The app is RTL by default (`index.html` sets `dir="rtl"`).

## Scripts
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview the production build
- `npm run qa:assets` - verify required public assets (slides, fonts, PDFs)

## Environment
Create `.env` from `.env.example`:
```
VITE_CLINIC_PHONE=+9715XXXXXXXX
VITE_CLINIC_EMAIL=info@example.com   # optional override
```
Deployment under a subpath (e.g., GitHub Pages) uses `BASE_PATH` (see `vite.config.ts`). The GitHub Actions workflow already sets it to `/<repo-name>/`.

## Media restore
If assets are missing, merge the provided archives as noted in `README_MERGE_MEDIA.txt`:
1) Unzip `thenewproject_updated_CORE_v3.zip`
2) Unzip `thenewproject_updated_MEDIA_v3.zip` into the same folder (allow merge/overwrite)

Key expected files (checked by `npm run qa:assets`):
- Slides: `public/assets/pptx_slides/slide-01.png` ... `slide-57.png` and thumbs
- Downloads: `public/downloads/Check list (2).pdf`, `public/downloads/berard-profile.pdf`
- Fonts for PDF: `public/fonts/Cairo-Regular.ttf`, `public/fonts/Cairo-Bold.ttf`
- Branding: `public/assets/images/brain_icon_44.png`, `brain_logo.png`

## Project map
- `src/App.tsx` - layout + lazy-loaded sections
- `src/components/` - UI (SlideViewer, Checklist, GameSection, ComparisonSection, SchoolPartnershipSection, ContactForm, WhatsAppFab, BackgroundFX)
- `src/components/games/` - screening lab panels, reports, audio helpers
- `src/utils/pdf.ts` - jsPDF with embedded Cairo fonts + RTL text helper
- `src/utils/asset.ts` - BASE_URL-aware asset helper for GitHub Pages
- `src/data/` - clinic config, checklist items, PPTX metadata
- `.github/workflows/deploy.yml` - GitHub Pages build/publish

## Deployment
See `DEPLOYMENT.md` for GitHub Pages and Notion embed steps. Default Vite base is `./`; set `BASE_PATH` for subpath hosting. The included workflow builds on `main` and publishes `/dist` to Pages.

## QA
- Automated: `npm run qa:assets`
- Manual smoke (recommended): slides grid + modal + PDF export; checklist selections + "your selections" PDF; all screening tests (including suite exports); WhatsApp CTA/FAB opens chat; contact form LTR phone input behaves on mobile.

## Notion embed
After deployment, paste the live URL into Notion -> Embed. Ensure your hosting does not set `X-Frame-Options: DENY` or `frame-ancestors 'none'` (the provided CSP allows embedding).
