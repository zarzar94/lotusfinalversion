/**
 * SettingsPage - User preferences and account settings
 */

import { useState, useCallback, useEffect, memo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { readUserScopedStorage, writeUserScopedStorage } from '../utils/userStorage';
import { notifyLocalChange } from '../utils/sync';
import { BackNavigation, SectionNav, ResponsiveStyles } from './shared';
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

interface UserSettings {
  notifications: {
    achievements: boolean;
    reminders: boolean;
    updates: boolean;
    email: boolean;
  };
  display: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  privacy: {
    shareProgress: boolean;
    anonymousAnalytics: boolean;
  };
  audio: {
    soundEffects: boolean;
    volume: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS STORAGE
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'lotus_user_settings';

const DEFAULT_SETTINGS: UserSettings = {
  notifications: {
    achievements: true,
    reminders: true,
    updates: true,
    email: false,
  },
  display: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
  },
  privacy: {
    shareProgress: false,
    anonymousAnalytics: true,
  },
  audio: {
    soundEffects: true,
    volume: 70,
  },
};

const loadSettings = (userId?: string | null): UserSettings => {
  try {
    const stored = readUserScopedStorage(STORAGE_KEY, userId);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        const { updatedAt, userId: storedUserId, ...rest } = parsed as Partial<UserSettings> & {
          updatedAt?: unknown;
          userId?: unknown;
        };
        return { ...DEFAULT_SETTINGS, ...rest };
      }
    }
  } catch {
    console.warn('Failed to load settings');
  }
  return DEFAULT_SETTINGS;
};

const saveSettings = (settings: UserSettings, userId?: string | null) => {
  try {
    writeUserScopedStorage(
      STORAGE_KEY,
      JSON.stringify({ ...settings, updatedAt: Date.now() }),
      userId
    );
  } catch {
    console.warn('Failed to save settings');
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// SETTING COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const SettingToggle = memo(({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing[4],
      padding: `${spacing[3]}px 0`,
    }}
  >
    <div>
      <div
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.semibold,
          color: colors.text.primary,
        }}
      >
        {label}
      </div>
      {description && (
        <div
          style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
            marginTop: 2,
          }}
        >
          {description}
        </div>
      )}
    </div>
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 48,
        height: 26,
        borderRadius: radius.full,
        background: checked ? brandCyan : colors.border.default,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: transitions.fast,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 25 : 3,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'white',
          transition: transitions.fast,
          boxShadow: shadows.sm,
        }}
      />
    </button>
  </div>
));
SettingToggle.displayName = 'SettingToggle';

const SettingSlider = memo(({
  label,
  description,
  value,
  min = 0,
  max = 100,
  onChange,
}: {
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) => (
  <div
    style={{
      padding: `${spacing[3]}px 0`,
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: spacing[2],
      }}
    >
      <div>
        <div
          style={{
            fontSize: typography.size.sm,
            fontWeight: typography.weight.semibold,
            color: colors.text.primary,
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontSize: typography.size.xs,
              color: colors.text.muted,
              marginTop: 2,
            }}
          >
            {description}
          </div>
        )}
      </div>
      <span
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: brandCyan,
        }}
      >
        {value}%
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width: '100%',
        height: 6,
        borderRadius: radius.full,
        background: colors.border.default,
        appearance: 'none',
        cursor: 'pointer',
      }}
    />
    <style>{`
      input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${brandCyan};
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      }
    `}</style>
  </div>
));
SettingSlider.displayName = 'SettingSlider';

const SettingSelect = memo(({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing[4],
      padding: `${spacing[3]}px 0`,
    }}
  >
    <div>
      <div
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.semibold,
          color: colors.text.primary,
        }}
      >
        {label}
      </div>
      {description && (
        <div
          style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
            marginTop: 2,
          }}
        >
          {description}
        </div>
      )}
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: `${spacing[2]}px ${spacing[3]}px`,
        background: colors.surface.input,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.md,
        color: colors.text.primary,
        fontSize: typography.size.sm,
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
));
SettingSelect.displayName = 'SettingSelect';

const SettingSection = memo(({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      marginBottom: spacing[6],
      padding: spacing[5],
      background: `linear-gradient(135deg, ${brandCyan}05, ${brandPurple}03)`,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius.xl,
    }}
  >
    <h3
      style={{
        margin: `0 0 ${spacing[3]}px`,
        fontSize: typography.size.base,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
        paddingBottom: spacing[3],
        borderBottom: `1px solid ${colors.border.subtle}`,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {title}
    </h3>
    <div>{children}</div>
  </div>
));
SettingSection.displayName = 'SettingSection';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function SettingsPage() {
  const { isArabic, direction, toggleLanguage, t } = useLanguage();
  const { user, updateProfile, logout } = useUser();

  const [settings, setSettings] = useState<UserSettings>(() => loadSettings(user?.id));
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

  useEffect(() => {
    setSettings(loadSettings(user?.id));
  }, [user?.id]);

  const updateSetting = useCallback(
    <K extends keyof UserSettings, SK extends keyof UserSettings[K]>(
      category: K,
      key: SK,
      value: UserSettings[K][SK]
    ) => {
      setSettings((prev) => {
        const updated = {
          ...prev,
          [category]: {
            ...prev[category],
            [key]: value,
          },
        };
        saveSettings(updated, user?.id);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('lotus-settings-changed', { detail: updated }));
        }
        notifyLocalChange();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        return updated;
      });
    },
    [user?.id]
  );

  const handleSaveName = useCallback(() => {
    if (editName.trim()) {
      updateProfile({ name: editName.trim() });
      setIsEditing(false);
    }
  }, [editName, updateProfile]);

  const text = {
    title: t('auto.SettingsPage.k1', "Settings"),
    notifications: t('auto.SettingsPage.k2', "Notifications"),
    display: t('auto.SettingsPage.k3', "Display"),
    privacy: t('auto.SettingsPage.k4', "Privacy"),
    audio: t('auto.SettingsPage.k5', "Audio"),
    account: t('auto.SettingsPage.k6', "Account"),
    language: t('auto.SettingsPage.k7', "Language"),
    saved: t('auto.SettingsPage.k8', "Saved"),
    signOut: t('auto.SettingsPage.k9', "Sign Out"),
    deleteAccount: t('auto.SettingsPage.k10', "Delete Account"),
  };

  return (
    <section
      id="settings"
      className="page-container"
      style={{
        maxWidth: 700,
        direction,
      }}
    >
      <ResponsiveStyles />
      {/* Back Navigation */}
      <BackNavigation />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing[8],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.lg,
              background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            ⚙️
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: typography.size['3xl'],
              fontWeight: typography.weight.black,
              color: colors.text.primary,
            }}
          >
            {text.title}
          </h1>
        </div>

        {isSaved && (
          <span
            style={{
              padding: `${spacing[1.5]}px ${spacing[3]}px`,
              background: 'rgba(34,197,94,0.15)',
              color: '#22c55e',
              borderRadius: radius.full,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            ✓ {text.saved}
          </span>
        )}
      </div>

      {/* Account Section */}
      <SettingSection title={text.account} icon="👤">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[4],
            padding: `${spacing[3]}px 0`,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: radius.lg,
              background: `linear-gradient(135deg, ${brandCyan}25, ${brandPurple}25)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            {user?.name?.[0] || '👤'}
          </div>
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: spacing[2] }}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: `${spacing[2]}px ${spacing[3]}px`,
                    background: colors.surface.input,
                    border: `1px solid ${brandCyan}`,
                    borderRadius: radius.md,
                    color: colors.text.primary,
                    fontSize: typography.size.sm,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleSaveName}
                  style={{
                    padding: `${spacing[2]}px ${spacing[3]}px`,
                    background: brandCyan,
                    border: 'none',
                    borderRadius: radius.md,
                    color: colors.surface.base,
                    cursor: 'pointer',
                    fontWeight: typography.weight.bold,
                  }}
                >
                  ✓
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    fontSize: typography.size.lg,
                    fontWeight: typography.weight.bold,
                    color: colors.text.primary,
                  }}
                >
                  {user?.name || 'User'}
                </div>
                <div
                  style={{
                    fontSize: typography.size.xs,
                    color: colors.text.muted,
                  }}
                >
                  {user?.email}
                </div>
              </>
            )}
          </div>
          {!isEditing && (
            <button
              onClick={() => {
                setEditName(user?.name || '');
                setIsEditing(true);
              }}
              style={{
                padding: `${spacing[2]}px ${spacing[3]}px`,
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.md,
                color: colors.text.secondary,
                cursor: 'pointer',
                fontSize: typography.size.xs,
              }}
            >
              {t('auto.SettingsPage.k11', "Edit")}
            </button>
          )}
        </div>

        {/* Language Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${spacing[3]}px 0`,
            borderTop: `1px solid ${colors.border.subtle}`,
            marginTop: spacing[3],
          }}
        >
          <div>
            <div
              style={{
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                color: colors.text.primary,
              }}
            >
              {text.language}
            </div>
          </div>
          <button
            onClick={toggleLanguage}
            style={{
              padding: `${spacing[2]}px ${spacing[4]}px`,
              background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}15)`,
              border: `1px solid ${brandCyan}30`,
              borderRadius: radius.md,
              color: brandCyan,
              cursor: 'pointer',
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
            }}
          >
            {isArabic ? 'English' : 'العربية'}
          </button>
        </div>
      </SettingSection>

      {/* Notifications Section */}
      <SettingSection title={text.notifications} icon="🔔">
        <SettingToggle
          label={t('auto.SettingsPage.k12', "Achievement Notifications")}
          description={t('auto.SettingsPage.k13', "Get notified when you unlock achievements")}
          checked={settings.notifications.achievements}
          onChange={(v) => updateSetting('notifications', 'achievements', v)}
        />
        <SettingToggle
          label={t('auto.SettingsPage.k14', "Session Reminders")}
          description={t('auto.SettingsPage.k15', "Daily reminders to complete sessions")}
          checked={settings.notifications.reminders}
          onChange={(v) => updateSetting('notifications', 'reminders', v)}
        />
        <SettingToggle
          label={t('auto.SettingsPage.k16', "Platform Updates")}
          description={t('auto.SettingsPage.k17', "News about new features and updates")}
          checked={settings.notifications.updates}
          onChange={(v) => updateSetting('notifications', 'updates', v)}
        />
      </SettingSection>

      {/* Display Section */}
      <SettingSection title={text.display} icon="🎨">
        <SettingToggle
          label={t('auto.SettingsPage.k18', "Reduced Motion")}
          description={t('auto.SettingsPage.k19', "Minimize animations and motion effects")}
          checked={settings.display.reducedMotion}
          onChange={(v) => updateSetting('display', 'reducedMotion', v)}
        />
        <SettingToggle
          label={t('auto.SettingsPage.k20', "High Contrast")}
          description={t('auto.SettingsPage.k21', "Increase color contrast for better visibility")}
          checked={settings.display.highContrast}
          onChange={(v) => updateSetting('display', 'highContrast', v)}
        />
        <SettingSelect
          label={t('auto.SettingsPage.k22', "Font Size")}
          value={settings.display.fontSize}
          options={[
            { value: 'small', label: t('auto.SettingsPage.k23', "Small") },
            { value: 'medium', label: t('auto.SettingsPage.k24', "Medium") },
            { value: 'large', label: t('auto.SettingsPage.k25', "Large") },
          ]}
          onChange={(v) => updateSetting('display', 'fontSize', v as 'small' | 'medium' | 'large')}
        />
      </SettingSection>

      {/* Audio Section */}
      <SettingSection title={text.audio} icon="🔊">
        <SettingToggle
          label={t('auto.SettingsPage.k26', "Sound Effects")}
          description={t('auto.SettingsPage.k27', "Achievement sounds and interaction effects")}
          checked={settings.audio.soundEffects}
          onChange={(v) => updateSetting('audio', 'soundEffects', v)}
        />
        <SettingSlider
          label={t('auto.SettingsPage.k28', "Volume Level")}
          value={settings.audio.volume}
          onChange={(v) => updateSetting('audio', 'volume', v)}
        />
      </SettingSection>

      {/* Privacy Section */}
      <SettingSection title={text.privacy} icon="🔒">
        <SettingToggle
          label={t('auto.SettingsPage.k29', "Share Progress")}
          description={t('auto.SettingsPage.k30', "Allow your clinician to view your progress")}
          checked={settings.privacy.shareProgress}
          onChange={(v) => updateSetting('privacy', 'shareProgress', v)}
        />
        <SettingToggle
          label={t('auto.SettingsPage.k31', "Anonymous Analytics")}
          description={t('auto.SettingsPage.k32', "Help improve the platform with usage data")}
          checked={settings.privacy.anonymousAnalytics}
          onChange={(v) => updateSetting('privacy', 'anonymousAnalytics', v)}
        />
      </SettingSection>

      {/* Danger Zone */}
      <div
        style={{
          padding: spacing[5],
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: radius.xl,
        }}
      >
        <h3
          style={{
            margin: `0 0 ${spacing[4]}px`,
            fontSize: typography.size.base,
            fontWeight: typography.weight.bold,
            color: '#ef4444',
          }}
        >
          ⚠️ {t('auto.SettingsPage.k33', "Danger Zone")}
        </h3>
        <div style={{ display: 'flex', gap: spacing[3], flexWrap: 'wrap' }}>
          <button
            onClick={logout}
            style={{
              padding: `${spacing[2.5]}px ${spacing[4]}px`,
              background: 'transparent',
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.md,
              color: colors.text.secondary,
              cursor: 'pointer',
              fontSize: typography.size.sm,
              fontWeight: typography.weight.semibold,
              transition: transitions.fast,
            }}
          >
            {text.signOut}
          </button>
          <button
            style={{
              padding: `${spacing[2.5]}px ${spacing[4]}px`,
              background: 'transparent',
              border: '1px solid rgba(239,68,68,0.5)',
              borderRadius: radius.md,
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: typography.size.sm,
              fontWeight: typography.weight.semibold,
              transition: transitions.fast,
            }}
          >
            {text.deleteAccount}
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      <div
        style={{
          marginTop: spacing[8],
          padding: spacing[5],
          background: colors.surface.card,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.xl,
        }}
      >
        <SectionNav
          variant="pills"
          title="Explore Platform"
          titleAr="استكشف المنصة"
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
