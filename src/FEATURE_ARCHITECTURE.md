# Feature Architecture: Advanced Platform Upgrades

## Overview

This document outlines the architecture for advanced gamification, school analytics, profile system, and role-based access control.

---

## 1. User & Profile System

### User Roles
```typescript
type UserRole = 'guest' | 'patient' | 'parent' | 'clinician' | 'school_admin' | 'super_admin';
```

### User Context Structure
```typescript
interface User {
  id: string;
  email?: string;
  name?: string;
  nameAr?: string;
  role: UserRole;
  avatar?: string;
  clinic?: string;
  school?: string;
  createdAt: number;
  lastLogin: number;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
}
```

### Permission Matrix
| Feature | Guest | Patient | Parent | Clinician | School Admin | Super Admin |
|---------|-------|---------|--------|-----------|--------------|-------------|
| View Content | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Play Games | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Save Progress | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Own Reports | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Child Reports | - | - | ✓ | - | - | ✓ |
| View Patient Reports | - | - | - | ✓ | - | ✓ |
| School Analytics | - | - | - | - | ✓ | ✓ |
| System Config | - | - | - | - | - | ✓ |

---

## 2. Enhanced Gamification (Clinical Alignment)

### New Achievement Categories
```typescript
type AchievementCategory =
  | 'exploration'    // Existing
  | 'learning'       // Existing
  | 'mastery'        // Existing
  | 'engagement'     // Existing
  | 'clinical'       // NEW: Treatment-related
  | 'consistency'    // NEW: Daily streaks
  | 'social';        // NEW: Sharing/community
```

### Clinical Progress Tracking
```typescript
interface ClinicalProgress {
  // Treatment Session Tracking
  sessionsCompleted: number;        // Out of 20 standard sessions
  sessionDates: number[];           // Timestamps

  // Hearing Profile (mock for now)
  hearingProfile?: {
    leftEar: number[];   // Frequency response curve
    rightEar: number[];
    updatedAt: number;
  };

  // Behavioral Metrics
  attentionScore: number;           // 0-100 (from games)
  processingSpeed: number;          // 0-100 (from games)
  auditoryDiscrimination: number;   // 0-100 (from games)

  // Progress Indicators
  weeklyGoalsMet: number;
  treatmentPhase: 'assessment' | 'active' | 'maintenance' | 'completed';
}
```

### New Achievements (Clinical)
- **Session Starter** - Complete first treatment session
- **Week Warrior** - Complete all sessions in a week
- **Halfway Hero** - Complete 10 of 20 sessions
- **Treatment Champion** - Complete full 20-session program
- **Streak Master** - 7-day activity streak
- **Progress Pioneer** - Improve any metric by 20%

---

## 3. School Analytics Dashboard

### Data Structure
```typescript
interface SchoolAnalytics {
  school: {
    id: string;
    name: string;
    nameAr: string;
    studentsEnrolled: number;
    activeStudents: number;
  };

  // Aggregate Metrics
  metrics: {
    averageSessionsCompleted: number;
    averageAttentionScore: number;
    averageProcessingSpeed: number;
    completionRate: number;
    improvementRate: number;
  };

  // Time-series data
  weeklyProgress: {
    week: string;
    sessionsCompleted: number;
    averageScore: number;
    activeStudents: number;
  }[];

  // Grade/Class breakdown
  gradeDistribution: {
    grade: string;
    count: number;
    averageProgress: number;
  }[];
}
```

### Dashboard Components
1. **Overview Cards** - Key metrics at a glance
2. **Progress Charts** - Line/bar charts for trends
3. **Student List** - Filterable/sortable table
4. **Alert System** - Students needing attention

---

## 4. Backend Sync Architecture

### API Endpoints (Future Backend)
```typescript
// Auth
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me

// User Profile
GET  /api/profile
PUT  /api/profile
GET  /api/profile/:userId (admin only)

// Gamification
GET  /api/gamification/state
POST /api/gamification/sync
POST /api/gamification/achievement/:id

// Analytics
GET  /api/analytics/personal
GET  /api/analytics/school (school_admin)
GET  /api/analytics/global (super_admin)

// Game Sessions
POST /api/sessions/start
PUT  /api/sessions/:id/complete
GET  /api/sessions/history
```

### Offline-First Strategy
```typescript
// Sync queue for offline support
interface SyncQueue {
  pending: QueuedAction[];
  lastSync: number;
}

interface QueuedAction {
  id: string;
  type: 'achievement' | 'session' | 'progress';
  payload: unknown;
  timestamp: number;
  retries: number;
}
```

---

## 5. Implementation Phases

### Phase 1: Foundation (Current Sprint)
- [x] UserContext with role support
- [x] Enhanced gamification types
- [x] Clinical progress tracking interface
- [ ] Mock auth flow UI

### Phase 2: Analytics
- [ ] SchoolAnalyticsDashboard component
- [ ] Progress charts (Chart.js or Recharts)
- [ ] Export to PDF functionality

### Phase 3: Backend Integration
- [ ] API client with retry logic
- [ ] Offline queue implementation
- [ ] Real-time sync with WebSockets

### Phase 4: Advanced Features
- [ ] Notifications system
- [ ] Multi-language reports
- [ ] Comparative analytics

---

## File Structure

```
src/
├── context/
│   ├── UserContext.tsx          # NEW: User & auth state
│   ├── GamificationContext.tsx  # ENHANCED: Clinical tracking
│   └── LanguageContext.tsx      # Existing
├── components/
│   ├── auth/
│   │   ├── LoginModal.tsx       # NEW
│   │   ├── ProfileMenu.tsx      # NEW
│   │   └── RoleGuard.tsx        # NEW
│   ├── analytics/
│   │   ├── SchoolDashboard.tsx  # NEW
│   │   ├── ProgressChart.tsx    # NEW
│   │   └── MetricCard.tsx       # NEW
│   └── ...existing
├── hooks/
│   ├── useAuth.ts               # NEW
│   ├── usePermissions.ts        # NEW
│   └── useSyncQueue.ts          # NEW
└── api/
    ├── client.ts                # NEW: API client
    └── mockData.ts              # NEW: Development mocks
```

---

## Notes

- All features designed to work offline-first
- Backend sync is optional enhancement
- Mock data allows full feature testing without backend
- RTL/Arabic support required for all new components
