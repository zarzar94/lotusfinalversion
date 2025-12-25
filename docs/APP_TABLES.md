# APP_TABLES — Repo-derived tables

## 1) Routes
| Route | Page Component | Auth required? | Role required? | Notes |
| --- | --- | --- | --- | --- |
| `/`, `/home` | `LandingPage` | No | None | Public landing/alias.【F:src/App.tsx†L515-L530】 |
| `/assessment` | `AssessmentPage` | No | None | مختبر التقييمات.【F:src/App.tsx†L533-L541】 |
| `/program` | `ProgramPage` | No | None | وصف البروتوكول.【F:src/App.tsx†L543-L551】 |
| `/science` | `SciencePage` | No | None | بحث/أدلة.【F:src/App.tsx†L553-L560】 |
| `/results` | `ResultsPage` | No | None | شهادات/نتائج.【F:src/App.tsx†L563-L571】 |
| `/partners` | `PartnersPage` | No | None | شراكات مدارس.【F:src/App.tsx†L573-L580】 |
| `/resources` | `ResourcesPage` | No | None | فيديو/شرائح/FAQ.【F:src/App.tsx†L583-L590】 |
| `/faq` | `FAQPage` | No | None | أسئلة شائعة.【F:src/App.tsx†L593-L600】 |
| `/contact` | `ContactPage` | No | None | تواصل/حجز.【F:src/App.tsx†L603-L610】 |
| `/about` | `AboutPage` | No | None | عن المركز.【F:src/App.tsx†L616-L624】 |
| `/function/:slug` | `BrainFunctionPage` | No | None | محتوى وظيفي تفصيلي.【F:src/App.tsx†L630-L637】 |
| `/login` | `LoginPage` | No | None | شاشة تسجيل الدخول.【F:src/App.tsx†L640-L648】 |
| `/parent-dashboard`, `/dashboard/parent` | `ParentDashboard` | Yes (route guard) | Parent | Route-guarded access.【F:src/App.tsx†L662-L686】 |
| `/clinician-dashboard`, `/dashboard/clinician` | `ClinicianDashboard` | Yes (route guard) | Clinician | Route-guarded access.【F:src/App.tsx†L670-L694】 |
| `/school-dashboard`, `/dashboard/educator` | `SchoolDashboard` | Yes (route guard) | School Admin | Route-guarded access.【F:src/App.tsx†L654-L702】 |
| `/settings` | `SettingsPage` | Yes (route guard) | Any authenticated | Reads/writes local settings.【F:src/App.tsx†L704-L710】 |
| `*` | `NotFoundPage` | No | None | مسار 404.【F:src/App.tsx†L716-L723】 |

## 2) LocalStorage / sessionStorage schema
| Key | Purpose | Writer location | Reader location |
| --- | --- | --- | --- |
| `lotus_user_settings` | تفضيلات العرض/الصوت/الإشعارات وتطبيق تقليل الحركة | `SettingsPage` saves JSON.【F:src/components/SettingsPage.tsx†L51-L94】 | `App` applies reduced motion; `SettingsPage` loads.【F:src/App.tsx†L464-L476】【F:src/components/SettingsPage.tsx†L75-L84】 |
| `lotus_language` | حفظ اللغة وتحديث `dir/lang` | `LanguageProvider` sets on change.【F:src/context/LanguageContext.tsx†L62-L96】 | `LanguageProvider`/`App` read initial value.【F:src/context/LanguageContext.tsx†L62-L79】【F:src/App.tsx†L54-L65】 |
| `lotus_visitor_mode` | تفضيل وضع الزائر (school/parent/clinician) | `VisitorModeProvider` writes on change.【F:src/context/VisitorModeContext.tsx†L87-L123】 | `VisitorModeProvider` reads initial/URL override.【F:src/context/VisitorModeContext.tsx†L93-L118】 |
| `lotus_user_state` | تخزين جلسة المستخدم/الدور محليًا | `UserContext` saveUserState.【F:src/context/UserContext.tsx†L152-L158】 | `UserContext` loadUserState.【F:src/context/UserContext.tsx†L110-L138】 |
| `lotus_clinical_progress` | تقدم سريري محلي | `UserContext` save/remove.【F:src/context/UserContext.tsx†L160-L169】 | `UserContext` loadClinicalProgress.【F:src/context/UserContext.tsx†L140-L149】 |
| `lotus_auth_token` / `lotus_refresh_token` | رموز JWT | `api.ts` setToken/setRefreshToken.【F:src/services/api.ts†L45-L64】 | `api.ts` getToken/getRefreshToken/clearTokens.【F:src/services/api.ts†L45-L64】 |
| `lotus_offline_queue` | طابور طلبات POST/PATCH أثناء الأوفلاين | `api.ts` addToOfflineQueue/clear/process.【F:src/services/api.ts†L67-L120】 | `api.ts` getOfflineQueue/processOfflineQueue.【F:src/services/api.ts†L78-L120】 |
| `SBLAB_SESSION_HISTORY` | تاريخ جلسات المختبر المحلية | `sessionStorage.saveSession` writes list.【F:src/utils/sessionStorage.ts†L5-L124】 | `sessionStorage.getAllSessions` reads.【F:src/utils/sessionStorage.ts†L124-L151】 |
| `berard-ait-sessions` | جلسات علاج/ديمو للمزامنة | `SyncContext` merges local sessions to server payload.【F:src/context/SyncContext.tsx†L186-L225】 | `SyncContext` reads before sync.【F:src/context/SyncContext.tsx†L186-L225】 |
| `lotus_last_sync` / `lotus_pending_changes` | تتبع آخر مزامنة وعدد التغييرات | `SyncContext` persists sync timestamps/counter.【F:src/context/SyncContext.tsx†L49-L117】 | `SyncContext` initialises state from storage.【F:src/context/SyncContext.tsx†L58-L79】 |
| `lotus_welcome_shown` / `lotus_tour_completed` | إظهار الترحاب/الجولة مرة واحدة | `WelcomeModal` & `InteractiveOnboarding` set flags.【F:src/components/WelcomeModal.tsx†L23-L60】【F:src/components/InteractiveOnboarding.tsx†L152-L188】 | نفس المكونات تتحقق قبل العرض.【F:src/components/WelcomeModal.tsx†L46-L60】【F:src/components/InteractiveOnboarding.tsx†L163-L188】 |
| `lotus_gamification_state` | حالة التلعيب المحلية | `GamificationContext` persists state.【F:src/context/GamificationContext.tsx†L408-L535】 | `GamificationContext` loads initial state.【F:src/context/GamificationContext.tsx†L408-L483】 |
| `lotus_demo_state` | بيانات الديمو | `DemoContext` writes demo progress.【F:src/context/DemoContext.tsx†L78-L229】 | `DemoContext` loads on init.【F:src/context/DemoContext.tsx†L159-L189】 |
| `lotus_nav_history` | تاريخ الملاحة الذكي | `SmartNavigation` writes history.【F:src/components/SmartNavigation.tsx†L118-L159】 | `SmartNavigation` reads to build suggestions.【F:src/components/SmartNavigation.tsx†L118-L159】【F:src/components/SmartNavigation.tsx†L757-L776】 |
| `lotus_notifications` | إشعارات محلية | `NotificationCenter` save list.【F:src/components/NotificationCenter.tsx†L48-L64】 | `NotificationCenter` load on mount.【F:src/components/NotificationCenter.tsx†L48-L64】 |
| `lotus_trust_dismissed` | إخفاء شريط الثقة | `FloatingTrustBar` sets timestamp.【F:src/components/FloatingTrustBar.tsx†L152-L162】 | `FloatingTrustBar` reads on mount.【F:src/components/FloatingTrustBar.tsx†L152-L162】 |
| `lotus_hint_*` / `lotus_dismissed_hints` | تلميحات سياقية معطلة | `ContextualHint` writes per-key and list.【F:src/components/ContextualHint.tsx†L53-L87】【F:src/components/ContextualHint.tsx†L329-L356】 | `ContextualHint` reads to avoid إعادة العرض.【F:src/components/ContextualHint.tsx†L53-L87】【F:src/components/ContextualHint.tsx†L329-L356】 |
| `lotus_visited_pages` / `lotus_scroll_milestones` / `lotus_celebrated` | تتبع التفاعل | `SmartEngagement` updates flags.【F:src/components/SmartEngagement.tsx†L52-L388】 | `SmartEngagement` reads to gate الاحتفالات.【F:src/components/SmartEngagement.tsx†L52-L388】 |
| `lotus_error_log` | سجل أخطاء محلي | `errorTracking` appends logs.【F:src/utils/errorTracking.tsx†L212-L231】 | `errorTracking` reads for العرض/الإرسال.【F:src/utils/errorTracking.tsx†L212-L231】 |
| `__lotus_storage_test__` | فحص توفر التخزين | `storage.ts` writes/cleans أثناء check.【F:src/utils/storage.ts†L10-L24】 | `storage.ts` helper use.【F:src/utils/storage.ts†L6-L24】 |

## 3) Module IDs
| moduleId | Display name (AR) | Display name (EN) | Primary metrics | Export support |
| --- | --- | --- | --- | --- |
| suite | الاسم من الترجمات | Suite | RT, Accuracy, Threshold, Span | نعم (PDF/CSV).【F:src/components/GameSection.tsx†L752-L762】【F:src/components/games/report.ts†L81-L115】 |
| attention | الانتباه | Attention | RT, Accuracy | نعم (PDF/CSV).【F:src/components/GameSection.tsx†L764-L772】【F:src/components/games/report.ts†L81-L115】 |
| focused_attention | الانتباه المركز | Focused Attention | RT, Accuracy/Consistency | نعم (PDF/CSV).【F:src/components/GameSection.tsx†L773-L782】【F:src/components/games/report.ts†L81-L115】 |
| frequency | تمييز التردد | Frequency | Threshold Hz, Accuracy, RT | نعم (PDF/CSV).【F:src/components/GameSection.tsx†L783-L791】【F:src/components/games/report.ts†L81-L115】 |
| sequence | التسلسل | Sequence | Span, Accuracy, RT | نعم (PDF/CSV).【F:src/components/GameSection.tsx†L793-L801】【F:src/components/games/report.ts†L81-L115】 |
| dichotic_listening | الاستماع الثنائي | Dichotic Listening | Ear balance/Accuracy | نعم (PDF/CSV).【F:src/components/GameSection.tsx†L803-L811】【F:src/components/games/report.ts†L81-L115】 |
| speech_in_noise | الكلام وسط الضجيج | Speech in Noise | SNR Threshold, Accuracy | نعم (PDF/CSV).【F:src/components/GameSection.tsx†L813-L821】【F:src/components/games/report.ts†L81-L115】 |
| questionnaire | الاستبيان | Questionnaire | Score, Profile | نعم (PDF/CSV).【F:src/components/GameSection.tsx†L823-L832】【F:src/components/games/report.ts†L81-L115】 |
