import { lazy, Suspense } from 'react';
import { brandCyan, brandPink, brandPurple } from './styles';

const Brain3D = lazy(() => import('./Brain3D'));

const heroContainerStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '20px 20px 40px',
  overflow: 'hidden',
};

const brainContainerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
};

const contentOverlayStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  maxWidth: 600,
  margin: '0 auto',
  pointerEvents: 'none',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(28px, 5vw, 48px)',
  fontWeight: 900,
  lineHeight: 1.1,
  margin: 0,
  background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple}, ${brandPink})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textShadow: 'none',
  filter: 'drop-shadow(0 4px 30px rgba(143,211,204,0.4))',
};

const badgeRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 10,
  flexWrap: 'wrap',
  marginTop: 16,
  pointerEvents: 'auto',
};

const featureBadgeStyle: React.CSSProperties = {
  background: 'rgba(11,15,28,0.85)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(143,211,204,0.25)',
  borderRadius: 999,
  padding: '6px 14px',
  fontSize: 12,
  fontWeight: 700,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: 5,
};

const scrollIndicatorStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  animation: 'bounce 2s infinite',
  zIndex: 10,
};

const Brain3DFallback = () => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
  }}>
    <div style={{
      width: 150,
      height: 150,
      borderRadius: '50%',
      background: `radial-gradient(circle, rgba(143,211,204,0.3), transparent 70%)`,
      animation: 'pulse 2s ease-in-out infinite',
    }} />
  </div>
);

export default function HeroSection() {
  return (
    <section id="about" style={heroContainerStyle}>
      {/* 3D Brain Background - Full screen with bubbles */}
      <div style={brainContainerStyle}>
        <Suspense fallback={<Brain3DFallback />}>
          <Brain3D height="100%" showUI={true} />
        </Suspense>
      </div>

      {/* Minimal Content Overlay at Top */}
      <div style={contentOverlayStyle}>
        {/* Main Title */}
        <h1 style={titleStyle}>
          Berard AIT Sound Lab
        </h1>
        <div style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontWeight: 800,
          color: brandPurple,
          marginTop: 6,
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}>
          أبوظبي
        </div>

        {/* Feature Badges */}
        <div style={badgeRowStyle}>
          <div style={featureBadgeStyle}>
            <span>🧠</span> تجربة تفاعلية
          </div>
          <div style={featureBadgeStyle}>
            <span>🎮</span> ألعاب صوتية
          </div>
          <div style={featureBadgeStyle}>
            <span style={{ color: brandCyan }}>عربي أولاً</span>
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div style={scrollIndicatorStyle}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>استكشف المزيد</div>
        <div style={{
          width: 22,
          height: 32,
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: 11,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 5,
        }}>
          <div style={{
            width: 3,
            height: 7,
            background: brandCyan,
            borderRadius: 2,
            animation: 'scrollDot 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-8px); }
          60% { transform: translateX(-50%) translateY(-4px); }
        }
        @keyframes scrollDot {
          0% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(8px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        @media (max-width: 768px) {
          #about {
            min-height: 100vh !important;
            padding: 16px 12px 50px !important;
          }
        }
      `}</style>
    </section>
  );
}
