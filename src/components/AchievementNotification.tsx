import { useEffect, useState } from 'react';
import { useGamification, type Achievement } from '../context/GamificationContext';
import { brandCyan, brandPurple, brandPink } from './styles';

const notificationStyle: React.CSSProperties = {
  position: 'fixed',
  top: 100,
  left: '50%',
  transform: 'translateX(-50%) translateY(-20px)',
  background: 'linear-gradient(135deg, rgba(11,15,28,0.98), rgba(25,30,50,0.98))',
  border: `2px solid ${brandCyan}`,
  borderRadius: 20,
  padding: '16px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  zIndex: 1000,
  boxShadow: `0 0 40px rgba(143,211,204,0.4), 0 20px 60px rgba(0,0,0,0.5)`,
  opacity: 0,
  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
  pointerEvents: 'none',
};

const visibleStyle: React.CSSProperties = {
  ...notificationStyle,
  opacity: 1,
  transform: 'translateX(-50%) translateY(0)',
  pointerEvents: 'auto',
};

const iconStyle: React.CSSProperties = {
  fontSize: 42,
  filter: 'drop-shadow(0 0 10px rgba(143,211,204,0.5))',
  animation: 'achievementPop 0.6s ease-out',
};

const contentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 2,
  color: brandCyan,
  fontWeight: 800,
};

const titleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  color: '#fff',
  margin: 0,
};

const descStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(255,255,255,0.7)',
  margin: 0,
};

const pointsStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${brandPurple}, ${brandPink})`,
  padding: '6px 12px',
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 900,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

export default function AchievementNotification() {
  const { recentUnlock, clearRecentUnlock } = useGamification();
  const [visible, setVisible] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    if (recentUnlock) {
      setCurrentAchievement(recentUnlock);
      setVisible(true);

      const hideTimer = setTimeout(() => {
        setVisible(false);
        setTimeout(clearRecentUnlock, 500);
      }, 4000);

      return () => clearTimeout(hideTimer);
    }
  }, [recentUnlock, clearRecentUnlock]);

  if (!currentAchievement) return null;

  return (
    <>
      <style>{`
        @keyframes achievementPop {
          0% { transform: scale(0) rotate(-180deg); }
          50% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
      <div style={visible ? visibleStyle : notificationStyle}>
        <div style={iconStyle}>{currentAchievement.icon}</div>
        <div style={contentStyle}>
          <span style={labelStyle}>Achievement Unlocked!</span>
          <h4 style={titleStyle}>{currentAchievement.titleAr}</h4>
          <p style={descStyle}>{currentAchievement.descriptionAr}</p>
        </div>
        <div style={pointsStyle}>
          +{currentAchievement.points}
          <span style={{ fontSize: 10 }}>XP</span>
        </div>
      </div>
    </>
  );
}
