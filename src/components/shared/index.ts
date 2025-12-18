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
