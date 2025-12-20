import { lazy, Suspense, memo, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import { GamificationProvider } from './context/GamificationContext';
import { LanguageProvider } from './context/LanguageContext';
import { UserProvider, useUser } from './context/UserContext';
import { VisitorModeProvider } from './context/VisitorModeContext';
import AchievementToast from './components/AchievementToast';
import ProgressDashboard from './components/ProgressDashboard';
import ScrollProgressTracker from './components/ScrollProgressTracker';
import ActivityFeed from './components/ActivityFeed';
import NotificationCenter from './components/NotificationCenter';
import { ProgressExportButton } from './components/ProgressExport';
import { useClinicalSync } from './hooks/useClinicalSync';
import StickySmartCTA from './components/StickySmartCTA';
import RequireAuth from './components/auth/RequireAuth';
import RequirePermission from './components/auth/RequirePermission';

// Respect Vite base for subpath deployments (e.g., GitHub Pages)
const rawBase = import.meta.env.BASE_URL ?? '/';
const appBase = (rawBase === './' ? '/' : rawBase).replace(/\/+$/, '') || '/';

// ═══════════════════════════════════════════════════════════════════════════
// LAZY LOADED PAGES
// ═══════════════════════════════════════════════════════════════════════════

// Main 7 Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const ProgramPage = lazy(() => import('./pages/ProgramPage'));
const SciencePage = lazy(() => import('./pages/SciencePage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// Special Pages
const BrainFunctionPage = lazy(() => import('./pages/BrainFunctionPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Dashboard Pages
const SchoolDashboard = lazy(() => import('./components/analytics/SchoolDashboard'));
const ParentDashboard = lazy(() => import('./components/analytics/ParentDashboard'));
const ClinicianDashboard = lazy(() => import('./components/analytics/ClinicianDashboard'));
const ParentRoleDashboard = lazy(() => import('./pages/ParentDashboard'));
const EducatorDashboard = lazy(() => import('./pages/EducatorDashboard'));
const ClinicianRoleDashboard = lazy(() => import('./pages/ClinicianDashboard'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const DebugSessionPage = lazy(() => import('./pages/DebugSessionPage'));

const HomeGate = memo(function HomeGate() {
  const { isAuthenticated } = useUser();
  return isAuthenticated ? <ExplorePage /> : <LandingPage />;
});

// ═══════════════════════════════════════════════════════════════════════════
// PAGE LOADER - Enhanced with brain-themed animation (bilingual)
// ═══════════════════════════════════════════════════════════════════════════

// Get language from localStorage (same key as LanguageContext)
function getStoredLanguage(): 'ar' | 'en' {
  if (typeof window === 'undefined') return 'ar';
  const saved = localStorage.getItem('lotus_language');
  if (saved === 'ar' || saved === 'en') return saved;
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('en')) return 'en';
  return 'ar';
}

function PageLoader() {
  const isArabic = getStoredLanguage() === 'ar';
  const loadingText = isArabic ? 'جارٍ التحميل...' : 'Loading...';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05060d',
        position: 'relative',
        overflow: 'hidden',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      {/* Background pulse effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(143,211,204,0.05) 0%, transparent 60%)',
          animation: 'bgPulse 2s ease-in-out infinite',
        }}
      />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Neural network loader */}
        <div
          style={{
            position: 'relative',
            width: 80,
            height: 80,
            margin: '0 auto 20px',
          }}
        >
          {/* Outer ring */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              border: '2px solid rgba(143,211,204,0.15)',
              borderRadius: '50%',
            }}
          />
          {/* Spinning ring */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              border: '3px solid transparent',
              borderTopColor: '#8FD3CC',
              borderRightColor: '#AF84BA',
              borderRadius: '50%',
              animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
            }}
          />
          {/* Inner pulse */}
          <div
            style={{
              position: 'absolute',
              inset: 15,
              background: 'linear-gradient(135deg, rgba(143,211,204,0.2), rgba(175,132,186,0.2))',
              borderRadius: '50%',
              animation: 'innerPulse 1.5s ease-in-out infinite',
            }}
          />
          {/* Center dot */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 12,
              height: 12,
              background: '#8FD3CC',
              borderRadius: '50%',
              boxShadow: '0 0 20px rgba(143,211,204,0.6)',
            }}
          />
          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: -4,
                animation: `orbitDot ${1.5 + i * 0.3}s linear infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 6,
                  height: 6,
                  background: ['#8FD3CC', '#AF84BA', '#B01270'][i],
                  borderRadius: '50%',
                  boxShadow: `0 0 10px ${['#8FD3CC', '#AF84BA', '#B01270'][i]}`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Text - Bilingual */}
        <div
          style={{
            color: '#8FD3CC',
            fontSize: 16,
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 600,
            letterSpacing: isArabic ? 0 : 1,
            opacity: 0.9,
          }}
        >
          {loadingText}
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes bgPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          @keyframes innerPulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          @keyframes orbitDot {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE TRANSITION WRAPPER - Smooth animations between pages
// ═══════════════════════════════════════════════════════════════════════════

const PageTransitionStyles = memo(() => (
  <style>{`
    @keyframes pageEnterFade {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .page-transition-wrapper {
      animation: pageEnterFade 0.4s ease-out forwards;
    }

    /* Smooth scroll behavior */
    html {
      scroll-behavior: smooth;
    }

    html[data-reduced-motion="true"] {
      scroll-behavior: auto;
    }

    html[data-reduced-motion="true"] .page-transition-wrapper {
      animation: none;
    }

    /* Global focus styles for accessibility */
    *:focus-visible {
      outline: 2px solid #8FD3CC;
      outline-offset: 2px;
    }

    /* ═══════════════════════════════════════════════════════════════════════
       ENHANCED WORKFLOW ANIMATIONS & MICRO-INTERACTIONS
       ═══════════════════════════════════════════════════════════════════════ */

    /* Button hover micro-interactions */
    .btn-primary, .btn-secondary, .btn-ghost {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(143,211,204,0.3);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    /* Card hover effects */
    .card-interactive {
      transition: all 0.3s ease;
    }

    .card-interactive:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.2), 0 0 30px rgba(143,211,204,0.1);
      border-color: rgba(143,211,204,0.3);
    }

    /* Lab-tech scan line effect */
    .scan-line-effect {
      position: relative;
      overflow: hidden;
    }

    .scan-line-effect::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(143,211,204,0.05),
        transparent
      );
      animation: scanLineMove 3s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes scanLineMove {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    /* Neural pulse effect for interactive elements */
    .neural-pulse {
      position: relative;
    }

    .neural-pulse::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba(143,211,204,0.3), rgba(175,132,186,0.3));
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      filter: blur(8px);
    }

    .neural-pulse:hover::before {
      opacity: 1;
    }

    /* Status indicator animations */
    .status-online {
      position: relative;
    }

    .status-online::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: inherit;
      animation: statusPulseRing 2s ease-out infinite;
    }

    @keyframes statusPulseRing {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(2); opacity: 0; }
    }

    /* Lab-tech glow bar animation */
    .glow-bar {
      animation: glowBarPulse 3s ease-in-out infinite;
    }

    @keyframes glowBarPulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    /* Data stream animation for loading states */
    .data-stream {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(143,211,204,0.15),
        transparent
      );
      background-size: 200% 100%;
      animation: dataStreamFlow 1.5s ease-in-out infinite;
    }

    @keyframes dataStreamFlow {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Fade-in animations for content */
    .fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
      opacity: 0;
    }

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

    /* Stagger animation delays */
    .stagger-1 { animation-delay: 0.1s; }
    .stagger-2 { animation-delay: 0.2s; }
    .stagger-3 { animation-delay: 0.3s; }
    .stagger-4 { animation-delay: 0.4s; }
    .stagger-5 { animation-delay: 0.5s; }

    /* Language switch transition */
    [data-lang] {
      transition: all 0.3s ease;
    }

    /* RTL/LTR smooth transitions */
    [dir="rtl"], [dir="ltr"] {
      transition: direction 0s, text-align 0.2s ease;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .page-transition-wrapper,
      .card-interactive,
      .btn-primary,
      .scan-line-effect::after,
      .neural-pulse::before,
      .status-online::after,
      .glow-bar,
      .data-stream,
      .fade-in-up {
        animation: none !important;
        transition: none !important;
      }

      html {
        scroll-behavior: auto;
      }
    }
  `}</style>
));
PageTransitionStyles.displayName = 'PageTransitionStyles';

// ═══════════════════════════════════════════════════════════════════════════
// GAMIFICATION UI WRAPPER
// ═══════════════════════════════════════════════════════════════════════════

const GamificationUI = memo(() => (
  <>
    <AchievementToast />
    <ProgressDashboard />
    <ScrollProgressTracker />
    <ActivityFeed />
    <NotificationCenter />
    {/* Hidden export button that listens for export-progress event */}
    <div style={{ position: 'fixed', bottom: -100, left: -100, opacity: 0, pointerEvents: 'none' }}>
      <ProgressExportButton />
    </div>
  </>
));
GamificationUI.displayName = 'GamificationUI';

const ClinicalSync = memo(() => {
  useClinicalSync();
  return null;
});
ClinicalSync.displayName = 'ClinicalSync';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

function App() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applyReducedMotionPreference = () => {
      try {
        const raw = localStorage.getItem('lotus_user_settings');
        const reducedMotion = raw ? Boolean(JSON.parse(raw)?.display?.reducedMotion) : false;
        if (reducedMotion) {
          document.documentElement.dataset.reducedMotion = 'true';
        } else {
          delete document.documentElement.dataset.reducedMotion;
        }
      } catch {
        delete document.documentElement.dataset.reducedMotion;
      }
    };

    applyReducedMotionPreference();

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === 'lotus_user_settings') {
        applyReducedMotionPreference();
      }
    };

    const handleSettingsChanged = () => {
      applyReducedMotionPreference();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('lotus-settings-changed', handleSettingsChanged);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('lotus-settings-changed', handleSettingsChanged);
    };
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter basename={appBase}>
        <ScrollToTop />
        <PageTransitionStyles />
        <LanguageProvider>
          <VisitorModeProvider>
            <UserProvider>
              <GamificationProvider>
                <ClinicalSync />

                <div className="page-transition-wrapper">
                  <Routes>
                    {/* ═══════════════════════════════════════════════════════
                        MAIN 6 PAGES
                        ═══════════════════════════════════════════════════════ */}

                    {/* 1. Landing Page - Hero + Credentials */}
                    <Route
                      path="/"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <HomeGate />
                        </Suspense>
                      }
                    />

                    <Route
                      path="/login"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <LoginPage />
                        </Suspense>
                      }
                    />

                    {/* Contact/Get Started Page */}
                    <Route
                      path="/contact"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ContactPage />
                        </Suspense>
                      }
                    />

                    {/* 3. Program Page - Treatment Protocol */}
                    <Route
                      path="/program"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ProgramPage />
                        </Suspense>
                      }
                    />

                    {/* 7. About Page - Centre & Specialist Info */}
                    <Route
                      path="/about"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <AboutPage />
                        </Suspense>
                      }
                    />

                    <Route element={<RequireAuth />}>
                    {/* 2. Assessment Page - Diagnostic Tools */}
                    <Route
                      path="/assessment"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <AssessmentPage />
                        </Suspense>
                      }
                    />

                    {/* 4. Science Page - Research & Neuroplasticity */}
                    <Route
                      path="/science"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <SciencePage />
                        </Suspense>
                      }
                    />

                    {/* 5. Results Page - Evidence & Testimonials */}
                    <Route
                      path="/results"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ResultsPage />
                        </Suspense>
                      }
                    />

                    {/* 6. Resources Page - Videos, Slides, FAQ */}
                    <Route
                      path="/resources"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ResourcesPage />
                        </Suspense>
                      }
                    />

                    {/* ═════════════════════════════════════════════════════==
                        SPECIAL PAGES
                        ═══════════════════════════════════════════════════════ */}
                    {/* ═══════════════════════════════════════════════════════
                        SPECIAL PAGES
                        ═══════════════════════════════════════════════════════ */}

                    {/* Brain Function Detail Page */}
                    <Route
                      path="/function/:slug"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <BrainFunctionPage />
                        </Suspense>
                      }
                    />

                    {/* ═════════════════════════════════════════════════════==
                        DASHBOARD PAGES
                        ═══════════════════════════════════════════════════════ */}

                    <Route
                      path="/school-dashboard"
                      element={
                        <RequirePermission permission="school_analytics">
                          <Suspense fallback={<PageLoader />}>
                            <SchoolDashboard />
                          </Suspense>
                        </RequirePermission>
                      }
                    />
                    <Route
                      path="/parent-dashboard"
                      element={
                        <RequirePermission permission="view_child_reports">
                          <Suspense fallback={<PageLoader />}>
                            <ParentDashboard />
                          </Suspense>
                        </RequirePermission>
                      }
                    />
                    <Route
                      path="/clinician-dashboard"
                      element={
                        <RequirePermission permission="view_patient_reports">
                          <Suspense fallback={<PageLoader />}>
                            <ClinicianDashboard />
                          </Suspense>
                        </RequirePermission>
                      }
                    />
                    <Route
                      path="/dashboard/parent"
                      element={
                        <RequirePermission permission="view_child_reports">
                          <Suspense fallback={<PageLoader />}>
                            <ParentRoleDashboard />
                          </Suspense>
                        </RequirePermission>
                      }
                    />
                    <Route
                      path="/dashboard/educator"
                      element={
                        <RequirePermission permission="school_analytics">
                          <Suspense fallback={<PageLoader />}>
                            <EducatorDashboard />
                          </Suspense>
                        </RequirePermission>
                      }
                    />
                    <Route
                      path="/dashboard/clinician"
                      element={
                        <RequirePermission permission="view_patient_reports">
                          <Suspense fallback={<PageLoader />}>
                            <ClinicianRoleDashboard />
                          </Suspense>
                        </RequirePermission>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <SettingsPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/debug/session"
                      element={
                        <RequirePermission permission="system_config">
                          <Suspense fallback={<PageLoader />}>
                            <DebugSessionPage />
                          </Suspense>
                        </RequirePermission>
                      }
                    />

                    {/* ═════════════════════════════════════════════════════==
                        404 NOT FOUND - Catch-all route (must be last)
                        ═══════════════════════════════════════════════════════ */}
                    <Route
                      path="*"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <NotFoundPage />
                        </Suspense>
                      }
                    />
                    </Route>
                  </Routes>
                </div>

                {/* Gamification UI (always visible) */}
                <GamificationUI />

                {/* Sticky Smart CTA (mode-aware) */}
                <StickySmartCTA />
              </GamificationProvider>
            </UserProvider>
          </VisitorModeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default memo(App);
