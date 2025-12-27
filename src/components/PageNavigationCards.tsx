/**
 * Page Navigation Cards - standalone navigation section
 */

import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CircuitDecoration from './CircuitDecoration';
import FadeIn from './FadeIn';
import { brandCyan, brandPurple, brandPink, colors, typography, spacing, radius } from './styles';
import { renderLabIcon } from './icons/index';
import { useLanguage } from '../context/LanguageContext';

// Enhanced Navigation Card Component
const NavigationCard = memo(({
  page,
  isArabic,
  onClick,
}: {
  page: {
    id: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    icon: string;
    color: string;
    path: string;
  };
  isArabic: boolean;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        padding: spacing[6],
        background: isHovered
          ? `linear-gradient(135deg, ${colors.surface.card}, ${page.color}08)`
          : colors.surface.card,
        border: `1px solid ${isHovered ? page.color : colors.border.default}`,
        borderRadius: radius.xl,
        cursor: 'pointer',
        textAlign: isArabic ? 'right' : 'left',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
        overflow: 'hidden',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
          ? `0 16px 40px ${page.color}25, 0 0 0 1px ${page.color}30`
          : 'none',
      }}
    >
      {/* Animated gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${isArabic ? 'right' : 'left'} top, ${page.color}12 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Animated corner accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          [isArabic ? 'left' : 'right']: 0,
          width: 80,
          height: 80,
          background: `linear-gradient(135deg, transparent 50%, ${page.color}15 50%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: radius.lg,
          background: isHovered
            ? `linear-gradient(135deg, ${page.color}25, ${page.color}15)`
            : `${page.color}15`,
          border: `1px solid ${isHovered ? `${page.color}40` : 'transparent'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          marginBottom: spacing[4],
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0)',
          boxShadow: isHovered ? `0 8px 20px ${page.color}30` : 'none',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {renderLabIcon(page.icon, { size: 28, style: { color: page.color } })}
      </div>

      {/* Title */}
      <h3
        style={{
          margin: 0,
          fontSize: typography.size.lg,
          fontWeight: typography.weight.bold,
          color: isHovered ? page.color : colors.text.primary,
          marginBottom: spacing[2],
          transition: 'color 0.3s ease',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {isArabic ? t(page.titleAr, page.title) : page.title}
      </h3>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: typography.size.sm,
          color: colors.text.secondary,
          lineHeight: typography.lineHeight.relaxed,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {isArabic ? t(page.descriptionAr, page.description) : page.description}
      </p>

      {/* Arrow indicator with animation */}
      <div
        style={{
          position: 'absolute',
          bottom: spacing[4],
          [isArabic ? 'left' : 'right']: spacing[4],
          color: page.color,
          fontSize: 22,
          opacity: isHovered ? 1 : 0.5,
          transition: 'all 0.3s ease',
          transform: isHovered
            ? `translateX(${isArabic ? '-8px' : '8px'})`
            : 'translateX(0)',
          zIndex: 1,
        }}
      >
        {isArabic ? '←' : '→'}
      </div>

      {/* Pulse ring on hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: 28,
            [isArabic ? 'right' : 'left']: 28,
            width: 64,
            height: 64,
            borderRadius: radius.lg,
            border: `2px solid ${page.color}`,
            animation: 'navCardPulse 1.5s ease-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}
    </button>
  );
});
NavigationCard.displayName = 'NavigationCard';

// Quick Navigation Cards to other pages
const PageNavigationCards = memo(({ isArabic }: { isArabic: boolean }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const pages = [
    {
      id: 'assessment',
      title: 'Self Assessment',
      titleAr: 'auto.PageNavigationCards.k5',
      description: 'Interactive diagnostic tools and games',
      descriptionAr: 'auto.PageNavigationCards.k6',
      icon: '🎯',
      color: brandCyan,
      path: '/assessment',
    },
    {
      id: 'program',
      title: 'Treatment Program',
      titleAr: 'auto.PageNavigationCards.k7',
      description: 'Learn about our 20-session protocol',
      descriptionAr: 'auto.PageNavigationCards.k8',
      icon: '📋',
      color: brandPurple,
      path: '/program',
    },
    {
      id: 'science',
      title: 'Science & Research',
      titleAr: 'auto.PageNavigationCards.k9',
      description: 'Neuroplasticity and audio processing',
      descriptionAr: 'auto.PageNavigationCards.k10',
      icon: '🧠',
      color: brandPink,
      path: '/science',
    },
    {
      id: 'results',
      title: 'Results & Evidence',
      titleAr: 'auto.PageNavigationCards.k11',
      description: 'Success stories and testimonials',
      descriptionAr: 'auto.PageNavigationCards.k12',
      icon: '📊',
      color: colors.success,
      path: '/results',
    },
    {
      id: 'resources',
      title: 'Resources',
      titleAr: 'auto.PageNavigationCards.k13',
      description: 'Videos, presentations, and FAQs',
      descriptionAr: 'auto.PageNavigationCards.k14',
      icon: '📚',
      color: colors.warning,
      path: '/resources',
    },
    {
      id: 'about',
      title: 'About Us',
      titleAr: 'auto.PageNavigationCards.k15',
      description: 'Meet our specialist and learn about the centre',
      descriptionAr: 'auto.PageNavigationCards.k16',
      icon: '🏛️',
      color: brandPurple,
      path: '/about',
    },
    {
      id: 'contact',
      title: 'Get Started',
      titleAr: 'auto.PageNavigationCards.k17',
      description: 'Contact us or fill out intake form',
      descriptionAr: 'auto.PageNavigationCards.k18',
      icon: '✉️',
      color: brandCyan,
      path: '/contact',
    },
  ];

  const css = `
    @keyframes navCardPulse {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    @keyframes sectionGlow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.5; }
    }
    @media (max-width: 640px) {
      .nav-section {
        padding: ${spacing[6]}px ${spacing[3]}px !important;
      }
      .nav-section-title {
        font-size: ${typography.size['2xl']}px !important;
      }
      .nav-cards-grid {
        gap: ${spacing[3]}px !important;
      }
    }
  `;

  return (
    <section
      id="navigate"
      className="nav-section"
      style={{
        padding: `${spacing[10]}px ${spacing[4]}px`,
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <style>{css}</style>

      {/* Circuit decoration for this section */}
      <CircuitDecoration variant="sparse" opacity={0.1} />

      {/* Section header with enhanced styling */}
      <div style={{ textAlign: 'center', marginBottom: spacing[10], position: 'relative' }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[1.5]}px ${spacing[4]}px`,
            background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
            border: `1px solid ${brandCyan}25`,
            borderRadius: radius.full,
            marginBottom: spacing[4],
          }}
        >
          <span style={{ fontSize: 14 }}>
            {renderLabIcon('🧭', { size: 14, tone: 'cyan' })}
          </span>
          <span
            style={{
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: brandCyan,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {t('auto.PageNavigationCards.k1', "Quick Navigation")}
          </span>
        </div>

        <h2
          className="nav-section-title"
          style={{
            fontSize: typography.size['3xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[3],
            background: `linear-gradient(135deg, ${colors.text.primary}, ${brandCyan})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('auto.PageNavigationCards.k2', "Explore the Platform")}
        </h2>
        <p
          style={{
            fontSize: typography.size.lg,
            color: colors.text.secondary,
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          {t('auto.PageNavigationCards.k3', "Choose the section that fits your needs and explore all available resources")}
        </p>
      </div>

      {/* Cards grid */}
      <div
        className="nav-cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: spacing[5],
        }}
      >
        {pages.map((page, index) => (
          <FadeIn key={page.id} delay={index * 100} direction="up" distance={40}>
            <NavigationCard
              page={page}
              isArabic={isArabic}
              onClick={() => navigate(page.path)}
            />
          </FadeIn>
        ))}
      </div>

      {/* Bottom decorative element */}
      <div
        style={{
          marginTop: spacing[10],
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[3],
            padding: `${spacing[3]}px ${spacing[5]}px`,
            background: colors.surface.card,
            border: `1px solid ${colors.border.subtle}`,
            borderRadius: radius.full,
          }}
        >
          <span style={{ fontSize: 16 }}>
            {renderLabIcon('💡', { size: 16, tone: 'cyan' })}
          </span>
          <span
            style={{
              fontSize: typography.size.sm,
              color: colors.text.muted,
            }}
          >
            {t('auto.PageNavigationCards.k4', "Tip: Start with Self Assessment to understand your needs")}
          </span>
        </div>
      </div>
    </section>
  );
});
PageNavigationCards.displayName = 'PageNavigationCards';

export default PageNavigationCards;
