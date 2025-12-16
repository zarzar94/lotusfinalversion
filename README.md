# Lotus × Berard AIT — Futuristic Sound Lab (React)

هذا مشروع **React (Vite + TypeScript)** مبني على نسخة الموقع النهائية **v5** مع:
- ✅ **دمج كل ميزات الموقع الحالية** (الألعاب، عارض الشرائح PPTX، قائمة التحقق، مقارنة البدائل، قسم المدارس… إلخ)
- ✅ **ثيم جديد “Futuristic Sound Lab”**: خلفية Spectrogram متحركة + أيقونات عائمة + لوحة فلترة صوتية تفاعلية
- ✅ واجهة **Arabic-first** و RTL
- ✅ جاهز للنشر كـ **Prototype** على GitHub Pages (مع Workflow جاهز)

> ملاحظة مهمة: للحفاظ على **عدم فقدان أي ميزة/تفصيل**، قمنا بدمج محتوى v5 بالكامل داخل React (LegacySite) وتحميل سكربت v5 بعد الرندر.  
> الخطوة التالية (اختيارية) هي تفكيك الأقسام تدريجيًا إلى React Components 100% بدون Legacy.

---

## التشغيل محليًا

1) ثبّت Node.js (يفضّل Node 20)
2) داخل مجلد المشروع:

```bash
npm install
npm run dev
```

---

## النشر على GitHub Pages (Prototype أثناء التطوير)

المشروع يحتوي Workflow جاهز في:
`.github/workflows/deploy.yml`

### الخطوات:
1) ارفع هذا المشروع إلى GitHub repo (مثلاً: `zarzar94/zazaza`)
2) من GitHub:
   - Settings → Pages
   - **Build and deployment** → اختر **GitHub Actions**
3) ادفع أي تعديل إلى فرع `main` وسيقوم GitHub Actions بـ:
   - build
   - نشر `dist` على Pages

> الـ Workflow يضبط `BASE_PATH` تلقائيًا إلى `/<repo-name>/` حتى تعمل الـ assets والروابط على GitHub Pages.

---

## إدراج الموقع في Notion

بعد نشر GitHub Pages والحصول على الرابط:
1) في Notion افتح الصفحة التي تريد
2) اكتب: `/embed`
3) الصق رابط GitHub Pages
4) Done ✅

---

## أين المحتوى والملفات؟

- ملفات الموقع (v5) المدمجة: `src/content/legacyBody.ts`
- سكربت v5: `public/legacy/v5.js`
- الأصول: `public/assets/...`
- ملفات تحميل إضافية:
  - `public/Check list (2).pdf` (لروابط النسخة v5)
  - `public/downloads/...` (PDF/PPTX إضافية)

---

## ملاحظات تقنية

- الخلفية Spectrogram تعمل حتى بدون تفعيل الصوت (محاكاة).  
- عند الضغط على “تفعيل صوت المختبر” يبدأ WebAudio (بما يوافق سياسات المتصفح).
- الألعاب والمودالات تعمل عبر سكربت v5 المدمج لضمان تطابق الوظائف بالكامل.

---

## التطوير القادم (إذا رغبت)

1) تحويل الأقسام الثقيلة تدريجيًا إلى React:
   - PPTX Viewer → React كامل
   - Checklist → React كامل
   - Games → React كامل (مع WebAudio مشترك)
2) فصل المحتوى إلى Notion CMS (اختياري) عبر Notion API

