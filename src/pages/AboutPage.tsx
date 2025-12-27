/**
 * About Page - Centre Information and Specialist Profile
 * Features the lead practitioner and Lotus Holistic Centre details
 */

import { memo, useState } from 'react';
import Header from '../components/Header';
import BackgroundFX from '../components/BackgroundFX';
import Footer from '../components/Footer';
import WhatsAppFab from '../components/WhatsAppFab';
import ScrollToTopButton from '../components/ScrollToTopButton';
import FadeIn from '../components/FadeIn';
import CircuitDecoration from '../components/CircuitDecoration';
import { BackNavigation } from '../components/shared';
import {
  EyeIcon,
  MailIcon,
  MapPinIcon,
  ReportIcon,
  SchoolIcon,
  UserIcon,
  WaveformIcon,
  renderLabIcon,
} from '../components/icons';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { LabShell, LabShellContent } from '../components/labui/LabShell';
import { SPECIALIST, CENTRE_INFO } from '../data/specialist';
import { CLINIC } from '../data/clinic';
import { assetUrl } from '../utils/asset';
import {
  brandCyan,
  brandPurple,
  brandPink,
  brandColors,
  colors,
  typography,
  spacing,
  radius,
} from '../components/styles';

// ═══════════════════════════════════════════════════════════════════════════
// PAGE HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const PageHeader = memo(({ isArabic }: { isArabic: boolean }) => (
  <div
    className="about-page-header"
    style={{
      textAlign: 'center',
      padding: `0 ${spacing[4]}px ${spacing[6]}px`,
      maxWidth: 800,
      margin: '0 auto',
      position: 'relative',
    }}
  >
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: `${spacing[2]}px ${spacing[4]}px`,
        background: `${brandCyan}15`,
        borderRadius: radius.full,
        marginBottom: spacing[4],
      }}
    >
      <SchoolIcon tone="cyan" size={20} />
      <span
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: brandCyan,
        }}
      >
        {isArabic ? 'من نحن' : 'About Us'}
      </span>
    </div>

    <h1
      style={{
        fontSize: typography.size['4xl'],
        fontWeight: typography.weight.black,
        color: colors.text.primary,
        marginBottom: spacing[4],
        lineHeight: 1.2,
      }}
    >
      {isArabic ? 'مركز لوتس الشامل' : 'Lotus Holistic Centre'}
    </h1>

    <p
      style={{
        fontSize: typography.size.lg,
        color: colors.text.secondary,
        lineHeight: typography.lineHeight.relaxed,
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
      {isArabic
        ? 'رحلة من الخبرة والتميز في الرعاية الصحية الشاملة منذ عام 1994'
        : 'A journey of expertise and excellence in holistic healthcare since 1994'}
    </p>
  </div>
));
PageHeader.displayName = 'PageHeader';

// ═══════════════════════════════════════════════════════════════════════════
// SPECIALIST PROFILE SECTION
// ═══════════════════════════════════════════════════════════════════════════

const SpecialistProfile = memo(({ isArabic }: { isArabic: boolean }) => {
  const [imageError, setImageError] = useState(false);
  const specialist = SPECIALIST;

  return (
    <section
      style={{
        padding: `${spacing[10]}px ${spacing[4]}px`,
        maxWidth: 1000,
        margin: '0 auto',
      }}
    >
      {/* Section Title */}
      <div style={{ textAlign: 'center', marginBottom: spacing[8] }}>
        <h2
          style={{
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[2],
          }}
        >
          {isArabic ? 'الأخصائي المسؤول عن البرنامج' : 'Program Lead Specialist'}
        </h2>
        <p style={{ color: colors.text.secondary, fontSize: typography.size.md }}>
          {isArabic
            ? 'ممارس معتمد دولياً في طريقة Bérard AIT'
            : 'Internationally Certified Bérard AIT Practitioner'}
        </p>
      </div>

      {/* Profile Card */}
      <div
        className="specialist-profile-card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 320px) 1fr',
          gap: spacing[8],
          alignItems: 'start',
          background: colors.surface.card,
          borderRadius: radius['2xl'],
          border: `1px solid ${colors.border.subtle}`,
          padding: spacing[6],
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple}, ${brandPink})`,
          }}
        />

        {/* Profile Image Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[4],
          }}
        >
          {/* Profile Image with Lavender Background Circle */}
          <div
            className="specialist-image-container"
            style={{
              position: 'relative',
              width: 220,
              height: 220,
            }}
          >
            {/* Lavender background circle */}
            <div
              className="specialist-bg-circle"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${brandPurple}30, ${brandPink}25)`,
                zIndex: 0,
              }}
            />
            {/* Profile image container */}
            <div
              className="specialist-image-inner"
              style={{
                position: 'relative',
                width: 200,
                height: 220,
                borderRadius: `${radius.xl}px ${radius.xl}px ${radius['2xl']}px ${radius['2xl']}px`,
                overflow: 'hidden',
                boxShadow: `0 12px 40px ${brandPurple}25, 0 4px 16px rgba(0,0,0,0.15)`,
                background: colors.surface.card,
                zIndex: 1,
              }}
            >
              {!imageError ? (
                <img
                  src={assetUrl(specialist.image)}
                  alt={isArabic ? specialist.nameAr : specialist.nameEn}
                  onError={() => setImageError(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(180deg, ${brandPurple}15, ${brandCyan}10)`,
                    fontSize: 80,
                    opacity: 0.6,
                  }}
                >
                  <UserIcon tone="muted" size={80} />
                </div>
              )}
            </div>
          </div>

          {/* Name & Title */}
          <div style={{ textAlign: 'center' }}>
            <h3
              style={{
                fontSize: typography.size.xl,
                fontWeight: typography.weight.black,
                color: colors.text.primary,
                marginBottom: spacing[1],
              }}
            >
              {isArabic ? specialist.nameAr : specialist.nameEn}
            </h3>
            <p
              style={{
                fontSize: typography.size.md,
                color: brandCyan,
                fontWeight: typography.weight.semibold,
              }}
            >
              {isArabic ? specialist.titleAr : specialist.titleEn}
            </p>
          </div>

          {/* Certification Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              padding: `${spacing[2]}px ${spacing[4]}px`,
              background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
              border: `1px solid ${brandCyan}30`,
              borderRadius: radius.full,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: typography.weight.black,
                color: '#05060d',
              }}
            >
              B
            </div>
            <div>
              <div
                style={{
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: brandCyan,
                }}
              >
                Bérard AIT
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: colors.text.muted,
                }}
              >
                {specialist.certificationId}
              </div>
            </div>
          </div>
        </div>

        {/* Credentials & Bio Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
          {/* Credentials */}
          <div>
            <h4
              style={{
                fontSize: typography.size.md,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
                marginBottom: spacing[3],
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <SchoolIcon tone="purple" size={18} />
              {isArabic ? 'المؤهلات والخبرات' : 'Qualifications & Experience'}
            </h4>

            <div
              className="credentials-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: spacing[3],
              }}
            >
              {specialist.credentials.map((cred) => (
                <div
                  key={cred.id}
                  style={{
                    padding: spacing[3],
                    background: `${cred.color}08`,
                    border: `1px solid ${cred.color}20`,
                    borderRadius: radius.lg,
                    [isArabic ? 'borderRight' : 'borderLeft']: `3px solid ${cred.color}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      marginBottom: spacing[1],
                    }}
                  >
                    <span style={{ fontSize: 16 }}>
                      {renderLabIcon(cred.icon, { size: 16, style: { color: cred.color } })}
                    </span>
                    <span
                      style={{
                        fontSize: typography.size.sm,
                        fontWeight: typography.weight.bold,
                        color: cred.color,
                      }}
                    >
                      {isArabic ? cred.titleAr : cred.titleEn}
                    </span>
                    {cred.year && (
                      <span
                        style={{
                          fontSize: typography.size.xs,
                          color: colors.text.muted,
                          marginInlineStart: 'auto',
                        }}
                      >
                        {cred.year}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: typography.size.xs,
                      color: colors.text.secondary,
                      paddingInlineStart: spacing[6],
                    }}
                  >
                    {isArabic ? cred.descriptionAr : cred.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4
              style={{
                fontSize: typography.size.md,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
                marginBottom: spacing[3],
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <ReportIcon tone="purple" size={18} />
              {isArabic ? 'نبذة تعريفية' : 'Biography'}
            </h4>
            <div
              style={{
                padding: spacing[4],
                background: `linear-gradient(135deg, ${brandCyan}05, ${brandPurple}03)`,
                borderRadius: radius.lg,
                border: `1px solid ${colors.border.subtle}`,
              }}
            >
              {(isArabic ? specialist.bioAr : specialist.bioEn).split('\n\n').map((para, i) => (
                <p
                  key={i}
                  style={{
                    margin: i > 0 ? `${spacing[3]}px 0 0` : 0,
                    fontSize: typography.size.sm,
                    color: colors.text.secondary,
                    lineHeight: typography.lineHeight.loose,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .specialist-profile-card {
            grid-template-columns: 1fr !important;
            padding: ${spacing[4]}px !important;
            gap: ${spacing[5]}px !important;
          }
          .specialist-profile-card > div:first-child {
            align-items: center !important;
          }
          .specialist-image-container {
            width: 180px !important;
            height: 180px !important;
          }
          .specialist-image-inner {
            width: 160px !important;
            height: 180px !important;
          }
          .specialist-bg-circle {
            width: 140px !important;
            height: 140px !important;
          }
          .credentials-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
});
SpecialistProfile.displayName = 'SpecialistProfile';

// ═══════════════════════════════════════════════════════════════════════════
// CENTRE INFO SECTION
// ═══════════════════════════════════════════════════════════════════════════

const CentreInfoSection = memo(({ isArabic }: { isArabic: boolean }) => {
  const centre = CENTRE_INFO;
  const lotusLogoSrc = assetUrl('assets/images/lotus-holistic-logo.png');

  return (
    <section
      style={{
        padding: `${spacing[10]}px ${spacing[4]}px`,
        maxWidth: 1000,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <CircuitDecoration variant="sparse" opacity={0.08} />

      {/* Section Title */}
      <div style={{ textAlign: 'center', marginBottom: spacing[8] }}>
        <h2
          style={{
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[2],
          }}
        >
          {isArabic ? 'عن المركز' : 'About the Centre'}
        </h2>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[1.5]}px ${spacing[3]}px`,
            background: `${brandPurple}10`,
            borderRadius: radius.full,
            fontSize: typography.size.sm,
            color: brandPurple,
          }}
        >
          <MapPinIcon tone="purple" size={14} />
          {isArabic ? centre.locationAr : centre.locationEn}
        </div>
      </div>

      {/* Centre Description */}
      <div
        style={{
          background: colors.surface.card,
          borderRadius: radius['2xl'],
          border: `1px solid ${colors.border.subtle}`,
          padding: spacing[6],
          marginBottom: spacing[6],
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[3],
            marginBottom: spacing[4],
            paddingBottom: spacing[4],
            borderBottom: `1px solid ${colors.border.subtle}`,
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: radius.lg,
              background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}15)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
            }}
          >
            <img
              src={lotusLogoSrc}
              alt="Lotus Holistic Centre logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          <div>
            <h3
              style={{
                fontSize: typography.size.xl,
                fontWeight: typography.weight.black,
                color: colors.text.primary,
                margin: 0,
              }}
            >
              {isArabic ? centre.nameAr : centre.nameEn}
            </h3>
            <p
              style={{
                margin: `${spacing[1]}px 0 0`,
                fontSize: typography.size.sm,
                color: brandCyan,
                fontWeight: typography.weight.semibold,
              }}
            >
              {isArabic ? centre.taglineAr : centre.taglineEn} • {isArabic ? `منذ ${centre.foundedYear}` : `Since ${centre.foundedYear}`}
            </p>
          </div>
        </div>

        {(isArabic ? centre.descriptionAr : centre.descriptionEn).split('\n\n').map((para, i) => (
          <p
            key={i}
            style={{
              margin: i > 0 ? `${spacing[3]}px 0 0` : 0,
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.loose,
            }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Values */}
      <div style={{ marginBottom: spacing[6] }}>
        <h3
          style={{
            fontSize: typography.size.lg,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
            marginBottom: spacing[4],
            textAlign: 'center',
          }}
        >
          {isArabic ? 'قيمنا' : 'Our Values'}
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: spacing[4],
          }}
        >
          {centre.values.map((value, index) => (
            <FadeIn key={value.id} delay={index * 100} direction="up">
              <div
                style={{
                  padding: spacing[5],
                  background: colors.surface.card,
                  borderRadius: radius.xl,
                  border: `1px solid ${colors.border.subtle}`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: radius.lg,
                    background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    margin: '0 auto',
                    marginBottom: spacing[3],
                  }}
                >
                  {renderLabIcon(value.icon, { size: 22, tone: 'cyan' })}
                </div>
                <h4
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: typography.weight.bold,
                    color: colors.text.primary,
                    marginBottom: spacing[1],
                  }}
                >
                  {isArabic ? value.titleAr : value.titleEn}
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: typography.size.sm,
                    color: colors.text.secondary,
                  }}
                >
                  {isArabic ? value.descAr : value.descEn}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <h3
          style={{
            fontSize: typography.size.lg,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
            marginBottom: spacing[4],
            textAlign: 'center',
          }}
        >
          {isArabic ? 'خدماتنا' : 'Our Services'}
        </h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: spacing[3],
          }}
        >
          {centre.services.map((service) => (
            <div
              key={service.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2.5]}px ${spacing[4]}px`,
                background: `${service.color}10`,
                border: `1px solid ${service.color}25`,
                borderRadius: radius.full,
              }}
            >
              <span style={{ fontSize: 18 }}>
                {renderLabIcon(service.icon, { size: 18, style: { color: service.color } })}
              </span>
              <span
                style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.semibold,
                  color: service.color,
                }}
              >
                {isArabic ? service.nameAr : service.nameEn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
CentreInfoSection.displayName = 'CentreInfoSection';

// ═══════════════════════════════════════════════════════════════════════════
// CONNECT SECTION - LinkedIn and Contact
// ═══════════════════════════════════════════════════════════════════════════

const ConnectSection = memo(({ isArabic }: { isArabic: boolean }) => {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  return (
    <section
      style={{
        padding: `${spacing[8]}px ${spacing[4]}px ${spacing[12]}px`,
        maxWidth: 800,
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <h3
        style={{
          fontSize: typography.size.xl,
          fontWeight: typography.weight.black,
          color: colors.text.primary,
          marginBottom: spacing[2],
        }}
      >
        {isArabic ? 'تواصل معنا' : 'Connect With Us'}
      </h3>
      <p
        style={{
          fontSize: typography.size.md,
          color: colors.text.secondary,
          marginBottom: spacing[6],
        }}
      >
        {isArabic
          ? 'تابعنا على LinkedIn أو تواصل معنا مباشرة'
          : 'Follow us on LinkedIn or reach out directly'}
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: spacing[4],
        }}
      >
        {/* LinkedIn Button */}
        <a
          href={CLINIC.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsHovered('linkedin')}
          onMouseLeave={() => setIsHovered(null)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[4]}px ${spacing[6]}px`,
            background: isHovered === 'linkedin' ? brandColors.linkedin : brandColors.linkedinLight,
            border: `1px solid ${isHovered === 'linkedin' ? brandColors.linkedin : `${brandColors.linkedin}30`}`,
            borderRadius: radius.xl,
            textDecoration: 'none',
            color: isHovered === 'linkedin' ? '#fff' : brandColors.linkedin,
            fontWeight: typography.weight.bold,
            fontSize: typography.size.md,
            transition: 'all 0.3s ease',
            transform: isHovered === 'linkedin' ? 'translateY(-3px)' : 'translateY(0)',
            boxShadow: isHovered === 'linkedin' ? `0 10px 30px ${brandColors.linkedin}50` : 'none',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          {isArabic ? 'تابعنا على LinkedIn' : 'Follow on LinkedIn'}
        </a>

        {/* Contact Button */}
        <a
          href="/contact"
          onMouseEnter={() => setIsHovered('contact')}
          onMouseLeave={() => setIsHovered(null)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[4]}px ${spacing[6]}px`,
            background: isHovered === 'contact'
              ? `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`
              : 'transparent',
            border: `1px solid ${isHovered === 'contact' ? 'transparent' : colors.border.emphasis}`,
            borderRadius: radius.xl,
            textDecoration: 'none',
            color: isHovered === 'contact' ? '#05060d' : colors.text.primary,
            fontWeight: typography.weight.bold,
            fontSize: typography.size.md,
            transition: 'all 0.3s ease',
            transform: isHovered === 'contact' ? 'translateY(-3px)' : 'translateY(0)',
            boxShadow: isHovered === 'contact' ? `0 10px 30px ${brandCyan}30` : 'none',
          }}
        >
          <MailIcon tone="cyan" size={20} />
          {isArabic ? 'تواصل معنا' : 'Contact Us'}
        </a>
      </div>

      {/* Social Links Row */}
      <div
        style={{
          marginTop: spacing[8],
          display: 'flex',
          justifyContent: 'center',
          gap: spacing[3],
        }}
      >
        {[
          { key: 'instagram', icon: <EyeIcon tone="pink" size={20} />, url: CLINIC.socials.instagram },
          { key: 'facebook', icon: <UserIcon tone="cyan" size={20} />, url: CLINIC.socials.facebook },
          { key: 'tiktok', icon: <WaveformIcon tone="purple" size={20} />, url: CLINIC.socials.tiktok },
        ].map((social) => (
          <a
            key={social.key}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(social.key)}
            onMouseLeave={() => setIsHovered(null)}
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.lg,
              background: isHovered === social.key ? `${brandCyan}20` : colors.surface.card,
              border: `1px solid ${isHovered === social.key ? brandCyan : colors.border.subtle}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              transform: isHovered === social.key ? 'translateY(-3px)' : 'translateY(0)',
            }}
          >
            {social.icon}
          </a>
        ))}
      </div>
    </section>
  );
});
ConnectSection.displayName = 'ConnectSection';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function AboutPage() {
  const { isArabic } = useLanguage();
  usePageTitle(isArabic ? 'من نحن - Lotus × Bérard AIT' : 'About Us - Lotus × Bérard AIT');

  return (
    <LabShell variant="primary">
      <BackgroundFX />
      <Header />

      <LabShellContent>
        <BackNavigation
          to="/"
          label={isArabic ? 'الصفحة الرئيسية' : 'Home'}
        />

        <FadeIn duration={800} scale blur>
          <PageHeader isArabic={isArabic} />
        </FadeIn>

        <FadeIn delay={200} direction="up" scale scaleFrom={0.96}>
          <SpecialistProfile isArabic={isArabic} />
        </FadeIn>

        <FadeIn delay={300} direction="up">
          <CentreInfoSection isArabic={isArabic} />
        </FadeIn>

        <FadeIn delay={400} scale>
          <ConnectSection isArabic={isArabic} />
        </FadeIn>

        <FadeIn delay={100} direction="none" scale scaleFrom={0.98}>
          <Footer />
        </FadeIn>
      </LabShellContent>

      <WhatsAppFab />
      <ScrollToTopButton />

      {/* Global responsive styles */}
      <style>{`
        @media (max-width: 480px) {
          .about-page-header {
            padding: ${spacing[6]}px ${spacing[3]}px ${spacing[4]}px !important;
          }
          .about-page-header h1 {
            font-size: ${typography.size['2xl']}px !important;
          }
          .about-page-header p {
            font-size: ${typography.size.sm}px !important;
          }
        }
      `}</style>
    </LabShell>
  );
}

export default memo(AboutPage);
