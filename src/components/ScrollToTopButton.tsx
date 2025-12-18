/**
 * ScrollToTopButton - Floating button to scroll back to top
 * Shows after scrolling down a certain amount
 */

import { memo, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { brandCyan, brandPurple, radius, shadows } from './styles';

interface ScrollToTopButtonProps {
  threshold?: number;
  bottom?: number;
}

function ScrollToTopButton({ threshold = 400, bottom = 220 }: ScrollToTopButtonProps) {
  const { isArabic } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={isArabic ? 'العودة للأعلى' : 'Scroll to top'}
      title={isArabic ? 'العودة للأعلى' : 'Back to top'}
      style={{
        position: 'fixed',
        bottom,
        right: isArabic ? 'auto' : 24,
        left: isArabic ? 24 : 'auto',
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
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
        style={{
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </button>
  );
}

export default memo(ScrollToTopButton);
