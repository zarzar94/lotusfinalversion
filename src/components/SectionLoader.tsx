import { brandCyan, brandPurple, brandPink, typography, spacing, radius, colors } from './styles';

interface SectionLoaderProps {
  label?: string;
  height?: number;
}

export default function SectionLoader({ label = 'جارٍ التحميل...', height = 300 }: SectionLoaderProps) {
  return (
    <div style={{
      background: 'rgba(11,15,28,0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: radius['2xl'],
      border: `1px solid ${colors.border.subtle}`,
      padding: spacing[8],
      minHeight: height,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[5],
    }}>
      {/* Animated loader */}
      <div style={{
        position: 'relative',
        width: 60,
        height: 60,
      }}>
        {/* Outer ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius.full,
          border: `3px solid ${colors.border.default}`,
        }} />

        {/* Spinning gradient ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius.full,
          border: '3px solid transparent',
          borderTopColor: brandCyan,
          borderRightColor: brandPurple,
          animation: 'loaderSpin 1s linear infinite',
        }} />

        {/* Inner pulse */}
        <div style={{
          position: 'absolute',
          inset: spacing[3],
          borderRadius: radius.full,
          background: `radial-gradient(circle, ${brandPink}33, transparent)`,
          animation: 'loaderPulse 1.5s ease-in-out infinite',
        }} />
      </div>

      {/* Loading text */}
      <div style={{
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.text.secondary,
        letterSpacing: typography.letterSpacing.wide,
      }}>
        {label}
      </div>

      {/* Skeleton lines */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[3],
        width: '100%',
        maxWidth: 400,
      }}>
        <div style={{
          height: spacing[4],
          background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          borderRadius: radius.sm,
          animation: 'skeleton 1.5s ease-in-out infinite',
          backgroundSize: '200% 100%',
        }} />
        <div style={{
          height: spacing[3],
          width: '70%',
          margin: '0 auto',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          borderRadius: radius.sm,
          animation: 'skeleton 1.5s ease-in-out infinite 0.2s',
          backgroundSize: '200% 100%',
        }} />
        <div style={{
          height: spacing[3],
          width: '50%',
          margin: '0 auto',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          borderRadius: radius.sm,
          animation: 'skeleton 1.5s ease-in-out infinite 0.4s',
          backgroundSize: '200% 100%',
        }} />
      </div>

      <style>{`
        @keyframes loaderSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes loaderPulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
