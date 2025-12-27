import { useEffect, useState } from 'react';
import { styles, brandCyan, brandPink } from '../styles';
import { MenuIcon } from '../Icons';
import LabButton from '../labui/LabButton';

const MainNavigation = ({ locale = 'ar' }: { locale?: 'ar' | 'en' }) => {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState(locale);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { href: '#about', label: locale === 'ar' ? 'عنّا' : 'About' },
    { href: '#assessment', label: locale === 'ar' ? 'التقييم' : 'Assessment' },
    { href: '#treatment', label: locale === 'ar' ? 'العلاج' : 'Treatment' },
    { href: '#analytics', label: locale === 'ar' ? 'تحليلات' : 'Analytics' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: scrolled ? 'rgba(5,6,13,0.9)' : 'rgba(5,6,13,0.75)',
      }}
    >
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ ...styles.h3, margin: 0 }}>SoundLab</span>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)' }}>AIT</span>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {links.map((link) => (
              <a key={link.href} href={link.href} style={{ ...styles.kicker, textDecoration: 'none', color: 'white' }}>
                {link.label}
              </a>
            ))}
          </div>
          <LabButton
            variant="ghost"
            onClick={() => setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'))}
            style={{ padding: '6px 10px', borderColor: brandCyan }}
          >
            {language === 'ar' ? 'EN' : 'عربي'}
          </LabButton>
          <div style={{ position: 'relative' }}>
            <LabButton variant="ghost" onClick={() => setOpen((o) => !o)} style={{ padding: '6px 10px' }}>
              <MenuIcon size={18} />
            </LabButton>
            {open && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  minWidth: 220,
                  background: 'rgba(11, 15, 28, 0.95)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: 10,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                }}
              >
                <div style={{ ...styles.kicker, opacity: 0.8, marginBottom: 6 }}>القائمة</div>
                {links.map((link) => (
                  <a key={link.href} href={link.href} style={{ display: 'block', padding: 8, color: 'white', textDecoration: 'none' }}>
                    {link.label}
                  </a>
                ))}
                <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
                  <LabButton variant="primary" style={{ padding: '8px 12px' }}>ابدأ الآن</LabButton>
                  <LabButton variant="ghost" style={{ padding: '8px 12px', borderColor: brandPink }}>
                    حجز استشارة
                  </LabButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MainNavigation;
