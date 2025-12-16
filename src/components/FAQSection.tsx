import { useState } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';

type FAQItem = {
  question: string;
  answer: string;
  icon: string;
};

const faqs: FAQItem[] = [
  {
    question: 'ما هو تدريب التكامل السمعي بيرارد (Berard AIT)؟',
    answer: 'تدخل طوره الدكتور جاي بيرارد لتصحيح أو تحسين الاضطرابات في نظام الدماغ/الجسم التي تتداخل مع قدرة الفرد على معالجة المعلومات بشكل طبيعي. يعالج مشاكل المعالجة السمعية والتناقضات في إدراك الصوت التي قد تسهم في صعوبات التعلم، اضطراب نقص الانتباه، عسر القراءة، التوحد، واضطرابات المعالجة الحسية.',
    icon: '🎧',
  },
  {
    question: 'ما تكلفة 10 ساعات من Berard AIT؟',
    answer: 'تختلف الأسعار حسب الموقع ونوع البرنامج (حضوري أو عن بُعد). تواصل معنا مباشرة للحصول على تفاصيل التكلفة والباقات المتاحة للأفراد والمدارس.',
    icon: '💰',
  },
  {
    question: 'من المرشح المناسب لـ Berard AIT؟',
    answer: 'البرنامج مفيد للأفراد الذين يسعون لتحسين التعلم، تطوير اللغة، المعالجة الحسية، التركيز، المعالجة السمعية، الذاكرة، مهارات القراءة والكتابة، حساسية السمع، والقدرات الموسيقية. كما يُستخدم لتحسين الأداء الأكاديمي، العلاقات الاجتماعية، التحدث أمام الجمهور، والمهارات التنظيمية والرياضية. الحد الأدنى للعمر 3 سنوات بدون حد أقصى.',
    icon: '👥',
  },
  {
    question: 'هل Berard AIT تدخل طبي؟',
    answer: 'لا. طريقة بيرارد ليست تدخلاً طبياً ولا تهدف لعلاج أو شفاء الأمراض. هي برنامج تدريب سمعي يدعم قدرة الدماغ على معالجة المعلومات السمعية.',
    icon: '⚕️',
  },
  {
    question: 'هل Berard AIT يُعتبر علاجاً بالموسيقى؟',
    answer: 'لا. Berard AIT لا يُعتبر علاجاً بالموسيقى أو شكلاً من أشكاله. الأساليب والأهداف تختلف بشكل كبير عن تدريب العلاج بالموسيقى.',
    icon: '🎵',
  },
  {
    question: 'هل يمكن إجراء Berard AIT في المنزل؟',
    answer: 'نعم! برنامج Remote Berard AIT متاح الآن عبر التواصل المرئي عبر الإنترنت مع إشراف مباشر من الممارس المعتمد. هذا يتيح للعائلات الحصول على البرنامج من راحة منازلهم.',
    icon: '🏠',
  },
  {
    question: 'ماذا لو لم يستطع الشخص التعاون في اختبارات السمع؟',
    answer: 'يمكن المتابعة في التدريب بدون اختبارات سمعية للأشخاص غير القادرين على التعاون، وهذا يعني عدم استخدام فلاتر النطاق الضيق. الموسيقى المُعدّلة أثبتت فعاليتها حتى بدون هذه الفلاتر المحددة.',
    icon: '📋',
  },
  {
    question: 'كم عدد الجلسات المطلوبة؟',
    answer: 'البرنامج القياسي يتكون من 20 جلسة خلال 10-12 يوماً، بمعدل جلستين يومياً مدة كل منها 30 دقيقة، مع فاصل 3 ساعات بين الجلستين للسماح للدماغ بالتكيف.',
    icon: '📅',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>الأسئلة الشائعة</h2>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)', borderColor: 'rgba(143,211,204,0.25)' }}>
            ❓ إجابات سريعة
          </span>
        </div>
        <p style={styles.bodyText}>
          إجابات على أكثر الأسئلة شيوعاً حول برنامج Berard AIT وكيفية الاستفادة منه.
        </p>
      </div>

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              background: openIndex === index
                ? `linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.08))`
                : 'rgba(15,22,41,0.6)',
              border: `1px solid ${openIndex === index ? 'rgba(143,211,204,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
          >
            <button
              type="button"
              onClick={() => toggleFAQ(index)}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                textAlign: 'right',
              }}
            >
              <span style={{
                fontSize: 24,
                filter: openIndex === index ? 'none' : 'grayscale(0.5)',
                transition: 'filter 0.3s ease',
              }}>
                {faq.icon}
              </span>
              <span style={{
                flex: 1,
                fontWeight: 800,
                fontSize: 15,
                color: openIndex === index ? brandCyan : '#f7f8fb',
                transition: 'color 0.3s ease',
              }}>
                {faq.question}
              </span>
              <span style={{
                fontSize: 20,
                color: openIndex === index ? brandCyan : 'rgba(255,255,255,0.5)',
                transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'all 0.3s ease',
              }}>
                ▼
              </span>
            </button>

            <div style={{
              maxHeight: openIndex === index ? 300 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.4s ease',
            }}>
              <div style={{
                padding: '0 20px 16px',
                paddingRight: 58,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.8,
                fontSize: 14,
              }}>
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 20,
        padding: 16,
        background: `linear-gradient(135deg, rgba(175,132,186,0.1), rgba(176,18,112,0.1))`,
        border: '1px solid rgba(175,132,186,0.2)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 28 }}>💬</span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 800, color: brandPurple }}>لديك سؤال آخر؟</div>
          <div style={{ ...styles.muted, marginTop: 4 }}>تواصل معنا وسنرد عليك في أقرب وقت</div>
        </div>
        <a href="#contact" style={{ ...styles.primaryBtn, textDecoration: 'none' }}>
          تواصل معنا
        </a>
      </div>
    </section>
  );
}
