export { default as Header } from './Header';
export { default as BrandedSkeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonButton } from './BrandedSkeleton';
export { default as ScrollToTopButton } from './ScrollToTopButton';
export { default as QuickActionsPanel } from './QuickActionsPanel';
export { default as WhatIsAIT } from './WhatIsAIT';

// New platform sections
export { SuccessStoriesSection } from './SuccessStoriesSection';
export { CertificationsSection } from './CertificationsSection';
export { PartnersSection } from './PartnersSection';
export { ReportsExport } from './ReportsExport';

// Booking system
export { BookingSystem } from './booking';

// Treatment components
export { TreatmentProtocolDashboard, SoundLabSimulation } from './treatment';

// Assessment components
export { VirtualAssessmentFlow, FeedbackSystem } from './assessment';

// Intake/Signup
export { SignupIntakeForm } from './intake';

// Analytics
export { AnalyticsDashboard } from './analytics';

// About section
export { AboutUsSection } from './about';

// Navigation
export { MainNavigation } from './navigation';

// Games
export { PracticeTrials } from './games/PracticeTrials';

// Language consistency utilities
export {
  LocalizedText,
  LocalizedContent,
  LanguageAwareContainer,
  ArabicOnly,
  EnglishOnly,
  DirectionalSpacer,
  LanguageBadge,
  useBilingual,
  useDirectionalValue,
} from './LanguageGuard';
export type { BilingualContent, BilingualNode } from './LanguageGuard';

// SlideViewer, Checklist, GameSection, ContactForm are lazy-loaded in App.tsx
export { styles, brandPurple, brandCyan, brandPink, labTechAdvanced, advancedAnimations, workflowStyles } from './styles';

// Design system exports
export {
  brand,
  audio,
  semantic,
  gradients,
  shadows,
  typography,
  spacing,
  radius,
  transitions,
  cards,
  buttons,
  forms,
  badges,
  hud,
  layout,
  text,
  moduleMetrics,
  attentionModule,
  binauralModule,
  snrModule,
  analytics,
  dashboardExport,
  instructionFlow,
} from './styles';
