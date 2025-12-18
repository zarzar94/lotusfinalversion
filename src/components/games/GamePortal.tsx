/**
 * GamePortal - Enhanced Special Delivery Design for the Screening Games
 * Optimized with memoization, smooth transitions, and polished visuals
 */

import React, { useEffect, useMemo, useState, useRef, useCallback, memo } from 'react';
import { brandCyan, brandPink, brandPurple } from '../styles';
import {
  GAME_ACHIEVEMENTS,
  checkGameAchievements,
  getSessions,
  type StoredSession,
  type GameAchievement,
} from './scoring';
import type { GameResult, TestOutcome } from './types';

// ==================== CONSTANTS ====================

const PARTICLE_COUNT = 35; // Reduced for performance
const CONNECTION_DISTANCE = 80;

const GAME_CONFIG = [
  { mode: 'suite', icon: '🧪', title: 'الفحص الشامل', desc: '3 اختبارات', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  { mode: 'attention', icon: '🎯', title: 'الانتباه', desc: 'Go/No-Go', color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)' },
  { mode: 'frequency', icon: '🎚️', title: 'التردد', desc: 'Adaptive', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' },
  { mode: 'sequence', icon: '🏫', title: 'التسلسل', desc: 'الذاكرة', color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
  { mode: 'questionnaire', icon: '📝', title: 'الاستبيان', desc: 'للأهل', color: brandPink, gradient: `linear-gradient(135deg, ${brandPink}, #9D174D)` },
] as const;

// ==================== CSS KEYFRAMES ====================

const KEYFRAMES = `
  @keyframes portalPulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(143,211,204,0.3)); }
    50% { transform: scale(1.08); filter: drop-shadow(0 0 25px rgba(143,211,204,0.5)); }
  }
  @keyframes quickStartEnter {
    from { opacity: 0; transform: translateY(24px) scale(0.92); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(143,211,204,0.2); }
    50% { box-shadow: 0 0 40px rgba(143,211,204,0.4); }
  }
  @keyframes floatUp {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes ripple {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2.5); opacity: 0; }
  }
`;

// ==================== ANIMATED BACKGROUND ====================

const AnimatedBackground = memo(function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const colors = [brandCyan, brandPink, brandPurple, '#22c55e', '#3B82F6'];
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2); // Cap DPR for performance
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const createParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const init = () => {
      resize();
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, createParticle);
    };

    let lastTime = 0;
    const animate = (time: number) => {
      // Throttle to ~30fps for performance
      if (time - lastTime < 33) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Draw connections (only check nearby particles)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(143,211,204,${0.12 * (1 - dist / CONNECTION_DISTANCE)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    init();
    frameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resize();
      particlesRef.current.forEach(p => {
        p.x = Math.min(p.x, width);
        p.y = Math.min(p.y, height);
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.5,
      }}
    />
  );
});

// ==================== STAT BADGE ====================

const StatBadge = memo(function StatBadge({
  icon,
  value,
  label,
  color,
  animate = false,
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
  animate?: boolean;
}) {
  return (
    <div
      style={{
        padding: '12px 18px',
        background: `linear-gradient(145deg, ${color}18, ${color}08)`,
        border: `1px solid ${color}33`,
        borderRadius: 14,
        textAlign: 'center',
        minWidth: 90,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        animation: animate ? 'glowPulse 2s ease-in-out infinite' : undefined,
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 4, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{icon}</div>
      <div style={{
        fontSize: 20,
        fontWeight: 900,
        color,
        textShadow: `0 0 20px ${color}44`,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 9,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginTop: 2,
      }}>
        {label}
      </div>
    </div>
  );
});

// ==================== PORTAL HEADER ====================

const PortalHeader = memo(function PortalHeader({
  totalPoints,
  sessionsCount,
  streak,
}: {
  totalPoints: number;
  sessionsCount: number;
  streak: number;
}) {
  return (
    <div
      style={{
        position: 'relative',
        padding: '28px 24px',
        background: 'linear-gradient(180deg, #1a1f2e 0%, #0d1117 100%)',
        borderRadius: '24px 24px 0 0',
        borderBottom: '1px solid rgba(143,211,204,0.12)',
        overflow: 'hidden',
      }}
    >
      <AnimatedBackground />

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at top right, rgba(143,211,204,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          {/* Logo and Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: 'linear-gradient(135deg, rgba(143,211,204,0.15), rgba(176,18,112,0.15))',
                border: '2px solid rgba(143,211,204,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
                animation: 'portalPulse 3s ease-in-out infinite',
              }}
            >
              🧠
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${brandCyan}, ${brandPink})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.5px',
                }}
              >
                Lotus Sound Lab
              </h2>
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.55)',
                  marginTop: 4,
                  fontWeight: 500,
                  direction: 'rtl',
                }}
              >
                معمل الفحص السمعي التفاعلي
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 14 }}>
            <StatBadge icon="⭐" value={totalPoints.toLocaleString()} label="النقاط" color={brandCyan} animate={totalPoints > 0} />
            <StatBadge icon="🎮" value={sessionsCount.toString()} label="الجلسات" color={brandPurple} />
            {streak > 0 && <StatBadge icon="🔥" value={streak.toString()} label="التوالي" color="#F59E0B" />}
          </div>
        </div>
      </div>
    </div>
  );
});

// ==================== GAME CARD ====================

const GameCard = memo(function GameCard({
  game,
  index,
  onSelect,
}: {
  game: typeof GAME_CONFIG[number];
  index: number;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        padding: 0,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        animation: `quickStartEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s backwards`,
      }}
    >
      <div
        style={{
          padding: 18,
          background: isHovered
            ? `linear-gradient(145deg, ${game.color}15, ${game.color}08)`
            : 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          border: `1.5px solid ${isHovered ? game.color : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 18,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isPressed
            ? 'scale(0.96)'
            : isHovered
              ? 'translateY(-8px) scale(1.02)'
              : 'none',
          boxShadow: isHovered
            ? `0 20px 40px ${game.color}20, 0 0 0 1px ${game.color}22`
            : '0 4px 12px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ripple effect on hover */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `${game.color}15`,
              animation: 'ripple 1s ease-out infinite',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        )}

        <div
          style={{
            fontSize: 36,
            marginBottom: 10,
            filter: isHovered ? `drop-shadow(0 0 15px ${game.color}66)` : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            transition: 'filter 0.3s ease',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {game.icon}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: isHovered ? '#fff' : 'rgba(255,255,255,0.9)',
            marginBottom: 4,
            transition: 'color 0.3s ease',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {game.title}
        </div>
        <div
          style={{
            fontSize: 11,
            color: isHovered ? game.color : 'rgba(255,255,255,0.5)',
            fontWeight: 600,
            transition: 'color 0.3s ease',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {game.desc}
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: game.gradient,
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>
    </button>
  );
});

// ==================== QUICK START SECTION ====================

const QuickStartSection = memo(function QuickStartSection({
  onSelectMode,
}: {
  onSelectMode: (mode: string) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 14,
      }}
    >
      {GAME_CONFIG.map((game, i) => (
        <GameCard key={game.mode} game={game} index={i} onSelect={() => onSelectMode(game.mode)} />
      ))}
    </div>
  );
});

// ==================== ACHIEVEMENT CARD ====================

const AchievementCard = memo(function AchievementCard({
  achievement,
  isUnlocked,
  index,
}: {
  achievement: GameAchievement;
  isUnlocked: boolean;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: 16,
        background: isUnlocked
          ? isHovered
            ? `linear-gradient(145deg, ${brandCyan}18, ${brandPink}12)`
            : 'rgba(255,255,255,0.05)'
          : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isUnlocked ? (isHovered ? brandCyan : 'rgba(255,255,255,0.1)') : 'rgba(255,255,255,0.05)'}`,
        borderRadius: 14,
        textAlign: 'center',
        cursor: isUnlocked ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isUnlocked && isHovered ? 'translateY(-4px) scale(1.03)' : 'none',
        opacity: isUnlocked ? 1 : 0.5,
        animation: `fadeSlideIn 0.4s ease-out ${index * 0.05}s backwards`,
      }}
    >
      <div
        style={{
          fontSize: 34,
          marginBottom: 8,
          filter: isUnlocked
            ? isHovered
              ? 'drop-shadow(0 0 12px rgba(143,211,204,0.6)) grayscale(0)'
              : 'grayscale(0)'
            : 'grayscale(1)',
          transition: 'filter 0.3s ease',
        }}
      >
        {isUnlocked ? achievement.icon : '🔒'}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: isUnlocked ? '#fff' : 'rgba(255,255,255,0.4)',
          marginBottom: 4,
          lineHeight: 1.3,
        }}
      >
        {isUnlocked ? achievement.titleAr : '???'}
      </div>
      {isUnlocked && (
        <div
          style={{
            fontSize: 10,
            color: brandCyan,
            fontWeight: 700,
          }}
        >
          +{achievement.points} pts
        </div>
      )}
    </div>
  );
});

// ==================== ACHIEVEMENT SHOWCASE ====================

const AchievementShowcase = memo(function AchievementShowcase({
  unlockedIds,
}: {
  unlockedIds: Set<string>;
}) {
  const achievements = useMemo(() => {
    // Show unlocked first, then locked
    const unlocked = GAME_ACHIEVEMENTS.filter(a => unlockedIds.has(a.id));
    const locked = GAME_ACHIEVEMENTS.filter(a => !unlockedIds.has(a.id)).slice(0, 3);
    return [...unlocked, ...locked];
  }, [unlockedIds]);

  if (achievements.length === 0) {
    return (
      <div
        style={{
          padding: 24,
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 16,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>🏆</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600 }}>
          ابدأ بالاختبارات لفتح الإنجازات!
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 6 }}>
          {GAME_ACHIEVEMENTS.length} إنجازات متاحة
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: 12,
      }}
    >
      {achievements.map((a, i) => (
        <AchievementCard
          key={a.id}
          achievement={a}
          isUnlocked={unlockedIds.has(a.id)}
          index={i}
        />
      ))}
    </div>
  );
});

// ==================== SESSION ITEM ====================

const SessionItem = memo(function SessionItem({
  session,
  isLatest,
  index,
}: {
  session: StoredSession;
  isLatest: boolean;
  index: number;
}) {
  const date = useMemo(() => new Date(session.date), [session.date]);
  const testsCompleted = Object.keys(session.outcomes).length;
  const results = Object.values(session.outcomes);

  return (
    <div
      style={{
        padding: 14,
        background: isLatest
          ? 'linear-gradient(135deg, rgba(143,211,204,0.12), rgba(175,132,186,0.08))'
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isLatest ? 'rgba(143,211,204,0.25)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 14,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 14,
        animation: `fadeSlideIn 0.4s ease-out ${index * 0.1}s backwards`,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          {isLatest && (
            <span
              style={{
                fontSize: 9,
                padding: '3px 8px',
                background: brandCyan + '25',
                color: brandCyan,
                borderRadius: 6,
                fontWeight: 800,
                letterSpacing: '0.3px',
              }}
            >
              الأخيرة
            </span>
          )}
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
            {testsCompleted} اختبارات
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
          {date.toLocaleDateString('ar-SA')} • {date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Results summary */}
      <div style={{ display: 'flex', gap: 5 }}>
        {results.map((outcome, j) => (
          <div
            key={j}
            title={outcome?.title}
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              background: getResultColor(outcome?.result) + '18',
              border: `1.5px solid ${getResultColor(outcome?.result)}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
            }}
          >
            {outcome?.result === 'high' ? '⭐' : outcome?.result === 'medium' ? '✓' : '○'}
          </div>
        ))}
      </div>

      {/* Points */}
      {session.totalPoints !== undefined && session.totalPoints > 0 && (
        <div
          style={{
            padding: '8px 12px',
            background: 'rgba(143,211,204,0.1)',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 800,
            color: brandCyan,
          }}
        >
          {session.totalPoints} pts
        </div>
      )}
    </div>
  );
});

// ==================== SESSION HISTORY ====================

const SessionHistory = memo(function SessionHistory({
  sessions,
}: {
  sessions: StoredSession[];
}) {
  const recentSessions = useMemo(() => sessions.slice(0, 5), [sessions]);

  if (recentSessions.length === 0) {
    return (
      <div
        style={{
          padding: 24,
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 16,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>📊</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600 }}>
          لم تُكمل أي جلسة بعد
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 6 }}>
          ابدأ اختباراً لتتبع تقدمك
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {recentSessions.map((session, i) => (
        <SessionItem key={session.id} session={session} isLatest={i === 0} index={i} />
      ))}
      {sessions.length > 5 && (
        <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
          +{sessions.length - 5} جلسات سابقة
        </div>
      )}
    </div>
  );
});

// ==================== SECTION TITLE ====================

const SectionTitle = memo(function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, direction: 'rtl' }}>
      <span style={{ fontSize: 22, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>{title}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
});

// ==================== TIPS BANNER ====================

const TipsBanner = memo(function TipsBanner() {
  const tips = [
    { icon: '🎧', text: 'سماعات' },
    { icon: '🔊', text: 'صوت مريح' },
    { icon: '🤫', text: 'مكان هادئ' },
  ];

  return (
    <div
      style={{
        marginTop: 28,
        padding: 18,
        background: 'linear-gradient(135deg, rgba(143,211,204,0.08), rgba(143,211,204,0.04))',
        border: '1px solid rgba(143,211,204,0.15)',
        borderRadius: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        animation: 'fadeSlideIn 0.6s ease-out 0.3s backwards',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: 'rgba(143,211,204,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          animation: 'floatUp 3s ease-in-out infinite',
        }}
      >
        💡
      </div>
      <div style={{ flex: 1, direction: 'rtl', textAlign: 'right' }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: brandCyan, marginBottom: 3 }}>
          نصيحة للحصول على أفضل النتائج
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
          استخدم سماعات عالية الجودة، في مكان هادئ، وارفع مستوى الصوت لمستوى مريح.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {tips.map((tip, i) => (
          <div
            key={i}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              transition: 'all 0.2s ease',
            }}
            title={tip.text}
          >
            {tip.icon}
          </div>
        ))}
      </div>
    </div>
  );
});

// ==================== UTILITY FUNCTIONS ====================

function getResultColor(result?: GameResult): string {
  switch (result) {
    case 'high':
      return brandCyan;
    case 'medium':
      return brandPurple;
    case 'low':
      return brandPink;
    default:
      return 'rgba(255,255,255,0.3)';
  }
}

function calculateStreak(sessions: StoredSession[]): number {
  if (sessions.length === 0) return 0;

  let streak = 0;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  for (let i = 0; i < sessions.length; i++) {
    const sessionDate = new Date(sessions[i].date);
    const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate()).getTime();
    const dayDiff = Math.floor((today - sessionDay) / (1000 * 60 * 60 * 24));

    if (dayDiff === streak) {
      streak++;
    } else if (dayDiff > streak) {
      break;
    }
  }

  return streak;
}

// ==================== MAIN GAME PORTAL ====================

export default function GamePortal({
  onSelectMode,
  lastOutcome,
}: {
  onSelectMode: (mode: string) => void;
  lastOutcome?: TestOutcome | null;
}) {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized callbacks
  const handleSelectMode = useCallback(
    (mode: string) => {
      onSelectMode(mode);
    },
    [onSelectMode]
  );

  // Load data on mount
  useEffect(() => {
    const loadData = () => {
      const loadedSessions = getSessions();
      setSessions(loadedSessions);

      // Calculate total points
      const points = loadedSessions.reduce((sum, s) => sum + (s.totalPoints || 0), 0);
      setTotalPoints(points);

      // Check achievements
      if (loadedSessions.length > 0) {
        const latestOutcomes = loadedSessions[0].outcomes;
        const achievements = checkGameAchievements(latestOutcomes);
        setUnlockedIds(new Set(achievements.map(a => a.id)));
      }

      setIsLoading(false);
    };

    // Small delay for smooth loading transition
    const timer = setTimeout(loadData, 100);
    return () => clearTimeout(timer);
  }, [lastOutcome]);

  // Calculate streak
  const streak = useMemo(() => calculateStreak(sessions), [sessions]);

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #1a1f2e 0%, #0d1117 100%)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 30px 70px rgba(0,0,0,0.45), 0 0 60px rgba(143,211,204,0.06)',
        border: '1px solid rgba(143,211,204,0.12)',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      {/* Top glow bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${brandCyan}, ${brandPink}, transparent)`,
          opacity: 0.6,
          zIndex: 10,
        }}
      />

      <style>{KEYFRAMES}</style>

      {/* Portal Header */}
      <PortalHeader totalPoints={totalPoints} sessionsCount={sessions.length} streak={streak} />

      {/* Main Content */}
      <div style={{ padding: 28 }}>
        {/* Quick Start Section */}
        <div style={{ marginBottom: 32 }}>
          <SectionTitle icon="🚀" title="ابدأ اختباراً" subtitle="Quick Start" />
          <QuickStartSection onSelectMode={handleSelectMode} />
        </div>

        {/* Two Column Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28,
          }}
        >
          {/* Achievements */}
          <div>
            <SectionTitle icon="🏆" title="الإنجازات" subtitle="Achievements" />
            {!isLoading && <AchievementShowcase unlockedIds={unlockedIds} />}
          </div>

          {/* Session History */}
          <div>
            <SectionTitle icon="📈" title="سجل الجلسات" subtitle="History" />
            {!isLoading && <SessionHistory sessions={sessions} />}
          </div>
        </div>

        {/* Tips Banner */}
        <TipsBanner />
      </div>
    </div>
  );
}
