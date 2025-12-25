# APP_TABLES — جداول مستخرجة من الكود

## 1) Routes

| Route | Page Component | Auth? | Role? | Notes | Evidence |
| --- | --- | --- | --- | --- | --- |
| `/` | `LandingPage` | No | — | Landing | `src/App.tsx:521` |
| `/home` | `LandingPage` | No | — | Alias | `src/App.tsx:529` |
| `/assessment` | `AssessmentPage` | No | — | Assessment Suite | `src/App.tsx:539` |
| `/program` | `ProgramPage` | No | — | Program | `src/App.tsx:549` |
| `/science` | `SciencePage` | No | — | Science | `src/App.tsx:559` |
| `/results` | `ResultsPage` | No | — | Results | `src/App.tsx:569` |
| `/partners` | `PartnersPage` | No | — | Partners | `src/App.tsx:579` |
| `/resources` | `ResourcesPage` | No | — | Resources | `src/App.tsx:589` |
| `/faq` | `FAQPage` | No | — | FAQ | `src/App.tsx:599` |
| `/contact` | `ContactPage` | No | — | Contact | `src/App.tsx:609` |
| `/about` | `AboutPage` | No | — | About | `src/App.tsx:622` |
| `/function/:slug` | `BrainFunctionPage` | No | — | Brain detail | `src/App.tsx:636` |
| `/login` | `LoginPage` | No | — | Auth | `src/App.tsx:646` |
| `/school-dashboard` | `SchoolDashboard` | Yes | `school_admin` | RoleGuard | `src/App.tsx:659` |
| `/parent-dashboard` | `ParentDashboard` | Yes | `parent` | RoleGuard | `src/App.tsx:669` |
| `/clinician-dashboard` | `ClinicianDashboard` | Yes | `clinician` | RoleGuard | `src/App.tsx:679` |
| `/dashboard/parent` | `ParentDashboard` | Yes | `parent` | Legacy | `src/App.tsx:691` |
| `/dashboard/clinician` | `ClinicianDashboard` | Yes | `clinician` | Legacy | `src/App.tsx:701` |
| `/dashboard/educator` | `SchoolDashboard` | Yes | `school_admin` | Legacy | `src/App.tsx:711` |
| `/settings` | `SettingsPage` | Yes | Any auth | RequireAuth | `src/App.tsx:721` |
| `*` | `NotFoundPage` | No | — | 404 | `src/App.tsx:735` |

## 2) LocalStorage / IndexedDB Schema

> ملاحظة: مفاتيح المستخدم المقيَّدة تستخدم `baseKey:userId`. `src/utils/userStorage.ts:24`

| Key | Purpose | Writer | Reader |
| --- | --- | --- | --- |
| `lotus_user_state` | حفظ المستخدم المصادق | `src/context/UserContext.tsx:158` | `src/context/UserContext.tsx:119` |
| `lotus_clinical_progress` + `:userId` | تقدم سريري | `src/context/UserContext.tsx:167` | `src/context/UserContext.tsx:146` |
| `lotus_gamification_state` + `:userId` | حالة التلعيب | `src/context/GamificationContext.tsx:529` | `src/context/GamificationContext.tsx:437` |
| `lotus_user_settings` + `:userId` | إعدادات المستخدم | `src/components/SettingsPage.tsx:88` | `src/components/SettingsPage.tsx:78` |
| `lotus_language` | لغة الواجهة | `src/context/LanguageContext.tsx:80` | `src/utils/language.ts:6` |
| `lotus_visitor_mode` | وضع الزائر | `src/context/VisitorModeContext.tsx:122` | `src/context/VisitorModeContext.tsx:103` |
| `lotus_auth_token` | JWT token | `src/services/api.ts:72` | `src/services/api.ts:68` |
| `lotus_refresh_token` | Refresh token | `src/services/api.ts:80` | `src/services/api.ts:76` |
| `lotus_offline_queue` + `:userId` | طابور أوفلاين قديم | `src/services/api.ts:146` | `src/services/api.ts:110` |
| `lotus_offline_queue_db` | IndexedDB queue | `src/utils/offlineQueue.ts:13` | `src/utils/offlineQueue.ts:52` |
| `lotus_last_sync` | آخر مزامنة | `src/context/SyncContext.tsx:246` | `src/context/SyncContext.tsx:66` |
| `lotus_pending_changes` | تغييرات معلّقة | `src/context/SyncContext.tsx:116` | `src/context/SyncContext.tsx:76` |
| `berard-ait-sessions` + `:userId` | جلسات التقييم | `src/components/games/scoring.ts:711` | `src/components/games/scoring.ts:732` |
| `SBLAB_SESSION_HISTORY` + `:userId` | سجل مختبر | `src/utils/sessionStorage.ts:359` | `src/utils/sessionStorage.ts:367` |
| `lotus_demo_state` | حالة الديمو | `src/context/DemoContext.tsx:189` | `src/context/DemoContext.tsx:158` |
| `lotus_notifications` | إشعارات | `src/components/NotificationCenter.tsx:64` | `src/components/NotificationCenter.tsx:52` |
| `lotus_nav_history` | تاريخ التنقل | `src/components/SmartNavigation.tsx:159` | `src/components/SmartNavigation.tsx:135` |
| `lotus_scroll_milestones` | milestones التمرير | `src/components/SmartEngagement.tsx:205` | `src/components/SmartEngagement.tsx:59` |
| `lotus_celebrated` | احتفال milestones | `src/components/SmartEngagement.tsx:388` | `src/components/SmartEngagement.tsx:366` |
| `lotus_visited_pages` | صفحات مُزارة | `src/components/JourneyProgressIndicator.tsx:96` | `src/components/JourneyProgressIndicator.tsx:87` |
| `lotus_visit_stats` | إحصاءات زيارات | `src/components/PersonalizedGreeting.tsx:834` | `src/components/PersonalizedGreeting.tsx:825` |
| `lotus_engagement_streak` | streak التفاعل | `src/components/PersonalizedGreeting.tsx:129` | `src/components/PersonalizedGreeting.tsx:86` |
| `lotus_trust_dismissed` | إخفاء شريط الثقة | `src/components/FloatingTrustBar.tsx:152` | `src/components/FloatingTrustBar.tsx:162` |
| `lotus_dismissed_hints` | تلميحات مُغلقة | `src/components/ContextualHint.tsx:356` | `src/components/ContextualHint.tsx:329` |
| `lotus_hint_<id>` | تلميح سياقي | `src/components/ContextualHint.tsx:66` | `src/components/ContextualHint.tsx:53` |
| `lotus_tour_completed` | إكمال الجولة | `src/components/InteractiveOnboarding.tsx:188` | `src/components/InteractiveOnboarding.tsx:163` |
| `lotus_welcome_shown` | شاشة الترحيب | `src/components/WelcomeModal.tsx:60` | `src/components/WelcomeModal.tsx:46` |
| `lotus_treatment_plan` | خطة علاج | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_treatment_sessions` | جلسات علاج | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_treatment_progress` | تقدم علاج | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_patient_profile` | ملف المريض | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_bookings` | حجوزات | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_reports` | تقارير علاج | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_follow_up` | المتابعة | `src/context/TreatmentContext.tsx:121` | `src/context/TreatmentContext.tsx:112` |
| `lotus_error_log` | سجل الأخطاء | `src/utils/errorTracking.tsx:215` | `src/utils/errorTracking.tsx:212` |
| `lotus_first_visit` | الزيارة الأولى | `src/context/LanguageContext.tsx:56` | `src/context/LanguageContext.tsx:55` |
| `__lotus_storage_test__` | اختبار التخزين | `src/utils/storage.ts:11` | `src/utils/storage.ts:10` |

## 3) Module IDs (Games)

| moduleId | Display AR | Display EN | Primary metrics | Export support |
| --- | --- | --- | --- | --- |
| `attention` | الانتباه | Attention | hits/falseAlarms/dPrime/avgReactionMs/fatigue | PDF/CSV `src/components/games/report.ts:81` |
| `focused_attention` | الانتباه المُركَّز | Focused Attention | accuracyPct/avgReactionMs/fatigueSlope/score100 | PDF/CSV `src/components/games/report.ts:81` |
| `frequency` | تمييز التردد | Frequency | thresholdHz/accuracyPct/avgReactionMs | PDF/CSV `src/components/games/report.ts:81` |
| `sequence` | التسلسل | Sequence | maxSpan/accuracyPct/avgReactionMs | PDF/CSV `src/components/games/report.ts:81` |
| `dichotic_listening` | الاستماع الثنائي | Dichotic Listening | left/right accuracy + balanceIndex + score100 | PDF/CSV `src/components/games/report.ts:81` |
| `speech_in_noise` | الكلام وسط الضجيج | Speech in Noise | snrThresholdDb/accuracyPct/score100 | PDF/CSV `src/components/games/report.ts:81` |
| `questionnaire` | الاستبيان | Questionnaire | totalQuestions/totalScore | PDF/CSV `src/components/games/report.ts:81` |

> تفاصيل metrics لكل وحدة موجودة في `src/components/games/types.ts:18`.
