# 🎧 LOTUS SOUND LAB - Complete Platform Architecture

> **Version**: 2.0.0
> **Last Updated**: December 2025
> **Status**: Implementation Phase

---

## 📋 Table of Contents

1. [Platform Overview](#platform-overview)
2. [Brand Identity & Design System](#brand-identity--design-system)
3. [User Roles & Journeys](#user-roles--journeys)
4. [Technical Architecture](#technical-architecture)
5. [Feature Modules](#feature-modules)
6. [API Architecture](#api-architecture)
7. [Database Schema](#database-schema)
8. [Treatment Protocol System](#treatment-protocol-system)
9. [Assessment Pipeline](#assessment-pipeline)
10. [Analytics & Reporting](#analytics--reporting)
11. [Booking & Scheduling](#booking--scheduling)
12. [Gamification System](#gamification-system)
13. [Security & Compliance](#security--compliance)

---

## 🌟 Platform Overview

### Vision
Lotus Sound Lab is a comprehensive, Arabic-first auditory integration training platform that combines clinical rigor with engaging, gamified experiences for children, parents, clinicians, and educational institutions.

### Core Pillars
- **Clinical Excellence**: Evidence-based Bérard AIT protocols
- **User Engagement**: Gamified learning with achievements and progress tracking
- **Accessibility**: RTL Arabic-first design with full English support
- **Data-Driven**: Comprehensive analytics for all stakeholder roles
- **Futuristic Aesthetic**: Lab-tech neural interface design language

### Platform Modes
| Mode | Target Users | Primary Features |
|------|--------------|------------------|
| **Discovery** | Public visitors | Information, testimonials, contact |
| **Assessment** | New patients | Screening games, checklist, booking |
| **Treatment** | Active patients | Protocol sessions, progress tracking |
| **Monitoring** | Parents/Guardians | Child progress, reports, goals |
| **Clinical** | Practitioners | Patient management, analytics |
| **Administration** | School/Clinic admins | Batch reports, organizational analytics |

---

## 🎨 Brand Identity & Design System

### Color Palette

#### Primary Brand Colors
```
Lotus Cyan    #8FD3CC  → Neural activity, healing, clarity
Lotus Purple  #AF84BA  → Wisdom, treatment, professional
Lotus Pink    #E785B7  → Warmth, children, engagement
Ink Dark      #0d1117  → Deep space, immersion
Panel Dark    #161b22  → Card surfaces, depth
```

#### Audio Spectrum Colors
```
Bass          #FF6B6B  → Low frequencies (20-250Hz)
Mid-Low       #FECA57  → Lower-mid (250-500Hz)
Mid           #48DBFB  → Speech frequencies (500-2kHz)
Mid-High      #1DD1A1  → Upper-mid (2-4kHz)
Treble        #5F27CD  → High frequencies (4-20kHz)
```

#### Brain Wave Colors
```
Alpha         #8FD3CC  → Relaxed focus (8-12Hz)
Beta          #AF84BA  → Active thinking (13-30Hz)
Theta         #E785B7  → Deep relaxation (4-7Hz)
Delta         #4a2556  → Deep sleep (0.5-3Hz)
```

### Typography

| Scale | Size | Usage |
|-------|------|-------|
| xs | 12px | Labels, captions |
| sm | 14px | Secondary text |
| base | 16px | Body text |
| lg | 18px | Lead paragraphs |
| xl | 20px | Section headers |
| 2xl | 24px | Page titles |
| 3xl | 30px | Hero secondary |
| 4xl | 36px | Hero primary |
| 5xl | 48px | Display |

**Font Families**:
- Arabic: Cairo (Google Fonts)
- English: Inter, system sans-serif
- Mono: JetBrains Mono (code/metrics)

### Design Tone & Voice

#### Visual Tone
- **Futuristic**: Neural network aesthetics, holographic effects
- **Medical**: Clean, precise, professional data visualization
- **Lab**: Scientific instrument UI, scan lines, diagnostics
- **Sound**: Waveforms, frequency visualizations, spectrum displays
- **Child-Friendly**: Playful animations, achievement badges, gamification

#### Written Tone
- Arabic: Warm, respectful, professional (formal Arabic)
- English: Clear, encouraging, evidence-based
- Clinical contexts: Technical precision with compassionate framing
- Parent communications: Supportive, informative, action-oriented

### UI Components

#### Cards
- **Glass Card**: Frosted glass effect with subtle blur
- **Sound Lab Card**: Scan line overlay, corner brackets
- **Achievement Card**: Glow effects, animated borders
- **Stats Card**: Metric-focused, trend indicators

#### Buttons
- **Primary**: Gradient cyan-purple with glow
- **Secondary**: Outline with hover fill
- **Ghost**: Transparent with subtle hover
- **Neon**: Animated border glow effect
- **Danger**: Error state with warning styling

#### HUD Elements
- Corner brackets for panel framing
- Scan line animations
- Neural network grid backgrounds
- Status dots with pulse animations
- Progress bars with spectrum gradients

---

## 👥 User Roles & Journeys

### Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                      SUPER ADMIN                             │
│        (System configuration, all permissions)              │
└─────────────────────────────────────────────────────────────┘
           │
           ├─────────────────────────────────────┐
           ▼                                     ▼
┌─────────────────────┐              ┌─────────────────────┐
│   SCHOOL ADMIN      │              │    CLINICIAN        │
│  (Org analytics)    │              │  (Patient care)     │
└─────────────────────┘              └─────────────────────┘
           │                                     │
           ▼                                     ▼
┌─────────────────────┐              ┌─────────────────────┐
│      PARENT         │◄────────────►│     PATIENT         │
│  (Child monitoring) │              │  (Treatment)        │
└─────────────────────┘              └─────────────────────┘
           │
           ▼
┌─────────────────────┐
│       GUEST         │
│  (Public access)    │
└─────────────────────┘
```

### User Journeys

#### Journey 1: Parent Discovery → Treatment
```
1. Landing Page (WhatsApp CTA, mode=parent)
2. Explore "What is AIT?" section
3. View Success Stories & Testimonials
4. Complete Online Checklist (PDF export)
5. Book Virtual Consultation
6. Create Account (parent role)
7. Child Assessment Games
8. View Results & Recommendations
9. Schedule Treatment Sessions
10. Track Progress via Parent Dashboard
```

#### Journey 2: School Partner Integration
```
1. Landing Page (mode=school)
2. School Partnership Information
3. Request Demo Presentation
4. Admin Account Setup
5. Batch Student Registration
6. Group Screening Sessions
7. Aggregate Analytics Dashboard
8. Individual Student Reports
9. Progress Monitoring
10. Annual Review Reports
```

#### Journey 3: Clinical Practice
```
1. Clinician Login
2. Patient Queue / Calendar
3. New Patient Intake
4. Initial Assessment Battery
5. Treatment Protocol Assignment
6. Session Management (10-day program)
7. Daily Listening Sessions
8. Progress Documentation
9. Mid-treatment Adjustments
10. Post-treatment Evaluation
11. Follow-up Scheduling
12. Report Generation
```

#### Journey 4: Self-Assessment Demo
```
1. Guest Mode Access
2. Demo Account Login
3. Practice Trials Introduction
4. Headphone Calibration
5. Sample Attention Test
6. Sample Frequency Test
7. Results Preview (limited)
8. Prompt to Book Full Assessment
9. WhatsApp Inquiry
```

---

## 🏗️ Technical Architecture

### Frontend Stack
```
React 18.2.0          → UI framework
TypeScript 5.5.4      → Type safety
Vite 7.2.7            → Build tool
React Router 7.10.1   → Routing
Three.js 0.160        → 3D graphics
GSAP 3.14.2           → Animations
jsPDF 3.0.4           → PDF generation
```

### Backend Stack
```
Node.js               → Runtime
Express.js            → API framework
MongoDB               → Database
Mongoose              → ODM
JWT                   → Authentication
bcryptjs              → Password hashing
```

### Directory Structure
```
/src
├── /components          # UI Components
│   ├── /analytics       # Dashboard analytics
│   ├── /auth            # Authentication
│   ├── /dashboards      # Role dashboards
│   ├── /games           # Assessment games
│   ├── /gamification    # Achievement system
│   ├── /shared          # Reusable components
│   ├── /treatment       # Treatment protocol
│   └── /booking         # Scheduling system
│
├── /context             # React Context providers
│   ├── UserContext      # Auth & user state
│   ├── GamificationContext # Achievements
│   ├── LanguageContext  # i18n
│   ├── SyncContext      # Data sync
│   └── VisitorModeContext # CTA targeting
│
├── /pages               # Route components
├── /services            # API clients
├── /hooks               # Custom hooks
├── /data                # Static data
├── /styles              # Design system
├── /types               # TypeScript types
├── /utils               # Utilities
└── /i18n                # Translations

/backend
├── /src
│   ├── /controllers     # Route handlers
│   ├── /models          # Mongoose schemas
│   ├── /routes          # API routes
│   ├── /middleware      # Auth, validation
│   ├── /services        # Business logic
│   └── /utils           # Helpers
└── /tests               # API tests
```

### State Management

| Context | Purpose | Persistence |
|---------|---------|-------------|
| UserContext | Auth, profile, permissions | localStorage + API |
| GamificationContext | Achievements, progress | localStorage + API |
| LanguageContext | i18n, RTL | localStorage |
| SyncContext | Offline queue, sync status | localStorage |
| VisitorModeContext | CTA targeting | localStorage + URL |
| TreatmentContext | Session management | localStorage + API |
| BookingContext | Appointments | API only |

---

## 📦 Feature Modules

### Module 1: Assessment Pipeline

#### Components
- `AssessmentSuiteModal` - Full 6-test coordinator
- `HeadphoneCheckPanel` - Audio calibration
- `AttentionTestPanel` - Go/No-Go paradigm
- `FocusedAttentionTestPanel` - CPT task
- `FrequencyDiscriminationTestPanel` - Adaptive 2IFC
- `SequencingTestPanel` - Auditory memory span
- `DichoticListeningTestPanel` - Binaural integration
- `SpeechInNoiseTestPanel` - Adaptive SNR
- `QuestionnairePanel` - Behavioral observations
- `PostTestSummary` - Results with recommendations

#### Data Flow
```
User starts assessment
       │
       ▼
┌──────────────────┐
│ Headphone Check  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Attention Test  │──► Session storage
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Frequency Disc  │──► Metrics calculation
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Sequencing     │──► Adaptive difficulty
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Dichotic Listen  │──► Binaural metrics
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Speech in Noise  │──► SNR calculation
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Questionnaire   │──► Behavioral profile
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Post Summary    │──► PDF/API export
└──────────────────┘
```

### Module 2: Treatment Protocol System

#### 10-Day Bérard AIT Program
```
Phase 1: Initial Assessment (Day 0)
├── Complete screening battery
├── Audiogram (if available)
├── Behavioral checklist
└── Treatment plan generation

Phase 2: Intensive Listening (Days 1-5)
├── 2 × 30-minute sessions daily
├── Filtered music exposure
├── Frequency modulation
└── Daily progress notes

Phase 3: Rest Day (Day 6)
├── No listening sessions
├── Parent/patient feedback
└── Mid-treatment assessment

Phase 4: Intensive Listening (Days 7-10)
├── 2 × 30-minute sessions daily
├── Adjusted frequencies
├── Final progress tracking
└── Post-treatment evaluation

Phase 5: Follow-up (Days 30, 90, 180)
├── Re-assessment battery
├── Parent questionnaire
├── Progress comparison
└── Maintenance recommendations
```

#### Treatment Components
- `TreatmentDashboard` - Session management
- `ListeningSession` - Audio playback with timer
- `SessionNotes` - Daily documentation
- `ProtocolAdjustments` - Frequency modifications
- `TreatmentCalendar` - Schedule view
- `ProgressTimeline` - Treatment journey

### Module 3: Analytics Engine

#### Metrics Tracked
```typescript
interface SessionMetrics {
  // Attention metrics
  hits: number;
  misses: number;
  falseAlarms: number;
  correctRejections: number;
  reactionTime: number[];
  attentionIndex: number;

  // Frequency discrimination
  threshold: number; // Hz
  justNoticeableDifference: number;

  // Sequencing
  maxSpan: number;
  sequenceAccuracy: number;

  // Dichotic
  leftEarAdvantage: number;
  integrationScore: number;
  separationScore: number;

  // Speech in noise
  snrThreshold: number; // dB
  wordRecognition: number;

  // Fatigue analysis
  earlyRTMean: number;
  lateRTMean: number;
  fatigueSlope: number;
  consistencyScore: number;
}
```

#### Visualization Components
- `LongitudinalCharts` - Progress over time
- `RadarProfile` - Multi-domain strengths
- `SessionHeatmap` - Daily patterns
- `FatigueAnalysis` - Performance decay
- `ComparativeReport` - Pre/post treatment
- `CohortAnalytics` - Group comparisons

### Module 4: Booking & Scheduling

#### Features
- Virtual consultation booking
- Treatment session scheduling
- Reminder notifications
- Calendar integration
- Cancellation/rescheduling
- Waitlist management

#### Booking Flow
```
1. Select service type
2. Choose practitioner (if multiple)
3. Pick available date/time
4. Provide contact information
5. Confirmation + WhatsApp notification
6. Calendar invite generation
7. Reminder 24h before
8. Session completion tracking
```

### Module 5: Certification & Credentials

#### Displays
- Bérard AIT Practitioner certification
- Professional affiliations
- Training credentials
- Continuous education
- Partner organization logos

### Module 6: Success Stories

#### Content Types
- Video testimonials
- Written case studies
- Before/after metrics
- Parent quotes
- Clinician observations
- School reports

---

## 🔌 API Architecture

### Endpoints

#### Authentication
```
POST   /api/auth/register        # New user registration
POST   /api/auth/login           # User login
POST   /api/auth/logout          # Session termination
POST   /api/auth/refresh         # Token refresh
GET    /api/auth/me              # Current user
PUT    /api/auth/profile         # Update profile
POST   /api/auth/password/reset  # Password reset
```

#### Users
```
GET    /api/users                # List users (admin)
GET    /api/users/:id            # Get user
PUT    /api/users/:id            # Update user
DELETE /api/users/:id            # Delete user
GET    /api/users/:id/children   # Parent's children
POST   /api/users/:id/children   # Link child to parent
```

#### Patients
```
GET    /api/patients             # List patients
GET    /api/patients/:id         # Get patient
POST   /api/patients             # Create patient
PUT    /api/patients/:id         # Update patient
GET    /api/patients/:id/sessions # Patient sessions
GET    /api/patients/:id/progress # Progress data
```

#### Assessments
```
POST   /api/assessments          # Start assessment
PUT    /api/assessments/:id      # Update in-progress
POST   /api/assessments/:id/complete # Complete
GET    /api/assessments/:id      # Get assessment
GET    /api/assessments          # List assessments
DELETE /api/assessments/:id      # Delete assessment
```

#### Treatment
```
POST   /api/treatment/plans      # Create treatment plan
GET    /api/treatment/plans/:id  # Get plan
PUT    /api/treatment/plans/:id  # Update plan
POST   /api/treatment/sessions   # Log session
GET    /api/treatment/sessions   # List sessions
PUT    /api/treatment/sessions/:id # Update session
```

#### Booking
```
GET    /api/booking/slots        # Available slots
POST   /api/booking              # Create booking
GET    /api/booking/:id          # Get booking
PUT    /api/booking/:id          # Update booking
DELETE /api/booking/:id          # Cancel booking
GET    /api/booking/calendar     # Calendar view
```

#### Reports
```
GET    /api/reports/patient/:id  # Patient report
GET    /api/reports/school/:id   # School report
GET    /api/reports/cohort       # Cohort analytics
POST   /api/reports/export       # Generate export
GET    /api/reports/download/:id # Download report
```

#### Sync
```
POST   /api/sync                 # Full sync
POST   /api/sync/push            # Push local changes
GET    /api/sync/pull            # Pull server changes
```

#### Health
```
GET    /api/health               # API health check
GET    /api/version              # API version info
```

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
```

---

## 🗄️ Database Schema

### Collections

#### Users
```typescript
interface User {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  nameAr?: string;
  role: 'guest' | 'patient' | 'parent' | 'clinician' | 'school_admin' | 'super_admin';
  avatar?: string;
  phone?: string;
  clinic?: ObjectId;      // ref: Clinics
  school?: ObjectId;      // ref: Schools
  children?: ObjectId[];  // ref: Users (for parents)
  clinician?: ObjectId;   // ref: Users (for patients)
  settings: UserSettings;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  isActive: boolean;
}
```

#### Patients
```typescript
interface Patient {
  _id: ObjectId;
  user: ObjectId;         // ref: Users
  dateOfBirth: Date;
  gender: 'male' | 'female';
  diagnoses?: string[];
  referralSource?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: string;
  audiogram?: {
    leftEar: number[];    // dB HL at frequencies
    rightEar: number[];
    date: Date;
  };
  status: 'intake' | 'assessment' | 'active' | 'maintenance' | 'completed' | 'archived';
  treatmentPlan?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Assessments
```typescript
interface Assessment {
  _id: ObjectId;
  patient: ObjectId;      // ref: Patients
  assessor: ObjectId;     // ref: Users
  type: 'screening' | 'full' | 'follow-up';
  status: 'in_progress' | 'completed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  modules: {
    attention?: AttentionResult;
    frequency?: FrequencyResult;
    sequencing?: SequencingResult;
    dichotic?: DichoticResult;
    speechInNoise?: SNRResult;
    questionnaire?: QuestionnaireResult;
  };
  composite: {
    overallScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    recommendation: string;
    recommendationAr: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### TreatmentPlans
```typescript
interface TreatmentPlan {
  _id: ObjectId;
  patient: ObjectId;      // ref: Patients
  clinician: ObjectId;    // ref: Users
  protocol: 'berard_ait' | 'modified' | 'maintenance';
  status: 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  sessions: {
    scheduled: number;
    completed: number;
  };
  frequencyProfile: {
    low: number[];        // Attenuated low frequencies
    mid: number[];        // Speech range
    high: number[];       // Attenuated high frequencies
  };
  adjustments: Array<{
    date: Date;
    description: string;
    frequencies: number[];
  }>;
  goals: Array<{
    description: string;
    descriptionAr: string;
    target: number;
    current: number;
  }>;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Sessions
```typescript
interface Session {
  _id: ObjectId;
  treatmentPlan: ObjectId; // ref: TreatmentPlans
  patient: ObjectId;       // ref: Patients
  clinician: ObjectId;     // ref: Users
  date: Date;
  sessionNumber: number;   // 1-20 for standard protocol
  duration: number;        // minutes
  type: 'listening' | 'assessment' | 'consultation';
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
  audioSettings: {
    volume: number;
    frequencies: number[];
    musicTrack?: string;
  };
  observations: string;
  patientFeedback?: string;
  behavioralNotes?: string;
  metrics?: SessionMetrics;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Bookings
```typescript
interface Booking {
  _id: ObjectId;
  user: ObjectId;         // ref: Users
  patient?: ObjectId;     // ref: Patients
  clinician?: ObjectId;   // ref: Users
  type: 'consultation' | 'assessment' | 'treatment' | 'follow_up';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  scheduledAt: Date;
  duration: number;       // minutes
  location: 'clinic' | 'remote';
  remoteLink?: string;
  notes?: string;
  reminder: {
    sent: boolean;
    sentAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### Achievements
```typescript
interface Achievement {
  _id: ObjectId;
  user: ObjectId;         // ref: Users
  achievementId: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  points: number;
  category: 'exploration' | 'learning' | 'mastery' | 'engagement' | 'clinical';
  unlockedAt: Date;
  createdAt: Date;
}
```

#### GamificationState
```typescript
interface GamificationState {
  _id: ObjectId;
  user: ObjectId;         // ref: Users
  totalPoints: number;
  level: number;
  achievements: string[];
  exploredBrainRegions: string[];
  slidesViewed: number[];
  checklistCompleted: boolean;
  gamesCompleted: string[];
  audioJourneyProgress: number;
  sessionStartTime: number;
  totalTimeSpent: number;
  maxScrollProgress: number;
  videosWatched: string[];
  clinicalSessionsCompleted: number;
  clinicalStreak: number;
  lastClinicalActivity: Date;
  treatmentPhase: 'assessment' | 'active' | 'maintenance' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Schools
```typescript
interface School {
  _id: ObjectId;
  name: string;
  nameAr: string;
  type: 'primary' | 'intermediate' | 'secondary' | 'special_needs';
  address: Address;
  contact: ContactInfo;
  admin: ObjectId;        // ref: Users
  students: ObjectId[];   // ref: Users
  partnershipStart: Date;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Clinics
```typescript
interface Clinic {
  _id: ObjectId;
  name: string;
  nameAr: string;
  address: Address;
  contact: ContactInfo;
  clinicians: ObjectId[]; // ref: Users
  patients: ObjectId[];   // ref: Patients
  settings: ClinicSettings;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🎮 Gamification System

### Points System

| Action | Points | Category |
|--------|--------|----------|
| Complete first assessment | 100 | Engagement |
| Unlock brain region | 25 | Exploration |
| View all slides | 50 | Learning |
| Complete checklist | 75 | Learning |
| Finish game module | 50 | Mastery |
| Complete treatment session | 100 | Clinical |
| Maintain 3-day streak | 150 | Clinical |
| Maintain 7-day streak | 300 | Clinical |
| Achieve perfect score | 200 | Mastery |

### Level System

| Level | Points Required | Title |
|-------|-----------------|-------|
| 1 | 0 | Sound Seeker |
| 2 | 100 | Frequency Finder |
| 3 | 300 | Neural Navigator |
| 4 | 600 | Audio Adventurer |
| 5 | 1000 | Listening Legend |
| 6 | 1500 | Brain Wave Master |
| 7 | 2200 | Sound Scientist |
| 8 | 3000 | Neural Network Pro |
| 9 | 4000 | Auditory Ace |
| 10 | 5000 | Lotus Master |

### Achievement Categories

#### Exploration (15 achievements)
- First Steps: Open the app
- Brain Explorer: Visit 3 brain regions
- Neural Master: Visit all brain regions
- Page Turner: Read 10 pages
- Content Collector: View 50% of content

#### Learning (12 achievements)
- Slide Scholar: View 20 slides
- Video Watcher: Watch 3 videos
- FAQ Master: Read all FAQs
- Science Student: Visit science page
- Protocol Expert: Complete protocol section

#### Mastery (10 achievements)
- Game Starter: Complete first game
- Lab Explorer: Complete all games
- Perfect Score: 100% on any test
- Speed Demon: Complete test in record time
- Consistency King: Low variance across sessions

#### Engagement (8 achievements)
- Early Bird: First activity before 9am
- Night Owl: Activity after 9pm
- Dedicated Learner: 30 min session
- Marathon: 60 min session
- Weekly Warrior: 5 days in a week

#### Clinical (10 achievements)
- Treatment Pioneer: Start treatment
- Week One Champion: Complete first week
- Halfway Hero: Complete 10 sessions
- Treatment Graduate: Finish full protocol
- Follow-up Faithful: Complete follow-up

---

## 🔒 Security & Compliance

### Authentication
- JWT tokens with 1-hour expiry
- Refresh tokens with 7-day expiry
- Secure HTTP-only cookies for tokens
- Password requirements: 8+ chars, mixed case, number
- Account lockout after 5 failed attempts
- Two-factor authentication (optional)

### Authorization
- Role-based access control (RBAC)
- Permission-based route guards
- API endpoint authorization
- Data isolation by role

### Data Protection
- All data encrypted at rest
- HTTPS/TLS for all connections
- Input sanitization on all forms
- SQL/NoSQL injection prevention
- XSS protection via CSP headers
- CSRF tokens for state changes

### Privacy
- GDPR-compliant data handling
- Saudi PDPL compliance considerations
- Data minimization principles
- Right to erasure support
- Consent management
- Data export functionality

### Audit Trail
- All data changes logged
- User activity tracking
- Login/logout events
- Permission changes recorded
- Retention policies enforced

---

## 📱 Responsive Design

### Breakpoints
```css
--mobile: 0px      /* Mobile first */
--sm: 640px        /* Small tablets */
--md: 768px        /* Tablets */
--lg: 1024px       /* Laptops */
--xl: 1280px       /* Desktops */
--2xl: 1536px      /* Large screens */
```

### Mobile Optimizations
- Touch-friendly tap targets (44px minimum)
- Swipe gestures for navigation
- Bottom navigation bar
- Collapsible sidebar
- Full-screen game modes
- Optimized images (WebP with fallbacks)

### RTL Support
- Automatic direction switching
- Mirrored layouts
- RTL-aware spacing utilities
- Bi-directional text handling
- Arabic numeral options

---

## 🚀 Performance

### Optimizations
- Lazy loading for routes and components
- Image optimization with srcset
- Font subsetting for Arabic
- Code splitting by route
- Service worker for offline support
- CDN for static assets
- Gzip/Brotli compression
- HTTP/2 multiplexing

### Metrics Targets
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- TTI: < 3.5s
- Bundle size: < 500KB initial

---

## 📊 Analytics Integration

### Events Tracked
- Page views
- User flows
- Feature usage
- Game completions
- Assessment outcomes
- Treatment adherence
- Error rates
- Performance metrics

### Dashboards
- Admin: Platform-wide metrics
- Clinician: Patient outcomes
- School: Student progress
- Parent: Child progress
- Marketing: Conversion funnel

---

*This document serves as the authoritative reference for Lotus Sound Lab platform development.*
