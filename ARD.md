# Lotus Sound Lab / Berard AIT Platform — ARD

**ARD** here means **Architecture & Requirements Document** for the current repository implementation (frontend + backend).

**Repo**: `lotusfinalversion`  
**Frontend**: React 18 + Vite + TypeScript (`react-router-dom`)  
**Backend**: Node.js (Express) + MongoDB (Mongoose) — **lives in `backend/` inside this repo**  
**Last updated**: 2025-12-23  

---

## 1) Product Concept (What this platform is)

Lotus Sound Lab is a bilingual (Arabic-first with full English) web platform for **Berard Auditory Integration Training (AIT)** that combines:

1) **Public discovery**: explain AIT, science, program structure, results, partnerships, and contact/booking.
2) **In-browser screening lab**: interactive “assessment” games/tests that produce measurable outcomes.
3) **Progress tracking**: longitudinal session history, clinical progress signals, dashboards by role.
4) **Gamification**: achievements, levels, progress HUD, and engagement nudges.
5) **Reporting/exports**: PDF exports and content assets (slides/docs), plus optional sync to backend.

The repo includes both a **frontend** (production-ready build) and a **backend API** (auth, sessions, settings, progress, sync, uploads, admin).

---

## 2) System Architecture (High-level)

### 2.1 Frontend (Vite + React)

**Entry**
- `src/main.tsx` boots the app and applies reduced-motion preference before first render.
- `src/App.tsx` defines routing and global providers.

**Providers (global state)**
- `LanguageProvider` (`src/context/LanguageContext.tsx`): Arabic/English, RTL/LTR, translation helpers.
- `VisitorModeProvider` (`src/context/VisitorModeContext.tsx`): visitor “mode” (School/Parent/Clinician) influences content emphasis and CTAs.
- `UserProvider` (`src/context/UserContext.tsx`): authentication state, role, permissions, clinical progress.
- `GamificationProvider` (`src/context/GamificationContext.tsx`): achievements, points, exploration, engagement metrics.
- `ClinicalSync` hook (`src/hooks/useClinicalSync.ts`): synchronizes patient clinical progress between UserContext and GamificationContext.

**Routing**
- `BrowserRouter` with `basename` derived from `import.meta.env.BASE_URL` for subpath deployments (GitHub Pages / custom base paths).

### 2.2 Backend (Express + MongoDB) — located in `backend/`

**Server entry**
- `backend/src/index.js` mounts all API routes under `/api/*`, with:
  - security headers (`helmet`)
  - rate limiting (`express-rate-limit`)
  - CORS with credentials
  - CSRF double-submit cookie pattern
  - request timeouts + compression + sanitization
  - Swagger docs at `/api/docs`

**Core backend domain models**
- `backend/src/models/User.js`
- `backend/src/models/ClinicalProgress.js`
- `backend/src/models/Gamification.js`
- `backend/src/models/Settings.js`
- `backend/src/models/Session.js`

### 2.3 Offline-first + Sync Strategy

The frontend supports “offline-first” behavior in two layers:

1) **Local-first storage**: user state, settings, session history and lab metrics are stored in browser storage for immediate UX.
2) **Deferred writes**: `src/services/api.ts` queues non-GET requests when offline and replays them later.

Backend supports **cross-device sync** via:
- `/api/sync` (authenticated) for full sync
- `/api/sync/beacon` for “send on unload” payloads (accepts token in body)

### 2.4 Configuration & Environment Variables

Reference: `.env.example` (also includes the backend variables to copy into `backend/.env`).

**Frontend (Vite)**
- `VITE_API_URL` (default in code: `http://localhost:3001/api`) — backend base URL
- `VITE_WS_URL` — websocket URL (backend prints `ws://.../ws`, websocket implementation lives in `backend/src/utils/websocket.js`)
- `VITE_CLINIC_PHONE` / `VITE_CLINIC_EMAIL` — contact/WhatsApp configuration (used with `src/data/clinic.ts`)
- `VITE_ENABLE_OFFLINE_MODE` — enables local fallback behavior (API client already queues offline writes)
- `BASE_PATH` — Vite base path for subpath deployments (GitHub Pages)

**Backend (Express)**
- `PORT` — server port (default 3001)
- `MONGODB_URI` — Mongo connection
- `JWT_SECRET`, `JWT_REFRESH_SECRET`, expiry settings — auth tokens
- `FRONTEND_URL` / `CORS_ORIGIN` — CORS + email links
- SMTP settings — password reset emails and notifications
- `UPLOAD_DIR`, `MAX_FILE_SIZE` — upload service
- rate limit settings

---

## 3) User Roles, Permissions, and Relationships

### 3.1 Roles (current code)

Defined in both frontend and backend:

```ts
type UserRole =
  | 'guest'
  | 'patient'
  | 'parent'
  | 'clinician'
  | 'school_admin'
  | 'super_admin';
```

### 3.2 Permissions (frontend RBAC model)

Defined in `src/context/UserContext.tsx`:

```ts
type Permission =
  | 'view_content'
  | 'play_games'
  | 'save_progress'
  | 'view_own_reports'
  | 'view_child_reports'
  | 'view_patient_reports'
  | 'school_analytics'
  | 'global_analytics'
  | 'system_config';
```

Current permission mapping:

| Permission | guest | patient | parent | clinician | school_admin | super_admin |
|---|---:|---:|---:|---:|---:|---:|
| `view_content` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `play_games` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `save_progress` |  | ✓ | ✓ | ✓ | ✓ | ✓ |
| `view_own_reports` |  | ✓ | ✓ | ✓ | ✓ | ✓ |
| `view_child_reports` |  |  | ✓ |  |  | ✓ |
| `view_patient_reports` |  |  |  | ✓ |  | ✓ |
| `school_analytics` |  |  |  |  | ✓ | ✓ |
| `global_analytics` |  |  |  |  |  | ✓ |
| `system_config` |  |  |  |  |  | ✓ |

Important note: routes are not strictly blocked at the router level; the current UX relies on **UI gating** (permission checks) and role-aware navigation components. If you want hard route protection, add route guards around dashboard routes and/or enforce via backend permissions.

### 3.3 Relationships (data model intent)

Current explicit relationships:
- **Parent → Children**: `User.children: string[]` (frontend) / `children: ObjectId[]` (backend model ref to Users).

Common “organizational” fields used across roles:
- `User.clinic?: string`
- `User.school?: string`

Practical interpretation:
- **Patient**: has a `ClinicalProgress` document + `Gamification` + `Settings` + many `Session`s.
- **Parent**: may have `children` pointing to patient users.
- **Clinician**: can view a patient’s progress via `/api/clinical/patient/:patientId` (backend enforces `authorize('clinician', 'super_admin')`).
- **School Admin**: intended to view aggregate analytics for a school; dashboards exist in UI and backend has role support, but strict school scoping is not fully enforced in all endpoints.
- **Super Admin**: can manage users and audit logs via `/api/admin/*`.

---

## 4) Routes / Pages (Frontend)

Routes are defined in `src/App.tsx`.

### 4.1 Public routes (no login required)

| Path | Component | Purpose |
|---|---|---|
| `/` | `LandingPage` | Main marketing/discovery landing |
| `/home` | `LandingPage` | Alias |
| `/assessment` | `AssessmentPage` | Screening lab / tests |
| `/program` | `ProgramPage` | AIT protocol + timeline + remote protocol |
| `/science` | `SciencePage` | Research + neuroplasticity content |
| `/results` | `ResultsPage` | Outcomes, testimonials, evidence |
| `/partners` | `PartnersPage` | School partnerships / organizations |
| `/resources` | `ResourcesPage` | Slides/videos/resources + exports |
| `/faq` | `FAQPage` | FAQs |
| `/contact` | `ContactPage` | Contact + booking / lead capture |
| `/about` | `AboutPage` | Centre info + specialist profile |
| `/function/:slug` | `BrainFunctionPage` | Deep dive into a brain function topic |
| `*` | `NotFoundPage` | 404 |

### 4.2 Auth routes

| Path | Component | Purpose |
|---|---|---|
| `/login` | `LoginPage` | Full-page login (modal also exists) |

### 4.3 Dashboard routes (intended for authenticated users)

| Path | Component | Intended roles |
|---|---|---|
| `/parent-dashboard` | `ParentDashboard` | parent/patient |
| `/clinician-dashboard` | `ClinicianDashboard` | clinician |
| `/school-dashboard` | `SchoolDashboard` | school_admin |
| `/dashboard/parent` | `ParentDashboard` | legacy alias |
| `/dashboard/clinician` | `ClinicianDashboard` | legacy alias |
| `/dashboard/educator` | `SchoolDashboard` | legacy alias |
| `/settings` | `SettingsPage` | authenticated (any role) |

### 4.4 Page Composition (major sections per route)

This is the “concept map” for what each page is composed of today (based on `src/pages/*` imports).

- `/` (`LandingPage`): `Header`, `BackgroundFX`, `HeroCircuitBrain`, navigation cards, `ExperienceJourney`, `CredentialsBanner` (lazy), `Footer`, `WhatsAppFab`.
- `/assessment` (`AssessmentPage`): `Checklist` (lazy), `GameSection` (lazy) inside a “Screening Lab” layout.
- `/program` (`ProgramPage`): `ProgramOverview` + `TreatmentTimeline` + `RemoteProtocolSection` (all lazy).
- `/science` (`SciencePage`): `NeuroplasticitySection`, `AudioJourney`, `AudioSpectrumDemo` (lazy).
- `/results` (`ResultsPage`): `ResultsSection`, `TestimonialsSection`, `TrustSignals` (lazy).
- `/resources` (`ResourcesPage`): `SlideViewer`, `VideoSection`, `FAQSection` (lazy).
- `/partners` (`PartnersPage`): `SchoolPartnershipSection` + `PartnerLogos` (lazy).
- `/contact` (`ContactPage`): `IntakeForm` + `ContactForm` (lazy).
- `/about` (`AboutPage`): specialist profile + centre information (uses `src/data/specialist.ts`, and assets via `src/utils/asset.ts`).
- `/login` (`LoginPage`): hosts `LoginModal` full-screen and redirects on success.

Dashboards (role views) reuse shared blocks:
- `LongitudinalCharts` (`src/components/dashboards/LongitudinalCharts.tsx`) reads metrics from `src/utils/sessionStorage.ts`.
- Shared UI for dashboards lives in `src/components/shared/*` and `src/components/gamification/*`.

---

## 5) Core Workflows (Concept + Current Implementation)

This section documents the major “paths” users take through the platform. Think of them as **product workflows** rather than just routes.

### 5.1 Public discovery flow (guest user)

Goal: help visitors understand AIT and reach an action (contact/booking/demo).

Typical path:

```
Landing (/) 
  -> Select language (LanguageContext; first-visit selector)
  -> Select visitor mode (VisitorModeContext: school/parent/clinician)
  -> Explore key pages (program/science/results/partners/resources)
  -> CTA -> Contact (/contact?mode=...)
```

Key mechanics:
- Visitor mode changes CTA labels and prioritized sections (`src/context/VisitorModeContext.tsx`).
- Language toggles UI direction and translations (`src/context/LanguageContext.tsx`).

### 5.2 Assessment / screening flow

Goal: run quick screening experiences and export/share results.

Typical path:

```
/assessment
  -> run tests/games
  -> generate outcomes (module metrics)
  -> view summary / recommendations
  -> optional exports (PDF/CSV)
  -> optional login/register to save/sync
```

Storage and metrics:
- Lab module sessions/metrics are persisted in local storage (`src/utils/sessionStorage.ts`).
- Longitudinal analytics reads the stored sessions (`src/components/dashboards/LongitudinalCharts.tsx`).

### 5.3 Authentication + demo accounts

Goal: allow users to access role-relevant dashboards and saved progress.

Paths:
- Full-page: `/login` (LoginPage)
- Modal: `src/components/auth/LoginModal.tsx` (used by header/menu)

Demo behavior:
- Demo accounts are selectable in the login modal.
- If backend login fails/unavailable, UI falls back to local demo login (`loginDemo` in `src/context/UserContext.tsx`).

### 5.4 Patient workflow (clinical progress + gamification)

Goal: track sessions, view progress, and export reports.

Typical path:

```
Login -> patient role
  -> (optional) /assessment sessions
  -> sync clinical progress (UserContext <-> GamificationContext)
  -> view dashboards (ParentDashboard is commonly used for patient-style view)
  -> export progress report (ProgressExport)
  -> settings (reduced motion, contrast, audio)
```

Patient-specific mechanics:
- `clinicalProgress` tracked in `UserContext` and can be pulled from backend (`/api/clinical/progress`) when logged in and online.
- Achievements and “clinical streak” tracked in `GamificationContext`.
- Export: `src/components/ProgressExport.tsx` generates a PDF report.

### 5.5 Parent workflow (monitor one or more children)

Goal: see child progress trends, milestones, and recommended actions.

Typical path:

```
Login -> parent role
  -> /parent-dashboard
  -> select child
  -> review milestones + longitudinal metrics
  -> export/share report
```

Current implementation status:
- Dashboard UI is implemented with **mock child data** plus shared chart components.
- Backing model exists to link parent->children in backend (`User.children`), enabling future real data wiring.

### 5.6 Clinician workflow (monitor multiple patients)

Goal: review multiple patients, identify outliers, and manage follow-up.

Typical path:

```
Login -> clinician role
  -> /clinician-dashboard
  -> select patient
  -> review longitudinal charts + notes
  -> update clinical progress (future: write-back)
```

Backend capability:
- Clinician can fetch patient clinical progress via `/api/clinical/patient/:patientId` (role enforced).

Current UI status:
- Dashboard UI is implemented with **mock patient data**.

### 5.7 School admin workflow (aggregate school analytics)

Goal: track multiple students’ progress and cohort trends.

Typical path:

```
Login -> school_admin role
  -> /school-dashboard
  -> review cohort stats + weekly charts + student table
  -> export/share high-level insights
```

Current UI status:
- Dashboard UI is implemented with **mock cohort data**.

---

## 6) Feature Modules (What exists today)

This is a feature-oriented map of the codebase.

### 6.1 Internationalization (Arabic-first, English supported)

Core:
- `src/context/LanguageContext.tsx`: language state, direction, `t()` translation, RTL-aware helpers.
- `src/i18n/translations.ts`: translation dictionary (keys used throughout UI).

Behavior:
- First visit may show a language selector.
- `documentElement.dir/lang` updated on language change.

### 6.2 Visitor mode personalization (School/Parent/Clinician)

Core:
- `src/context/VisitorModeContext.tsx`

Behavior:
- Stores `lotus_visitor_mode` in localStorage.
- Supports deep links: `/contact?mode=school|parent|clinician`.
- Provides “section priority” ordering and mode-aware CTA configs.

### 6.3 Gamification (engagement + clinical milestones)

Core:
- `src/context/GamificationContext.tsx`
- UI surface: `src/components/GamificationUI.tsx`, `AchievementToast`, `AchievementNotification`, `ProgressHUD`, `ActivityFeed`, etc.

Tracks:
- points, levels, achievements
- exploration (brain regions), slides viewed, videos watched
- checklist completion, games completed
- clinical session progress and streak

### 6.4 Assessment Lab (games/tests + metrics)

Core areas:
- `src/pages/AssessmentPage.tsx`
- `src/components/games/*` and `src/components/assessment/*`
- local session history store: `src/utils/sessionStorage.ts`

Outputs:
- per-module metrics, a composite picture, and exports (PDF/CSV depending on tool).

### 6.5 Dashboards & longitudinal analytics

Core:
- `src/components/analytics/*Dashboard.tsx`
- `src/components/dashboards/LongitudinalCharts.tsx`
- shared UI: `src/components/shared/*`

Data sources (current):
- session history from `sessionStorage.ts` demo + local sessions
- mock role dashboards data (children/patients/students)
- `UserContext` clinical progress (real if API is wired and user is logged in)

### 6.6 Reporting & Export

Core:
- PDF helpers: `src/utils/pdf.ts`
- Progress export: `src/components/ProgressExport.tsx`
- Slides/content export: `src/components/SlideViewer.tsx`, `src/services/PDFReportGenerator.ts`

### 6.7 Contact / booking / lead capture

Core:
- `src/components/ContactForm.tsx`
- `src/components/WhatsAppFab.tsx`
- `src/pages/ContactPage.tsx`

Behavior:
- WhatsApp deep-link message is language-aware and uses clinic config (`src/data/clinic.ts`).
- Supports visitor mode query parameter to adapt messaging.

### 6.8 Settings / preferences

Frontend:
- `src/components/SettingsPage.tsx`
- stored in local storage (`lotus_user_settings`)

Backend:
- `/api/settings` GET/PATCH

Includes:
- language preference
- visitor mode preference
- notifications toggles
- display preferences (reduced motion, contrast, font size)
- privacy preferences
- audio preferences

---

## 7) Data Model & Storage

### 7.1 Frontend storage (not exhaustive)

Common keys:
- `lotus_language` (language selection)
- `lotus_visitor_mode` (visitor mode)
- `lotus_user_state` (cached user profile)
- `lotus_clinical_progress` (cached clinical progress)
- `lotus_auth_token` / `lotus_refresh_token` (API auth)
- `lotus_offline_queue` (queued API writes while offline)
- `SBLAB_SESSION_HISTORY` (screening lab session history)
- `lotus_user_settings` (UI settings: reduced motion etc.)

### 7.2 Backend entities (MongoDB)

**User**
- identity: `email`, `password` (hashed), `name`, optional `nameAr`
- role + org fields: `role`, `clinic`, `school`, `children[]`
- auth: `refreshToken`, password reset tokens

**ClinicalProgress**
- sessions completed, session dates
- key metrics: attentionScore, processingSpeed, auditoryDiscrimination
- treatmentPhase + streak + lastActivityDate

**Gamification**
- points, level
- arrays: achievements, exploredBrainRegions, slidesViewed, gamesCompleted, videosWatched
- audioJourneyProgress, scroll progress, time spent
- clinicalSessionsCompleted + clinicalStreak + treatmentPhase

**Settings**
- language, visitorMode
- notifications/display/privacy/audio preferences

**Session**
- outcomes: Map of test outcomes
- compositeResult, totalPoints, achievements, duration

### 7.3 Entity relationship overview

```
User (1) ── (1) ClinicalProgress
User (1) ── (1) Gamification
User (1) ── (1) Settings
User (1) ── (N) Session

Parent User ── (N) children[] ──> Patient Users
```

---

## 8) Backend API Surface (Current)

Mounted under `/api` (see `backend/src/index.js`).

### 8.1 Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout` (auth required)
- `GET /api/auth/me` (auth required)
- `PATCH /api/auth/profile` (auth required)

### 8.2 Password reset
- `POST /api/password/forgot`
- `GET /api/password/verify-token/:token`
- `POST /api/password/reset`
- `POST /api/password/change` (auth required)

### 8.3 Clinical progress
- `GET /api/clinical/progress`
- `PATCH /api/clinical/progress`
- `POST /api/clinical/session/complete`
- `GET /api/clinical/history`
- `GET /api/clinical/patient/:patientId` (clinician/super_admin)

### 8.4 Gamification
- `GET /api/gamification/state`
- `PATCH /api/gamification/state`
- `POST /api/gamification/achievements/:achievementId/unlock`
- `GET /api/gamification/leaderboard`

### 8.5 Settings
- `GET /api/settings`
- `PATCH /api/settings`

### 8.6 Sessions
- `POST /api/sessions`
- `GET /api/sessions`
- `GET /api/sessions/:sessionId`
- `DELETE /api/sessions/:sessionId`
- `GET /api/sessions/analysis/progress?testKey=...`

### 8.7 Sync
- `POST /api/sync` (auth required)
- `POST /api/sync/beacon` (token provided in payload)
- `GET /api/sync/last` (auth required)

### 8.8 Uploads
- `POST /api/upload/avatar`
- `POST /api/upload/document`
- `POST /api/upload/batch`
- `GET /api/upload/info/:filename`
- `DELETE /api/upload/:filename` (clinician/school_admin/super_admin)

### 8.9 Admin
- `GET /api/admin/stats` (clinician/super_admin)
- `GET /api/admin/users` (clinician/super_admin)
- `GET /api/admin/users/:id` (clinician/super_admin)
- `PATCH /api/admin/users/:id/role` (super_admin)
- `DELETE /api/admin/users/:id` (super_admin)
- audit/security endpoints (super_admin) in the remainder of `backend/src/routes/admin.js`

### 8.10 Frontend API client mapping

The frontend calls the backend through `src/services/api.ts`, which exports:
- `authApi` → `/auth/*` (login/register/me/profile/logout/refresh)
- `clinicalApi` → `/clinical/*`
- `gamificationApi` → `/gamification/*`
- `settingsApi` → `/settings`
- `sessionsApi` → `/sessions/*`
- `syncApi` → `/sync/*`

Implementation notes:
- `authApi.deleteAccount()` calls `DELETE /auth/account`, which **is implemented** in `backend/src/routes/auth.js`.

---

## 9) Design System & UI Structure

### 9.1 Design tokens

Centralized in `src/components/styles.ts` (and reused throughout):
- brand colors (cyan/purple/pink)
- semantic colors (success/warning/error/info)
- typography scale + weights
- spacing scale
- radius scale
- shadows and transitions
- chart performance bands

Global CSS:
- `src/styles/animations.css` for key animations and reduced-motion handling.

### 9.2 Layout primitives (common patterns)

You will see these repeatedly:
- glass/surface cards with gradients and subtle borders
- neon/gradient primary CTAs, outline secondary CTAs
- “lab HUD” accents: corner brackets, scanlines, status dots
- responsive grids for sections and stat cards

---

## 10) Repo Structure (Where things live)

### 10.1 Frontend (`src/`)

- `src/App.tsx`: routing + providers + global UI (gamification overlay, CTA)
- `src/pages/*`: top-level pages mapped to routes
- `src/components/*`: reusable UI + feature modules (games, dashboards, exports, etc.)
- `src/context/*`: global state containers (language, user, visitor mode, gamification)
- `src/services/*`: API client + PDF generator + schema/types
- `src/hooks/*`: sync hooks and UX hooks
- `src/utils/*`: storage helpers, PDF helpers, asset helpers, quality flags, etc.
- `src/types/*`: shared types for API and modules
- `src/data/*`: clinic config, checklist data, and content metadata

### 10.2 Backend (`backend/`)

- `backend/src/index.js`: express app bootstrap
- `backend/src/routes/*`: REST API endpoints
- `backend/src/models/*`: Mongoose schemas
- `backend/src/middleware/*`: auth/csrf/compression/validation
- `backend/src/utils/*`: db, email, swagger, websocket, auditing, caching

### 10.3 Build / QA / Test workflow (developer operations)

Frontend scripts (`package.json`):
- `npm run dev` / `npm run host` — Vite dev server
- `npm run build` / `npm run preview` — production build + preview
- `npm run typecheck` — TypeScript strict check (no emit)
- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- `npm run test` / `npm run test:run` / `npm run test:coverage` — Vitest
- `npm run test:e2e` — Playwright
- `npm run qa:assets` — validates required assets in `public/` (slides, PDFs, fonts)

Backend scripts (`backend/package.json`):
- `npm run dev` — nodemon `backend/src/index.js`
- `npm test` — Jest (node `--experimental-vm-modules`)
- `npm run lint` — ESLint for backend JS

---

## 11) Known “Implementation Notes” (Reality check)

1) **Dashboards currently use mock datasets** for many visualizations; wiring them to backend is a clear next step.
2) **RBAC is modeled**, but route-level protection is not strict (mostly UI gating).
3) **Offline-first behavior exists** (queued requests + local storage), and backend sync endpoints exist.
4) Existing architecture docs:
   - `src/PLATFORM_ARCHITECTURE.md` (visionary / broad)
   - `src/FEATURE_ARCHITECTURE.md` (feature-level architecture)
   Use this ARD as the “current implementation reference.”
