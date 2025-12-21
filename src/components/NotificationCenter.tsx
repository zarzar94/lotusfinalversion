/**
 * NotificationCenter - In-app notification system
 * Displays alerts, reminders, and updates to users
 */

import { useState, useEffect, useCallback, memo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useGamification } from '../context/GamificationContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
} from './styles';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'info' | 'success' | 'warning';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  icon: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    labelAr: string;
    href: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATION STORAGE
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'lotus_notifications';

const loadNotifications = (): Notification[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.warn('Failed to load notifications');
  }
  return [];
};

const saveNotifications = (notifications: Notification[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    console.warn('Failed to save notifications');
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATION ITEM
// ═══════════════════════════════════════════════════════════════════════════

const NotificationItem = memo(({
  notification,
  isArabic,
  onMarkRead,
  onDismiss,
}: {
  notification: Notification;
  isArabic: boolean;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) => {
  const typeConfig = {
    achievement: { color: brandCyan, bgColor: `${brandCyan}12` },
    reminder: { color: '#f59e0b', bgColor: 'rgba(245,158,11,0.12)' },
    info: { color: brandPurple, bgColor: `${brandPurple}12` },
    success: { color: '#22c55e', bgColor: 'rgba(34,197,94,0.12)' },
    warning: { color: '#ef4444', bgColor: 'rgba(239,68,68,0.12)' },
  };

  const config = typeConfig[notification.type];

  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return t('auto.NotificationCenter.k1', "Just now");
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return isArabic ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return isArabic ? `منذ ${hours} ساعة` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return isArabic ? `منذ ${days} يوم` : `${days}d ago`;
  };

  return (
    <div
      onClick={() => onMarkRead(notification.id)}
      style={{
        padding: spacing[3],
        background: notification.read ? 'transparent' : config.bgColor,
        borderRadius: radius.lg,
        border: `1px solid ${notification.read ? colors.border.subtle : `${config.color}25`}`,
        cursor: 'pointer',
        transition: transitions.fast,
        position: 'relative',
      }}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div
          style={{
            position: 'absolute',
            top: spacing[3],
            [isArabic ? 'left' : 'right']: spacing[3],
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: config.color,
            boxShadow: `0 0 8px ${config.color}`,
          }}
        />
      )}

      <div style={{ display: 'flex', gap: spacing[3] }}>
        {/* Icon */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.md,
            background: `${config.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {notification.icon}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
              marginBottom: spacing[0.5],
            }}
          >
            {isArabic ? t(notification.titleAr, notification.title) : notification.title}
          </div>
          <div
            style={{
              fontSize: typography.size.xs,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.relaxed,
              marginBottom: spacing[1.5],
            }}
          >
            {isArabic ? t(notification.messageAr, notification.message) : notification.message}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
              }}
            >
              {getTimeAgo(notification.timestamp)}
            </span>

            {notification.action && (
              <a
                href={notification.action.href}
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.semibold,
                  color: config.color,
                  textDecoration: 'none',
                }}
              >
                {isArabic ? t(notification.action.labelAr, notification.action.label) : notification.action.label} →
              </a>
            )}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(notification.id);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: colors.text.muted,
            cursor: 'pointer',
            padding: spacing[1],
            fontSize: 14,
            opacity: 0.6,
            transition: transitions.fast,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
});
NotificationItem.displayName = 'NotificationItem';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function NotificationCenter() {
  const { isArabic, t } = useLanguage();
  const { user, isAuthenticated, clinicalProgress } = useUser();
  const { recentUnlock } = useGamification();

  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Add notification helper
  const addNotification = useCallback((
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'> & { id?: string },
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: notification.id ?? `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      read: false,
    };

    setNotifications((prev) => {
      const updated = [newNotification, ...prev].slice(0, 50); // Keep last 50
      saveNotifications(updated);
      return updated;
    });
  }, []);

  // Mark notification as read
  const markRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveNotifications(updated);
      return updated;
    });
  }, []);

  // Mark all as read
  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    saveNotifications([]);
  }, []);

  // Track achievement unlocks
  useEffect(() => {
    if (recentUnlock) {
      addNotification({
        type: 'achievement',
        title: 'Achievement Unlocked!',
        titleAr: 'auto.NotificationCenter.k7',
        message: recentUnlock.title,
        messageAr: recentUnlock.titleAr,
        icon: recentUnlock.icon,
      });
    }
  }, [recentUnlock, addNotification]);

  // Session reminder for patients
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'patient' || !clinicalProgress) return;

    const lastActivity = clinicalProgress.lastActivityDate;
    const hoursSinceActivity = (Date.now() - lastActivity) / (1000 * 60 * 60);

    // Remind if no activity in 20+ hours
    if (hoursSinceActivity >= 20 && hoursSinceActivity < 48) {
      const reminderId = `reminder_${new Date().toISOString().slice(0, 10)}`;
      const existingReminder = notifications.find((n) => n.id === reminderId);

      if (!existingReminder) {
        addNotification({
          id: reminderId,
          type: 'reminder',
          title: 'Daily Session Reminder',
          titleAr: 'auto.NotificationCenter.k8',
          message: "Don't forget to complete your daily session to maintain your streak!",
          messageAr: 'auto.NotificationCenter.k9',
          icon: '⏰',
          action: {
            label: 'Start Session',
            labelAr: 'auto.NotificationCenter.k10',
            href: '#checklist',
          },
        });
      }
    }
  }, [isAuthenticated, user, clinicalProgress, notifications, addNotification]);

  // Welcome notification for new users
  useEffect(() => {
    if (isAuthenticated && notifications.length === 0) {
      addNotification({
        type: 'info',
        title: 'Welcome to Lotus × Bérard AIT!',
        titleAr: 'auto.NotificationCenter.k11',
        message: 'Explore the platform and track your progress.',
        messageAr: 'auto.NotificationCenter.k12',
        icon: '👋',
        action: {
          label: 'Explore',
          labelAr: 'auto.NotificationCenter.k13',
          href: '#hero',
        },
      });
    }
  }, [isAuthenticated, notifications.length, addNotification]);

  // Don't render if not authenticated
  if (!isAuthenticated) return null;

  return (
    <>
      <style>{`
        @keyframes notifSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bellRing {
          0%, 100% { transform: rotate(0); }
          10%, 30% { transform: rotate(15deg); }
          20%, 40% { transform: rotate(-15deg); }
          50% { transform: rotate(0); }
        }
        .notif-bell:hover {
          transform: scale(1.05);
        }
        .notif-bell.has-unread {
          animation: bellRing 1s ease-in-out;
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          top: spacing[4],
          [isArabic ? 'left' : 'right']: spacing[20],
          zIndex: 90,
        }}
      >
        {/* Bell Button */}
        <button
          className={`notif-bell ${unreadCount > 0 ? 'has-unread' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.lg,
            background: isOpen
              ? `linear-gradient(135deg, ${brandCyan}25, ${brandPurple}25)`
              : 'rgba(11,15,28,0.9)',
            border: `1px solid ${isOpen ? brandCyan : colors.border.default}40`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            position: 'relative',
            backdropFilter: 'blur(12px)',
            transition: transitions.bounce,
            boxShadow: shadows.md,
          }}
        >
          🔔
          {unreadCount > 0 && (
            <div
              style={{
                position: 'absolute',
                top: -4,
                [isArabic ? 'left' : 'right']: -4,
                minWidth: 18,
                height: 18,
                borderRadius: radius.full,
                background: '#ef4444',
                color: 'white',
                fontSize: 10,
                fontWeight: typography.weight.bold,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `0 ${spacing[1]}px`,
                border: '2px solid #05060d',
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              [isArabic ? 'left' : 'right']: 0,
              width: 360,
              maxHeight: 480,
              background: 'linear-gradient(135deg, rgba(11,15,28,0.98), rgba(5,6,13,0.98))',
              border: `1px solid ${colors.border.emphasis}`,
              borderRadius: radius.xl,
              boxShadow: shadows['2xl'],
              overflow: 'hidden',
              animation: 'notifSlideIn 0.3s ease-out',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: spacing[4],
                borderBottom: `1px solid ${colors.border.default}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: `linear-gradient(135deg, ${brandCyan}08, transparent)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                <span style={{ fontSize: 18 }}>🔔</span>
                <span
                  style={{
                    fontSize: typography.size.base,
                    fontWeight: typography.weight.bold,
                    color: colors.text.primary,
                  }}
                >
                  {t('auto.NotificationCenter.k2', "Notifications")}
                </span>
                {unreadCount > 0 && (
                  <span
                    style={{
                      padding: `${spacing[0.5]}px ${spacing[2]}px`,
                      background: `${brandCyan}20`,
                      borderRadius: radius.full,
                      fontSize: typography.size.xs,
                      fontWeight: typography.weight.bold,
                      color: brandCyan,
                    }}
                  >
                    {unreadCount} {t('auto.NotificationCenter.k3', "new")}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: spacing[2] }}>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: brandCyan,
                      fontSize: typography.size.xs,
                      cursor: 'pointer',
                      fontWeight: typography.weight.semibold,
                    }}
                  >
                    {t('auto.NotificationCenter.k4', "Mark all read")}
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div
              style={{
                maxHeight: 360,
                overflowY: 'auto',
                padding: spacing[2],
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[2],
              }}
            >
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: spacing[8],
                    textAlign: 'center',
                    color: colors.text.muted,
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: spacing[2], opacity: 0.5 }}>🔕</div>
                  <div style={{ fontSize: typography.size.sm }}>
                    {t('auto.NotificationCenter.k5', "No notifications")}
                  </div>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isArabic={isArabic}
                    onMarkRead={markRead}
                    onDismiss={dismissNotification}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div
                style={{
                  padding: spacing[3],
                  borderTop: `1px solid ${colors.border.default}`,
                  textAlign: 'center',
                }}
              >
                <button
                  onClick={clearAll}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: colors.text.muted,
                    fontSize: typography.size.xs,
                    cursor: 'pointer',
                    transition: transitions.fast,
                  }}
                >
                  {t('auto.NotificationCenter.k6', "Clear all notifications")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
