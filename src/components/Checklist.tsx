import { useMemo, useState, useCallback, ReactNode } from 'react';

import { checklistCategories, checklistItems, type ChecklistItem } from '../data/checklistItems';
import { useLanguage } from '../context/LanguageContext';
import { assetUrl } from '../utils/asset';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../utils/pdf';
import { playSelectSound } from '../utils/audio';
import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles, colors, labTech, radius, spacing, typography, transitions } from './styles';
import { useGamification } from '../context/GamificationContext';
import { useVisitorMode } from '../context/VisitorModeContext';
import {
  BookIcon,
  EarIcon,
  BrainIcon,
  BalanceIcon,
  HeartIcon,
  MicroscopeIcon,
  CheckCircleIcon,
  AlertIcon,
  AlertCircleIcon,
  LightbulbIcon,
  DocumentIcon,
  TrashIcon,
  ChartIcon,
  GamepadIcon,
} from './icons';
import LabCard from './labui/LabCard';
import LabButton from './labui/LabButton';
import LabButtonAnchor from './labui/LabButtonAnchor';

// Category icons and colors for visual appeal
const CATEGORY_CONFIG: Record<string, { icon: ReactNode; color: string }> = {
  'ØµØ¹ÙˆØ¨Ø§Øª Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© ÙˆÙ„ØºÙˆÙŠØ©': { icon: <BookIcon size={20} />, color: brandCyan },
  'Ù…Ø¤Ø´Ø±Ø§Øª Ø³Ù…Ø¹ÙŠØ©': { icon: <EarIcon size={20} />, color: brandPink },
  'ØªØ¹Ù„Ù… ÙˆØªØ±ÙƒÙŠØ² ÙˆÙˆØ¸Ø§Ø¦Ù ØªÙ†ÙÙŠØ°ÙŠØ©': { icon: <BrainIcon size={20} />, color: brandPurple },
  'ØªÙˆØ§Ø²Ù† ÙˆØ­Ø±ÙƒØ©': { icon: <BalanceIcon size={20} />, color: colors.success },
  'Ø³Ù„ÙˆÙƒ ÙˆÙ…Ø²Ø§Ø¬ ÙˆØµØ­Ø© Ø¹Ø§Ù…Ø©': { icon: <HeartIcon size={20} />, color: colors.warning },
  'ØªØ´Ø®ÙŠØµØ§Øª/Ø­Ø§Ù„Ø§Øª Ø´Ø§Ø¦Ø¹Ø© Ù…Ø±ØªØ¨Ø·Ø© Ø¨Ø§Ù„Ø³Ù…Ø¹/Ø§Ù„ØªØ¹Ù„Ù…': { icon: <MicroscopeIcon size={20} />, color: brandPurpleDark },
};

// Visitor-mode specific recommendations
const VISITOR_RECOMMENDATIONS = {
  school: {
    low: {
      titleEn: 'Screening Complete',
      titleAr: 'auto.Checklist.k1',
      messageEn: 'This student shows typical auditory processing indicators. Consider periodic rescreening.',
      messageAr: 'auto.Checklist.k2',
      actionEn: 'Continue to Sound Lab',
      actionAr: 'auto.Checklist.k3',
      actionPath: '#modules',
    },
    medium: {
      titleEn: 'Monitor Recommended',
      titleAr: 'auto.Checklist.k4',
      messageEn: 'Consider classroom accommodations and follow-up screening in 3-6 months.',
      messageAr: 'auto.Checklist.k5',
      actionEn: 'View Accommodations Guide',
      actionAr: 'auto.Checklist.k6',
      actionPath: '/resources#accommodations',
    },
    high: {
      titleEn: 'Professional Evaluation Advised',
      titleAr: 'auto.Checklist.k7',
      messageEn: 'Results suggest this student may benefit from professional auditory processing evaluation.',
      messageAr: 'auto.Checklist.k8',
      actionEn: 'Request School Demo',
      actionAr: 'auto.Checklist.k9',
      actionPath: '/contact?mode=school',
    },
  },
  parent: {
    low: {
      titleEn: 'Good Indicators',
      titleAr: 'auto.Checklist.k10',
      messageEn: 'Your child shows typical auditory processing patterns. Continue with the interactive games for more insights.',
      messageAr: 'auto.Checklist.k11',
      actionEn: 'Try Screening Games',
      actionAr: 'auto.Checklist.k12',
      actionPath: '#modules',
    },
    medium: {
      titleEn: 'Further Screening Suggested',
      titleAr: 'auto.Checklist.k13',
      messageEn: 'These indicators suggest completing the interactive screening tests would be beneficial.',
      messageAr: 'auto.Checklist.k14',
      actionEn: 'Start Full Assessment',
      actionAr: 'auto.Checklist.k15',
      actionPath: '#modules',
    },
    high: {
      titleEn: 'Book Professional Screening',
      titleAr: 'auto.Checklist.k16',
      messageEn: 'Based on these indicators, we recommend booking a professional screening with our team.',
      messageAr: 'auto.Checklist.k17',
      actionEn: 'Book Screening',
      actionAr: 'auto.Checklist.k18',
      actionPath: '/contact?mode=parent',
    },
  },
  clinician: {
    low: {
      titleEn: 'WNL - Screening Indicators',
      titleAr: 'auto.Checklist.k19',
      messageEn: 'Few behavioral indicators noted. Consider contextual factors before final determination.',
      messageAr: 'auto.Checklist.k20',
      actionEn: 'Proceed to Objective Tests',
      actionAr: 'auto.Checklist.k21',
      actionPath: '#modules',
    },
    medium: {
      titleEn: 'Borderline - Further Evaluation',
      titleAr: 'auto.Checklist.k22',
      messageEn: 'Moderate behavioral indicators. Objective testing recommended to clarify auditory processing status.',
      messageAr: 'auto.Checklist.k23',
      actionEn: 'View Clinical Protocol',
      actionAr: 'auto.Checklist.k24',
      actionPath: '/dashboard/clinician',
    },
    high: {
      titleEn: 'Significant Indicators - Comprehensive Eval',
      titleAr: 'auto.Checklist.k25',
      messageEn: 'Multiple behavioral markers present. Full audiological and APD battery recommended.',
      messageAr: 'auto.Checklist.k26',
      actionEn: 'Access Clinical Tools',
      actionAr: 'auto.Checklist.k27',
      actionPath: '/dashboard/clinician',
    },
  },
};

type RecommendationLevel = keyof typeof VISITOR_RECOMMENDATIONS.school;

type ChecklistRecommendation = {
  level: RecommendationLevel;
  label: string;
  labelEn: string;
  color: string;
  icon: ReactNode;
  msg: string;
};

const Checklist = () => {
  const { mode: visitorMode, config: visitorConfig, isSchool, isParent, isClinician } = useVisitorMode();
  const { t, isArabic } = useLanguage();

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const { completeChecklist } = useGamification();

  const selectedItems = useMemo(() => checklistItems.filter((item) => selected[item.id]), [selected]);
  const selectedCount = selectedItems.length;
  const totalItems = checklistItems.length;
  const totalCategories = checklistCategories.length;

  const currentCategory = checklistCategories[currentSection];
  const currentConfig = CATEGORY_CONFIG[currentCategory?.title] || { icon: <ChartIcon size={20} />, color: brandCyan };
  const currentSelectedInCategory = currentCategory?.items.filter(item => selected[item.id]).length || 0;
  const progressPct = Math.round(((currentSection + 1) / Math.max(1, totalCategories)) * 100);
  const isFirstStep = currentSection === 0;
  const isLastStep = currentSection === totalCategories - 1;

  const recommendation = useMemo<ChecklistRecommendation>(() => {
    if (selectedCount <= 4) {
      return { level: 'low', label: 'Ù…Ø¤Ø´Ø±Ø§Øª Ù‚Ù„ÙŠÙ„Ø©', labelEn: 'Low', color: brandCyan, icon: <CheckCircleIcon size={24} color={brandCyan} />, msg: 'Ø§Ù„Ù†ØªÙŠØ¬Ø© Ù„Ø§ ØªÙØ¹Ø¯ ØªØ´Ø®ÙŠØµØ§Ù‹. Ø¥Ø°Ø§ ÙƒØ§Ù†Øª Ù‡Ù†Ø§Ùƒ Ù…Ø®Ø§ÙˆÙØŒ Ø§Ø³ØªØ´Ø± Ù…Ø®ØªØµØ§Ù‹.' };
    }
    if (selectedCount <= 10) {
      return { level: 'medium', label: 'Ù…Ø¤Ø´Ø±Ø§Øª Ù…ØªÙˆØ³Ø·Ø©', labelEn: 'Moderate', color: brandPurple, icon: <AlertIcon size={24} color={brandPurple} />, msg: 'Ù‚Ø¯ ÙŠÙƒÙˆÙ† Ù…Ù† Ø§Ù„Ù…ÙÙŠØ¯ Ø¥Ø¬Ø±Ø§Ø¡ Ø§Ø®ØªØ¨Ø§Ø± Ø¥Ø¶Ø§ÙÙŠ Ø£Ùˆ ØªØ¬Ø±Ø¨Ø© Ø§Ù„Ø£Ù„Ø¹Ø§Ø¨ Ø§Ù„Ø³Ù…Ø¹ÙŠØ©.' };
    }
    return { level: 'high', label: 'Ù…Ø¤Ø´Ø±Ø§Øª Ù…Ø±ØªÙØ¹Ø©', labelEn: 'High', color: brandPink, icon: <AlertCircleIcon size={24} color={brandPink} />, msg: 'Ù†Ù†ØµØ­ Ø¨Ø­Ø¬Ø² ØªÙ‚ÙŠÙŠÙ… Ù…ØªØ®ØµØµ â€” Ø®Ø§ØµØ© Ø¥Ø°Ø§ ÙƒØ§Ù†Øª Ø§Ù„Ø£Ø¹Ø±Ø§Ø¶ ØªØ¤Ø«Ø± Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø¯Ø±Ø³Ø© Ø£Ùˆ Ø§Ù„Ø³Ù„ÙˆÙƒ.' };
  }, [selectedCount]);

  const handleNext = () => setCurrentSection((prev) => Math.min(prev + 1, totalCategories - 1));
  const handleBack = () => setCurrentSection((prev) => Math.max(prev - 1, 0));
  const handleFinish = () => {
    const summary = document.getElementById('checklist-summary');
    if (summary) summary.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };
  const backLabel = t('contactForm.actions.back', 'Back');
  const nextLabel = t('modules.next', 'Next');
  const finishLabel = isArabic ? 'Ø¥Ù†Ù‡Ø§Ø¡' : 'Finish';

  const toggle = useCallback((id: string) => {
    setSelected(prev => {
      const newSelected = { ...prev, [id]: !prev[id] };
      playSelectSound(newSelected[id]);
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
      writePdfText(doc, 'ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ù…Ø§Ø³Ø­ Ø§Ù„Ø¹ØµØ¨ÙŠ â€” Berard AIT Sound Lab', PDF_MARGIN_X, y);
      y += 22;
      doc.setFont('Cairo', 'normal');
      writePdfText(doc, `Ø¹Ø¯Ø¯ Ø§Ù„Ù…Ø¤Ø´Ø±Ø§Øª Ø§Ù„Ù…Ø­Ø¯Ø¯Ø©: ${selectedCount} Ù…Ù† ${totalItems}`, PDF_MARGIN_X, y);
      y += 18;
      writePdfText(doc, `Ù…Ø³ØªÙˆÙ‰ Ø§Ù„ØªÙ‚ÙŠÙŠÙ…: ${recommendation.label}`, PDF_MARGIN_X, y);
      y += 18;

      // Add visitor mode context
      const modeLabel = isSchool ? 'ÙØ­Øµ Ù…Ø¯Ø±Ø³ÙŠ' : isParent ? 'ÙØ­Øµ Ø£Ø³Ø±ÙŠ' : isClinician ? 'ØªÙ‚ÙŠÙŠÙ… Ø³Ø±ÙŠØ±ÙŠ' : 'ÙØ­Øµ Ø¹Ø§Ù…';
      writePdfText(doc, `Ù†ÙˆØ¹ Ø§Ù„ÙØ­Øµ: ${modeLabel}`, PDF_MARGIN_X, y);
      y += 18;

      // Add visitor-specific recommendation
      const visitorRec = VISITOR_RECOMMENDATIONS[visitorMode]?.[recommendation.level];
      if (visitorRec) {
        writePdfText(doc, `Ø§Ù„ØªÙˆØµÙŠØ©: ${visitorRec.titleAr}`, PDF_MARGIN_X, y);
        y += 16;
        writePdfText(doc, visitorRec.messageAr, PDF_MARGIN_X, y);
        y += 18;
      }

      writePdfText(doc, `Ù…Ù„Ø§Ø­Ø¸Ø©: Ù‡Ø°Ù‡ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ù…Ø¤Ø´Ø± Ø£ÙˆÙ„ÙŠ ÙˆÙ„ÙŠØ³Øª ØªØ´Ø®ÙŠØµØ§Ù‹.`, PDF_MARGIN_X, y);
      y += 26;

      if (selectedItems.length === 0) {
        writePdfText(doc, 'Ù„Ù… ÙŠØªÙ… ØªØ­Ø¯ÙŠØ¯ Ø£ÙŠ Ù…Ø¤Ø´Ø±.', PDF_MARGIN_X, y);
      } else {
        for (const item of selectedItems) {
          if (y > 760) { doc.addPage(); y = 56; }
          doc.setFont('Cairo', 'bold');
          writePdfText(doc, `â€¢ ${item.ar}`, PDF_MARGIN_X, y);
          y += 16;
          if (item.en) { doc.setFont('Cairo', 'normal'); doc.text(item.en, PDF_MARGIN_X, y); y += 16; }
          y += 6;
        }
      }
      doc.save('Neural-Assessment-Report.pdf');
    } finally { setExporting(false); }
  };

  return (
    <section id="checklist" style={{ scrollMarginTop: 92, marginBottom: spacing[5] }}>
      <LabCard
        variant="panel"
        padding={spacing[6]}
        style={{
          background: labTech.backgrounds.primary,
          border: '1px solid rgba(143,211,204,0.15)',
          boxShadow: '0 15px 40px rgba(0,0,0,0.4), 0 0 60px rgba(143,211,204,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
      {/* Top glow bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${brandCyan}, ${brandPink}, ${brandPurple}, transparent)`,
        opacity: 0.6,
      }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(143,211,204,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(143,211,204,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        opacity: 0.5,
      }} />

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>

      {/* Header - Lab Tech Style */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        padding: '12px 18px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${brandCyan}22, ${brandPink}22)`,
            border: `1px solid ${brandCyan}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MicroscopeIcon size={24} color={brandCyan} />
          </div>
          <div>
            <h2 style={{
              ...styles.h2,
              margin: 0,
              fontSize: 15,
              color: brandCyan,
              fontWeight: 800,
              letterSpacing: '0.5px',
            }}>
              {t('labTech.neuralScanner')}
            </h2>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>
              {t('checklist.subtitle')}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 8,
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: colors.success,
              animation: 'blink 2s ease-in-out infinite',
              boxShadow: `0 0 8px ${colors.success}`,
            }} />
            <span style={{ fontSize: 10, color: colors.success, fontWeight: 700 }}>{t('labTech.scanning')}</span>
          </div>
          <span style={{
            ...styles.chip,
            background: `${recommendation.color}22`,
            borderColor: `${recommendation.color}44`,
            color: recommendation.color,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            {recommendation.icon} {selectedCount}/{totalItems}
          </span>
        </div>
      </div>

      <p style={{
        ...styles.bodyText,
        marginBottom: 20,
        padding: '12px 16px',
        background: 'rgba(143,211,204,0.06)',
        border: '1px solid rgba(143,211,204,0.15)',
        borderRadius: 12,
        position: 'relative',
        zIndex: 1,
      }}>
        {t('checklist.description')}
      </p>

      {/* Progress */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[2],
        marginBottom: spacing[4],
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)',
        }}>
          <span>{currentSection + 1}/{totalCategories}</span>
          <span>{progressPct}%</span>
        </div>
        <div style={{
          height: 6,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progressPct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
          }} />
        </div>
      </div>

      {/* Step Content */}
      <div style={{
        background: 'rgba(11,15,28,0.7)',
        borderRadius: radius.xl,
        border: '1px solid rgba(255,255,255,0.08)',
        padding: spacing[4],
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: spacing[3] }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${currentConfig.color}22`,
            border: `1px solid ${currentConfig.color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {currentConfig.icon}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: currentConfig.color }}>{currentCategory?.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              {currentSelectedInCategory}/{currentCategory?.items.length}
            </div>
          </div>
        </div>

        {currentCategory?.note && (
          <div style={{
            marginBottom: spacing[3],
            padding: `${spacing[2]}px ${spacing[3]}px`,
            background: `${currentConfig.color}10`,
            border: `1px solid ${currentConfig.color}33`,
            borderRadius: radius.lg,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: 'rgba(255,255,255,0.75)',
            fontSize: 13,
          }}>
            <LightbulbIcon size={18} color={currentConfig.color} />
            {currentCategory.note}
          </div>
        )}

        <div style={{ display: 'grid', gap: spacing[2] }}>
          {currentCategory?.items.map((item) => {
            const isSelected = !!selected[item.id];
            const label = isArabic ? item.ar : item.en ?? item.ar;
            return (
              <button
                key={item.id}
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                onClick={() => toggle(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                  flexDirection: isArabic ? 'row-reverse' : 'row',
                  padding: `${spacing[2]}px ${spacing[3]}px`,
                  borderRadius: radius.lg,
                  border: `1px solid ${isSelected ? currentConfig.color : 'rgba(255,255,255,0.08)'}`,
                  background: isSelected
                    ? `linear-gradient(135deg, ${currentConfig.color}22, rgba(11,15,28,0.85))`
                    : 'rgba(11,15,28,0.5)',
                  color: 'rgba(255,255,255,0.85)',
                  textAlign: isArabic ? 'right' : 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                    border: `2px solid ${isSelected ? currentConfig.color : 'rgba(255,255,255,0.2)'}`,
                    background: isSelected ? currentConfig.color : 'transparent',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.text.primary,
                    flexShrink: 0,
                  }}
                >
                  {isSelected ? <CheckCircleIcon size={12} color={colors.text.primary} /> : null}
                </span>
                <span style={{ fontSize: 13, lineHeight: 1.6 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Navigation */}
      <div style={{
        marginTop: spacing[4],
        display: 'flex',
        justifyContent: 'space-between',
        gap: spacing[3],
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 1,
      }}>
        <LabButton variant="ghost" onClick={handleBack} disabled={isFirstStep}>
          {backLabel}
        </LabButton>
        <LabButton variant="primary" onClick={isLastStep ? handleFinish : handleNext}>
          {isLastStep ? finishLabel : nextLabel}
        </LabButton>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <LabButtonAnchor
          href={assetUrl('downloads/Check list (2).pdf')}
          variant="ghost"
          target="_blank"
          rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <DocumentIcon size={16} /> PDF Ø§Ù„Ø±Ø³Ù…ÙŠ
        </LabButtonAnchor>
        {selectedCount > 0 && (
          <>
            <LabButton
              variant="ghost"
              onClick={clearAll}
              style={{
                background: colors.errorLight,
                border: `1px solid ${colors.error}33`,
                color: colors.error,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <TrashIcon size={16} /> Ù…Ø³Ø­ Ø§Ù„ÙƒÙ„
            </LabButton>
            <LabButton
              variant="primary"
              onClick={exportSelectedPdf}
              disabled={exporting}
              style={exporting ? { background: colors.border.default, color: colors.text.muted, boxShadow: 'none' } : undefined}
            >
              <ChartIcon size={16} /> {exporting ? 'ØªØµØ¯ÙŠØ±...' : `ØªØµØ¯ÙŠØ± Ø§Ù„ØªÙ‚Ø±ÙŠØ± (${selectedCount})`}
            </LabButton>
          </>
        )}
        <LabButtonAnchor
          href="#modules"
          variant="primary"
          style={{
            background: `linear-gradient(135deg, ${brandPurple}, ${brandPink})`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <GamepadIcon size={16} /> Ø§Ù„Ø£Ù„Ø¹Ø§Ø¨ Ø§Ù„Ø³Ù…Ø¹ÙŠØ©
        </LabButtonAnchor>
      </div>

      {/* Result Summary with Visitor Mode Integration */}
      {selectedCount > 0 && (
        <div id="checklist-summary" style={{
          marginTop: 24,
          padding: 20,
          background: `linear-gradient(135deg, ${recommendation.color}15, rgba(13,17,23,0.8))`,
          border: `1px solid ${recommendation.color}33`,
          borderRadius: 16,
          position: 'relative',
          zIndex: 1,
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

          {/* Visitor-Specific Recommendation */}
          {(() => {
            const visitorRec = VISITOR_RECOMMENDATIONS[visitorMode]?.[recommendation.level];
            if (!visitorRec) return null;
            return (
              <div style={{
                marginTop: 16,
                padding: spacing[4],
                background: `${visitorConfig.color}10`,
                border: `1px solid ${visitorConfig.color}25`,
                borderRadius: radius.xl,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing[3],
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.lg,
                    background: `${visitorConfig.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}>
                    {visitorConfig.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: typography.size.sm,
                      fontWeight: typography.weight.bold,
                      color: visitorConfig.color,
                      marginBottom: spacing[1],
                    }}>
                      {isArabic ? t(visitorRec.titleAr, visitorRec.titleEn) : visitorRec.titleEn}
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: typography.size.sm,
                      color: colors.text.secondary,
                      lineHeight: typography.lineHeight.relaxed,
                    }}>
                      {isArabic ? t(visitorRec.messageAr, visitorRec.messageEn) : visitorRec.messageEn}
                    </p>
                  </div>
                  <a
                    href={visitorRec.actionPath}
                    style={{
                      padding: `${spacing[2]}px ${spacing[4]}px`,
                      background: `${visitorConfig.color}20`,
                      border: `1px solid ${visitorConfig.color}40`,
                      borderRadius: radius.lg,
                      fontSize: typography.size.xs,
                      fontWeight: typography.weight.bold,
                      color: visitorConfig.color,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: transitions.fast,
                    }}
                  >
                    {isArabic ? t(visitorRec.actionAr, visitorRec.actionEn) : visitorRec.actionEn}
                  </a>
                </div>
              </div>
            );
          })()}

          {/* Legacy Action links (fallback) */}
          <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {recommendation.level === 'medium' && !VISITOR_RECOMMENDATIONS[visitorMode] && (
              <a href="#modules" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: `${brandPurple}22`,
                border: `1px solid ${brandPurple}44`,
                borderRadius: 8,
                color: brandPurple,
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 700,
              }}>
                <GamepadIcon size={16} /> Ø¬Ø±Ù‘Ø¨ Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Ø§Ù„Ø³Ù…Ø¹ÙŠØ©
              </a>
            )}
            {recommendation.level === 'high' && !VISITOR_RECOMMENDATIONS[visitorMode] && (
              <a href="#contact" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: `${brandPink}22`,
                border: `1px solid ${brandPink}44`,
                borderRadius: 8,
                color: brandPink,
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 700,
              }}>
                Ø§Ø­Ø¬Ø² ØªÙ‚ÙŠÙŠÙ… Ù…ØªØ®ØµØµ
              </a>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ marginTop: 20, padding: 14, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 10, position: 'relative', zIndex: 1 }}>
        <AlertIcon size={24} color={colors.warning} style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 800, color: colors.warning, marginBottom: 4, fontSize: 13 }}>ØªÙ†Ø¨ÙŠÙ‡</div>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            Ù‡Ø°Ù‡ Ø£Ø¯Ø§Ø© ÙØ­Øµ Ø£ÙˆÙ„ÙŠØ© ÙˆÙ„ÙŠØ³Øª ØªØ´Ø®ÙŠØµØ§Ù‹. Ù„Ù„ØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ø¯Ù‚ÙŠÙ‚ Ø§Ø³ØªØ´Ø± Ù…Ø®ØªØµØ§Ù‹.
          </p>
        </div>
      </div>
      </LabCard>
    </section>
  );
};

export default Checklist;



