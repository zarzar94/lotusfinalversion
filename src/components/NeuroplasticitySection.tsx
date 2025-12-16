import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';

const brainFactCards = [
  {
    icon: '🧠',
    title: 'الدماغ قابل للتغيير',
    description: 'الخلايا العصبية في أدمغتنا قابلة للتعديل وإعادة التشكيل طوال الحياة',
    color: brandCyan,
  },
  {
    icon: '🔄',
    title: 'إعادة التوصيل',
    description: 'يمكن للدماغ إنشاء مسارات عصبية جديدة من خلال التدريب المكثف والمتكرر',
    color: brandPurple,
  },
  {
    icon: '📈',
    title: 'التعلم مدى الحياة',
    description: 'اللدونة العصبية تمكّن التعلم والتحسن في أي عمر',
    color: brandPink,
  },
  {
    icon: '🎯',
    title: 'الكثافة والتكرار',
    description: 'التغيير يتطلب التعرض للنشاط بكثافة وتكرار ومدة كافية',
    color: brandPurpleDark,
  },
];

export default function NeuroplasticitySection() {
  return (
    <section id="neuroplasticity" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>اللدونة العصبية: أساس التغيير</h2>
          <span style={{ ...styles.chip, background: 'rgba(175,132,186,0.12)', borderColor: 'rgba(175,132,186,0.25)' }}>
            🔬 العلم وراء البرنامج
          </span>
        </div>
      </div>

      {/* Quote Block */}
      <div style={{
        margin: '20px 0',
        padding: 24,
        background: `linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.08))`,
        borderRadius: 16,
        borderRight: `4px solid ${brandCyan}`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 10,
          right: 16,
          fontSize: 48,
          opacity: 0.15,
          color: brandCyan,
        }}>
          "
        </div>
        <p style={{
          fontSize: 18,
          lineHeight: 1.8,
          color: '#f7f8fb',
          margin: 0,
          fontWeight: 500,
        }}>
          اللدونة العصبية تعني أن الخلايا العصبية في أدمغتنا وأجهزتنا العصبية
          <span style={{ color: brandCyan, fontWeight: 800 }}> قابلة للتغيير</span>،
          أو يمكنها تعديل نفسها.
        </p>
        <div style={{
          marginTop: 12,
          fontSize: 14,
          color: 'rgba(255,255,255,0.7)',
          fontWeight: 700,
        }}>
          — نورمان دويدج، مؤلف كتاب "الدماغ الذي يُغيّر نفسه"
        </div>
      </div>

      {/* Explanation */}
      <div style={{ ...styles.bodyText, marginTop: 16 }}>
        <p style={{ margin: '0 0 12px' }}>
          يعتمد برنامج <b style={{ color: brandCyan }}>Berard AIT</b> على مبدأ اللدونة العصبية —
          قدرة الدماغ الرائعة على إعادة تنظيم نفسه من خلال تكوين روابط عصبية جديدة.
        </p>
        <p style={{ margin: 0 }}>
          لتحفيز هذه التغييرات، يتطلب البرنامج
          <span style={{ color: brandPink, fontWeight: 700 }}> التعرض لنشاط سمعي بكثافة وتكرار ومدة </span>
          كافية لإحداث تغييرات في معالجة الدماغ للصوت.
        </p>
      </div>

      {/* Fact Cards */}
      <div style={{
        marginTop: 24,
        display: 'grid',
        gap: 14,
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
      }}>
        {brainFactCards.map((card, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(15,22,41,0.7)',
              border: `1px solid ${card.color}33`,
              borderRadius: 14,
              padding: 16,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${card.color}66`;
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 30px ${card.color}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${card.color}33`;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>{card.icon}</div>
            <div style={{ fontWeight: 800, color: card.color, marginBottom: 6 }}>{card.title}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
              {card.description}
            </div>
          </div>
        ))}
      </div>

      {/* How AIT Uses Neuroplasticity */}
      <div style={{
        marginTop: 24,
        padding: 20,
        background: `linear-gradient(135deg, rgba(176,18,112,0.1), rgba(143,211,204,0.1))`,
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <h3 style={{ ...styles.h3, marginTop: 0, color: brandPurple }}>
          كيف يستخدم Berard AIT اللدونة العصبية؟
        </h3>
        <ul style={{ margin: 0, paddingInlineStart: 18, lineHeight: 2, opacity: 0.92 }}>
          <li><b>الكثافة:</b> جلستان يومياً بموسيقى مُعدّلة خصيصاً</li>
          <li><b>التكرار:</b> 20 جلسة على مدار 10-12 يوماً</li>
          <li><b>المدة:</b> 30 دقيقة لكل جلسة مع فترات راحة للتكيف</li>
          <li><b>التحفيز:</b> ترددات صوتية متنوعة تحفز مناطق مختلفة من الدماغ</li>
        </ul>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a href="#overview" style={{ ...styles.primaryBtn, textDecoration: 'none' }}>
          تعرف على البرنامج
        </a>
        <a href="#results" style={{ ...styles.ghostBtn, textDecoration: 'none' }}>
          شاهد النتائج
        </a>
      </div>
    </section>
  );
}
