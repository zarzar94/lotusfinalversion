/**
 * GamePortal - Special Delivery Design for the Screening Games
 * An engaging visual portal with achievement showcase and session history
 */

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles } from '../styles';
import {
  GAME_ACHIEVEMENTS,
  checkGameAchievements,
  getSessions,
  getStarEmoji,
  type StoredSession,
  type GameAchievement,
} from './scoring';
import type { GameResult, TestOutcome } from './types';

// ==================== ANIMATED BACKGROUND ====================

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = [brandCyan, brandPink, brandPurple, '#22c55e', '#3B82F6'];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createParticle = () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const init = () => {
      resize();
      particles = Array.from({ length: 50 }, createParticle);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(143,211,204,${0.1 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
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
        opacity: 0.6,
      }}
    />
  );
}

// ==================== PORTAL HEADER ====================

function PortalHeader({ totalPoints, sessionsCount }: { totalPoints: number; sessionsCount: number }) {
  return (
    <div style={{
      position: 'relative',
      padding: '30px 24px',
      background: 'linear-gradient(135deg, rgba(30,35,45,0.95) 0%, rgba(45,35,60,0.95) 100%)',
      borderRadius: '24px 24px 0 0',
      borderBottom: '1px solid rgba(143,211,204,0.2)',
      overflow: 'hidden',
    }}>
      <AnimatedBackground />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {/* Logo and Title */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 8,
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(143,211,204,0.2), rgba(176,18,112,0.2))',
                border: '2px solid rgba(143,211,204,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                animation: 'portalPulse 3s ease-in-out infinite',
              }}>
                🧠
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${brandCyan}, ${brandPink})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Lotus Sound Lab
                </h2>
                <div style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: 2,
                  fontWeight: 500,
                }}>
                  معمل الفحص السمعي التفاعلي
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: 12,
          }}>
            <StatBadge
              icon="⭐"
              value={totalPoints.toLocaleString()}
              label="Total Points"
              color={brandCyan}
            />
            <StatBadge
              icon="🎯"
              value={sessionsCount.toString()}
              label="Sessions"
              color={brandPurple}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div style={{
      padding: '10px 16px',
      background: `linear-gradient(135deg, ${color}22, ${color}11)`,
      border: `1px solid ${color}44`,
      borderRadius: 12,
      textAlign: 'center',
      minWidth: 80,
    }}>
      <div style={{ fontSize: 18, marginBottom: 2 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

// ==================== ACHIEVEMENT SHOWCASE ====================

function AchievementShowcase({ achievements }: { achievements: GameAchievement[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (achievements.length === 0) {
    return (
      <div style={{
        padding: 20,
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>🏆</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
          ابدأ بالاختبارات لفتح الإنجازات!
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 4 }}>
          {GAME_ACHIEVEMENTS.length} إنجازات متاحة
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: 12,
    }}>
      {achievements.map((a) => (
        <div
          key={a.id}
          onMouseEnter={() => setHoveredId(a.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            padding: 14,
            background: hoveredId === a.id
              ? `linear-gradient(135deg, ${brandCyan}22, ${brandPink}22)`
              : 'rgba(255,255,255,0.05)',
            border: `1px solid ${hoveredId === a.id ? brandCyan : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 12,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: hoveredId === a.id ? 'translateY(-4px) scale(1.02)' : 'none',
          }}
        >
          <div style={{
            fontSize: 32,
            marginBottom: 8,
            filter: hoveredId === a.id ? 'drop-shadow(0 0 10px rgba(143,211,204,0.5))' : 'none',
            transition: 'filter 0.3s ease',
          }}>
            {a.icon}
          </div>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 4,
          }}>
            {a.titleAr}
          </div>
          <div style={{
            fontSize: 10,
            color: brandCyan,
            fontWeight: 600,
          }}>
            +{a.points} pts
          </div>
        </div>
      ))}

      {/* Locked achievements hint */}
      {achievements.length < GAME_ACHIEVEMENTS.length && (
        <div style={{
          padding: 14,
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed rgba(255,255,255,0.15)',
          borderRadius: 12,
          textAlign: 'center',
          opacity: 0.6,
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            +{GAME_ACHIEVEMENTS.length - achievements.length} مخفية
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== SESSION HISTORY ====================

function SessionHistory({ sessions }: { sessions: StoredSession[] }) {
  const recentSessions = sessions.slice(0, 5);

  if (recentSessions.length === 0) {
    return (
      <div style={{
        padding: 20,
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>📊</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
          لم تُكمل أي جلسة بعد
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 4 }}>
          ابدأ اختباراً لتتبع تقدمك
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {recentSessions.map((session, i) => {
        const date = new Date(session.date);
        const testsCompleted = Object.keys(session.outcomes).length;
        const results = Object.values(session.outcomes);

        return (
          <div
            key={session.id}
            style={{
              padding: 12,
              background: i === 0
                ? 'linear-gradient(135deg, rgba(143,211,204,0.1), rgba(175,132,186,0.1))'
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${i === 0 ? 'rgba(143,211,204,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
              }}>
                {i === 0 && (
                  <span style={{
                    fontSize: 9,
                    padding: '2px 6px',
                    background: brandCyan + '33',
                    color: brandCyan,
                    borderRadius: 4,
                    fontWeight: 700,
                  }}>
                    الأخيرة
                  </span>
                )}
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#fff',
                }}>
                  {testsCompleted} اختبارات
                </span>
              </div>
              <div style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.5)',
              }}>
                {date.toLocaleDateString('ar-SA')} • {date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Stars summary */}
            <div style={{
              display: 'flex',
              gap: 4,
            }}>
              {results.map((outcome, j) => (
                <div
                  key={j}
                  title={outcome?.title}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: getResultColor(outcome?.result) + '22',
                    border: `1px solid ${getResultColor(outcome?.result)}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                  }}
                >
                  {outcome?.result === 'high' ? '⭐' : outcome?.result === 'medium' ? '✓' : '○'}
                </div>
              ))}
            </div>

            {/* Points */}
            {session.totalPoints !== undefined && (
              <div style={{
                padding: '6px 10px',
                background: 'rgba(143,211,204,0.1)',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                color: brandCyan,
              }}>
                {session.totalPoints} pts
              </div>
            )}
          </div>
        );
      })}

      {sessions.length > 5 && (
        <div style={{
          textAlign: 'center',
          fontSize: 11,
          color: 'rgba(255,255,255,0.4)',
          marginTop: 4,
        }}>
          +{sessions.length - 5} جلسات سابقة
        </div>
      )}
    </div>
  );
}

function getResultColor(result?: GameResult): string {
  switch (result) {
    case 'high': return brandCyan;
    case 'medium': return brandPurple;
    case 'low': return brandPink;
    default: return 'rgba(255,255,255,0.3)';
  }
}

// ==================== QUICK START BUTTONS ====================

function QuickStartSection({ onSelectMode }: { onSelectMode: (mode: string) => void }) {
  const games = [
    { mode: 'suite', icon: '🧪', title: 'الفحص الشامل', desc: '3 اختبارات', color: '#22c55e' },
    { mode: 'attention', icon: '🎯', title: 'الانتباه', desc: 'Go/No-Go', color: '#3B82F6' },
    { mode: 'frequency', icon: '🎚️', title: 'التردد', desc: 'Adaptive', color: '#8B5CF6' },
    { mode: 'sequence', icon: '🏫', title: 'التسلسل', desc: 'الذاكرة', color: '#F59E0B' },
    { mode: 'questionnaire', icon: '📝', title: 'الاستبيان', desc: 'للأهل', color: brandPink },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: 10,
    }}>
      {games.map((game, i) => (
        <button
          key={game.mode}
          onClick={() => onSelectMode(game.mode)}
          style={{
            padding: 14,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            border: `1px solid ${game.color}44`,
            borderRadius: 14,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            animation: `quickStartEnter 0.5s ease-out ${i * 0.08}s backwards`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
            e.currentTarget.style.borderColor = game.color;
            e.currentTarget.style.boxShadow = `0 15px 30px ${game.color}22`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.borderColor = `${game.color}44`;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            fontSize: 28,
            marginBottom: 8,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}>
            {game.icon}
          </div>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 2,
          }}>
            {game.title}
          </div>
          <div style={{
            fontSize: 10,
            color: game.color,
            fontWeight: 500,
          }}>
            {game.desc}
          </div>
        </button>
      ))}
    </div>
  );
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
  const [unlockedAchievements, setUnlockedAchievements] = useState<GameAchievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  // Load data on mount
  useEffect(() => {
    const loadedSessions = getSessions();
    setSessions(loadedSessions);

    // Calculate total points across all sessions
    const points = loadedSessions.reduce((sum, s) => sum + (s.totalPoints || 0), 0);
    setTotalPoints(points);

    // Check achievements based on latest session outcomes
    if (loadedSessions.length > 0) {
      const latestOutcomes = loadedSessions[0].outcomes;
      const achievements = checkGameAchievements(latestOutcomes);
      setUnlockedAchievements(achievements);
    }
  }, [lastOutcome]); // Re-check when outcome changes

  return (
    <div style={{
      background: 'linear-gradient(180deg, #1E232C 0%, #2A2F3A 100%)',
      borderRadius: 24,
      overflow: 'hidden',
      boxShadow: '0 25px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      border: '1px solid rgba(143,211,204,0.15)',
    }}>
      <style>{`
        @keyframes portalPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(143,211,204,0.3); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(143,211,204,0.5); }
        }
        @keyframes quickStartEnter {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Portal Header */}
      <PortalHeader totalPoints={totalPoints} sessionsCount={sessions.length} />

      {/* Main Content */}
      <div style={{ padding: 24 }}>
        {/* Quick Start Section */}
        <div style={{ marginBottom: 24 }}>
          <SectionTitle icon="🚀" title="ابدأ اختباراً" subtitle="Quick Start" />
          <QuickStartSection onSelectMode={onSelectMode} />
        </div>

        {/* Two Column Layout for larger screens */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {/* Achievements */}
          <div>
            <SectionTitle icon="🏆" title="الإنجازات" subtitle="Achievements" />
            <AchievementShowcase achievements={unlockedAchievements} />
          </div>

          {/* Session History */}
          <div>
            <SectionTitle icon="📈" title="سجل الجلسات" subtitle="History" />
            <SessionHistory sessions={sessions} />
          </div>
        </div>

        {/* Footer Tips */}
        <div style={{
          marginTop: 24,
          padding: 16,
          background: 'rgba(143,211,204,0.08)',
          border: '1px solid rgba(143,211,204,0.2)',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(143,211,204,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}>
            💡
          </div>
          <div style={{ flex: 1, direction: 'rtl', textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: brandCyan, marginBottom: 2 }}>
              نصيحة للحصول على أفضل النتائج
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
              استخدم سماعات عالية الجودة، في مكان هادئ، وارفع مستوى الصوت لمستوى مريح قبل البدء.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['🎧', '🔊', '🤫'].map((e, i) => (
              <span key={i} style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}>
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14,
      direction: 'rtl',
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>{title}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{subtitle}</div>
      </div>
    </div>
  );
}
