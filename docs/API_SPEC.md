# API_SPEC — عقد التكامل المستخلص من الشيفرة
المسار الأساسي الافتراضي: **`VITE_API_URL`** (افتراضيًا `http://localhost:3001/api`). جميع الردود JSON وتستخدم JWT Bearer في ترويسة `Authorization`.

## المصادقة (Auth)
| Endpoint | Method | الجسم/المعلمات | الاستجابة | الدور |
| --- | --- | --- | --- | --- |
| `/auth/register` | POST | `{ email, password, name, nameAr?, role? }` | `{ success, user, token, refreshToken }` | عام |
| `/auth/login` | POST | `{ email, password }` | `{ success, user, token, refreshToken }` | عام |
| `/auth/refresh` | POST | `{ refreshToken }` | `{ success, token, refreshToken }` | عام |
| `/auth/logout` | POST | — | `{ success: true }` | مصادَق |
| `/auth/me` | GET | — | `{ success, user }` | مصادَق |
| `/auth/profile` | PATCH | `{ name?, nameAr?, avatar? }` | `{ success, user }` | مصادَق |
| `/auth/account` | DELETE | — | `{ success: true }` | مصادَق |
- التخزين المحلي: ‎`lotus_auth_token`‎, ‎`lotus_refresh_token`‎.

## استرجاع/تحديث التقدم السريري (Clinical)
| Endpoint | Method | الجسم/المعلمات | الاستجابة | الدور |
| --- | --- | --- | --- | --- |
| `/clinical/progress` | GET | — | `{ success, progress }` | مصادَق |
| `/clinical/progress` | PATCH | أي من: `sessionsCompleted, attentionScore, processingSpeed, auditoryDiscrimination, weeklyGoalsMet, treatmentPhase, streak, hearingProfile` | `{ success, progress }` | مصادَق |
| `/clinical/session/complete` | POST | — | `{ success, progress }` (يزيد الجلسات/السلسلة) | مصادَق |
| `/clinical/history` | GET | `?startDate?&endDate?` | `{ success, history[] }` | مصادَق |
| `/clinical/patient/:patientId` | GET | — | `{ success, progress }` | clinician أو super_admin |

## التلعيب (Gamification)
| Endpoint | Method | الجسم/المعلمات | الاستجابة | الدور |
| --- | --- | --- | --- | --- |
| `/gamification/state` | GET | — | `{ success, state }` | مصادَق |
| `/gamification/state` | PATCH | أي من حقول الحالة (achievements[], totalPoints, level, exploredBrainRegions, slidesViewed, gamesCompleted, audioJourneyProgress, totalTimeSpent, maxScrollProgress, videosWatched, clinicalSessionsCompleted, clinicalStreak, lastClinicalActivity, treatmentPhase) | `{ success, state }` | مصادَق |
| `/gamification/achievements/:id/unlock` | POST | `{ points? }` | `{ success, state }` | مصادَق |
| `/gamification/leaderboard?type=global|clinic|school&limit?` | GET | — | `{ success, leaderboard[] }` | مصادَق |

## الإعدادات (Settings)
| Endpoint | Method | الجسم/المعلمات | الاستجابة | الدور |
| --- | --- | --- | --- | --- |
| `/settings` | GET | — | `{ success, settings }` | مصادَق |
| `/settings` | PATCH | `language?, visitorMode?, notifications?, display?, privacy?, audio?` | `{ success, settings }` | مصادَق |

## جلسات التقييم (Sessions)
| Endpoint | Method | الجسم/المعلمات | الاستجابة | الدور |
| --- | --- | --- | --- | --- |
| `/sessions` | POST | `{ outcomes: Record<string, {result, scoreLabel, metrics?}>, compositeResult?, totalPoints?, achievements?, duration? }` | `{ success, session }` | مصادَق |
| `/sessions?limit=&offset=` | GET | — | `{ success, sessions[], total }` | مصادَق |
| `/sessions/:sessionId` | GET | — | `{ success, session }` | مصادَق |
| `/sessions/:sessionId` | DELETE | — | `{ success: true }` | مصادَق |
| `/sessions/analysis/progress?testKey=` | GET | `testKey optional` | `{ success, overview || trend }` | مصادَق |

## المزامنة (Sync)
| Endpoint | Method | الجسم/المعلمات | الاستجابة | الدور |
| --- | --- | --- | --- | --- |
| `/sync` | POST | `{ lastSyncAt, localData: { clinicalProgress?, gamification?, settings?, sessions? } }` | `{ success, serverData, conflicts[], syncedAt }` | مصادَق |
| `/sync/beacon` | POST | Body نص/JSON يتضمن `{ token, lastSyncAt, localData }` | `{ success, serverData, conflicts[], syncedAt }` | يتطلب رمز في الجسم |
| `/sync/last` | GET | — | `{ success, lastSyncAt }` | مصادَق |

## التحميلات (Uploads)
- متاحة في الخلفية (`/upload/avatar`, `/upload/document`, `/upload/batch`, `/upload/info/:filename`, `DELETE /upload/:filename`) لكن لا توجد شاشات واجهة حالية؛ تتطلب مصادقة (وأدوار أعلى للحذف).

## الإدارة (Admin)
- `/admin/stats`, `/admin/users`, `/admin/users/:id`, `/admin/users/:id/role`, حذف المستخدم، إلخ. تتطلب clinician أو super_admin (بعضها super_admin فقط). الواجهة لا تعرضها بعد.

## الصحة (Health)
- `/health` GET يعيد `{ success: true, status: 'healthy', timestamp, version }` لاختبار البنية التحتية.

## اعتبارات RBAC والخصوصية
- التحقق يتم على الخادم عبر middleware `authenticate` و`authorize`. الواجهة تستخدم حجب واجهة فقط لمسارات الداشبورد.
- معرّفات الطفل: `User.children[]` تعطي صلاحية عرض تقارير طفل للأهل؛ يطبقها الخادم في استعلامات/دوال مستقبلية.
- تخزين الرموز في localStorage (عرضة لـ XSS إذا لم يتم تأمينها)؛ يمكن تبديلها إلى Cookies ذات HttpOnly في نشرات أكثر تشددًا.

## التعامل مع الأوفلاين
- طابور ‎`lotus_offline_queue`‎ يحفظ طلبات غير GET (body محفوظ JSON) ويعاد تشغيله عبر `processOfflineQueue`.
- مفتاح ‎`berard-ait-sessions`‎ و‎`SBLAB_SESSION_HISTORY`‎ يحتفظان بالجلسات المحلية؛ مزامنة `/sync` تدمجها مع قاعدة البيانات.
