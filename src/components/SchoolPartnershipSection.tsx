import { styles, brandCyan, brandPink, brandPurpleDark } from './styles';

type Tier = {
  name: string;
  subtitle: string;
  bullets: string[];
  badge: string;
};

const tiers: Tier[] = [
  {
    name: 'باقة منخفضة التكلفة (Pilot)',
    subtitle: 'مناسبة للتجربة داخل المدرسة',
    badge: 'LOW',
    bullets: [
      'عرض توعوي للطاقم + تعريف سريع بـ AIT',
      'تجربة "محاكاة الصف الدراسي" (Classroom Simulation) كديمو',
      'تقرير PDF/CSV تجريبي من نتائج المحاكاة — بدون بيانات شخصية',
      'خلاصة توصيات صفية عملية (Sound Hygiene + Seating + Instructions)'
    ],
  },
  {
    name: 'باقة متوسطة (School Partnership)',
    subtitle: 'الأكثر شيوعاً للمدارس',
    badge: 'MID',
    bullets: [
      'يوم Demo داخل المدرسة + تدريب مُختصر للمعلمين',
      'تقارير توضيحية للمدرسة + قوالب تواصل مع أولياء الأمور',
      'مقابلات/توجيه لحالات مختارة (غير تشخيصي)',
      'تجهيز صفحة هبوط (Landing) للمدرسة داخل الموقع'
    ],
  },
  {
    name: 'باقة عالية (Enterprise / Universities)',
    subtitle: 'للشبكات التعليمية والجامعات',
    badge: 'HIGH',
    bullets: [
      'برنامج متعدد المدارس + لوحة متابعة (Dashboard) ببيانات مُجمعة',
      'تدريب متقدم + ورش للمرشدين والأخصائيين',
      'Integration Kit: سياسات صفية + بروتوكولات دعم سمعي',
      'خطة محتوى وتسويق مشتركة + تقارير شهرية'
    ],
  },
];

const SchoolPartnershipSection = () => {
  return (
    <section id="schools" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>شراكات المدارس والجامعات</h2>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)', borderColor: 'rgba(143,211,204,0.25)' }}>
            🏫 UAE Education Focus
          </span>
        </div>
        <p style={styles.bodyText}>
          صُممت هذه الصفحة لتسهيل تقديم Berard AIT داخل بيئات التعليم في أبوظبي والإمارات — عبر تجربة تفاعلية (محاكاة الصف)
          وتقارير توضيحية تساعد الإدارة والمرشدين والأخصائيين على فهم أثر الضوضاء السمعية على الانتباه.
        </p>
        <p style={styles.muted}>
          ✅ التقارير المستخدمة في الديمو تُصدر <b>بدون أسماء</b> وبصيغة مناسبة للعرض التقديمي.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <div style={styles.section}>
          <h3 style={{ ...styles.h3, marginTop: 0 }}>ما الذي تحصل عليه المدرسة؟</h3>
          <ul style={{ margin: 0, paddingInlineStart: 18, lineHeight: 1.85, opacity: 0.92 }}>
            <li>Demo تفاعلي: محاكاة صف مع ضوضاء متدرجة + تعليمات.</li>
            <li>تقرير PDF/CSV تلقائي (للإدارة) يوضح مستوى الانتباه مع الضوضاء.</li>
            <li>Workshop عملي للمعلمين: إدارة الضوضاء + لغة التعليمات + استراتيجيات دعم.</li>
            <li>قوالب جاهزة للتواصل مع أولياء الأمور + إحالات منظمة.</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={{ ...styles.h3, marginTop: 0 }}>مناسب لـ</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={styles.chip}>المدارس</span>
            <span style={styles.chip}>الجامعات</span>
            <span style={styles.chip}>مراكز الدعم التعليمي</span>
            <span style={{ ...styles.chip, background: 'rgba(175,132,186,0.12)', borderColor: 'rgba(175,132,186,0.25)' }}>Learning Support</span>
            <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.12)', borderColor: 'rgba(176,18,112,0.25)' }}>SEN / Inclusion</span>
          </div>

          <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: brandCyan }}>جرّب الديمو الآن</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>
              ادخل إلى قسم الألعاب → اختر "محاكاة الصف الدراسي" → بعد النهاية قم بتنزيل التقرير.
            </p>
            <a href="#games" style={{ ...styles.primaryBtn, textDecoration: 'none', marginTop: 10, display: 'inline-flex' }}>
              تشغيل محاكاة الصف
            </a>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={{ ...styles.h3, marginTop: 0 }}>لماذا هذا "متقدم"؟</h3>
          <ul style={{ margin: 0, paddingInlineStart: 18, lineHeight: 1.85, opacity: 0.92 }}>
            <li>تجربة سمعية/تفاعلية تحاكي الواقع بدلاً من نصوص نظرية.</li>
            <li>تقرير فوري جاهز للعرض على الإدارة/الآباء.</li>
            <li>ربط النتائج بخيارات واضحة: تقييم فردي أو شراكة مدرسة.</li>
            <li>تصميم عربي أولاً + مناسب للجوال.</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {tiers.map((t) => (
          <div key={t.name} style={{ ...styles.sectionCard, marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16 }}>{t.name}</div>
                <div style={styles.muted}>{t.subtitle}</div>
              </div>
              <span
                style={{
                  ...styles.chip,
                  background:
                    t.badge === 'HIGH'
                      ? 'rgba(176,18,112,0.14)'
                      : t.badge === 'MID'
                        ? 'rgba(175,132,186,0.14)'
                        : 'rgba(143,211,204,0.14)',
                  borderColor:
                    t.badge === 'HIGH'
                      ? 'rgba(176,18,112,0.25)'
                      : t.badge === 'MID'
                        ? 'rgba(175,132,186,0.25)'
                        : 'rgba(143,211,204,0.25)',
                }}
              >
                {t.badge}
              </span>
            </div>

            <ul style={{ margin: 0, marginTop: 10, paddingInlineStart: 18, lineHeight: 1.85, opacity: 0.92 }}>
              {t.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <a
                href="#contact"
                style={{
                  ...styles.primaryBtn,
                  textDecoration: 'none',
                  background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})`,
                }}
              >
                اطلب عرض سعر
              </a>
              <a href="#comparison" style={{ ...styles.ghostBtn, textDecoration: 'none', borderColor: 'rgba(143,211,204,0.25)' }}>
                مقارنة البرامج
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, ...styles.section, marginBottom: 0 }}>
        <div style={{ fontWeight: 900, color: brandPurpleDark }}>ملاحظة مهمة للمدارس</div>
        <p style={{ ...styles.muted, marginTop: 6 }}>
          يمكن تخصيص اللغة والمحتوى (الشعار/اسم المدرسة) داخل التقرير التوضيحي. كما يمكن جعل النتائج مُجمعة على مستوى الصف/المدرسة.
        </p>
      </div>
    </section>
  );
};

export default SchoolPartnershipSection;
