import { useEffect, useRef } from 'react';
import { useGamification } from '../context/GamificationContext';

/**
 * Invisible component that tracks scroll progress and updates gamification context
 * Triggers achievements when user scrolls through page content
 */
export default function ScrollProgressTracker() {
  const { updateScrollProgress } = useGamification();
  const lastProgressRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) return;

      const progress = Math.round((scrollTop / docHeight) * 100);

      // Only update if progress increased significantly (reduces re-renders)
      if (progress > lastProgressRef.current + 2 || progress >= 100) {
        lastProgressRef.current = progress;
        updateScrollProgress(progress);
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollProgress]);

  // This component renders nothing - it only tracks scroll
  return null;
}
