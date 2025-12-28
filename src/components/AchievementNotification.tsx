import { useEffect, useState } from 'react';
import { useGamification, type Achievement } from '../context/GamificationContext';
import { renderLabIcon, SparklesIcon } from './icons/index';
import { brandCyan, brandPurple, brandPink, colors } from './styles';

// Generate random particles for confetti effect
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1,
    size: 4 + Math.random() * 6,
    color: [brandCyan, brandPurple, brandPink, colors.warning, colors.error][Math.floor(Math.random() * 5)],
  }));
};

const notificationStyle: React.CSSProperties = {
  position: 'fixed',
  top: 100,
  left: '50%',
  transform: 'translateX(-50%) translateY(-20px)',
  background: 'linear-gradient(135deg, rgba(11,15,28,0.98), rgba(25,30,50,0.98))',
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
  overflow: 'visible',
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
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

const titleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  color: colors.text.primary,
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
  color: colors.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

export default function AchievementNotification() {
  const { recentUnlock, clearRecentUnlock } = useGamification();
  const [visible, setVisible] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles>>([]);

  useEffect(() => {
    if (!recentUnlock) return;

    setCurrentAchievement(recentUnlock);
    setParticles(generateParticles(20));
    setVisible(true);

    let clearTimer: ReturnType<typeof setTimeout> | null = null;
    const hideTimer = setTimeout(() => {
      setVisible(false);
      clearTimer = setTimeout(() => clearRecentUnlock(), 500);
    }, 4000);

    return () => {
      clearTimeout(hideTimer);
      if (clearTimer) clearTimeout(clearTimer);
    };
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
        @keyframes confettiFall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(80px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes borderGlow {
          0%, 100% {
            border-color: ${brandCyan};
            box-shadow: 0 0 20px rgba(143,211,204,0.3), 0 20px 60px rgba(0,0,0,0.5);
          }
          33% {
            border-color: ${brandPurple};
            box-shadow: 0 0 20px rgba(175,132,186,0.3), 0 20px 60px rgba(0,0,0,0.5);
          }
          66% {
            border-color: ${brandPink};
            box-shadow: 0 0 20px rgba(176,18,112,0.3), 0 20px 60px rgba(0,0,0,0.5);
          }
        }
        .achievement-notification {
          border: 2px solid ${brandCyan};
        }
        .achievement-notification.visible {
          animation: borderGlow 2s ease-in-out infinite;
        }
      `}</style>
      <div
        className={`achievement-notification ${visible ? 'visible' : ''}`}
        style={visible ? visibleStyle : notificationStyle}
      >
        {/* Confetti particles */}
        {visible && particles.map(particle => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              top: 0,
              left: `${particle.x}%`,
              width: particle.size,
              height: particle.size,
              background: particle.color,
              borderRadius: particle.size > 6 ? 2 : '50%',
              animation: `confettiFall ${particle.duration}s ease-out ${particle.delay}s forwards`,
              pointerEvents: 'none',
            }}
          />
        ))}

        <div style={iconStyle}>
          {renderLabIcon(currentAchievement.icon, { size: 42, tone: 'cyan' })}
        </div>
        <div style={contentStyle}>
          <span style={labelStyle}>
            <SparklesIcon tone="cyan" size={14} />
            إنجاز جديد!
          </span>
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
