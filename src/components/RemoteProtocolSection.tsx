import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';

const steps = [
  {
    number: '01',
    title: 'التقييم الأولي',
    description: 'استشارة افتراضية لتقييم الحالة وتحديد مدى ملاءمة البرنامج',
    icon: '📋',
  },
  {
    number: '02',
    title: 'إعداد المعدات',
    description: 'توفير سماعات معتمدة وإعداد البيئة المنزلية المناسبة',
    icon: '🎧',
  },
  {
    number: '03',
    title: 'اختبار السمع',
    description: 'إجراء اختبار Audiogram عن بُعد لتخصيص البرنامج',
    icon: '📊',
  },
  {
    number: '04',
    title: 'جلسات الاستماع',
    description: '20 جلسة عبر الفيديو مع إشراف مباشر من الممارس المعتمد',
    icon: '💻',
  },
  {
    number: '05',
    title: 'المتابعة والتقييم',
    description: 'اختبارات ما بعد البرنامج وتقرير شامل بالنتائج',
    icon: '✅',
  },
];

const requirements = [
  { icon: '💻', text: 'جهاز كمبيوتر أو لابتوب مع كاميرا' },
  { icon: '🌐', text: 'اتصال إنترنت مستقر وسريع' },
  { icon: '🎧', text: 'سماعات معتمدة (نوفرها أو نرشدك للنوع المطلوب)' },
  { icon: '🏠', text: 'غرفة هادئة للجلسات' },
  { icon: '👨‍👩‍👧', text: 'حضور ولي الأمر للأطفال' },
];

const benefits = [
  { title: 'راحة المنزل', description: 'لا حاجة للسفر أو التنقل', icon: '🏡' },
  { title: 'مرونة الوقت', description: 'جدول يناسب ظروفك', icon: '⏰' },
  { title: 'إشراف مباشر', description: 'نفس جودة الجلسات الحضورية', icon: '👁️' },
  { title: 'توفير التكاليف', description: 'لا مصاريف إقامة أو سفر', icon: '💰' },
];

export default function RemoteProtocolSection() {
  return (
    <section id="remote" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>البرنامج عن بُعد (Remote AIT)</h2>
          <span style={{
            ...styles.chip,
            background: 'rgba(143,211,204,0.12)',
            borderColor: 'rgba(143,211,204,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            متاح الآن
          </span>
        </div>
        <p style={styles.bodyText}>
          احصل على برنامج <b style={{ color: brandCyan }}>Berard AIT</b> الكامل من راحة منزلك،
          مع إشراف مباشر من ممارس معتمد عبر تقنية الفيديو.
        </p>
      </div>

      {/* Hero Banner */}
      <div style={{
        marginTop: 20,
        padding: 24,
        background: `linear-gradient(135deg, rgba(143,211,204,0.15), rgba(175,132,186,0.15))`,
        borderRadius: 16,
        border: '1px solid rgba(143,211,204,0.2)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20,
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            background: 'rgba(34,197,94,0.2)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 8,
            marginBottom: 12,
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
            }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e' }}>LIVE SESSION</span>
          </div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
            تقنية <span style={{ color: brandCyan }}>Telehealth</span> المعتمدة
          </h3>
          <p style={{ ...styles.muted, marginTop: 8 }}>
            نفس البروتوكول والفعالية مع راحة البقاء في المنزل
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
        }}>
          {/* Visual Tech Icons */}
          <div style={{
            width: 70,
            height: 70,
            borderRadius: 14,
            background: 'rgba(143,211,204,0.2)',
            border: '1px solid rgba(143,211,204,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}>
            💻
          </div>
          <div style={{
            width: 70,
            height: 70,
            borderRadius: 14,
            background: 'rgba(175,132,186,0.2)',
            border: '1px solid rgba(175,132,186,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}>
            📡
          </div>
          <div style={{
            width: 70,
            height: 70,
            borderRadius: 14,
            background: 'rgba(176,18,112,0.2)',
            border: '1px solid rgba(176,18,112,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}>
            🎧
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ ...styles.h3, marginBottom: 16 }}>خطوات البرنامج</h3>
        <div style={{
          display: 'grid',
          gap: 12,
        }}>
          {steps.map((step, index) => (
            <div
              key={step.number}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: 16,
                background: 'rgba(15,22,41,0.6)',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.06)',
                position: 'relative',
              }}
            >
              {/* Step Number */}
              <div style={{
                minWidth: 44,
                height: 44,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${brandCyan}33, ${brandPurple}33)`,
                border: `1px solid ${brandCyan}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 14,
                color: brandCyan,
              }}>
                {step.number}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{ fontSize: 20 }}>{step.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>{step.title}</span>
                </div>
                <p style={{ ...styles.muted, marginTop: 4, marginBottom: 0 }}>
                  {step.description}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  right: 37,
                  bottom: -12,
                  width: 2,
                  height: 12,
                  background: `linear-gradient(180deg, ${brandCyan}44, transparent)`,
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Requirements & Benefits Grid */}
      <div style={{
        marginTop: 24,
        display: 'grid',
        gap: 14,
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      }}>
        {/* Requirements */}
        <div style={{
          ...styles.section,
          marginBottom: 0,
          background: 'rgba(15,22,41,0.6)',
        }}>
          <h3 style={{ ...styles.h3, marginTop: 0, color: brandPurple }}>
            ⚙️ المتطلبات التقنية
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {requirements.map((req, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                background: 'rgba(175,132,186,0.08)',
                borderRadius: 10,
              }}>
                <span style={{ fontSize: 18 }}>{req.icon}</span>
                <span style={{ fontSize: 14, opacity: 0.9 }}>{req.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div style={{
          ...styles.section,
          marginBottom: 0,
          background: 'rgba(15,22,41,0.6)',
        }}>
          <h3 style={{ ...styles.h3, marginTop: 0, color: brandCyan }}>
            ✨ المميزات
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
          }}>
            {benefits.map((benefit, i) => (
              <div key={i} style={{
                padding: 12,
                background: 'rgba(143,211,204,0.08)',
                borderRadius: 10,
                textAlign: 'center',
              }}>
                <span style={{ fontSize: 24 }}>{benefit.icon}</span>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6 }}>{benefit.title}</div>
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{benefit.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        marginTop: 20,
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
      }}>
        <a href="#contact" style={{
          ...styles.primaryBtn,
          textDecoration: 'none',
          background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
        }}>
          احجز استشارة مجانية
        </a>
        <a href="#faq" style={{ ...styles.ghostBtn, textDecoration: 'none' }}>
          الأسئلة الشائعة
        </a>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
