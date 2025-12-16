import { lazy, Suspense, useState } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';
import { useGamification } from '../context/GamificationContext';

const Brain3D = lazy(() => import('./Brain3D'));

const heroContainerStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
  overflow: 'hidden',
};

const contentOverlayStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  maxWidth: 800,
  margin: '0 auto',
};

const brainContainerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  opacity: 0.9,
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(32px, 6vw, 56px)',
  fontWeight: 900,
  lineHeight: 1.1,
  margin: 0,
  background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple}, ${brandPink})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textShadow: 'none',
  filter: 'drop-shadow(0 4px 30px rgba(143,211,204,0.3))',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 'clamp(16px, 2.5vw, 22px)',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.85)',
  margin: '16px 0 0',
  lineHeight: 1.6,
};

const badgeRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 12,
  flexWrap: 'wrap',
  marginTop: 24,
};

const featureBadgeStyle: React.CSSProperties = {
  background: 'rgba(11,15,28,0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(143,211,204,0.3)',
  borderRadius: 999,
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 700,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const ctaContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 14,
  flexWrap: 'wrap',
  marginTop: 32,
};

const primaryCtaStyle: React.CSSProperties = {
  ...styles.primaryBtn,
  padding: '14px 28px',
  fontSize: 16,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
  boxShadow: '0 12px 40px rgba(143,211,204,0.35)',
  transition: 'all 0.3s ease',
};

const secondaryCtaStyle: React.CSSProperties = {
  ...styles.ghostBtn,
  padding: '14px 28px',
  fontSize: 16,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  borderColor: 'rgba(175,132,186,0.4)',
  transition: 'all 0.3s ease',
};

const statsRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 40,
  marginTop: 40,
  flexWrap: 'wrap',
};

const statItemStyle: React.CSSProperties = {
  textAlign: 'center',
};

const statValueStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 900,
  color: brandCyan,
  lineHeight: 1,
};

const statLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.6)',
  marginTop: 4,
  fontWeight: 600,
};

const scrollIndicatorStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 30,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  animation: 'bounce 2s infinite',
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
      width: 200,
      height: 200,
      borderRadius: '50%',
      background: `radial-gradient(circle, rgba(143,211,204,0.3), transparent 70%)`,
      animation: 'pulse 2s ease-in-out infinite',
    }} />
  </div>
);

export default function HeroSection() {
  const { state, brainRegions } = useGamification();
  const [brainLoaded, setBrainLoaded] = useState(false);
  const exploredCount = brainRegions.filter(r => r.explored).length;

  return (
    <section id="about" style={heroContainerStyle}>
      {/* 3D Brain Background */}
      <div style={brainContainerStyle}>
        <Suspense fallback={<Brain3DFallback />}>
          <Brain3D height="100%" />
        </Suspense>
      </div>

      {/* Content Overlay */}
      <div style={contentOverlayStyle}>
        {/* Arabic First Badge */}
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

        {/* Main Title */}
        <h1 style={{ ...titleStyle, marginTop: 24 }}>
          Berard AIT Sound Lab
        </h1>
        <div style={{
          fontSize: 'clamp(20px, 4vw, 28px)',
          fontWeight: 800,
          color: brandPurple,
          marginTop: 8,
        }}>
          أبوظبي
        </div>

        {/* Subtitle */}
        <p style={subtitleStyle}>
          استكشف عالم <span style={{ color: brandCyan }}>السمع</span> و
          <span style={{ color: brandPink }}>معالجة الصوت</span> بطريقة تفاعلية حديثة
          <br />
          مع محتوى علمي، ألعاب سمعية، ورحلة صوتية ثلاثية الأبعاد
        </p>

        {/* CTA Buttons */}
        <div style={ctaContainerStyle}>
          <a
            href="#audio-journey"
            style={primaryCtaStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 16px 50px rgba(143,211,204,0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(143,211,204,0.35)';
            }}
          >
            <span>🎧</span> ابدأ رحلة الصوت
          </a>
          <a
            href="#games"
            style={secondaryCtaStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(175,132,186,0.15)';
              e.currentTarget.style.borderColor = brandPurple;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'rgba(175,132,186,0.4)';
            }}
          >
            <span>🎮</span> العب الألعاب السمعية
          </a>
          <a
            href="#checklist"
            style={secondaryCtaStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(143,211,204,0.15)';
              e.currentTarget.style.borderColor = brandCyan;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'rgba(175,132,186,0.4)';
            }}
          >
            <span>✅</span> قائمة التحقق
          </a>
        </div>

        {/* Stats */}
        <div style={statsRowStyle}>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{state.totalPoints}</div>
            <div style={statLabelStyle}>نقاط XP</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{exploredCount}/6</div>
            <div style={statLabelStyle}>مناطق الدماغ</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{state.gamesCompleted.length}</div>
            <div style={statLabelStyle}>ألعاب مكتملة</div>
          </div>
        </div>

        {/* Compliance Notice */}
        <div style={{
          marginTop: 32,
          padding: '12px 20px',
          background: 'rgba(175,132,186,0.1)',
          border: '1px solid rgba(175,132,186,0.25)',
          borderRadius: 12,
          fontSize: 13,
          color: 'rgba(255,255,255,0.7)',
          maxWidth: 500,
          margin: '32px auto 0',
        }}>
          <span style={{ fontWeight: 900, color: brandPurpleDark }}>مهم: </span>
          المحتوى والألعاب هنا توعوية وغير تشخيصية. إذا كانت لديك مخاوف سريرية، يرجى التواصل مع مختص مؤهل.
        </div>
      </div>

      {/* Scroll Indicator */}
      <div style={scrollIndicatorStyle}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>استكشف المزيد</div>
        <div style={{
          width: 24,
          height: 36,
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: 12,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 6,
        }}>
          <div style={{
            width: 4,
            height: 8,
            background: brandCyan,
            borderRadius: 2,
            animation: 'scrollDot 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }
        @keyframes scrollDot {
          0% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}
