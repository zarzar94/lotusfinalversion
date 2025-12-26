# API_SPEC — مشتق من استخدام الـ client

> المصدر الأساسي: `src/services/api.ts` + الأنواع في `src/types/api.ts`.

## Base URL
- `VITE_API_URL` (افتراضي: `http://localhost:3001/api`). `src/services/api.ts:39`
- الخادم يركّب المسارات تحت `/api/*`. `backend/src/index.js:112`

## Authentication
- تسجيل دخول/تسجيل/تجديد توكن عبر `/auth/*`. `src/services/api.ts:305`
- التوكنات تحفظ في LocalStorage: `lotus_auth_token`, `lotus_refresh_token`. `src/services/api.ts:39`
- إرسال `Authorization: Bearer <token>` يتم عبر `fetchWithAuth` (ضمن `api.ts`). `src/services/api.ts:189`

## Endpoints (Used by Frontend)

### Auth
- `POST /auth/login` → `LoginRequest` → `LoginResponse`. `src/services/api.ts:305`, `src/types/api.ts:9`
- `POST /auth/register` → `RegisterRequest` → `RegisterResponse`. `src/services/api.ts:323`, `src/types/api.ts:22`
- `POST /auth/logout` (auth). `src/services/api.ts:337`
- `GET /auth/me` (auth) → `ApiUser`. `src/services/api.ts:345`, `src/types/api.ts:49`
- `PATCH /auth/profile` (auth) → `UpdateProfileRequest/Response`. `src/services/api.ts:354`, `src/types/api.ts:63`
- `DELETE /auth/account` (auth). `src/services/api.ts:361`
- `POST /auth/refresh` (refresh token). `src/services/api.ts:284`, `src/types/api.ts:37`

### Clinical
- `GET /clinical/progress` (auth) → `ClinicalProgressResponse`. `src/services/api.ts:376`, `src/types/api.ts:79`
- `PATCH /clinical/progress` (auth) → `UpdateClinicalProgressRequest`. `src/services/api.ts:381`, `src/types/api.ts:98`
- `POST /clinical/session/complete` (auth). `src/services/api.ts:388`
- `GET /clinical/history?startDate&endDate` (auth). `src/services/api.ts:394`

### Gamification
- `GET /gamification/state` (auth) → `GamificationResponse`. `src/services/api.ts:409`, `src/types/api.ts:168`
- `PATCH /gamification/state` (auth) → `UpdateGamificationRequest`. `src/services/api.ts:414`, `src/types/api.ts:150`
- `POST /gamification/achievements/:achievementId/unlock` (auth). `src/services/api.ts:421`
- `GET /gamification/leaderboard?type=global|clinic|school` (auth). `src/services/api.ts:427`

### Settings
- `GET /settings` (auth) → `SettingsResponse`. `src/services/api.ts:438`, `src/types/api.ts:213`
- `PATCH /settings` (auth) → `UpdateSettingsRequest`. `src/services/api.ts:443`, `src/types/api.ts:204`

### Sessions
- `POST /sessions` (auth) → `SaveSessionRequest`. `src/services/api.ts:455`, `src/types/api.ts:243`
- `GET /sessions?limit&offset` (auth) → `SessionsListResponse`. `src/services/api.ts:463`, `src/types/api.ts:257`
- `GET /sessions/:id` (auth) → `SessionResponse`. `src/services/api.ts:467`, `src/types/api.ts:251`
- `DELETE /sessions/:id` (auth). `src/services/api.ts:471`
- `GET /sessions/analysis/patient?patientId&testKey` (auth) → `SessionAnalysisResponse`. `src/services/api.ts:482`, `backend/src/routes/sessions.js:230`
- `GET /sessions/analysis/school?school` (auth) → `SchoolSessionsAnalysisResponse`. `src/services/api.ts:489`, `src/types/api.ts:285`

### Sync
- `POST /sync` (auth) → `SyncRequest/Response`. `src/services/api.ts:482`, `src/types/api.ts:268`
- `GET /sync/last` (auth). `src/services/api.ts:490`

### Health
- `GET /health` (بدون auth) عبر `healthCheck`. `src/services/api.ts:518`

## Backend-only endpoints (غير مستخدمة من الواجهة حالياً)
- `POST /sync/beacon` (نقل بيانات عند unload). `backend/src/routes/sync.js:190`
- `GET /clinical/patient/:patientId` (clinician/super_admin). `backend/src/routes/clinical.js:166`
- `/password/*`, `/upload/*`, `/admin/*`. `backend/src/index.js:114`

## RBAC/Scoping (Backend)
- أغلب المسارات تُحمى بـ `authenticate` في الراوترات. `backend/src/routes/clinical.js:12`, `backend/src/routes/sessions.js:12`
- تفويض إضافي لمسارات حساسة (مثال: patient progress). `backend/src/routes/clinical.js:166`
- `GET /sessions/analysis/patient`: clinician/super_admin, patient self, parent linked, school_admin with same school. `backend/src/routes/sessions.js:230`
- `GET /sessions/analysis/school`: school_admin (own school) or clinician/super_admin with explicit `school`. `backend/src/routes/sessions.js:265`

## Data Shapes (مختصر)
- `ApiUser`, `ClinicalProgress`, `GamificationState`, `UserSettings`, `AssessmentSession`, `SessionAnalysisResponse`, `SchoolSessionsSummary`, `SyncRequest/Response`. `src/types/api.ts:49`

## Response Conventions
- أغلب الردود: `{ success: boolean, ... }` مع `error` عند الفشل. `src/types/api.ts:306`
