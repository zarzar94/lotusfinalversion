import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVisitorMode, type VisitorMode } from '../context/VisitorModeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  typography,
  spacing,
  radius,
  transitions,
  colors,
} from './styles';
import { BrainIcon, HeadphonesIcon, PhoneIcon, DownloadIcon, CheckCircleIcon } from './Icons';

// Quick action configuration per visitor mode
interface QuickAction {
  id: string;
  icon: React.ReactNode;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  linkTo: string;
  isPrimary?: boolean;
  isExternal?: boolean;
  downloadFile?: string;
}

interface ModeQuickActions {
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  actions: QuickAction[];
}

const QUICK_ACTIONS: Record<VisitorMode, ModeQuickActions> = {
  school: {
    titleEn: 'School Quick Actions',
    titleAr: 'auto.QuickActionsPanel.k3',
    subtitleEn: 'Get started with your school screening program',
    subtitleAr: 'auto.QuickActionsPanel.k4',
    actions: [
      {
        id: 'demo',
        icon: <HeadphonesIcon size={24} color="#fff" />,
        titleEn: 'Request School Demo',
        titleAr: 'auto.QuickActionsPanel.k5',
        descriptionEn: 'Schedule a presentation for your administration',
        descriptionAr: 'auto.QuickActionsPanel.k6',
        linkTo: '/contact',
        isPrimary: true,
      },
      {
        id: 'pilot',
        icon: <DownloadIcon size={24} color="#fff" />,
        titleEn: 'Download Pilot Kit',
        titleAr: 'auto.QuickActionsPanel.k7',
        descriptionEn: 'Get our school partnership materials',
        descriptionAr: 'auto.QuickActionsPanel.k8',
        linkTo: '/downloads/school-pilot-kit.pdf',
        isExternal: true,
        downloadFile: 'school-pilot-kit.pdf',
      },
      {
        id: 'assess',
        icon: <BrainIcon size={24} color="#fff" />,
        titleEn: 'Try Group Screening',
        titleAr: 'auto.QuickActionsPanel.k9',
        descriptionEn: 'Preview our classroom assessment tools',
        descriptionAr: 'auto.QuickActionsPanel.k10',
        linkTo: '/assessment',
      },
      {
        id: 'results',
        icon: '📊',
        titleEn: 'View Sample Reports',
        titleAr: 'auto.QuickActionsPanel.k11',
        descriptionEn: 'See what school reports look like',
        descriptionAr: 'auto.QuickActionsPanel.k12',
        linkTo: '/results',
      },
    ],
  },
  parent: {
    titleEn: 'Parent Quick Actions',
    titleAr: 'auto.QuickActionsPanel.k13',
    subtitleEn: 'Start your child\'s auditory assessment journey',
    subtitleAr: 'auto.QuickActionsPanel.k14',
    actions: [
      {
        id: 'screening',
        icon: <BrainIcon size={24} color="#fff" />,
        titleEn: 'Book Free Screening',
        titleAr: 'auto.QuickActionsPanel.k15',
        descriptionEn: 'Schedule your child\'s initial assessment',
        descriptionAr: 'auto.QuickActionsPanel.k16',
        linkTo: '/contact',
        isPrimary: true,
      },
      {
        id: 'checklist',
        icon: <CheckCircleIcon size={24} color="#fff" />,
        titleEn: 'Take Checklist',
        titleAr: 'auto.QuickActionsPanel.k17',
        descriptionEn: 'Complete our auditory processing questionnaire',
        descriptionAr: 'auto.QuickActionsPanel.k18',
        linkTo: '/assessment#checklist',
      },
      {
        id: 'soundlab',
        icon: <HeadphonesIcon size={24} color="#fff" />,
        titleEn: 'Try Sound Lab',
        titleAr: 'auto.QuickActionsPanel.k19',
        descriptionEn: 'Interactive auditory exploration games',
        descriptionAr: 'auto.QuickActionsPanel.k20',
        linkTo: '/assessment#games',
      },
      {
        id: 'program',
        icon: '📖',
        titleEn: 'Learn About Program',
        titleAr: 'auto.QuickActionsPanel.k21',
        descriptionEn: 'Understand how Bérard AIT works',
        descriptionAr: 'auto.QuickActionsPanel.k22',
        linkTo: '/program',
      },
    ],
  },
  clinician: {
    titleEn: 'Clinician Quick Actions',
    titleAr: 'auto.QuickActionsPanel.k23',
    subtitleEn: 'Professional resources and referral pathways',
    subtitleAr: 'auto.QuickActionsPanel.k24',
    actions: [
      {
        id: 'protocol',
        icon: '📋',
        titleEn: 'View Clinical Protocol',
        titleAr: 'auto.QuickActionsPanel.k25',
        descriptionEn: 'Review our evidence-based methodology',
        descriptionAr: 'auto.QuickActionsPanel.k26',
        linkTo: '/science',
        isPrimary: true,
      },
      {
        id: 'referral',
        icon: <PhoneIcon size={24} color="#fff" />,
        titleEn: 'Referral Partnership',
        titleAr: 'auto.QuickActionsPanel.k27',
        descriptionEn: 'Establish a professional referral relationship',
        descriptionAr: 'auto.QuickActionsPanel.k28',
        linkTo: '/contact',
      },
      {
        id: 'research',
        icon: '🔬',
        titleEn: 'Research & Evidence',
        titleAr: 'auto.QuickActionsPanel.k29',
        descriptionEn: 'Access studies and clinical documentation',
        descriptionAr: 'auto.QuickActionsPanel.k30',
        linkTo: '/science',
      },
      {
        id: 'results',
        icon: '📊',
        titleEn: 'Clinical Outcomes',
        titleAr: 'auto.QuickActionsPanel.k31',
        descriptionEn: 'Review documented improvement metrics',
        descriptionAr: 'auto.QuickActionsPanel.k32',
        linkTo: '/results',
      },
    ],
  },
};

export default function QuickActionsPanel() {
  const { mode: visitorMode, config: visitorConfig } = useVisitorMode();
  const { isArabic, t } = useLanguage();
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const modeActions = QUICK_ACTIONS[visitorMode];

  const css = useMemo(() => `
    @keyframes quickActionSlide {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmerBorder {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .quick-action-card {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .quick-action-card:hover {
      transform: translateY(-6px) scale(1.02);
    }
    .quick-action-primary {
      background: linear-gradient(135deg, ${visitorConfig.color}, ${visitorConfig.color}cc) !important;
    }
    .quick-action-primary::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 18px;
      background: linear-gradient(90deg, ${visitorConfig.color}, ${brandCyan}, ${brandPurple}, ${visitorConfig.color});
      background-size: 300% 300%;
      animation: shimmerBorder 4s ease infinite;
      z-index: -1;
      opacity: 0.5;
    }
    @media (max-width: 640px) {
      .quick-actions-grid {
        grid-template-columns: 1fr !important;
      }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      .quick-actions-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
  `, [visitorConfig.color]);

  return (
    <section style={{
      padding: `${spacing[10]}px ${spacing[4]}px`,
      background: 'linear-gradient(180deg, rgba(11,15,28,0.4) 0%, rgba(5,6,13,0.6) 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{css}</style>

      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        background: `radial-gradient(circle, ${visitorConfig.color}08, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: spacing[8] }}>
          {/* Mode badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            background: `${visitorConfig.color}15`,
            border: `1px solid ${visitorConfig.color}30`,
            borderRadius: 30,
            marginBottom: spacing[3],
          }}>
            <span style={{ fontSize: 18 }}>{visitorConfig.icon}</span>
            <span style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: visitorConfig.color,
            }}>
              {isArabic ? t(visitorConfig.labelAr, visitorConfig.label) : visitorConfig.label}
            </span>
          </div>

          <h2 style={{
            margin: 0,
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[2],
          }}>
            {isArabic ? t(modeActions.titleAr, modeActions.titleEn) : modeActions.titleEn}
          </h2>
          <p style={{
            margin: 0,
            fontSize: typography.size.base,
            color: colors.text.secondary,
          }}>
            {isArabic ? t(modeActions.subtitleAr, modeActions.subtitleEn) : modeActions.subtitleEn}
          </p>
        </div>

        {/* Actions Grid */}
        <div
          className="quick-actions-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: spacing[4],
          }}
        >
          {modeActions.actions.map((action, index) => {
            const isHovered = hoveredAction === action.id;
            const isPrimary = action.isPrimary;

            const cardContent = (
              <div
                className={`quick-action-card ${isPrimary ? 'quick-action-primary' : ''}`}
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
                style={{
                  position: 'relative',
                  padding: spacing[5],
                  borderRadius: 16,
                  background: isPrimary
                    ? `linear-gradient(135deg, ${visitorConfig.color}, ${visitorConfig.color}cc)`
                    : 'rgba(11,15,28,0.7)',
                  border: `1px solid ${isPrimary ? 'transparent' : isHovered ? visitorConfig.color + '50' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: spacing[3],
                  animation: `quickActionSlide 0.5s ease-out ${index * 0.1}s backwards`,
                  boxShadow: isHovered
                    ? `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${visitorConfig.color}20`
                    : isPrimary
                      ? `0 10px 30px ${visitorConfig.color}30`
                      : '0 4px 20px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  height: '100%',
                  minHeight: 180,
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: isPrimary
                    ? 'rgba(255,255,255,0.2)'
                    : `linear-gradient(135deg, ${visitorConfig.color}25, ${visitorConfig.color}10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  color: isPrimary ? '#fff' : visitorConfig.color,
                  transition: 'transform 0.3s ease',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}>
                  {typeof action.icon === 'string' ? action.icon : action.icon}
                </div>

                {/* Title */}
                <div style={{
                  fontWeight: typography.weight.bold,
                  fontSize: typography.size.base,
                  color: isPrimary ? '#fff' : colors.text.primary,
                  lineHeight: 1.3,
                }}>
                  {isArabic ? t(action.titleAr, action.titleEn) : action.titleEn}
                </div>

                {/* Description */}
                <div style={{
                  fontSize: typography.size.xs,
                  color: isPrimary ? 'rgba(255,255,255,0.8)' : colors.text.muted,
                  lineHeight: 1.5,
                  flex: 1,
                }}>
                  {isArabic ? t(action.descriptionAr, action.descriptionEn) : action.descriptionEn}
                </div>

                {/* Arrow indicator */}
                <div style={{
                  fontSize: 16,
                  color: isPrimary ? 'rgba(255,255,255,0.7)' : visitorConfig.color,
                  transform: isHovered ? 'translateX(-4px)' : 'translateX(0)',
                  transition: 'transform 0.3s ease',
                }}>
                  {isArabic ? '←' : '→'}
                </div>

                {/* Primary badge */}
                {isPrimary && (
                  <div style={{
                    position: 'absolute',
                    top: -10,
                    right: isArabic ? 'auto' : -10,
                    left: isArabic ? -10 : 'auto',
                    padding: '4px 10px',
                    background: '#fff',
                    borderRadius: 8,
                    fontSize: 10,
                    fontWeight: 800,
                    color: visitorConfig.color,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}>
                    {t('auto.QuickActionsPanel.k1', "Recommended")}
                  </div>
                )}
              </div>
            );

            // Render as Link or anchor based on action type
            if (action.isExternal || action.downloadFile) {
              return (
                <a
                  key={action.id}
                  href={action.linkTo}
                  download={action.downloadFile}
                  target={action.isExternal ? '_blank' : undefined}
                  rel={action.isExternal ? 'noopener noreferrer' : undefined}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <Link
                key={action.id}
                to={action.linkTo}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>

        {/* Bottom hint */}
        <div style={{
          marginTop: spacing[6],
          textAlign: 'center',
          fontSize: typography.size.xs,
          color: colors.text.muted,
        }}>
          {t('auto.QuickActionsPanel.k2', "You can switch browsing mode from the top navigation")
          }
        </div>
      </div>
    </section>
  );
}
