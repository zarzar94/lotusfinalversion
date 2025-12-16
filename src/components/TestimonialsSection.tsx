import { useState, useEffect, useCallback, useRef } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';

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
  },
];

const stats = [
  { value: '95%', label: 'نسبة الرضا', icon: '😊', color: brandCyan },
  { value: '500+', label: 'حالة ناجحة', icon: '🏆', color: brandPurple },
  { value: '10+', label: 'سنوات خبرة', icon: '⏱️', color: brandPink },
  { value: '4.9', label: 'تقييم عام', icon: '⭐', color: brandPurpleDark },
];

// Sound wave animation component
function SoundWave({ color, active }: { color: string; active: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 30 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: active ? '100%' : '30%',
            background: color,
            borderRadius: 2,
            animation: active ? `soundWave 0.6s ease-in-out infinite ${i * 0.1}s` : 'none',
            opacity: active ? 1 : 0.3,
            transition: 'opacity 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}

// Progress ring component
function ProgressRing({ percent, color, size = 80 }: { percent: number; color: string; size?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
      {/* Center text */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontSize={size / 4}
        fontWeight="900"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
      >
        {percent}%
      </text>
    </svg>
  );
}

// Testimonial card component
function TestimonialCard({
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
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const conditionColors: Record<string, string> = {
    Hyperacusis: brandPink,
    'Learning Difficulties': brandPurple,
    'APD/CAPD': brandCyan,
    Tinnitus: brandPurpleDark,
    'Attention Issues': '#22c55e',
  };

  const accentColor = conditionColors[testimonial.condition] || brandCyan;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowDetails(false); }}
      style={{
        background: isActive
          ? `linear-gradient(145deg, ${accentColor}22, rgba(15,22,41,0.9))`
          : 'rgba(15,22,41,0.7)',
        border: `2px solid ${isActive ? accentColor : isHovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 20,
        padding: 0,
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isActive ? 'scale(1.02)' : isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: isActive
          ? `0 20px 60px ${accentColor}33, 0 0 40px ${accentColor}11`
          : isHovered
            ? '0 15px 40px rgba(0,0,0,0.4)'
            : '0 4px 15px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        position: 'relative',
        animation: `cardEnter 0.6s ease-out ${index * 0.1}s backwards`,
      }}
    >
      {/* Gradient header */}
      <div style={{
        background: `linear-gradient(135deg, ${accentColor}44, ${accentColor}22)`,
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        borderBottom: `1px solid ${accentColor}33`,
      }}>
        {/* Avatar with ring */}
        <div style={{
          position: 'relative',
          width: 56,
          height: 56,
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `conic-gradient(${accentColor} ${testimonial.improvementPercent}%, rgba(255,255,255,0.1) 0)`,
            animation: isActive ? 'spin 8s linear infinite' : 'none',
          }} />
          <div style={{
            position: 'absolute',
            inset: 3,
            borderRadius: '50%',
            background: 'rgba(15,22,41,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
          }}>
            {testimonial.avatar}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: 16, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
            {testimonial.name}
            {testimonial.rating === 5 && (
              <span style={{
                fontSize: 10,
                padding: '2px 6px',
                background: '#FFD70033',
                borderRadius: 4,
                color: '#FFD700',
              }}>
                ⭐ موصى به
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
            {testimonial.role} • طفل عمره {testimonial.age} سنة
          </div>
        </div>

        {/* Sound wave indicator */}
        <SoundWave color={accentColor} active={isActive} />
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px' }}>
        {/* Condition badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 12px',
          background: `${accentColor}22`,
          border: `1px solid ${accentColor}44`,
          borderRadius: 20,
          marginBottom: 12,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: accentColor }}>
            {testimonial.conditionAr}
          </span>
        </div>

        {/* Quote */}
        <p style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.85)',
          position: 'relative',
        }}>
          <span style={{ fontSize: 24, color: accentColor, opacity: 0.5, position: 'absolute', top: -10, right: -5 }}>"</span>
          {testimonial.quote}
        </p>

        {/* Before/After Toggle */}
        {isHovered && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
            style={{
              marginTop: 12,
              padding: '8px 14px',
              background: showDetails ? accentColor : 'rgba(255,255,255,0.08)',
              border: `1px solid ${showDetails ? accentColor : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 10,
              color: showDetails ? '#fff' : 'rgba(255,255,255,0.8)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
            }}
          >
            {showDetails ? '✕ إخفاء' : '📊 قبل وبعد'}
          </button>
        )}

        {/* Before/After Details */}
        {showDetails && (
          <div style={{
            marginTop: 12,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            animation: 'slideDown 0.3s ease-out',
          }}>
            <div style={{
              padding: 12,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 10,
            }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#ef4444', marginBottom: 8 }}>❌ قبل</div>
              {testimonial.beforeAfter.before.map((item, i) => (
                <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>• {item}</div>
              ))}
            </div>
            <div style={{
              padding: 12,
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 10,
            }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#22c55e', marginBottom: 8 }}>✓ بعد</div>
              {testimonial.beforeAfter.after.map((item, i) => (
                <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>• {item}</div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 14,
          paddingTop: 14,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Improvement indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: `conic-gradient(${accentColor} ${testimonial.improvementPercent}%, rgba(255,255,255,0.1) 0)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 900,
              color: '#fff',
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(15,22,41,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {testimonial.improvementPercent}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>{testimonial.improvement}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>خلال {testimonial.duration}</div>
            </div>
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{
                color: i < testimonial.rating ? '#FFD700' : 'rgba(255,255,255,0.15)',
                fontSize: 14,
              }}>★</span>
            ))}
          </div>
        </div>
      </div>

      {/* Active indicator glow */}
      {isActive && (
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 20,
          boxShadow: `inset 0 0 30px ${accentColor}22`,
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animatedStats, setAnimatedStats] = useState<number[]>([0, 0, 0, 0]);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animate stats on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const targetValues = [95, 500, 10, 49]; // 4.9 * 10
          targetValues.forEach((target, i) => {
            let current = 0;
            const increment = target / 50;
            const interval = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(interval);
              }
              setAnimatedStats((prev) => {
                const newStats = [...prev];
                newStats[i] = Math.floor(current);
                return newStats;
              });
            }, 30);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-rotate carousel
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  const formatStatValue = (index: number) => {
    if (index === 0) return `${animatedStats[0]}%`;
    if (index === 1) return `${animatedStats[1]}+`;
    if (index === 2) return `${animatedStats[2]}+`;
    return (animatedStats[3] / 10).toFixed(1);
  };

  return (
    <section ref={sectionRef} id="testimonials" style={styles.sectionCard}>
      <style>{`
        @keyframes soundWave {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 200px; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Header */}
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>⭐ قصص النجاح</h2>
          <span style={{
            ...styles.chip,
            background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(176,18,112,0.2))',
            borderColor: 'rgba(255,215,0,0.4)',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            ✨ تجارب حقيقية موثقة
          </span>
        </div>
        <p style={styles.bodyText}>
          شهادات من عائلات حقيقية شهدت تحولات ملموسة من خلال برنامج Berard AIT.
        </p>
      </div>

      {/* Animated Stats */}
      <div style={{
        marginTop: 24,
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: 12,
      }}>
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              padding: isMobile ? 16 : 20,
              background: `linear-gradient(145deg, ${stat.color}15, transparent)`,
              borderRadius: 16,
              textAlign: 'center',
              border: `1px solid ${stat.color}33`,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
              e.currentTarget.style.boxShadow = `0 15px 40px ${stat.color}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Background icon */}
            <div style={{
              position: 'absolute',
              top: -10,
              right: -10,
              fontSize: 60,
              opacity: 0.08,
            }}>
              {stat.icon}
            </div>

            <div style={{
              fontSize: 14,
              marginBottom: 8,
            }}>
              {stat.icon}
            </div>
            <div style={{
              fontSize: isMobile ? 28 : 36,
              fontWeight: 900,
              color: stat.color,
              fontFamily: 'monospace',
            }}>
              {formatStatValue(i)}
            </div>
            <div style={{
              fontSize: isMobile ? 11 : 13,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 4,
              fontWeight: 600,
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Featured Success Story */}
      <div
        style={{
          marginTop: 30,
          padding: isMobile ? 20 : 30,
          background: 'linear-gradient(145deg, rgba(143,211,204,0.1), rgba(175,132,186,0.1))',
          borderRadius: 24,
          border: '2px solid rgba(143,211,204,0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${brandCyan}22, transparent)`,
          borderRadius: '50%',
          filter: 'blur(30px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 80,
          height: 80,
          background: `radial-gradient(circle, ${brandPurple}22, transparent)`,
          borderRadius: '50%',
          filter: 'blur(25px)',
        }} />

        {/* Section title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 28, animation: 'float 3s ease-in-out infinite' }}>🌟</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>قصة النجاح المميزة</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Featured Success Story</div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={prevSlide}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = brandCyan + '44'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextSlide}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = brandCyan + '44'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            >
              ›
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          marginBottom: 20,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
            width: `${((activeIndex + 1) / testimonials.length) * 100}%`,
            transition: 'width 0.5s ease',
            borderRadius: 2,
          }} />
        </div>

        {/* Testimonial Card Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              style={{
                display: isMobile
                  ? (i === activeIndex ? 'block' : 'none')
                  : 'block',
                opacity: !isMobile || i === activeIndex ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            >
              <TestimonialCard
                testimonial={t}
                isActive={i === activeIndex}
                onClick={() => setActiveIndex(i)}
                index={i}
              />
            </div>
          ))}
        </div>

        {/* Mobile dots */}
        {isMobile && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginTop: 16,
          }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === activeIndex ? brandCyan : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Call to action */}
      <div style={{
        marginTop: 24,
        padding: 20,
        background: 'linear-gradient(135deg, rgba(143,211,204,0.15), rgba(176,18,112,0.15))',
        borderRadius: 16,
        border: '1px solid rgba(143,211,204,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18, color: '#fff', marginBottom: 4 }}>
            🎯 هل أنت مستعد لتحول مماثل؟
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            احجز استشارة مجانية لمعرفة إذا كان Berard AIT مناسباً لحالتك
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="#contact" style={{
            ...styles.primaryBtn,
            textDecoration: 'none',
            padding: '12px 24px',
            fontSize: 14,
          }}>
            📞 احجز الآن
          </a>
          <a href="#results" style={{
            ...styles.ghostBtn,
            textDecoration: 'none',
            padding: '12px 24px',
            fontSize: 14,
          }}>
            📊 شاهد الدراسات
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <p style={{ ...styles.muted, marginTop: 16, textAlign: 'center', fontSize: 11 }}>
        ⚠️ النتائج تختلف من شخص لآخر. هذه الشهادات للأغراض التوضيحية وليست ضماناً للنتائج. استشر مختصاً للتقييم.
      </p>
    </section>
  );
}
