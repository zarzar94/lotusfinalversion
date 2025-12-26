# API_SPEC — ???? ?? ??????? ??? client

> ?????? ???????: `src/services/api.ts` + ??????? ?? `src/types/api.ts`.

## Base URL
- `VITE_API_URL` (???????: `http://localhost:3001/api`). `src/services/api.ts:39`
- ?????? ????? ???????? ??? `/api/*`. `backend/src/index.js:112`

## Authentication
- ????? ????/?????/????? ???? ??? `/auth/*`. `src/services/api.ts:305`
- ???????? ???? ?? LocalStorage: `lotus_auth_token`, `lotus_refresh_token`. `src/services/api.ts:39`
- ????? `Authorization: Bearer <token>` ??? ??? `fetchWithAuth` (??? `api.ts`). `src/services/api.ts:189`

## Endpoints (Used by Frontend)

### Auth
- `POST /auth/login` ? `LoginRequest` ? `LoginResponse`. `src/services/api.ts:305`, `src/types/api.ts:9`
- `POST /auth/register` ? `RegisterRequest` ? `RegisterResponse`. `src/services/api.ts:323`, `src/types/api.ts:22`
- `POST /auth/logout` (auth). `src/services/api.ts:337`
- `GET /auth/me` (auth) ? `ApiUser`. `src/services/api.ts:345`, `src/types/api.ts:49`
- `PATCH /auth/profile` (auth) ? `UpdateProfileRequest/Response`. `src/services/api.ts:354`, `src/types/api.ts:63`
- `DELETE /auth/account` (auth). `src/services/api.ts:361`
- `POST /auth/refresh` (refresh token). `src/services/api.ts:284`, `src/types/api.ts:37`

### Clinical
- `GET /clinical/progress` (auth) ? `ClinicalProgressResponse`. `src/services/api.ts:376`, `src/types/api.ts:79`
- `PATCH /clinical/progress` (auth) ? `UpdateClinicalProgressRequest`. `src/services/api.ts:381`, `src/types/api.ts:98`
- `POST /clinical/session/complete` (auth). `src/services/api.ts:388`
- `GET /clinical/history?startDate&endDate` (auth). `src/services/api.ts:394`

### Gamification
- `GET /gamification/state` (auth) ? `GamificationResponse`. `src/services/api.ts:409`, `src/types/api.ts:168`
- `PATCH /gamification/state` (auth) ? `UpdateGamificationRequest`. `src/services/api.ts:414`, `src/types/api.ts:150`
- `POST /gamification/achievements/:achievementId/unlock` (auth). `src/services/api.ts:421`
- `GET /gamification/leaderboard?type=global|clinic|school` (auth). `src/services/api.ts:427`

### Settings
- `GET /settings` (auth) ? `SettingsResponse`. `src/services/api.ts:438`, `src/types/api.ts:213`
- `PATCH /settings` (auth) ? `UpdateSettingsRequest`. `src/services/api.ts:443`, `src/types/api.ts:204`

### Sessions
- `POST /sessions` (auth) ? `SaveSessionRequest`. `src/services/api.ts:455`, `src/types/api.ts:243`
- `GET /sessions?limit&offset` (auth) ? `SessionsListResponse`. `src/services/api.ts:463`, `src/types/api.ts:257`
- `GET /sessions/:id` (auth) ? `SessionResponse`. `src/services/api.ts:467`, `src/types/api.ts:251`
- `DELETE /sessions/:id` (auth). `src/services/api.ts:471`
- `GET /sessions/analysis/patient?patientId&testKey` (auth) ? `SessionAnalysisResponse`. `src/services/api.ts:523`, `backend/src/routes/sessions.js:230`
- `GET /sessions/analysis/school?school` (auth) ? `SchoolSessionsAnalysisResponse`. `src/services/api.ts:489`, `src/types/api.ts:285`

### Sync
- `POST /sync` (auth) ? `SyncRequest/Response`. `src/services/api.ts:523`, `src/types/api.ts:393`
- `GET /sync/last` (auth). `src/services/api.ts:530`
- `conflicts[]` includes `field`, `resolution` (`local|server|merge`), `localUpdatedAt`, `serverUpdatedAt`. `src/types/api.ts:411`, `backend/src/routes/sync.js:407`
- Settings resolution uses `updatedAt` plus `lotus_language_updated_at` / `lotus_visitor_mode_updated_at` to pick local/server. `src/context/SyncContext.tsx:193`, `src/context/LanguageContext.tsx:99`, `src/context/VisitorModeContext.tsx:127`
- Clinical + gamification merge with union/max and return `merge` conflict when both sides changed. `backend/src/routes/sync.js:390`, `backend/src/routes/sync.js:432`

### Health
- `GET /health` (???? auth) ??? `healthCheck`. `src/services/api.ts:558`

## Backend-only endpoints (??? ??????? ?? ??????? ??????)
- `POST /sync/beacon` (??? ?????? ??? unload). `backend/src/routes/sync.js:554`
- `GET /clinical/patient/:patientId` (clinician/super_admin). `backend/src/routes/clinical.js:166`
- `/password/*`, `/upload/*`, `/admin/*`. `backend/src/index.js:114`

## RBAC/Scoping (Backend)
- ???? ???????? ????? ?? `authenticate` ?? ?????????. `backend/src/routes/clinical.js:12`, `backend/src/routes/sessions.js:12`
- ????? ????? ??????? ????? (????: patient progress). `backend/src/routes/clinical.js:166`
- `GET /sessions/analysis/patient`: clinician/super_admin, patient self, parent linked, school_admin with same school. `backend/src/routes/sessions.js:230`
- `GET /sessions/analysis/school`: school_admin (own school) or clinician/super_admin with explicit `school`. `backend/src/routes/sessions.js:265`

## Data Shapes (?????)
- `ApiUser`, `ClinicalProgress`, `GamificationState`, `UserSettings`, `AssessmentSession`, `SessionAnalysisResponse`, `SchoolSessionsSummary`, `SyncRequest/Response`. `src/types/api.ts:49`

## Response Conventions
- ???? ??????: `{ success: boolean, ... }` ?? `error` ??? ?????. `src/types/api.ts:306`




