import { useScrollProgress } from '../hooks/useParallax';
import { brandCyan, brandPurple, brandPink } from './styles';

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
        right: 20,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        zIndex: 9998,
        opacity: progress > 0.05 ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }}>
        {/* Progress percentage */}
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          color: brandCyan,
          fontFamily: 'monospace',
          padding: '4px 8px',
          background: 'rgba(11,15,28,0.9)',
          borderRadius: 6,
          border: `1px solid ${brandCyan}44`,
        }}>
          {Math.round(progress * 100)}%
        </div>

        {/* Vertical progress bar */}
        <div style={{
          width: 4,
          height: 100,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <div style={{
            width: '100%',
            height: `${progress * 100}%`,
            background: `linear-gradient(180deg, ${brandCyan}, ${brandPurple})`,
            borderRadius: 2,
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
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: progress >= point ? brandCyan : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
              boxShadow: progress >= point ? `0 0 8px ${brandCyan}66` : 'none',
            }}
          />
        ))}
      </div>
    </>
  );
}
