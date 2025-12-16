import { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { brandCyan, brandPurple, brandPink, brandPurpleDark } from './styles';

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

const hudButtonStyle: React.CSSProperties = {
  background: 'rgba(11,15,28,0.9)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${brandCyan}`,
  borderRadius: 14,
  padding: '10px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: `0 4px 20px rgba(143,211,204,0.2)`,
  position: 'relative',
  overflow: 'hidden',
};

const expandedPanelStyle: React.CSSProperties = {
  background: 'rgba(11,15,28,0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(143,211,204,0.3)',
  borderRadius: 18,
  padding: 20,
  minWidth: 280,
  maxWidth: 320,
  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
};

const levelBadgeStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${brandPurple}, ${brandPink})`,
  borderRadius: 10,
  padding: '4px 10px',
  fontSize: 12,
  fontWeight: 900,
  color: '#fff',
};

const progressBarStyle: React.CSSProperties = {
  height: 6,
  background: 'rgba(255,255,255,0.1)',
  borderRadius: 3,
  overflow: 'hidden',
  marginTop: 8,
};

const achievementItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 10px',
  background: 'rgba(255,255,255,0.03)',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.06)',
};

const lockedAchievementStyle: React.CSSProperties = {
  ...achievementItemStyle,
  opacity: 0.5,
};

export default function ProgressHUD() {
  const [expanded, setExpanded] = useState(false);
  const { state, getUnlockedAchievements, getNextAchievements } = useGamification();

  const unlockedAchievements = getUnlockedAchievements();
  const nextAchievements = getNextAchievements();

  // Inject mobile styles
  const mobileStyles = `
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
  `;

  // Calculate level progress
  const levelThresholds = [0, 50, 150, 300, 500, 750];
  const currentLevelPoints = levelThresholds[state.level - 1] || 0;
  const nextLevelPoints = levelThresholds[state.level] || levelThresholds[levelThresholds.length - 1];
  const levelRange = nextLevelPoints - currentLevelPoints;
  const rawProgress = levelRange > 0 ? ((state.totalPoints - currentLevelPoints) / levelRange) * 100 : 100;
  const progressToNextLevel = Math.max(0, Math.min(100, rawProgress));
  const xpToNextLevel = Math.max(0, nextLevelPoints - state.totalPoints);

  if (!expanded) {
    return (
      <>
        <style>{mobileStyles}</style>
        <div className="progress-hud" style={hudContainerStyle}>
          <button
            style={hudButtonStyle}
            onClick={() => setExpanded(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(143,211,204,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(143,211,204,0.2)';
          }}
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 900,
            color: '#fff',
          }}>
            {state.level}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>
              {state.totalPoints} XP
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
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
      <style>{mobileStyles}</style>
      <div className="progress-hud-expanded" style={hudContainerStyle}>
        <div style={expandedPanelStyle}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 900,
              color: '#fff',
              boxShadow: '0 4px 20px rgba(143,211,204,0.3)',
            }}>
              {state.level}
            </div>
            <div>
              <div style={levelBadgeStyle}>المستوى {state.level}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                {xpToNextLevel} XP للمستوى التالي
              </div>
            </div>
          </div>
          <button
            onClick={() => setExpanded(false)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 8,
              padding: '6px 10px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            ×
          </button>
        </div>

        {/* XP Progress */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: brandCyan, fontWeight: 800 }}>{state.totalPoints} XP</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{nextLevelPoints} XP</span>
          </div>
          <div style={progressBarStyle}>
            <div style={{
              height: '100%',
              width: `${progressToNextLevel}%`,
              background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
              transition: 'width 0.5s ease',
              borderRadius: 3,
            }} />
          </div>
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
              الإنجازات المفتوحة ({unlockedAchievements.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 150, overflowY: 'auto' }}>
              {unlockedAchievements.map(achievement => (
                <div key={achievement.id} style={achievementItemStyle}>
                  <span style={{ fontSize: 22 }}>{achievement.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                      {achievement.titleAr}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                      +{achievement.points} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Achievements */}
        {nextAchievements.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
              الإنجازات القادمة
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {nextAchievements.map(achievement => (
                <div key={achievement.id} style={lockedAchievementStyle}>
                  <span style={{ fontSize: 22, filter: 'grayscale(1)' }}>{achievement.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>
                      {achievement.titleAr}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                      {achievement.descriptionAr}
                    </div>
                  </div>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>🔒</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
