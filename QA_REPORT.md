# QA Report — Berard AIT Sound Lab (React + Vite)

**Project:** thenewproject_updated
**Focus:** Arabic-first, RTL, tech-forward “Sound Lab” design, full feature parity (slides + checklist + games + competitor comparison + school packages).

## 1) What was verified (automated)

### Asset & Path QA (✅ Pass)
Command:

```bash
node scripts/qa-assets.mjs
```

Result:
- ✅ Asset QA passed (**120 checks**) — confirms that key public assets exist and are where the code expects them.

Checks include:
- PPTX slide images: `public/assets/pptx_slides/slide-01.png` … `slide-57.png`
- PPTX thumbnails: `public/assets/pptx_slides/thumbs/thumb-01.jpg` … `thumb-57.jpg`
- Branding assets: `public/assets/images/brain_icon_44.png` + `public/assets/images/brain_logo.png`
- Downloads: `public/downloads/Check list (2).pdf` + `public/downloads/بروفايل برنامج بيرارد (1).pdf`
- PDF fonts: `public/fonts/Cairo-Regular.ttf` + `public/fonts/Cairo-Bold.ttf`

> Notes: TypeScript compile (`tsc`) requires `npm install` because `vite/client` types live in node_modules.

## 2) What was verified (code review)

### A) Navigation & Sections (anchors)
**Header links and section IDs** match:
- `#about` (Hero)
- `#overview` (ProgramOverview)
- `#results` (Results)
- `#pptx` (Slides viewer)
- `#checklist` (Checklist)
- `#games` (Games)
- `#comparison` (Competitor comparison)
- `#schools` (School packages)
- `#contact` (WhatsApp contact)

### B) PPTX viewer (57 slides)
Component: `src/components/SlideViewer.tsx`
- ✅ Thumbnails grid loads via `assetUrl()`
- ✅ Click thumbnail → opens modal with full slide image
- ✅ Next/Prev buttons work
- ✅ Keyboard support:
  - `Esc` closes modal
  - Arrow keys navigate (RTL-friendly mapping)
- ✅ Search filters slide list
- ✅ Exports a **Slides Text Summary PDF** (Arabic supported)
- ✅ Download button for program profile PDF

### C) Checklist (from your PDF)
Component: `src/components/Checklist.tsx`
Data: `src/data/checklistItems.ts`
- ✅ Arabic-first checklist categories + English optional
- ✅ Non-diagnostic disclaimer present
- ✅ “Indicator level” recommendation message
- ✅ Downloads:
  - Official PDF (original)
  - “Your selections” PDF generated from site

### D) Games (4 modes)
Component: `src/components/GameSection.tsx`

#### 1) Focus Game — “لعبة التركيز السمعي” (Hook)
- ✅ 10 rounds, tone→shape mapping
- ✅ Background noise increases by round
- ✅ **Fixed**: game now finishes correctly on the final round
- ✅ Results funnel mapping integrated
- ✅ Audio is triggered by user click (browser autoplay safe)

#### 2) Tone Matching — “مطابقة النغمة”
- ✅ 6 rounds
- ✅ Plays target tone + options
- ✅ Correctness and final result classification (high/medium/low)

#### 3) Classroom Simulation (School-facing)
- ✅ 8 rounds
- ✅ Spoken instruction + increasing classroom noise
- ✅ Records per-round dataset:
  - round, instruction, expected, chosen, correct, reaction time, noise level
- ✅ Exports:
  - CSV
  - PDF report (no names / demo-safe)

#### 4) Quiz — “اختبار المؤشرات”
- ✅ 5 questions
- ✅ Result classification and recommendation funnel

### E) Competitor Comparison
Component: `src/components/ComparisonSection.tsx`
- ✅ Includes: Tomatis, iLS, SSP, generic listening therapy
- ✅ Positions AIT clearly without making diagnostic claims

### F) School & University packages
Component: `src/components/SchoolPartnershipSection.tsx`
- ✅ 3 tiers: Low / Moderate / High
- ✅ UAE-friendly pricing ranges as placeholders
- ✅ CTA points to `#contact`

### G) Contact integration (WhatsApp)
Component: `src/components/ContactForm.tsx`
Utility: `src/utils/whatsapp.ts`
- ✅ Contact form opens WhatsApp with structured message
- ✅ Added floating WhatsApp button (FAB) for quick access:
  - `src/components/WhatsAppFab.tsx`
  - Mounted in `App.tsx`

**Important configuration:**
- Update the clinic WhatsApp number:
  - `VITE_CLINIC_PHONE` (recommended)
  - or edit `src/data/clinic.ts`

## 3) Arabic-first + RTL + Responsiveness

### RTL / Arabic
- ✅ `index.html` uses `dir="rtl" lang="ar"`
- ✅ Inputs that should be LTR (phone) are set to `dir="ltr"`

### Mobile responsiveness (expected)
- ✅ Grids use `auto-fit/minmax` patterns
- ✅ Modals use max widths; on small screens they remain usable

**Recommended manual checks (real devices):**
- iPhone Safari: audio + speech synthesis behavior
- Android Chrome: audio + downloads

## 4) Known limitations / real-world browser behavior

1) **Audio autoplay policies**
   - Audio must start after a user gesture. Games are designed this way.

2) **SpeechSynthesis variability**
   - Arabic voices differ by device/browser; user can always rely on on-screen text.

3) **Not diagnostic**
   - Site content is informational. Ensure staff messaging stays compliant.

## 5) Manual Acceptance Checklist (copy/paste)

### Slides
- [ ] Open `#pptx`
- [ ] Thumbnails load (no broken images)
- [ ] Slide modal opens, Next/Prev works, Esc closes
- [ ] Download “Slides Summary PDF” works

### Checklist
- [ ] Select 3–5 items
- [ ] Export “selected checklist PDF” works
- [ ] Official checklist PDF downloads

### Games
- [ ] Focus game finishes at round 10 and shows “انتهت اللعبة ✅”
- [ ] Tone matching finishes at round 6 and produces result
- [ ] Classroom sim exports PDF + CSV
- [ ] Quiz produces expected funnel CTA

### Contact
- [ ] Floating WhatsApp button opens chat
- [ ] Contact form opens WhatsApp with filled message

### Branding
- [ ] Purple brain icon in header
- [ ] Brand palette (purple/teal/magenta) consistent

