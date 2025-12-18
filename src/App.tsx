import { lazy, Suspense, memo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import { GamificationProvider } from './context/GamificationContext';
import { LanguageProvider } from './context/LanguageContext';
import { UserProvider } from './context/UserContext';
import AchievementToast from './components/AchievementToast';
import ProgressDashboard from './components/ProgressDashboard';
import ScrollProgressTracker from './components/ScrollProgressTracker';
import ActivityFeed from './components/ActivityFeed';
import NotificationCenter from './components/NotificationCenter';
import { ProgressExportButton } from './components/ProgressExport';

// ═══════════════════════════════════════════════════════════════════════════
// LAZY LOADED PAGES
// ═══════════════════════════════════════════════════════════════════════════

// Main 6 Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const ProgramPage = lazy(() => import('./pages/ProgramPage'));
const SciencePage = lazy(() => import('./pages/SciencePage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Special Pages
const BrainFunctionPage = lazy(() => import('./pages/BrainFunctionPage'));

// Dashboard Pages
const SchoolDashboard = lazy(() => import('./components/analytics/SchoolDashboard'));
const ParentDashboard = lazy(() => import('./components/analytics/ParentDashboard'));
const ClinicianDashboard = lazy(() => import('./components/analytics/ClinicianDashboard'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));

// ═══════════════════════════════════════════════════════════════════════════
// PAGE LOADER - Enhanced with brain-themed animation
// ═══════════════════════════════════════════════════════════════════════════

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#05060d',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background pulse effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(143,211,204,0.05) 0%, transparent 60%)',
        animation: 'bgPulse 2s ease-in-out infinite',
      }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Neural network loader */}
        <div style={{
          position: 'relative',
          width: 80,
          height: 80,
          margin: '0 auto 20px',
        }}>
          {/* Outer ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '2px solid rgba(143,211,204,0.15)',
            borderRadius: '50%',
          }} />
          {/* Spinning ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '3px solid transparent',
            borderTopColor: '#8FD3CC',
            borderRightColor: '#AF84BA',
            borderRadius: '50%',
            animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          }} />
          {/* Inner pulse */}
          <div style={{
            position: 'absolute',
            inset: 15,
            background: 'linear-gradient(135deg, rgba(143,211,204,0.2), rgba(175,132,186,0.2))',
            borderRadius: '50%',
            animation: 'innerPulse 1.5s ease-in-out infinite',
          }} />
          {/* Center dot */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 12,
            height: 12,
            background: '#8FD3CC',
            borderRadius: '50%',
            boxShadow: '0 0 20px rgba(143,211,204,0.6)',
          }} />
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
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 6,
                height: 6,
                background: ['#8FD3CC', '#AF84BA', '#B01270'][i],
                borderRadius: '50%',
                boxShadow: `0 0 10px ${['#8FD3CC', '#AF84BA', '#B01270'][i]}`,
              }} />
            </div>
          ))}
        </div>

        {/* Text */}
        <div style={{
          color: '#8FD3CC',
          fontSize: 16,
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 600,
          letterSpacing: 1,
          opacity: 0.9,
        }}>
          Loading...
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

    /* Global focus styles for accessibility */
    *:focus-visible {
      outline: 2px solid #8FD3CC;
      outline-offset: 2px;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .page-transition-wrapper {
        animation: none;
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

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <PageTransitionStyles />
        <LanguageProvider>
          <UserProvider>
            <GamificationProvider>
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
                      <LandingPage />
                    </Suspense>
                  }
                />

                {/* 2. Assessment Page - Diagnostic Tools */}
                <Route
                  path="/assessment"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AssessmentPage />
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

                {/* Contact/Get Started Page */}
                <Route
                  path="/contact"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ContactPage />
                    </Suspense>
                  }
                />

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

                {/* ═══════════════════════════════════════════════════════
                    DASHBOARD PAGES
                    ═══════════════════════════════════════════════════════ */}

                <Route
                  path="/school-dashboard"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SchoolDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="/parent-dashboard"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ParentDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="/clinician-dashboard"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ClinicianDashboard />
                    </Suspense>
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
              </Routes>
              </div>

              {/* Gamification UI (always visible) */}
              <GamificationUI />
            </GamificationProvider>
          </UserProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default memo(App);
