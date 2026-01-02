/**
 * SectionNav - Navigation component for main platform sections
 * Provides quick access to different sections from dashboards
 */

import { memo, useMemo, type ReactNode } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  BookIcon,
  BrainCircuitIcon,
  GamepadIcon,
  InfoIcon,
  PhoneIcon,
  type IconProps,
  type IconTone,
} from '../icons/index';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
  transitions,
  breakpoints,
} from '../styles';

// Section definitions matching the header navigation
interface SectionItem {
  id: string;
  href: string;
  labelEn: string;
  labelAr: string;
  icon: (props: IconProps) => ReactNode;
  tone: IconTone;
  color: string;
  description: string;
  descriptionAr: string;
}

const SECTIONS: SectionItem[] = [
  {
    id: 'overview',
    href: '/#overview',
    labelEn: 'Program',
    labelAr: 'auto.SectionNav.k1',
    icon: BookIcon,
    tone: 'cyan',
    color: brandCyan,
    description: 'Learn about AIT therapy',
    descriptionAr: 'auto.SectionNav.k2',
  },
  {
    id: 'checklist',
    href: '/#checklist',
    labelEn: 'Neural Scanner',
    labelAr: 'auto.SectionNav.k3',
    icon: BrainCircuitIcon,
    tone: 'purple',
    color: brandPurple,
    description: 'Auditory processing assessment',
    descriptionAr: 'auto.SectionNav.k4',
  },
  {
    id: 'games',
    href: '/#modules',
    labelEn: 'Games',
    labelAr: 'auto.SectionNav.k5',
    icon: GamepadIcon,
    tone: 'pink',
    color: brandPink,
    description: 'Brain training activities',
    descriptionAr: 'auto.SectionNav.k6',
  },
  {
    id: 'faq',
    href: '/#faq',
    labelEn: 'FAQ',
    labelAr: 'auto.SectionNav.k7',
    icon: InfoIcon,
    tone: 'warning',
    color: colors.warning,
    description: 'Frequently asked questions',
    descriptionAr: 'auto.SectionNav.k8',
  },
  {
    id: 'contact',
    href: '/#contact',
    labelEn: 'Contact',
    labelAr: 'auto.SectionNav.k9',
    icon: PhoneIcon,
    tone: 'success',
    color: colors.success,
    description: 'Get in touch with us',
    descriptionAr: 'auto.SectionNav.k10',
  },
];

interface SectionNavProps {
  /** Show only specific sections by ID */
  include?: string[];
  /** Hide specific sections by ID */
  exclude?: string[];
  /** Display mode: 'grid' (cards) or 'pills' (compact) */
  variant?: 'grid' | 'pills';
  /** Show section descriptions (only in grid mode) */
  showDescriptions?: boolean;
  /** Title above the navigation */
  title?: string;
  titleAr?: string;
}

function SectionNav({
  include,
  exclude,
  variant = 'pills',
  showDescriptions = true,
  title,
  titleAr,
}: SectionNavProps) {
  const { isArabic, direction, t } = useLanguage();
  const filteredSections = useMemo(() => {
    let sections = SECTIONS;
    if (include?.length) {
      sections = sections.filter(s => include.includes(s.id));
    }
    if (exclude?.length) {
      sections = sections.filter(s => !exclude.includes(s.id));
    }
    return sections;
  }, [include, exclude]);

  const displayTitle = isArabic ? (titleAr || '?????? ??????') : (title || 'Explore Platform');

  // Responsive CSS
  const responsiveCss = `
    .section-nav-grid {
      display: grid;
      gap: ${spacing[3]}px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
    @media (max-width: ${breakpoints.sm}px) {
      .section-nav-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md}px) {
      .section-nav-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .section-nav-pills {
      display: flex;
      flex-wrap: wrap;
      gap: ${spacing[2]}px;
      justify-content: ${isArabic ? 'flex-end' : 'flex-start'};
    }
    @media (max-width: ${breakpoints.sm}px) {
      .section-nav-pills {
        flex-direction: column;
      }
      .section-nav-pills a {
        width: 100%;
        justify-content: center;
      }
    }
    .section-card:hover {
      transform: translateY(-4px);
      border-color: var(--hover-color);
      box-shadow: 0 12px 32px rgba(0,0,0,0.25);
    }
    .section-pill:hover {
      border-color: var(--hover-color);
      background: var(--hover-bg);
    }
  `;

  if (variant === 'grid') {
    return (
      <div style={{ direction }}>
        <style>{responsiveCss}</style>
        {(title || titleAr) && (
          <h3
            style={{
              margin: `0 0 ${spacing[4]}px`,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
            }}
          >
            {displayTitle}
          </h3>
        )}
        <div className="section-nav-grid">
          {filteredSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <a
                key={section.id}
                href={section.href}
                className="section-card"
                style={{
                  '--hover-color': section.color,
                  textDecoration: 'none',
                  padding: spacing[4],
                  background: `linear-gradient(135deg, ${section.color}08, transparent)`,
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: radius.xl,
                  transition: transitions.bounce,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing[2],
                } as React.CSSProperties}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: radius.lg,
                    background: `${section.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent size={22} tone={section.tone} />
                </div>
                <div
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: typography.weight.bold,
                    color: colors.text.primary,
                  }}
                >
                  {isArabic ? t(section.labelAr, section.labelEn) : section.labelEn}
                </div>
                {showDescriptions && (
                  <div
                    style={{
                      fontSize: typography.size.xs,
                      color: colors.text.muted,
                      lineHeight: typography.lineHeight.relaxed,
                    }}
                  >
                    {isArabic ? t(section.descriptionAr, section.description) : section.description}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  // Pills variant (compact)
  return (
    <div style={{ direction }}>
      <style>{responsiveCss}</style>
      {(title || titleAr) && (
        <h3
          style={{
            margin: `0 0 ${spacing[3]}px`,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: colors.text.muted,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {displayTitle}
        </h3>
      )}
      <div className="section-nav-pills">
        {filteredSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <a
              key={section.id}
              href={section.href}
              className="section-pill"
              style={{
                '--hover-color': `${section.color}60`,
                '--hover-bg': `${section.color}15`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2]}px ${spacing[3]}px`,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.full,
                textDecoration: 'none',
                color: colors.text.primary,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                transition: transitions.fast,
                whiteSpace: 'nowrap',
              } as React.CSSProperties}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: radius.md,
                  background: `${section.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconComponent size={16} tone={section.tone} />
              </span>
              {isArabic ? t(section.labelAr, section.labelEn) : section.labelEn}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default memo(SectionNav);
