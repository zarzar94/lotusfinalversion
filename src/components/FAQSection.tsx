import { useState, useEffect, useCallback, useRef } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';
import { ensureAudio, safeCloseAudio } from './games/audio';

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
  const audioRef = useRef<AudioContext | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    return () => {
      void safeCloseAudio(audioRef);
    };
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const playToggleSound = useCallback((open: boolean) => {
    try {
      const audio = ensureAudio(audioRef);
      if (audio.state === 'suspended') void audio.resume().catch(() => {});

      const osc = audio.createOscillator();
      const gain = audio.createGain();
      const now = audio.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(open ? 600 : 400, now);
      osc.frequency.exponentialRampToValueAtTime(open ? 800 : 300, now + 0.08);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(audio.destination);

      osc.start(now);
      osc.stop(now + 0.13);
      osc.onended = () => {
        try {
          osc.disconnect();
        } catch {
          // ignore
        }
        try {
          gain.disconnect();
        } catch {
          // ignore
        }
      };
    } catch {
      // Audio unavailable
    }
  }, []);

  const toggleFAQ = useCallback((index: number) => {
    const isOpening = openIndex !== index;
    playToggleSound(isOpening);
    setOpenIndex(isOpening ? index : null);
  }, [openIndex, playToggleSound]);

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

      {/* Quick Navigation */}
      <div style={{
        marginTop: 16,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
      }}>
        {faqs.map((faq, index) => (
          <button
            key={index}
            type="button"
            onClick={() => toggleFAQ(index)}
            style={{
              background: openIndex === index ? brandCyan + '22' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${openIndex === index ? brandCyan + '44' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: 16,
              transition: 'all 0.2s ease',
            }}
            title={faq.question}
          >
            {faq.icon}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              background: openIndex === index
                ? `linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.08))`
                : hoveredIndex === index
                  ? 'rgba(15,22,41,0.8)'
                  : 'rgba(15,22,41,0.6)',
              border: `1px solid ${openIndex === index ? 'rgba(143,211,204,0.3)' : hoveredIndex === index ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 14,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              transform: hoveredIndex === index && openIndex !== index ? 'translateX(-4px)' : 'translateX(0)',
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <button
              type="button"
              onClick={() => toggleFAQ(index)}
              style={{
                width: '100%',
                padding: isMobile ? '12px 14px' : '14px 18px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? 10 : 14,
                textAlign: 'right',
              }}
            >
              <span style={{
                fontSize: isMobile ? 20 : 24,
                filter: openIndex === index ? 'none' : 'grayscale(0.5)',
                transition: 'filter 0.3s ease, transform 0.3s ease',
                transform: openIndex === index ? 'scale(1.1)' : 'scale(1)',
              }}>
                {faq.icon}
              </span>
              <span style={{
                flex: 1,
                fontWeight: 800,
                fontSize: isMobile ? 13 : 15,
                color: openIndex === index ? brandCyan : '#f7f8fb',
                transition: 'color 0.3s ease',
                lineHeight: 1.5,
              }}>
                {faq.question}
              </span>
              <span style={{
                fontSize: isMobile ? 16 : 20,
                color: openIndex === index ? brandCyan : 'rgba(255,255,255,0.5)',
                transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}>
                ▼
              </span>
            </button>

            <div style={{
              maxHeight: openIndex === index ? 400 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.4s ease',
            }}>
              <div style={{
                padding: isMobile ? '0 14px 14px' : '0 20px 16px',
                paddingRight: isMobile ? 44 : 58,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.8,
                fontSize: isMobile ? 13 : 14,
              }}>
                {faq.answer}

                {/* Related action */}
                {index === 5 && ( // Remote protocol question
                  <a href="#remote" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 12,
                    padding: '6px 12px',
                    background: brandPurple + '22',
                    border: `1px solid ${brandPurple}44`,
                    borderRadius: 8,
                    color: brandPurple,
                    textDecoration: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                  }}>
                    💻 اعرف المزيد عن البرنامج عن بُعد
                  </a>
                )}
                {index === 2 && ( // Who is it for question
                  <a href="#checklist" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 12,
                    padding: '6px 12px',
                    background: brandCyan + '22',
                    border: `1px solid ${brandCyan}44`,
                    borderRadius: 8,
                    color: brandCyan,
                    textDecoration: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                  }}>
                    ✅ قم بتعبئة قائمة التحقق
                  </a>
                )}
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
