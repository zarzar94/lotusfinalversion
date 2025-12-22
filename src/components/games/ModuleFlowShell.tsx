import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPurpleDark, styles, instructionFlow } from '../styles';

type ModulePhase = 'instructions' | 'practice' | 'main';

type ModuleFlowContextValue = {
  phase: ModulePhase;
  nextEnabled: boolean;
  setNextEnabled: (enabled: boolean) => void;
};

const ModuleFlowContext = createContext<ModuleFlowContextValue | null>(null);

export const useModuleFlow = () => {
  const context = useContext(ModuleFlowContext);
  if (!context) {
    throw new Error('useModuleFlow must be used within ModuleFlowShell');
  }
  return context;
};

type ModuleFlowShellProps = {
  instructions: { ar: string; en: string };
  practiceTrials: ReactNode[];
  realTrials: ReactNode[];
  moduleId: string;
  onCancel?: () => void;
};

export default function ModuleFlowShell({
  instructions,
  practiceTrials,
  realTrials,
  moduleId,
  onCancel,
}: ModuleFlowShellProps) {
  const { isArabic, t } = useLanguage();
  const [phase, setPhase] = useState<ModulePhase>('instructions');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [nextEnabled, setNextEnabled] = useState(true);

  useEffect(() => {
    if (phase === 'practice') {
      setNextEnabled(false);
    } else {
      setNextEnabled(true);
    }
  }, [phase, practiceIndex]);

  const instructionFallback = isArabic ? t(instructions.ar, instructions.en) : instructions.en;
  const instructionText = t(`modules.${moduleId}.instructions`, instructionFallback);
  const instructionTitle = t('modules.instructionsTitle', t('auto.ModuleFlowShell.k1', "Instructions"));
  const disclaimerText = t(
    'modules.disclaimer',
    t('auto.ModuleFlowShell.k2', "This is a screening tool, not a medical diagnosis.")
  );
  const nextLabel = t('modules.next', t('auto.ModuleFlowShell.k3', "Next"));

  const advance = () => {
    if (!nextEnabled) return;

    if (phase === 'instructions') {
      if (practiceTrials.length > 0) {
        setPracticeIndex(0);
        setPhase('practice');
      } else {
        setPhase('main');
      }
      return;
    }

    if (phase === 'practice') {
      if (practiceIndex < practiceTrials.length - 1) {
        setPracticeIndex((prev) => prev + 1);
      } else {
        setPhase('main');
      }
    }
  };

  const contextValue = useMemo(() => ({
    phase,
    nextEnabled,
    setNextEnabled,
  }), [phase, nextEnabled]);

  return (
    <ModuleFlowContext.Provider value={contextValue}>
      <div style={styles.section}>
        {phase === 'instructions' ? (
          <div>
            <div style={{ fontWeight: 900, color: brandCyan }}>{instructionTitle}</div>
            <p style={{ ...styles.bodyText, marginTop: 8 }}>{instructionText}</p>
            <div style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(0,0,0,0.2)',
              color: brandPurpleDark,
            }}>
              <p style={{ ...styles.muted, margin: 0 }}>{disclaimerText}</p>
            </div>
          </div>
        ) : null}

        {phase === 'practice' ? practiceTrials[practiceIndex] ?? null : null}
        {phase === 'main' ? realTrials[0] ?? null : null}

        {phase !== 'main' ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, gap: 10, flexWrap: 'wrap' }}>
            {onCancel ? (
              <button onClick={onCancel} style={styles.ghostBtn}>
                {t('games.close')}
              </button>
            ) : null}
            <button
              onClick={advance}
              disabled={!nextEnabled}
              style={{
                ...styles.primaryBtn,
                background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})`,
                opacity: nextEnabled ? 1 : 0.6,
                cursor: nextEnabled ? 'pointer' : 'not-allowed',
              }}
            >
              {nextLabel}
            </button>
          </div>
        ) : null}
      </div>
    </ModuleFlowContext.Provider>
  );
}
