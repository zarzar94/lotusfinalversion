import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { UserProvider } from '../context/UserContext';
import { GamificationProvider } from '../context/GamificationContext';
import { VisitorModeProvider } from '../context/VisitorModeContext';

// ═══════════════════════════════════════════════════════════════════════════
// ALL PROVIDERS WRAPPER
// ═══════════════════════════════════════════════════════════════════════════

interface AllProvidersProps {
  children: React.ReactNode;
}

function AllProviders({ children }: AllProvidersProps) {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <VisitorModeProvider>
          <UserProvider>
            <GamificationProvider>
              {children}
            </GamificationProvider>
          </UserProvider>
        </VisitorModeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM RENDER
// ═══════════════════════════════════════════════════════════════════════════

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// ═══════════════════════════════════════════════════════════════════════════
// MOCK FACTORIES
// ═══════════════════════════════════════════════════════════════════════════

export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  nameEn: 'Test User',
  role: 'patient' as const,
  isVerified: true,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockProgress = (overrides = {}) => ({
  userId: 'user-123',
  sessionsCompleted: 5,
  totalSessions: 20,
  treatmentPhase: 'active' as const,
  metrics: {
    attention: 75,
    processingSpeed: 70,
    auditoryDiscrimination: 80,
    sequencing: 72,
  },
  ...overrides,
});

export const createMockSession = (overrides = {}) => ({
  id: 'session-123',
  userId: 'user-123',
  type: 'attention' as const,
  completedAt: new Date().toISOString(),
  duration: 20,
  score: 85,
  results: {
    correctResponses: 21,
    totalTrials: 25,
    reactionTime: 380,
    accuracy: 0.84,
  },
  ...overrides,
});

export const createMockGamification = (overrides = {}) => ({
  userId: 'user-123',
  totalPoints: 1500,
  level: 4,
  achievements: [
    { id: 'first_steps', unlockedAt: new Date().toISOString() },
    { id: 'brain_explorer', unlockedAt: new Date().toISOString() },
  ],
  exploredBrainRegions: ['temporal', 'frontal', 'parietal'],
  streakDays: 5,
  ...overrides,
});

// ═══════════════════════════════════════════════════════════════════════════
// API MOCKING HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export const mockApiResponse = <T,>(data: T, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
};

export const mockApiError = (message: string, status = 500) => {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message }),
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// WAIT HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// ═══════════════════════════════════════════════════════════════════════════
// RE-EXPORT EVERYTHING
// ═══════════════════════════════════════════════════════════════════════════

export * from '@testing-library/react';
export { customRender as render };
