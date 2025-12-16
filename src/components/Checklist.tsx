import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

import { checklistCategories, checklistItems, type ChecklistItem } from '../data/checklistItems';
import { assetUrl } from '../utils/asset';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../utils/pdf';
import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles } from './styles';
import { useGamification } from '../context/GamificationContext';
import { ensureAudio, safeCloseAudio } from './games/audio';

// Category icons and colors for visual appeal
const CATEGORY_CONFIG: Record<string, { icon: string; color: string }> = {
  'صعوبات أكاديمية ولغوية': { icon: '📚', color: brandCyan },
  'مؤشرات سمعية': { icon: '👂', color: brandPink },
  'تعلم وتركيز ووظائف تنفيذية': { icon: '🧠', color: brandPurple },
  'توازن وحركة': { icon: '⚖️', color: '#22c55e' },
  'سلوك ومزاج وصحة عامة': { icon: '💚', color: '#f59e0b' },
  'تشخيصات/حالات شائعة مرتبطة بالسمع/التعلم': { icon: '🔬', color: brandPurpleDark },
};

interface ItemCardProps {
  item: ChecklistItem;
  isSelected: boolean;
  color: string;
  onSound: (selected: boolean) => void;
  onToggle: () => void;
  animationDelay: number;
  isExiting: boolean;
}

function ItemCard({ item, isSelected, color, onSound, onToggle, animationDelay, isExiting }: ItemCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => { onSound(!isSelected); onToggle(); }}
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
        animation: isExiting
          ? `itemPop 0.4s ease-out ${animationDelay}s forwards`
          : `itemEnter 0.5s ease-out ${animationDelay}s backwards`,
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
  onSound?: () => void;
  disabled?: boolean;
  isLast?: boolean;
}

function LaunchButton({ onClick, onSound, disabled, isLast }: LaunchButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsPressed(true);
    onSound?.();
    setTimeout(() => {
      setIsPressed(false);
      onClick();
    }, 300);
  };

  return (
    <button
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
  const audioRef = useRef<AudioContext | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');
  const { completeChecklist } = useGamification();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      void safeCloseAudio(audioRef);
    };
  }, []);

  const playSelectSound = useCallback((selectedValue: boolean) => {
    try {
      const audio = ensureAudio(audioRef);
      if (audio.state === 'suspended') void audio.resume().catch(() => {});

      const osc = audio.createOscillator();
      const gain = audio.createGain();
      const now = audio.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(selectedValue ? 880 : 440, now);
      osc.frequency.exponentialRampToValueAtTime(selectedValue ? 1200 : 300, now + 0.1);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(audio.destination);

      osc.start(now);
      osc.stop(now + 0.15);
      osc.onended = () => {
        try {
          osc.disconnect();
        } catch {
          // ignore
        }
        try {
          gain.disconnect();
        } catch {
          // ignore
        }
      };
    } catch {
      // Audio unavailable
    }
  }, []);

  const playLaunchSound = useCallback(() => {
    try {
      const audio = ensureAudio(audioRef);
      if (audio.state === 'suspended') void audio.resume().catch(() => {});

      const now = audio.currentTime;

      // Deep rumble
      const osc1 = audio.createOscillator();
      const gain1 = audio.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(60, now);
      osc1.frequency.exponentialRampToValueAtTime(30, now + 0.4);
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(audio.destination);
      osc1.start(now);
      osc1.stop(now + 0.45);
      osc1.onended = () => {
        try {
          osc1.disconnect();
        } catch {
          // ignore
        }
        try {
          gain1.disconnect();
        } catch {
          // ignore
        }
      };

      // High ping
      const osc2 = audio.createOscillator();
      const gain2 = audio.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1200, now);
      osc2.frequency.exponentialRampToValueAtTime(800, now + 0.2);
      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc2.connect(gain2);
      gain2.connect(audio.destination);
      osc2.start(now);
      osc2.stop(now + 0.25);
      osc2.onended = () => {
        try {
          osc2.disconnect();
        } catch {
          // ignore
        }
        try {
          gain2.disconnect();
        } catch {
          // ignore
        }
      };
    } catch {
      // Audio unavailable
    }
  }, []);

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
    if (currentSection >= totalSections - 1 || isTransitioning) return;
    setTransitionDirection('next');
    setIsTransitioning(true);
  }, [currentSection, totalSections, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (currentSection <= 0 || isTransitioning) return;
    setTransitionDirection('prev');
    setIsTransitioning(true);
  }, [currentSection, isTransitioning]);

  // Handle transition end
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setCurrentSection(prev => transitionDirection === 'next' ? prev + 1 : prev - 1);
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

      {/* Current Section */}
      <div
        ref={sectionRef}
        style={{
          marginTop: 24,
          padding: 24,
          background: 'linear-gradient(135deg, rgba(11,15,28,0.95), rgba(25,30,50,0.95))',
          borderRadius: 24,
          border: `2px solid ${currentConfig.color}44`,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 400,
          animation: isTransitioning
            ? (transitionDirection === 'next' ? 'sectionExit 0.5s ease forwards' : 'sectionExitPrev 0.5s ease forwards')
            : (transitionDirection === 'next' ? 'sectionEnter 0.5s ease' : 'sectionEnterPrev 0.5s ease'),
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
              onSound={playSelectSound}
              onToggle={() => toggle(item.id)}
              animationDelay={idx * 0.05}
              isExiting={isTransitioning}
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
          onSound={playLaunchSound}
          disabled={isTransitioning || (isLastSection && selectedCount === 0)}
          isLast={isLastSection}
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
          : 'اضغط الزر الأحمر للانتقال إلى القسم التالي'}
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
