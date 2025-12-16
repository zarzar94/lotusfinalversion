import { useMemo } from 'react';

import { assetUrl } from '../utils/asset';
import { brandPurple, brandCyan } from './styles';

const Header = () => {
  const css = useMemo(
    () => `
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(2deg); }
      }
      @keyframes glow {
        0%, 100% { filter: drop-shadow(0 0 20px rgba(143,211,204,0.4)) drop-shadow(0 0 40px rgba(175,132,186,0.3)); }
        50% { filter: drop-shadow(0 0 30px rgba(143,211,204,0.6)) drop-shadow(0 0 60px rgba(175,132,186,0.5)); }
      }
      .floatingLogo {
        animation: float 4s ease-in-out infinite, glow 3s ease-in-out infinite;
      }
    `,
    [],
  );

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      background: 'linear-gradient(180deg, rgba(11,15,28,0.95) 0%, rgba(11,15,28,0.8) 70%, transparent 100%)',
      backdropFilter: 'blur(10px)',
    }}>
      <style>{css}</style>

      {/* Brand Name */}
      <div style={{
        fontSize: 28,
        fontWeight: 900,
        letterSpacing: 2,
        textAlign: 'center',
      }}>
        <span style={{ color: brandPurple }}>Berard</span>{' '}
        <span style={{ color: brandCyan }}>AIT</span>
      </div>

      {/* Floating 3D Brain Logo */}
      <div
        className="floatingLogo"
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(11,15,28,0.6)',
          border: '2px solid rgba(143,211,204,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={assetUrl('assets/images/brain_logo.png')}
          alt="Berard AIT Brain"
          style={{
            width: 65,
            height: 65,
            objectFit: 'contain',
            mixBlendMode: 'screen',
          }}
        />
      </div>
    </header>
  );
};

export default Header;
