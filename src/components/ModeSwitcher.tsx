import { memo, useEffect, useMemo, type ReactNode } from 'react';
import { useVisitorMode, VISITOR_MODES, type VisitorMode } from '../context/VisitorModeContext';
import { useLanguage } from '../context/LanguageContext';
import { useUser, type UserRole } from '../context/UserContext';
import { brandCyan, brandPink, colors, radius, spacing, typography } from './styles';

// ═══════════════════════════════════════════════════════════════════════════
// MODE SWITCHER COMPONENT
// A compact, accessible mode switcher for School/Parent/Clinician visitors
// ═══════════════════════════════════════════════════════════════════════════

type RoleBadge = {
  label: string;
  labelAr?: string;
  icon: ReactNode;
  color: string;
  mode?: VisitorMode;
};

const ROLE_BADGES: Record<UserRole, RoleBadge> = {
  guest: { label: 'Guest', icon: 'G', color: colors.text.muted },
  patient: { label: 'Patient', icon: 'P', color: brandCyan, mode: 'parent' },
  parent: {
    label: VISITOR_MODES.parent.label,
    labelAr: VISITOR_MODES.parent.labelAr,
    icon: VISITOR_MODES.parent.icon,
    color: VISITOR_MODES.parent.color,
    mode: 'parent',
  },
  clinician: {
    label: VISITOR_MODES.clinician.label,
    labelAr: VISITOR_MODES.clinician.labelAr,
    icon: VISITOR_MODES.clinician.icon,
    color: VISITOR_MODES.clinician.color,
    mode: 'clinician',
  },
  school_admin: {
    label: VISITOR_MODES.school.label,
    labelAr: VISITOR_MODES.school.labelAr,
    icon: VISITOR_MODES.school.icon,
    color: VISITOR_MODES.school.color,
    mode: 'school',
  },
  super_admin: { label: 'Admin', icon: 'A', color: brandPink, mode: 'clinician' },
};

const ModeSwitcher = memo(function ModeSwitcher() {
  const { mode, setMode } = useVisitorMode();
  const { isArabic, t } = useLanguage();
  const { user, isAuthenticated } = useUser();
  const role = user?.role ?? 'guest';

  const badge = useMemo(() => ROLE_BADGES[role] ?? ROLE_BADGES.guest, [role]);

  useEffect(() => {
    if (!isAuthenticated || !badge.mode || badge.mode === mode) return;
    setMode(badge.mode);
  }, [isAuthenticated, badge.mode, mode, setMode]);

  if (!isAuthenticated) return null;

  const label = isArabic && badge.labelAr ? badge.labelAr : badge.label;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: `${spacing[1.5]}px ${spacing[3]}px`,
        background: `${badge.color}15`,
        border: `1px solid ${badge.color}40`,
        borderRadius: radius.lg,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', fontSize: 16 }}>{badge.icon}</span>
      <span
        style={{
          fontSize: typography.size.xs,
          fontWeight: typography.weight.bold,
          color: badge.color,
        }}
      >
        {label}
      </span>
    </div>
  );
});

export default ModeSwitcher;
