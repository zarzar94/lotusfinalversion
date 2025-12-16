import { useEffect, useMemo, useState } from 'react';

import { useFocusTrap } from '../hooks/useFocusTrap';
import { pptxSlides } from '../data/pptxSlides';
import { assetUrl } from '../utils/asset';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../utils/pdf';
import { brandCyan, brandPink, brandPurpleDark, styles } from './styles';

type Slide = typeof pptxSlides[number];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const SlideViewer = () => {
  const [query, setQuery] = useState('');
  const [activeSlideId, setActiveSlideId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const modalRef = useFocusTrap<HTMLDivElement>(activeSlideId !== null);

  const slides = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pptxSlides;
    return pptxSlides.filter((slide) => {
      const haystack = `${slide.id} ${slide.title} ${slide.body}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const activeIndex = useMemo(() => {
    if (!activeSlideId) return -1;
    return slides.findIndex((s) => s.id === activeSlideId);
  }, [activeSlideId, slides]);

  const activeSlide = activeIndex >= 0 ? slides[activeIndex] : null;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!activeSlide) return;
      if (event.key === 'Escape') setActiveSlideId(null);
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        setActiveSlideId((prev) => {
          if (!prev) return prev;
          const i = slides.findIndex((s) => s.id === prev);
          if (i < 0) return prev;
          return slides[clamp(i + 1, 0, slides.length - 1)].id;
        });
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        setActiveSlideId((prev) => {
          if (!prev) return prev;
          const i = slides.findIndex((s) => s.id === prev);
          if (i < 0) return prev;
          return slides[clamp(i - 1, 0, slides.length - 1)].id;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeSlide, slides]);

  const exportSlidesPdf = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const doc = await createPdfDoc();
      let y = 56;
      doc.setFont('Cairo', 'bold');
      writePdfText(doc, 'ملخص شرائح برنامج بيرارد للتكامل السمعي', PDF_MARGIN_X, y);
      y += 22;
      doc.setFont('Cairo', 'normal');
      writePdfText(doc, `عدد الشرائح: ${pptxSlides.length} — تم التصدير من موقع Berard AIT Sound Lab`, PDF_MARGIN_X, y);
      y += 22;

      for (const slide of pptxSlides) {
        const lineTitle = `شريحة ${slide.id}: ${slide.title}`;
        const bodyPreview = (slide.body || '').split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 3).join(' • ');

        if (y > 760) {
          doc.addPage();
          y = 56;
        }
        doc.setFont('Cairo', 'bold');
        writePdfText(doc, lineTitle, PDF_MARGIN_X, y);
        y += 18;
        if (bodyPreview) {
          doc.setFont('Cairo', 'normal');
          const wrapped = doc.splitTextToSize(bodyPreview, doc.internal.pageSize.getWidth() - PDF_MARGIN_X * 2);
          for (const line of wrapped) {
            if (y > 760) {
              doc.addPage();
              y = 56;
            }
            writePdfText(doc, String(line), PDF_MARGIN_X, y);
            y += 16;
          }
        }
        y += 10;
      }

      doc.save('Berard-AIT-Deck-Summary.pdf');
    } finally {
      setExporting(false);
    }
  };

  return (
    <section id="pptx" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>عارض الشرائح (PPTX)</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)', borderColor: 'rgba(143,211,204,0.25)' }}>
              🎞️ {slides.length} / {pptxSlides.length}
            </span>
            <button
              type="button"
              style={exporting ? styles.disabledBtn : styles.ghostBtn}
              onClick={exportSlidesPdf}
              disabled={exporting}
            >
              {exporting ? 'جارٍ التصدير…' : 'تحميل ملخص PDF'}
            </button>
          </div>
        </div>

        <p style={styles.bodyText}>
          هذا القسم يعرض الشرائح بصرياً 1:1 (صور + مصغّرات) مع النص المستخرج — لاستخدامه في العروض، التدريب، أو الشراكات التعليمية.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            style={{ ...styles.input, flex: 1, minWidth: 240 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث داخل الشرائح (مثال: APD, حساسية سمعية, 20 جلسة…)"
          />
          <a
            href={assetUrl('downloads/berard-profile.pdf')}
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.ghostBtn, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            📄 ملف البرنامج
          </a>
        </div>
      </div>

      <div style={{ marginTop: 16, ...styles.slideGrid }}>
        {slides.map((slide) => (
          <article
            key={slide.id}
            style={styles.slideItem}
            role="button"
            tabIndex={0}
            onClick={() => setActiveSlideId(slide.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setActiveSlideId(slide.id);
            }}
            aria-label={`فتح الشريحة رقم ${slide.id}`}
          >
            <img
              src={assetUrl(slide.thumb)}
              alt={slide.title}
              loading="lazy"
              style={styles.slideThumbImg}
            />
            <div style={styles.slideItemMeta}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <span style={{ fontWeight: 900, color: brandCyan }}>#{slide.id}</span>
                <span style={{ fontSize: 12, opacity: 0.75 }}>اضغط للعرض</span>
              </div>
              <div style={{ fontWeight: 900, lineHeight: 1.35 }}>{slide.title || `شريحة ${slide.id}`}</div>
              {slide.body ? (
                <div style={{ ...styles.muted, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {slide.body.split('\n').filter(Boolean).slice(0, 2).join(' • ')}
                </div>
              ) : (
                <div style={styles.muted}>شريحة مرئية (بدون نص مكتوب)</div>
              )}
            </div>
          </article>
        ))}
      </div>

      {activeSlide ? (
        <div
          style={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label={`الشريحة ${activeSlide.id}`}
          onClick={() => setActiveSlideId(null)}
        >
          <div
            ref={modalRef}
            style={{ ...styles.modal, padding: 18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.14)', borderColor: 'rgba(176,18,112,0.25)' }}>
                  🎧 شريحة {activeSlide.id}
                </span>
                <div style={{ fontWeight: 900, fontSize: 18, color: brandPurpleDark }}>{activeSlide.title}</div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  style={styles.ghostBtn}
                  onClick={() => setActiveSlideId(null)}
                >
                  إغلاق
                </button>
                <a
                  href={assetUrl(activeSlide.image)}
                  download
                  style={{ ...styles.primaryBtn, textDecoration: 'none', textAlign: 'center' }}
                >
                  تحميل الصورة
                </a>
              </div>
            </div>

            <div style={{ marginTop: 14, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.10)' }}>
              <img
                src={assetUrl(activeSlide.image)}
                alt={activeSlide.title}
                style={{ width: '100%', display: 'block', background: '#0f1629' }}
              />
            </div>

            {activeSlide.body ? (
              <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ fontWeight: 900, color: brandPink }}>النص المستخرج</div>
                  <button
                    type="button"
                    style={styles.ghostBtn}
                    onClick={() => {
                      void navigator.clipboard.writeText(`${activeSlide.title}\n\n${activeSlide.body}`);
                    }}
                  >
                    نسخ النص
                  </button>
                </div>
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.7,
                    background: 'rgba(15,22,41,0.7)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: 14,
                    padding: 12,
                    fontFamily: 'inherit',
                    color: 'rgba(247,248,251,0.92)',
                  }}
                >
                  {activeSlide.body}
                </pre>
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 14 }}>
              <button
                type="button"
                style={styles.ghostBtn}
                onClick={() => setActiveSlideId(slides[clamp(activeIndex - 1, 0, slides.length - 1)].id)}
                disabled={activeIndex <= 0}
              >
                ← السابق
              </button>
              <button
                type="button"
                style={styles.ghostBtn}
                onClick={() => setActiveSlideId(slides[clamp(activeIndex + 1, 0, slides.length - 1)].id)}
                disabled={activeIndex >= slides.length - 1}
              >
                التالي →
              </button>
            </div>

            <p style={{ ...styles.muted, marginTop: 10 }}>
              اختصارات لوحة المفاتيح: Esc للإغلاق — الأسهم للتنقل بين الشرائح.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default SlideViewer;
