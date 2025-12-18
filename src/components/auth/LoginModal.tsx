import { useState, useCallback, useEffect, memo } from 'react';
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

const DEMO_ACCOUNTS: { role: UserRole; email: string; label: string; labelAr: string; icon: string; color: string }[] = [
  { role: 'patient', email: 'demo@patient.com', label: 'Patient', labelAr: 'مريض', icon: '👤', color: brandCyan },
  { role: 'parent', email: 'demo@parent.com', label: 'Parent', labelAr: 'ولي أمر', icon: '👨‍👩‍👧', color: brandPurple },
  { role: 'clinician', email: 'demo@clinician.com', label: 'Clinician', labelAr: 'طبيب', icon: '👨‍⚕️', color: brandPink },
  { role: 'school_admin', email: 'demo@school.com', label: 'School Admin', labelAr: 'مدير مدرسة', icon: '🏫', color: '#f59e0b' },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { isArabic, direction } = useLanguage();
  const { login, register, isLoading } = useUser();

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
        setError(isArabic ? 'بيانات الدخول غير صحيحة' : 'Invalid email or password');
      }
    } else if (mode === 'register') {
      if (!name.trim()) {
        setError(isArabic ? 'الرجاء إدخال الاسم' : 'Please enter your name');
        return;
      }
      const success = await register({ email, password, name });
      if (success) {
        onClose();
      } else {
        setError(isArabic ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already in use');
      }
    }
  }, [mode, email, password, name, login, register, onClose, isArabic]);

  const handleDemoLogin = useCallback(async (demoEmail: string) => {
    setError('');
    const success = await login(demoEmail, 'demo123');
    if (success) {
      onClose();
    }
  }, [login, onClose]);

  if (!isOpen) return null;

  const text = {
    login: isArabic ? 'تسجيل الدخول' : 'Sign In',
    register: isArabic ? 'إنشاء حساب' : 'Create Account',
    demo: isArabic ? 'حسابات تجريبية' : 'Demo Accounts',
    email: isArabic ? 'البريد الإلكتروني' : 'Email',
    password: isArabic ? 'كلمة المرور' : 'Password',
    name: isArabic ? 'الاسم' : 'Name',
    submit: mode === 'login' ? (isArabic ? 'دخول' : 'Sign In') : (isArabic ? 'تسجيل' : 'Register'),
    noAccount: isArabic ? 'ليس لديك حساب؟' : "Don't have an account?",
    hasAccount: isArabic ? 'لديك حساب بالفعل؟' : 'Already have an account?',
    tryDemo: isArabic ? 'جرب الحسابات التجريبية' : 'Try Demo Accounts',
    backToLogin: isArabic ? 'العودة لتسجيل الدخول' : 'Back to Sign In',
  };

  return (
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
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: spacing[4],
        animation: 'modalFadeIn 0.3s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.surface.overlay,
          borderRadius: radius.xl,
          maxWidth: 420,
          width: '100%',
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
          ✕
        </button>

        <div style={{ padding: spacing[6] }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: spacing[5] }}>
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
              {mode === 'demo' ? '🎮' : '🔐'}
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
                  onClick={() => handleDemoLogin(account.email)}
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
                    {account.icon}
                  </div>
                  <div style={{ textAlign: isArabic ? 'right' : 'left' }}>
                    <div
                      style={{
                        fontSize: typography.size.base,
                        fontWeight: typography.weight.bold,
                        color: colors.text.primary,
                      }}
                    >
                      {isArabic ? account.labelAr : account.label}
                    </div>
                    <div
                      style={{
                        fontSize: typography.size.xs,
                        color: colors.text.muted,
                      }}
                    >
                      {account.email}
                    </div>
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
                    color: '#ef4444',
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
        input:focus {
          border-color: ${brandCyan} !important;
          box-shadow: 0 0 0 3px ${brandCyan}20;
        }
        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}

export default memo(LoginModal);
