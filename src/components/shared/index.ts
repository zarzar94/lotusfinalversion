/**
 * Shared Components - Reusable UI components for consistent styling
 */

// Navigation & Layout
export { default as BackNavigation } from './BackNavigation';
export { default as SectionNav } from './SectionNav';
export { default as ResponsiveStyles, responsiveCSS } from './ResponsiveStyles';

// Data Display
export { default as StatCard } from './StatCard';
export { default as LoadingSpinner } from './LoadingSpinner';

// Loading & Skeletons
export {
  default as Skeleton,
  StatCardSkeleton,
  TableRowSkeleton,
  ChartSkeleton,
  NavPillsSkeleton,
  PageSkeleton,
} from './Skeleton';

// Animations & Transitions
export {
  default as PageTransition,
  StaggerChildren,
  FadeOnScroll,
} from './PageTransition';

// Charts & Data Visualization
export {
  default as LineChart,
  BarChart,
  ProgressRing,
  MultiLineChart,
  WeeklyActivityChart,
  ScoreTrend,
} from './ProgressChart';

// Milestones & Achievements
export {
  default as MilestoneTracker,
  AchievementBadge,
  AchievementGrid,
  TreatmentPhaseIndicator,
} from './MilestoneTracker';
export type { Milestone } from './MilestoneTracker';

// Tips & Guidance
export {
  default as TipsCard,
  InfoCard,
  GuidanceSteps,
  QuickActionsCard,
} from './TipsCard';
export type { Tip } from './TipsCard';
