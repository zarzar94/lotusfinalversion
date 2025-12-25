# REPO_GROUND_TRUTH — Lotus AIT (Frontend + Backend)  
مصدر الحقيقة المحدث من الشيفرة الفعلية داخل المستودع. كل النقاط أدناه موثقة بدليل من الملفات الحالية.

## ملخص سريع
- **الواجهة (Vite + React 18 + TypeScript)**: التوجيه في `src/App.tsx` مع مزودات اللغة/الزائر/المستخدم/التلعيب؛ يدعم ‎`BASE_URL`‎/‎`BASE_PATH`‎ للـ RTL/LTR ونشر GitHub Pages.【F:src/App.tsx†L498-L737】
- **الخلفية (Express + MongoDB)** موجودة تحت `backend/` وتقدم مصادقة، تقدمًا سريريًا، تلعيبًا، جلسات، مزامنة، وإدارة.【F:backend/src/index.js†L6-L82】【F:backend/src/routes/index.js†L5-L11】
- **وضع عربي أول**: اللغة الافتراضية AR، التحكم في ‎`dir`‎/‎`lang`‎ وتبديل فوري عبر `LanguageContext`.【F:src/context/LanguageContext.tsx†L33-L95】
- **تخزين محلي + أوفلاين**: مفاتيح ‎`lotus_*`‎ و‎`SBLAB_SESSION_HISTORY`‎، طابور طلبات أوفلاين في `src/services/api.ts`، وسياق مزامنة في `src/context/SyncContext.tsx`.【F:src/services/api.ts†L36-L124】
- **Service Worker** موجود كـ `public/sw.js` (شبكة أولاً للـ API المختارة، Cache-first للأصول) لكن لا يوجد تسجيل داخل React حتى الآن.【F:public/sw.js†L5-L130】

## هيكل الملفات المهم
- **src/pages**: Landing, Assessment, Program, Science, Results, Resources, Partners, Contact, About, FAQ, Login، لوحات `/parent-dashboard`، `/clinician-dashboard`، `/school-dashboard`.  
- **src/components** (أهم المجاميع): `games/`, `analytics/`, `dashboards/`, `gamification/`, `treatment/`, `navigation/`, `auth/`, `shared/`, `assessment/`, `intake/`.  
- **src/context**: `LanguageContext.tsx`, `VisitorModeContext.tsx`, `UserContext.tsx`, `GamificationContext.tsx`, `SyncContext.tsx`, `TreatmentContext.tsx`, `DemoContext.tsx`.  
- **src/utils**: `sessionStorage.ts` (تاريخ المختبر + ديمو)، `pdf.ts`, `asset.ts`, `audio.ts`, `labMetrics.ts`, `storage.ts`, `errorTracking.tsx`.  
- **src/services**: `api.ts` (عميل REST + طابور أوفلاين)، `apiSchema.ts`، `PDFReportGenerator.ts`.  
- **public/assets**:  
  - `assets/pptx_slides/slide-XX.png` و`assets/pptx_slides/thumbs/thumb-XX.jpg` لـ 57 شريحة (يتحقق منها qa:assets).  
  - `assets/images/brain_logo.png`, `brain_icon_44.png`, شعارات إضافية.  
- **public/downloads**: `Check list (2).pdf`, `berard-profile.pdf`, ملف شعار إضافي.  
- **public/fonts**: Cairo-Regular/Bold (يتم التخزين المسبق).  
- **public/sw.js**: سياسات التخزين المؤقت الموضحة أعلاه.

## قائمة المسارات (App Router)
| المسار | المكوّن | ملاحظات |
| --- | --- | --- |
| `/`, `/home` | `LandingPage` | تسويق/دعوات. |
| `/assessment` | `AssessmentPage` | مختبر الألعاب والفحص. |
| `/program` | `ProgramPage` | بروتوكول AIT. |
| `/science` | `SciencePage` | أدلة وبحوث. |
| `/results` | `ResultsPage` | نتائج وشهادات. |
| `/partners` | `PartnersPage` | شراكات المدارس. |
| `/resources` | `ResourcesPage` | فيديوهات/شرائح/FAQ. |
| `/faq` | `FAQPage` | أسئلة شائعة. |
| `/contact` | `ContactPage` | نماذج تواصل وحجز. |
| `/about` | `AboutPage` | نبذة عن المركز. |
| `/function/:slug` | `BrainFunctionPage` | محتوى تفصيلي. |
| `/login` | `LoginPage` | تسجيل دخول كامل الشاشة. |
| `/parent-dashboard`, `/dashboard/parent` | `ParentDashboard` | عرض وليّ الأمر/المريض. |
| `/clinician-dashboard`, `/dashboard/clinician` | `ClinicianDashboard` | للمعالجين. |
| `/school-dashboard`, `/dashboard/educator` | `SchoolDashboard` | لمشرفي المدارس. |
| `/settings` | `SettingsPage` | تفضيلات المستخدم. |
| `*` | `NotFoundPage` | 404. |
المصدر: `src/App.tsx`.【F:src/App.tsx†L515-L723】

## الأدوار والصلاحيات
- الأدوار المتاحة: guest, patient, parent, clinician, school_admin, super_admin (Frontend + Backend).【F:src/context/UserContext.tsx†L18-L35】【F:backend/src/models/User.js†L28-L47】
- مصفوفة الأذونات في `UserContext`: عرض المحتوى، اللعب، حفظ التقدم، تقارير ذاتية/أطفال/مرضى، تحليلات المدرسة/العالمية، وضبط النظام.【F:src/context/UserContext.tsx†L18-L103】
- نماذج العلاقات: `User.children` لربط ولي الأمر بالأطفال؛ `clinic` و`school` للربط التنظيمي.【F:backend/src/models/User.js†L31-L58】

## وحدات التقييم (games suite) ومعرّفاتها
- `attention`, `focused_attention`, `frequency`, `sequence`, `dichotic_listening`, `speech_in_noise`, `questionnaire`, إضافة وضع تجميعي `suite`. تظهر كبطاقات في `GameSection`.【F:src/components/GameSection.tsx†L752-L834】
- بيانات الديمو والتخزين في `src/utils/sessionStorage.ts` (مفتاح ‎`SBLAB_SESSION_HISTORY`‎).【F:src/utils/sessionStorage.ts†L5-L124】【F:src/utils/sessionStorage.ts†L220-L305】

## التخزين المحلي / الجلسات
- مفاتيح أساسية:  
  - اللغة والتوجيه: `lotus_language`, `lotus_first_visit`.【F:src/context/LanguageContext.tsx†L33-L85】  
  - حالة الزائر: `lotus_visitor_mode`.  
  - هوية المستخدم والتقدم السريري: `lotus_user_state`, `lotus_clinical_progress`.【F:src/context/UserContext.tsx†L110-L170】  
  - التلعيب: `lotus_gamification_state`.  
  - الإعدادات العامة: `lotus_user_settings`.  
  - الطوابير والأوفلاين: `lotus_auth_token`, `lotus_refresh_token`, `lotus_offline_queue`, `lotus_last_sync`, `lotus_pending_changes`, `berard-ait-sessions`.  
  - تاريخ المختبر: `SBLAB_SESSION_HISTORY` (مع دعم ديمو).【F:src/utils/sessionStorage.ts†L5-L124】  
  - جولات التجارب/المساعدة/التنبيهات: `lotus_welcome_shown`, `lotus_tour_completed`, `lotus_hint_*`, `lotus_notifications`, `lotus_nav_history`, `lotus_visited_pages`, `lotus_celebrated`, `lotus_engagement_streak`, `lotus_visit_stats`, `lotus_trust_dismissed`.  
  - علاج/حجوزات: `lotus_treatment_plan`, `lotus_treatment_sessions`, `lotus_treatment_progress`, `lotus_patient_profile`, `lotus_bookings`, `lotus_reports`, `lotus_follow_up`.

## التصدير والملفات القابلة للتنزيل
- **PDF/CSV لتقارير الألعاب**: `src/components/games/report.ts` مع مولدات jsPDF وتنزيل CSV.【F:src/components/games/report.ts†L1-L144】  
- **تصدير تقدم سريري**: `src/components/ProgressExport.tsx` (زر خفي يستمع لحدث `export-progress`).【F:src/App.tsx†L435-L445】  
- **تصدير لوحات الأدوار**: `src/components/dashboards/roleDashboardExports.ts` (تقارير PDF للأهل/المعالج، CSV للصف).  
- **حزم المدارس/التفسير**: `SchoolPartnershipSection` تدعم PDF/CSV للتفسير والديمو.  
- **عارض الشرائح**: `src/components/SlideViewer.tsx` يحفظ PDF من الشرائح/المحتوى.  
- **أصول جاهزة للتنزيل**: `public/downloads/*` وروابط في `Checklist`, `ResultsSection`, `QuickActionsPanel`.

## Service Worker / PWA
- ملف `public/sw.js` يطبق **cache-first للأصول** و**network-first محدد** لـ `/api/gamification/leaderboard`، مع تنظيف نسخ قديمة ودعم sync/push placeholders.【F:public/sw.js†L5-L130】
- لا يوجد تسجيل Service Worker في الواجهة (لا استدعاء ‎`navigator.serviceWorker.register`‎)، لذا النشر يحتاج تسجيل يدوي إذا لزم الأمر.

## الأصول والهيكل المتوقع
- 57 شريحة بامتدادي ‎`.png`‎ و`thumbs/*.jpg`؛ يتحقق منها `npm run qa:assets`.【F:scripts/qa-assets.mjs†L11-L44】
- شعارات أساسية ضمن `public/assets/images/`؛ خطوط Cairo في `public/fonts/`.  
- ملفات PDF جاهزة في `public/downloads/` (قائمة تحقق + بروفايل بيرارد).  
- `assetUrl()` يضمن أن المسارات تحترم ‎`BASE_URL`‎ في النشر الفرعي.【F:src/utils/asset.ts†L1-L10】

## نتائج الأوامر (آخر تشغيل)
- ✅ `npm install` (نجحت).  
- ✅ `npm run typecheck` — نجح مع إبقاء `vitest.config.ts` ضمن `tsconfig.json` باستخدام `// @ts-nocheck` لتفادي تعارض نسخ Vite/Vitest.  
- ✅ `npm run build` — نجح بدون تحذير مكرر بعد إزالة تكرار `@types/node` في `package.json`.  
- ✅ `npm run qa:assets` — جميع الأصول المطلوبة موجودة.

> ملاحظة: تم إزالة تكرار ‎`include`‎ سابقًا، وأُعيد تضمين `vitest.config.ts` مع `@ts-nocheck` لتجنب التعارض حتى يتم توحيد إصدارات Vite/Vitest. كما تم إزالة التكرار في `@types/node` لتجنب تحذيرات البناء.
