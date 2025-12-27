import { useState, useCallback, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useUser, type UserRole } from '../../context/UserContext';
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
import { renderLabIcon } from '../icons/index';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'demo';

// ═══════════════════════════════════════════════════════════════════════════
// DEMO ACCOUNTS
// ═══════════════════════════════════════════════════════════════════════════

const DEMO_ACCOUNTS: { role: UserRole; email: string; label: string; labelAr: string; icon: string; color: string; description: string; descriptionAr: string }[] = [
  { role: 'patient', email: 'demo@patient.com', label: 'Patient', labelAr: 'auto.LoginModal.k17', icon: '👤', color: brandCyan, description: 'Track your AIT sessions', descriptionAr: 'auto.LoginModal.k18' },
  { role: 'parent', email: 'demo@parent.com', label: 'Parent', labelAr: 'auto.LoginModal.k19', icon: '👨‍👩‍👧', color: brandPurple, description: 'Monitor children progress', descriptionAr: 'auto.LoginModal.k20' },
  { role: 'clinician', email: 'demo@clinician.com', label: 'Clinician', labelAr: 'auto.LoginModal.k21', icon: '👨‍⚕️', color: brandPink, description: 'Manage patient records', descriptionAr: 'auto.LoginModal.k22' },
  { role: 'school_admin', email: 'demo@school.com', label: 'School Admin', labelAr: 'auto.LoginModal.k23', icon: '🏫', color: colors.warning, description: 'View school analytics', descriptionAr: 'auto.LoginModal.k24' },
  { role: 'super_admin', email: 'demo@admin.com', label: 'Admin', labelAr: 'auto.LoginModal.k25', icon: '⚙️', color: colors.error, description: 'Full system access', descriptionAr: 'auto.LoginModal.k26' },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { isArabic, direction, t } = useLanguage();
  const { login, loginDemo, register, isLoading } = useUser();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError('');
    } else {
      setEmail('');
      setPassword('');
      setName('');
      setError('');
      setMode('login');
    }
  }, [isOpen]);

  // Lock body scroll and scroll to top when modal opens
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const success = await login(email, password);
      if (success) {
        onClose();
      } else {
        setError(t('auto.LoginModal.k1', "Invalid email or password"));
      }
    } else if (mode === 'register') {
      if (!name.trim()) {
        setError(t('auto.LoginModal.k2', "Please enter your name"));
        return;
      }
      const success = await register({ email, password, name });
      if (success) {
        onClose();
      } else {
        setError(t('auto.LoginModal.k3', "Email already in use"));
      }
    }
  }, [mode, email, password, name, login, register, onClose, t]);

  const handleDemoLogin = useCallback(async (account: typeof DEMO_ACCOUNTS[number]) => {
    setError('');
    const success = await login(account.email, 'demo123');
    if (success) {
      onClose();
      return;
    }

    loginDemo({
      role: account.role,
      email: account.email,
      name: account.label,
      nameAr: account.labelAr,
    });
    onClose();
  }, [login, loginDemo, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const text = {
    login: t('auto.LoginModal.k4', "Sign In"),
    register: t('auto.LoginModal.k5', "Create Account"),
    demo: t('auto.LoginModal.k6', "Demo Accounts"),
    email: t('auto.LoginModal.k7', "Email"),
    password: t('auto.LoginModal.k8', "Password"),
    name: t('auto.LoginModal.k9', "Name"),
    submit: mode === 'login' ? (t('auto.LoginModal.k10', "Sign In")) : (t('auto.LoginModal.k11', "Register")),
    noAccount: t('auto.LoginModal.k12', "Don't have an account?"),
    hasAccount: t('auto.LoginModal.k13', "Already have an account?"),
    tryDemo: t('auto.LoginModal.k14', "Try Demo Accounts"),
    backToLogin: t('auto.LoginModal.k15', "Back to Sign In"),
  };

  return createPortal(
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,6,13,0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 1000,
        padding: spacing[4],
        animation: 'modalFadeIn 0.3s ease-out',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="login-modal-container"
        style={{
          background: colors.surface.overlay,
          borderRadius: radius.xl,
          maxWidth: 420,
          width: '100%',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          position: 'relative',
          border: `1px solid ${colors.border.emphasis}`,
          boxShadow: shadows['2xl'],
          animation: 'modalSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          direction,
        }}
      >
        {/* Gradient top border */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple}, ${brandPink})`,
          borderRadius: `${radius.xl}px ${radius.xl}px 0 0`,
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label={t('auto.LoginModal.k16', "Close")}
          style={{
            position: 'absolute',
            top: spacing[3],
            [isArabic ? 'left' : 'right']: spacing[3],
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${colors.border.subtle}`,
            fontSize: typography.size.lg,
            cursor: 'pointer',
            color: colors.text.muted,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radius.md,
            transition: transitions.fast,
          }}
        >
          {renderLabIcon('✕', { size: 12, tone: 'muted' })}
        </button>

        <div className="login-modal-content" style={{ padding: spacing[6] }}>
          {/* Header */}
          <div className="login-modal-header" style={{ textAlign: 'center', marginBottom: spacing[5] }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: radius.lg,
                background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}20)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: spacing[3],
                fontSize: 28,
              }}
            >
              {mode === 'demo'
                ? renderLabIcon('🎮', { size: 24, tone: 'cyan' })
                : renderLabIcon('🔐', { size: 24, tone: 'cyan' })}
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: typography.size['2xl'],
                fontWeight: typography.weight.black,
                color: colors.text.primary,
                fontFamily: typography.fontFamily,
              }}
            >
              {mode === 'login' ? text.login : mode === 'register' ? text.register : text.demo}
            </h2>
          </div>

          {/* Demo Mode */}
          {mode === 'demo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              {DEMO_ACCOUNTS.map(account => (
                <button
                  key={account.role}
                  onClick={() => handleDemoLogin(account)}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[3],
                    padding: spacing[4],
                    background: `linear-gradient(135deg, ${account.color}10, transparent)`,
                    border: `1px solid ${account.color}30`,
                    borderRadius: radius.lg,
                    cursor: 'pointer',
                    transition: transitions.fast,
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: radius.md,
                      background: `${account.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                    }}
                  >
                    {renderLabIcon(account.icon, { size: 22, style: { color: account.color } })}
                  </div>
                  <div style={{ textAlign: isArabic ? 'right' : 'left', flex: 1 }}>
                    <div
                      style={{
                        fontSize: typography.size.base,
                        fontWeight: typography.weight.bold,
                        color: colors.text.primary,
                      }}
                    >
                      {isArabic ? t(account.labelAr, account.label) : account.label}
                    </div>
                    <div
                      style={{
                        fontSize: typography.size.xs,
                        color: account.color,
                        marginTop: 2,
                      }}
                    >
                      {isArabic ? t(account.descriptionAr, account.description) : account.description}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: colors.text.muted,
                      opacity: 0.6,
                    }}
                  >
                    →
                  </div>
                </button>
              ))}

              <button
                onClick={() => setMode('login')}
                style={{
                  marginTop: spacing[2],
                  padding: spacing[2],
                  background: 'transparent',
                  border: 'none',
                  color: brandCyan,
                  fontSize: typography.size.sm,
                  cursor: 'pointer',
                  fontWeight: typography.weight.semibold,
                }}
              >
                {text.backToLogin}
              </button>
            </div>
          )}

          {/* Login/Register Form */}
          {mode !== 'demo' && (
            <form onSubmit={handleSubmit}>
              {/* Name field (register only) */}
              {mode === 'register' && (
                <div style={{ marginBottom: spacing[4] }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.size.sm,
                      fontWeight: typography.weight.semibold,
                      color: colors.text.secondary,
                      marginBottom: spacing[1.5],
                    }}
                  >
                    {text.name}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: `${spacing[3]}px ${spacing[4]}px`,
                      background: colors.surface.base,
                      border: `1px solid ${colors.border.default}`,
                      borderRadius: radius.lg,
                      color: colors.text.primary,
                      fontSize: typography.size.base,
                      fontFamily: typography.fontFamily,
                      outline: 'none',
                      transition: transitions.fast,
                    }}
                  />
                </div>
              )}

              {/* Email field */}
              <div style={{ marginBottom: spacing[4] }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.semibold,
                    color: colors.text.secondary,
                    marginBottom: spacing[1.5],
                  }}
                >
                  {text.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: `${spacing[3]}px ${spacing[4]}px`,
                    background: colors.surface.base,
                    border: `1px solid ${colors.border.default}`,
                    borderRadius: radius.lg,
                    color: colors.text.primary,
                    fontSize: typography.size.base,
                    fontFamily: typography.fontFamily,
                    outline: 'none',
                    transition: transitions.fast,
                  }}
                />
              </div>

              {/* Password field */}
              <div style={{ marginBottom: spacing[4] }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.semibold,
                    color: colors.text.secondary,
                    marginBottom: spacing[1.5],
                  }}
                >
                  {text.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: `${spacing[3]}px ${spacing[4]}px`,
                    background: colors.surface.base,
                    border: `1px solid ${colors.border.default}`,
                    borderRadius: radius.lg,
                    color: colors.text.primary,
                    fontSize: typography.size.base,
                    fontFamily: typography.fontFamily,
                    outline: 'none',
                    transition: transitions.fast,
                  }}
                />
              </div>

              {/* Error message */}
              {error && (
                <div
                  style={{
                    padding: spacing[3],
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: radius.md,
                    color: colors.error,
                    fontSize: typography.size.sm,
                    marginBottom: spacing[4],
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: `${spacing[3.5]}px`,
                  background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                  border: 'none',
                  borderRadius: radius.lg,
                  color: colors.surface.base,
                  fontSize: typography.size.base,
                  fontWeight: typography.weight.bold,
                  fontFamily: typography.fontFamily,
                  cursor: isLoading ? 'wait' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: transitions.fast,
                  boxShadow: shadows.glow.cyan,
                }}
              >
                {isLoading ? '...' : text.submit}
              </button>

              {/* Mode switchers */}
              <div
                style={{
                  marginTop: spacing[5],
                  textAlign: 'center',
                  fontSize: typography.size.sm,
                  color: colors.text.muted,
                }}
              >
                {mode === 'login' ? text.noAccount : text.hasAccount}{' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: brandCyan,
                    fontWeight: typography.weight.semibold,
                    cursor: 'pointer',
                    fontSize: typography.size.sm,
                  }}
                >
                  {mode === 'login' ? text.register : text.login}
                </button>
              </div>

              {/* Demo accounts link */}
              <div style={{ textAlign: 'center', marginTop: spacing[3] }}>
                <button
                  type="button"
                  onClick={() => setMode('demo')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.text.muted,
                    fontSize: typography.size.xs,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {text.tryDemo}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(24px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .login-modal-content input {
          box-sizing: border-box;
        }
        .login-modal-content input:focus {
          border-color: ${brandCyan} !important;
          box-shadow: 0 0 0 3px ${brandCyan}20;
        }
        .login-modal-content button:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .login-modal-content button:focus-visible {
          outline: 2px solid ${brandCyan};
          outline-offset: 2px;
        }
        @media (max-width: 480px) {
          .login-modal-container {
            max-width: 100% !important;
            margin: 0 ${spacing[2]}px;
            border-radius: ${radius.lg}px !important;
          }
          .login-modal-content {
            padding: ${spacing[4]}px !important;
          }
          .login-modal-header {
            margin-bottom: ${spacing[4]}px !important;
          }
          .login-modal-header h2 {
            font-size: ${typography.size.xl}px !important;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}

export default memo(LoginModal);
