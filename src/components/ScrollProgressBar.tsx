import { useScrollProgress } from '../hooks/useParallax';
import { brandCyan, brandPurple, brandPink, typography, spacing, radius, transitions, colors } from './styles';

export default function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <>
      {/* Top progress bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'rgba(11,15,28,0.8)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}>
        <div style={{
          height: '100%',
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple}, ${brandPink})`,
          transition: 'width 0.1s linear',
          boxShadow: `0 0 10px ${brandCyan}66`,
        }} />
      </div>

      {/* Side progress indicator */}
      <div style={{
        position: 'fixed',
        right: spacing[5],
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing[2],
        zIndex: 9998,
        opacity: progress > 0.05 ? 1 : 0,
        transition: transitions.normal,
        pointerEvents: 'none',
      }}>
        {/* Progress percentage */}
        <div style={{
          fontSize: typography.size.xs,
          fontWeight: typography.weight.bold,
          color: brandCyan,
          fontFamily: 'monospace',
          padding: `${spacing[1]}px ${spacing[2]}px`,
          background: 'rgba(11,15,28,0.9)',
          borderRadius: radius.sm,
          border: `1px solid ${brandCyan}44`,
        }}>
          {Math.round(progress * 100)}%
        </div>

        {/* Vertical progress bar */}
        <div style={{
          width: spacing[1],
          height: 100,
          background: colors.border.default,
          borderRadius: spacing[0.5],
          overflow: 'hidden',
        }}>
          <div style={{
            width: '100%',
            height: `${progress * 100}%`,
            background: `linear-gradient(180deg, ${brandCyan}, ${brandPurple})`,
            borderRadius: spacing[0.5],
            transition: 'height 0.1s linear',
          }} />
        </div>

        {/* Section dots */}
        {[0, 0.25, 0.5, 0.75, 1].map((point, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              right: -2,
              top: `${52 + point * 100}px`,
              width: spacing[2],
              height: spacing[2],
              borderRadius: radius.full,
              background: progress >= point ? brandCyan : 'rgba(255,255,255,0.2)',
              transition: transitions.normal,
              boxShadow: progress >= point ? `0 0 8px ${brandCyan}66` : 'none',
            }}
          />
        ))}
      </div>
    </>
  );
}
