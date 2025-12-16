import { useState } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';

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
    nameAr: 'برنامج بيرار',
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
    nameAr: 'توماتيس',
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
    nameAr: 'نظام الاستماع المتكامل',
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
    nameAr: 'بروتوكول الأمان الصوتي',
    icon: '🛡️',
    goal: 'بروتوكول استماع مُفلتر موجه لتنظيم الاستجابة العصبية/التهدئة',
    format: 'جلسات استماع مُقسمة مع إرشادات تنظيمية',
    duration: 'أيام - أسابيع',
    notes: 'يُطبق وفق تدريب/اعتماد مُحدد. مناسب لبعض الأهداف وليس لكل الحالات.',
    color: '#22c55e',
  },
  {
    id: 'generic',
    name: 'Listening Therapy',
    nameAr: 'علاج الاستماع العام',
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

function ProgramCard({ program, isExpanded, onToggle }: { program: Program; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: program.highlight
          ? `linear-gradient(135deg, ${program.color}15, ${program.color}08)`
          : 'rgba(11,15,28,0.6)',
        border: `2px solid ${program.highlight ? program.color : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 16,
        padding: isExpanded ? 20 : 16,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Highlight badge */}
      {program.highlight && (
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          background: program.color,
          color: '#000',
          fontSize: 10,
          fontWeight: 900,
          padding: '4px 10px',
          borderRadius: 20,
        }}>
          اختيارنا
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: isExpanded ? 16 : 0,
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${program.color}20`,
          border: `1px solid ${program.color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
        }}>
          {program.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 18,
            fontWeight: 900,
            color: program.highlight ? program.color : '#fff',
          }}>
            {program.name}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            {program.nameAr}
          </div>
        </div>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontSize: 14,
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
        }}>
          ▼
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{
            display: 'grid',
            gap: 12,
            marginTop: 8,
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 10,
              padding: 12,
            }}>
              <div style={{ fontSize: 11, color: program.color, fontWeight: 700, marginBottom: 4 }}>
                🎯 الهدف
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                {program.goal}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 10,
                padding: 12,
              }}>
                <div style={{ fontSize: 11, color: program.color, fontWeight: 700, marginBottom: 4 }}>
                  ⚙️ التطبيق
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                  {program.format}
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 10,
                padding: 12,
              }}>
                <div style={{ fontSize: 11, color: program.color, fontWeight: 700, marginBottom: 4 }}>
                  ⏱️ المدة
                </div>
                <div style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>
                  {program.duration}
                </div>
              </div>
            </div>

            <div style={{
              background: `${program.color}10`,
              border: `1px solid ${program.color}30`,
              borderRadius: 10,
              padding: 12,
            }}>
              <div style={{ fontSize: 11, color: program.color, fontWeight: 700, marginBottom: 4 }}>
                💡 ملاحظات
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
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
}

const ComparisonSection = () => {
  const [expandedProgram, setExpandedProgram] = useState<string>('berard');

  return (
    <section id="comparison" style={styles.sectionCard}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 20px',
          background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}15)`,
          borderRadius: 30,
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 24 }}>🧭</span>
          <span style={{ fontWeight: 700, color: brandCyan }}>اختيار النهج المناسب</span>
        </div>

        <h2 style={{
          ...styles.h2,
          background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          مقارنة برامج الاستماع العلاجي
        </h2>

        <p style={{ ...styles.bodyText, maxWidth: 600, margin: '12px auto 0' }}>
          مقارنة توعوية بين أشهر البرامج المستخدمة عالمياً لمساعدتك على طرح الأسئلة الصحيحة
        </p>
      </div>

      {/* Programs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        marginBottom: 32,
      }}>
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            isExpanded={expandedProgram === program.id}
            onToggle={() => setExpandedProgram(expandedProgram === program.id ? '' : program.id)}
          />
        ))}
      </div>

      {/* Questions to Ask */}
      <div style={{
        background: `linear-gradient(135deg, ${brandPurpleDark}15, ${brandPink}10)`,
        border: `1px solid ${brandPurpleDark}30`,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 24 }}>❓</span>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: brandPurpleDark }}>
            أسئلة مهمة قبل اختيار أي برنامج
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 12,
        }}>
          {questions.map((q, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: 12,
                background: 'rgba(11,15,28,0.4)',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span style={{ fontSize: 18 }}>{q.icon}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                {q.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div style={{
        background: 'rgba(251,191,36,0.1)',
        border: '1px solid rgba(251,191,36,0.3)',
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
      }}>
        <span style={{ fontSize: 24 }}>⚠️</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
          هذه ليست توصية طبية. استشر مختصاً مؤهلاً لتحديد ما يلائم الحالة.
        </span>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="#pptx"
          style={{
            ...styles.primaryBtn,
            textDecoration: 'none',
            background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
            padding: '14px 28px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>📊</span> شاهد التفاصيل في الشرائح
        </a>
        <a
          href="#contact"
          style={{
            ...styles.ghostBtn,
            textDecoration: 'none',
            borderColor: brandCyan,
            color: brandCyan,
            padding: '14px 28px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>💬</span> اطلب استشارة
        </a>
      </div>
    </section>
  );
};

export default ComparisonSection;
