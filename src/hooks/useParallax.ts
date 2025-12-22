/**
 * @fileoverview Parallax and Scroll Animation Hooks
 *
 * A collection of React hooks for creating engaging scroll-based and mouse-based
 * visual effects. These hooks are designed for performance with passive event
 * listeners and optimized state updates.
 *
 * @module hooks/useParallax
 *
 * @example
 * // Basic parallax effect on a hero section
 * import { useParallax } from './hooks/useParallax';
 *
 * function HeroSection() {
 *   const { ref, offset } = useParallax({ speed: 0.3 });
 *   return (
 *     <div ref={ref} style={{ transform: `translateY(${offset}px)` }}>
 *       <h1>Welcome</h1>
 *     </div>
 *   );
 * }
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Configuration options for the useParallax hook.
 *
 * @interface ParallaxConfig
 * @property {number} [speed=0.5] - Parallax intensity multiplier (0-1 recommended).
 *   Higher values create more dramatic movement. Use values < 1 for subtle effects.
 * @property {'up' | 'down'} [direction='up'] - Direction of parallax movement.
 *   'up' moves element upward as user scrolls down (traditional parallax).
 *   'down' moves element downward as user scrolls down (reverse parallax).
 * @property {number} [startOffset=0] - Initial offset value in pixels.
 *   Use to position element before any scroll interaction.
 * @property {boolean} [disabled=false] - Disable parallax effect entirely.
 *   Useful for reduced motion preferences or mobile devices.
 */
interface ParallaxConfig {
  speed?: number;
  direction?: 'up' | 'down';
  startOffset?: number;
  disabled?: boolean;
}

/**
 * Creates a scroll-based parallax effect for an element.
 *
 * This hook calculates a vertical offset based on the element's position
 * relative to the viewport as the user scrolls. The offset can be applied
 * to CSS transforms for smooth parallax animations.
 *
 * @param {ParallaxConfig} [config={}] - Configuration options
 * @returns {{ ref: React.RefObject<HTMLDivElement>, offset: number }}
 *   - `ref`: Attach to the target element
 *   - `offset`: Current parallax offset in pixels (apply to translateY)
 *
 * @example
 * // Subtle background parallax
 * const { ref, offset } = useParallax({ speed: 0.2, direction: 'up' });
 * return (
 *   <div
 *     ref={ref}
 *     style={{ transform: `translateY(${offset}px)` }}
 *   >
 *     <img src="/background.jpg" alt="Background" />
 *   </div>
 * );
 *
 * @example
 * // Respecting reduced motion preferences
 * const prefersReducedMotion = usePrefersReducedMotion();
 * const { ref, offset } = useParallax({
 *   speed: 0.5,
 *   disabled: prefersReducedMotion,
 * });
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
 */
export function useParallax({
  speed = 0.5,
  direction = 'up',
  startOffset = 0,
  disabled = false,
}: ParallaxConfig = {}) {
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
 * @property {number} [threshold=0.2] - Visibility threshold (0-1).
 *   0.2 means element is visible when 20% is in viewport.
 * @property {string} [rootMargin='0px'] - Margin around the viewport root.
 *   Use negative values to trigger earlier (e.g., '-100px').
 * @property {boolean} [once=true] - If true, element stays visible after first reveal.
 *   Set to false for elements that should hide when scrolled out of view.
 */
interface ScrollRevealConfig {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Detects when an element enters the viewport for scroll-triggered animations.
 *
 * Uses IntersectionObserver API for performant visibility detection.
 * Returns both a boolean visibility state and a continuous progress value
 * (0-1) indicating how much of the element is visible.
 *
 * @param {ScrollRevealConfig} [config={}] - Configuration options
 * @returns {{
 *   ref: React.RefObject<HTMLDivElement>,
 *   isVisible: boolean,
 *   progress: number
 * }}
 *   - `ref`: Attach to the target element
 *   - `isVisible`: True when element is in viewport (stays true if `once` is enabled)
 *   - `progress`: Visibility ratio from 0 (not visible) to 1 (fully visible)
 *
 * @example
 * // Fade-in animation on scroll
 * const { ref, isVisible } = useScrollReveal({ threshold: 0.3 });
 * return (
 *   <section
 *     ref={ref}
 *     style={{
 *       opacity: isVisible ? 1 : 0,
 *       transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
 *       transition: 'opacity 0.6s, transform 0.6s',
 *     }}
 *   >
 *     <h2>Feature Section</h2>
 *   </section>
 * );
 *
 * @example
 * // Progressive reveal based on visibility percentage
 * const { ref, progress } = useScrollReveal({ once: false });
 * return (
 *   <div ref={ref} style={{ opacity: progress }}>
 *     Fades in/out based on scroll position
 *   </div>
 * );
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
export function useScrollReveal({
  threshold = 0.2,
  rootMargin = '0px',
  once = true,
}: ScrollRevealConfig = {}) {
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
 * Creates a mouse-following parallax effect for an element.
 *
 * Tracks mouse position relative to the element's center and returns
 * x/y offsets that can be applied to transforms. Creates an interactive
 * "floating" effect where elements subtly follow the cursor.
 *
 * @param {number} [intensity=0.02] - Movement intensity multiplier.
 *   Lower values (0.01-0.05) create subtle effects.
 *   Higher values (0.1+) create more dramatic movement.
 *
 * @returns {{
 *   ref: React.RefObject<HTMLDivElement>,
 *   position: { x: number, y: number }
 * }}
 *   - `ref`: Attach to the container element (defines center point)
 *   - `position`: Current x/y offset in pixels (apply to translate)
 *
 * @example
 * // Floating card effect
 * const { ref, position } = useMouseParallax(0.03);
 * return (
 *   <div
 *     ref={ref}
 *     style={{
 *       transform: `translate(${position.x}px, ${position.y}px)`,
 *       transition: 'transform 0.1s ease-out',
 *     }}
 *   >
 *     <Card>Hover over me!</Card>
 *   </div>
 * );
 *
 * @example
 * // Layered parallax with different intensities
 * const layer1 = useMouseParallax(0.01);
 * const layer2 = useMouseParallax(0.03);
 * const layer3 = useMouseParallax(0.05);
 * // Apply different intensities to foreground/background layers
 */
export function useMouseParallax(intensity: number = 0.02) {
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
 * Creates a 3D tilt effect on mouse hover.
 *
 * Calculates rotateX and rotateY values based on mouse position within
 * the element, creating a perspective-aware tilt effect. Returns handlers
 * for mouse events that should be attached to the target element.
 *
 * @param {number} [maxTilt=10] - Maximum tilt angle in degrees.
 *   10-15 degrees creates a subtle effect.
 *   20+ degrees creates more dramatic tilting.
 *
 * @returns {{
 *   ref: React.RefObject<HTMLDivElement>,
 *   tilt: { rotateX: number, rotateY: number },
 *   handleMouseMove: (e: React.MouseEvent) => void,
 *   handleMouseLeave: () => void
 * }}
 *   - `ref`: Attach to the element (used for dimension calculations)
 *   - `tilt`: Current rotation values in degrees (apply to rotateX/rotateY)
 *   - `handleMouseMove`: Attach to onMouseMove event
 *   - `handleMouseLeave`: Attach to onMouseLeave event (resets tilt)
 *
 * @example
 * // 3D card tilt effect
 * const { ref, tilt, handleMouseMove, handleMouseLeave } = useTilt(15);
 * return (
 *   <div
 *     ref={ref}
 *     onMouseMove={handleMouseMove}
 *     onMouseLeave={handleMouseLeave}
 *     style={{
 *       transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
 *       transition: 'transform 0.1s ease-out',
 *     }}
 *   >
 *     <Card>Interactive 3D Card</Card>
 *   </div>
 * );
 *
 * @example
 * // Combined with shadow for depth effect
 * const { ref, tilt, handleMouseMove, handleMouseLeave } = useTilt(12);
 * const shadowX = tilt.rotateY * 2;
 * const shadowY = -tilt.rotateX * 2;
 * return (
 *   <div
 *     ref={ref}
 *     onMouseMove={handleMouseMove}
 *     onMouseLeave={handleMouseLeave}
 *     style={{
 *       transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
 *       boxShadow: `${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.2)`,
 *     }}
 *   />
 * );
 */
export function useTilt(maxTilt: number = 10) {
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
 * Tracks overall page scroll progress as a value from 0 to 1.
 *
 * Returns a normalized progress value representing how far the user
 * has scrolled through the entire document. Useful for scroll-driven
 * animations like progress bars, navigation indicators, or page-wide effects.
 *
 * @returns {number} Progress value from 0 (top of page) to 1 (bottom of page).
 *   Value is clamped between 0-1 and updates on every scroll event.
 *
 * @example
 * // Page scroll progress bar
 * const progress = useScrollProgress();
 * return (
 *   <div
 *     style={{
 *       position: 'fixed',
 *       top: 0,
 *       left: 0,
 *       width: `${progress * 100}%`,
 *       height: '4px',
 *       background: 'linear-gradient(to right, #00c6ff, #0072ff)',
 *     }}
 *   />
 * );
 *
 * @example
 * // Fade out header on scroll
 * const progress = useScrollProgress();
 * return (
 *   <header style={{ opacity: 1 - Math.min(progress * 3, 1) }}>
 *     <h1>Fades as you scroll</h1>
 *   </header>
 * );
 *
 * @example
 * // Change background color based on scroll
 * const progress = useScrollProgress();
 * const hue = Math.round(progress * 360);
 * return (
 *   <div style={{ background: `hsl(${hue}, 70%, 50%)` }}>
 *     Color shifts as you scroll through the page
 *   </div>
 * );
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
 */
export function useScrollProgress() {
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
