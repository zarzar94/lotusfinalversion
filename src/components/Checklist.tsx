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

const playRadarPing = () => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch { /* Audio unavailable */ }
};

const playLaunchSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
  } catch { /* Audio unavailable */ }
};

// Radar blip item on the radar display
interface RadarBlipProps {
  item: ChecklistItem;
  isSelected: boolean;
  angle: number;
  distance: number;
  color: string;
  onToggle: () => void;
  isHit: boolean;
  radarAngle: number;
}

function RadarBlip({ item, isSelected, angle, distance, color, onToggle, isHit, radarAngle }: RadarBlipProps) {
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  // Check if radar sweep is near this blip
  const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const normalizedRadar = ((radarAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const angleDiff = Math.abs(normalizedAngle - normalizedRadar);
  const isSwept = angleDiff < 0.3 || angleDiff > (Math.PI * 2 - 0.3);

  return (
    <button
      type="button"
      onClick={() => { playSelectSound(!isSelected); onToggle(); }}
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        width: isSelected ? 60 : 48,
        height: isSelected ? 60 : 48,
        borderRadius: 8,
        background: isHit
          ? 'rgba(220,38,38,0.9)'
          : isSelected
            ? `linear-gradient(135deg, ${color}99, ${color}55)`
            : isSwept
              ? `rgba(143,211,204,0.35)`
              : 'rgba(11,15,28,0.8)',
        border: `2px solid ${isSelected ? color : isSwept ? brandCyan : 'rgba(143,211,204,0.3)'}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        boxShadow: isSelected
          ? `0 0 20px ${color}66, 0 0 40px ${color}33`
          : isSwept
            ? `0 0 15px ${brandCyan}44`
            : '0 2px 8px rgba(0,0,0,0.3)',
        animation: isHit ? 'blipExplode 0.5s ease-out forwards' : isSelected ? 'blipPulse 1.5s ease-in-out infinite' : 'none',
        zIndex: isSelected ? 10 : 1,
      }}
    >
      {/* Blip indicator */}
      <div style={{
        width: isSelected ? 20 : 14,
        height: isSelected ? 20 : 14,
        borderRadius: '50%',
        background: isSelected ? '#fff' : isSwept ? brandCyan : 'rgba(143,211,204,0.6)',
        boxShadow: isSelected ? `0 0 10px ${color}` : 'none',
        transition: 'all 0.2s ease',
      }} />

      {/* Selection checkmark */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: -8,
          right: -8,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: color,
          border: '2px solid rgba(11,15,28,1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Item label on hover */}
      <div style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(11,15,28,0.95)',
        border: `1px solid ${color}44`,
        borderRadius: 8,
        padding: '6px 10px',
        fontSize: 11,
        fontWeight: 700,
        color: '#fff',
        whiteSpace: 'nowrap',
        marginBottom: 6,
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 0.2s ease',
        maxWidth: 160,
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
        className="blip-label"
      >
        {item.ar}
      </div>

      <style>{`
        button:hover .blip-label { opacity: 1; }
      `}</style>
    </button>
  );
}

// Missile component
interface MissileProps {
  active: boolean;
  startPos: { x: number; y: number };
  targetPos: { x: number; y: number };
  onImpact: () => void;
  color: string;
}

function Missile({ active, startPos, targetPos, onImpact, color }: MissileProps) {
  const [position, setPosition] = useState({ x: 0, y: 0, visible: false, impacted: false });

  useEffect(() => {
    if (!active) return;

    setPosition({ x: startPos.x, y: startPos.y, visible: true, impacted: false });

    const duration = 350;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress * progress;

      const currentX = startPos.x + (targetPos.x - startPos.x) * eased;
      const currentY = startPos.y + (targetPos.y - startPos.y) * eased;

      setPosition({ x: currentX, y: currentY, visible: true, impacted: false });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setPosition(prev => ({ ...prev, impacted: true }));
        playExplosionSound();
        onImpact();
        setTimeout(() => setPosition(prev => ({ ...prev, visible: false })), 500);
      }
    };

    requestAnimationFrame(animate);
  }, [active, startPos, targetPos, onImpact]);

  if (!position.visible) return null;

  const angle = Math.atan2(targetPos.y - startPos.y, targetPos.x - startPos.x);

  return (
    <>
      {!position.impacted && (
        <div style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) rotate(${angle + Math.PI / 2}rad)`,
          zIndex: 1000,
          pointerEvents: 'none',
        }}>
          <div style={{
            width: 10,
            height: 30,
            background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)',
            borderRadius: '5px 5px 2px 2px',
            position: 'relative',
            boxShadow: '0 0 15px rgba(220,38,38,0.8)',
          }}>
            <div style={{
              position: 'absolute',
              bottom: -15,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 6,
              height: 20,
              background: 'linear-gradient(180deg, #fbbf24 0%, #f97316 40%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(2px)',
            }} />
          </div>
        </div>
      )}

      {position.impacted && (
        <div style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          pointerEvents: 'none',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `radial-gradient(circle, #fff 0%, ${color} 30%, #f97316 60%, transparent 70%)`,
            animation: 'explosionFlash 0.4s ease-out forwards',
          }} />
        </div>
      )}
    </>
  );
}

// Launch button
interface LaunchButtonProps {
  onClick: () => void;
  disabled?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

function LaunchButton({ onClick, disabled, buttonRef }: LaunchButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsPressed(true);
    playLaunchSound();
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
        width: 120,
        height: 120,
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

      {/* Warning stripe ring */}
      <div style={{
        position: 'absolute',
        inset: 6,
        borderRadius: '50%',
        background: `repeating-conic-gradient(from 0deg, #fbbf24 0deg 10deg, #1a1a1a 10deg 20deg)`,
        opacity: 0.9,
      }} />

      {/* Inner bezel */}
      <div style={{
        position: 'absolute',
        inset: 14,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
      }} />

      {/* Red button */}
      <div style={{
        position: 'absolute',
        inset: 20,
        borderRadius: '50%',
        background: isPressed
          ? 'linear-gradient(145deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%)'
          : 'linear-gradient(145deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
        boxShadow: isPressed
          ? 'inset 0 4px 15px rgba(0,0,0,0.5)'
          : `inset 0 -4px 15px rgba(0,0,0,0.3), inset 0 4px 15px rgba(255,255,255,0.1), 0 4px 20px rgba(220,38,38,0.4)`,
        transition: 'all 0.15s ease',
      }}>
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

      {/* Icon */}
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
        <span style={{ fontSize: 24, marginBottom: 2 }}>🚀</span>
        <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1 }}>إطلاق</span>
      </div>

      {/* Pulsing glow */}
      {!disabled && (
        <div style={{
          position: 'absolute',
          inset: -8,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220,38,38,0.3), transparent 70%)',
          animation: 'launchPulse 1.5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
    </button>
  );
}

// Category navigation tabs
interface CategoryTabProps {
  category: typeof checklistCategories[number];
  isActive: boolean;
  selectedCount: number;
  onClick: () => void;
  config: { icon: string; color: string };
}

function CategoryTab({ category, isActive, selectedCount, onClick, config }: CategoryTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${config.color}33, ${config.color}11)`
          : 'rgba(11,15,28,0.6)',
        border: `2px solid ${isActive ? config.color : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 12,
        padding: '10px 14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.2s ease',
        minWidth: 140,
        boxShadow: isActive ? `0 4px 20px ${config.color}33` : 'none',
      }}
    >
      <span style={{ fontSize: 20 }}>{config.icon}</span>
      <div style={{ textAlign: 'right', flex: 1 }}>
        <div style={{
          fontSize: 11,
          fontWeight: 800,
          color: isActive ? config.color : 'rgba(255,255,255,0.8)',
          lineHeight: 1.2,
        }}>
          {category.title.slice(0, 20)}...
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
          {selectedCount}/{category.items.length}
        </div>
      </div>
      {selectedCount > 0 && (
        <div style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: config.color,
          fontSize: 10,
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}>
          {selectedCount}
        </div>
      )}
    </button>
  );
}

const Checklist = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [radarAngle, setRadarAngle] = useState(0);
  const [missileTarget, setMissileTarget] = useState<{ item: ChecklistItem; pos: { x: number; y: number } } | null>(null);
  const [hitItems, setHitItems] = useState<Set<string>>(new Set());
  const { completeChecklist } = useGamification();
  const radarRef = useRef<HTMLDivElement>(null);
  const launchButtonRef = useRef<HTMLButtonElement>(null);

  const selectedItems = useMemo(() => checklistItems.filter((item) => selected[item.id]), [selected]);
  const selectedCount = selectedItems.length;
  const totalItems = checklistItems.length;

  const currentCategory = checklistCategories[currentSection];
  const currentConfig = CATEGORY_CONFIG[currentCategory?.title] || { icon: '📊', color: brandCyan };

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

  // Radar sweep animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle(prev => {
        const newAngle = prev + 0.03;
        // Play ping sound occasionally
        if (Math.random() < 0.02) playRadarPing();
        return newAngle;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const toggle = useCallback((id: string) => {
    setSelected(prev => {
      const newSelected = { ...prev, [id]: !prev[id] };
      if (Object.values(newSelected).filter(Boolean).length >= 5) completeChecklist();
      return newSelected;
    });
  }, [completeChecklist]);

  // Calculate blip positions in a circular pattern
  const getBlipPosition = (index: number, total: number, radarSize: number) => {
    const angleStep = (Math.PI * 2) / total;
    const angle = index * angleStep - Math.PI / 2;
    const rings = 3;
    const ringIndex = index % rings;
    const distance = (radarSize / 2.5) * (0.5 + ringIndex * 0.25);
    return { angle, distance };
  };

  const handleLaunch = () => {
    const selectedInCategory = currentCategory?.items.filter(item => selected[item.id]);
    if (!selectedInCategory || selectedInCategory.length === 0 || !radarRef.current || !launchButtonRef.current) return;

    // Target a random selected item
    const targetItem = selectedInCategory[Math.floor(Math.random() * selectedInCategory.length)];
    const targetIndex = currentCategory.items.findIndex(i => i.id === targetItem.id);
    const radarRect = radarRef.current.getBoundingClientRect();
    const buttonRect = launchButtonRef.current.getBoundingClientRect();

    const { angle, distance } = getBlipPosition(targetIndex, currentCategory.items.length, radarRect.width);
    const targetX = radarRect.width / 2 + Math.cos(angle) * distance;
    const targetY = radarRect.height / 2 + Math.sin(angle) * distance;

    const startX = buttonRect.left + buttonRect.width / 2 - radarRect.left;
    const startY = buttonRect.top + buttonRect.height / 2 - radarRect.top;

    setMissileTarget({
      item: targetItem,
      pos: { x: targetX, y: targetY },
    });

    setTimeout(() => {
      setHitItems(prev => new Set([...prev, targetItem.id]));
      setTimeout(() => {
        setSelected(prev => ({ ...prev, [targetItem.id]: false }));
        setHitItems(prev => {
          const next = new Set(prev);
          next.delete(targetItem.id);
          return next;
        });
        setMissileTarget(null);
      }, 500);
    }, 350);
  };

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

  const radarSize = 380;
  const currentSelectedInCategory = currentCategory?.items.filter(item => selected[item.id]).length || 0;

  return (
    <section id="checklist" style={styles.sectionCard}>
      <style>{`
        @keyframes radarSweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes blipPulse { 0%, 100% { box-shadow: 0 0 10px currentColor; } 50% { box-shadow: 0 0 25px currentColor, 0 0 50px currentColor; } }
        @keyframes blipExplode {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
        }
        @keyframes explosionFlash {
          0% { opacity: 1; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes launchPulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes scanLine { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateY(100%); opacity: 0; } }
      `}</style>

      {/* Header */}
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>🔬 الماسح العصبي للتقييم</h2>
          <span style={{ ...styles.chip, background: `${recommendation.color}22`, borderColor: `${recommendation.color}44`, color: recommendation.color }}>
            {recommendation.icon} {selectedCount}/{totalItems}
          </span>
        </div>
        <p style={styles.bodyText}>حدد المؤشرات على الرادار لبناء تقرير تقييمي. اضغط الزر الأحمر لتدمير المؤشرات المحددة.</p>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        padding: '16px 0',
        marginBottom: 16,
      }}>
        {checklistCategories.map((cat, idx) => {
          const cfg = CATEGORY_CONFIG[cat.title] || { icon: '📊', color: brandCyan };
          return (
            <CategoryTab
              key={cat.title}
              category={cat}
              isActive={idx === currentSection}
              selectedCount={categoryStats[idx]?.selectedCount || 0}
              onClick={() => setCurrentSection(idx)}
              config={cfg}
            />
          );
        })}
      </div>

      {/* Radar Display Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}>
        {/* Category Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 20px',
          background: `linear-gradient(135deg, ${currentConfig.color}22, transparent)`,
          border: `1px solid ${currentConfig.color}44`,
          borderRadius: 16,
        }}>
          <span style={{ fontSize: 28 }}>{currentConfig.icon}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: currentConfig.color }}>{currentCategory?.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              {currentSelectedInCategory} مؤشر محدد من {currentCategory?.items.length}
            </div>
          </div>
        </div>

        {/* Radar Display */}
        <div
          ref={radarRef}
          style={{
            width: radarSize,
            height: radarSize,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(11,15,28,0.95) 0%, rgba(11,15,28,0.98) 100%)',
            border: `3px solid ${brandCyan}44`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `
              0 0 60px rgba(143,211,204,0.15),
              inset 0 0 100px rgba(143,211,204,0.05)
            `,
          }}
        >
          {/* Grid circles */}
          {[0.25, 0.5, 0.75, 1].map((scale, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: `${scale * 100}%`,
                height: `${scale * 100}%`,
                borderRadius: '50%',
                border: `1px solid ${brandCyan}22`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}

          {/* Cross lines */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 1,
            background: `linear-gradient(180deg, transparent, ${brandCyan}33, transparent)`,
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${brandCyan}33, transparent)`,
          }} />

          {/* Radar sweep line */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '50%',
              height: 2,
              background: `linear-gradient(90deg, ${brandCyan} 0%, transparent 100%)`,
              transformOrigin: '0 50%',
              transform: `rotate(${radarAngle}rad)`,
              boxShadow: `0 0 20px ${brandCyan}`,
            }}
          />

          {/* Sweep glow trail */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '50%',
              height: '50%',
              background: `conic-gradient(from ${radarAngle - 0.5}rad at 0% 0%, transparent, ${brandCyan}33, transparent)`,
              transformOrigin: '0 0',
              transform: 'rotate(0deg)',
              borderRadius: '0 100% 0 0',
            }}
          />

          {/* Center dot */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: brandCyan,
            boxShadow: `0 0 20px ${brandCyan}`,
          }} />

          {/* Blips */}
          {currentCategory?.items.map((item, idx) => {
            const { angle, distance } = getBlipPosition(idx, currentCategory.items.length, radarSize);
            return (
              <RadarBlip
                key={item.id}
                item={item}
                isSelected={!!selected[item.id]}
                angle={angle}
                distance={distance}
                color={currentConfig.color}
                onToggle={() => toggle(item.id)}
                isHit={hitItems.has(item.id)}
                radarAngle={radarAngle}
              />
            );
          })}

          {/* Missile */}
          {missileTarget && radarRef.current && launchButtonRef.current && (
            <Missile
              active={true}
              startPos={{
                x: radarSize / 2,
                y: radarSize + 80,
              }}
              targetPos={missileTarget.pos}
              onImpact={() => {}}
              color={currentConfig.color}
            />
          )}

          {/* Scan line effect */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${brandCyan}66, transparent)`,
            animation: 'scanLine 3s linear infinite',
          }} />
        </div>

        {/* Launch Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}>
          <LaunchButton
            onClick={handleLaunch}
            disabled={currentSelectedInCategory === 0}
            buttonRef={launchButtonRef}
          />
          <div style={{
            textAlign: 'center',
            maxWidth: 160,
          }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
              اضغط الزر الأحمر
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: currentConfig.color }}>
              لتدمير المؤشرات
            </div>
          </div>
        </div>
      </div>

      {/* Category Note */}
      {currentCategory?.note && (
        <div style={{
          marginTop: 20,
          padding: '12px 16px',
          background: `linear-gradient(135deg, ${currentConfig.color}10, transparent)`,
          border: `1px solid ${currentConfig.color}33`,
          borderRadius: 12,
          fontSize: 13,
          color: 'rgba(255,255,255,0.75)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>💡</span>
          {currentCategory.note}
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
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
              {exporting ? '⏳ تصدير...' : `📊 تصدير التقرير (${selectedCount})`}
            </button>
          </>
        )}
        <a href="#games" style={{ ...styles.primaryBtn, textDecoration: 'none', background: `linear-gradient(135deg, ${brandPurple}, ${brandPink})` }}>🎮 الألعاب السمعية</a>
      </div>

      {/* Result Summary */}
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
