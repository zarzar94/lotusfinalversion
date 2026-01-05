import { useCallback, useEffect, useRef, useState, memo, type ReactNode } from 'react';

import { useLanguage } from '../context/LanguageContext';
import { ensureAudio, safeCloseAudio } from './games/audio';
import {
  CalendarIcon,
  CheckCircleIcon,
  ClipboardIcon,
  CoinsIcon,
  HeadphonesIcon,
  HelpIcon,
  HomeIcon,
  LaptopIcon,
  MessageIcon,
  MusicIcon,
  StethoscopeIcon,
  UsersIcon,
} from './icons';
import {
  styles,
  brandCyan,
  brandPink,
  brandPurple,
  brandPurpleDark,
  spacing,
  radius,
  typography,
  colors,
} from './styles';
import LabButtonAnchor from './labui/LabButtonAnchor';

type FAQItem = {
  question: string;
  answer: string;
  icon: ReactNode;
};

const faqsAr: FAQItem[] = [
  {
    question: 'ما هو تدريب التكامل السمعي بيرارد (Berard AIT)؟',
    answer: 'تدخل طوره الدكتور جاي بيرارد لتصحيح أو تحسين الاضطرابات في نظام الدماغ/الجسم التي تتداخل مع قدرة الفرد على معالجة المعلومات بشكل طبيعي. يعالج مشاكل المعالجة السمعية والتناقضات في إدراك الصوت التي قد تسهم في صعوبات التعلم، اضطراب نقص الانتباه، عسر القراءة، التوحد، واضطرابات المعالجة الحسية.',
    icon: <HeadphonesIcon size={24} color={brandCyan} />,
  },
  {
    question: 'ما تكلفة 10 ساعات من Berard AIT؟',
    answer: 'تختلف الأسعار حسب الموقع ونوع البرنامج (حضوري أو عن بُعد). تواصل معنا مباشرة للحصول على تفاصيل التكلفة والباقات المتاحة للأفراد والمدارس.',
    icon: <CoinsIcon size={24} color={brandPurple} />,
  },
  {
    question: 'من المرشح المناسب لـ Berard AIT؟',
    answer: 'البرنامج مفيد للأفراد الذين يسعون لتحسين التعلم، تطوير اللغة، المعالجة الحسية، التركيز، المعالجة السمعية، الذاكرة، مهارات القراءة والكتابة، حساسية السمع، والقدرات الموسيقية. كما يُستخدم لتحسين الأداء الأكاديمي، العلاقات الاجتماعية، التحدث أمام الجمهور، والمهارات التنظيمية والرياضية. الحد الأدنى للعمر 3 سنوات بدون حد أقصى.',
    icon: <UsersIcon size={24} color={brandPink} />,
  },
  {
    question: 'هل Berard AIT تدخل طبي؟',
    answer: 'لا. طريقة بيرارد ليست تدخلاً طبياً ولا تهدف لعلاج أو شفاء الأمراض. هي برنامج تدريب سمعي يدعم قدرة الدماغ على معالجة المعلومات السمعية.',
    icon: <StethoscopeIcon size={24} color={brandPurpleDark} />,
  },
  {
    question: 'هل Berard AIT يُعتبر علاجاً بالموسيقى؟',
    answer: 'لا. Berard AIT لا يُعتبر علاجاً بالموسيقى أو شكلاً من أشكاله. الأساليب والأهداف تختلف بشكل كبير عن تدريب العلاج بالموسيقى.',
    icon: <MusicIcon size={24} color={brandCyan} />,
  },
  {
    question: 'هل يمكن إجراء Berard AIT في المنزل؟',
    answer: 'نعم! برنامج Remote Berard AIT متاح الآن عبر التواصل المرئي عبر الإنترنت مع إشراف مباشر من الممارس المعتمد. هذا يتيح للعائلات الحصول على البرنامج من راحة منازلهم.',
    icon: <HomeIcon size={24} color={brandPurple} />,
  },
  {
    question: 'ماذا لو لم يستطع الشخص التعاون في اختبارات السمع؟',
    answer: 'يمكن المتابعة في التدريب بدون اختبارات سمعية للأشخاص غير القادرين على التعاون، وهذا يعني عدم استخدام فلاتر النطاق الضيق. الموسيقى المُعدّلة أثبتت فعاليتها حتى بدون هذه الفلاتر المحددة.',
    icon: <ClipboardIcon size={24} color={brandPink} />,
  },
  {
    question: 'كم عدد الجلسات المطلوبة؟',
    answer: 'البرنامج القياسي يتكون من 20 جلسة خلال 10-12 يوماً، بمعدل جلستين يومياً مدة كل منها 30 دقيقة، مع فاصل 3 ساعات بين الجلستين للسماح للدماغ بالتكيف.',
    icon: <CalendarIcon size={24} color={brandPurpleDark} />,
  },
];

const faqsEn: FAQItem[] = [
  {
    question: 'What is Berard Auditory Integration Training (Berard AIT)?',
    answer:
      'A program developed by Dr. Guy Bérard to improve disruptions in the brain/body system that can interfere with how a person processes information. It addresses auditory processing difficulties and sound-perception inconsistencies that may contribute to learning difficulties, ADHD, dyslexia, autism, and sensory processing disorders.',
    icon: <HeadphonesIcon size={24} color={brandCyan} />,
  },
  {
    question: 'How much do 10 hours of Berard AIT cost?',
    answer:
      'Pricing varies by location and program type (in-person or remote). Contact us for details and available packages for individuals and schools.',
    icon: <CoinsIcon size={24} color={brandPurple} />,
  },
  {
    question: 'Who is a suitable candidate for Berard AIT?',
    answer:
      'It can benefit individuals seeking improvements in learning, language development, sensory processing, attention, auditory processing, memory, reading and writing skills, sound sensitivity, and musical abilities. It is also used to support academic performance, social engagement, public speaking, organizational skills, and sports performance. Minimum age is 3 years with no upper age limit.',
    icon: <UsersIcon size={24} color={brandPink} />,
  },
  {
    question: 'Is Berard AIT a medical intervention?',
    answer:
      'No. Berard AIT is not a medical intervention and is not intended to treat or cure diseases. It is an auditory training program that supports the brain’s ability to process auditory information.',
    icon: <StethoscopeIcon size={24} color={brandPurpleDark} />,
  },
  {
    question: 'Is Berard AIT considered music therapy?',
    answer:
      'No. Berard AIT is not music therapy. Its methods and goals differ significantly from music therapy approaches.',
    icon: <MusicIcon size={24} color={brandCyan} />,
  },
  {
    question: 'Can Berard AIT be done at home?',
    answer:
      'Yes. Remote Berard AIT is available via online video sessions with direct supervision from a certified practitioner, allowing families to receive the program from home.',
    icon: <HomeIcon size={24} color={brandPurple} />,
  },
  {
    question: 'What if someone cannot cooperate with hearing tests?',
    answer:
      'Training can continue without hearing tests for those who cannot cooperate, which means narrow-band filters are not used. The modulated music has been shown to be effective even without these specific filters.',
    icon: <ClipboardIcon size={24} color={brandPink} />,
  },
  {
    question: 'How many sessions are required?',
    answer:
      'The standard program includes 20 sessions over 10–12 days: two sessions per day, 30 minutes each, with a 3-hour break between sessions to allow the brain to adapt.',
    icon: <CalendarIcon size={24} color={brandPurpleDark} />,
  },
];

// Memoized FAQ Item component
const FAQItemComponent = memo(function FAQItemComponent({
  faq,
  index,
  isOpen,
  isHovered,
  isMobile,
  onToggle,
  onMouseEnter,
  onMouseLeave,
}: {
  faq: FAQItem;
  index: number;
  isOpen: boolean;
  isHovered: boolean;
  isMobile: boolean;
  onToggle: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const panelId = `faq-panel-${index}`;
  const headerId = `faq-header-${index}`;
  const { isArabic } = useLanguage();

  // Handle keyboard interaction
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
    },
    [onToggle]
  );

  return (
    <div
      style={{
        background: isOpen
          ? `linear-gradient(135deg, ${brandCyan}12, ${brandPurple}12)`
          : isHovered
            ? colors.surface.input
            : colors.surface.overlay,
        border: `1px solid ${isOpen ? `${brandCyan}45` : isHovered ? colors.border.emphasis : colors.border.subtle}`,
        borderRadius: radius.xl,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: isHovered && !isOpen ? 'translateX(-4px)' : 'translateX(0)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        id={headerId}
        type="button"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={panelId}
        style={{
          width: '100%',
          padding: isMobile ? `${spacing[3]}px ${spacing[3.5]}px` : `${spacing[3.5]}px ${spacing[4.5]}px`,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? spacing[2.5] : spacing[3.5],
          textAlign: 'right',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: isOpen ? 'none' : 'grayscale(0.5)',
            transition: 'filter 0.3s ease, transform 0.3s ease',
            transform: isOpen ? 'scale(1.1)' : 'scale(1)',
          }}
          aria-hidden="true"
        >
          {faq.icon}
        </span>
        <span
          style={{
            flex: 1,
            fontWeight: typography.weight.extrabold,
            fontSize: isMobile ? typography.size.sm : typography.size.base,
            color: isOpen ? brandCyan : colors.text.primary,
            transition: 'color 0.3s ease',
            lineHeight: typography.lineHeight.normal,
          }}
        >
          {faq.question}
        </span>
        <span
          style={{
            fontSize: isMobile ? typography.size.md : typography.size.xl,
            color: isOpen ? brandCyan : colors.text.muted,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'all 0.3s ease',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
        style={{
          maxHeight: isOpen ? 400 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
        }}
      >
        <div
          style={{
            padding: isMobile ? `0 ${spacing[3.5]}px ${spacing[3.5]}px` : `0 ${spacing[5]}px ${spacing[4]}px`,
            paddingRight: isMobile ? spacing[11] : spacing[14.5],
            color: colors.text.secondary,
            lineHeight: typography.lineHeight.loose,
            fontSize: isMobile ? typography.size.sm : typography.size.sm,
          }}
        >
          {faq.answer}

          {/* Related action */}
          {index === 5 && (
            <a
              href="#remote"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[1.5],
                marginTop: spacing[3],
                padding: `${spacing[1.5]}px ${spacing[3]}px`,
                background: `${brandPurple}22`,
                border: `1px solid ${brandPurple}44`,
                borderRadius: radius.md,
                color: brandPurple,
                textDecoration: 'none',
                fontSize: typography.size.sm,
                fontWeight: typography.weight.bold,
              }}
            >
              <LaptopIcon size={14} /> {isArabic ? 'اعرف المزيد عن البرنامج عن بُعد' : 'Learn more about the remote program'}
            </a>
          )}
          {index === 2 && (
            <a
              href="#checklist"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[1.5],
                marginTop: spacing[3],
                padding: `${spacing[1.5]}px ${spacing[3]}px`,
                background: `${brandCyan}22`,
                border: `1px solid ${brandCyan}44`,
                borderRadius: radius.md,
                color: brandCyan,
                textDecoration: 'none',
                fontSize: typography.size.sm,
                fontWeight: typography.weight.bold,
              }}
            >
              <CheckCircleIcon size={14} /> {isArabic ? 'قم بتعبئة قائمة التحقق' : 'Fill out the checklist'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
});
FAQItemComponent.displayName = 'FAQItemComponent';

// Memoized quick navigation button
const QuickNavButton = memo(function QuickNavButton({
  icon,
  isActive,
  title,
  onClick,
}: {
  icon: ReactNode;
  isActive: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      title={title}
      style={{
        background: isActive ? `${brandCyan}22` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isActive ? `${brandCyan}44` : colors.border.subtle}`,
        borderRadius: radius.md,
        padding: `${spacing[1.5]}px ${spacing[2.5]}px`,
        cursor: 'pointer',
        fontSize: typography.size.md,
        transition: 'all 0.2s ease',
      }}
    >
      {icon}
    </button>
  );
});
QuickNavButton.displayName = 'QuickNavButton';

const FAQSection = memo(function FAQSection() {
  const { isArabic } = useLanguage();
  const faqs = isArabic ? faqsAr : faqsEn;
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

  const toggleFAQ = useCallback(
    (index: number) => {
      const isOpening = openIndex !== index;
      playToggleSound(isOpening);
      setOpenIndex(isOpening ? index : null);
    },
    [openIndex, playToggleSound]
  );

  // Memoized handlers for each item
  const handleMouseEnter = useCallback((index: number) => setHoveredIndex(index), []);
  const handleMouseLeave = useCallback(() => setHoveredIndex(null), []);

  return (
    <section id="faq" style={styles.sectionCard} aria-labelledby="faq-title">
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2
            id="faq-title"
            style={{ ...styles.h2, display: 'flex', alignItems: 'center', gap: spacing[2.5] }}
          >
            <HelpIcon size={28} color={brandCyan} /> {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <span
            style={{
              ...styles.chip,
              background: `${brandCyan}18`,
              borderColor: `${brandCyan}35`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[1.5],
            }}
          >
            <HelpIcon size={14} color={brandCyan} /> {isArabic ? 'إجابات سريعة' : 'Quick Answers'}
          </span>
        </div>
        <p style={styles.bodyText}>
          {isArabic
            ? 'إجابات على أكثر الأسئلة شيوعاً حول برنامج Berard AIT وكيفية الاستفادة منه.'
            : 'Answers to the most common questions about Berard AIT and how to benefit from it.'}
        </p>
      </div>

      {/* Quick Navigation */}
      <div
        style={{
          marginTop: spacing[4],
          display: 'flex',
          flexWrap: 'wrap',
          gap: spacing[2],
          justifyContent: 'center',
        }}
        role="tablist"
        aria-label={isArabic ? 'التنقل السريع إلى الأسئلة الشائعة' : 'Quick navigation to FAQ items'}
      >
        {faqs.map((faq, index) => (
          <QuickNavButton
            key={index}
            icon={faq.icon}
            isActive={openIndex === index}
            title={faq.question}
            onClick={() => toggleFAQ(index)}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: spacing[4],
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[2.5],
        }}
      >
        {faqs.map((faq, index) => (
          <FAQItemComponent
            key={index}
            faq={faq}
            index={index}
            isOpen={openIndex === index}
            isHovered={hoveredIndex === index}
            isMobile={isMobile}
            onToggle={() => toggleFAQ(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: spacing[5],
          padding: spacing[4],
          background: `linear-gradient(135deg, ${brandPurple}15, ${brandPink}15)`,
          border: `1px solid ${brandPurple}30`,
          borderRadius: radius.xl,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3.5],
          flexWrap: 'wrap',
        }}
      >
        <MessageIcon size={28} color={brandPurple} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: typography.weight.extrabold, color: brandPurple }}>
            {isArabic ? 'لديك سؤال آخر؟' : 'Have another question?'}
          </div>
          <div style={{ ...styles.muted, marginTop: spacing[1] }}>
            {isArabic ? 'تواصل معنا وسنرد عليك في أقرب وقت' : 'Contact us and we’ll get back to you soon.'}
          </div>
        </div>
        <LabButtonAnchor href="#contact" variant="primary">
          {isArabic ? 'تواصل معنا' : 'Contact Us'}
        </LabButtonAnchor>
      </div>
    </section>
  );
});
FAQSection.displayName = 'FAQSection';

export default FAQSection;
