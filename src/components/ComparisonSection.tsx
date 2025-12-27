import { useState, useCallback, memo } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark, brandColors, spacing, radius, typography, colors } from './styles';
import { useLanguage } from '../context/LanguageContext';
import LabCard from './labui/LabCard';
import LabButtonAnchor from './labui/LabButtonAnchor';
import { renderLabIcon } from './icons/index';

type Program = {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  goal: string;
  goalEn: string;
  format: string;
  formatEn: string;
  duration: string;
  durationEn: string;
  notes: string;
  notesEn: string;
  color: string;
  highlight?: boolean;
};

const programs: Program[] = [
  {
    id: 'berard',
    name: 'Berard AIT',
    nameAr: 'بيرارد AIT',
    icon: '🎧',
    goal: 'تدريب سمعي مكثّف عبر موسيقى مُعدّلة لتحسين تحمل/انتباه الدماغ للأصوات',
    goalEn: 'Intensive auditory training using modulated music to improve the brain’s tolerance/attention to sound',
    format: 'بروتوكول جلسات متقاربة + متابعة قياسات حسب البرتوكول',
    formatEn: 'Close-session protocol + pre/post follow-up measures',
    duration: '10–12 يوماً',
    durationEn: '10–12 days',
    notes: 'يُستخدم كثيراً في بيئات تعليمية كجزء من خطة دعم. ليس بديلاً عن التشخيص الطبي.',
    notesEn: 'Often used in educational settings as part of a support plan. Not a substitute for medical diagnosis.',
    color: brandCyan,
    highlight: true,
  },
  {
    id: 'tomatis',
    name: 'Tomatis',
    nameAr: 'توماتيس',
    icon: '🎵',
    goal: 'تحفيز سمعي/حسي باستخدام معالجة صوتية وأساليب تدريب متعددة',
    goalEn: 'Auditory/sensory stimulation using sound processing and multiple training methods',
    format: 'جلسات/مراحل متعددة (قد تتضمن صوت/لغة/غناء)',
    formatEn: 'Multiple sessions/stages (may include sound, language, or singing)',
    duration: 'أسابيع/مراحل',
    durationEn: 'Weeks / stages',
    notes: 'قد يختلف البروتوكول بين المراكز. اسأل عن القياسات والخطة والمتابعة.',
    notesEn: 'Protocols may vary by center. Ask about measures, the plan, and follow-up.',
    color: brandPurple,
  },
  {
    id: 'ils',
    name: 'iLS',
    nameAr: 'iLS',
    icon: '🔊',
    goal: 'دمج الاستماع مع تمارين حسية/حركية لدعم التعلم والتنظيم',
    goalEn: 'Combines listening with sensory/motor exercises to support learning and regulation',
    format: 'جلسات في المركز أو برامج منزلية بإشراف مختص',
    formatEn: 'In-center sessions or home programs with specialist supervision',
    duration: 'أسابيع - أشهر',
    durationEn: 'Weeks to months',
    notes: 'غالباً يتضمن عناصر متعددة (حركة/انتباه/حسّي) بجانب الاستماع.',
    notesEn: 'Often includes multiple elements (movement, attention, sensory) alongside listening.',
    color: brandPink,
  },
  {
    id: 'ssp',
    name: 'SSP',
    nameAr: 'SSP',
    icon: '🛡️',
    goal: 'بروتوكول استماع مُفلتر موجه لتنظيم الاستجابة العصبية/التهدئة',
    goalEn: 'Filtered listening protocol aimed at regulating nervous system response / calming',
    format: 'جلسات استماع مُقسمة مع إرشادات تنظيمية',
    formatEn: 'Segmented listening sessions with regulation guidance',
    duration: 'أيام - أسابيع',
    durationEn: 'Days to weeks',
    notes: 'يُطبق وفق تدريب/اعتماد مُحدد. مناسب لبعض الأهداف وليس لكل الحالات.',
    notesEn: 'Requires specific training/certification. Suitable for certain goals, not all cases.',
    color: brandColors.success,
  },
  {
    id: 'generic',
    name: 'Listening Therapy',
    nameAr: 'العلاج بالاستماع',
    icon: '🎼',
    goal: 'استخدام موسيقى/أصوات (غير معيارية) للاسترخاء أو التركيز',
    goalEn: 'Using music/sounds (non-standardized) for relaxation or focus',
    format: 'متنوع وغير موحّد',
    formatEn: 'Varies and is not standardized',
    duration: 'حسب الاستخدام',
    durationEn: 'Depends on use',
    notes: 'قد يساعد في الاسترخاء، لكن لا يساوي بروتوكولاً علاجياً منظماً.',
    notesEn: 'May help with relaxation, but it is not a structured therapeutic protocol.',
    color: brandPurpleDark,
  },
];

const questions = [
  {
    icon: '📋',
    text: 'هل البرنامج موحّد ببروتوكول واضح أم يعتمد على اجتهادات عامة؟',
    textEn: 'Is the program standardized with a clear protocol, or based on general practices?',
  },
  {
    icon: '📊',
    text: 'هل توجد قياسات/متابعة (قبل/بعد) أو آلية توثيق للنتائج؟',
    textEn: 'Are there measurements/follow-up (pre/post) or a way to document outcomes?',
  },
  {
    icon: '🏫',
    text: 'هل هناك خطة دمج مع المدرسة (توصيات صفية/تدريب معلمين)؟',
    textEn: 'Is there a plan to integrate with school (classroom recommendations/teacher training)?',
  },
  {
    icon: '👨‍⚕️',
    text: 'هل يوجد مختص يقود الخطة (Clinical Director) ويتابع الجودة؟',
    textEn: 'Is there a specialist leading the plan (Clinical Director) and monitoring quality?',
  },
];

// Memoized ProgramCard with accessibility improvements
const ProgramCard = memo(function ProgramCard({
  program,
  isExpanded,
  onToggle,
  isArabic,
}: {
  program: Program;
  isExpanded: boolean;
  onToggle: () => void;
  isArabic: boolean;
}) {
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

  const panelId = `program-panel-${program.id}`;
  const headerId = `program-header-${program.id}`;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-controls={panelId}
      id={headerId}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      style={{
        background: program.highlight
          ? `linear-gradient(135deg, ${program.color}15, ${program.color}08)`
          : colors.surface.overlay,
        border: `2px solid ${program.highlight ? program.color : colors.border.subtle}`,
        borderRadius: radius.xl,
        padding: isExpanded ? spacing[5] : spacing[4],
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Highlight badge */}
      {program.highlight && (
        <div
          style={{
            position: 'absolute',
            top: spacing[3],
            left: spacing[3],
            background: program.color,
            color: '#000',
            fontSize: typography.size.xs,
            fontWeight: typography.weight.black,
            padding: `${spacing[1]}px ${spacing[2.5]}px`,
            borderRadius: radius.full,
          }}
        >
          {isArabic ? 'اختيارنا' : 'Our Pick'}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
          marginBottom: isExpanded ? spacing[4] : 0,
        }}
      >
        <div
          style={{
            width: spacing[12],
            height: spacing[12],
            borderRadius: radius.lg,
            background: `${program.color}20`,
            border: `1px solid ${program.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: typography.size['2xl'],
          }}
        >
          {renderLabIcon(program.icon, { size: 26, style: { color: program.color } })}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.weight.black,
              color: program.highlight ? program.color : colors.text.primary,
            }}
          >
            {isArabic ? program.nameAr : program.name}
          </div>
          {isArabic && (
            <div style={{ fontSize: typography.size.sm, color: colors.text.muted }}>
              {program.name}
            </div>
          )}
        </div>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.muted,
            fontSize: typography.size.sm,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
          aria-hidden="true"
        >
          ▼
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          style={{ animation: 'fadeIn 0.3s ease' }}
        >
          <div
            style={{
              display: 'grid',
              gap: spacing[3],
              marginTop: spacing[2],
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: radius.lg,
                padding: spacing[3],
              }}
            >
              <div
                style={{
                  fontSize: typography.size.xs,
                  color: program.color,
                  fontWeight: typography.weight.bold,
                  marginBottom: spacing[1],
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {renderLabIcon('🎯', { size: 14, tone: 'cyan' })}
                  <span>{isArabic ? 'الهدف' : 'Goal'}</span>
                </span>
              </div>
              <div
                style={{
                  fontSize: typography.size.sm,
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                {isArabic ? program.goal : program.goalEn}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[2.5] }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: radius.lg,
                  padding: spacing[3],
                }}
              >
                <div
                  style={{
                    fontSize: typography.size.xs,
                    color: program.color,
                    fontWeight: typography.weight.bold,
                    marginBottom: spacing[1],
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {renderLabIcon('⚙️', { size: 14, tone: 'muted' })}
                    <span>{isArabic ? 'التطبيق' : 'Format'}</span>
                  </span>
                </div>
                <div
                  style={{
                    fontSize: typography.size.sm,
                    color: colors.text.secondary,
                    lineHeight: typography.lineHeight.normal,
                  }}
                >
                  {isArabic ? program.format : program.formatEn}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: radius.lg,
                  padding: spacing[3],
                }}
              >
                <div
                  style={{
                    fontSize: typography.size.xs,
                    color: program.color,
                    fontWeight: typography.weight.bold,
                    marginBottom: spacing[1],
                  }}
                >
                  {isArabic ? '⏱️ المدة' : '⏱️ Duration'}
                </div>
                <div
                  style={{
                    fontSize: typography.size.sm,
                    color: colors.text.primary,
                    fontWeight: typography.weight.bold,
                  }}
                >
                  {isArabic ? program.duration : program.durationEn}
                </div>
              </div>
            </div>

            <div
              style={{
                background: `${program.color}10`,
                border: `1px solid ${program.color}30`,
                borderRadius: radius.lg,
                padding: spacing[3],
              }}
            >
              <div
                style={{
                  fontSize: typography.size.xs,
                  color: program.color,
                  fontWeight: typography.weight.bold,
                  marginBottom: spacing[1],
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {renderLabIcon('💡', { size: 14, tone: 'cyan' })}
                  <span>{isArabic ? 'ملاحظات' : 'Notes'}</span>
                </span>
              </div>
              <div
                style={{
                  fontSize: typography.size.sm,
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                {isArabic ? program.notes : program.notesEn}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
});
ProgramCard.displayName = 'ProgramCard';

// Memoized question item
const QuestionItem = memo(function QuestionItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing[2.5],
        padding: spacing[3],
        background: colors.surface.overlay,
        borderRadius: radius.lg,
        border: `1px solid ${colors.border.subtle}`,
      }}
    >
      <span style={{ fontSize: typography.size.lg }} aria-hidden="true">
        {renderLabIcon(icon, { size: 18, tone: 'cyan' })}
      </span>
      <span
        style={{
          fontSize: typography.size.sm,
          color: colors.text.secondary,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        {text}
      </span>
    </div>
  );
});
QuestionItem.displayName = 'QuestionItem';

const ComparisonSection = memo(function ComparisonSection() {
  const { isArabic } = useLanguage();
  const [expandedProgram, setExpandedProgram] = useState<string>('berard');

  // Memoized toggle handler
  const handleToggle = useCallback((programId: string) => {
    setExpandedProgram((prev) => (prev === programId ? '' : programId));
  }, []);

  return (
    <section id="comparison" aria-labelledby="comparison-title" style={{ scrollMarginTop: 92, marginBottom: spacing[5] }}>
      <LabCard variant="panel">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: spacing[8] }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2.5],
            padding: `${spacing[2.5]}px ${spacing[5]}px`,
            background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}15)`,
            borderRadius: radius.full,
            marginBottom: spacing[4],
          }}
        >
          <span style={{ fontSize: typography.size['2xl'] }} aria-hidden="true">
            {renderLabIcon('🧭', { size: 22, tone: 'cyan' })}
          </span>
          <span style={{ fontWeight: typography.weight.bold, color: brandCyan }}>
            {isArabic ? 'اختيار النهج المناسب' : 'Choosing the Right Approach'}
          </span>
        </div>

        <h2
          id="comparison-title"
          style={{
            ...styles.h2,
            background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {isArabic ? 'مقارنة برامج الاستماع العلاجي' : 'Therapeutic Listening Programs Comparison'}
        </h2>

        <p style={{ ...styles.bodyText, maxWidth: 600, margin: `${spacing[3]}px auto 0` }}>
          {isArabic
            ? 'مقارنة توعوية بين أشهر البرامج المستخدمة عالمياً لمساعدتك على طرح الأسئلة الصحيحة'
            : 'An awareness-focused comparison of common programs used worldwide to help you ask the right questions'}
        </p>
      </div>

      {/* Programs Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: spacing[4],
          marginBottom: spacing[8],
        }}
      >
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            isExpanded={expandedProgram === program.id}
            onToggle={() => handleToggle(program.id)}
            isArabic={isArabic}
          />
        ))}
      </div>

      {/* Questions to Ask */}
      <div
        style={{
          background: `linear-gradient(135deg, ${brandPurpleDark}15, ${brandPink}10)`,
          border: `1px solid ${brandPurpleDark}30`,
          borderRadius: radius['2xl'],
          padding: spacing[6],
          marginBottom: spacing[6],
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2.5],
            marginBottom: spacing[4],
          }}
        >
          <span style={{ fontSize: typography.size['2xl'] }} aria-hidden="true">
            {renderLabIcon('❓', { size: 22, tone: 'warning' })}
          </span>
          <h3
            style={{
              margin: 0,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.black,
              color: brandPurpleDark,
            }}
          >
            {isArabic ? 'أسئلة مهمة قبل اختيار أي برنامج' : 'Key Questions Before Choosing Any Program'}
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing[3],
          }}
        >
          {questions.map((q, i) => (
            <QuestionItem key={i} icon={q.icon} text={isArabic ? q.text : q.textEn} />
          ))}
        </div>
      </div>

      {/* Warning */}
      <div
        role="alert"
        style={{
          background: `${brandColors.warning}15`,
          border: `1px solid ${brandColors.warning}40`,
          borderRadius: radius.lg,
          padding: spacing[4],
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
          marginBottom: spacing[6],
        }}
      >
        <span style={{ fontSize: typography.size['2xl'] }} aria-hidden="true">
          {renderLabIcon('⚠️', { size: 22, tone: 'warning' })}
        </span>
        <span style={{ fontSize: typography.size.sm, color: colors.text.secondary }}>
          {isArabic
            ? 'هذه ليست توصية طبية. استشر مختصاً مؤهلاً لتحديد ما يلائم الحالة.'
            : 'This is not medical advice. Consult a qualified professional to determine what fits the case.'}
        </span>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: spacing[3], flexWrap: 'wrap', justifyContent: 'center' }}>
        <LabButtonAnchor
          href="#pptx"
          variant="primary"
          style={{
            background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
            padding: `${spacing[3.5]}px ${spacing[7]}px`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <span aria-hidden="true">{renderLabIcon('📊', { size: 16, tone: 'cyan' })}</span>
          {isArabic ? 'شاهد التفاصيل في الشرائح' : 'See Details in the Slides'}
        </LabButtonAnchor>
        <LabButtonAnchor
          href="#contact"
          variant="ghost"
          style={{
            borderColor: brandCyan,
            color: brandCyan,
            padding: `${spacing[3.5]}px ${spacing[7]}px`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <span aria-hidden="true">{renderLabIcon('💬', { size: 16, tone: 'cyan' })}</span>
          {isArabic ? 'اطلب استشارة' : 'Request a Consultation'}
        </LabButtonAnchor>
      </div>
      </LabCard>
    </section>
  );
});
ComparisonSection.displayName = 'ComparisonSection';

export default ComparisonSection;
