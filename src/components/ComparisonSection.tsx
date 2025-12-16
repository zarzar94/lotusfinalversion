import { styles, brandCyan, brandPink, brandPurpleDark } from './styles';

type Row = {
  name: string;
  goal: string;
  format: string;
  duration: string;
  notes: string;
};

const rows: Row[] = [
  {
    name: 'Berard AIT',
    goal: 'تدريب سمعي مكثّف عبر موسيقى مُعدّلة لتحسين تحمل/انتباه الدماغ للأصوات',
    format: 'بروتوكول جلسات متقاربة + متابعة قياسات حسب البرتوكول',
    duration: '10–12 يوماً (غالباً)',
    notes: 'يُستخدم كثيراً في بيئات تعليمية كجزء من خطة دعم. ليس بديلاً عن التشخيص الطبي.',
  },
  {
    name: 'Tomatis',
    goal: 'تحفيز سمعي/حسي باستخدام معالجة صوتية وأساليب تدريب متعددة',
    format: 'جلسات/مراحل متعددة (قد تتضمن صوت/لغة/غناء)',
    duration: 'أطول عادةً (أسابيع/مراحل)',
    notes: 'قد يختلف البروتوكول بين المراكز. اسأل عن القياسات والخطة والمتابعة.',
  },
  {
    name: 'iLS (Integrated Listening Systems)',
    goal: 'دمج الاستماع مع تمارين حسية/حركية لدعم التعلم والتنظيم',
    format: 'جلسات في المركز أو برامج منزلية بإشراف مختص',
    duration: 'أسابيع إلى أشهر حسب الخطة',
    notes: 'غالباً يتضمن عناصر متعددة (حركة/انتباه/حسّي) بجانب الاستماع.',
  },
  {
    name: 'SSP (Safe and Sound Protocol)',
    goal: 'بروتوكول استماع مُفلتر موجه لتنظيم الاستجابة العصبية/التهدئة لدى بعض الأفراد',
    format: 'جلسات استماع مُقسمة مع إرشادات تنظيمية',
    duration: 'عدة ساعات موزعة على أيام/أسابيع',
    notes: 'يُطبق وفق تدريب/اعتماد مُحدد في بعض الجهات. مناسب لبعض الأهداف وليس لكل الحالات.',
  },
  {
    name: 'Listening Therapy (Generic)',
    goal: 'استخدام موسيقى/أصوات (غير معيارية) للاسترخاء أو التركيز',
    format: 'متنوع وغير موحّد',
    duration: 'حسب الاستخدام',
    notes: 'قد يساعد في الاسترخاء، لكن لا يساوي بروتوكولاً علاجياً منظماً.',
  },
];

const ComparisonSection = () => {
  return (
    <section id="comparison" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>مقارنة سريعة بين AIT والبدائل</h2>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)', borderColor: 'rgba(143,211,204,0.25)' }}>
            🧭 اختيار النهج المناسب
          </span>
        </div>
        <p style={styles.bodyText}>
          هذه مقارنة توعوية عالية المستوى بين أشهر برامج الاستماع المستخدمة عالمياً (قد تختلف التفاصيل حسب الدولة/المركز).
          الهدف هو مساعدة أولياء الأمور والمدارس على طرح الأسئلة الصحيحة قبل اختيار البرنامج.
        </p>
        <p style={styles.muted}>⚠️ هذه ليست توصية طبية. استشر مختصاً مؤهلاً لتحديد ما يلائم الحالة.</p>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>النهج</th>
              <th style={styles.th}>الهدف</th>
              <th style={styles.th}>طريقة التطبيق</th>
              <th style={styles.th}>المدة الشائعة</th>
              <th style={styles.th}>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td style={{ ...styles.td, fontWeight: 900, color: r.name === 'Berard AIT' ? brandCyan : 'rgba(247,248,251,0.92)' }}>
                  {r.name}
                </td>
                <td style={styles.td}>{r.goal}</td>
                <td style={styles.td}>{r.format}</td>
                <td style={styles.td}>{r.duration}</td>
                <td style={styles.td}>{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 14, ...styles.section, marginBottom: 0 }}>
        <div style={{ fontWeight: 900, color: brandPurpleDark }}>أسئلة سريعة قبل اختيار أي برنامج:</div>
        <ul style={{ margin: 0, marginTop: 8, paddingInlineStart: 18, lineHeight: 1.85, opacity: 0.92 }}>
          <li>هل البرنامج <b>موحّد</b> ببروتوكول واضح أم يعتمد على اجتهادات عامة؟</li>
          <li>هل توجد <b>قياسات/متابعة</b> (قبل/بعد) أو آلية توثيق للنتائج؟</li>
          <li>هل هناك خطة دمج مع المدرسة (توصيات صفية/تدريب معلمين)؟</li>
          <li>هل يوجد مختص يقود الخطة (Clinical Director) ويتابع الجودة؟</li>
        </ul>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
          <a href="#pptx" style={{ ...styles.primaryBtn, textDecoration: 'none', background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}>
            شاهد التفاصيل في الشرائح
          </a>
          <a href="#contact" style={{ ...styles.ghostBtn, textDecoration: 'none', borderColor: 'rgba(143,211,204,0.25)' }}>
            اطلب استشارة / عرض
          </a>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
