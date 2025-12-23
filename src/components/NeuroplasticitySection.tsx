import {
  styles,
  brandCyan,
  brandPink,
  brandPurple,
  brandPurpleDark,
  labTech,
  audioColors,
  spacing,
  radius,
} from './styles';

const css = `
  @keyframes hudPulse {
    0%, 100% { opacity: 0.5; box-shadow: 0 0 4px ${brandCyan}; }
    50% { opacity: 1; box-shadow: 0 0 10px ${brandCyan}; }
  }
  @keyframes scanLine {
    0% { left: -20%; opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { left: 120%; opacity: 0; }
  }
  @keyframes neuralPulse {
    0% { transform: scale(0.95); opacity: 0.7; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.7; }
  }
  @keyframes synapseFire {
    0%, 100% { box-shadow: 0 0 5px ${brandCyan}40; }
    50% { box-shadow: 0 0 20px ${brandCyan}80, 0 0 30px ${brandPurple}40; }
  }
  @keyframes dataStream {
    0% { transform: translateY(100%); opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { transform: translateY(-100%); opacity: 0; }
  }
  @keyframes brainWave {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.3); }
  }
  .neuro-hud-corner {
    position: absolute;
    width: 14px;
    height: 14px;
    border-color: ${brandCyan};
    border-style: solid;
    animation: hudPulse 3s ease-in-out infinite;
  }
  .neuro-scan-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 80px;
    background: linear-gradient(90deg, transparent, ${brandCyan}25, transparent);
    animation: scanLine 4s linear infinite;
    pointer-events: none;
  }
  .neuro-data-particle {
    position: absolute;
    width: 2px;
    height: 6px;
    background: ${brandCyan};
    opacity: 0.4;
    animation: dataStream 3s linear infinite;
  }
  .neural-card:hover {
    transform: translateY(-6px) !important;
    border-color: var(--card-color) !important;
    box-shadow: 0 12px 30px var(--card-glow) !important;
  }
  .neural-card:hover .neural-icon {
    animation: neuralPulse 1s ease-in-out infinite;
  }
  @media (max-width: 640px) {
    .brain-facts-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

const brainFactCards = [
  {
    icon: '🧠',
    title: 'الدماغ قابل للتغيير',
    description: 'الخلايا العصبية في أدمغتنا قابلة للتعديل وإعادة التشكيل طوال الحياة',
    color: brandCyan,
  },
  {
    icon: '🔄',
    title: 'إعادة التوصيل',
    description: 'يمكن للدماغ إنشاء مسارات عصبية جديدة من خلال التدريب المكثف والمتكرر',
    color: brandPurple,
  },
  {
    icon: '📈',
    title: 'التعلم مدى الحياة',
    description: 'اللدونة العصبية تمكّن التعلم والتحسن في أي عمر',
    color: brandPink,
  },
  {
    icon: '🎯',
    title: 'الكثافة والتكرار',
    description: 'التغيير يتطلب التعرض للنشاط بكثافة وتكرار ومدة كافية',
    color: brandPurpleDark,
  },
];

export default function NeuroplasticitySection() {
  return (
    <section id="neuroplasticity" style={{
      ...styles.sectionCard,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{css}</style>

      {/* HUD Corner Brackets */}
      <div className="neuro-hud-corner" style={{ top: 8, left: 8, borderWidth: '2px 0 0 2px' }} />
      <div className="neuro-hud-corner" style={{ top: 8, right: 8, borderWidth: '2px 2px 0 0' }} />
      <div className="neuro-hud-corner" style={{ bottom: 8, left: 8, borderWidth: '0 0 2px 2px' }} />
      <div className="neuro-hud-corner" style={{ bottom: 8, right: 8, borderWidth: '0 2px 2px 0' }} />

      {/* Scan Line Effect */}
      <div className="neuro-scan-line" />

      {/* Data Stream Particles */}
      <div className="neuro-data-particle" style={{ right: '10%', animationDelay: '0s' }} />
      <div className="neuro-data-particle" style={{ right: '30%', animationDelay: '1s' }} />
      <div className="neuro-data-particle" style={{ right: '50%', animationDelay: '2s' }} />

      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${brandCyan}22, ${brandPurple}22)`,
              border: `1px solid ${brandCyan}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              boxShadow: `0 0 25px ${brandCyan}15`,
              animation: 'synapseFire 3s ease-in-out infinite',
            }}>
              🧠
            </div>
            <div>
              <h2 style={{ ...styles.h2, margin: 0 }}>اللدونة العصبية: أساس التغيير</h2>
              <div style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: 1,
                marginTop: 4,
              }}>
                LOTUS SOUND LAB // NEUROPLASTICITY SCIENCE MODULE
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              ...styles.chip,
              background: `linear-gradient(135deg, ${brandPurple}15, ${brandCyan}10)`,
              borderColor: `${brandPurple}35`,
            }}>
              <span style={{ color: brandPurple, fontWeight: 700 }}>NEUROSCIENCE</span>
            </span>
            <span style={{
              padding: '6px 12px',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 8,
              fontSize: 10,
              fontWeight: 700,
              color: '#22c55e',
              fontFamily: 'monospace',
            }}>
              EVIDENCE-BASED
            </span>
          </div>
        </div>
      </div>

      {/* Quote Block */}
      <div style={{
        margin: '20px 0',
        padding: 24,
        background: `linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.08))`,
        borderRadius: 16,
        borderRight: `4px solid ${brandCyan}`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 10,
          right: 16,
          fontSize: 48,
          opacity: 0.15,
          color: brandCyan,
        }}>
          "
        </div>
        <p style={{
          fontSize: 18,
          lineHeight: 1.8,
          color: '#f7f8fb',
          margin: 0,
          fontWeight: 500,
        }}>
          اللدونة العصبية تعني أن الخلايا العصبية في أدمغتنا وأجهزتنا العصبية
          <span style={{ color: brandCyan, fontWeight: 800 }}> قابلة للتغيير</span>،
          أو يمكنها تعديل نفسها.
        </p>
        <div style={{
          marginTop: 12,
          fontSize: 14,
          color: 'rgba(255,255,255,0.7)',
          fontWeight: 700,
        }}>
          — نورمان دويدج، مؤلف كتاب "الدماغ الذي يُغيّر نفسه"
        </div>
      </div>

      {/* Explanation */}
      <div style={{ ...styles.bodyText, marginTop: 16 }}>
        <p style={{ margin: '0 0 12px' }}>
          يعتمد برنامج <b style={{ color: brandCyan }}>Berard AIT</b> على مبدأ اللدونة العصبية —
          قدرة الدماغ الرائعة على إعادة تنظيم نفسه من خلال تكوين روابط عصبية جديدة.
        </p>
        <p style={{ margin: 0 }}>
          لتحفيز هذه التغييرات، يتطلب البرنامج
          <span style={{ color: brandPink, fontWeight: 700 }}> التعرض لنشاط سمعي بكثافة وتكرار ومدة </span>
          كافية لإحداث تغييرات في معالجة الدماغ للصوت.
        </p>
      </div>

      {/* Fact Cards */}
      <div className="brain-facts-grid" style={{
        marginTop: 24,
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'
      }}>
        {brainFactCards.map((card, index) => (
          <div
            key={index}
            className="neural-card"
            style={{
              '--card-color': card.color,
              '--card-glow': `${card.color}22`,
              background: labTech.backgrounds.card,
              border: `1px solid ${card.color}33`,
              borderRadius: 16,
              padding: 18,
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            } as React.CSSProperties}
          >
            {/* Card top glow */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${card.color}66, transparent)`,
              opacity: 0.6,
            }} />

            <div className="neural-icon" style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${card.color}22, ${card.color}10)`,
              border: `1px solid ${card.color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              marginBottom: 14,
              boxShadow: `0 0 15px ${card.color}20`,
            }}>
              {card.icon}
            </div>
            <div style={{
              fontWeight: 800,
              color: card.color,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: card.color,
                boxShadow: `0 0 6px ${card.color}`,
              }} />
              {card.title}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
              {card.description}
            </div>

            {/* Card index badge */}
            <div style={{
              position: 'absolute',
              top: 10,
              right: 10,
              padding: '3px 8px',
              background: 'rgba(0,0,0,0.4)',
              border: `1px solid ${card.color}30`,
              borderRadius: 4,
              fontSize: 9,
              fontFamily: 'monospace',
              color: card.color,
            }}>
              0{index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Dr. Berard Quote */}
      <div style={{
        marginTop: 24,
        padding: 20,
        background: `linear-gradient(135deg, rgba(143,211,204,0.1), rgba(175,132,186,0.05))`,
        borderRadius: 14,
        border: `1px solid ${brandCyan}33`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 12,
          right: 16,
          fontSize: 40,
          opacity: 0.2,
          color: brandCyan,
        }}>
          "
        </div>
        <p style={{
          fontSize: 16,
          lineHeight: 1.8,
          color: '#f7f8fb',
          margin: 0,
          fontStyle: 'italic',
        }}>
          كل شيء يحدث كما لو أن السلوك البشري مشروط إلى حد كبير بالطريقة التي يسمع بها المرء.
        </p>
        <div style={{
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${brandCyan}33, ${brandPurple}33)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}>
            🧠
          </div>
          <div>
            <div style={{ fontWeight: 800, color: brandCyan }}>الدكتور جاي بيرارد</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              طبيب أنف وأذن وحنجرة • مخترع Berard AIT • أنيسي، فرنسا
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              مؤلف كتاب "Hearing Equals Behavior" • عالج أكثر من 8,000 مريض
            </div>
          </div>
        </div>
      </div>

      {/* How AIT Uses Neuroplasticity */}
      <div style={{
        marginTop: 20,
        padding: 20,
        background: `linear-gradient(135deg, rgba(176,18,112,0.1), rgba(143,211,204,0.1))`,
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <h3 style={{ ...styles.h3, marginTop: 0, color: brandPurple }}>
          كيف يستخدم Berard AIT اللدونة العصبية؟
        </h3>
        <ul style={{ margin: 0, paddingInlineStart: 18, lineHeight: 2, opacity: 0.92 }}>
          <li><b>الكثافة:</b> جلستان يومياً بموسيقى مُعدّلة خصيصاً</li>
          <li><b>التكرار:</b> 20 جلسة على مدار 10-12 يوماً</li>
          <li><b>المدة:</b> 30 دقيقة لكل جلسة مع فترات راحة للتكيف</li>
          <li><b>التحفيز:</b> ترددات صوتية متنوعة تحفز مناطق مختلفة من الدماغ</li>
        </ul>
        <div style={{
          marginTop: 12,
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 10,
          fontSize: 12,
          color: 'rgba(255,255,255,0.7)',
        }}>
          <b>الأجهزة المعتمدة:</b> AudioKinetron • Earducator • AIM (Auditory Integration Modulator)
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a href="#overview" style={{
          ...styles.primaryBtn,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span>📚</span> تعرف على البرنامج
        </a>
        <a href="#results" style={{
          ...styles.ghostBtn,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span>📊</span> شاهد النتائج
        </a>
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
            LOTUS SOUND LAB // NEUROPLASTICITY RESEARCH
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
              background: '#22c55e',
              boxShadow: '0 0 6px #22c55e',
            }} />
            <span style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: '#22c55e',
              letterSpacing: 0.5,
            }}>
              PEER REVIEWED
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
            BRAIN PLASTICITY • SOUND THERAPY
          </span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[brandCyan, brandPurple, brandPink, brandPurpleDark].map((color, i) => (
              <div key={i} style={{
                width: 10,
                height: 4,
                borderRadius: 2,
                background: color,
                opacity: 0.6,
              }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
