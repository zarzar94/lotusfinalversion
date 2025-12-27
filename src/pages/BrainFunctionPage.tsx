import { useEffect, useMemo, useState, memo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBrainFunctionBySlug, BRAIN_FUNCTIONS, type BrainFunction } from '../data/brainFunctions';
import { brandCyan, brandPurple, brandPink, brandInk } from '../components/styles';
import { useLanguage } from '../context/LanguageContext';
import { renderBrainFunctionIcon, renderLabIcon, toneFromColor } from '../components/icons/index';
import { LabShell } from '../components/labui/LabShell';

// Mini circuit brain for navigation
function MiniCircuitBrain({ currentSlug }: { currentSlug: string }) {
  const navigate = useNavigate();
  const { isArabic } = useLanguage();

  return (
    <div style={{
      background: 'rgba(11,15,28,0.9)',
      borderRadius: 16,
      padding: 20,
      border: '1px solid rgba(143,211,204,0.2)',
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        fontWeight: 600,
      }}>
        {isArabic ? 'استكشف وظائف أخرى' : 'Explore Other Functions'}
      </h3>
      <svg
        width="200"
        height="160"
        viewBox="100 70 400 340"
        style={{ display: 'block', margin: '0 auto' }}
      >
        {/* Brain outline */}
        <path
          d="M300 90 C210 90 140 140 130 210 C120 280 145 350 195 385 C245 420 280 420 300 420 C320 420 355 420 405 385 C455 350 480 280 470 210 C460 140 390 90 300 90Z"
          fill="none"
          stroke="rgba(143,211,204,0.2)"
          strokeWidth="2"
        />
        {/* Nodes */}
        {BRAIN_FUNCTIONS.map((bf, i) => {
          const isActive = bf.slug === currentSlug;
          const colors = [brandCyan, brandPurple, brandPink];
          const color = colors[i % colors.length];
          return (
            <g
              key={bf.id}
              onClick={() => navigate(`/function/${bf.slug}`)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={bf.position.x}
                cy={bf.position.y}
                r={isActive ? 14 : 10}
                fill={isActive ? color : `${color}40`}
                stroke={color}
                strokeWidth={isActive ? 3 : 1}
                style={{
                  filter: isActive ? `drop-shadow(0 0 8px ${color})` : 'none',
                  transition: 'all 0.2s ease',
                }}
              />
              <title>{isArabic ? bf.labelAr : bf.labelEn}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Related functions sidebar
function RelatedFunctions({ currentSlug }: { currentSlug: string }) {
  const others = BRAIN_FUNCTIONS.filter((bf) => bf.slug !== currentSlug).slice(0, 4);
  const { isArabic } = useLanguage();

  return (
    <div style={{
      background: 'rgba(11,15,28,0.9)',
      borderRadius: 16,
      padding: 24,
      border: '1px solid rgba(143,211,204,0.2)',
    }}>
      <h3 style={{
        margin: '0 0 20px 0',
        fontSize: 16,
        color: brandCyan,
        fontWeight: 700,
      }}>
        {isArabic ? 'وظائف ذات صلة' : 'Related Functions'}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {others.map((bf) => (
          <Link
            key={bf.id}
            to={`/function/${bf.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 10,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(143,211,204,0.1)';
              e.currentTarget.style.borderColor = bf.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              {renderBrainFunctionIcon(bf.id, {
                tone: toneFromColor(bf.color),
                size: 22,
              })}
            </span>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>
              {isArabic ? bf.labelAr : bf.labelEn}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const BrainFunctionPage = memo(function BrainFunctionPage() {
  const { isArabic } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [brainFunction, setBrainFunction] = useState<BrainFunction | null>(null);

  useEffect(() => {
    if (slug) {
      const bf = getBrainFunctionBySlug(slug);
      if (bf) {
        setBrainFunction(bf);
        window.scrollTo(0, 0);
      } else {
        navigate('/');
      }
    }
  }, [slug, navigate]);

  const css = useMemo(() => `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .brain-page-container {
      animation: fadeInUp 0.6s ease-out;
    }
    .benefit-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .benefit-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.3);
    }
  `, []);

  if (!brainFunction) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: brandInk,
        color: '#fff',
      }}>
        {isArabic ? 'جارٍ التحميل...' : 'Loading...'}
      </div>
    );
  }

  const { color, labelEn, labelAr } = brainFunction;
  const content = isArabic && brainFunction.contentAr ? brainFunction.contentAr : brainFunction.content;
  const questionsTitle = isArabic ? 'هل تواجه أياً مما يلي؟' : 'Do any of these sound familiar?';
  const helpTitle = isArabic ? 'كيف يساعد Berard AIT' : 'How Berard AIT Can Help';
  const benefitsTitle = isArabic ? 'الفوائد المتوقعة' : 'Expected Benefits';
  const ctaTitle = isArabic ? `هل أنت مستعد لتحسين ${labelAr}؟` : `Ready to Improve Your ${labelEn}?`;
  const ctaSubtitle = isArabic ? 'ابدأ رحلتك مع Berard AIT اليوم' : 'Start your journey with Berard AIT today';
  const ctaButton = isArabic ? 'تواصل معنا اليوم' : 'Contact Us Today';
  const exploreAllTitle = isArabic ? 'استكشف جميع وظائف الدماغ' : 'Explore All Brain Functions';
  const backLabel = isArabic ? 'العودة إلى خريطة الدماغ' : 'Back to Brain Map';

  return (
    <LabShell variant="primary">
      <div style={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse at top, rgba(20,26,45,1) 0%, ${brandInk} 100%)`,
        color: '#fff',
        fontFamily: 'Cairo, system-ui, sans-serif',
      }}>
        <style>{css}</style>

      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '16px 24px',
        background: 'rgba(5,6,13,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: brandCyan,
            textDecoration: 'none',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <span style={{ fontSize: 20 }}>←</span>
          {backLabel}
        </Link>
        <Link
          to="/#contact"
          style={{
            padding: '10px 20px',
            background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`,
            color: brandInk,
            textDecoration: 'none',
            borderRadius: 25,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Get Started
        </Link>
      </header>

      <div className="brain-page-container" style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 24px 80px',
      }}>
        {/* Hero Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 40,
          marginBottom: 60,
        }}>
          {/* Main content */}
          <div>
            {/* Icon and title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginBottom: 24,
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                border: `2px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${color}40`,
              }}>
                {renderBrainFunctionIcon(brainFunction.id, {
                  tone: toneFromColor(color),
                  size: 36,
                  glow: true,
                })}
              </div>
              <div>
                <h1 style={{
                  margin: 0,
                  fontSize: 36,
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1.2,
                }}>
                  {content.title}
                </h1>
                <p style={{
                  margin: '8px 0 0',
                  fontSize: 18,
                  color: color,
                  fontWeight: 500,
                }}>
                  {content.subtitle}
                </p>
              </div>
            </div>

            {/* Questions */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 16,
              padding: 32,
              marginBottom: 32,
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <h2 style={{
                margin: '0 0 24px',
                fontSize: 20,
                color: color,
                fontWeight: 700,
              }}>
                {questionsTitle}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {content.questions.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 16,
                      padding: 16,
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: 12,
                      borderLeft: `4px solid ${color}`,
                    }}
                  >
                    <span style={{ color, fontSize: 20 }}>•</span>
                    <p style={{
                      margin: 0,
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: 'rgba(255,255,255,0.85)',
                    }}>
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div style={{
              background: `linear-gradient(135deg, ${color}15, ${color}05)`,
              borderRadius: 16,
              padding: 32,
              marginBottom: 32,
              border: `1px solid ${color}30`,
            }}>
              <h2 style={{
                margin: '0 0 20px',
                fontSize: 20,
                color: '#fff',
                fontWeight: 700,
              }}>
                {helpTitle}
              </h2>
              <p style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.9,
                color: 'rgba(255,255,255,0.9)',
              }}>
                {content.explanation}
              </p>
            </div>

            {/* Benefits */}
            <div>
              <h2 style={{
                margin: '0 0 24px',
                fontSize: 20,
                color: '#fff',
                fontWeight: 700,
              }}>
                {benefitsTitle}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
              }}>
                {content.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="benefit-card"
                    style={{
                      padding: 20,
                      background: 'rgba(11,15,28,0.8)',
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: `${color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: color,
                      fontSize: 16,
                    }}>
                      {renderLabIcon('✓', { size: 12, tone: 'success' })}
                    </span>
                    <span style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.9)',
                    }}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{
              marginTop: 48,
              padding: 32,
              background: `linear-gradient(135deg, ${brandPurple}20, ${brandCyan}20)`,
              borderRadius: 20,
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <h3 style={{
                margin: '0 0 12px',
                fontSize: 24,
                fontWeight: 700,
              }}>
                {ctaTitle}
              </h3>
              <p style={{
                margin: '0 0 24px',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 16,
              }}>
                {ctaSubtitle}
              </p>
              <Link
                to="/#contact"
                style={{
                  display: 'inline-block',
                  padding: '16px 40px',
                  background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`,
                  color: brandInk,
                  textDecoration: 'none',
                  borderRadius: 30,
                  fontSize: 16,
                  fontWeight: 700,
                  boxShadow: `0 8px 32px ${brandCyan}40`,
                }}
              >
                {ctaButton}
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation to other functions */}
        <div style={{
          marginTop: 60,
          paddingTop: 40,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          <h2 style={{
            margin: '0 0 32px',
            fontSize: 24,
            fontWeight: 700,
            textAlign: 'center',
          }}>
            {exploreAllTitle}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
          }}>
            {BRAIN_FUNCTIONS.map((bf) => {
              const isActive = bf.slug === slug;
              return (
                <Link
                  key={bf.id}
                  to={`/function/${bf.slug}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    padding: 20,
                    background: isActive ? `${bf.color}20` : 'rgba(255,255,255,0.03)',
                    borderRadius: 16,
                    textDecoration: 'none',
                    border: `2px solid ${isActive ? bf.color : 'rgba(255,255,255,0.08)'}`,
                    transition: 'all 0.2s ease',
                    opacity: isActive ? 1 : 0.7,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.borderColor = bf.color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.opacity = '0.7';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    }
                  }}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    filter: isActive ? `drop-shadow(0 0 8px ${bf.color})` : 'none',
                  }}>
                    {renderBrainFunctionIcon(bf.id, {
                      tone: toneFromColor(bf.color),
                      size: 28,
                    })}
                  </span>
                  <span style={{
                    color: isActive ? bf.color : '#fff',
                    fontWeight: 600,
                    fontSize: 14,
                    textAlign: 'center',
                  }}>
                    {bf.labelEn}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </LabShell>
  );
});

export default BrainFunctionPage;
