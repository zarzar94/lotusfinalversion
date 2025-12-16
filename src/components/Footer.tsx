import { CLINIC } from '../data/clinic';
import { styles, brandCyan, brandPurpleDark } from './styles';

const social = [
  { name: 'TikTok', href: 'https://vt.tiktok.com/ZSydLErRH/', icon: '🎵' },
  { name: 'Instagram', href: 'https://www.instagram.com/berard.ait.eg?igsh=MXVjNmFnZng3MHcyMg==', icon: '📷' },
  { name: 'Facebook', href: 'https://www.facebook.com/share/14LfPuhkdVH/', icon: 'f' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/lotus-holistic-centre/', icon: 'in' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ ...styles.sectionCard, marginBottom: 0, padding: 18 }}>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 16, color: brandPurpleDark }}>{CLINIC.name}</div>
          <div style={{ ...styles.muted, marginTop: 6 }}>{CLINIC.city}</div>
          <div style={{ ...styles.muted, marginTop: 6 }}>
            <span style={{ color: brandCyan, fontWeight: 900 }}>WhatsApp:</span> {CLINIC.whatsapp}
          </div>
          <div style={{ ...styles.muted, marginTop: 10 }}>
            تصميم عربي أولاً • تجربة تفاعلية • <span style={{ color: brandCyan }}>Sound Lab</span>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>روابط سريعة</div>
          <div style={{ display: 'grid', gap: 8 }}>
            <a style={styles.navLink} href="#overview">البرنامج</a>
            <a style={styles.navLink} href="#results">النتائج</a>
            <a style={styles.navLink} href="#pptx">الشرائح</a>
            <a style={styles.navLink} href="#games">الألعاب</a>
            <a style={styles.navLink} href="#schools">شراكات المدارس</a>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>تابعنا</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {social.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.chip, textDecoration: 'none', cursor: 'pointer' }}
              >
                <span style={{ fontWeight: 900 }}>{s.icon}</span> {s.name}
              </a>
            ))}
          </div>
          <div style={{ ...styles.muted, marginTop: 12 }}>
            ملاحظة: لا نقدم تشخيصاً عبر الموقع. للتقييم، يرجى التواصل لحجز موعد.
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginTop: 14, marginBottom: 10 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={styles.muted}>© {year} {CLINIC.name}</div>
        <div style={styles.muted}>Built with React + Vite • Hosted on GitHub Pages</div>
      </div>
    </footer>
  );
};

export default Footer;
