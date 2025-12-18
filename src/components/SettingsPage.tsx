/**
 * SettingsPage - User preferences and account settings
 */

import { useState, useCallback, memo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
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

const loadSettings = (): UserSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    console.warn('Failed to load settings');
  }
  return DEFAULT_SETTINGS;
};

const saveSettings = (settings: UserSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
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
  const { isArabic, direction, toggleLanguage } = useLanguage();
  const { user, updateProfile, logout } = useUser();

  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

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
        saveSettings(updated);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        return updated;
      });
    },
    []
  );

  const handleSaveName = useCallback(() => {
    if (editName.trim()) {
      updateProfile({ name: editName.trim() });
      setIsEditing(false);
    }
  }, [editName, updateProfile]);

  const text = {
    title: isArabic ? 'الإعدادات' : 'Settings',
    notifications: isArabic ? 'الإشعارات' : 'Notifications',
    display: isArabic ? 'العرض' : 'Display',
    privacy: isArabic ? 'الخصوصية' : 'Privacy',
    audio: isArabic ? 'الصوت' : 'Audio',
    account: isArabic ? 'الحساب' : 'Account',
    language: isArabic ? 'اللغة' : 'Language',
    saved: isArabic ? 'تم الحفظ' : 'Saved',
    signOut: isArabic ? 'تسجيل الخروج' : 'Sign Out',
    deleteAccount: isArabic ? 'حذف الحساب' : 'Delete Account',
  };

  return (
    <section
      id="settings"
      style={{
        padding: `${spacing[10]}px ${spacing[4]}px`,
        maxWidth: 700,
        margin: '0 auto',
        direction,
      }}
    >
      {/* Back Navigation */}
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing[2],
          padding: `${spacing[2]}px ${spacing[3]}px`,
          marginBottom: spacing[6],
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.md,
          color: colors.text.secondary,
          textDecoration: 'none',
          fontSize: typography.size.sm,
          fontWeight: typography.weight.semibold,
          transition: transitions.fast,
        }}
      >
        <span style={{ transform: isArabic ? 'rotate(180deg)' : 'none' }}>←</span>
        {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
      </a>

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
              {isArabic ? 'تعديل' : 'Edit'}
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
          label={isArabic ? 'إشعارات الإنجازات' : 'Achievement Notifications'}
          description={isArabic ? 'إشعار عند فتح إنجاز جديد' : 'Get notified when you unlock achievements'}
          checked={settings.notifications.achievements}
          onChange={(v) => updateSetting('notifications', 'achievements', v)}
        />
        <SettingToggle
          label={isArabic ? 'تذكيرات الجلسات' : 'Session Reminders'}
          description={isArabic ? 'تذكير يومي لإكمال الجلسات' : 'Daily reminders to complete sessions'}
          checked={settings.notifications.reminders}
          onChange={(v) => updateSetting('notifications', 'reminders', v)}
        />
        <SettingToggle
          label={isArabic ? 'تحديثات المنصة' : 'Platform Updates'}
          description={isArabic ? 'إشعارات بالميزات والتحديثات الجديدة' : 'News about new features and updates'}
          checked={settings.notifications.updates}
          onChange={(v) => updateSetting('notifications', 'updates', v)}
        />
      </SettingSection>

      {/* Display Section */}
      <SettingSection title={text.display} icon="🎨">
        <SettingToggle
          label={isArabic ? 'تقليل الحركة' : 'Reduced Motion'}
          description={isArabic ? 'تقليل الرسوم المتحركة' : 'Minimize animations and motion effects'}
          checked={settings.display.reducedMotion}
          onChange={(v) => updateSetting('display', 'reducedMotion', v)}
        />
        <SettingToggle
          label={isArabic ? 'تباين عالي' : 'High Contrast'}
          description={isArabic ? 'زيادة تباين الألوان' : 'Increase color contrast for better visibility'}
          checked={settings.display.highContrast}
          onChange={(v) => updateSetting('display', 'highContrast', v)}
        />
        <SettingSelect
          label={isArabic ? 'حجم الخط' : 'Font Size'}
          value={settings.display.fontSize}
          options={[
            { value: 'small', label: isArabic ? 'صغير' : 'Small' },
            { value: 'medium', label: isArabic ? 'متوسط' : 'Medium' },
            { value: 'large', label: isArabic ? 'كبير' : 'Large' },
          ]}
          onChange={(v) => updateSetting('display', 'fontSize', v as 'small' | 'medium' | 'large')}
        />
      </SettingSection>

      {/* Audio Section */}
      <SettingSection title={text.audio} icon="🔊">
        <SettingToggle
          label={isArabic ? 'المؤثرات الصوتية' : 'Sound Effects'}
          description={isArabic ? 'أصوات الإنجازات والتفاعلات' : 'Achievement sounds and interaction effects'}
          checked={settings.audio.soundEffects}
          onChange={(v) => updateSetting('audio', 'soundEffects', v)}
        />
        <SettingSlider
          label={isArabic ? 'مستوى الصوت' : 'Volume Level'}
          value={settings.audio.volume}
          onChange={(v) => updateSetting('audio', 'volume', v)}
        />
      </SettingSection>

      {/* Privacy Section */}
      <SettingSection title={text.privacy} icon="🔒">
        <SettingToggle
          label={isArabic ? 'مشاركة التقدم' : 'Share Progress'}
          description={isArabic ? 'السماح للطبيب بمشاهدة تقدمك' : 'Allow your clinician to view your progress'}
          checked={settings.privacy.shareProgress}
          onChange={(v) => updateSetting('privacy', 'shareProgress', v)}
        />
        <SettingToggle
          label={isArabic ? 'التحليلات المجهولة' : 'Anonymous Analytics'}
          description={isArabic ? 'المساعدة في تحسين المنصة' : 'Help improve the platform with usage data'}
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
          ⚠️ {isArabic ? 'منطقة الخطر' : 'Danger Zone'}
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
