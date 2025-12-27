import { useMemo, useState } from 'react';

import { pptxSlides } from '../data/pptxSlides';
import { assetUrl } from '../utils/asset';
import {
  brandCyan,
  brandPink,
  brandPurple,
  brandPurpleDark,
  styles,
  labTech,
  audioColors,
  spacing,
  radius,
  colors,
} from './styles';
import LabButton from './labui/LabButton';
import LabButtonAnchor from './labui/LabButtonAnchor';
import { renderLabIcon, ChartIcon, WarningTriangleIcon, ChecklistIcon, ReportIcon, DownloadIcon } from './icons/index';

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

const css = `
  @keyframes hudPulse {
    0%, 100% { opacity: 0.5; box-shadow: 0 0 4px ${brandPink}; }
    50% { opacity: 1; box-shadow: 0 0 10px ${brandPink}; }
  }
  @keyframes scanLine {
    0% { left: -20%; opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { left: 120%; opacity: 0; }
  }
  @keyframes dataStream {
    0% { transform: translateY(100%); opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { transform: translateY(-100%); opacity: 0; }
  }
  @keyframes cardGlow {
    0%, 100% { box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
    50% { box-shadow: 0 8px 32px rgba(176,18,112,0.2); }
  }
  .results-hud-corner {
    position: absolute;
    width: 14px;
    height: 14px;
    border-color: ${brandPink};
    border-style: solid;
    animation: hudPulse 3s ease-in-out infinite;
  }
  .results-scan-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 80px;
    background: linear-gradient(90deg, transparent, ${brandPink}25, transparent);
    animation: scanLine 4s linear infinite;
    pointer-events: none;
  }
  .results-data-particle {
    position: absolute;
    width: 2px;
    height: 6px;
    background: ${brandPink};
    opacity: 0.4;
    animation: dataStream 3s linear infinite;
  }
  .case-study-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(176,18,112,0.25) !important;
    border-color: ${brandPink} !important;
  }
  @media (max-width: 640px) {
    .case-studies-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

const ResultsSection = () => {
  const [activeSlideId, setActiveSlideId] = useState<number | null>(null);

  const activeSlide = useMemo(() => {
    if (!activeSlideId) return null;
    return pptxSlides.find((s) => s.id === activeSlideId) ?? null;
  }, [activeSlideId]);

  return (
    <section id="results" style={{
      ...styles.sectionCard,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{css}</style>

      {/* HUD Corner Brackets */}
      <div className="results-hud-corner" style={{ top: 8, left: 8, borderWidth: '2px 0 0 2px' }} />
      <div className="results-hud-corner" style={{ top: 8, right: 8, borderWidth: '2px 2px 0 0' }} />
      <div className="results-hud-corner" style={{ bottom: 8, left: 8, borderWidth: '0 0 2px 2px' }} />
      <div className="results-hud-corner" style={{ bottom: 8, right: 8, borderWidth: '0 2px 2px 0' }} />

      {/* Scan Line Effect */}
      <div className="results-scan-line" />

      {/* Data Stream Particles */}
      <div className="results-data-particle" style={{ right: '12%', animationDelay: '0s' }} />
      <div className="results-data-particle" style={{ right: '32%', animationDelay: '1s' }} />
      <div className="results-data-particle" style={{ right: '52%', animationDelay: '2s' }} />

      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${brandPink}22, ${brandPurple}22)`,
              border: `1px solid ${brandPink}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${brandPink}15`,
            }}>
              <ChartIcon size={22} tone="pink" />
            </div>
            <div>
              <h2 style={{ ...styles.h2, margin: 0 }}>نتائج ودراسات حالة (قبل / بعد)</h2>
              <div style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: 1,
                marginTop: 4,
              }}>
                LOTUS SOUND LAB // CLINICAL OUTCOMES DATA
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              ...styles.chip,
              background: `linear-gradient(135deg, ${brandPink}15, ${brandPurple}10)`,
              borderColor: `${brandPink}35`,
            }}>
              <span style={{ color: brandPink, fontWeight: 700 }}>CASE STUDIES</span>
            </span>
            <span style={{
              padding: '6px 12px',
              background: colors.successLight,
              border: `1px solid ${colors.success}4d`,
              borderRadius: 8,
              fontSize: 10,
              fontWeight: 700,
              color: colors.success,
              fontFamily: 'monospace',
            }}>
              {caseStudies.length} RECORDS
            </span>
          </div>
        </div>
        <p style={{ ...styles.bodyText, marginTop: 8 }}>
          أمثلة توضيحية من الشرائح تعرض تغيّرات قبل/بعد في بعض القياسات أو المؤشرات السمعية.
          تُعرض هنا لأغراض تعليمية/توعوية ولا تُعد ضماناً أو نتيجة متوقعة لكل حالة.
        </p>
        <div style={{
          marginTop: 8,
          padding: '8px 14px',
          background: colors.warningSubtle,
          border: `1px solid ${colors.warning}33`,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>
            <WarningTriangleIcon size={14} tone="warning" />
          </span>
          <p style={{ ...styles.muted, margin: 0, fontSize: 12 }}>
            لا تشكّل هذه الأمثلة تشخيصاً طبياً. أي قرار علاجي يجب أن يكون عبر مختص.
          </p>
        </div>
      </div>

      <div className="case-studies-grid" style={{
        marginTop: 20,
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      }}>
        {caseStudies.map((cs, index) => {
          const slide = pptxSlides.find((s) => s.id === cs.slideId);
          if (!slide) return null;
          return (
            <button
              key={cs.slideId}
              type="button"
              className="case-study-card"
              style={{
                ...styles.gameCard,
                textAlign: 'start',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                border: `1px solid ${labTech.borders.default}`,
                transition: 'all 0.3s ease',
              }}
              onClick={() => setActiveSlideId(cs.slideId)}
            >
              {/* Card glow bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${brandPink}66, ${brandCyan}66, transparent)`,
                opacity: 0.6,
              }} />

              {/* Image with overlay */}
              <div style={{ position: 'relative' }}>
                <img
                  src={assetUrl(slide.thumb)}
                  alt={slide.title}
                  style={{
                    width: '100%',
                    borderRadius: 10,
                    border: `1px solid ${labTech.borders.subtle}`,
                  }}
                  loading="lazy"
                />
                {/* Case number badge */}
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  padding: '4px 10px',
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${brandPink}40`,
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  color: brandPink,
                  fontFamily: 'monospace',
                }}>
                  CASE #{index + 1}
                </div>
              </div>

              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                <div style={{
                  fontWeight: 900,
                  color: brandCyan,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: brandCyan,
                    boxShadow: `0 0 6px ${brandCyan}`,
                  }} />
                  {cs.label}
                </div>
                <span style={{
                  ...styles.chip,
                  background: 'rgba(0,0,0,0.3)',
                  borderColor: `${brandPink}30`,
                  fontSize: 9,
                  fontFamily: 'monospace',
                }}>
                  SLIDE {cs.slideId}
                </span>
              </div>
              <div style={{ marginTop: 8, fontWeight: 900, color: brandPurpleDark, lineHeight: 1.35 }}>
                {slide.title}
              </div>
              <div style={{
                marginTop: 6,
                ...styles.muted,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: colors.warning,
                }} />
                {cs.focus}
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{
                  ...styles.chip,
                  background: `${brandCyan}12`,
                  borderColor: `${brandCyan}30`,
                  fontSize: 10,
                }}>
                  <span style={{ color: brandCyan }}>◀</span> قبل
                </span>
                <span style={{
                  ...styles.chip,
                  background: `${brandPurple}12`,
                  borderColor: `${brandPurple}30`,
                  fontSize: 10,
                }}>
                  <span style={{ color: brandPurple }}>▶</span> بعد
                </span>
                <span style={{
                  ...styles.chip,
                  background: `${brandPink}12`,
                  borderColor: `${brandPink}30`,
                  fontSize: 10,
                }}>
                  <span style={{ color: brandPink }}>⇄</span> مقارنة
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <LabButtonAnchor
          href="#pptx"
          variant="primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <ReportIcon size={16} tone="cyan" /> عرض جميع الشرائح
        </LabButtonAnchor>
        <LabButtonAnchor
          href="#contact"
          variant="ghost"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <ChecklistIcon size={16} tone="cyan" /> اطلب تقييم / عرض للمدرسة
        </LabButtonAnchor>
      </div>

      {/* System Status Footer */}
      <div style={{
        marginTop: 24,
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: radius.lg,
        border: `1px solid ${labTech.borders.subtle}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            fontSize: 9,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: 1,
          }}>
            LOTUS SOUND LAB // CASE STUDY DATABASE
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: colors.success,
              boxShadow: `0 0 6px ${colors.success}`,
            }} />
            <span style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: colors.success,
              letterSpacing: 0.5,
            }}>
              DATA VERIFIED
            </span>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{
            fontSize: 9,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: 0.5,
          }}>
            {caseStudies.length} CASES • EDUCATIONAL USE
          </span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[brandCyan, brandPurple, brandPink].map((color, i) => (
              <div key={i} style={{
                width: 12,
                height: 4,
                borderRadius: 2,
                background: color,
                opacity: 0.6,
              }} />
            ))}
          </div>
        </div>
      </div>

      {activeSlide ? (
        <div style={styles.modalBackdrop} onClick={() => setActiveSlideId(null)} role="dialog" aria-modal="true">
          <div style={{ ...styles.modal, padding: 18 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.14)', borderColor: 'rgba(176,18,112,0.25)' }}>
                  <ChartIcon size={14} tone="pink" /> شريحة {activeSlide.id}
                </span>
                <div style={{ fontWeight: 900, fontSize: 18, color: brandPurpleDark }}>{activeSlide.title}</div>
              </div>
              <LabButton variant="ghost" onClick={() => setActiveSlideId(null)}>
                إغلاق
              </LabButton>
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
              <LabButtonAnchor href={assetUrl(activeSlide.image)} download variant="primary">
                تحميل الصورة
              </LabButtonAnchor>
              <LabButtonAnchor
                href="#pptx"
                variant="ghost"
                onClick={() => setActiveSlideId(null)}
              >
                فتح في عارض الشرائح
              </LabButtonAnchor>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ResultsSection;
