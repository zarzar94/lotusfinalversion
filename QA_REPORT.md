# QA Report - Berard AIT Sound Lab (React + Vite)

## Automated checks
- `npm run typecheck` - PASS (re-run).
- `npm run build` - PASS (re-run).
- `npm test` (backend) - PASS (6 suites, 17 tests).
- `npm run test:e2e` - PASS (125 tests, 55 skipped) - full Playwright matrix across Chromium, Firefox, WebKit, and mobile projects.
- `node scripts/qa-assets.mjs` - PASS (120 checks) - verifies slide images and thumbnails, downloads (`Check list (2).pdf`, `berard-profile.pdf`), fonts (`Cairo-Regular.ttf`, `Cairo-Bold.ttf`), and branding icons under `public/`.
- `VITE_E2E=true npm run test:e2e -- --project=chromium --grep "Seeded dashboard smoke"` - PASS (4 tests, re-run) - seeded auth, dashboards, analytics calls, and resources download.
- Playwright signature modal test (added to `seeded-dashboard-smoke.spec.ts`) - PASS (chromium, `--grep "signature modal"`).
- Seeded API smoke (auth + analytics endpoints) - PASS - `/api/sessions/analysis/children`, `/api/sessions/analysis/patients`, `/api/sessions/analysis/progress`, `/api/sessions/analysis/school`.

## Recommended manual checks
- Signature flows: Parent/Clinician dashboards, Assessment Suite summary, Progress Export, School Demo Pack - confirm signature modal opens, ink persists, and PDF exports include the signature (NOT RUN).
- Band tooltip (AR/EN): open any dashboard chart, verify the band explanation tooltip text matches translation in Arabic and English (NOT RUN).
- Slides: open `#pptx`; confirm thumbnails load, modal opens, arrow keys/PageUp/PageDown navigate, Esc closes, and "Slides Summary PDF" downloads.
- Checklist: select a few items, ensure counts and recommendation update, "Official PDF" link works, "Your selections" PDF exports with Arabic text rendered.
- Screening Lab: run each test (attention Go/No-Go, frequency 2IFC, sequencing demo, questionnaire) and the multi-test suite; confirm CSV/PDF exports download and include metrics; headphone check behaves as expected.
- CTA panels: finish Attention, Focused Attention, Frequency, Dichotic, Speech-in-Noise, Questionnaire, Sequencing and confirm the "Result saved" card shows, Close is present when available, and the summary layout is intact.
- Contact/WhatsApp: contact form validates phone, sends to WhatsApp with prefilled message; floating WhatsApp FAB opens chat; optional email/social links open correctly.
- Layout/RTL: header links scroll to anchors, mobile menu behaves, inputs needing LTR (phone) stay LTR, general responsiveness on phone and desktop.

## Notes / risks
- Browser autoplay rules: audio starts only after user interaction; test on iOS Safari and Android Chrome if possible.
- PDF generation relies on Cairo fonts in `public/fonts`; missing fonts fall back to Helvetica (weaker Arabic shaping).
- Set `VITE_CLINIC_PHONE` (and optional `VITE_CLINIC_EMAIL`) before production; otherwise contact copy defaults.
- For subpath hosting (GitHub Pages), ensure `BASE_PATH` is set; asset helper uses `import.meta.env.BASE_URL`.
