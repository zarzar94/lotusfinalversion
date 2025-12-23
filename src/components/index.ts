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
export { styles, brandPurple, brandCyan, brandPink } from './styles';

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
} from '../styles';

// New virtual experiences
export { default as TreatmentProtocolDashboard } from './treatment/TreatmentProtocolDashboard';
export { default as SoundLabSimulation } from './treatment/SoundLabSimulation';
export { default as VirtualAssessmentFlow } from './assessment/VirtualAssessmentFlow';
export { default as FeedbackSystem } from './assessment/FeedbackSystem';
export { default as SignupIntakeForm } from './intake/SignupIntakeForm';
export { default as AnalyticsDashboard } from './analytics/AnalyticsDashboard';
export { default as AboutUsSection } from './about/AboutUsSection';
export { default as MainNavigation } from './navigation/MainNavigation';
