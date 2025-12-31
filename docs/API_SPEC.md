# API_SPEC � ???? ?? ??????? ??? client

> ?????? ???????: `src/services/api.ts` + ??????? ?? `src/types/api.ts`.

## Base URL
- `VITE_API_URL` (???????: `http://localhost:3001/api`). `src/services/api.ts:43`
- ?????? ????? ???????? ??? `/api/*`. `backend/src/index.js:115`

## Authentication
- ????? ????/?????/????? ???? ??? `/auth/*`. `src/services/api.ts:311`
- ???????? ???? ?? LocalStorage: `lotus_auth_token`, `lotus_refresh_token`. `src/services/api.ts:44`
- ????? `Authorization: Bearer <token>` ??? ??? `fetchWithAuth` (??? `api.ts`). `src/services/api.ts:241`

## Endpoints (Used by Frontend)

### Auth
- `POST /auth/login` ? `LoginRequest` ? `LoginResponse`. `src/services/api.ts:311`, `src/types/api.ts:9`
- `POST /auth/register` ? `RegisterRequest` ? `RegisterResponse`. `src/services/api.ts:328`, `src/types/api.ts:22`
- `POST /auth/logout` (auth). `src/services/api.ts:343`
- `GET /auth/me` (auth) ? `ApiUser`. `src/services/api.ts:351`, `src/types/api.ts:49`
- `PATCH /auth/profile` (auth) ? `UpdateProfileRequest/Response`. `src/services/api.ts:359`, `src/types/api.ts:64`
- `DELETE /auth/account` (auth). `src/services/api.ts:366`
- `POST /auth/refresh` (refresh token). `src/services/api.ts:288`, `src/types/api.ts:37`

### Clinical
- `GET /clinical/progress` (auth) ? `ClinicalProgressResponse`. `src/services/api.ts:382`, `src/types/api.ts:80`
- `PATCH /clinical/progress` (auth) ? `UpdateClinicalProgressRequest`. `src/services/api.ts:386`, `src/types/api.ts:99`
- `POST /clinical/session/complete` (auth). `src/services/api.ts:393`
- `GET /clinical/history?startDate&endDate` (auth). `src/services/api.ts:405`

### Gamification
- `GET /gamification/state` (auth) ? `GamificationResponse`. `src/services/api.ts:415`, `src/types/api.ts:169`
- `PATCH /gamification/state` (auth) ? `UpdateGamificationRequest`. `src/services/api.ts:419`, `src/types/api.ts:151`
- `POST /gamification/achievements/:achievementId/unlock` (auth). `src/services/api.ts:426`
- `GET /gamification/leaderboard?type=global|clinic|school` (auth). `src/services/api.ts:434`

### Settings
- `GET /settings` (auth) ? `SettingsResponse`. `src/services/api.ts:444`, `src/types/api.ts:214`
- `PATCH /settings` (auth) ? `UpdateSettingsRequest`. `src/services/api.ts:448`, `src/types/api.ts:205`

### Sessions
- `POST /sessions` (auth) ? `SaveSessionRequest`. `src/services/api.ts:461`, `src/types/api.ts:244`
- `GET /sessions?limit&offset` (auth) ? `SessionsListResponse`. `src/services/api.ts:468`, `src/types/api.ts:258`
- `GET /sessions/:id` (auth) ? `SessionResponse`. `src/services/api.ts:472`, `src/types/api.ts:252`
- `DELETE /sessions/:id` (auth). `src/services/api.ts:476`
- `GET /sessions/analysis/patient?patientId&testKey` (auth) ? `SessionAnalysisResponse`. `src/services/api.ts:505`, `backend/src/routes/sessions.js:831`
- `GET /sessions/analysis/school?school` (auth) ? `SchoolSessionsAnalysisResponse`. `src/services/api.ts:513`, `src/types/api.ts:380`

### Sync
- `POST /sync` (auth) ? `SyncRequest/Response`. `src/services/api.ts:524`, `src/types/api.ts:393`
- `GET /sync/last` (auth). `src/services/api.ts:531`
- `conflicts[]` includes `field`, `resolution` (`local|server|merge`), `localUpdatedAt`, `serverUpdatedAt`. `src/types/api.ts:411`, `backend/src/routes/sync.js:408`
- Sync retries gamification merges on optimistic concurrency errors and persists via `findOneAndUpdate` + `$set`. `backend/src/routes/sync.js:390`, `backend/src/routes/sync.js:419`
- Client-side sync calls are serialized per tab to avoid overlapping `POST /sync`. `src/context/SyncContext.tsx:95`
- Settings resolution uses `updatedAt` plus `lotus_language_updated_at` / `lotus_visitor_mode_updated_at` to pick local/server. `src/context/SyncContext.tsx:212`, `src/context/LanguageContext.tsx:100`, `src/context/VisitorModeContext.tsx:130`
- Clinical + gamification merge with union/max and return `merge` conflict when both sides changed. `backend/src/routes/sync.js:402`, `backend/src/routes/sync.js:447`

### Health
- `GET /health` (???? auth) ??? `healthCheck`. `src/services/api.ts:560`

## Backend-only endpoints (??? ??????? ?? ??????? ??????)
- `POST /sync/beacon` (??? ?????? ??? unload). `backend/src/routes/sync.js:554`
- `GET /clinical/patient/:patientId` (clinician/super_admin). `backend/src/routes/clinical.js:167`
- `/password/*`, `/upload/*`, `/admin/*`. `backend/src/index.js:116`

## RBAC/Scoping (Backend)
- ???? ???????? ????? ?? `authenticate` ?? ?????????. `backend/src/routes/clinical.js:14`, `backend/src/routes/sessions.js:13`
- ????? ????? ??????? ????? (????: patient progress). `backend/src/routes/clinical.js:167`
- `GET /sessions/analysis/patient`: clinician/super_admin, patient self, parent linked, school_admin with same school. `backend/src/routes/sessions.js:831`
- `GET /sessions/analysis/school`: school_admin (own school) or clinician/super_admin with explicit `school`. `backend/src/routes/sessions.js:871`

## Data Shapes (?????)
- `ApiUser`, `ClinicalProgress`, `GamificationState`, `UserSettings`, `AssessmentSession`, `SessionAnalysisResponse`, `SchoolSessionsSummary`, `SyncRequest/Response`. `src/types/api.ts:49`

## Response Conventions
- ???? ??????: `{ success: boolean, ... }` ?? `error` ??? ?????. `src/types/api.ts:433`




