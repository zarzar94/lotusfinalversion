/**
 * @fileoverview Parallax and scroll animation hooks for creating dynamic visual effects.
 *
 * This module provides a collection of React hooks for implementing various scroll-based
 * and mouse-based animation effects commonly used in modern web interfaces:
 *
 * - **useParallax**: Scroll-based vertical parallax movement
 * - **useScrollReveal**: Intersection Observer-based visibility detection
 * - **useMouseParallax**: Mouse position-based element displacement
 * - **useTilt**: 3D card tilt effect on hover
 * - **useScrollProgress**: Global page scroll progress tracking
 *
 * All hooks are optimized for performance with passive event listeners and
 * proper cleanup on unmount.
 *
 * @module hooks/useParallax
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Configuration options for the useParallax hook.
 *
 * @interface ParallaxConfig
 */
interface ParallaxConfig {
  /**
   * Speed multiplier for the parallax effect.
   * Higher values create more pronounced movement.
   * - `0.5` (default): Subtle, natural parallax
   * - `1.0`: Moderate movement
   * - `2.0+`: Dramatic, exaggerated effect
   * @default 0.5
   */
  speed?: number;

  /**
   * Direction of parallax movement relative to scroll.
   * - `'up'`: Element moves upward as user scrolls down (classic parallax)
   * - `'down'`: Element moves downward as user scrolls down (inverse parallax)
   * @default 'up'
   */
  direction?: 'up' | 'down';

  /**
   * Initial offset in pixels applied before any scroll-based calculation.
   * Useful for staggering multiple parallax elements.
   * @default 0
   */
  startOffset?: number;

  /**
   * When true, disables the parallax effect entirely.
   * Useful for reduced motion preferences or mobile optimization.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Creates a scroll-based vertical parallax effect for an element.
 *
 * The parallax offset is calculated based on the element's position within
 * the viewport. When the element is at the center of the viewport, offset is
 * near zero. As it moves above or below center, the offset increases.
 *
 * @param config - Configuration options for the parallax effect
 * @returns An object containing:
 *   - `ref`: React ref to attach to the target element
 *   - `offset`: Current calculated offset in pixels (use with transform: translateY)
 *
 * @example
 * ```tsx
 * function ParallaxImage() {
 *   const { ref, offset } = useParallax({ speed: 0.3, direction: 'up' });
 *
 *   return (
 *     <div ref={ref} style={{ transform: `translateY(${offset}px)` }}>
 *       <img src="/hero.jpg" alt="Hero" />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Respect user's reduced motion preference
 * const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 * const { ref, offset } = useParallax({ disabled: prefersReducedMotion });
 * ```
 */
export function useParallax({
  speed = 0.5,
  direction = 'up',
  startOffset = 0,
  disabled = false,
}: ParallaxConfig = {}): { ref: React.RefObject<HTMLDivElement>; offset: number } {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far through the viewport the element is
      const progress = (windowHeight - rect.top) / (windowHeight + rect.height);

      // Calculate offset based on progress
      const parallaxOffset = (progress - 0.5) * speed * 100 + startOffset;

      setOffset(direction === 'up' ? -parallaxOffset : parallaxOffset);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction, startOffset, disabled]);

  return { ref, offset };
}

/**
 * Configuration options for the useScrollReveal hook.
 *
 * @interface ScrollRevealConfig
 */
interface ScrollRevealConfig {
  /**
   * Visibility threshold (0-1) at which the element is considered "visible".
   * - `0.0`: Visible as soon as any part enters viewport
   * - `0.2` (default): Visible when 20% is in viewport
   * - `1.0`: Visible only when fully in viewport
   *
   * Note: The hook internally uses 10 threshold points (0, 0.1, 0.2, ... 1.0)
   * for smooth progress tracking, regardless of this setting.
   * @default 0.2
   */
  threshold?: number;

  /**
   * Margin around the root (viewport) for intersection calculation.
   * Uses CSS margin syntax (e.g., "100px", "-50px 0px").
   * Positive values trigger earlier; negative values delay triggering.
   * @default '0px'
   */
  rootMargin?: string;

  /**
   * When true, the element stays "visible" once revealed and won't reset.
   * When false, visibility toggles as element enters/exits viewport.
   * @default true
   */
  once?: boolean;
}

/**
 * Detects when an element becomes visible in the viewport using Intersection Observer.
 *
 * This hook is ideal for scroll-triggered animations, lazy loading, and
 * analytics tracking. It provides both a boolean visibility state and a
 * continuous progress value (0-1) representing how much of the element is visible.
 *
 * @param config - Configuration options for visibility detection
 * @returns An object containing:
 *   - `ref`: React ref to attach to the target element
 *   - `isVisible`: Boolean indicating if element has been revealed
 *   - `progress`: Number (0-1) representing intersection ratio
 *
 * @example
 * ```tsx
 * function FadeInSection({ children }) {
 *   const { ref, isVisible } = useScrollReveal({ threshold: 0.3 });
 *
 *   return (
 *     <section
 *       ref={ref}
 *       style={{
 *         opacity: isVisible ? 1 : 0,
 *         transition: 'opacity 0.6s ease-out'
 *       }}
 *     >
 *       {children}
 *     </section>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Continuous progress-based animation
 * function ProgressBar() {
 *   const { ref, progress } = useScrollReveal({ once: false });
 *
 *   return (
 *     <div ref={ref}>
 *       <div style={{ width: `${progress * 100}%` }} className="progress-fill" />
 *     </div>
 *   );
 * }
 * ```
 */
export function useScrollReveal({
  threshold = 0.2,
  rootMargin = '0px',
  once = true,
}: ScrollRevealConfig = {}): { ref: React.RefObject<HTMLDivElement>; isVisible: boolean; progress: number } {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) hasTriggered.current = true;
        } else if (!once && !hasTriggered.current) {
          setIsVisible(false);
        }

        // Calculate visibility progress
        setProgress(Math.min(Math.max(entry.intersectionRatio, 0), 1));
      },
      { threshold: Array.from({ length: 10 }, (_, i) => i / 10), rootMargin }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible, progress };
}

/**
 * Creates a mouse-following parallax effect where an element subtly shifts
 * based on the cursor's position relative to the element's center.
 *
 * This creates an interactive, responsive feel commonly used for hero sections,
 * cards, or decorative elements. The displacement is calculated from the
 * distance between the mouse cursor and the element's center point.
 *
 * @param intensity - Multiplier for mouse displacement effect.
 *   - `0.02` (default): Subtle, professional movement
 *   - `0.05`: Noticeable but not distracting
 *   - `0.1+`: Dramatic, playful effect
 * @returns An object containing:
 *   - `ref`: React ref to attach to the target element
 *   - `position`: Object with `x` and `y` displacement values in pixels
 *
 * @example
 * ```tsx
 * function FloatingCard() {
 *   const { ref, position } = useMouseParallax(0.03);
 *
 *   return (
 *     <div
 *       ref={ref}
 *       style={{
 *         transform: `translate(${position.x}px, ${position.y}px)`
 *       }}
 *     >
 *       <h2>Interactive Card</h2>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * This hook listens to global mouse movement, which can impact performance
 * on pages with many instances. Consider using {@link useTilt} for
 * hover-only effects on individual elements.
 */
export function useMouseParallax(
  intensity: number = 0.02
): { ref: React.RefObject<HTMLDivElement>; position: { x: number; y: number } } {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * intensity;
      const deltaY = (e.clientY - centerY) * intensity;

      setPosition({ x: deltaX, y: deltaY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return { ref, position };
}

/**
 * Creates a 3D card tilt effect that responds to mouse position over an element.
 *
 * When the user hovers over the element, it tilts toward the cursor position,
 * creating a perspective-based 3D effect. The tilt resets to neutral when
 * the mouse leaves the element.
 *
 * Unlike {@link useMouseParallax}, this hook only responds when the mouse is
 * directly over the element, making it more performant for card-based UIs.
 *
 * @param maxTilt - Maximum tilt angle in degrees.
 *   - `10` (default): Subtle, elegant tilt
 *   - `15-20`: Noticeable 3D effect
 *   - `30+`: Dramatic, gaming-style effect
 * @returns An object containing:
 *   - `ref`: React ref to attach to the target element
 *   - `tilt`: Object with `rotateX` and `rotateY` values in degrees
 *   - `handleMouseMove`: Event handler to attach to onMouseMove
 *   - `handleMouseLeave`: Event handler to attach to onMouseLeave
 *
 * @example
 * ```tsx
 * function TiltCard() {
 *   const { ref, tilt, handleMouseMove, handleMouseLeave } = useTilt(15);
 *
 *   return (
 *     <div
 *       ref={ref}
 *       onMouseMove={handleMouseMove}
 *       onMouseLeave={handleMouseLeave}
 *       style={{
 *         transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
 *         transition: 'transform 0.1s ease-out'
 *       }}
 *     >
 *       <h3>Hover me!</h3>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * For the 3D effect to work properly, ensure the parent container has
 * `perspective` set (either via inline style or CSS class). The returned
 * transform values assume the element is viewed from the front.
 */
export function useTilt(maxTilt: number = 10): {
  ref: React.RefObject<HTMLDivElement>;
  tilt: { rotateX: number; rotateY: number };
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
} {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    setTilt({
      rotateY: percentX * maxTilt,
      rotateX: -percentY * maxTilt,
    });
  }, [maxTilt]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return { ref, tilt, handleMouseMove, handleMouseLeave };
}

/**
 * Tracks the overall scroll progress of the page as a value between 0 and 1.
 *
 * This hook is useful for creating progress indicators, scroll-based navigation
 * highlights, or animations that depend on how far the user has scrolled through
 * the entire document.
 *
 * @returns A number from 0 (top of page) to 1 (bottom of page) representing
 *   the current scroll position. The value is clamped to [0, 1] to handle
 *   edge cases like elastic scrolling on mobile.
 *
 * @example
 * ```tsx
 * function ReadingProgressBar() {
 *   const progress = useScrollProgress();
 *
 *   return (
 *     <div
 *       style={{
 *         position: 'fixed',
 *         top: 0,
 *         left: 0,
 *         width: `${progress * 100}%`,
 *         height: '3px',
 *         background: 'linear-gradient(90deg, #00a86b, #00d4aa)',
 *         zIndex: 1000
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Trigger animation at specific scroll points
 * function ScrollTriggeredAnimation() {
 *   const progress = useScrollProgress();
 *   const isHalfwayDown = progress > 0.5;
 *
 *   return (
 *     <div className={isHalfwayDown ? 'animate-in' : ''}>
 *       Content that animates halfway through the page
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * This hook calculates progress based on the entire document height minus
 * the viewport height. On very short pages where content fits within the
 * viewport, the progress will always be 0.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const totalScrollable = documentHeight - windowHeight;
      const currentProgress = totalScrollable > 0 ? scrollTop / totalScrollable : 0;

      setProgress(Math.min(Math.max(currentProgress, 0), 1));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
