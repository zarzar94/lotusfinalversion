# الحقيقة الأرضية للمستودع (Repo Ground Truth)

- المستودع: `lotusfinalversion`
- النطاق: واجهة React/Vite + خادم Express/Mongo داخل نفس المستودع (نشر منفصل)
- تم التوليد: 2025-12-26

## 1) نظرة عامة على الشجرة (مختصر)

### src/pages
`AboutPage.tsx`, `AssessmentPage.tsx`, `BrainFunctionPage.tsx`, `ClinicianDashboard.tsx`, `ContactPage.tsx`, `DebugSessionPage.tsx`, `EducatorDashboard.tsx`, `ExplorePage.tsx`, `FAQPage.tsx`, `LandingPage.tsx`, `LoginPage.tsx`, `NotFoundPage.tsx`, `ParentDashboard.tsx`, `PartnersPage.tsx`, `ProgramPage.tsx`, `ResourcesPage.tsx`, `ResultsPage.tsx`, `SciencePage.tsx`.

### src/components (أهم المجلدات)
- مجلدات: `about/`, `analytics/`, `assessment/`, `AudioJourney/`, `auth/`, `booking/`, `Brain3D/`, `dashboards/`, `games/`, `gamification/`, `intake/`, `navigation/`, `shared/`, `treatment/`.
- مكونات بارزة: `GameSection.tsx`, `SlideViewer.tsx`, `ReportsExport.tsx`, `ProgressExport.tsx`, `SmartNavigation.tsx`, `SmartEngagement.tsx`, `SettingsPage.tsx`.

### src/context
`DemoContext.tsx`, `GamificationContext.tsx`, `LanguageContext.tsx`, `SyncContext.tsx`, `TreatmentContext.tsx`, `UserContext.tsx`, `VisitorModeContext.tsx`.

### src/utils
`offlineQueue.ts`, `sessionStorage.ts`, `userStorage.ts`, `language.ts`, `pdf.ts`, `errorTracking.tsx`, `storage.ts`, `rtl.ts`.

### public/assets
- `assets/pptx_slides/` (57 شرائح + `thumbs/`).
- `assets/images/`, `assets/_logo/`.

### public/downloads
`berard-profile.pdf`, `AIT_LOGO 2022.pdf`, `Check list (2).pdf`, `بروفايل برنامج بيرارد (1).pdf`.

### backend/src
`routes/`, `models/`, `middleware/`, `utils/`, `index.js` (خادم Express كامل).

## 2) المسارات (Routes) — من `src/App.tsx`

| Route | Component | Auth? | Role? | Notes | Evidence |
| --- | --- | --- | --- | --- | --- |
| `/` | `LandingPage` | No | — | صفحة هبوط | `src/App.tsx:521` |
| `/home` | `LandingPage` | No | — | Alias | `src/App.tsx:529` |
| `/assessment` | `AssessmentPage` | No | — | معامل التقييم | `src/App.tsx:539` |
| `/program` | `ProgramPage` | No | — | برنامج العلاج | `src/App.tsx:549` |
| `/science` | `SciencePage` | No | — | العلم والبحث | `src/App.tsx:559` |
| `/results` | `ResultsPage` | No | — | النتائج | `src/App.tsx:569` |
| `/partners` | `PartnersPage` | No | — | الشراكات | `src/App.tsx:579` |
| `/resources` | `ResourcesPage` | No | — | الموارد | `src/App.tsx:589` |
| `/faq` | `FAQPage` | No | — | الأسئلة الشائعة | `src/App.tsx:599` |
| `/contact` | `ContactPage` | No | — | التواصل | `src/App.tsx:609` |
| `/about` | `AboutPage` | No | — | عن المركز | `src/App.tsx:622` |
| `/function/:slug` | `BrainFunctionPage` | No | — | تفاصيل وظيفة دماغ | `src/App.tsx:636` |
| `/login` | `LoginPage` | No | — | تسجيل الدخول | `src/App.tsx:646` |
| `/school-dashboard` | `SchoolDashboard` | Yes | `school_admin` | RoleGuard | `src/App.tsx:659` |
| `/parent-dashboard` | `ParentDashboard` | Yes | `parent` | RoleGuard | `src/App.tsx:669` |
| `/clinician-dashboard` | `ClinicianDashboard` | Yes | `clinician` | RoleGuard | `src/App.tsx:679` |
| `/dashboard/parent` | `ParentDashboard` | Yes | `parent` | مسار قديم | `src/App.tsx:691` |
| `/dashboard/clinician` | `ClinicianDashboard` | Yes | `clinician` | مسار قديم | `src/App.tsx:701` |
| `/dashboard/educator` | `SchoolDashboard` | Yes | `school_admin` | مسار قديم | `src/App.tsx:711` |
| `/settings` | `SettingsPage` | Yes | Any auth | RequireAuth | `src/App.tsx:721` |
| `*` | `NotFoundPage` | No | — | 404 | `src/App.tsx:735` |

ملاحظة: `ExplorePage.tsx` موجودة ولكن ليست مربوطة بمسار في الراوتر الحالي.

## 3) الأدوار والصلاحيات (RBAC)
- الأدوار: `guest`, `patient`, `parent`, `clinician`, `school_admin`, `super_admin`. `src/context/UserContext.tsx:9`
- مصفوفة الصلاحيات: `ROLE_PERMISSIONS`. `src/context/UserContext.tsx:88`

## 4) وحدات التقييم (7 وحدات)

| moduleId | اسم عربي | اسم إنجليزي | Evidence |
| --- | --- | --- | --- |
| `attention` | الانتباه | Attention | `src/components/games/types.ts:4`, `src/components/games/GamePortal.tsx:27` |
| `focused_attention` | الانتباه المُركَّز | Focused Attention | `src/components/games/types.ts:5`, `src/components/games/GamePortal.tsx:28` |
| `frequency` | تمييز التردد | Frequency | `src/components/games/types.ts:7`, `src/components/games/GamePortal.tsx:29` |
| `sequence` | التسلسل | Sequence | `src/components/games/types.ts:8`, `src/components/games/GamePortal.tsx:30` |
| `dichotic_listening` | الاستماع الثنائي | Dichotic Listening | `src/components/games/types.ts:9`, `src/components/games/GamePortal.tsx:31` |
| `speech_in_noise` | الكلام وسط الضجيج | Speech in Noise | `src/components/games/types.ts:10`, `src/components/games/GamePortal.tsx:32` |
| `questionnaire` | الاستبيان | Questionnaire | `src/components/games/types.ts:11`, `src/components/games/GamePortal.tsx:33` |

> الترتيب التشغيلي في شاشة الـ suite موثَّق في `AssessmentSuiteModal`. `src/components/games/AssessmentSuiteModal.tsx:40`

## 5) مخطط التخزين المحلي (LocalStorage/IndexedDB)

> ملاحظة: مفاتيح المستخدم المقيَّدة تستخدم نمط `baseKey:userId`. `src/utils/userStorage.ts:24`

| Key | الغرض | Writer (أول موقع) | Reader (أول موقع) |
| --- | --- | --- | --- |
| `lotus_user_state` | حفظ المستخدم المصادق | `src/context/UserContext.tsx:158` | `src/context/UserContext.tsx:119` |
| `lotus_clinical_progress` + `:userId` | تقدم سريري للمستخدم | `src/context/UserContext.tsx:167` | `src/context/UserContext.tsx:146` |
| `lotus_gamification_state` + `:userId` | حالة التلعيب | `src/context/GamificationContext.tsx:529` | `src/context/GamificationContext.tsx:437` |
| `lotus_user_settings` + `:userId` | إعدادات العرض/الخصوصية/الصوت | `src/components/SettingsPage.tsx:88` | `src/components/SettingsPage.tsx:78` |
| `lotus_language` | لغة الواجهة | `src/context/LanguageContext.tsx:80` | `src/utils/language.ts:6` |
| `lotus_visitor_mode` | وضع الزائر | `src/context/VisitorModeContext.tsx:122` | `src/context/VisitorModeContext.tsx:103` |
| `lotus_auth_token` | JWT access token | `src/services/api.ts:72` | `src/services/api.ts:68` |
| `lotus_refresh_token` | Refresh token | `src/services/api.ts:80` | `src/services/api.ts:76` |
| `lotus_offline_queue` + `:userId` | طابور أوفلاين (نسخة قديمة) | `src/services/api.ts:146` | `src/services/api.ts:110` |
| `lotus_offline_queue_db` (IndexedDB) | طابور الأوفلاين الحالي | `src/utils/offlineQueue.ts:13` | `src/utils/offlineQueue.ts:52` |
| `lotus_last_sync` | آخر مزامنة | `src/context/SyncContext.tsx:246` | `src/context/SyncContext.tsx:66` |
| `lotus_pending_changes` | عدّاد التغييرات | `src/context/SyncContext.tsx:116` | `src/context/SyncContext.tsx:76` |
| `berard-ait-sessions` + `:userId` | جلسات التقييم المجمعة | `src/components/games/scoring.ts:711` | `src/components/games/scoring.ts:732` |
| `SBLAB_SESSION_HISTORY` + `:userId` | سجل الجلسات التفصيلي | `src/utils/sessionStorage.ts:359` | `src/utils/sessionStorage.ts:367` |
| `lotus_demo_state` | حالة الديمو | `src/context/DemoContext.tsx:189` | `src/context/DemoContext.tsx:158` |
| `lotus_notifications` | إشعارات داخلية | `src/components/NotificationCenter.tsx:64` | `src/components/NotificationCenter.tsx:52` |
| `lotus_nav_history` | تاريخ التنقّل | `src/components/SmartNavigation.tsx:159` | `src/components/SmartNavigation.tsx:135` |
| `lotus_scroll_milestones` | نقاط التمرير | `src/components/SmartEngagement.tsx:205` | `src/components/SmartEngagement.tsx:59` |
| `lotus_celebrated` | معالم الاحتفال | `src/components/SmartEngagement.tsx:388` | `src/components/SmartEngagement.tsx:366` |
| `lotus_visited_pages` | الصفحات المُزارة | `src/components/JourneyProgressIndicator.tsx:96` | `src/components/JourneyProgressIndicator.tsx:87` |
| `lotus_visit_stats` | إحصاءات الزيارات | `src/components/PersonalizedGreeting.tsx:834` | `src/components/PersonalizedGreeting.tsx:825` |
| `lotus_engagement_streak` | سلسلة التفاعل | `src/components/PersonalizedGreeting.tsx:129` | `src/components/PersonalizedGreeting.tsx:86` |
| `lotus_trust_dismissed` | إخفاء شريط الثقة | `src/components/FloatingTrustBar.tsx:152` | `src/components/FloatingTrustBar.tsx:162` |
| `lotus_dismissed_hints` | تلميحات أُغلقت | `src/components/ContextualHint.tsx:356` | `src/components/ContextualHint.tsx:329` |
| `lotus_hint_<id>` | تلميح سياقي (ديناميكي) | `src/components/ContextualHint.tsx:66` | `src/components/ContextualHint.tsx:53` |
| `lotus_tour_completed` | إكمال الجولة | `src/components/InteractiveOnboarding.tsx:188` | `src/components/InteractiveOnboarding.tsx:163` |
| `lotus_welcome_shown` | شاشة الترحيب | `src/components/WelcomeModal.tsx:60` | `src/components/WelcomeModal.tsx:46` |
| `lotus_treatment_plan` | خطة العلاج | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_treatment_sessions` | جلسات العلاج | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_treatment_progress` | تقدم العلاج | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_patient_profile` | ملف المريض | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_bookings` | الحجوزات | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_reports` | تقارير العلاج | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_follow_up` | المتابعة | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_error_log` | سجل أخطاء الواجهة | `src/utils/errorTracking.tsx:215` | `src/utils/errorTracking.tsx:212` |
| `lotus_first_visit` | الزيارة الأولى | `src/context/LanguageContext.tsx:56` | `src/context/LanguageContext.tsx:55` |
| `__lotus_storage_test__` | اختبار توفر التخزين | `src/utils/storage.ts:11` | `src/utils/storage.ts:10` |

## 6) التصدير (PDF/CSV)
- PDF/CSV لتقارير التقييم: `downloadSessionPdf` و `downloadSessionCsv`. `src/components/games/report.ts:81`
- تقارير ولي الأمر/الأخصائي: PDF + CSV. `src/components/dashboards/roleDashboardExports.ts:20`
- تصدير تقدّم عام: `ProgressExport`. `src/components/ProgressExport.tsx:1`
- تصدير الشرائح: `SlideViewer` (PDF للشرائح/الملخص). `src/components/SlideViewer.tsx:794`

## 7) Service Worker / PWA
- تسجيل SW عند تحميل الصفحة. `src/main.tsx:31`
- `public/sw.js` يفعّل cache static + API ويعالج طابور الأوفلاين. `public/sw.js:1`

## 8) هيكل الأصول (Assets)
- شرائح العرض: `public/assets/pptx_slides/` + `thumbs/`. `public/assets/pptx_slides`
- ملفات تنزيل ثابتة: `public/downloads/`. `public/downloads`
- الخطوط: `public/fonts/` (Cairo). `public/fonts`

## 9) نتائج التحقق (Verification)
- `npm install`: ✅ (6 moderate vulnerabilities reported by npm audit).
- `npm run typecheck`: ✅
- `npm run build`: ✅
- `npm run qa:assets`: ✅ (120 checks)
