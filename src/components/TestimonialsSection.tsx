import { useState, useEffect, useCallback, useRef } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';

type Testimonial = {
  id: string;
  name: string;
  age: number;
  condition: string;
  conditionAr: string;
  quote: string;
  improvement: string;
  avatar: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'أم نورة',
    age: 15,
    condition: 'Hyperacusis',
    conditionAr: 'فرط حساسية السمع',
    quote: 'كانت ابنتي تعاني من صعوبة شديدة في تحمل الأصوات العالية في المدرسة. بعد البرنامج، أصبحت قادرة على المشاركة في الفصل بدون ألم أو انزعاج.',
    improvement: 'تحسن 85% في تحمل الأصوات',
    avatar: '👩',
    rating: 5,
  },
  {
    id: '2',
    name: 'والد هشام',
    age: 11,
    condition: 'Learning Difficulties',
    conditionAr: 'صعوبات تعلم',
    quote: 'كان ابني يعاني من صعوبة في التركيز والفهم في الصف. لاحظنا تحسناً ملحوظاً في قدرته على متابعة التعليمات والقراءة بعد البرنامج.',
    improvement: 'تحسن في القراءة والانتباه',
    avatar: '👨',
    rating: 5,
  },
  {
    id: '3',
    name: 'أم سفانة',
    age: 5,
    condition: 'APD/CAPD',
    conditionAr: 'اضطراب المعالجة السمعية',
    quote: 'ابنتي كانت تسمع ولكن لا تفهم. الآن أصبحت تستجيب بشكل أفضل وتتواصل معنا بوضوح أكبر.',
    improvement: 'تحسن كبير في فهم الكلام',
    avatar: '👩',
    rating: 5,
  },
  {
    id: '4',
    name: 'جدة فاطمة',
    age: 72,
    condition: 'Tinnitus',
    conditionAr: 'طنين الأذن',
    quote: 'كنت أعاني من طنين مزعج لسنوات. بعد البرنامج، انخفضت حدة الطنين بشكل ملحوظ وأصبحت أنام بشكل أفضل.',
    improvement: 'تخفيف ملحوظ في الطنين',
    avatar: '👵',
    rating: 4,
  },
  {
    id: '5',
    name: 'والدة مازن',
    age: 11,
    condition: 'Attention Issues',
    conditionAr: 'صعوبات انتباه',
    quote: 'التغيير في قدرة ابني على التركيز كان مذهلاً. معلمته لاحظت الفرق في الأسبوع الأول بعد البرنامج.',
    improvement: 'تحسن 70% في التركيز',
    avatar: '👩',
    rating: 5,
  },
];

const stats = [
  { value: '95%', label: 'نسبة الرضا' },
  { value: '500+', label: 'حالة ناجحة' },
  { value: '10+', label: 'سنوات خبرة' },
  { value: '4.9', label: 'تقييم عام' },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
    const interval = setInterval(nextSlide, 6000);
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

  return (
    <section id="testimonials" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>قصص النجاح</h2>
          <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.12)', borderColor: 'rgba(176,18,112,0.25)' }}>
            ⭐ تجارب حقيقية
          </span>
        </div>
        <p style={styles.bodyText}>
          تجارب عائلات حقيقية مع برنامج Berard AIT. النتائج تختلف من شخص لآخر.
        </p>
      </div>

      {/* Stats Row - Responsive */}
      <div style={{
        marginTop: 20,
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? 8 : 12,
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            padding: isMobile ? 12 : 16,
            background: `linear-gradient(135deg, ${[brandCyan, brandPurple, brandPink, brandPurpleDark][i]}15, transparent)`,
            borderRadius: 12,
            textAlign: 'center',
            border: `1px solid ${[brandCyan, brandPurple, brandPink, brandPurpleDark][i]}33`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 25px ${[brandCyan, brandPurple, brandPink, brandPurpleDark][i]}22`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{
              fontSize: isMobile ? 22 : 28,
              fontWeight: 900,
              color: [brandCyan, brandPurple, brandPink, brandPurpleDark][i],
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: isMobile ? 10 : 12, opacity: 0.7, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Featured Testimonial - With Swipe Support */}
      <div
        style={{
          marginTop: 24,
          padding: isMobile ? 16 : 24,
          background: `linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.08))`,
          borderRadius: 16,
          border: '1px solid rgba(143,211,204,0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Quote Icon */}
        <div style={{
          position: 'absolute',
          top: 16,
          right: 20,
          fontSize: isMobile ? 36 : 48,
          opacity: 0.1,
          color: brandCyan,
        }}>
          "
        </div>

        {/* Navigation Arrows - Desktop */}
        {!isMobile && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              style={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(11,15,28,0.8)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                opacity: isPaused ? 1 : 0,
                transition: 'opacity 0.3s ease, background 0.2s',
                zIndex: 2,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = brandCyan + '44'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(11,15,28,0.8)'; }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextSlide}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(11,15,28,0.8)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                opacity: isPaused ? 1 : 0,
                transition: 'opacity 0.3s ease, background 0.2s',
                zIndex: 2,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = brandCyan + '44'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(11,15,28,0.8)'; }}
            >
              ›
            </button>
          </>
        )}

        <div style={{ display: 'flex', gap: isMobile ? 12 : 16, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
          {/* Avatar */}
          <div style={{
            width: isMobile ? 50 : 60,
            height: isMobile ? 50 : 60,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${brandCyan}33, ${brandPurple}33)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? 24 : 28,
            border: `2px solid ${brandCyan}44`,
            flexShrink: 0,
            animation: 'pulse 3s ease-in-out infinite',
          }}>
            {testimonials[activeIndex].avatar}
          </div>

          <div style={{ flex: 1, width: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: isMobile ? 14 : 16 }}>{testimonials[activeIndex].name}</div>
                <div style={{ fontSize: isMobile ? 11 : 13, color: brandPurple, marginTop: 2 }}>
                  {testimonials[activeIndex].conditionAr} • العمر: {testimonials[activeIndex].age}
                </div>
              </div>
              {/* Rating */}
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{
                    color: i < testimonials[activeIndex].rating ? '#FFD700' : 'rgba(255,255,255,0.2)',
                    fontSize: isMobile ? 14 : 16,
                    transition: 'transform 0.2s ease',
                  }}>
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Quote */}
            <p style={{
              margin: '12px 0',
              fontSize: isMobile ? 13 : 15,
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.9)',
            }}>
              "{testimonials[activeIndex].quote}"
            </p>

            {/* Improvement Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: isMobile ? '5px 10px' : '6px 12px',
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 8,
            }}>
              <span style={{ color: '#22c55e' }}>✓</span>
              <span style={{ fontSize: isMobile ? 11 : 13, fontWeight: 700, color: '#22c55e' }}>
                {testimonials[activeIndex].improvement}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Dots with Progress */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          marginTop: 16,
        }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              style={{
                width: activeIndex === i ? 24 : 10,
                height: 10,
                borderRadius: 5,
                background: activeIndex === i ? brandCyan : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {activeIndex === i && !isPaused && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  background: 'rgba(255,255,255,0.4)',
                  animation: 'progressFill 6s linear',
                  borderRadius: 5,
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Swipe hint on mobile */}
        {isMobile && (
          <div style={{
            textAlign: 'center',
            marginTop: 12,
            fontSize: 11,
            color: 'rgba(255,255,255,0.4)',
          }}>
            ← اسحب للتنقل →
          </div>
        )}

        <style>{`
          @keyframes progressFill {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(143,211,204,0.4); }
            50% { box-shadow: 0 0 0 8px rgba(143,211,204,0); }
          }
        `}</style>
      </div>

      {/* All Testimonials Grid */}
      <div style={{
        marginTop: 20,
        display: 'grid',
        gap: 12,
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      }}>
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            style={{
              padding: 14,
              background: activeIndex === i ? 'rgba(143,211,204,0.1)' : 'rgba(15,22,41,0.6)',
              border: `1px solid ${activeIndex === i ? brandCyan + '44' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 12,
              cursor: 'pointer',
              textAlign: 'right',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{t.avatar}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#f7f8fb' }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{t.conditionAr}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{ ...styles.muted, marginTop: 16, textAlign: 'center' }}>
        ⚠️ النتائج تختلف من شخص لآخر. هذه الشهادات للأغراض التوضيحية وليست ضماناً للنتائج.
      </p>

      <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="#results" style={{ ...styles.primaryBtn, textDecoration: 'none' }}>
          شاهد دراسات الحالة
        </a>
        <a href="#contact" style={{ ...styles.ghostBtn, textDecoration: 'none' }}>
          احجز استشارة
        </a>
      </div>
    </section>
  );
}
