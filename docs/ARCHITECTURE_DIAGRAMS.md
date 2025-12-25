# مخططات المعمارية (Architecture Diagrams)

## System Architecture
```mermaid
flowchart LR
  U[Users] --> FE[Frontend: React + Vite]
  FE --> SW[Service Worker]
  FE --> API[API: Express /api]
  SW --> Q[Offline Queue (IndexedDB)]
  API --> DB[(MongoDB)]
```

## ERD (مبسّط)
```mermaid
erDiagram
  User ||--|| ClinicalProgress : has
  User ||--|| Gamification : has
  User ||--|| Settings : has
  User ||--o{ Session : records
  User ||--o{ User : children
  ClinicalProgress { number sessionsCompleted string treatmentPhase number streak }
  Gamification { number totalPoints number level string[] achievements }
  Settings { string language string visitorMode object notifications object display object privacy object audio }
  Session { map outcomes string compositeResult number totalPoints number duration }
```

## Workflows
```mermaid
flowchart LR
  A[ولي الأمر] --> B[/assessment/]
  B --> C[حفظ نتائج محلي]
  C --> D[Parent Dashboard]
  D --> E[تصدير PDF/CSV]
```

```mermaid
flowchart LR
  C1[الأخصائي] --> C2[/clinician-dashboard/]
  C2 --> C3[تحليلات طولية]
  C3 --> C4[تصدير تقرير أخصائي]
```

```mermaid
flowchart LR
  S1[مدير المدرسة] --> S2[/school-dashboard/]
  S2 --> S3[ملخصات مدرسية]
  S3 --> S4[تصدير CSV/PDF]
```
