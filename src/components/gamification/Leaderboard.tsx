/**
 * Leaderboard - Real-time rankings and score comparisons
 * Provides social motivation through friendly competition
 */

import { memo, useMemo, useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
  transitions,
  shadows,
} from '../styles';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface LeaderboardEntry {
  id: string;
  name: string;
  nameAr?: string;
  avatar?: string;
  points: number;
  level: number;
  sessionsCompleted: number;
  streak: number;
  rank: number;
  previousRank?: number;
  isCurrentUser?: boolean;
  badge?: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  isArabic?: boolean;
  variant?: 'full' | 'compact' | 'mini';
  title?: string;
  titleAr?: string;
  showPoints?: boolean;
  showSessions?: boolean;
  showStreak?: boolean;
  maxDisplay?: number;
  onViewMore?: () => void;
}

interface RankBadgeProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
}

interface UserRankCardProps {
  entry: LeaderboardEntry;
  totalParticipants: number;
  isArabic?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Sonic Star', nameAr: 'نجم صوتي', points: 2450, level: 5, sessionsCompleted: 18, streak: 12, rank: 1, badge: '🌟' },
  { id: '2', name: 'Wave Rider', nameAr: 'راكب الموجة', points: 2280, level: 5, sessionsCompleted: 17, streak: 8, rank: 2, badge: '🌊' },
  { id: '3', name: 'Echo Master', nameAr: 'أستاذ الصدى', points: 2100, level: 4, sessionsCompleted: 16, streak: 5, rank: 3, badge: '🎭' },
  { id: '4', name: 'Sound Seeker', nameAr: 'باحث الصوت', points: 1890, level: 4, sessionsCompleted: 15, streak: 7, rank: 4 },
  { id: '5', name: 'Frequency Hero', nameAr: 'بطل التردد', points: 1720, level: 4, sessionsCompleted: 14, streak: 3, rank: 5 },
  { id: '6', name: 'Melody Hunter', nameAr: 'صياد اللحن', points: 1580, level: 3, sessionsCompleted: 13, streak: 4, rank: 6 },
  { id: '7', name: 'Rhythm Runner', nameAr: 'عداء الإيقاع', points: 1420, level: 3, sessionsCompleted: 12, streak: 2, rank: 7, isCurrentUser: true },
  { id: '8', name: 'Beat Blazer', nameAr: 'مشعل الإيقاع', points: 1350, level: 3, sessionsCompleted: 11, streak: 6, rank: 8 },
  { id: '9', name: 'Note Navigator', nameAr: 'ملاح النغمات', points: 1200, level: 3, sessionsCompleted: 10, streak: 1, rank: 9 },
  { id: '10', name: 'Tune Tracker', nameAr: 'متتبع النغمة', points: 1050, level: 2, sessionsCompleted: 9, streak: 0, rank: 10 },
];

// ═══════════════════════════════════════════════════════════════════════════
// RANK BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const RankBadge = memo(({ rank, size = 'md' }: RankBadgeProps) => {
  const sizes = {
    sm: { width: 24, fontSize: 12 },
    md: { width: 36, fontSize: 16 },
    lg: { width: 48, fontSize: 20 },
  };

  const config = sizes[size];

  const getColors = () => {
    switch (rank) {
      case 1:
        return { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', icon: '🥇', shadow: '0 0 12px rgba(255,215,0,0.4)' };
      case 2:
        return { bg: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)', icon: '🥈', shadow: '0 0 12px rgba(192,192,192,0.4)' };
      case 3:
        return { bg: 'linear-gradient(135deg, #CD7F32, #8B4513)', icon: '🥉', shadow: '0 0 12px rgba(205,127,50,0.4)' };
      default:
        return { bg: colors.surface.card, icon: `#${rank}`, shadow: 'none' };
    }
  };

  const { bg, icon, shadow } = getColors();

  return (
    <div style={{
      width: config.width,
      height: config.width,
      borderRadius: rank <= 3 ? radius.full : radius.md,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: rank <= 3 ? config.fontSize * 1.2 : config.fontSize,
      fontWeight: typography.weight.black,
      color: rank <= 3 ? 'transparent' : colors.text.muted,
      boxShadow: shadow,
      border: rank > 3 ? `1px solid ${colors.border.default}` : 'none',
    }}>
      {rank <= 3 ? icon : rank}
    </div>
  );
});
RankBadge.displayName = 'RankBadge';

// ═══════════════════════════════════════════════════════════════════════════
// USER RANK CARD (Shows current user's rank)
// ═══════════════════════════════════════════════════════════════════════════

export const UserRankCard = memo(({
  entry,
  totalParticipants,
  isArabic = false,
}: UserRankCardProps) => {
  const percentile = Math.round(((totalParticipants - entry.rank + 1) / totalParticipants) * 100);
  const rankChange = entry.previousRank ? entry.previousRank - entry.rank : 0;

  return (
    <div style={{
      padding: spacing[4],
      background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
      border: `2px solid ${brandCyan}40`,
      borderRadius: radius.xl,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[3],
      }}>
        <div style={{
          fontSize: typography.size.xs,
          color: brandCyan,
          fontWeight: typography.weight.bold,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
          {isArabic ? 'ترتيبك' : 'Your Rank'}
        </div>
        {rankChange !== 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[1],
            padding: `${spacing[1]}px ${spacing[2]}px`,
            background: rankChange > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            borderRadius: radius.full,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: rankChange > 0 ? '#22c55e' : '#ef4444',
          }}>
            {rankChange > 0 ? '↑' : '↓'} {Math.abs(rankChange)}
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[4],
      }}>
        <RankBadge rank={entry.rank} size="lg" />
        <div>
          <div style={{
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
          }}>
            #{entry.rank}
          </div>
          <div style={{
            fontSize: typography.size.sm,
            color: colors.text.secondary,
          }}>
            {isArabic
              ? `أفضل من ${percentile}% من اللاعبين`
              : `Top ${percentile}% of players`}
          </div>
        </div>

        <div style={{
          marginLeft: 'auto',
          textAlign: 'right',
        }}>
          <div style={{
            fontSize: typography.size.xl,
            fontWeight: typography.weight.black,
            color: brandCyan,
          }}>
            {entry.points.toLocaleString()}
          </div>
          <div style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            {isArabic ? 'نقطة' : 'points'}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{
        display: 'flex',
        gap: spacing[3],
        marginTop: spacing[4],
        paddingTop: spacing[3],
        borderTop: `1px solid ${colors.border.subtle}`,
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontSize: typography.size.lg,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}>
            {entry.level}
          </div>
          <div style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            {isArabic ? 'المستوى' : 'Level'}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontSize: typography.size.lg,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}>
            {entry.sessionsCompleted}
          </div>
          <div style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            {isArabic ? 'جلسات' : 'Sessions'}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontSize: typography.size.lg,
            fontWeight: typography.weight.bold,
            color: entry.streak > 0 ? '#f59e0b' : colors.text.primary,
          }}>
            {entry.streak > 0 ? `🔥${entry.streak}` : '-'}
          </div>
          <div style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            {isArabic ? 'استمرارية' : 'Streak'}
          </div>
        </div>
      </div>
    </div>
  );
});
UserRankCard.displayName = 'UserRankCard';

// ═══════════════════════════════════════════════════════════════════════════
// LEADERBOARD ENTRY ROW
// ═══════════════════════════════════════════════════════════════════════════

const LeaderboardRow = memo(({
  entry,
  isArabic,
  showPoints,
  showSessions,
  showStreak,
}: {
  entry: LeaderboardEntry;
  isArabic: boolean;
  showPoints: boolean;
  showSessions: boolean;
  showStreak: boolean;
}) => {
  const isTop3 = entry.rank <= 3;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
        padding: `${spacing[3]}px ${spacing[4]}px`,
        background: entry.isCurrentUser
          ? `linear-gradient(135deg, ${brandCyan}10, ${brandPurple}05)`
          : isTop3
          ? 'rgba(255,255,255,0.02)'
          : 'transparent',
        borderRadius: radius.lg,
        border: entry.isCurrentUser
          ? `2px solid ${brandCyan}40`
          : isTop3
          ? `1px solid ${colors.border.subtle}`
          : 'none',
        marginBottom: spacing[2],
        transition: transitions.fast,
      }}
    >
      {/* Rank */}
      <RankBadge rank={entry.rank} size="sm" />

      {/* Avatar/Badge */}
      <div style={{
        width: 36,
        height: 36,
        borderRadius: radius.full,
        background: entry.isCurrentUser
          ? `linear-gradient(135deg, ${brandCyan}30, ${brandPurple}20)`
          : colors.surface.card,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        border: `1px solid ${entry.isCurrentUser ? brandCyan : colors.border.default}`,
      }}>
        {entry.badge || entry.name[0]}
      </div>

      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: typography.size.sm,
          fontWeight: entry.isCurrentUser ? typography.weight.bold : typography.weight.medium,
          color: entry.isCurrentUser ? brandCyan : colors.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
        }}>
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {isArabic ? entry.nameAr || entry.name : entry.name}
          </span>
          {entry.isCurrentUser && (
            <span style={{
              fontSize: typography.size.xs,
              color: brandCyan,
              opacity: 0.8,
            }}>
              ({isArabic ? 'أنت' : 'You'})
            </span>
          )}
        </div>
        <div style={{
          fontSize: typography.size.xs,
          color: colors.text.muted,
        }}>
          {isArabic ? `المستوى ${entry.level}` : `Level ${entry.level}`}
        </div>
      </div>

      {/* Stats */}
      {showStreak && entry.streak > 0 && (
        <div style={{
          fontSize: typography.size.sm,
          color: '#f59e0b',
          fontWeight: typography.weight.bold,
        }}>
          🔥{entry.streak}
        </div>
      )}

      {showSessions && (
        <div style={{
          fontSize: typography.size.xs,
          color: colors.text.muted,
          textAlign: 'right',
        }}>
          {entry.sessionsCompleted} {isArabic ? 'جلسة' : 'sessions'}
        </div>
      )}

      {showPoints && (
        <div style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: entry.isCurrentUser ? brandCyan : colors.text.secondary,
          minWidth: 60,
          textAlign: 'right',
        }}>
          {entry.points.toLocaleString()}
        </div>
      )}
    </div>
  );
});
LeaderboardRow.displayName = 'LeaderboardRow';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN LEADERBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Leaderboard = memo(({
  entries,
  currentUserId,
  isArabic = false,
  variant = 'full',
  title,
  titleAr,
  showPoints = true,
  showSessions = false,
  showStreak = true,
  maxDisplay = 10,
  onViewMore,
}: LeaderboardProps) => {
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  const sortedEntries = useMemo(() => {
    return [...entries]
      .sort((a, b) => b.points - a.points)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [entries]);

  const displayedEntries = sortedEntries.slice(0, maxDisplay);
  const currentUser = sortedEntries.find(e => e.id === currentUserId || e.isCurrentUser);

  if (variant === 'mini') {
    return (
      <div style={{
        padding: spacing[4],
        background: colors.surface.card,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.xl,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing[3],
        }}>
          <h4 style={{
            margin: 0,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}>
            🏆 {isArabic ? titleAr || 'قائمة المتصدرين' : title || 'Leaderboard'}
          </h4>
          {onViewMore && (
            <button
              onClick={onViewMore}
              style={{
                background: 'transparent',
                border: 'none',
                color: brandCyan,
                fontSize: typography.size.xs,
                cursor: 'pointer',
              }}
            >
              {isArabic ? 'المزيد' : 'More'}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
          {displayedEntries.slice(0, 5).map(entry => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[1.5]}px 0`,
                borderBottom: `1px solid ${colors.border.subtle}`,
              }}
            >
              <RankBadge rank={entry.rank} size="sm" />
              <span style={{
                flex: 1,
                fontSize: typography.size.xs,
                color: entry.isCurrentUser ? brandCyan : colors.text.secondary,
                fontWeight: entry.isCurrentUser ? typography.weight.bold : typography.weight.normal,
              }}>
                {isArabic ? entry.nameAr || entry.name : entry.name}
              </span>
              <span style={{
                fontSize: typography.size.xs,
                fontWeight: typography.weight.bold,
                color: colors.text.muted,
              }}>
                {entry.points.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div style={{
        padding: spacing[4],
        background: colors.surface.card,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.xl,
      }}>
        <h3 style={{
          margin: `0 0 ${spacing[4]}px`,
          fontSize: typography.size.lg,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
        }}>
          🏆 {isArabic ? titleAr || 'قائمة المتصدرين' : title || 'Leaderboard'}
        </h3>

        {currentUser && (
          <div style={{ marginBottom: spacing[4] }}>
            <UserRankCard
              entry={currentUser}
              totalParticipants={sortedEntries.length}
              isArabic={isArabic}
            />
          </div>
        )}

        {displayedEntries.slice(0, 5).map(entry => (
          <LeaderboardRow
            key={entry.id}
            entry={entry}
            isArabic={isArabic}
            showPoints={showPoints}
            showSessions={showSessions}
            showStreak={showStreak}
          />
        ))}

        {onViewMore && (
          <button
            onClick={onViewMore}
            style={{
              width: '100%',
              marginTop: spacing[3],
              padding: spacing[3],
              background: 'transparent',
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.lg,
              color: colors.text.secondary,
              fontSize: typography.size.sm,
              cursor: 'pointer',
              transition: transitions.fast,
            }}
          >
            {isArabic ? 'عرض المزيد' : 'View All'}
          </button>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div style={{
      padding: spacing[5],
      background: colors.surface.card,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius.xl,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[4],
      }}>
        <h3 style={{
          margin: 0,
          fontSize: typography.size.xl,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
        }}>
          🏆 {isArabic ? titleAr || 'قائمة المتصدرين' : title || 'Leaderboard'}
        </h3>

        {/* Time filter */}
        <div style={{ display: 'flex', gap: spacing[1] }}>
          {(['all', 'week', 'month'] as const).map(f => {
            const labels = {
              all: { en: 'All Time', ar: 'الكل' },
              week: { en: 'This Week', ar: 'الأسبوع' },
              month: { en: 'This Month', ar: 'الشهر' },
            };
            const isActive = filter === f;

            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: `${spacing[1.5]}px ${spacing[3]}px`,
                  background: isActive ? `${brandCyan}20` : 'transparent',
                  border: `1px solid ${isActive ? brandCyan : colors.border.subtle}`,
                  borderRadius: radius.md,
                  color: isActive ? brandCyan : colors.text.muted,
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  cursor: 'pointer',
                  transition: transitions.fast,
                }}
              >
                {isArabic ? labels[f].ar : labels[f].en}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current user card */}
      {currentUser && (
        <div style={{ marginBottom: spacing[5] }}>
          <UserRankCard
            entry={currentUser}
            totalParticipants={sortedEntries.length}
            isArabic={isArabic}
          />
        </div>
      )}

      {/* Leaderboard list */}
      <div>
        {displayedEntries.map(entry => (
          <LeaderboardRow
            key={entry.id}
            entry={entry}
            isArabic={isArabic}
            showPoints={showPoints}
            showSessions={showSessions}
            showStreak={showStreak}
          />
        ))}
      </div>

      {/* View more */}
      {sortedEntries.length > maxDisplay && onViewMore && (
        <button
          onClick={onViewMore}
          style={{
            width: '100%',
            marginTop: spacing[4],
            padding: spacing[3],
            background: 'transparent',
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.lg,
            color: colors.text.secondary,
            fontSize: typography.size.sm,
            cursor: 'pointer',
            transition: transitions.fast,
          }}
        >
          {isArabic
            ? `عرض الـ ${sortedEntries.length - maxDisplay} المتبقين`
            : `View ${sortedEntries.length - maxDisplay} more`}
        </button>
      )}
    </div>
  );
});
Leaderboard.displayName = 'Leaderboard';

export default Leaderboard;
