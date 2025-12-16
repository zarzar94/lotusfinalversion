import { useState } from 'react';
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

      {/* Stats Row */}
      <div style={{
        marginTop: 20,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            padding: 16,
            background: `linear-gradient(135deg, ${[brandCyan, brandPurple, brandPink, brandPurpleDark][i]}15, transparent)`,
            borderRadius: 12,
            textAlign: 'center',
            border: `1px solid ${[brandCyan, brandPurple, brandPink, brandPurpleDark][i]}33`,
          }}>
            <div style={{
              fontSize: 28,
              fontWeight: 900,
              color: [brandCyan, brandPurple, brandPink, brandPurpleDark][i],
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Featured Testimonial */}
      <div style={{
        marginTop: 24,
        padding: 24,
        background: `linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.08))`,
        borderRadius: 16,
        border: '1px solid rgba(143,211,204,0.2)',
        position: 'relative',
      }}>
        {/* Quote Icon */}
        <div style={{
          position: 'absolute',
          top: 16,
          right: 20,
          fontSize: 48,
          opacity: 0.1,
          color: brandCyan,
        }}>
          "
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${brandCyan}33, ${brandPurple}33)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            border: `2px solid ${brandCyan}44`,
            flexShrink: 0,
          }}>
            {testimonials[activeIndex].avatar}
          </div>

          <div style={{ flex: 1 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{testimonials[activeIndex].name}</div>
                <div style={{ fontSize: 13, color: brandPurple, marginTop: 2 }}>
                  {testimonials[activeIndex].conditionAr} • العمر: {testimonials[activeIndex].age}
                </div>
              </div>
              {/* Rating */}
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{
                    color: i < testimonials[activeIndex].rating ? '#FFD700' : 'rgba(255,255,255,0.2)',
                    fontSize: 16,
                  }}>
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Quote */}
            <p style={{
              margin: '16px 0',
              fontSize: 15,
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
              padding: '6px 12px',
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 8,
            }}>
              <span style={{ color: '#22c55e' }}>✓</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>
                {testimonials[activeIndex].improvement}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginTop: 20,
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
              }}
            />
          ))}
        </div>
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
