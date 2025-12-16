import { useState, useEffect, useCallback, useRef } from 'react';
import { assetUrl } from '../utils/asset';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';
import {
  XIcon,
  CheckIcon,
  ArrowRightIcon,
  VideoIcon,
  StarIcon,
  SmileIcon,
  TrophyIcon,
  ClockIcon,
  TargetIcon,
  PhoneIcon,
  MicroscopeIcon,
  AlertIcon,
  ShieldCheckIcon,
} from './Icons';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  age: number;
  condition: string;
  conditionAr: string;
  quote: string;
  improvement: string;
  improvementPercent: number;
  avatar: string;
  rating: number;
  beforeAfter: {
    before: string[];
    after: string[];
  };
  duration: string;
  videoAvailable?: boolean;
  verifiedDate: string;
};

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'أم نورة',
    role: 'والدة',
    age: 15,
    condition: 'Hyperacusis',
    conditionAr: 'فرط حساسية السمع',
    quote: 'كانت ابنتي تعاني من صعوبة شديدة في تحمل الأصوات العالية في المدرسة. بعد البرنامج، أصبحت قادرة على المشاركة في الفصل بدون ألم أو انزعاج.',
    improvement: 'تحسن في تحمل الأصوات',
    improvementPercent: 85,
    avatar: '👩',
    rating: 5,
    beforeAfter: {
      before: ['ألم من الأصوات العالية', 'تجنب المدرسة', 'عزلة اجتماعية'],
      after: ['مشاركة في الفصل', 'حضور المناسبات', 'تواصل طبيعي'],
    },
    duration: '10 أيام',
    videoAvailable: true,
    verifiedDate: '2024',
  },
  {
    id: '2',
    name: 'والد هشام',
    role: 'والد',
    age: 11,
    condition: 'Learning Difficulties',
    conditionAr: 'صعوبات تعلم',
    quote: 'كان ابني يعاني من صعوبة في التركيز والفهم في الصف. لاحظنا تحسناً ملحوظاً في قدرته على متابعة التعليمات والقراءة بعد البرنامج.',
    improvement: 'تحسن في القراءة والانتباه',
    improvementPercent: 70,
    avatar: '👨',
    rating: 5,
    beforeAfter: {
      before: ['صعوبة في القراءة', 'تشتت الانتباه', 'إحباط من المدرسة'],
      after: ['قراءة بطلاقة', 'تركيز أفضل', 'حب التعلم'],
    },
    duration: '10 أيام',
    verifiedDate: '2024',
  },
  {
    id: '3',
    name: 'أم سفانة',
    role: 'والدة',
    age: 5,
    condition: 'APD/CAPD',
    conditionAr: 'اضطراب المعالجة السمعية',
    quote: 'ابنتي كانت تسمع ولكن لا تفهم. الآن أصبحت تستجيب بشكل أفضل وتتواصل معنا بوضوح أكبر.',
    improvement: 'تحسن كبير في فهم الكلام',
    improvementPercent: 90,
    avatar: '👩',
    rating: 5,
    beforeAfter: {
      before: ['لا تفهم التعليمات', 'تأخر لغوي', 'صعوبة التواصل'],
      after: ['استجابة فورية', 'تحسن اللغة', 'تواصل واضح'],
    },
    duration: '10 أيام',
    videoAvailable: true,
    verifiedDate: '2023',
  },
  {
    id: '4',
    name: 'جدة فاطمة',
    role: 'مريضة',
    age: 72,
    condition: 'Tinnitus',
    conditionAr: 'طنين الأذن',
    quote: 'كنت أعاني من طنين مزعج لسنوات. بعد البرنامج، انخفضت حدة الطنين بشكل ملحوظ وأصبحت أنام بشكل أفضل.',
    improvement: 'تخفيف ملحوظ في الطنين',
    improvementPercent: 60,
    avatar: '👵',
    rating: 4,
    beforeAfter: {
      before: ['طنين مستمر', 'أرق', 'توتر وقلق'],
      after: ['هدوء ملحوظ', 'نوم أفضل', 'راحة نفسية'],
    },
    duration: '10 أيام',
    verifiedDate: '2024',
  },
  {
    id: '5',
    name: 'والدة مازن',
    role: 'والدة',
    age: 11,
    condition: 'Attention Issues',
    conditionAr: 'صعوبات انتباه',
    quote: 'التغيير في قدرة ابني على التركيز كان مذهلاً. معلمته لاحظت الفرق في الأسبوع الأول بعد البرنامج.',
    improvement: 'تحسن في التركيز',
    improvementPercent: 75,
    avatar: '👩',
    rating: 5,
    beforeAfter: {
      before: ['تشتت سريع', 'نسيان المهام', 'صعوبة الإنجاز'],
      after: ['تركيز مستمر', 'تذكر أفضل', 'إنجاز المهام'],
    },
    duration: '10 أيام',
    videoAvailable: true,
    verifiedDate: '2024',
  },
];

const conditionColors: Record<string, string> = {
  Hyperacusis: brandPink,
  'Learning Difficulties': brandPurple,
  'APD/CAPD': brandCyan,
  Tinnitus: brandPurpleDark,
  'Attention Issues': '#22c55e',
};

// Animated brain wave visualization
function BrainWaveViz({ color, intensity, active }: { color: string; intensity: number; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw multiple wave layers
      [0.6, 0.8, 1].forEach((opacity, layer) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = active ? opacity * 0.5 : opacity * 0.2;
        ctx.lineWidth = 2 - layer * 0.5;

        for (let x = 0; x < canvas.width; x++) {
          const frequency = 0.02 + layer * 0.01;
          const amplitude = (intensity / 100) * 15 * (active ? 1 : 0.3);
          const y = canvas.height / 2 +
            Math.sin(x * frequency + offset + layer) * amplitude +
            Math.sin(x * frequency * 2 + offset * 1.5) * amplitude * 0.5;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      offset += active ? 0.08 : 0.02;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [color, intensity, active]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={50}
      style={{ display: 'block', borderRadius: 8 }}
    />
  );
}

// Transformation journey visualization
function TransformationJourney({ before, after, color, isActive }: {
  before: string[];
  after: string[];
  color: string;
  isActive: boolean;
}) {
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowAfter(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowAfter(false);
    }
  }, [isActive]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      gap: 16,
      alignItems: 'center',
      marginTop: 16,
    }}>
      {/* Before */}
      <div style={{
        padding: 14,
        background: 'rgba(239,68,68,0.08)',
        borderRadius: 14,
        border: '1px solid rgba(239,68,68,0.15)',
        opacity: showAfter ? 0.5 : 1,
        transition: 'all 0.5s ease',
        transform: showAfter ? 'scale(0.95)' : 'scale(1)',
      }}>
        <div style={{
          fontSize: 10,
          fontWeight: 900,
          color: '#ef4444',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'rgba(239,68,68,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <XIcon size={12} color="#ef4444" />
          </span>
          قبل العلاج
        </div>
        {before.map((item, i) => (
          <div key={i} style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            opacity: showAfter ? 0.5 : 1,
            textDecoration: showAfter ? 'line-through' : 'none',
            transition: `all 0.3s ease ${i * 0.1}s`,
          }}>
            <span style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#ef4444',
            }} />
            {item}
          </div>
        ))}
      </div>

      {/* Arrow/Transformation indicator */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}>
        <div style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: showAfter
            ? `linear-gradient(135deg, ${color}, #22c55e)`
            : 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          transition: 'all 0.5s ease',
          boxShadow: showAfter ? `0 0 30px ${color}44` : 'none',
        }}>
          {showAfter ? <CheckIcon size={24} color="#fff" /> : <ArrowRightIcon size={20} color="rgba(255,255,255,0.6)" />}
        </div>
        <div style={{
          fontSize: 9,
          color: 'rgba(255,255,255,0.5)',
          textAlign: 'center',
        }}>
          10 أيام
        </div>
      </div>

      {/* After */}
      <div style={{
        padding: 14,
        background: showAfter ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.05)',
        borderRadius: 14,
        border: `1px solid ${showAfter ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.1)'}`,
        transition: 'all 0.5s ease',
        transform: showAfter ? 'scale(1.02)' : 'scale(1)',
        boxShadow: showAfter ? '0 10px 30px rgba(34,197,94,0.15)' : 'none',
      }}>
        <div style={{
          fontSize: 10,
          fontWeight: 900,
          color: '#22c55e',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: showAfter ? '#22c55e' : 'rgba(34,197,94,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            transition: 'all 0.5s ease',
          }}>
            <CheckIcon size={12} color={showAfter ? '#fff' : '#22c55e'} />
          </span>
          بعد العلاج
        </div>
        {after.map((item, i) => (
          <div key={i} style={{
            fontSize: 11,
            color: showAfter ? '#22c55e' : 'rgba(255,255,255,0.5)',
            marginTop: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            opacity: showAfter ? 1 : 0.5,
            transform: showAfter ? 'translateX(0)' : 'translateX(-10px)',
            transition: `all 0.4s ease ${0.5 + i * 0.15}s`,
          }}>
            <span style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#22c55e',
            }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// Case study card - professional medical style
function CaseStudyCard({
  testimonial,
  isActive,
  onClick,
  index,
}: {
  testimonial: Testimonial;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const accentColor = conditionColors[testimonial.condition] || brandCyan;

  return (
    <div
      onClick={onClick}
      style={{
        background: isActive
          ? `linear-gradient(145deg, rgba(15,22,41,0.98), ${accentColor}11)`
          : 'rgba(15,22,41,0.8)',
        border: `2px solid ${isActive ? accentColor : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isActive ? 'scale(1)' : 'scale(0.98)',
        opacity: isActive ? 1 : 0.7,
        animation: `caseEnter 0.6s ease-out ${index * 0.1}s backwards`,
      }}
    >
      {/* Case header with medical-style design */}
      <div style={{
        background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${accentColor}22`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Patient avatar with pulse effect - Brain Logo */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 52,
              height: 52,
<<<<<<< HEAD
              borderRadius: '50%',
              background: `linear-gradient(135deg, rgba(11,15,28,0.9), ${accentColor}22)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${accentColor}`,
              overflow: 'hidden',
            }}>
              <img
                src={assetUrl('assets/images/brain_logo.png')}
                alt="Berard AIT"
                style={{
                  width: 42,
                  height: 42,
                  objectFit: 'contain',
                  mixBlendMode: 'screen',
                  filter: `drop-shadow(0 0 8px ${accentColor})`,
                }}
              />
            </div>
            {isActive && (
              <div style={{
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                border: `2px solid ${accentColor}`,
                animation: 'pulseRing 2s ease-out infinite',
              }} />
            )}
            {/* Verified badge */}
            <div style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid rgba(15,22,41,1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
            }}>
              ✓
=======
              borderRadius: '50%',
              background: `linear-gradient(135deg, rgba(11,15,28,0.9), ${accentColor}22)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${accentColor}`,
              overflow: 'hidden',
            }}>
              <img
                src={assetUrl('assets/images/brain_logo.png')}
                alt="Berard AIT"
                style={{
                  width: 42,
                  height: 42,
                  objectFit: 'contain',
                  mixBlendMode: 'screen',
                  filter: `drop-shadow(0 0 8px ${accentColor})`,
                }}
              />
            </div>
            {isActive && (
              <div style={{
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                border: `2px solid ${accentColor}`,
                animation: 'pulseRing 2s ease-out infinite',
              }} />
            )}
            {/* Verified badge */}
            <div style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid rgba(15,22,41,1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckIcon size={10} color="#fff" />
>>>>>>> origin/claude/redesign-ai-website-n4NU9
            </div>
          </div>

          <div>
            <div style={{
              fontWeight: 900,
              fontSize: 16,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              {testimonial.name}
              {testimonial.videoAvailable && (
                <span style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  color: 'rgba(255,255,255,0.7)',
<<<<<<< HEAD
                }}>
                  🎥 فيديو
=======
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <VideoIcon size={12} /> فيديو
>>>>>>> origin/claude/redesign-ai-website-n4NU9
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              {testimonial.role} • {testimonial.age} سنة • {testimonial.verifiedDate}
            </div>
          </div>
        </div>

        {/* Brain wave indicator */}
        <BrainWaveViz color={accentColor} intensity={testimonial.improvementPercent} active={isActive} />
      </div>

      {/* Condition badge */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}33`,
          borderRadius: 30,
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: accentColor,
            boxShadow: isActive ? `0 0 10px ${accentColor}` : 'none',
          }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: accentColor }}>
            {testimonial.conditionAr}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
            {testimonial.condition}
          </span>
        </div>
      </div>

      {/* Quote - only show for active */}
      {isActive && (
        <div style={{ padding: '16px 20px' }}>
          <div style={{
            position: 'relative',
            padding: '16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 14,
            borderRight: `3px solid ${accentColor}`,
          }}>
            <span style={{
              position: 'absolute',
              top: 8,
              right: 12,
              fontSize: 40,
              color: accentColor,
              opacity: 0.2,
              fontFamily: 'serif',
            }}>"</span>
            <p style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.9,
              color: 'rgba(255,255,255,0.9)',
            }}>
              {testimonial.quote}
            </p>
          </div>
        </div>
      )}

      {/* Transformation journey - only show for active */}
      {isActive && (
        <div style={{ padding: '0 20px 16px' }}>
          <TransformationJourney
            before={testimonial.beforeAfter.before}
            after={testimonial.beforeAfter.after}
            color={accentColor}
            isActive={isActive}
          />
        </div>
      )}

      {/* Footer stats */}
      <div style={{
        padding: '14px 20px',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Improvement meter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 100,
            height: 8,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <div style={{
              width: isActive ? `${testimonial.improvementPercent}%` : '0%',
              height: '100%',
              background: `linear-gradient(90deg, ${accentColor}, #22c55e)`,
              borderRadius: 4,
              transition: 'width 1s ease-out',
            }} />
          </div>
          <span style={{
            fontSize: 14,
            fontWeight: 900,
            color: '#22c55e',
            fontFamily: 'monospace',
          }}>
            {testimonial.improvementPercent}%
          </span>
        </div>

        {/* Rating stars */}
        <div style={{ display: 'flex', gap: 2 }}>
          {Array.from({ length: 5 }).map((_, i) => (
<<<<<<< HEAD
            <span key={i} style={{
              color: i < testimonial.rating ? '#FFD700' : 'rgba(255,255,255,0.15)',
              fontSize: 14,
              textShadow: i < testimonial.rating ? '0 0 8px rgba(255,215,0,0.5)' : 'none',
            }}>★</span>
=======
            <StarIcon
              key={i}
              size={14}
              color={i < testimonial.rating ? '#FFD700' : 'rgba(255,255,255,0.15)'}
              filled={i < testimonial.rating}
              style={{
                filter: i < testimonial.rating ? 'drop-shadow(0 0 8px rgba(255,215,0,0.5))' : 'none',
              }}
            />
>>>>>>> origin/claude/redesign-ai-website-n4NU9
          ))}
        </div>
      </div>
    </div>
  );
}

// Aggregate stats component
function AggregateStats({ isVisible }: { isVisible: boolean }) {
  const [counts, setCounts] = useState({ satisfaction: 0, cases: 0, years: 0, rating: 0 });

  useEffect(() => {
    if (!isVisible) return;
    const targets = { satisfaction: 95, cases: 500, years: 10, rating: 49 };
    const duration = 2000;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts({
        satisfaction: Math.floor(targets.satisfaction * eased),
        cases: Math.floor(targets.cases * eased),
        years: Math.floor(targets.years * eased),
        rating: Math.floor(targets.rating * eased),
      });

      if (progress < 1) requestAnimationFrame(animate);
    };

    animate();
  }, [isVisible]);

  const stats = [
<<<<<<< HEAD
    { value: `${counts.satisfaction}%`, label: 'نسبة الرضا', icon: '😊', color: brandCyan },
    { value: `${counts.cases}+`, label: 'حالة ناجحة', icon: '🏆', color: brandPurple },
    { value: `${counts.years}+`, label: 'سنوات خبرة', icon: '⏱️', color: brandPink },
    { value: (counts.rating / 10).toFixed(1), label: 'تقييم عام', icon: '⭐', color: '#FFD700' },
=======
    { value: `${counts.satisfaction}%`, label: 'نسبة الرضا', icon: <SmileIcon size={24} color={brandCyan} />, color: brandCyan },
    { value: `${counts.cases}+`, label: 'حالة ناجحة', icon: <TrophyIcon size={24} color={brandPurple} />, color: brandPurple },
    { value: `${counts.years}+`, label: 'سنوات خبرة', icon: <ClockIcon size={24} color={brandPink} />, color: brandPink },
    { value: (counts.rating / 10).toFixed(1), label: 'تقييم عام', icon: <StarIcon size={24} color="#FFD700" filled />, color: '#FFD700' },
>>>>>>> origin/claude/redesign-ai-website-n4NU9
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginBottom: 30,
    }}>
      {stats.map((stat, i) => (
        <div
          key={i}
          style={{
            padding: 20,
            background: `linear-gradient(145deg, ${stat.color}12, transparent)`,
            borderRadius: 16,
            textAlign: 'center',
            border: `1px solid ${stat.color}25`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
<<<<<<< HEAD
            fontSize: 80,
            opacity: 0.05,
          }}>
            {stat.icon}
          </div>
          <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
=======
            opacity: 0.08,
          }}>
            {stat.icon}
          </div>
          <div style={{ marginBottom: 8 }}>{stat.icon}</div>
>>>>>>> origin/claude/redesign-ai-website-n4NU9
          <div style={{
            fontSize: 32,
            fontWeight: 900,
            color: stat.color,
            fontFamily: 'monospace',
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 4,
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-rotate
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section ref={sectionRef} id="testimonials" style={styles.sectionCard}>
      <style>{`
        @keyframes caseEnter {
          from { opacity: 0; transform: translateY(30px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
      `}</style>

      {/* Header with animated gradient */}
      <div style={{
        textAlign: 'center',
        marginBottom: 30,
        position: 'relative',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 24px',
          background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(176,18,112,0.15), rgba(143,211,204,0.15))',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 5s ease infinite',
          borderRadius: 40,
          border: '1px solid rgba(255,215,0,0.25)',
          marginBottom: 16,
        }}>
<<<<<<< HEAD
          <span style={{ fontSize: 28, animation: 'float 3s ease-in-out infinite' }}>⭐</span>
=======
          <span style={{ animation: 'float 3s ease-in-out infinite', display: 'flex' }}>
            <StarIcon size={28} color="#FFD700" filled />
          </span>
>>>>>>> origin/claude/redesign-ai-website-n4NU9
          <span style={{
            fontSize: 14,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FFD700, #fff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            قصص النجاح الموثقة
          </span>
          <span style={{
            padding: '4px 10px',
            background: '#22c55e',
            borderRadius: 20,
            fontSize: 10,
            color: '#fff',
            fontWeight: 900,
<<<<<<< HEAD
          }}>
            ✓ موثق
=======
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <ShieldCheckIcon size={12} color="#fff" /> موثق
>>>>>>> origin/claude/redesign-ai-website-n4NU9
          </span>
        </div>

        <h2 style={{
          ...styles.h2,
          fontSize: 32,
          marginBottom: 12,
        }}>
          تحولات حقيقية من عائلات حقيقية
        </h2>
        <p style={{
          ...styles.bodyText,
          maxWidth: 600,
          margin: '0 auto',
        }}>
          شهادات موثقة من أولياء أمور ومرضى شهدوا تغييرات ملموسة في حياتهم من خلال برنامج Berard AIT
        </p>
      </div>

      {/* Aggregate Stats */}
      <AggregateStats isVisible={isVisible} />

      {/* Case Studies Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {testimonials.map((t, i) => (
          <CaseStudyCard
            key={t.id}
            testimonial={t}
            isActive={i === activeIndex}
            onClick={() => setActiveIndex(i)}
            index={i}
          />
        ))}
      </div>

      {/* Navigation dots */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        marginTop: 24,
      }}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            style={{
              width: i === activeIndex ? 32 : 10,
              height: 10,
              borderRadius: 5,
              background: i === activeIndex
                ? `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`
                : 'rgba(255,255,255,0.15)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* CTA */}
      <div style={{
        marginTop: 30,
        padding: 24,
        background: 'linear-gradient(135deg, rgba(143,211,204,0.12), rgba(176,18,112,0.12))',
        borderRadius: 20,
        border: '1px solid rgba(143,211,204,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
      }}>
        <div>
          <div style={{
            fontSize: 20,
            fontWeight: 900,
            color: '#fff',
            marginBottom: 6,
<<<<<<< HEAD
          }}>
            🎯 هل ترغب في تجربة مماثلة؟
=======
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <TargetIcon size={24} color={brandCyan} /> هل ترغب في تجربة مماثلة؟
>>>>>>> origin/claude/redesign-ai-website-n4NU9
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
            احجز استشارتك المجانية اليوم واكتشف كيف يمكن لـ Berard AIT مساعدتك
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="#contact" style={{
            ...styles.primaryBtn,
            textDecoration: 'none',
            padding: '14px 28px',
            fontSize: 15,
            borderRadius: 14,
<<<<<<< HEAD
          }}>
            📞 احجز استشارة مجانية
=======
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <PhoneIcon size={18} /> احجز استشارة مجانية
>>>>>>> origin/claude/redesign-ai-website-n4NU9
          </a>
          <a href="#checklist" style={{
            ...styles.ghostBtn,
            textDecoration: 'none',
            padding: '14px 28px',
            fontSize: 15,
            borderRadius: 14,
<<<<<<< HEAD
          }}>
            🔬 جرب الماسح العصبي
=======
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <MicroscopeIcon size={18} /> جرب الماسح العصبي
>>>>>>> origin/claude/redesign-ai-website-n4NU9
          </a>
        </div>
      </div>

      {/* Disclaimer */}
<<<<<<< HEAD
      <p style={{
=======
      <div style={{
>>>>>>> origin/claude/redesign-ai-website-n4NU9
        ...styles.muted,
        marginTop: 20,
        textAlign: 'center',
        fontSize: 11,
        padding: '12px 20px',
        background: 'rgba(245,158,11,0.08)',
        borderRadius: 12,
        border: '1px solid rgba(245,158,11,0.15)',
<<<<<<< HEAD
      }}>
        ⚠️ النتائج تختلف من شخص لآخر. جميع الشهادات حقيقية وموثقة بموافقة أصحابها. هذا ليس ضماناً للنتائج - استشر مختصاً للتقييم الشخصي.
      </p>
=======
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}>
        <AlertIcon size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
        النتائج تختلف من شخص لآخر. جميع الشهادات حقيقية وموثقة بموافقة أصحابها. هذا ليس ضماناً للنتائج - استشر مختصاً للتقييم الشخصي.
      </div>
>>>>>>> origin/claude/redesign-ai-website-n4NU9
    </section>
  );
}
