import { useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { useGamification } from '../context/GamificationContext';

/**
 * Hook to sync clinical progress between UserContext and GamificationContext
 *
 * This hook:
 * 1. Syncs clinical data from UserContext to GamificationContext when a patient logs in
 * 2. Triggers appropriate achievements based on synced clinical data
 * 3. Keeps both contexts in sync during the session
 */
export function useClinicalSync() {
  const { user, clinicalProgress } = useUser();
  const { syncClinicalProgress, state } = useGamification();
  const hasInitialSynced = useRef(false);
  const previousUserId = useRef<string | null>(null);

  const isPatient = user?.role === 'patient';

  // Sync on patient login or when clinical progress changes
  useEffect(() => {
    // Only sync for patients with clinical progress
    if (!isPatient || !clinicalProgress || !user) {
      hasInitialSynced.current = false;
      previousUserId.current = null;
      return;
    }

    // Check if this is a new user login
    const isNewLogin = previousUserId.current !== user.id;
    previousUserId.current = user.id;

    // Sync clinical progress from UserContext to GamificationContext
    if (isNewLogin || !hasInitialSynced.current) {
      syncClinicalProgress({
        sessionsCompleted: clinicalProgress.sessionsCompleted,
        streak: clinicalProgress.streak,
        attentionScore: clinicalProgress.attentionScore,
        processingSpeed: clinicalProgress.processingSpeed,
        auditoryDiscrimination: clinicalProgress.auditoryDiscrimination,
      });
      hasInitialSynced.current = true;
    }
  }, [user, isPatient, clinicalProgress, syncClinicalProgress]);

  // Return current sync status
  return {
    isSynced: hasInitialSynced.current,
    gamificationSessions: state.clinicalSessionsCompleted,
    gamificationStreak: state.clinicalStreak,
    gamificationPhase: state.treatmentPhase,
    userSessions: clinicalProgress?.sessionsCompleted ?? 0,
    userStreak: clinicalProgress?.streak ?? 0,
  };
}

/**
 * Hook to track and report clinical session completion
 * Use this when a patient completes an actual treatment session
 */
export function useClinicalSessionTracker() {
  const { completeClinicalSession, updateClinicalStreak, state } = useGamification();
  const { user, clinicalProgress, updateClinicalProgress } = useUser();

  const isPatient = user?.role === 'patient';

  const completeSession = () => {
    if (!isPatient) return;

    // Update gamification context
    completeClinicalSession();
    updateClinicalStreak();

    // Update user context with incremented sessions
    const currentSessions = clinicalProgress?.sessionsCompleted ?? 0;
    updateClinicalProgress({
      sessionsCompleted: currentSessions + 1,
      sessionDates: [...(clinicalProgress?.sessionDates ?? []), Date.now()],
    });
  };

  return {
    completeSession,
    isPatient,
    sessionsCompleted: state.clinicalSessionsCompleted,
    streak: state.clinicalStreak,
  };
}

export default useClinicalSync;
