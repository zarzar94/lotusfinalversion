import { useMemo, useState } from 'react';

import { assetUrl } from '../utils/asset';
import { styles, brandPurple, brandCyan, brandPink, brandPurpleDark } from './styles';

const navItems = [
  { href: '#about', label: 'الرئيسية' },
  { href: '#audio-journey', label: '🎧 رحلة الصوت' },
  { href: '#neuroplasticity', label: '🧠 العلم' },
  { href: '#overview', label: 'البرنامج' },
  { href: '#remote', label: '💻 عن بُعد' },
  { href: '#testimonials', label: '⭐ قصص النجاح' },
  { href: '#videos', label: '🎥 فيديو' },
  { href: '#games', label: '🎮 الألعاب' },
  { href: '#faq', label: '❓ الأسئلة' },
  { href: '#contact', label: '📞 تواصل' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const css = useMemo(
    () => `
      @media (max-width: 980px) {
        .topNav {
          display: none;
        }
        .burgerBtn {
          display: inline-flex;
        }
      }
      @media (min-width: 981px) {
        .burgerBtn {
          display: none;
        }
      }
      .brandGlow {
        filter: drop-shadow(0 10px 30px rgba(143,211,204,0.18));
      }
      .navPill:hover {
        border-color: rgba(143,211,204,0.28);
        background: rgba(143,211,204,0.08);
      }
      .menuPanel {
        position: absolute;
        right: 12px;
        top: 62px;
        background: rgba(11,15,28,0.96);
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 16px;
        padding: 12px;
        min-width: 260px;
        box-shadow: 0 20px 70px rgba(0,0,0,0.45);
      }
    `,
    [],
  );

  return (
    <header style={styles.header}>
      <style>{css}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          className="brandGlow"
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: `linear-gradient(135deg, rgba(119,78,135,0.55), rgba(143,211,204,0.20))`,
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <img
            src={assetUrl('assets/images/brain_icon_44.png')}
            alt="Berard AIT"
            width={28}
            height={28}
            loading="eager"
            style={{ display: 'block' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontWeight: 900, lineHeight: 1.1 }}>
            <span style={{ color: brandPurple }}>Berard</span>{' '}
            <span style={{ color: brandCyan }}>AIT</span>{' '}
            <span style={{ color: '#f7f8fb' }}>Sound Lab</span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.82, lineHeight: 1.2 }}>
            تكامل سمعي • موسيقى + دماغ • شراكات مدارس وجامعات
          </div>
        </div>
      </div>

      <nav className="topNav" aria-label="القائمة الرئيسية">
        <ul
          style={{
            ...styles.navList,
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <a className="navPill" href={item.href} style={styles.navLink}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          className="burgerBtn"
          style={styles.burger}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="فتح القائمة"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        {menuOpen ? (
          <div className="menuPanel" role="menu" aria-label="قائمة الروابط">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <div style={{ fontWeight: 900, color: brandPurpleDark }}>التنقل</div>
              <button type="button" style={styles.ghostBtn} onClick={() => setMenuOpen(false)}>
                إغلاق
              </button>
            </div>
            <ul style={{ ...styles.navList, display: 'grid', gap: 8, marginTop: 10 }}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    style={{ ...styles.navLink, width: '100%', textAlign: 'right' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              <a href="#games" style={{ ...styles.primaryBtn, textAlign: 'center', textDecoration: 'none' }}>
                ابدأ التجربة التفاعلية
              </a>
              <a
                href="#contact"
                style={{ ...styles.ghostBtn, textAlign: 'center', textDecoration: 'none' }}
              >
                احجز / تواصل الآن
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
