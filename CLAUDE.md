# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lotus × Bérard AIT is an Arabic-first (RTL) React application for a clinic offering Bérard Auditory Integration Training. Built with Vite + TypeScript.

## Commands

```bash
npm install    # Install dependencies
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## Environment Setup

Copy `.env.example` to `.env` and set the clinic phone number:
```bash
VITE_CLINIC_PHONE=+966XXXXXXXXX
```

## Architecture

### File Structure
- `src/App.tsx` - Main application component (lazy loads sections with Suspense)
- `src/components/` - Reusable UI components
  - `Header.tsx` - Navigation bar with mobile menu
  - `SlideViewer.tsx` - Slide presentation with search and modal (memoized cards)
  - `Checklist.tsx` - Interactive auditory processing checklist with PDF export (memoized items)
  - `GameSection.tsx` - Game cards (Coming Soon)
  - `ContactForm.tsx` - WhatsApp contact form with input validation
  - `styles.ts` - Shared style constants and objects
  - `index.ts` - Barrel export
- `src/utils/pdf.ts` - Shared PDF utilities (font caching, Arabic RTL text)
- `src/data/clinic.ts` - Clinic configuration (reads phone from env var)
- `src/vite-env.d.ts` - TypeScript types for Vite environment variables
- `public/fonts/` - Cairo Arabic font files for PDF generation

### Key Features
- **PDF Generation**: Uses jsPDF with custom Arabic font loading (shared `src/utils/pdf.ts`)
- **WhatsApp Integration**: Contact form submits via WhatsApp deep links with input sanitization
- **RTL Support**: Arabic text with right-to-left rendering in both UI and PDFs
- **Security**: CSP headers, input validation, no external CDN scripts
- **Performance**: Lazy loading, memoized components, font caching

### PDF Arabic Text Handling (`src/utils/pdf.ts`)
Shared utilities for proper Arabic PDF rendering:
- `createPdfDoc()` - Creates jsPDF instance with Arabic fonts loaded
- `writePdfText()` - Handles RTL text positioning and options automatically
- `PDF_MARGIN_X` - Standard margin constant
- Fonts are cached after first load for faster subsequent PDF generation
- Font files must exist at `/fonts/Cairo-Regular.ttf` and `/fonts/Cairo-Bold.ttf`

### Performance Optimizations
- **Lazy Loading**: SlideViewer, Checklist, GameSection, ContactForm loaded on demand
- **Memoization**: `React.memo` on SlideCard, ChecklistItem to prevent unnecessary re-renders
- **useCallback**: Event handlers wrapped to maintain referential equality
- **Font Caching**: Arabic fonts loaded once and reused across all PDF generations

### Input Validation (ContactForm)
- Name: 2-100 chars
- Phone: Saudi format `05XXXXXXXX`
- Purpose: 0-200 chars
- Message: 0-1000 chars
- All inputs sanitized (control characters removed)

## Deployment

Configured for GitHub Pages via GitHub Actions. Set `BASE_PATH` environment variable to `/<repo-name>/` for subpath deployments.

## Important Notes

- Set `VITE_CLINIC_PHONE` env var before production (app warns in dev if missing)
- Game section buttons are disabled with "Coming Soon" badges (games not yet implemented)
- All Arabic strings must use proper UTF-8 encoding to avoid mojibake
- CSP restricts scripts to 'self' only - no external CDNs