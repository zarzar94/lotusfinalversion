import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useUser, type UserRole } from '../../context/UserContext';
import { ChevronDownIcon, renderLabIcon } from '../icons/index';
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
} from '../styles';

// ═══════════════════════════════════════════════════════════════════════════
// ROLE DISPLAY INFO
// ═══════════════════════════════════════════════════════════════════════════

const ROLE_INFO: Record<UserRole, { label: string; labelAr: string; icon: string; color: string }> = {
  guest: { label: 'Guest', labelAr: 'auto.ProfileMenu.k17', icon: '👤', color: colors.text.muted },
  patient: { label: 'Patient', labelAr: 'auto.ProfileMenu.k18', icon: '👤', color: brandCyan },
  parent: { label: 'Parent', labelAr: 'auto.ProfileMenu.k19', icon: '👨‍👩‍👧', color: brandPurple },
  clinician: { label: 'Clinician', labelAr: 'auto.ProfileMenu.k20', icon: '👨‍⚕️', color: brandPurple },
  school_admin: { label: 'School Admin', labelAr: 'auto.ProfileMenu.k21', icon: '🏫', color: brandPink },
  super_admin: { label: 'Admin', labelAr: 'auto.ProfileMenu.k22', icon: '⚙️', color: colors.warning },
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ProfileMenuProps {
  onLoginClick: () => void;
}

function ProfileMenu({ onLoginClick }: ProfileMenuProps) {
  const navigate = useNavigate();
  const { isArabic, direction, t } = useLanguage();
  const { user, isAuthenticated, logout, hasPermission, clinicalProgress } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = useCallback(() => {
    setIsOpen(false);
    logout();
  }, [logout]);

  const roleInfo = user ? ROLE_INFO[user.role] : ROLE_INFO.guest;

  // Guest state - show login button
  if (!isAuthenticated) {
    return (
      <button
        onClick={onLoginClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          padding: `${spacing[2]}px ${spacing[4]}px`,
          background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
          border: `1px solid ${brandCyan}30`,
          borderRadius: radius.full,
          color: brandCyan,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          fontFamily: typography.fontFamily,
          cursor: 'pointer',
          transition: transitions.fast,
        }}
      >
        <span>{renderLabIcon(roleInfo.icon, { size: 16, style: { color: brandCyan } })}</span>
        {t('auto.ProfileMenu.k1', "Sign In")}
      </button>
    );
  }

  // Authenticated state - show profile menu
  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t('auto.ProfileMenu.k2', "Profile menu")}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          padding: `${spacing[1.5]}px ${spacing[3]}px`,
          background: isOpen ? `${roleInfo.color}20` : `${roleInfo.color}10`,
          border: `1px solid ${roleInfo.color}30`,
          borderRadius: radius.full,
          cursor: 'pointer',
          transition: transitions.fast,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: `${roleInfo.color}25`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
          }}
        >
          {renderLabIcon(roleInfo.icon, { size: 16, style: { color: roleInfo.color } })}
        </div>

        {/* Name & Role */}
        <div style={{ textAlign: isArabic ? 'right' : 'left' }}>
          <div
            style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
              lineHeight: 1.2,
            }}
          >
            {isArabic ? user?.nameAr || user?.name : user?.name}
          </div>
          <div
            style={{
              fontSize: 10,
              color: roleInfo.color,
              fontWeight: typography.weight.semibold,
            }}
          >
            {isArabic ? t(roleInfo.labelAr, roleInfo.label) : roleInfo.label}
          </div>
        </div>

        {/* Dropdown arrow */}
        <span
          style={{
            color: colors.text.muted,
            fontSize: 10,
            marginLeft: spacing[1],
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: transitions.fast,
          }}
        >
          <ChevronDownIcon size={12} tone="muted" />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-label={t('auto.ProfileMenu.k3', "Profile menu")}
          className="profile-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            [isArabic ? 'left' : 'right']: 0,
            minWidth: 240,
            maxWidth: 'calc(100vw - 32px)',
            background: colors.surface.overlay,
            border: `1px solid ${colors.border.emphasis}`,
            borderRadius: radius.lg,
            boxShadow: shadows.xl,
            overflow: 'hidden',
            zIndex: 100,
            animation: 'menuSlideDown 0.2s ease-out',
            direction,
          }}
        >
          {/* User Info Header */}
          <div
            style={{
              padding: spacing[4],
              borderBottom: `1px solid ${colors.border.default}`,
              background: `linear-gradient(135deg, ${roleInfo.color}08, transparent)`,
            }}
          >
            <div
              style={{
                fontSize: typography.size.base,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
              }}
            >
              {isArabic ? user?.nameAr || user?.name : user?.name}
            </div>
            <div
              style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
                marginTop: 2,
              }}
            >
              {user?.email}
            </div>

            {/* Clinical Progress (for patients) */}
            {clinicalProgress && (
              <div
                style={{
                  marginTop: spacing[3],
                  padding: spacing[2],
                  background: `${brandCyan}10`,
                  borderRadius: radius.md,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: typography.size.xs,
                    marginBottom: spacing[1],
                  }}
                >
                  <span style={{ color: colors.text.secondary }}>
                    {t('auto.ProfileMenu.k4', "Progress")}
                  </span>
                  <span style={{ color: brandCyan, fontWeight: typography.weight.bold }}>
                    {clinicalProgress.sessionsCompleted}/20
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    background: colors.border.default,
                    borderRadius: radius.full,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${(clinicalProgress.sessionsCompleted / 20) * 100}%`,
                      background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
                      borderRadius: radius.full,
                    }}
                  />
                </div>
                {clinicalProgress.streak > 1 && (
                  <div
                    style={{
                      marginTop: spacing[1.5],
                      fontSize: 10,
                      color: colors.warning,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[1],
                    }}
                  >
                    {renderLabIcon('??', { size: 12, tone: 'warning' })}
                    {clinicalProgress.streak} {t('auto.ProfileMenu.k5', "day streak")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div style={{ padding: spacing[2] }}>
            {/* View Profile / Settings */}
            <MenuItem
              icon="\u{1F464}"
              label={t('auto.ProfileMenu.k6', "My Profile")}
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/settings';
              }}
            />

            {/* Patient Progress (if patient) */}
            {user?.role === 'patient' && (
              <MenuItem
                icon="\u{1F4C8}"
                label={t('auto.ProfileMenu.k7', "My Progress")}
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to the games/checklist section for progress
                  window.location.href = '/#checklist';
                }}
              />
            )}

            {/* Parent Dashboard (if parent) */}
            {hasPermission('view_child_reports') && (
              <MenuItem
                icon="\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}"
                label={t('auto.ProfileMenu.k8', "Children Progress")}
                onClick={() => {
                  setIsOpen(false);
                  navigate('/dashboard/parent');
                }}
              />
            )}

            {/* Clinician Dashboard (if clinician) */}
            {hasPermission('view_patient_reports') && (
              <MenuItem
                icon="\u{1F3E5}"
                label={t('auto.ProfileMenu.k9', "Patients Dashboard")}
                onClick={() => {
                  setIsOpen(false);
                  navigate('/dashboard/clinician');
                }}
              />
            )}

            {/* School Analytics (if permitted) */}
            {hasPermission('school_analytics') && !hasPermission('global_analytics') && (
              <MenuItem
                icon="\u{1F4CA}"
                label={t('auto.ProfileMenu.k10', "School Analytics")}
                onClick={() => {
                  setIsOpen(false);
                  navigate('/dashboard/educator');
                }}
              />
            )}

            {/* Super Admin - All Dashboards Access */}
            {hasPermission('global_analytics') && (
              <>
                <MenuItem
                  icon="\u{1F3E5}"
                  label={t('auto.ProfileMenu.k11', "Clinician Dashboard")}
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/dashboard/clinician';
                  }}
                />
                <MenuItem
                  icon="\u{1F3EB}"
                  label={t('auto.ProfileMenu.k12', "School Dashboard")}
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/dashboard/educator';
                  }}
                />
                <MenuItem
                  icon="\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}"
                  label={t('auto.ProfileMenu.k13', "Parent Dashboard")}
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/dashboard/parent';
                  }}
                />
              </>
            )}

            {/* Settings */}
            <MenuItem
              icon="\u2699\uFE0F"
              label={t('auto.ProfileMenu.k14', "Settings")}
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
            />

            {/* Export Progress (for patients) */}
            {user?.role === 'patient' && (
              <MenuItem
                icon="\u{1F4C4}"
                label={t('auto.ProfileMenu.k15', "Export Report")}
                onClick={() => {
                  setIsOpen(false);
                  // Trigger export from ProgressExport component
                  window.dispatchEvent(new CustomEvent('export-progress'));
                }}
              />
            )}

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: colors.border.subtle,
                margin: `${spacing[2]}px 0`,
              }}
            />

            {/* Logout */}
            <MenuItem
              icon="\u{1F6AA}"
              label={t('auto.ProfileMenu.k16', "Sign Out")}
              onClick={handleLogout}
              danger
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes menuSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .profile-dropdown button:focus-visible {
          outline: 2px solid ${brandCyan};
          outline-offset: -2px;
        }
        @media (max-width: 480px) {
          .profile-dropdown {
            min-width: 200px !important;
            ${isArabic ? 'left' : 'right'}: -8px !important;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MENU ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const MenuItem = memo(({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) => (
  <button
    onClick={onClick}
    role="menuitem"
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: spacing[3],
      padding: `${spacing[2.5]}px ${spacing[3]}px`,
      background: 'transparent',
      border: 'none',
      borderRadius: radius.md,
      color: danger ? colors.error : colors.text.primary,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
      fontFamily: typography.fontFamily,
      cursor: 'pointer',
      transition: transitions.fast,
      textAlign: 'inherit',
    }}
    onMouseEnter={(e) => {
      (e.target as HTMLButtonElement).style.background = danger
        ? colors.errorSubtle
        : `${brandCyan}10`;
    }}
    onMouseLeave={(e) => {
      (e.target as HTMLButtonElement).style.background = 'transparent';
    }}
  >
    <span style={{ fontSize: 16 }}>
      {renderLabIcon(icon, { size: 16, tone: danger ? 'error' : 'muted' })}
    </span>
    {label}
  </button>
));
MenuItem.displayName = 'MenuItem';

export default memo(ProfileMenu);
