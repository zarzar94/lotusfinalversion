import { CLINIC } from '../data/clinic';
import { styles, brandCyan, brandPurpleDark } from './styles';

const social = [
  { name: 'TikTok', href: 'https://vt.tiktok.com/ZSydLErRH/', icon: '🎵' },
  { name: 'Instagram', href: 'https://www.instagram.com/berard.ait.eg?igsh=MXVjNmFnZng3MHcyMg==', icon: '📷' },
  { name: 'Facebook', href: 'https://www.facebook.com/share/14LfPuhkdVH/', icon: 'f' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/lotus-holistic-centre/', icon: 'in' },
];

// Lotus Holistic Centre Abu Dhabi location
const LOCATION = {
  name: 'Lotus Holistic Centre',
  address: 'أبوظبي، الإمارات العربية المتحدة',
  addressEn: 'Abu Dhabi, United Arab Emirates',
  // Google Maps embed URL for Lotus Holistic Centre Abu Dhabi
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.2!2d54.37!3d24.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLotus%20Holistic%20Centre!5e0!3m2!1sen!2sae!4v1',
  directionsUrl: 'https://www.google.com/maps/search/Lotus+Holistic+Centre+Abu+Dhabi',
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ ...styles.sectionCard, marginBottom: 0, padding: 18 }}>
      {/* Map Section */}
      <div style={{
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(143,211,204,0.2)',
        background: 'linear-gradient(135deg, rgba(143,211,204,0.05), rgba(175,132,186,0.05))',
      }}>
        <div style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          background: 'rgba(11,15,28,0.6)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>📍</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16, color: brandCyan }}>
                  {LOCATION.name}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                  {LOCATION.address}
                </div>
              </div>
            </div>
          </div>
          <a
            href={LOCATION.directionsUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              ...styles.primaryBtn,
              textDecoration: 'none',
              padding: '10px 18px',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>🧭</span> الحصول على الاتجاهات
          </a>
        </div>
        <div style={{ position: 'relative', height: 220 }}>
          <iframe
            src={LOCATION.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{
              border: 0,
              filter: 'grayscale(0.3) contrast(1.1)',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="موقع Lotus Holistic Centre"
          />
          {/* Overlay gradient for blending */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 40,
            background: 'linear-gradient(to top, rgba(11,15,28,0.8), transparent)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

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
