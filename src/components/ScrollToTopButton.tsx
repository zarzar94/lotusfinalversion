/**
 * ScrollToTopButton - Floating button to scroll back to top
 * Shows after scrolling down a certain amount
 * Uses consolidated scroll manager for better performance
 */

import { memo, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollPastThreshold } from '../hooks/useScrollManager';
import { positionInlineStart } from '../utils/rtl';
import { keyframes } from '../utils/animations';
import { brandCyan, brandPurple, radius, transitions } from './styles';

interface ScrollToTopButtonProps {
  threshold?: number;
  bottom?: number;
}

function ScrollToTopButton({ threshold = 400, bottom = 220 }: ScrollToTopButtonProps) {
  const { isArabic } = useLanguage();
  const isVisible = useScrollPastThreshold(threshold);
  const [isHovered, setIsHovered] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  if (!isVisible) return null;

  const label = isArabic ? 'العودة للأعلى' : 'Scroll to top';

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={label}
      title={label}
      style={{
        position: 'fixed',
        bottom,
        ...positionInlineStart(isArabic, 24),
        width: 48,
        height: 48,
        borderRadius: radius.lg,
        background: isHovered
          ? `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`
          : 'rgba(11,15,28,0.9)',
        border: `1px solid ${isHovered ? brandCyan : 'rgba(143,211,204,0.3)'}`,
        color: isHovered ? '#fff' : brandCyan,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        boxShadow: isHovered
          ? `0 8px 30px ${brandCyan}40`
          : '0 4px 20px rgba(0,0,0,0.3)',
        transition: transitions.spring,
        transform: isHovered ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
        zIndex: 90,
        backdropFilter: 'blur(10px)',
        animation: 'fadeInUp 0.3s ease-out',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{
          transition: transitions.normal,
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>

      <style>{`
        ${keyframes.fadeInUp}
        @media (prefers-reduced-motion: reduce) {
          @keyframes fadeInUp {
            from, to { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </button>
  );
}

export default memo(ScrollToTopButton);
