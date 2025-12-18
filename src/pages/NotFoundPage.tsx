/**
 * NotFoundPage - 404 Error Page
 * Shown when users navigate to a non-existent route
 */

import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import BackgroundFX from '../components/BackgroundFX';
import Header from '../components/Header';
import {
  brandCyan,
  brandPurple,
  colors,
  typography,
  spacing,
  radius,
} from '../components/styles';

function NotFoundPage() {
  const { isArabic } = useLanguage();
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#05060d',
        color: colors.text.primary,
        fontFamily: typography.fontFamily,
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      <BackgroundFX />
      <Header />

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)',
          padding: spacing[6],
          textAlign: 'center',
        }}
      >
        {/* 404 Number */}
        <div
          style={{
            fontSize: 120,
            fontWeight: typography.weight.black,
            background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
            marginBottom: spacing[4],
          }}
        >
          404
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: typography.size['3xl'],
            fontWeight: typography.weight.bold,
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
            marginBottom: spacing[6],
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          {isArabic
            ? `عذراً، لم نتمكن من العثور على الصفحة "${location.pathname}". ربما تم نقلها أو حذفها.`
            : `Sorry, we couldn't find the page "${location.pathname}". It may have been moved or deleted.`}
        </p>

        {/* Navigation options */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing[3],
            justifyContent: 'center',
          }}
        >
          {/* Go Home */}
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[2],
              padding: `${spacing[3]}px ${spacing[6]}px`,
              background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
              color: '#fff',
              borderRadius: radius.lg,
              textDecoration: 'none',
              fontWeight: typography.weight.bold,
              fontSize: typography.size.base,
              transition: 'all 0.3s ease',
              boxShadow: `0 4px 20px ${brandCyan}30`,
            }}
          >
            <span>🏠</span>
            {isArabic ? 'العودة للرئيسية' : 'Go Home'}
          </Link>

          {/* Contact */}
          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[2],
              padding: `${spacing[3]}px ${spacing[6]}px`,
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${colors.border.default}`,
              color: colors.text.primary,
              borderRadius: radius.lg,
              textDecoration: 'none',
              fontWeight: typography.weight.semibold,
              fontSize: typography.size.base,
              transition: 'all 0.3s ease',
            }}
          >
            <span>✉️</span>
            {isArabic ? 'تواصل معنا' : 'Contact Us'}
          </Link>
        </div>

        {/* Quick Links */}
        <div
          style={{
            marginTop: spacing[10],
            padding: spacing[6],
            background: colors.surface.card,
            borderRadius: radius.xl,
            border: `1px solid ${colors.border.subtle}`,
            maxWidth: 500,
            width: '100%',
          }}
        >
          <h3
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
              marginBottom: spacing[4],
            }}
          >
            {isArabic ? 'روابط مفيدة' : 'Helpful Links'}
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: spacing[3],
            }}
          >
            {[
              { path: '/assessment', label: isArabic ? 'التقييم' : 'Assessment', icon: '🎯' },
              { path: '/program', label: isArabic ? 'البرنامج' : 'Program', icon: '📋' },
              { path: '/science', label: isArabic ? 'العلوم' : 'Science', icon: '🧠' },
              { path: '/resources', label: isArabic ? 'الموارد' : 'Resources', icon: '📚' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  padding: `${spacing[2]}px ${spacing[3]}px`,
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: radius.md,
                  textDecoration: 'none',
                  color: colors.text.secondary,
                  fontSize: typography.size.sm,
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(NotFoundPage);
