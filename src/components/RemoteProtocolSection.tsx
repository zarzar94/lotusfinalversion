import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';
import { useLanguage } from '../context/LanguageContext';

const steps = [
  {
    number: '01',
    title: 'التقييم الأولي',
    titleEn: 'Registration & Assessment',
    description: 'استشارة افتراضية لتقييم الحالة وتحديد مدى ملاءمة البرنامج',
    descriptionEn: 'Fill out registration form and complete initial online assessment',
    icon: '📋',
  },
  {
    number: '02',
    title: 'إعداد المعدات',
    titleEn: 'Receive Equipment',
    description: 'توفير سماعات معتمدة وإعداد البيئة المنزلية المناسبة',
    descriptionEn: 'Receive certified Berard AIT device with headphones and instructions',
    icon: '🎧',
  },
  {
    number: '03',
    title: 'اختبار السمع',
    titleEn: 'Audiogram & Calibration',
    description: 'إجراء اختبار Audiogram عن بُعد لتخصيص البرنامج',
    descriptionEn: 'Complete audiogram and calibrate the program to your hearing profile',
    icon: '📊',
  },
  {
    number: '04',
    title: 'جلسات الاستماع',
    titleEn: 'Monitored Sessions',
    description: '20 جلسة عبر الفيديو مع إشراف مباشر من الممارس المعتمد',
    descriptionEn: '20 home sessions with live monitoring and support',
    icon: '💻',
  },
  {
    number: '05',
    title: 'المتابعة والتقييم',
    titleEn: 'Follow-up & Reports',
    description: 'اختبارات ما بعد البرنامج وتقرير شامل بالنتائج',
    descriptionEn: 'Ongoing reports and final evaluation to track outcomes',
    icon: '✅',
  },
];

const requirements = [
  { icon: '💻', text: 'جهاز كمبيوتر أو لابتوب مع كاميرا', textEn: 'Computer or laptop with a camera' },
  { icon: '🌐', text: 'اتصال إنترنت مستقر وسريع', textEn: 'Stable, fast internet connection' },
  { icon: '🎧', text: 'سماعات معتمدة (نوفرها أو نرشدك للنوع المطلوب)', textEn: 'Certified headphones (provided or recommended)' },
  { icon: '🏠', text: 'غرفة هادئة للجلسات', textEn: 'A quiet room for sessions' },
  { icon: '👨‍👩‍👧', text: 'حضور ولي الأمر للأطفال', textEn: 'Parent/guardian present for children' },
];

const benefits = [
  { title: 'راحة المنزل', titleEn: 'Home Comfort', description: 'لا حاجة للسفر أو التنقل', descriptionEn: 'Receive care from your own space', icon: '🏡' },
  { title: 'مرونة الوقت', titleEn: 'Time & Travel Savings', description: 'جدول يناسب ظروفك', descriptionEn: 'No commuting with flexible scheduling', icon: '⏰' },
  { title: 'إشراف مباشر', titleEn: 'Clinician Monitoring', description: 'نفس جودة الجلسات الحضورية', descriptionEn: 'Real-time follow-up and adjustments', icon: '👁️' },
  { title: 'توفير التكاليف', titleEn: 'Cost Savings', description: 'لا مصاريف إقامة أو سفر', descriptionEn: 'No travel or accommodation costs', icon: '💰' },
];

export default function RemoteProtocolSection() {
  const { isArabic, t } = useLanguage();

  return (
    <section id="remote" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>{t('remoteProtocol.title')}</h2>
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
            {t('common.startNow')}
          </span>
        </div>
        <p style={styles.bodyText}>{t('remoteProtocol.description')}</p>
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
            {isArabic ? (
              <>
                {'تقنية '}
                <span style={{ color: brandCyan }}>Telehealth</span>
                {' المعتمدة'}
              </>
            ) : (
              <>
                {'Certified '}
                <span style={{ color: brandCyan }}>Telehealth</span>
                {' Sessions'}
              </>
            )}
          </h3>
          <p style={{ ...styles.muted, marginTop: 8 }}>
            {isArabic
              ? 'نفس البروتوكول والفعالية مع راحة البقاء في المنزل'
              : 'Same protocol and effectiveness, with the comfort of staying at home.'}
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
        <h3 style={{ ...styles.h3, marginBottom: 16 }}>{t('remoteProtocol.howItWorks')}</h3>
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
                  <span style={{ fontWeight: 800, fontSize: 15 }}>{isArabic ? step.title : step.titleEn}</span>
                </div>
                <p style={{ ...styles.muted, marginTop: 4, marginBottom: 0 }}>
                  {isArabic ? step.description : step.descriptionEn}
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
            {isArabic ? 'المتطلبات التقنية' : 'Technical Requirements'}
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
                <span style={{ fontSize: 14, opacity: 0.9 }}>{isArabic ? req.text : req.textEn}</span>
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
            {isArabic ? 'المميزات' : 'Benefits'}
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
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6 }}>{isArabic ? benefit.title : benefit.titleEn}</div>
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{isArabic ? benefit.description : benefit.descriptionEn}</div>
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
          {t('remoteProtocol.inquire')}
        </a>
        <a href="#faq" style={{ ...styles.ghostBtn, textDecoration: 'none' }}>
          {t('nav.faq')}
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
