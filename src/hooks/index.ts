// Clinical sync hooks
export { useClinicalSync, useClinicalSessionTracker } from './useClinicalSync';

// Responsive hooks
export {
  default as useMediaQuery,
  useBreakpoints,
  useWindowSize,
  useIsTouchDevice,
} from './useMediaQuery';

// Motion preference hook (with storage sync support)
export { usePrefersReducedMotion } from './usePrefersReducedMotion';

// UI hooks
export { default as useFocusTrap } from './useFocusTrap';
export { useParallax, useScrollProgress, useScrollReveal, useMouseParallax, useTilt } from './useParallax';
export { usePageTitle } from './usePageTitle';

// Consolidated scroll management (single listener pattern)
export {
  useScrollState,
  useOnScroll,
  useScrollPastThreshold,
  useScrollProgressFromManager,
  type ScrollState,
} from './useScrollManager';
