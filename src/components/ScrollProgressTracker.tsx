import { useEffect, useRef } from 'react';
import { useGamification } from '../context/GamificationContext';
import { useOnScroll } from '../hooks/useScrollManager';

/**
 * Invisible component that tracks scroll progress and updates gamification context
 * Triggers achievements when user scrolls through page content
 * Uses consolidated scroll manager for better performance
 */
export default function ScrollProgressTracker() {
  const { updateScrollProgress } = useGamification();
  const lastProgressRef = useRef(0);

  useOnScroll(({ progress }) => {
    const progressPercent = Math.round(progress * 100);

    // Only update if progress increased significantly (reduces re-renders)
    if (progressPercent > lastProgressRef.current + 2 || progressPercent >= 100) {
      lastProgressRef.current = progressPercent;
      updateScrollProgress(progressPercent);
    }
  });

  // This component renders nothing - it only tracks scroll
  return null;
}
