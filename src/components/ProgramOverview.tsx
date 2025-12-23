import { styles, brandCyan, brandPink, brandPurpleDark } from './styles';

const ProgramOverview = () => {
  return (
    <section id="overview" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>نظرة سريعة على البرنامج</h2>
          <span style={styles.chip}>🧠 موسيقى + دماغ</span>
        </div>

        <p style={styles.bodyText}>
          برنامج <b>Berard Auditory Integration Training (AIT)</b> هو بروتوكول مكثّف يعتمد على الاستماع لموسيقى مُعدّلة عبر سماعات،
          بهدف دعم معالجة الدماغ للمعلومات السمعية في بيئات مليئة بالأصوات (مثل الصف الدراسي).
        </p>
        <p style={styles.muted}>
          ⚠️ المحتوى هنا توعوي/تعريفي وليس بديلاً عن التقييم الطبي. النتائج تختلف من شخص لآخر.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <div style={styles.section}>
          <h3 style={{ ...styles.h3, marginTop: 0 }}>كيف يعمل البرنامج؟</h3>
          <ul style={{ margin: 0, paddingInlineStart: 18, lineHeight: 1.8, opacity: 0.92 }}>
            <li><b>20 جلسة</b> خلال <b>10–12 يوماً</b>.</li>
            <li>مدة الجلسة عادةً <b>30 دقيقة</b>، بمعدل جلستين يومياً.</li>
            <li>فاصل زمني بين الجلستين (عادةً <b>3 ساعات</b>) لدعم التكيّف.</li>
            <li>قياس/اختبار سمعي دوري (قبل/أثناء/بعد) حسب البروتوكول المتبع.</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={{ ...styles.h3, marginTop: 0 }}>لمن مناسب؟</h3>
          <p style={styles.bodyText}>
            قد يكون مفيداً كجزء من خطة دعم أشمل للأفراد الذين لديهم تحديات في الانتباه السمعي أو الحساسية للأصوات أو صعوبات تعلم مرتبطة بالسمع.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)', borderColor: 'rgba(143,211,204,0.25)' }}>APD/CAPD</span>
            <span style={{ ...styles.chip, background: 'rgba(175,132,186,0.12)', borderColor: 'rgba(175,132,186,0.25)' }}>فرط الحساسية</span>
            <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.12)', borderColor: 'rgba(176,18,112,0.25)' }}>انتباه/تركيز</span>
            <span style={styles.chip}>صعوبات تعلم</span>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={{ ...styles.h3, marginTop: 0 }}>لماذا المدارس والجامعات؟</h3>
          <p style={styles.bodyText}>
            لأن بيئة الصف والجامعة مليئة بالأصوات والتشتت. نقدم للمدارس عروضاً تجريبية وتدريباً للمعلمين وتقريراً توضيحياً (غير تشخيصي)
            يساعد في بناء خطة دعم للطلاب.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
            <a href="/assessment#games" style={{ ...styles.primaryBtn, textDecoration: 'none' }}>ابدأ التجربة التفاعلية</a>
            <a href="/partners#schools" style={{ ...styles.ghostBtn, textDecoration: 'none' }}>شراكات المدارس</a>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a href="/results#results" style={{ ...styles.primaryBtn, textDecoration: 'none', background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}>
          شاهد أمثلة نتائج (قبل/بعد)
        </a>
        <a href="/assessment#checklist" style={{ ...styles.ghostBtn, textDecoration: 'none', borderColor: 'rgba(143,211,204,0.25)' }}>
          ابدأ بقائمة التحقق
        </a>
        <a href="/contact#contact" style={{ ...styles.ghostBtn, textDecoration: 'none', color: brandCyan }}>
          احجز / تواصل الآن
        </a>
      </div>
    </section>
  );
};

export default ProgramOverview;
