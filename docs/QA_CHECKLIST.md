# QA_CHECKLIST — قبول يدوي وتشغيل محلي

## كيفية التشغيل محليًا
1) `npm install`
2) `npm run dev` (أو `npm run host` للهوست الخارجي).  
   - إذا نُشرت تحت مسار فرعي (مثلاً GitHub Pages)، اضبط `BASE_PATH` أو `VITE_API_URL` في `.env` أو أوامر التشغيل.  
3) للتحقق من الإنتاج: `npm run build` ثم `npm run preview`.
4) الخلفية (اختياري محليًا): `cd backend && npm install && npm run dev`، مع `VITE_API_URL=http://localhost:3001/api`.

## فحص المسارات والصفحات
- تأكد من فتح جميع المسارات العامة (`/`, `/assessment`, `/program`, `/science`, `/results`, `/partners`, `/resources`, `/faq`, `/contact`, `/about`, `/function/:slug`) دون أخطاء.
- تحقق من `/login` وعودة التوجيه إلى لوحات الأدوار بعد تسجيل دخول ديمو/فعلي.
- تحقق من `/parent-dashboard`, `/clinician-dashboard`, `/school-dashboard`, `/settings` مع تبديل اللغة ووضع الزائر.

## المودالات والنوافذ
- Modal اللغة الأولية يظهر في أول زيارة ويغلق بشكل صحيح.
- LoginModal من الهيدر يعمل (ترجمة AR/EN) ويتعامل مع أخطاء المصادقة.
- Interactive onboarding/WelcomeModal لا يمنع التصفح بعد الإغلاق.

## الألعاب والأصوات
- كل وحدة (attention, focused_attention, frequency, sequence, dichotic_listening, speech_in_noise, questionnaire) تبدأ وتنهي، وتنتج مقاييس/ملخص.
- تأكد من تشغيل/إيقاف الصوت حسب الإعدادات ومن عمل سماعة الرأس/إيقاف الضوضاء.
- تحقق من تسجيل الجلسة في localStorage (`SBLAB_SESSION_HISTORY`) بعد الانتهاء.

## العروض التقديمية والتحميلات
- SlideViewer يعرض الشرائح من `assets/pptx_slides/slide-XX.png` و`thumbs/`، ويصدّر PDF.
- روابط التحميل في `Resources`, `Checklist`, `QuickActionsPanel`, `ResultsSection` تعمل وتفتح ملفات `public/downloads`.

## التصدير (PDF/CSV)
- زر التصدير المخفي (ProgressExportButton) يستجيب لحدث `export-progress`.
- تقارير الأدوار: Parent/Clinician PDF + CSV الصف/الكامل (Educator) تعمل وتستخدم اللغة الحالية.
- تقارير الألعاب/الديمو (AssessmentSuiteModal، SequencingTestPanel) تنتج ملفات PDF/CSV بدون بيانات PII حقيقية.

## الأوفلاين والمزامنة
- أثناء قطع الاتصال، أرسل طلب PATCH/POST (مثلاً `settings` أو `clinical progress`) وتأكد من تخزينه في ‎`lotus_offline_queue`‎.
- عند إعادة الاتصال، يتم تفريغ الطابور تلقائيًا عبر `processOfflineQueue`؛ تحقق من عدم تكرار الإدخالات.
- تحقق من `/sync` بإرسال حمولة محلية (sessions + progress) ورصد حل النزاعات.
- Service Worker: إذا تم تسجيله يدويًا، تأكد من cache-first للأصول وnetwork-first للوحة المتصدرين.

## لوحات المتابعة والرسوم
- LongitudinalCharts تعرض الاتجاهات مع لغة ومحاذاة RTL صحيحة.
- بطاقات التحليلات في لوحات المدرسة/المعالج تظهر بيانات الديمو بدون تعارض في اللغة.
- مؤشرات التلعيب (AchievementToast, ProgressHUD) تعمل بعد إنهاء جلسة.

## الاستجابة وواجهة RTL
- تنقل الهيدر/الفوتر والـ CTA العائمة يعمل في الشاشات الصغيرة (≤375px).
- تأكد من قلب الاتجاه (dir=rtl/ltr) عند التبديل وألا تتكسر الهوامش/المحاذاة.

## إمكانية الوصول
- مؤشر التركيز مرئي في الأزرار والروابط.
- خيار تقليل الحركة (من الإعدادات) يوقف الأنيميشن الفارطة.
- حجم الخط "كبير" يطبق بشكل متناسق على العناوين والنصوص الطويلة.

## التحقق من الأصول
- شغّل `npm run qa:assets` وتأكد من مرور 120 فحصًا (57 شريحة + thumbs، ملفات PDF، خطوط Cairo، شعارات).

## قاعدة النشر (GitHub Pages / Nginx)
- تأكد من ضبط `BASE_PATH` لمطابقة المسار الفرعي، وأن `assetUrl()` يولّد روابط صحيحة (تحقق يدويًا من تحميل الصور/الخطوط بعد build+preview).
- تحقق من أن `index.html` يستخدم `lang="ar"` و`dir="rtl"` افتراضيًا وأن التحميل الأول لا يكسر تجربة EN.
