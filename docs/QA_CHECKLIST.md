# QA Checklist — Lotus AIT Platform

## تشغيل محلي (Local Run)
- `npm install`
- `npm run dev`
- تأكد من ضبط `VITE_API_URL` عند الحاجة. `src/services/api.ts:39`

## بناء ومعاينة (Build/Preview)
- `npm run build`
- `npm run preview`
- عند النشر تحت مسار فرعي، تأكد من `BASE_URL`/`BASE_PATH`. `src/App.tsx:23`

## المسارات العامة (Public Paths)
- `/`, `/home`, `/assessment`, `/program`, `/science`, `/results`, `/partners`, `/resources`, `/faq`, `/contact`, `/about`, `/function/:slug` تعمل بدون auth. `src/App.tsx:521`
- تحقق من 404 عبر مسار غير موجود. `src/App.tsx:735`

## المصادقة ولوحات التحكم (Auth/Dashboards)
- `/login` يعمل ويغلق/يفتح الـ modal بشكل صحيح. `src/App.tsx:646`
- RoleGuard على لوحات: `school_admin`, `parent`, `clinician`. `src/App.tsx:659`
- `/settings` يتطلب auth. `src/App.tsx:721`
## التحليلات (Analytics)
- Clinician/Parent: `GET /sessions/analysis/patient?patientId&testKey` يعيد trend. `backend/src/routes/sessions.js:230`
- School Admin: `GET /sessions/analysis/school` يعيد summary + module averages. `backend/src/routes/sessions.js:265`
- تأكد من ظهور توجه attention في المخططات الطويلة. `src/components/dashboards/LongitudinalCharts.tsx:238`

## الألعاب والتقييم (Assessment Suite)
- Headphone check يعمل قبل البدء، ثم الوحدات بالترتيب. `src/components/games/AssessmentSuiteModal.tsx:40`
- اختبارات الصوت تعمل عند التفاعل (AudioContext). `src/context/GamificationContext.tsx:514`

## التصدير (Exports)
- PDF/CSV لتقرير التقييم. `src/components/games/report.ts:81`
- تقارير Parent/Clinician. `src/components/dashboards/roleDashboardExports.ts:46`
- تصدير الشرائح PDF. `src/components/SlideViewer.tsx:794`

## i18n/RTL
- التبديل بين العربية/الإنجليزية يغير `dir/lang`. `src/context/LanguageContext.tsx:80`
- تحقق من RTL في الشاشات الحرجة (dashboards + tables + modal).

## Offline + Sync
- تحقق من queue عند فقد الاتصال ثم استعادته. `src/services/api.ts:181`, `public/sw.js:56`
- تحقق من `SyncContext` عند إعادة الاتصال. `src/context/SyncContext.tsx:93`
## بيانات Seed (Smoke Test)
- `npm run seed` يضيف Lotus School ويربط parent->patient. `backend/src/utils/seed.js`
- الجلسات المولدة تشمل outcomes + scoreLabel + score100 للتحليلات. `backend/src/utils/seed.js`
- حسابات الاختبار: admin/clinician/school_admin/parent/patient (شاهد مخرجات seed).

## PWA/Service Worker
- `sw.js` يُسجَّل عند load. `src/main.tsx:31`
- cache static يعمل للخطوط والأصول. `public/sw.js:10`

## Mobile/Responsive
- صفحات النتائج/البرنامج/الموارد متجاوبة على الهاتف.
- التمرير/السلايدر والـ sticky CTA يعملان بشكل صحيح.

## QA Scripts
- `npm run typecheck`
- `npm run build`
- `npm run qa:assets`
