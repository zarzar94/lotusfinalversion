# ARD — Architecture & Requirements (Repo Reality)
هذا المستند يصف الوضع الفعلي للتطبيق في المستودع الحالي، مع تركيز عربي أول وإشارة واضحة إلى أن الواجهة والخلفية يمكن نشرهما كخدمتين منفصلتين.

## 1) مفهوم المنتج
- منصة Berard AIT عربية/إنجليزية تدمج محتوى تثقيفي، مختبر تقييمات سمعية (ألعاب)، لوحات تقدم حسب الدور، تلعيب، وتصدير PDF/CSV.
- البيانات الحساسة (التقدم السريري/التلعيب/الجلسات) قابلة للمزامنة مع API Express؛ إذا لم يكن الخادم متاحًا تستخدم التجربة تخزينًا محليًا وديمو.

## 2) البنية الحالية
- **Frontend**: React 18 + Vite + TypeScript. التوجيه في `src/App.tsx`، مزودات لغة/زائر/مستخدم/تلعيب، دعم `BASE_URL`/`BASE_PATH` للنشر تحت مسار فرعي.  
- **Backend**: Express + MongoDB داخل مجلد `backend/` (نماذج Users/ClinicalProgress/Gamification/Settings/Session، مسارات auth/clinical/gamification/settings/sessions/sync/admin/uploads). يمكن نشره كحاوية مستقلة خلف Nginx أو أي reverse proxy.
- **Service Worker**: ملف `public/sw.js` (cache-first للأصول، network-first محدود) موجود لكن غير مُسجّل في الواجهة؛ يتطلب تسجيلًا يدويًا عند الحاجة لـ PWA.
- **الأوفلاين**: طابور `lotus_offline_queue` في `src/services/api.ts`، تخزين تاريخ المختبر `SBLAB_SESSION_HISTORY`, مزامنة `/api/sync` و`/api/sync/beacon` لدمج البيانات.
- **النشر**: HTML أساسي يستخدم `lang="ar" dir="rtl"` افتراضيًا. `vite.config.ts` يسمح بتحديد `BASE_PATH`، والبناء يخرّج ملفات في `dist/`.

## 3) الأدوار وضبط الوصول
- الأدوار المتاحة: guest, patient, parent, clinician, school_admin, super_admin.
- مصفوفة الأذونات في الواجهة (`UserContext`) تغطي عرض/لعب/حفظ/تقارير أطفال أو مرضى/تحليلات المدرسة أو عالمية/ضبط النظام. الخلفية تطبّق RBAC عبر `authenticate` و`authorize`.
- علاقة ولي ↔ أطفال عبر حقل `children[]`، وحقول تنظيمية `clinic`/`school` للدعم المستقبلي في التحليلات.

## 4) المسارات الرئيسية (Frontend)
- عامة: `/`, `/home`, `/assessment`, `/program`, `/science`, `/results`, `/partners`, `/resources`, `/faq`, `/contact`, `/about`, `/function/:slug`.
- مصادقة: `/login`.
- لوحات: `/parent-dashboard`, `/clinician-dashboard`, `/school-dashboard`, مسارات تراثية `/dashboard/parent|clinician|educator`, صفحة `/settings`, ومسار 404 عام.

## 5) البيانات والوحدات
- **الوحدات**: attention, focused_attention, frequency, sequence, dichotic_listening, speech_in_noise, questionnaire, وطور suite تجميعي. المخرجات تشمل score100/band، مؤشرات التعب/التناسق، عتبات SNR/تردد، span، توازن الأذن، نقاط تلعيب.
- **نماذج الخلفية**: Users (مع أطفال/عيادة/مدرسة)، ClinicalProgress (درجات + جلسات + phase/streak), Gamification (نقاط/إنجازات/تقدم المحتوى), Settings (لغة/وضع زائر/إشعارات/عرض/خصوصية/صوت), Session (خريطة نتائج لكل اختبار).
- **التخزين المحلي**: `lotus_language`, `lotus_visitor_mode`, `lotus_user_state`, `lotus_clinical_progress`, `lotus_gamification_state`, `lotus_user_settings`, `lotus_auth_token`, `lotus_refresh_token`, `lotus_offline_queue`, `lotus_last_sync`, `lotus_pending_changes`, `berard-ait-sessions`, `SBLAB_SESSION_HISTORY`, إضافة مفاتيح إرشاد/جولة/تنبيهات.

## 6) الميزات الداعمة
- **التلعيب**: إنجازات، HUD، إشعارات فورية، تتزامن مع API أو تخزين محلي.
- **التقارير/التصدير**: jsPDF + CSV في `components/games/report.ts`, `components/dashboards/roleDashboardExports.ts`, `components/ProgressExport.tsx`, مع أصول قابلة للتنزيل في `public/downloads/`.
- **الشرائح/الوسائط**: `SlideViewer` يقرأ من `assets/pptx_slides` (57 شريحة + thumbs) ويمكن حفظ PDF.
- **الاتجاه واللغة**: `LanguageContext` يضبط dir/lang والخطوص، ويقدّم تبديلًا فوريًا (AR ↔ EN).

## 7) ملاحظات الجودة
- `npm run build` ينجح (بعد إزالة تكرار `@types/node` في `package.json`).  
- `npm run qa:assets` يمرّ (120 فحصًا للأصول).  
- `npm run typecheck` ينجح مع إبقاء `vitest.config.ts` داخل `tsconfig.json` باستخدام `@ts-nocheck` لتجنب تعارض أنواع Vite/Vitest مؤقتًا.  
- تم إصلاح خطأ JSON في `tsconfig.json` بإزالة تكرار `include`، مع تضييق `include` لتغطية ملفات الإعداد مع كتم فحص Vitest مؤقتًا.

## 8) متطلبات تشغيل/نشر
- FRONTEND: تعيين `BASE_PATH` عند النشر تحت مسار فرعي، و`VITE_API_URL` للإشارة إلى خدمة الخلفية.
- BACKEND: ضبط `CORS_ORIGIN/FRONTEND_URL`, `JWT_SECRET`, `MONGODB_URI`, مميزات البريد/الويب سوكيت اختيارية.
- يوصى بتسجيل Service Worker فقط بعد اختبار الأوفلاين، وربط لوحات الديمو ببيانات API حقيقية عبر مسارات sessions/clinical/gamification.
