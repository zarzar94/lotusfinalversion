import { useState, useMemo } from 'react';
import { useGamification } from '../context/GamificationContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  brandPurpleDark,
  cyberColors,
  gamificationStyles,
  hudStyles,
  holoStyles,
  circuitStyles,
} from './styles';

// Advanced HUD container with tech aesthetic
const hudContainerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 80,
  left: 16,
  zIndex: 15,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

// Mobile: bottom position
const hudContainerMobileStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 80,
  left: 16,
  right: 16,
  top: 'auto',
  zIndex: 15,
};

// Futuristic HUD button with holographic border
const hudButtonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(0,5,15,0.95), rgba(10,20,40,0.9))',
  backdropFilter: 'blur(16px)',
  border: `1px solid ${brandCyan}60`,
  borderRadius: 4,
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: `
    0 0 20px ${brandCyan}20,
    0 8px 32px rgba(0,0,0,0.4),
    inset 0 1px 0 ${brandCyan}20,
    inset 0 -1px 0 ${brandPurple}20
  `,
  position: 'relative',
  overflow: 'hidden',
};

// Expanded panel with HUD styling
const expandedPanelStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(0,5,15,0.98), rgba(10,20,40,0.95))',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${brandCyan}40`,
  borderRadius: 4,
  padding: 24,
  minWidth: 300,
  maxWidth: 340,
  boxShadow: `
    0 0 40px ${brandCyan}15,
    0 20px 60px rgba(0,0,0,0.5),
    inset 0 1px 0 ${brandCyan}15
  `,
  position: 'relative',
  overflow: 'hidden',
};

// Tech level badge with glow
const levelBadgeStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`,
  borderRadius: 6,
  padding: '5px 12px',
  fontSize: 11,
  fontWeight: 900,
  color: '#fff',
  letterSpacing: 1,
  textTransform: 'uppercase' as const,
  boxShadow: `0 0 15px ${brandCyan}40`,
  border: `1px solid ${brandCyan}40`,
};

// XP Progress bar with advanced styling
const progressBarStyle: React.CSSProperties = {
  ...gamificationStyles.xpBarContainer,
  height: 8,
  marginTop: 10,
  background: 'rgba(0,0,0,0.5)',
  border: `1px solid ${brandCyan}25`,
};

// Achievement item with holographic effect
const achievementItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 12px',
  background: `linear-gradient(135deg, ${brandCyan}08, ${brandPurple}05)`,
  borderRadius: 8,
  border: `1px solid ${brandCyan}25`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
};

// Locked achievement with muted styling
const lockedAchievementStyle: React.CSSProperties = {
  ...achievementItemStyle,
  opacity: 0.5,
  filter: 'grayscale(0.6)',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.08)',
};

export default function ProgressHUD() {
  const [expanded, setExpanded] = useState(false);
  const { state, getUnlockedAchievements, getNextAchievements } = useGamification();

  const unlockedAchievements = getUnlockedAchievements();
  const nextAchievements = getNextAchievements();

  // Inject advanced futuristic styles
  const hudCss = useMemo(() => `
    /* Mobile responsive */
    @media (max-width: 768px) {
      .progress-hud {
        top: auto !important;
        bottom: 80px !important;
        left: 12px !important;
        right: auto !important;
      }
      .progress-hud-expanded {
        top: auto !important;
        bottom: 80px !important;
        left: 12px !important;
        right: 12px !important;
        max-height: 60vh;
        overflow-y: auto;
      }
      .progress-hud-expanded > div {
        max-width: 100% !important;
        min-width: auto !important;
      }
    }

    /* HUD Scan Line */
    @keyframes hudScanLine {
      0% { top: -10%; opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.6; }
      100% { top: 110%; opacity: 0; }
    }

    /* HUD Corner Pulse */
    @keyframes hudCornerPulse {
      0%, 100% { opacity: 0.5; box-shadow: 0 0 4px ${brandCyan}; }
      50% { opacity: 1; box-shadow: 0 0 10px ${brandCyan}; }
    }

    /* XP Bar Glow */
    @keyframes xpBarGlow {
      0%, 100% { box-shadow: 0 0 10px ${brandCyan}40; }
      50% { box-shadow: 0 0 20px ${brandCyan}60, 0 0 30px ${brandCyan}30; }
    }

    /* XP Shimmer */
    @keyframes xpShimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    /* Achievement Shine */
    @keyframes achievementShine {
      0%, 100% { box-shadow: 0 0 10px ${brandCyan}20; }
      50% { box-shadow: 0 0 20px ${brandCyan}40, 0 0 30px ${brandPurple}20; }
    }

    /* Level Badge Pulse */
    @keyframes levelBadgePulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 20px ${brandCyan}40; }
      50% { transform: scale(1.05); box-shadow: 0 0 30px ${brandCyan}60, 0 0 40px ${brandPurple}30; }
    }

    /* Data Stream */
    @keyframes dataStream {
      0% { transform: translateY(100%); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100%); opacity: 0; }
    }

    /* Status Pulse */
    @keyframes statusPulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 6px #22c55e; }
      50% { opacity: 0.6; box-shadow: 0 0 12px #22c55e; }
    }

    .hud-scan-line {
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, ${brandCyan}60, transparent);
      animation: hudScanLine 4s linear infinite;
      pointer-events: none;
    }

    .hud-corner {
      position: absolute;
      width: 12px;
      height: 12px;
      border-color: ${brandCyan};
      border-style: solid;
      animation: hudCornerPulse 3s ease-in-out infinite;
    }

    .hud-data-line {
      position: absolute;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, ${brandCyan}30, transparent);
    }

    .xp-bar-container {
      position: relative;
      overflow: hidden;
    }

    .xp-bar-fill {
      animation: xpBarGlow 2s ease-in-out infinite;
    }

    .xp-shimmer {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: xpShimmer 2.5s ease-in-out infinite;
    }

    .achievement-item:hover {
      transform: translateX(4px);
      border-color: ${brandCyan}50;
      box-shadow: 0 0 20px ${brandCyan}20;
    }

    .achievement-shine {
      animation: achievementShine 3s ease-in-out infinite;
    }

    .level-badge-glow {
      animation: levelBadgePulse 2.5s ease-in-out infinite;
    }

    .status-indicator {
      animation: statusPulse 2s ease-in-out infinite;
    }

    .data-stream-particle {
      position: absolute;
      width: 2px;
      height: 8px;
      background: ${brandCyan};
      opacity: 0.6;
      animation: dataStream 3s linear infinite;
    }
  `, []);

  // Calculate level progress
  const levelThresholds = [0, 50, 150, 300, 500];
  const currentLevelPoints = levelThresholds[state.level - 1] || 0;
  const rawNextLevelPoints = levelThresholds[state.level] ?? levelThresholds[levelThresholds.length - 1];
  const isMaxLevel = state.level >= levelThresholds.length;
  const nextLevelPoints = isMaxLevel ? state.totalPoints : rawNextLevelPoints;
  const levelRange = nextLevelPoints - currentLevelPoints;
  const rawProgress = levelRange > 0 ? ((state.totalPoints - currentLevelPoints) / levelRange) * 100 : 100;
  const progressToNextLevel = Math.max(0, Math.min(100, rawProgress));
  const xpToNextLevel = Math.max(0, nextLevelPoints - state.totalPoints);

  if (!expanded) {
    return (
      <>
        <style>{hudCss}</style>
        <div className="progress-hud" style={hudContainerStyle}>
          <button
            style={hudButtonStyle}
            onClick={() => setExpanded(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = `0 0 30px ${brandCyan}30, 0 8px 40px rgba(0,0,0,0.5)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 0 20px ${brandCyan}20, 0 8px 32px rgba(0,0,0,0.4)`;
            }}
          >
            {/* HUD Corners */}
            <div className="hud-corner" style={{ top: 4, left: 4, borderWidth: '2px 0 0 2px' }} />
            <div className="hud-corner" style={{ top: 4, right: 4, borderWidth: '2px 2px 0 0' }} />
            <div className="hud-corner" style={{ bottom: 4, left: 4, borderWidth: '0 0 2px 2px' }} />
            <div className="hud-corner" style={{ bottom: 4, right: 4, borderWidth: '0 2px 2px 0' }} />

            {/* Scan Line Effect */}
            <div className="hud-scan-line" />

            {/* Level Badge with glow */}
            <div className="level-badge-glow" style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 900,
              color: '#fff',
              border: `2px solid ${brandCyan}60`,
              boxShadow: `0 0 20px ${brandCyan}40`,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}>
              {state.level}
            </div>

            {/* XP Display */}
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: 14,
                fontWeight: 900,
                color: brandCyan,
                textShadow: `0 0 10px ${brandCyan}60`,
                letterSpacing: 0.5,
              }}>
                {state.totalPoints} XP
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 10,
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 700,
                letterSpacing: 0.5,
              }}>
                <span className="status-indicator" style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                }} />
                {unlockedAchievements.length} إنجاز
              </div>
            </div>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{hudCss}</style>
      <div className="progress-hud-expanded" style={hudContainerStyle}>
        <div style={expandedPanelStyle}>
          {/* HUD Corners */}
          <div className="hud-corner" style={{ top: 6, left: 6, borderWidth: '2px 0 0 2px' }} />
          <div className="hud-corner" style={{ top: 6, right: 6, borderWidth: '2px 2px 0 0' }} />
          <div className="hud-corner" style={{ bottom: 6, left: 6, borderWidth: '0 0 2px 2px' }} />
          <div className="hud-corner" style={{ bottom: 6, right: 6, borderWidth: '0 2px 2px 0' }} />

          {/* Scan Line Effect */}
          <div className="hud-scan-line" />

          {/* Data Stream Particles */}
          <div className="data-stream-particle" style={{ left: '10%', animationDelay: '0s' }} />
          <div className="data-stream-particle" style={{ left: '30%', animationDelay: '1s' }} />
          <div className="data-stream-particle" style={{ left: '70%', animationDelay: '2s' }} />
          <div className="data-stream-particle" style={{ left: '90%', animationDelay: '0.5s' }} />

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            padding: '10px 14px',
            background: `linear-gradient(90deg, ${brandCyan}10, transparent, ${brandPurple}10)`,
            borderBottom: `1px solid ${brandCyan}30`,
            borderRadius: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Level Badge */}
              <div className="level-badge-glow" style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 900,
                color: '#fff',
                boxShadow: `0 0 25px ${brandCyan}50`,
                border: `3px solid ${brandCyan}50`,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}>
                {state.level}
              </div>
              <div>
                <div style={levelBadgeStyle}>المستوى {state.level}</div>
                <div style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: 6,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span className="status-indicator" style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isMaxLevel ? brandCyan : '#22c55e',
                    boxShadow: `0 0 8px ${isMaxLevel ? brandCyan : '#22c55e'}`,
                  }} />
                  {isMaxLevel ? 'المستوى الأقصى' : `${xpToNextLevel} XP للمستوى التالي`}
                </div>
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: `1px solid ${brandCyan}30`,
                borderRadius: 4,
                padding: '8px 12px',
                color: brandCyan,
                cursor: 'pointer',
                fontSize: 16,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${brandCyan}20`;
                e.currentTarget.style.borderColor = brandCyan;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = `${brandCyan}30`;
              }}
            >
              ×
            </button>
          </div>

          {/* XP Progress */}
          <div style={{ marginBottom: 20, position: 'relative' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12,
              marginBottom: 6,
              fontFamily: 'monospace',
            }}>
              <span style={{
                color: brandCyan,
                fontWeight: 800,
                textShadow: `0 0 10px ${brandCyan}60`,
              }}>{state.totalPoints} XP</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{nextLevelPoints} XP</span>
            </div>
            <div className="xp-bar-container" style={progressBarStyle}>
              <div className="xp-bar-fill" style={{
                height: '100%',
                width: `${progressToNextLevel}%`,
                background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple}, ${brandPink})`,
                transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                borderRadius: 4,
                position: 'relative',
              }}>
                <div className="xp-shimmer" />
              </div>
            </div>
            {/* Progress percentage label */}
            <div style={{
              marginTop: 6,
              fontSize: 10,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
              textAlign: 'center',
              letterSpacing: 1,
            }}>
              {Math.round(progressToNextLevel)}% COMPLETE
            </div>
          </div>

          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 800,
                color: brandCyan,
                marginBottom: 10,
                letterSpacing: 1,
                textTransform: 'uppercase' as const,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{
                  width: 8,
                  height: 2,
                  background: brandCyan,
                  boxShadow: `0 0 6px ${brandCyan}`,
                }} />
                الإنجازات المفتوحة ({unlockedAchievements.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 160, overflowY: 'auto' }}>
                {unlockedAchievements.map(achievement => (
                  <div key={achievement.id} className="achievement-item achievement-shine" style={achievementItemStyle}>
                    <span style={{
                      fontSize: 24,
                      filter: `drop-shadow(0 0 8px ${brandCyan}40)`,
                    }}>{achievement.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                        {achievement.titleAr}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: brandCyan,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                        <span style={{ fontSize: 10 }}>+</span>
                        {achievement.points} XP
                      </div>
                    </div>
                    <span style={{
                      fontSize: 12,
                      color: '#22c55e',
                      textShadow: '0 0 8px #22c55e',
                    }}>✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Achievements */}
          {nextAchievements.length > 0 && (
            <div>
              <div style={{
                fontSize: 11,
                fontWeight: 800,
                color: 'rgba(255,255,255,0.5)',
                marginBottom: 10,
                letterSpacing: 1,
                textTransform: 'uppercase' as const,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{
                  width: 8,
                  height: 2,
                  background: 'rgba(255,255,255,0.3)',
                }} />
                الإنجازات القادمة
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {nextAchievements.map(achievement => (
                  <div key={achievement.id} className="achievement-item" style={lockedAchievementStyle}>
                    <span style={{ fontSize: 22, filter: 'grayscale(0.8) opacity(0.5)' }}>{achievement.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>
                        {achievement.titleAr}
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
                        {achievement.descriptionAr}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.25)',
                      filter: 'grayscale(1)',
                    }}>🔒</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer status line */}
          <div style={{
            marginTop: 20,
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 4,
            border: `1px solid ${brandCyan}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: 1,
            }}>
              LOTUS LAB // GAMIFICATION SYS
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span className="status-indicator" style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 6px #22c55e',
              }} />
              <span style={{
                fontSize: 9,
                fontFamily: 'monospace',
                color: '#22c55e',
                letterSpacing: 1,
              }}>ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
