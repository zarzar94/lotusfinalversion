import { useState, useCallback, memo } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark, brandColors, spacing, radius, typography, colors } from './styles';

type Program = {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  goal: string;
  format: string;
  duration: string;
  notes: string;
  color: string;
  highlight?: boolean;
};

const programs: Program[] = [
  {
    id: 'berard',
    name: 'Berard AIT',
    nameAr: 'auto.ComparisonSection.k1',
    icon: '🎧',
    goal: 'تدريب سمعي مكثّف عبر موسيقى مُعدّلة لتحسين تحمل/انتباه الدماغ للأصوات',
    format: 'بروتوكول جلسات متقاربة + متابعة قياسات حسب البرتوكول',
    duration: '10–12 يوماً',
    notes: 'يُستخدم كثيراً في بيئات تعليمية كجزء من خطة دعم. ليس بديلاً عن التشخيص الطبي.',
    color: brandCyan,
    highlight: true,
  },
  {
    id: 'tomatis',
    name: 'Tomatis',
    nameAr: 'auto.ComparisonSection.k2',
    icon: '🎵',
    goal: 'تحفيز سمعي/حسي باستخدام معالجة صوتية وأساليب تدريب متعددة',
    format: 'جلسات/مراحل متعددة (قد تتضمن صوت/لغة/غناء)',
    duration: 'أسابيع/مراحل',
    notes: 'قد يختلف البروتوكول بين المراكز. اسأل عن القياسات والخطة والمتابعة.',
    color: brandPurple,
  },
  {
    id: 'ils',
    name: 'iLS',
    nameAr: 'auto.ComparisonSection.k3',
    icon: '🔊',
    goal: 'دمج الاستماع مع تمارين حسية/حركية لدعم التعلم والتنظيم',
    format: 'جلسات في المركز أو برامج منزلية بإشراف مختص',
    duration: 'أسابيع - أشهر',
    notes: 'غالباً يتضمن عناصر متعددة (حركة/انتباه/حسّي) بجانب الاستماع.',
    color: brandPink,
  },
  {
    id: 'ssp',
    name: 'SSP',
    nameAr: 'auto.ComparisonSection.k4',
    icon: '🛡️',
    goal: 'بروتوكول استماع مُفلتر موجه لتنظيم الاستجابة العصبية/التهدئة',
    format: 'جلسات استماع مُقسمة مع إرشادات تنظيمية',
    duration: 'أيام - أسابيع',
    notes: 'يُطبق وفق تدريب/اعتماد مُحدد. مناسب لبعض الأهداف وليس لكل الحالات.',
    color: brandColors.success,
  },
  {
    id: 'generic',
    name: 'Listening Therapy',
    nameAr: 'auto.ComparisonSection.k5',
    icon: '🎼',
    goal: 'استخدام موسيقى/أصوات (غير معيارية) للاسترخاء أو التركيز',
    format: 'متنوع وغير موحّد',
    duration: 'حسب الاستخدام',
    notes: 'قد يساعد في الاسترخاء، لكن لا يساوي بروتوكولاً علاجياً منظماً.',
    color: brandPurpleDark,
  },
];

const questions = [
  { icon: '📋', text: 'هل البرنامج موحّد ببروتوكول واضح أم يعتمد على اجتهادات عامة؟' },
  { icon: '📊', text: 'هل توجد قياسات/متابعة (قبل/بعد) أو آلية توثيق للنتائج؟' },
  { icon: '🏫', text: 'هل هناك خطة دمج مع المدرسة (توصيات صفية/تدريب معلمين)؟' },
  { icon: '👨‍⚕️', text: 'هل يوجد مختص يقود الخطة (Clinical Director) ويتابع الجودة؟' },
];

// Memoized ProgramCard with accessibility improvements
const ProgramCard = memo(function ProgramCard({
  program,
  isExpanded,
  onToggle,
}: {
  program: Program;
  isExpanded: boolean;
  onToggle: () => void;
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
          اختيارنا
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
          {program.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.weight.black,
              color: program.highlight ? program.color : colors.text.primary,
            }}
          >
            {program.name}
          </div>
          <div style={{ fontSize: typography.size.sm, color: colors.text.muted }}>
            {program.nameAr}
          </div>
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
                🎯 الهدف
              </div>
              <div
                style={{
                  fontSize: typography.size.sm,
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                {program.goal}
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
                  ⚙️ التطبيق
                </div>
                <div
                  style={{
                    fontSize: typography.size.sm,
                    color: colors.text.secondary,
                    lineHeight: typography.lineHeight.normal,
                  }}
                >
                  {program.format}
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
                  ⏱️ المدة
                </div>
                <div
                  style={{
                    fontSize: typography.size.sm,
                    color: colors.text.primary,
                    fontWeight: typography.weight.bold,
                  }}
                >
                  {program.duration}
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
                💡 ملاحظات
              </div>
              <div
                style={{
                  fontSize: typography.size.sm,
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                {program.notes}
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
        {icon}
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
  const [expandedProgram, setExpandedProgram] = useState<string>('berard');

  // Memoized toggle handler
  const handleToggle = useCallback((programId: string) => {
    setExpandedProgram((prev) => (prev === programId ? '' : programId));
  }, []);

  return (
    <section id="comparison" style={styles.sectionCard} aria-labelledby="comparison-title">
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
            🧭
          </span>
          <span style={{ fontWeight: typography.weight.bold, color: brandCyan }}>
            اختيار النهج المناسب
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
          مقارنة برامج الاستماع العلاجي
        </h2>

        <p style={{ ...styles.bodyText, maxWidth: 600, margin: `${spacing[3]}px auto 0` }}>
          مقارنة توعوية بين أشهر البرامج المستخدمة عالمياً لمساعدتك على طرح الأسئلة الصحيحة
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
            ❓
          </span>
          <h3
            style={{
              margin: 0,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.black,
              color: brandPurpleDark,
            }}
          >
            أسئلة مهمة قبل اختيار أي برنامج
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
            <QuestionItem key={i} icon={q.icon} text={q.text} />
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
          ⚠️
        </span>
        <span style={{ fontSize: typography.size.sm, color: colors.text.secondary }}>
          هذه ليست توصية طبية. استشر مختصاً مؤهلاً لتحديد ما يلائم الحالة.
        </span>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: spacing[3], flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="#pptx"
          style={{
            ...styles.primaryBtn,
            textDecoration: 'none',
            background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
            padding: `${spacing[3.5]}px ${spacing[7]}px`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <span aria-hidden="true">📊</span> شاهد التفاصيل في الشرائح
        </a>
        <a
          href="#contact"
          style={{
            ...styles.ghostBtn,
            textDecoration: 'none',
            borderColor: brandCyan,
            color: brandCyan,
            padding: `${spacing[3.5]}px ${spacing[7]}px`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <span aria-hidden="true">💬</span> اطلب استشارة
        </a>
      </div>
    </section>
  );
});
ComparisonSection.displayName = 'ComparisonSection';

export default ComparisonSection;
