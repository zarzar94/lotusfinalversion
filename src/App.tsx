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
// PAGE LOADER
// ═══════════════════════════════════════════════════════════════════════════

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#05060d',
      color: '#8FD3CC',
      fontSize: 18,
      fontFamily: 'Cairo, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 50,
          height: 50,
          border: '3px solid rgba(143,211,204,0.2)',
          borderTopColor: '#8FD3CC',
          borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 1s linear infinite',
        }} />
        Loading...
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

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
        <LanguageProvider>
          <UserProvider>
            <GamificationProvider>
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
