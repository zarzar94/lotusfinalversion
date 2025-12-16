import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

import { checklistCategories, checklistItems, type ChecklistItem } from '../data/checklistItems';
import { assetUrl } from '../utils/asset';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../utils/pdf';
import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles } from './styles';
import { useGamification } from '../context/GamificationContext';

// Category icons and colors for visual appeal
const CATEGORY_CONFIG: Record<string, { icon: string; color: string }> = {
  'صعوبات أكاديمية ولغوية': { icon: '📚', color: brandCyan },
  'مؤشرات سمعية': { icon: '👂', color: brandPink },
  'تعلم وتركيز ووظائف تنفيذية': { icon: '🧠', color: brandPurple },
  'توازن وحركة': { icon: '⚖️', color: '#22c55e' },
  'سلوك ومزاج وصحة عامة': { icon: '💚', color: '#f59e0b' },
  'تشخيصات/حالات شائعة مرتبطة بالسمع/التعلم': { icon: '🔬', color: brandPurpleDark },
};

// Sound effects
const playSelectSound = (selected: boolean) => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(selected ? 880 : 440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(selected ? 1200 : 300, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch { /* Audio unavailable */ }
};

const playLaunchSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    // Deep rumble
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(60, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    // High ping
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1200, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
    gain2.gain.setValueAtTime(0.08, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.2);
  } catch { /* Audio unavailable */ }
};

const playExplosionSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    // Explosion noise
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + 0.4);

    // Impact thud
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
    oscGain.gain.setValueAtTime(0.2, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch { /* Audio unavailable */ }
};

// Missile component that flies from button to target
interface MissileProps {
  active: boolean;
  targetRef: React.RefObject<HTMLDivElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  onImpact: () => void;
  color: string;
}

function Missile({ active, targetRef, buttonRef, onImpact, color }: MissileProps) {
  const [position, setPosition] = useState({ x: 0, y: 0, visible: false, impacted: false });

  useEffect(() => {
    if (!active || !targetRef.current || !buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const targetRect = targetRef.current.getBoundingClientRect();

    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    setPosition({ x: startX, y: startY, visible: true, impacted: false });

    // Animate missile flight
    const duration = 400;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing - accelerate
      const eased = progress * progress;

      const currentX = startX + (endX - startX) * eased;
      const currentY = startY + (endY - startY) * eased;

      setPosition({ x: currentX, y: currentY, visible: true, impacted: false });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Impact!
        setPosition(prev => ({ ...prev, impacted: true }));
        playExplosionSound();
        onImpact();
        setTimeout(() => setPosition(prev => ({ ...prev, visible: false })), 600);
      }
    };

    requestAnimationFrame(animate);
  }, [active, targetRef, buttonRef, onImpact]);

  if (!position.visible) return null;

  return (
    <>
      {/* Missile */}
      {!position.impacted && (
        <div style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          zIndex: 10000,
          pointerEvents: 'none',
        }}>
          {/* Missile body */}
          <div style={{
            width: 12,
            height: 40,
            background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)',
            borderRadius: '6px 6px 2px 2px',
            position: 'relative',
            boxShadow: '0 0 20px rgba(220,38,38,0.8), 0 0 40px rgba(220,38,38,0.4)',
          }}>
            {/* Nose cone */}
            <div style={{
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '12px solid #dc2626',
            }} />
            {/* Fins */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: -6,
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderRight: '8px solid #7f1d1d',
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: -6,
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderLeft: '8px solid #7f1d1d',
            }} />
            {/* Exhaust flame */}
            <div style={{
              position: 'absolute',
              bottom: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 8,
              height: 25,
              background: 'linear-gradient(180deg, #fbbf24 0%, #f97316 40%, #dc2626 70%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(2px)',
              animation: 'flameFlicker 0.1s ease-in-out infinite',
            }} />
          </div>
        </div>
      )}

      {/* Explosion */}
      {position.impacted && (
        <div style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          pointerEvents: 'none',
        }}>
          {/* Central flash */}
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, #fff 0%, ${color} 30%, #f97316 60%, transparent 70%)`,
            animation: 'explosionFlash 0.4s ease-out forwards',
          }} />
          {/* Particles */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 80 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 8 + Math.random() * 8,
                  height: 8 + Math.random() * 8,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? '#fbbf24' : color,
                  boxShadow: `0 0 10px ${i % 2 === 0 ? '#fbbf24' : color}`,
                  ['--tx' as string]: `${tx}px`,
                  ['--ty' as string]: `${ty}px`,
                  animation: 'explosionParticle 0.5s ease-out forwards',
                }}
              />
            );
          })}
          {/* Shockwave ring */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: `3px solid ${color}`,
            animation: 'shockwave 0.4s ease-out forwards',
          }} />
        </div>
      )}
    </>
  );
}

interface ItemCardProps {
  item: ChecklistItem;
  isSelected: boolean;
  color: string;
  onToggle: () => void;
  animationDelay: number;
  isExiting: boolean;
  isHit: boolean;
}

function ItemCard({ item, isSelected, color, onToggle, animationDelay, isExiting, isHit }: ItemCardProps) {
  const [hovered, setHovered] = useState(false);

  const getAnimation = () => {
    if (isHit) return `itemExplode 0.5s ease-out ${animationDelay}s forwards`;
    if (isExiting) return `itemPop 0.4s ease-out ${animationDelay}s forwards`;
    return `itemEnter 0.5s ease-out ${animationDelay}s backwards`;
  };

  return (
    <button
      type="button"
      onClick={() => { playSelectSound(!isSelected); onToggle(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isSelected
          ? `linear-gradient(135deg, ${color}22, ${color}11)`
          : hovered ? 'rgba(255,255,255,0.04)' : 'rgba(15,22,41,0.5)',
        border: `2px solid ${isSelected ? color : hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 14,
        padding: '12px 14px',
        cursor: 'pointer',
        textAlign: 'right',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected ? `0 4px 20px ${color}33` : 'none',
        position: 'relative',
        overflow: 'hidden',
        animation: getAnimation(),
      }}
    >
      {/* Checkbox indicator */}
      <div style={{
        width: 26,
        height: 26,
        borderRadius: 8,
        border: `2px solid ${isSelected ? color : 'rgba(255,255,255,0.25)'}`,
        background: isSelected ? color : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s ease',
      }}>
        {isSelected && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: isSelected ? '#fff' : 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
          {item.ar}
        </div>
        {item.en && (
          <div style={{ fontSize: 11, color: isSelected ? color : 'rgba(255,255,255,0.45)', marginTop: 3, direction: 'ltr', textAlign: 'left' }}>
            {item.en}
          </div>
        )}
      </div>

      {/* Glow line when selected */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animation: 'scanLine 2s ease-in-out infinite',
        }} />
      )}
    </button>
  );
}

// Submarine-style missile launch button
interface LaunchButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLast?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

function LaunchButton({ onClick, disabled, isLast, buttonRef }: LaunchButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
      onClick();
    }, 150);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      style={{
        position: 'relative',
        width: 140,
        height: 140,
        borderRadius: '50%',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: 'transparent',
        outline: 'none',
        transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.15s ease',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {/* Outer metallic ring */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #3a3a3a 0%, #1a1a1a 50%, #2a2a2a 100%)',
        boxShadow: `
          inset 0 2px 4px rgba(255,255,255,0.1),
          inset 0 -2px 4px rgba(0,0,0,0.3),
          0 8px 30px rgba(0,0,0,0.5),
          0 0 60px rgba(220,38,38,${isHovered ? 0.3 : 0.1})
        `,
      }} />

      {/* Yellow warning stripe ring */}
      <div style={{
        position: 'absolute',
        inset: 8,
        borderRadius: '50%',
        background: `repeating-conic-gradient(
          from 0deg,
          #fbbf24 0deg 10deg,
          #1a1a1a 10deg 20deg
        )`,
        opacity: 0.9,
      }} />

      {/* Inner metallic bezel */}
      <div style={{
        position: 'absolute',
        inset: 16,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
      }} />

      {/* Red button surface */}
      <div style={{
        position: 'absolute',
        inset: 22,
        borderRadius: '50%',
        background: isPressed
          ? 'linear-gradient(145deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%)'
          : 'linear-gradient(145deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
        boxShadow: isPressed
          ? 'inset 0 4px 15px rgba(0,0,0,0.5)'
          : `
            inset 0 -4px 15px rgba(0,0,0,0.3),
            inset 0 4px 15px rgba(255,255,255,0.1),
            0 4px 20px rgba(220,38,38,0.4)
          `,
        transition: 'all 0.15s ease',
      }}>
        {/* Glass highlight */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: '30%',
          height: '20%',
          borderRadius: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent)',
          filter: 'blur(2px)',
        }} />
      </div>

      {/* Center icon/text */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        pointerEvents: 'none',
      }}>
        <span style={{ fontSize: 28, marginBottom: 2 }}>{isLast ? '✓' : '▶'}</span>
        <span style={{
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}>
          {isLast ? 'إنهاء' : 'التالي'}
        </span>
      </div>

      {/* Pulsing glow when active */}
      {!disabled && (
        <div style={{
          position: 'absolute',
          inset: -10,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220,38,38,0.3), transparent 70%)',
          animation: 'launchPulse 1.5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
    </button>
  );
}

// Back button (smaller, grey)
function BackButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      style={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: 'linear-gradient(145deg, #4a4a4a 0%, #2a2a2a 100%)',
        boxShadow: isHovered
          ? '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.1)'
          : '0 2px 10px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 20,
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.3 : 1,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      ◀
    </button>
  );
}

const Checklist = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');
  const [missileFired, setMissileFired] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const { completeChecklist } = useGamification();
  const sectionRef = useRef<HTMLDivElement>(null);
  const launchButtonRef = useRef<HTMLButtonElement>(null);

  const selectedItems = useMemo(() => checklistItems.filter((item) => selected[item.id]), [selected]);
  const selectedCount = selectedItems.length;
  const totalItems = checklistItems.length;
  const totalSections = checklistCategories.length;

  const currentCategory = checklistCategories[currentSection];
  const currentConfig = CATEGORY_CONFIG[currentCategory?.title] || { icon: '📊', color: brandCyan };
  const currentSelectedCount = currentCategory?.items.filter(item => selected[item.id]).length || 0;

  const categoryStats = useMemo(() => {
    return checklistCategories.map(cat => ({
      ...cat,
      selectedCount: cat.items.filter(item => selected[item.id]).length,
    }));
  }, [selected]);

  const recommendation = useMemo(() => {
    if (selectedCount <= 4) {
      return { level: 'low', label: 'مؤشرات قليلة', labelEn: 'Low', color: brandCyan, icon: '✅', msg: 'النتيجة لا تُعد تشخيصاً. إذا كانت هناك مخاوف، استشر مختصاً.' };
    }
    if (selectedCount <= 10) {
      return { level: 'medium', label: 'مؤشرات متوسطة', labelEn: 'Moderate', color: brandPurple, icon: '⚠️', msg: 'قد يكون من المفيد إجراء اختبار إضافي أو تجربة الألعاب السمعية.' };
    }
    return { level: 'high', label: 'مؤشرات مرتفعة', labelEn: 'High', color: brandPink, icon: '🔴', msg: 'ننصح بحجز تقييم متخصص — خاصة إذا كانت الأعراض تؤثر على المدرسة أو السلوك.' };
  }, [selectedCount]);

  const toggle = useCallback((id: string) => {
    setSelected(prev => {
      const newSelected = { ...prev, [id]: !prev[id] };
      if (Object.values(newSelected).filter(Boolean).length >= 5) completeChecklist();
      return newSelected;
    });
  }, [completeChecklist]);

  const goToNext = useCallback(() => {
    if (currentSection >= totalSections - 1 || isTransitioning || missileFired) return;
    playLaunchSound();
    setMissileFired(true);
  }, [currentSection, totalSections, isTransitioning, missileFired]);

  const handleMissileImpact = useCallback(() => {
    setIsHit(true);
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
    setTimeout(() => {
      setMissileFired(false);
      setIsHit(false);
      setTransitionDirection('next');
      setCurrentSection(prev => prev + 1);
    }, 600);
  }, []);

  const goToPrev = useCallback(() => {
    if (currentSection <= 0 || isTransitioning) return;
    setTransitionDirection('prev');
    setIsTransitioning(true);
  }, [currentSection, isTransitioning]);

  // Handle transition end (for prev only, next uses missile)
  useEffect(() => {
    if (isTransitioning && transitionDirection === 'prev') {
      const timer = setTimeout(() => {
        setCurrentSection(prev => prev - 1);
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, transitionDirection]);

  const clearAll = () => setSelected({});

  const exportSelectedPdf = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const doc = await createPdfDoc();
      let y = 56;
      doc.setFont('Cairo', 'bold');
      writePdfText(doc, 'تقرير الماسح العصبي — Berard AIT Sound Lab', PDF_MARGIN_X, y);
      y += 22;
      doc.setFont('Cairo', 'normal');
      writePdfText(doc, `عدد المؤشرات المحددة: ${selectedCount} من ${totalItems}`, PDF_MARGIN_X, y);
      y += 18;
      writePdfText(doc, `مستوى التقييم: ${recommendation.label}`, PDF_MARGIN_X, y);
      y += 18;
      writePdfText(doc, `ملاحظة: هذه القائمة مؤشر أولي وليست تشخيصاً.`, PDF_MARGIN_X, y);
      y += 26;

      if (selectedItems.length === 0) {
        writePdfText(doc, 'لم يتم تحديد أي مؤشر.', PDF_MARGIN_X, y);
      } else {
        for (const item of selectedItems) {
          if (y > 760) { doc.addPage(); y = 56; }
          doc.setFont('Cairo', 'bold');
          writePdfText(doc, `• ${item.ar}`, PDF_MARGIN_X, y);
          y += 16;
          if (item.en) { doc.setFont('Cairo', 'normal'); doc.text(item.en, PDF_MARGIN_X, y); y += 16; }
          y += 6;
        }
      }
      doc.save('Neural-Assessment-Report.pdf');
    } finally { setExporting(false); }
  };

  const isLastSection = currentSection === totalSections - 1;

  return (
    <section id="checklist" style={styles.sectionCard}>
      <style>{`
        @keyframes scanLine { 0% { transform: translateX(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(100%); opacity: 0; } }
        @keyframes radarSweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes launchPulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes itemEnter {
          0% { opacity: 0; transform: scale(0.3) translateY(30px); }
          60% { transform: scale(1.05) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes itemPop {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0) rotate(15deg); }
        }
        @keyframes sectionEnter {
          0% { opacity: 0; transform: translateX(100px) scale(0.8); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes sectionExit {
          0% { opacity: 1; transform: translateX(0) scale(1); }
          100% { opacity: 0; transform: translateX(-100px) scale(0.8); }
        }
        @keyframes sectionEnterPrev {
          0% { opacity: 0; transform: translateX(-100px) scale(0.8); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes sectionExitPrev {
          0% { opacity: 1; transform: translateX(0) scale(1); }
          100% { opacity: 0; transform: translateX(100px) scale(0.8); }
        }
        @keyframes explosionParticle {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }
        @keyframes explosionFlash {
          0% { opacity: 1; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes shockwave {
          0% { width: 20px; height: 20px; opacity: 1; }
          100% { width: 200px; height: 200px; opacity: 0; }
        }
        @keyframes flameFlicker {
          0%, 100% { transform: translateX(-50%) scaleY(1); }
          50% { transform: translateX(-50%) scaleY(0.8); }
        }
        @keyframes itemExplode {
          0% { opacity: 1; transform: scale(1) rotate(0deg); filter: brightness(1); }
          20% { opacity: 1; transform: scale(1.3) rotate(5deg); filter: brightness(2); }
          40% { opacity: 1; transform: scale(1.1) rotate(-3deg); filter: brightness(1.5); }
          100% { opacity: 0; transform: scale(0) rotate(45deg); filter: brightness(0); }
        }
        @keyframes screenShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>

      {/* Header */}
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>🔬 الماسح العصبي للتقييم</h2>
          <span style={{ ...styles.chip, background: `${recommendation.color}22`, borderColor: `${recommendation.color}44`, color: recommendation.color }}>
            {recommendation.icon} {selectedCount}/{totalItems}
          </span>
        </div>
        <p style={styles.bodyText}>حدد المؤشرات التي تلاحظها لبناء تقرير تقييمي أولي. كلما زادت المؤشرات، زادت أهمية التقييم المتخصص.</p>
      </div>

      {/* Progress Indicator */}
      <div style={{
        marginTop: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        {checklistCategories.map((cat, idx) => {
          const cfg = CATEGORY_CONFIG[cat.title] || { icon: '📊', color: brandCyan };
          const catSelected = categoryStats[idx]?.selectedCount || 0;
          const isActive = idx === currentSection;
          const isPast = idx < currentSection;

          return (
            <div
              key={cat.title}
              onClick={() => !isTransitioning && setCurrentSection(idx)}
              style={{
                width: isActive ? 50 : 36,
                height: isActive ? 50 : 36,
                borderRadius: '50%',
                background: isActive
                  ? `linear-gradient(135deg, ${cfg.color}, ${cfg.color}88)`
                  : isPast
                    ? `${cfg.color}44`
                    : 'rgba(255,255,255,0.08)',
                border: `2px solid ${isActive ? cfg.color : isPast ? cfg.color : 'rgba(255,255,255,0.15)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isActive ? 22 : 16,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? `0 0 25px ${cfg.color}66` : 'none',
                position: 'relative',
              }}
            >
              {cfg.icon}
              {catSelected > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: cfg.color,
                  fontSize: 10,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  border: '2px solid rgba(11,15,28,1)',
                }}>
                  {catSelected}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Missile */}
      <Missile
        active={missileFired}
        targetRef={sectionRef}
        buttonRef={launchButtonRef}
        onImpact={handleMissileImpact}
        color={currentConfig.color}
      />

      {/* Current Section */}
      <div
        ref={sectionRef}
        style={{
          marginTop: 24,
          padding: 24,
          background: isHit
            ? `linear-gradient(135deg, rgba(220,38,38,0.3), rgba(25,30,50,0.95))`
            : 'linear-gradient(135deg, rgba(11,15,28,0.95), rgba(25,30,50,0.95))',
          borderRadius: 24,
          border: `2px solid ${isHit ? '#dc2626' : currentConfig.color}44`,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 400,
          animation: screenShake
            ? 'screenShake 0.5s ease'
            : isTransitioning
              ? (transitionDirection === 'next' ? 'sectionExit 0.5s ease forwards' : 'sectionExitPrev 0.5s ease forwards')
              : (transitionDirection === 'next' ? 'sectionEnter 0.5s ease' : 'sectionEnterPrev 0.5s ease'),
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${currentConfig.color}08 1px, transparent 1px), linear-gradient(90deg, ${currentConfig.color}08 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />

        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${currentConfig.color}33, ${currentConfig.color}11)`,
            border: `2px solid ${currentConfig.color}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            boxShadow: `0 0 30px ${currentConfig.color}33`,
          }}>
            {currentConfig.icon}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#fff' }}>
              {currentCategory?.title}
            </h3>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              القسم {currentSection + 1} من {totalSections} • {currentSelectedCount} مؤشر محدد
            </div>
          </div>
          <div style={{
            padding: '10px 16px',
            borderRadius: 12,
            background: `${currentConfig.color}22`,
            border: `1px solid ${currentConfig.color}44`,
          }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: currentConfig.color, textAlign: 'center' }}>
              {currentSelectedCount}/{currentCategory?.items.length}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 10,
          position: 'relative',
          zIndex: 1,
        }}>
          {currentCategory?.items.map((item, idx) => (
            <ItemCard
              key={item.id}
              item={item}
              isSelected={!!selected[item.id]}
              color={currentConfig.color}
              onToggle={() => toggle(item.id)}
              animationDelay={idx * 0.03}
              isExiting={isTransitioning}
              isHit={isHit}
            />
          ))}
        </div>

        {/* Category Note */}
        {currentCategory?.note && (
          <div style={{
            marginTop: 16,
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            position: 'relative',
            zIndex: 1,
          }}>
            💡 {currentCategory.note}
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div style={{
        marginTop: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
      }}>
        <BackButton onClick={goToPrev} disabled={currentSection === 0 || isTransitioning} />

        <LaunchButton
          onClick={isLastSection ? exportSelectedPdf : goToNext}
          disabled={isTransitioning || missileFired || (isLastSection && selectedCount === 0)}
          isLast={isLastSection}
          buttonRef={launchButtonRef}
        />
      </div>

      {/* Launch instruction text */}
      <div style={{
        marginTop: 16,
        textAlign: 'center',
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
      }}>
        {isLastSection
          ? `اضغط الزر لتصدير التقرير • ${selectedCount} مؤشر محدد`
          : '🚀 اضغط الزر الأحمر لإطلاق الصاروخ وتدمير القسم الحالي'}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href={assetUrl('downloads/Check list (2).pdf')} target="_blank" rel="noreferrer" style={{ ...styles.ghostBtn, textDecoration: 'none' }}>
          📄 PDF الرسمي
        </a>
        {selectedCount > 0 && (
          <>
            <button type="button" style={styles.dangerBtn} onClick={clearAll}>🗑️ مسح الكل</button>
            <button
              type="button"
              style={exporting ? styles.disabledBtn : styles.primaryBtn}
              onClick={exportSelectedPdf}
              disabled={exporting}
            >
              {exporting ? '⏳ تصدير...' : `📊 تصدير التقرير`}
            </button>
          </>
        )}
        <a href="#games" style={{ ...styles.primaryBtn, textDecoration: 'none', background: `linear-gradient(135deg, ${brandPurple}, ${brandPink})` }}>🎮 الألعاب السمعية</a>
      </div>

      {/* Result Summary (shows when selections exist) */}
      {selectedCount > 0 && (
        <div style={{
          marginTop: 24,
          padding: 20,
          background: `linear-gradient(135deg, ${recommendation.color}15, transparent)`,
          border: `1px solid ${recommendation.color}33`,
          borderRadius: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 32 }}>{recommendation.icon}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: recommendation.color }}>{recommendation.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{recommendation.labelEn} Indicators</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
            {recommendation.msg}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ marginTop: 20, padding: 14, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: 22 }}>⚠️</span>
        <div>
          <div style={{ fontWeight: 800, color: '#f59e0b', marginBottom: 4, fontSize: 13 }}>تنبيه</div>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            هذه أداة فحص أولية وليست تشخيصاً. للتقييم الدقيق استشر مختصاً.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Checklist;
