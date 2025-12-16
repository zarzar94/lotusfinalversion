import { useMemo, useState } from 'react';

import { pptxSlides } from '../data/pptxSlides';
import { assetUrl } from '../utils/asset';
import { brandCyan, brandPink, brandPurpleDark, styles } from './styles';

type CaseStudy = {
  slideId: number;
  label: string;
  focus: string;
};

const caseStudies: CaseStudy[] = [
  { slideId: 42, label: 'نورة (15)', focus: 'فرط حساسية السمع / Distortion' },
  { slideId: 43, label: 'سفانة (5)', focus: 'APD / CAPD' },
  { slideId: 44, label: 'هشام (11)', focus: 'صعوبات تعلم' },
  { slideId: 45, label: 'فاطمة (72)', focus: 'طنين الأذن' },
  { slideId: 46, label: 'مازن (11)', focus: 'صعوبات تعلم' },
];

const ResultsSection = () => {
  const [activeSlideId, setActiveSlideId] = useState<number | null>(null);

  const activeSlide = useMemo(() => {
    if (!activeSlideId) return null;
    return pptxSlides.find((s) => s.id === activeSlideId) ?? null;
  }, [activeSlideId]);

  return (
    <section id="results" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>نتائج ودراسات حالة (قبل / بعد)</h2>
          <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.14)', borderColor: 'rgba(176,18,112,0.25)' }}>
            📊 أمثلة من العرض التقديمي
          </span>
        </div>
        <p style={styles.bodyText}>
          أمثلة توضيحية من الشرائح تعرض تغيّرات قبل/بعد في بعض القياسات أو المؤشرات السمعية.
          تُعرض هنا لأغراض تعليمية/توعوية ولا تُعد ضماناً أو نتيجة متوقعة لكل حالة.
        </p>
        <p style={styles.muted}>⚠️ لا تشكّل هذه الأمثلة تشخيصاً طبياً. أي قرار علاجي يجب أن يكون عبر مختص.</p>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {caseStudies.map((cs) => {
          const slide = pptxSlides.find((s) => s.id === cs.slideId);
          if (!slide) return null;
          return (
            <button
              key={cs.slideId}
              type="button"
              style={{ ...styles.gameCard, textAlign: 'start', cursor: 'pointer' }}
              onClick={() => setActiveSlideId(cs.slideId)}
            >
              <img
                src={assetUrl(slide.thumb)}
                alt={slide.title}
                style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)' }}
                loading="lazy"
              />
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                <div style={{ fontWeight: 900, color: brandCyan }}>{cs.label}</div>
                <span style={styles.chip}>شريحة {cs.slideId}</span>
              </div>
              <div style={{ marginTop: 6, fontWeight: 900, color: brandPurpleDark, lineHeight: 1.35 }}>
                {slide.title}
              </div>
              <div style={{ marginTop: 6, ...styles.muted }}>{cs.focus}</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)', borderColor: 'rgba(143,211,204,0.25)' }}>قبل</span>
                <span style={{ ...styles.chip, background: 'rgba(175,132,186,0.12)', borderColor: 'rgba(175,132,186,0.25)' }}>بعد</span>
                <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.12)', borderColor: 'rgba(176,18,112,0.25)' }}>مقارنة</span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a href="#pptx" style={{ ...styles.primaryBtn, textDecoration: 'none' }}>
          عرض جميع الشرائح
        </a>
        <a href="#contact" style={{ ...styles.ghostBtn, textDecoration: 'none' }}>
          اطلب تقييم / عرض للمدرسة
        </a>
      </div>

      {activeSlide ? (
        <div style={styles.modalBackdrop} onClick={() => setActiveSlideId(null)} role="dialog" aria-modal="true">
          <div style={{ ...styles.modal, padding: 18 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.14)', borderColor: 'rgba(176,18,112,0.25)' }}>
                  📊 شريحة {activeSlide.id}
                </span>
                <div style={{ fontWeight: 900, fontSize: 18, color: brandPurpleDark }}>{activeSlide.title}</div>
              </div>
              <button type="button" style={styles.ghostBtn} onClick={() => setActiveSlideId(null)}>
                إغلاق
              </button>
            </div>

            <div style={{ marginTop: 14, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.10)' }}>
              <img src={assetUrl(activeSlide.image)} alt={activeSlide.title} style={{ width: '100%', display: 'block', background: '#0f1629' }} />
            </div>

            {activeSlide.body ? (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 900, color: brandPink }}>ملاحظات مختصرة</div>
                <div style={{ ...styles.muted, marginTop: 6 }}>
                  {activeSlide.body.split('\n').filter(Boolean).slice(0, 3).join(' • ')}
                </div>
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
              <a href={assetUrl(activeSlide.image)} download style={{ ...styles.primaryBtn, textDecoration: 'none' }}>
                تحميل الصورة
              </a>
              <a href="#pptx" style={{ ...styles.ghostBtn, textDecoration: 'none' }} onClick={() => setActiveSlideId(null)}>
                فتح في عارض الشرائح
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ResultsSection;
