import { useMemo, useState, useCallback } from 'react';

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

// Sound effect for selection
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

interface ItemCardProps {
  item: ChecklistItem;
  isSelected: boolean;
  color: string;
  onToggle: () => void;
}

function ItemCard({ item, isSelected, color, onToggle }: ItemCardProps) {
  const [hovered, setHovered] = useState(false);

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

const Checklist = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const { completeChecklist } = useGamification();

  const selectedItems = useMemo(() => checklistItems.filter((item) => selected[item.id]), [selected]);
  const selectedCount = selectedItems.length;
  const totalItems = checklistItems.length;

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

  return (
    <section id="checklist" style={styles.sectionCard}>
      <style>{`
        @keyframes scanLine { 0% { transform: translateX(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(100%); opacity: 0; } }
        @keyframes radarSweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
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

      {/* Scanner Dashboard */}
      <div style={{
        marginTop: 20,
        padding: 24,
        background: 'linear-gradient(135deg, rgba(11,15,28,0.95), rgba(25,30,50,0.95))',
        borderRadius: 20,
        border: `1px solid ${recommendation.color}33`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(143,211,204,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(143,211,204,0.03) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, position: 'relative', zIndex: 1 }}>
          {/* Radar Visualization */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 160, height: 160 }}>
              {/* Radar rings */}
              {[100, 70, 40].map((size, i) => (
                <div key={size} style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: `${size}%`, height: `${size}%`, borderRadius: '50%',
                  border: `1px solid ${recommendation.color}${25 + i * 15}`,
                }} />
              ))}
              {/* Sweep line */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: '50%', height: 2,
                background: `linear-gradient(90deg, ${recommendation.color}, transparent)`,
                transformOrigin: 'left center',
                animation: 'radarSweep 3s linear infinite',
              }} />
              {/* Center */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 50, height: 50, borderRadius: '50%',
                background: `radial-gradient(circle, ${recommendation.color}44, transparent)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
              }}>
                {recommendation.icon}
              </div>
              {/* Data points */}
              {categoryStats.map((cat, idx) => {
                if (cat.selectedCount === 0) return null;
                const angle = (idx / categoryStats.length) * Math.PI * 2 - Math.PI / 2;
                const dist = 25 + (cat.selectedCount / cat.items.length) * 45;
                const cfg = CATEGORY_CONFIG[cat.title] || { color: brandCyan };
                return (
                  <div key={cat.title} style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`,
                    width: 10, height: 10, borderRadius: '50%',
                    background: cfg.color, boxShadow: `0 0 8px ${cfg.color}`,
                    animation: 'pulse 2s ease-in-out infinite', animationDelay: `${idx * 0.15}s`,
                  }} />
                );
              })}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: recommendation.color }}>{recommendation.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{recommendation.labelEn} Indicators</div>
            </div>
          </div>

          {/* Stats Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, color: 'rgba(255,255,255,0.6)' }}>
                <span>مستوى المؤشرات</span>
                <span style={{ color: recommendation.color, fontWeight: 700 }}>{selectedCount} / {totalItems}</span>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(selectedCount / totalItems) * 100}%`,
                  background: `linear-gradient(90deg, ${brandCyan}, ${recommendation.color})`,
                  transition: 'width 0.4s ease', borderRadius: 5,
                }} />
              </div>
            </div>

            {/* Category mini-bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {categoryStats.map(cat => {
                const cfg = CATEGORY_CONFIG[cat.title] || { icon: '📊', color: brandCyan };
                return (
                  <div key={cat.title} style={{
                    padding: '8px 10px',
                    background: cat.selectedCount > 0 ? `${cfg.color}11` : 'rgba(255,255,255,0.02)',
                    borderRadius: 10, border: `1px solid ${cat.selectedCount > 0 ? `${cfg.color}33` : 'rgba(255,255,255,0.05)'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                      <span style={{ fontSize: 12 }}>{cfg.icon}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cat.title.length > 12 ? cat.title.slice(0, 12) + '...' : cat.title}
                      </span>
                      <span style={{ fontSize: 10, color: cfg.color, fontWeight: 700 }}>{cat.selectedCount}</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${(cat.selectedCount / cat.items.length) * 100}%`, background: cfg.color, borderRadius: 2, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendation */}
            <div style={{ padding: 12, background: `${recommendation.color}15`, border: `1px solid ${recommendation.color}33`, borderRadius: 10 }}>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>{recommendation.msg}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href={assetUrl('downloads/Check list (2).pdf')} target="_blank" rel="noreferrer" style={{ ...styles.ghostBtn, textDecoration: 'none' }}>
          📄 PDF الرسمي
        </a>
        <button type="button" style={exporting || selectedCount === 0 ? styles.disabledBtn : styles.primaryBtn} onClick={exportSelectedPdf} disabled={exporting || selectedCount === 0}>
          {exporting ? '⏳ تصدير...' : `📊 تصدير التقرير (${selectedCount})`}
        </button>
        {selectedCount > 0 && <button type="button" style={styles.dangerBtn} onClick={clearAll}>🗑️ مسح</button>}
        <a href="#games" style={{ ...styles.primaryBtn, textDecoration: 'none', background: `linear-gradient(135deg, ${brandPurple}, ${brandPink})` }}>🎮 الألعاب السمعية</a>
      </div>

      {/* Category Accordions */}
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {checklistCategories.map(category => {
          const cfg = CATEGORY_CONFIG[category.title] || { icon: '📊', color: brandCyan };
          const isExpanded = expandedCat === category.title || expandedCat === null;
          const catCount = category.items.filter(item => selected[item.id]).length;

          return (
            <div key={category.title} style={{
              background: `linear-gradient(135deg, ${cfg.color}08, transparent)`,
              borderRadius: 16, border: `1px solid ${catCount > 0 ? `${cfg.color}44` : 'rgba(255,255,255,0.08)'}`,
              overflow: 'hidden', transition: 'border-color 0.3s',
            }}>
              {/* Category Header */}
              <button type="button" onClick={() => setExpandedCat(expandedCat === category.title ? null : category.title)}
                style={{ width: '100%', padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'right' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: `${cfg.color}22`, border: `2px solid ${cfg.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                }}>{cfg.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#f7f8fb', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {category.title}
                    {catCount > 0 && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, background: cfg.color, color: '#fff' }}>{catCount}</span>}
                  </div>
                  {category.note && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{category.note}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 50, height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${(catCount / category.items.length) * 100}%`, background: cfg.color, borderRadius: 3, transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ fontSize: 18, color: cfg.color, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>▼</span>
                </div>
              </button>

              {/* Items */}
              <div style={{ maxHeight: isExpanded ? 800 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                <div style={{ padding: '0 14px 14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
                  {category.items.map(item => (
                    <ItemCard key={item.id} item={item} isSelected={!!selected[item.id]} color={cfg.color} onToggle={() => toggle(item.id)} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
