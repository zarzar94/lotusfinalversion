/**
 * NotFoundPage - 404 Error Page
 * Shown when users navigate to a non-existent route
 */

import { memo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import BackgroundFX from '../components/BackgroundFX';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFab from '../components/WhatsAppFab';
import ScrollToTopButton from '../components/ScrollToTopButton';
import FadeIn from '../components/FadeIn';
import { renderLabIcon, HomeIcon, MailIcon, MapPinIcon } from '../components/icons';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
} from '../components/styles';
import { LabShell, LabShellContent } from '../components/labui/LabShell';

function NotFoundPage() {
  const { isArabic } = useLanguage();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState<string | null>(null);

  // Set page title
  usePageTitle(isArabic ? 'الصفحة غير موجودة - Lotus × Bérard AIT' : 'Page Not Found - Lotus × Bérard AIT');

  // CSS for animations
  const css = `
    @keyframes float404 {
      0%, 100% { transform: translateY(0) rotate(-2deg); }
      50% { transform: translateY(-15px) rotate(2deg); }
    }
    @keyframes pulse404 {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
    @keyframes linkHover {
      0% { transform: translateX(0); }
      100% { transform: translateX(${isArabic ? '8px' : '-8px'}); }
    }
    .nav-link-404:hover {
      background: rgba(143,211,204,0.1);
      border-color: ${brandCyan}40;
      color: ${brandCyan};
    }
  `;

  return (
    <LabShell variant="primary">
      <style>{css}</style>
      <BackgroundFX />
      <Header />

      <LabShellContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 400px)',
            padding: spacing[6],
            textAlign: 'center',
          }}
        >
          <FadeIn duration={800} scale blur>
            {/* Decorative background glow */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${brandPurple}20, transparent 70%)`,
                pointerEvents: 'none',
                animation: 'pulse404 4s ease-in-out infinite',
              }}
            />

            {/* 404 Number */}
            <div
              style={{
                fontSize: 140,
                fontWeight: typography.weight.black,
                background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple}, ${brandPink})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
                marginBottom: spacing[4],
                animation: 'float404 4s ease-in-out infinite',
                position: 'relative',
              }}
            >
              404
              {/* Shadow layer */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  fontSize: 140,
                  fontWeight: typography.weight.black,
                  color: 'transparent',
                  textShadow: `0 20px 50px ${brandCyan}30, 0 30px 80px ${brandPurple}20`,
                  zIndex: -1,
                }}
              >
                404
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200} direction="up">
            {/* Title */}
            <h1
              style={{
                fontSize: typography.size['4xl'],
                fontWeight: typography.weight.black,
                color: colors.text.primary,
                marginBottom: spacing[3],
              }}
            >
              {isArabic ? 'الصفحة غير موجودة' : 'Page Not Found'}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: typography.size.lg,
                color: colors.text.secondary,
                maxWidth: 500,
                marginBottom: spacing[8],
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              {isArabic
                ? `عذراً، لم نتمكن من العثور على الصفحة "${location.pathname}". ربما تم نقلها أو حذفها.`
                : `Sorry, we couldn't find the page "${location.pathname}". It may have been moved or deleted.`}
            </p>
          </FadeIn>

          <FadeIn delay={400} direction="up">
            {/* Navigation options */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: spacing[4],
                justifyContent: 'center',
                marginBottom: spacing[8],
              }}
            >
              {/* Go Home */}
              <Link
                to="/"
                onMouseEnter={() => setIsHovered('home')}
                onMouseLeave={() => setIsHovered(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  padding: `${spacing[4]}px ${spacing[8]}px`,
                  background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                  color: '#05060d',
                  borderRadius: radius.xl,
                  textDecoration: 'none',
                  fontWeight: typography.weight.black,
                  fontSize: typography.size.md,
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: isHovered === 'home'
                    ? `0 12px 40px ${brandCyan}50`
                    : `0 6px 30px ${brandCyan}30`,
                  transform: isHovered === 'home' ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                }}
              >
                <span style={{ fontSize: 20 }}>
                  <HomeIcon size={20} tone="cyan" />
                </span>
                {isArabic ? 'العودة للرئيسية' : 'Go Home'}
              </Link>

              {/* Contact */}
              <Link
                to="/contact"
                onMouseEnter={() => setIsHovered('contact')}
                onMouseLeave={() => setIsHovered(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  padding: `${spacing[4]}px ${spacing[8]}px`,
                  background: isHovered === 'contact' ? 'rgba(143,211,204,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isHovered === 'contact' ? brandCyan : colors.border.default}`,
                  color: isHovered === 'contact' ? brandCyan : colors.text.primary,
                  borderRadius: radius.xl,
                  textDecoration: 'none',
                  fontWeight: typography.weight.bold,
                  fontSize: typography.size.md,
                  transition: 'all 0.3s ease',
                  transform: isHovered === 'contact' ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                <span style={{ fontSize: 20 }}>
                  <MailIcon size={20} tone="cyan" />
                </span>
                {isArabic ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={600} scale>
            {/* Quick Links */}
            <div
              style={{
                padding: spacing[6],
                background: colors.surface.card,
                borderRadius: radius['2xl'],
                border: `1px solid ${colors.border.subtle}`,
                maxWidth: 600,
                width: '100%',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  fontSize: typography.size.lg,
                  fontWeight: typography.weight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing[4],
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                <span style={{
                  fontSize: 18,
                  width: 32,
                  height: 32,
                  borderRadius: radius.md,
                  background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}15)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <MapPinIcon size={16} tone="cyan" />
                </span>
                {isArabic ? 'روابط مفيدة' : 'Helpful Links'}
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: spacing[3],
                }}
              >
                {[
                  { path: '/assessment', label: isArabic ? 'التقييم' : 'Assessment', icon: '🎯', color: brandCyan },
                  { path: '/program', label: isArabic ? 'البرنامج' : 'Program', icon: '📋', color: brandPurple },
                  { path: '/science', label: isArabic ? 'العلوم' : 'Science', icon: '🧠', color: brandPink },
                  { path: '/results', label: isArabic ? 'النتائج' : 'Results', icon: '📊', color: colors.success },
                  { path: '/resources', label: isArabic ? 'الموارد' : 'Resources', icon: '📚', color: colors.warning },
                  { path: '/contact', label: isArabic ? 'تواصل' : 'Contact', icon: '📞', color: brandCyan },
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="nav-link-404"
                    onMouseEnter={() => setIsHovered(link.path)}
                    onMouseLeave={() => setIsHovered(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      padding: `${spacing[3]}px ${spacing[4]}px`,
                      background: isHovered === link.path ? `${link.color}10` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isHovered === link.path ? `${link.color}40` : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: radius.lg,
                      textDecoration: 'none',
                      color: isHovered === link.path ? link.color : colors.text.secondary,
                      fontSize: typography.size.sm,
                      fontWeight: typography.weight.semibold,
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: radius.sm,
                      background: `${link.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                    }}>
                      {renderLabIcon(link.icon, { size: 14, style: { color: link.color } })}
                    </span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={100} direction="none" scale scaleFrom={0.98}>
          <Footer />
        </FadeIn>
      </LabShellContent>

      <WhatsAppFab />
      <ScrollToTopButton />
    </LabShell>
  );
}

export default memo(NotFoundPage);
