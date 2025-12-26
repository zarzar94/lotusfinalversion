import { styles, brandCyan, brandPink, brandPurple } from '../styles';
import LabButtonAnchor from '../labui/LabButtonAnchor';

const milestones = [
  { year: '2022', title: 'الإطلاق', desc: 'تأسيس مختبر الصوت وتطوير أول بروتوكول عربي ثنائي اللغة.' },
  { year: '2023', title: '1000+ جلسة', desc: 'توسعة الشراكات مع المدارس وإضافة وحدة التقييم الافتراضي.' },
  { year: '2024', title: 'تحليلات متقدمة', desc: 'لوحة تحليلات معززة بالذكاء الاصطناعي وتوليد تقارير PDF.' },
];

const team = [
  { name: 'د. ليلى', role: 'أخصائية سمعيات', focus: 'التقييم والبرنامج العلاجي' },
  { name: 'م. ريان', role: 'تقني صوتيات', focus: 'معايرة الأجهزة والمحاكاة' },
  { name: 'سارة', role: 'نجاح العملاء', focus: 'التواصل مع أولياء الأمور' },
];

const AboutUsSection = () => (
  <section style={{ ...styles.sectionCard, display: 'grid', gap: 16 }}>
    <div style={styles.sectionHeader}>
      <div style={styles.sectionHeaderRow}>
        <h2 style={styles.h2}>عن مختبر الصوت</h2>
        <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.14)' }}>ثنائي اللغة</span>
      </div>
      <p style={styles.bodyText}>
        رؤيتنا: دمج التقنيات السمعية المتقدمة مع دعم مدرسي وبيتي لبناء تجربة علاجية مستقبلية. تصميم مستوحى من المختبرات الطبية.
      </p>
    </div>

    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      <div style={{ ...styles.section, minHeight: 180 }}>
        <div style={styles.sectionHeaderRow}>
          <span style={styles.kicker}>إحصائيات</span>
          <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.05)' }}>مؤشرات</span>
        </div>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
          {[{ label: 'جلسات', value: '2,400+' }, { label: 'أطفال', value: '480' }, { label: 'مدارس', value: '32' }, { label: 'دقة توصية', value: '92%' }].map((stat) => (
            <div key={stat.label} style={{ ...styles.section, padding: 12 }}>
              <div style={{ ...styles.kicker, opacity: 0.8 }}>{stat.label}</div>
              <div style={{ ...styles.h3, margin: '4px 0' }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...styles.section, minHeight: 180 }}>
        <div style={styles.sectionHeaderRow}>
          <span style={styles.kicker}>القيم الأساسية</span>
          <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.12)', color: brandPink }}>قيم</span>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {['سلامة طبية', 'تصميم بشري', 'تعلم مستمر', 'دقة تحليلية'].map((value) => (
            <div key={value} style={{ ...styles.section, padding: 10 }}>
              {value}
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...styles.section, minHeight: 180 }}>
        <div style={styles.sectionHeaderRow}>
          <span style={styles.kicker}>الفريق</span>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)' }}>مختصون</span>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {team.map((member) => (
            <div key={member.name} style={{ ...styles.section, padding: 10 }}>
              <div style={{ ...styles.h3, margin: 0 }}>{member.name}</div>
              <div style={styles.bodyText}>{member.role}</div>
              <div style={{ ...styles.kicker, color: brandCyan }}>{member.focus}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...styles.section, minHeight: 180 }}>
        <div style={styles.sectionHeaderRow}>
          <span style={styles.kicker}>الخط الزمني</span>
          <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.05)' }}>3 مراحل</span>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {milestones.map((item) => (
            <div key={item.year} style={{ ...styles.section, padding: 10, borderLeft: `3px solid ${brandPurple}` }}>
              <div style={{ ...styles.h3, margin: 0 }}>{item.year}</div>
              <div style={styles.bodyText}>{item.title}</div>
              <div style={{ ...styles.kicker, opacity: 0.8 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div style={{ ...styles.section, display: 'grid', gap: 10 }}>
      <div style={styles.sectionHeaderRow}>
        <div>
          <div style={{ ...styles.h3, margin: 0 }}>الرسالة والرؤية</div>
          <div style={{ ...styles.kicker, opacity: 0.8 }}>مستقبل مختبر صوت مدعوم بالذكاء الاصطناعي</div>
        </div>
        <LabButtonAnchor href="#contact" variant="primary">
          تواصل الآن
        </LabButtonAnchor>
      </div>
      <p style={styles.bodyText}>
        نصمم تجارب علاجية بصرية وسمعية متكاملة، مع دعم لغوي عربي/إنجليزي وتوافق كامل مع اتجاه الكتابة RTL.
      </p>
    </div>
  </section>
);

export default AboutUsSection;
