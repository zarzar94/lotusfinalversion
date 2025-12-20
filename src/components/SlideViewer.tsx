import { useEffect, useMemo, useState, useCallback, memo } from 'react';

import { useFocusTrap } from '../hooks/useFocusTrap';
import { pptxSlides } from '../data/pptxSlides';
import { assetUrl } from '../utils/asset';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../utils/pdf';
import {
  normalizeForSearch,
  parseSearchGroups,
  parseIdQuery as parseSlideIdQuery,
  matchesAllTokens,
  clamp,
  loadImageElement,
  type IdQuery as SlideIdQuery,
} from '../utils/search';
import { brandCyan, brandPink, brandPurple, styles, transitions, colors, radius, spacing, typography } from './styles';
import { MicroscopeIcon, FlaskIcon, SearchIcon, DownloadIcon, XIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode, type VisitorMode } from '../context/VisitorModeContext';

// Define slide categories based on visitor mode relevance
type SlideCategory = 'all' | 'school' | 'parent' | 'clinician' | 'science';

interface SlideCategoryConfig {
  id: SlideCategory;
  labelEn: string;
  labelAr: string;
  icon: string;
  color: string;
  slideIds: number[]; // Slides particularly relevant to this category
}

const SLIDE_CATEGORIES: SlideCategoryConfig[] = [
  { id: 'all', labelEn: 'All Samples', labelAr: 'جميع العينات', icon: '🧪', color: brandCyan, slideIds: [] },
  { id: 'school', labelEn: 'School Focus', labelAr: 'تركيز مدرسي', icon: '🏫', color: '#f59e0b', slideIds: [1, 2, 5, 10, 15, 20, 25, 30, 35] },
  { id: 'parent', labelEn: 'Parent Guide', labelAr: 'دليل الأهل', icon: '👨‍👩‍👧', color: '#22c55e', slideIds: [3, 7, 12, 18, 22, 28, 33, 38, 42, 43, 44, 45, 46] },
  { id: 'clinician', labelEn: 'Clinical Data', labelAr: 'بيانات سريرية', icon: '🔬', color: brandPurple, slideIds: [4, 8, 13, 17, 21, 26, 31, 36, 40] },
  { id: 'science', labelEn: 'Research', labelAr: 'أبحاث', icon: '📊', color: brandPink, slideIds: [6, 9, 14, 16, 19, 23, 27, 32, 37, 39] },
];

// Flask/Test Tube Slide Card - like a sample being viewed (memoized for performance)
const FlaskSlideCard = memo(({
  slide,
  index,
  isActive,
  onClick,
  isArabic,
}: {
  slide: typeof pptxSlides[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
  isArabic: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      role="button"
      tabIndex={0}
      aria-label={isArabic ? `فتح العينة رقم ${slide.id}` : `Open sample #${slide.id}`}
      aria-pressed={isActive}
      style={{
        position: 'relative',
        cursor: 'pointer',
        transition: transitions.bounce,
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Flask/Test tube container */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(30,35,50,0.9) 0%, rgba(20,25,35,0.95) 100%)',
        borderRadius: '12px 12px 30px 30px',
        padding: '12px 12px 24px 12px',
        border: `2px solid ${isHovered ? brandCyan + '60' : 'rgba(100,100,120,0.2)'}`,
        boxShadow: isHovered
          ? `0 15px 40px rgba(0,0,0,0.4), 0 0 30px ${brandCyan}20, inset 0 -10px 30px rgba(143,211,204,0.1)`
          : '0 8px 25px rgba(0,0,0,0.3), inset 0 -10px 30px rgba(143,211,204,0.05)',
        transition: 'all 0.4s ease',
      }}>
        {/* Flask neck */}
        <div style={{
          width: '40%',
          height: 8,
          background: 'linear-gradient(180deg, rgba(60,65,80,0.8), rgba(40,45,55,0.9))',
          margin: '0 auto 10px',
          borderRadius: '4px 4px 0 0',
          border: '1px solid rgba(100,100,120,0.2)',
          borderBottom: 'none',
        }} />

        {/* Sample label badge */}
        <div style={{
          position: 'absolute',
          top: 30,
          right: 12,
          background: brandPurple,
          color: '#fff',
          padding: '4px 10px',
          borderRadius: 6,
          fontSize: 10,
          fontWeight: 800,
          fontFamily: 'monospace',
        }}>
          #{slide.id.toString().padStart(2, '0')}
        </div>

        {/* Microscope viewing area - the slide thumbnail */}
        <div style={{
          position: 'relative',
          borderRadius: 12,
          overflow: 'hidden',
          border: '3px solid rgba(60,65,80,0.5)',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
        }}>
          {/* Circular microscope viewfinder overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }} />

          {/* Grid overlay - like microscope grid */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(143,211,204,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(143,211,204,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
            zIndex: 3,
          }} />

          {/* Slide image */}
          <img
            src={assetUrl(slide.thumb)}
            alt={slide.title}
            loading="lazy"
            style={{
              width: '100%',
              display: 'block',
              transition: 'transform 0.4s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />

          {/* View indicator */}
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 14px',
            background: 'rgba(0,0,0,0.8)',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            color: brandCyan,
            border: `1px solid ${brandCyan}30`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <MicroscopeIcon size={12} color={brandCyan} />
            عرض العينة
          </div>
        </div>

        {/* Sample info - bottom of flask */}
        <div style={{
          marginTop: 14,
          textAlign: 'center',
        }}>
          <div style={{
            fontWeight: 800,
            fontSize: 13,
            color: '#f7f8fb',
            lineHeight: 1.4,
            marginBottom: 6,
          }}>
            {slide.title || `عينة ${slide.id}`}
          </div>
          {slide.body ? (
            <div style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.5)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
            }}>
              {slide.body.split('\n').filter(Boolean).slice(0, 2).join(' • ')}
            </div>
          ) : (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              عينة مرئية (بدون بيانات)
            </div>
          )}
        </div>
      </div>

      {/* Flask stand/base */}
      <div style={{
        width: '50%',
        height: 6,
        background: 'linear-gradient(180deg, rgba(60,65,80,0.6), rgba(40,45,55,0.7))',
        margin: '0 auto',
        borderRadius: '0 0 4px 4px',
      }} />
    </article>
  );
});
FlaskSlideCard.displayName = 'FlaskSlideCard';

// Microscope Modal View (memoized)
const MicroscopeModal = ({
  slide,
  slides,
  activeIndex,
  onClose,
  onNavigate,
  modalRef,
}: {
  slide: typeof pptxSlides[0];
  slides: typeof pptxSlides;
  activeIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  modalRef: React.RefObject<HTMLDivElement>;
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigate = (direction: 'prev' | 'next') => {
    setIsTransitioning(true);
    setTimeout(() => {
      onNavigate(direction);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <div
      style={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`العينة ${slide.id}`}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          ...styles.modal,
          padding: 0,
          maxWidth: 900,
          background: 'linear-gradient(180deg, #1a1f2e 0%, #0f1420 100%)',
          border: '2px solid rgba(143,211,204,0.2)',
          borderRadius: 20,
          overflow: 'hidden',
        }}
      >
        {/* Microscope frame header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(90deg, rgba(40,45,60,0.9), rgba(30,35,50,0.9))',
          borderBottom: '1px solid rgba(143,211,204,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MicroscopeIcon size={24} color={brandCyan} />
            </div>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{
                  padding: '4px 10px',
                  background: brandPurple,
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  fontFamily: 'monospace',
                }}>
                  عينة #{slide.id.toString().padStart(2, '0')}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  {activeIndex + 1} من {slides.length}
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, marginTop: 4, color: '#f7f8fb' }}>
                {slide.title}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={assetUrl(slide.image)}
              download
              style={{
                ...styles.ghostBtn,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <DownloadIcon size={16} />
              تحميل
            </a>
            <button
              type="button"
              onClick={onClose}
              style={{
                ...styles.ghostBtn,
                padding: '10px',
              }}
            >
              <XIcon size={18} />
            </button>
          </div>
        </div>

        {/* Microscope viewing area */}
        <div style={{
          position: 'relative',
          background: '#0a0d14',
          padding: 20,
        }}>
          {/* Flask switching animation overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: isTransitioning ? 'rgba(143,211,204,0.1)' : 'transparent',
            transition: 'background 0.2s ease',
            pointerEvents: 'none',
            zIndex: 10,
          }} />

          {/* Circular viewfinder frame */}
          <div style={{
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            border: '4px solid rgba(60,65,80,0.6)',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8), 0 0 30px rgba(143,211,204,0.1)',
          }}>
            {/* Microscope circle overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle, transparent 70%, rgba(0,0,0,0.6) 100%)',
              pointerEvents: 'none',
              zIndex: 2,
            }} />

            {/* Measurement grid */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(143,211,204,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(143,211,204,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
              pointerEvents: 'none',
              zIndex: 3,
            }} />

            {/* Slide image */}
            <img
              src={assetUrl(slide.image)}
              alt={slide.title}
              style={{
                width: '100%',
                display: 'block',
                opacity: isTransitioning ? 0.5 : 1,
                transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.2s ease',
              }}
            />

            {/* Navigation arrows */}
            <button
              type="button"
              onClick={() => handleNavigate('prev')}
              disabled={activeIndex <= 0}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.7)',
                border: `2px solid ${brandCyan}40`,
                color: activeIndex <= 0 ? 'rgba(255,255,255,0.3)' : brandCyan,
                cursor: activeIndex <= 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                transition: 'all 0.3s ease',
              }}
            >
              <ChevronRightIcon size={24} />
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('next')}
              disabled={activeIndex >= slides.length - 1}
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.7)',
                border: `2px solid ${brandCyan}40`,
                color: activeIndex >= slides.length - 1 ? 'rgba(255,255,255,0.3)' : brandCyan,
                cursor: activeIndex >= slides.length - 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                transition: 'all 0.3s ease',
              }}
            >
              <ChevronLeftIcon size={24} />
            </button>
          </div>
        </div>

        {/* Data panel - extracted text */}
        {slide.body && (
          <div style={{
            padding: '16px 20px',
            background: 'rgba(0,0,0,0.3)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <div style={{
                fontWeight: 800,
                fontSize: 13,
                color: brandPink,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <FlaskIcon size={16} color={brandPink} />
                بيانات العينة المستخرجة
              </div>
              <button
                type="button"
                style={styles.ghostBtn}
                onClick={() => {
                  void navigator.clipboard.writeText(`${slide.title}\n\n${slide.body}`);
                }}
              >
                <CopyIcon size={14} />
                نسخ
              </button>
            </div>
            <pre style={{
              margin: 0,
              whiteSpace: 'pre-wrap',
              lineHeight: 1.7,
              background: 'rgba(15,22,41,0.7)',
              border: '1px solid rgba(143,211,204,0.1)',
              borderRadius: 12,
              padding: 14,
              fontFamily: 'inherit',
              fontSize: 13,
              color: 'rgba(247,248,251,0.85)',
              maxHeight: 200,
              overflowY: 'auto',
            }}>
              {slide.body}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          background: 'rgba(0,0,0,0.2)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          fontSize: 11,
          color: 'rgba(255,255,255,0.4)',
          textAlign: 'center',
        }}>
          اختصارات: Esc للإغلاق — الأسهم لتبديل العينات
        </div>
      </div>
    </div>
  );
};

// Map visitor mode to default category
const getDefaultCategory = (mode: VisitorMode): SlideCategory => {
  switch (mode) {
    case 'school': return 'school';
    case 'parent': return 'parent';
    case 'clinician': return 'clinician';
    default: return 'all';
  }
};

const SlideViewer = () => {
  const { isArabic } = useLanguage();
  const { mode: visitorMode, config: visitorConfig } = useVisitorMode();
  const [query, setQuery] = useState('');
  const [activeSlideId, setActiveSlideId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ mode: 'summary' | 'slides'; current: number; total: number } | null>(null);
  const [activeCategory, setActiveCategory] = useState<SlideCategory>('all');
  const modalRef = useFocusTrap<HTMLDivElement>(activeSlideId !== null);

  const slideIndex = useMemo(() => {
    return pptxSlides.map((slide) => {
      const idStr = String(slide.id);
      const paddedId = slide.id.toString().padStart(2, '0');
      const normTitle = normalizeForSearch(slide.title || '');
      const normBody = normalizeForSearch(slide.body || '');
      const normAll = normalizeForSearch(`${idStr} ${paddedId} ${slide.title || ''} ${slide.body || ''}`);
      return { slide, idStr, paddedId, normTitle, normBody, normAll };
    });
  }, []);

  const scoreGroup = useCallback((entry: typeof slideIndex[number], tokens: string[]): number => {
    let score = 0;

    for (const token of tokens) {
      if (!token) continue;

      if (token === entry.idStr || token === entry.paddedId) {
        score += 600;
        continue;
      }

      const inTitle = entry.normTitle.includes(token);
      const inBody = entry.normBody.includes(token);

      if (inTitle) score += 60;
      else if (inBody) score += 25;
      else score += 10;

      if (inTitle && entry.normTitle.startsWith(token)) score += 15;
    }

    return score;
  }, [slideIndex]);

  // Default category based on visitor mode
  useEffect(() => {
    setActiveCategory(getDefaultCategory(visitorMode));
  }, [visitorMode]);

  const slides = useMemo(() => {
    const categoryConfig = SLIDE_CATEGORIES.find((category) => category.id === activeCategory);
    const allowedIds =
      activeCategory !== 'all' && categoryConfig && categoryConfig.slideIds.length > 0
        ? new Set(categoryConfig.slideIds)
        : null;

    const raw = query.trim();
    if (!raw) return allowedIds ? pptxSlides.filter((slide) => allowedIds.has(slide.id)) : pptxSlides;

    const idQuery = parseSlideIdQuery(raw);
    if (idQuery) {
      if (idQuery.kind === 'range') {
        const ranged = pptxSlides.filter((slide) => slide.id >= idQuery.from && slide.id <= idQuery.to);
        return allowedIds ? ranged.filter((slide) => allowedIds.has(slide.id)) : ranged;
      }
      const wanted = new Set(idQuery.ids);
      const selected = pptxSlides.filter((slide) => wanted.has(slide.id));
      return allowedIds ? selected.filter((slide) => allowedIds.has(slide.id)) : selected;
    }

    const groups = parseSearchGroups(raw);
    if (!groups.length) return allowedIds ? pptxSlides.filter((slide) => allowedIds.has(slide.id)) : pptxSlides;

    const results = slideIndex
      .map((entry) => {
        const matchingGroups = groups.filter((tokens) => matchesAllTokens(entry.normAll, tokens));
        if (!matchingGroups.length) return null;
        const bestScore = Math.max(...matchingGroups.map((tokens) => scoreGroup(entry, tokens)));
        return { slide: entry.slide, score: bestScore };
      })
      .filter((value): value is { slide: typeof pptxSlides[0]; score: number } => value !== null)
      .sort((a, b) => b.score - a.score || a.slide.id - b.slide.id)
      .map((r) => r.slide);

    return allowedIds ? results.filter((slide) => allowedIds.has(slide.id)) : results;
  }, [query, slideIndex, scoreGroup, activeCategory]);

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
        setActiveSlideId(slides[clamp(activeIndex + 1, 0, slides.length - 1)].id);
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        setActiveSlideId(slides[clamp(activeIndex - 1, 0, slides.length - 1)].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeSlide, slides, activeIndex]);

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'next'
      ? clamp(activeIndex + 1, 0, slides.length - 1)
      : clamp(activeIndex - 1, 0, slides.length - 1);
    setActiveSlideId(slides[newIndex].id);
  }, [activeIndex, slides]);

  const exportSlidesPdf = async () => {
    if (exporting) return;
    const slidesToExport = slides;
    setExporting(true);
    setExportProgress({ mode: 'summary', current: 0, total: slidesToExport.length });
    try {
      const doc = await createPdfDoc();
      let y = 56;
      doc.setFont('Cairo', 'bold');
      writePdfText(doc, 'ملخص عينات مختبر بيرارد للتكامل السمعي', PDF_MARGIN_X, y);
      y += 22;
      doc.setFont('Cairo', 'normal');
      writePdfText(doc, `عدد العينات: ${slidesToExport.length} — تم التصدير من مختبر Berard AIT`, PDF_MARGIN_X, y);
      y += 22;

      if (slidesToExport.length === 0) {
        writePdfText(doc, 'لا توجد عينات تطابق البحث الحالي.', PDF_MARGIN_X, y);
        doc.save('Berard-AIT-Lab-Samples.pdf');
        return;
      }

      for (let i = 0; i < slidesToExport.length; i++) {
        const slide = slidesToExport[i];
        const lineTitle = `عينة ${slide.id}: ${slide.title}`;
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

        setExportProgress({ mode: 'summary', current: i + 1, total: slidesToExport.length });
      }

      doc.save('Berard-AIT-Lab-Samples.pdf');
    } finally {
      setExporting(false);
      setExportProgress(null);
    }
  };

  const exportSlidesImagesPdf = async () => {
    if (exporting) return;
    const slidesToExport = slides;
    setExporting(true);
    setExportProgress({ mode: 'slides', current: 0, total: slidesToExport.length });
    try {
      const doc = await createPdfDoc({ orientation: 'l' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();

      if (slidesToExport.length === 0) {
        let y = 72;
        doc.setFont('Cairo', 'bold');
        doc.setFontSize(18);
        y = writePdfText(doc, 'PDF الشرائح — لا توجد نتائج', PDF_MARGIN_X, y, { maxWidth: pageW - PDF_MARGIN_X * 2, lineHeight: 22 });
        doc.setFont('Cairo', 'normal');
        doc.setFontSize(12);
        writePdfText(doc, 'لا توجد عينات تطابق البحث الحالي.', PDF_MARGIN_X, y + 10, { maxWidth: pageW - PDF_MARGIN_X * 2, lineHeight: 16 });
        doc.save('Berard-AIT-Lab-Slides.pdf');
        return;
      }

      for (let i = 0; i < slidesToExport.length; i++) {
        const slide = slidesToExport[i];
        if (i > 0) doc.addPage();

        let y = 56;
        doc.setFont('Cairo', 'bold');
        doc.setFontSize(16);
        y = writePdfText(doc, `عينة ${slide.id.toString().padStart(2, '0')}: ${slide.title}`, PDF_MARGIN_X, y, {
          maxWidth: pageW - PDF_MARGIN_X * 2,
          lineHeight: 20,
        });
        y += 14;

        try {
          const img = await loadImageElement(assetUrl(slide.image));
          const maxW = pageW - PDF_MARGIN_X * 2;
          const maxH = pageH - y - 36;

          const scale = Math.min(
            maxW / Math.max(1, img.naturalWidth),
            maxH / Math.max(1, img.naturalHeight),
          );

          const w = img.naturalWidth * scale;
          const h = img.naturalHeight * scale;
          const x = (pageW - w) / 2;

          doc.addImage(img, 'PNG', x, y, w, h);
        } catch {
          doc.setFont('Cairo', 'normal');
          doc.setFontSize(12);
          writePdfText(doc, 'تعذر تحميل صورة الشريحة لهذه العينة.', PDF_MARGIN_X, y + 10, { maxWidth: pageW - PDF_MARGIN_X * 2, lineHeight: 16 });
        }

        setExportProgress({ mode: 'slides', current: i + 1, total: slidesToExport.length });
      }

      doc.save('Berard-AIT-Lab-Slides.pdf');
    } finally {
      setExporting(false);
      setExportProgress(null);
    }
  };

  const css = useMemo(() => `
    @keyframes flaskBubble {
      0%, 100% { transform: translateY(0); opacity: 0.5; }
      50% { transform: translateY(-10px); opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
    }
    @keyframes scanLine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes glowPulse {
      0%, 100% { box-shadow: 0 0 20px ${brandCyan}20; }
      50% { box-shadow: 0 0 35px ${brandCyan}40; }
    }
    .flask-card {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .flask-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, transparent, ${brandCyan}08, transparent);
      transform: translateX(-100%);
      pointer-events: none;
    }
    .flask-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.4), 0 0 30px ${brandCyan}25;
    }
    .flask-card:hover::after {
      animation: scanLine 1.5s ease-in-out;
    }
    .category-btn {
      transition: all 0.3s ease;
    }
    .category-btn:hover {
      transform: translateY(-2px);
    }
    .category-btn.active {
      animation: glowPulse 2s ease-in-out infinite;
    }
    .search-input {
      transition: all 0.3s ease;
    }
    .search-input:focus {
      border-color: ${brandCyan} !important;
      box-shadow: 0 0 20px ${brandCyan}30, 0 0 40px ${brandCyan}15 !important;
      outline: none;
    }
    .lab-btn {
      transition: all 0.3s ease;
    }
    .lab-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.3), 0 0 20px ${brandCyan}20;
    }
    .category-filters {
      scrollbar-width: thin;
      scrollbar-color: rgba(143,211,204,0.3) transparent;
    }
    .category-filters::-webkit-scrollbar {
      height: 4px;
    }
    .category-filters::-webkit-scrollbar-track {
      background: transparent;
    }
    .category-filters::-webkit-scrollbar-thumb {
      background: rgba(143,211,204,0.3);
      border-radius: 4px;
    }
    @media (max-width: 640px) {
      .slides-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
        gap: 12px !important;
      }
      .category-filters {
        overflow-x: auto;
        flex-wrap: nowrap !important;
        padding-bottom: 8px;
      }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      .slides-grid {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 20px !important;
      }
    }
    @media (min-width: 1280px) {
      .slides-grid {
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 24px !important;
      }
    }
  `, []);

  return (
    <section id="pptx" style={{
      ...styles.sectionCard,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{css}</style>

      {/* Lab background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(143,211,204,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(143,211,204,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionHeaderRow}>
            <h2 style={styles.h2}>مختبر العينات (PPTX)</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                background: 'rgba(143,211,204,0.1)',
                border: '1px solid rgba(143,211,204,0.2)',
                borderRadius: 10,
              }}>
                <FlaskIcon size={16} color={brandCyan} />
                <span style={{ fontSize: 12, fontWeight: 700, color: brandCyan, fontFamily: 'monospace' }}>
                  {slides.length} / {pptxSlides.length}
                </span>
              </div>
              <button
                type="button"
                style={exporting ? styles.disabledBtn : styles.ghostBtn}
                onClick={exportSlidesPdf}
                disabled={exporting}
              >
                <DownloadIcon size={16} />
                {exporting && exportProgress?.mode === 'summary'
                  ? (exportProgress.total > 0 ? `جارٍ التصدير… (${exportProgress.current}/${exportProgress.total})` : 'جارٍ التصدير…')
                  : 'تقرير PDF'}
              </button>
              <button
                type="button"
                style={exporting ? styles.disabledBtn : styles.ghostBtn}
                onClick={exportSlidesImagesPdf}
                disabled={exporting}
              >
                <DownloadIcon size={16} />
                {exporting && exportProgress?.mode === 'slides'
                  ? `جارٍ تصدير الشرائح… (${exportProgress.current}/${exportProgress.total})`
                  : 'PDF الشرائح'}
              </button>
            </div>
          </div>

          <p style={styles.bodyText}>
            عينات مجهرية لشرائح البرنامج — اضغط على أي عينة لفحصها تحت المجهر المخبري
          </p>

          {/* Search bar */}
          <div style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            marginTop: 16,
          }}>
            <div style={{
              flex: 1,
              minWidth: 240,
              position: 'relative',
            }}>
              <SearchIcon
                size={18}
                color="rgba(255,255,255,0.4)"
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
              <input
                className="search-input"
                style={{
                  ...styles.input,
                  width: '100%',
                  paddingRight: 42,
                }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث في العينات (مثال: APD، #12، 5-10...)' : 'Search samples (e.g., APD, #12, 5-10...)'}
              />
            </div>
            <a
              href={assetUrl('downloads/berard-profile.pdf')}
              target="_blank"
              rel="noreferrer"
              className="lab-btn"
              style={{
                ...styles.ghostBtn,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <MicroscopeIcon size={16} />
              {isArabic ? 'ملف المختبر' : 'Lab Profile'}
            </a>
          </div>

          <p style={{ ...styles.muted, fontSize: 12, opacity: 0.75 }}>
            {isArabic
              ? <>تلميح البحث: <b>#12</b> أو <b>5-10</b> أو <b>12, 15</b> أو <b>"auditory"</b></>
              : <>Search tip: <b>#12</b> or <b>5-10</b> or <b>12, 15</b> or <b>"auditory"</b></>
            }
          </p>

          {/* Category Filter Tabs - Visitor Mode Aware */}
          <div className="category-filters" style={{
            marginTop: 16,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.5)',
              marginLeft: 8,
            }}>
              {isArabic ? 'تصنيف:' : 'Filter:'}
            </span>
            {SLIDE_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              const isRecommended = category.id === getDefaultCategory(visitorMode) && category.id !== 'all';
              const slideCount = category.id === 'all'
                ? pptxSlides.length
                : category.slideIds.length;

              return (
                <button
                  key={category.id}
                  type="button"
                  className={`category-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 10,
                    border: `2px solid ${isActive ? category.color : 'rgba(255,255,255,0.1)'}`,
                    background: isActive
                      ? `${category.color}20`
                      : 'rgba(255,255,255,0.03)',
                    color: isActive ? category.color : 'rgba(255,255,255,0.6)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: isActive ? `0 0 20px ${category.color}30` : 'none',
                  }}
                  aria-pressed={isActive}
                  aria-label={isArabic ? category.labelAr : category.labelEn}
                >
                  <span style={{ fontSize: 14 }}>{category.icon}</span>
                  <span>{isArabic ? category.labelAr : category.labelEn}</span>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: 6,
                    background: isActive ? category.color + '30' : 'rgba(255,255,255,0.08)',
                    fontSize: 10,
                    fontFamily: 'monospace',
                  }}>
                    {slideCount}
                  </span>
                  {isRecommended && !isActive && (
                    <span style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: visitorConfig.color,
                      border: '2px solid #1a1f2e',
                      animation: 'pulse 2s infinite',
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Visitor Mode Context Banner */}
          {activeCategory !== 'all' && (
            <div style={{
              marginTop: 12,
              padding: '10px 14px',
              borderRadius: 10,
              background: `${SLIDE_CATEGORIES.find(c => c.id === activeCategory)?.color || brandCyan}15`,
              border: `1px solid ${SLIDE_CATEGORIES.find(c => c.id === activeCategory)?.color || brandCyan}30`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 12,
            }}>
              <span style={{ fontSize: 16 }}>
                {SLIDE_CATEGORIES.find(c => c.id === activeCategory)?.icon}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                {activeCategory === 'school' && (isArabic
                  ? 'عرض العينات المتعلقة بالبيئة التعليمية وصعوبات التعلم'
                  : 'Showing samples related to educational environment and learning difficulties')}
                {activeCategory === 'parent' && (isArabic
                  ? 'عرض العينات المهمة لفهم الأهل لحالة الطفل والنتائج'
                  : 'Showing samples important for parents to understand child condition and results')}
                {activeCategory === 'clinician' && (isArabic
                  ? 'عرض البيانات السريرية والتقنية للمختصين'
                  : 'Showing clinical and technical data for specialists')}
                {activeCategory === 'science' && (isArabic
                  ? 'عرض الأبحاث والدراسات العلمية الداعمة'
                  : 'Showing supporting research and scientific studies')}
              </span>
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                style={{
                  marginRight: 'auto',
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {isArabic ? 'عرض الكل' : 'Show All'}
              </button>
            </div>
          )}
        </div>

        {/* Flask Grid */}
        <div className="slides-grid" style={{
          marginTop: 24,
          display: 'grid',
          gap: 20,
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        }}>
          {slides.map((slide, index) => (
            <FlaskSlideCard
              key={slide.id}
              slide={slide}
              index={index}
              isActive={activeSlideId === slide.id}
              onClick={() => setActiveSlideId(slide.id)}
              isArabic={isArabic}
            />
          ))}
        </div>

        {/* Microscope Modal */}
        {activeSlide && (
          <MicroscopeModal
            slide={activeSlide}
            slides={slides}
            activeIndex={activeIndex}
            onClose={() => setActiveSlideId(null)}
            onNavigate={handleNavigate}
            modalRef={modalRef}
          />
        )}
      </div>
    </section>
  );
};

export default SlideViewer;
