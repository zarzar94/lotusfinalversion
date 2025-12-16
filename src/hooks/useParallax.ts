import { useState, useEffect, useRef, useCallback } from 'react';

interface ParallaxConfig {
  speed?: number;
  direction?: 'up' | 'down';
  startOffset?: number;
  disabled?: boolean;
}

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

interface ScrollRevealConfig {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

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
