/**
 * ProgressExport - Export user progress to PDF
 */

import { useState, useCallback, useEffect, memo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useGamification } from '../context/GamificationContext';
import { createPdfDoc, writePdfText, PDF_MARGIN_X } from '../utils/pdf';
import {
  brandCyan,
  brandPurple,
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
} from './styles';

// ═══════════════════════════════════════════════════════════════════════════
// PDF GENERATION
// ═══════════════════════════════════════════════════════════════════════════

const generateProgressPdf = async (
  isArabic: boolean,
  user: { name?: string; nameAr?: string; email?: string; role: string },
  clinicalProgress: {
    sessionsCompleted: number;
    streak: number;
    attentionScore: number;
    processingSpeed: number;
    auditoryDiscrimination: number;
    treatmentPhase: string;
    sessionDates: number[];
  } | null,
  gamificationState: {
    level: number;
    totalPoints: number;
    exploredBrainRegions: string[];
    slidesViewed: number[];
    gamesCompleted: string[];
    checklistCompleted: boolean;
  },
  achievements: { title: string; titleAr: string; icon: string; unlockedAt?: number }[]
): Promise<void> => {
  const doc = await createPdfDoc();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors (as RGB arrays)
  const cyanRGB: [number, number, number] = [143, 211, 204];
  const purpleRGB: [number, number, number] = [175, 132, 186];
  const darkBgRGB: [number, number, number] = [11, 15, 28];

  // Text helpers
  const text = {
    title: isArabic ? 'تقرير التقدم' : 'Progress Report',
    generated: isArabic ? 'تم الإنشاء' : 'Generated',
    userInfo: isArabic ? 'معلومات المستخدم' : 'User Information',
    name: isArabic ? 'الاسم' : 'Name',
    email: isArabic ? 'البريد الإلكتروني' : 'Email',
    role: isArabic ? 'الدور' : 'Role',
    clinicalProgress: isArabic ? 'التقدم السريري' : 'Clinical Progress',
    sessions: isArabic ? 'الجلسات المكتملة' : 'Sessions Completed',
    streak: isArabic ? 'الاستمرارية' : 'Current Streak',
    phase: isArabic ? 'مرحلة العلاج' : 'Treatment Phase',
    scores: isArabic ? 'الدرجات' : 'Scores',
    attention: isArabic ? 'الانتباه' : 'Attention',
    processing: isArabic ? 'سرعة المعالجة' : 'Processing Speed',
    auditory: isArabic ? 'التمييز السمعي' : 'Auditory Discrimination',
    gamification: isArabic ? 'الإنجازات والنشاط' : 'Achievements & Activity',
    level: isArabic ? 'المستوى' : 'Level',
    points: isArabic ? 'النقاط' : 'Points',
    brainRegions: isArabic ? 'مناطق الدماغ المستكشفة' : 'Brain Regions Explored',
    slidesViewed: isArabic ? 'الشرائح المشاهدة' : 'Slides Viewed',
    gamesCompleted: isArabic ? 'الألعاب المكتملة' : 'Games Completed',
    checklistStatus: isArabic ? 'قائمة التقييم' : 'Checklist Status',
    completed: isArabic ? 'مكتمل' : 'Completed',
    notCompleted: isArabic ? 'غير مكتمل' : 'Not Completed',
    unlockedAchievements: isArabic ? 'الإنجازات المفتوحة' : 'Unlocked Achievements',
    footer: isArabic ? 'Lotus × Bérard AIT - منصة التدريب السمعي' : 'Lotus × Bérard AIT - Auditory Training Platform',
    days: isArabic ? 'أيام' : 'days',
  };

  const phaseLabels: Record<string, { en: string; ar: string }> = {
    assessment: { en: 'Assessment', ar: 'تقييم' },
    active: { en: 'Active Treatment', ar: 'علاج نشط' },
    maintenance: { en: 'Maintenance', ar: 'صيانة' },
    completed: { en: 'Completed', ar: 'مكتمل' },
  };

  let y = 40;

  // Header background
  doc.setFillColor(...darkBgRGB);
  doc.rect(0, 0, pageWidth, 100, 'F');

  // Gradient line
  doc.setFillColor(...cyanRGB);
  doc.rect(0, 100, pageWidth / 2, 4, 'F');
  doc.setFillColor(...purpleRGB);
  doc.rect(pageWidth / 2, 100, pageWidth / 2, 4, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('Cairo', 'bold');
  y = writePdfText(doc, text.title, PDF_MARGIN_X, y + 20);

  // Generated date
  doc.setFontSize(10);
  doc.setFont('Cairo', 'normal');
  const dateStr = new Date().toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  writePdfText(doc, `${text.generated}: ${dateStr}`, PDF_MARGIN_X, y + 5);

  y = 130;

  // Section helper
  const drawSection = (title: string, startY: number): number => {
    doc.setFillColor(...cyanRGB);
    doc.rect(PDF_MARGIN_X, startY, 4, 20, 'F');
    doc.setTextColor(143, 211, 204);
    doc.setFontSize(14);
    doc.setFont('Cairo', 'bold');
    writePdfText(doc, title, PDF_MARGIN_X + 12, startY + 14);
    return startY + 35;
  };

  // Info row helper
  const drawInfoRow = (label: string, value: string, startY: number): number => {
    doc.setTextColor(120, 120, 140);
    doc.setFontSize(10);
    doc.setFont('Cairo', 'normal');
    writePdfText(doc, label, PDF_MARGIN_X, startY);
    doc.setTextColor(60, 60, 80);
    doc.setFontSize(11);
    doc.setFont('Cairo', 'bold');
    writePdfText(doc, value, PDF_MARGIN_X + 150, startY);
    return startY + 20;
  };

  // ════════════════════════════════════════════════════════════════════════
  // USER INFORMATION
  // ════════════════════════════════════════════════════════════════════════

  y = drawSection(text.userInfo, y);
  y = drawInfoRow(text.name, (isArabic ? user.nameAr : user.name) || 'N/A', y);
  y = drawInfoRow(text.email, user.email || 'N/A', y);
  y = drawInfoRow(text.role, user.role.charAt(0).toUpperCase() + user.role.slice(1), y);

  y += 15;

  // ════════════════════════════════════════════════════════════════════════
  // CLINICAL PROGRESS (if patient)
  // ════════════════════════════════════════════════════════════════════════

  if (clinicalProgress) {
    y = drawSection(text.clinicalProgress, y);
    y = drawInfoRow(text.sessions, `${clinicalProgress.sessionsCompleted}/20`, y);
    y = drawInfoRow(text.streak, `${clinicalProgress.streak} ${text.days}`, y);
    const phaseLabel = phaseLabels[clinicalProgress.treatmentPhase] || phaseLabels.assessment;
    y = drawInfoRow(text.phase, isArabic ? phaseLabel.ar : phaseLabel.en, y);

    y += 10;

    // Scores
    doc.setTextColor(120, 120, 140);
    doc.setFontSize(11);
    doc.setFont('Cairo', 'bold');
    writePdfText(doc, text.scores, PDF_MARGIN_X, y);
    y += 20;

    // Score cards
    const scoreBoxWidth = 140;
    const scores = [
      { label: text.attention, value: clinicalProgress.attentionScore, color: cyanRGB },
      { label: text.processing, value: clinicalProgress.processingSpeed, color: purpleRGB },
      { label: text.auditory, value: clinicalProgress.auditoryDiscrimination, color: [232, 160, 191] as [number, number, number] },
    ];

    let x = PDF_MARGIN_X;
    scores.forEach((score) => {
      // Box background
      doc.setFillColor(score.color[0], score.color[1], score.color[2]);
      doc.setGState(doc.GState({ opacity: 0.1 }));
      doc.roundedRect(x, y, scoreBoxWidth, 50, 6, 6, 'F');
      doc.setGState(doc.GState({ opacity: 1 }));

      // Score value
      doc.setTextColor(score.color[0], score.color[1], score.color[2]);
      doc.setFontSize(22);
      doc.setFont('Cairo', 'bold');
      doc.text(`${score.value}%`, x + scoreBoxWidth / 2, y + 25, { align: 'center' });

      // Label
      doc.setTextColor(100, 100, 120);
      doc.setFontSize(9);
      doc.setFont('Cairo', 'normal');
      doc.text(score.label, x + scoreBoxWidth / 2, y + 42, { align: 'center' });

      x += scoreBoxWidth + 15;
    });

    y += 70;
  }

  // ════════════════════════════════════════════════════════════════════════
  // GAMIFICATION & ACTIVITY
  // ════════════════════════════════════════════════════════════════════════

  y = drawSection(text.gamification, y);
  y = drawInfoRow(text.level, String(gamificationState.level), y);
  y = drawInfoRow(text.points, `${gamificationState.totalPoints} XP`, y);
  y = drawInfoRow(text.brainRegions, String(gamificationState.exploredBrainRegions.length), y);
  y = drawInfoRow(text.slidesViewed, String(gamificationState.slidesViewed.length), y);
  y = drawInfoRow(text.gamesCompleted, String(gamificationState.gamesCompleted.length), y);
  y = drawInfoRow(
    text.checklistStatus,
    gamificationState.checklistCompleted ? text.completed : text.notCompleted,
    y
  );

  y += 15;

  // ════════════════════════════════════════════════════════════════════════
  // ACHIEVEMENTS
  // ════════════════════════════════════════════════════════════════════════

  if (achievements.length > 0) {
    // Check if we need a new page
    if (y > pageHeight - 150) {
      doc.addPage();
      y = 40;
    }

    y = drawSection(text.unlockedAchievements, y);

    achievements.forEach((achievement, index) => {
      if (y > pageHeight - 50) {
        doc.addPage();
        y = 40;
      }

      doc.setTextColor(60, 60, 80);
      doc.setFontSize(11);
      doc.setFont('Cairo', 'normal');
      const achievementText = `${achievement.icon} ${isArabic ? achievement.titleAr : achievement.title}`;
      writePdfText(doc, achievementText, PDF_MARGIN_X, y);
      y += 18;
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // FOOTER
  // ════════════════════════════════════════════════════════════════════════

  doc.setTextColor(150, 150, 160);
  doc.setFontSize(9);
  doc.setFont('Cairo', 'normal');
  doc.text(text.footer, pageWidth / 2, pageHeight - 30, { align: 'center' });

  // Download
  const fileName = isArabic ? 'تقرير-التقدم.pdf' : 'progress-report.pdf';
  doc.save(fileName);
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ProgressExportButtonProps {
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressExportButton = memo(({
  variant = 'primary',
  size = 'md',
}: ProgressExportButtonProps) => {
  const { isArabic } = useLanguage();
  const { user, clinicalProgress } = useUser();
  const { state, getUnlockedAchievements } = useGamification();

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (!user || isExporting) return;

    setIsExporting(true);
    try {
      await generateProgressPdf(
        isArabic,
        user,
        clinicalProgress,
        {
          level: state.level,
          totalPoints: state.totalPoints,
          exploredBrainRegions: state.exploredBrainRegions,
          slidesViewed: state.slidesViewed,
          gamesCompleted: state.gamesCompleted,
          checklistCompleted: state.checklistCompleted,
        },
        getUnlockedAchievements()
      );
    } catch (error) {
      console.error('Failed to export progress:', error);
    } finally {
      setIsExporting(false);
    }
  }, [user, clinicalProgress, state, getUnlockedAchievements, isArabic, isExporting]);

  // Listen for export-progress event from ProfileMenu
  useEffect(() => {
    const handleExportEvent = () => {
      if (user && !isExporting) {
        handleExport();
      }
    };
    window.addEventListener('export-progress', handleExportEvent);
    return () => window.removeEventListener('export-progress', handleExportEvent);
  }, [handleExport, user, isExporting]);

  if (!user) return null;

  const sizeStyles = {
    sm: { padding: `${spacing[1.5]}px ${spacing[3]}px`, fontSize: typography.size.xs },
    md: { padding: `${spacing[2.5]}px ${spacing[4]}px`, fontSize: typography.size.sm },
    lg: { padding: `${spacing[3]}px ${spacing[5]}px`, fontSize: typography.size.base },
  };

  const variantStyles = {
    primary: {
      background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
      border: 'none',
      color: colors.surface.base,
      boxShadow: shadows.glow.cyan,
    },
    secondary: {
      background: `${brandCyan}15`,
      border: `1px solid ${brandCyan}40`,
      color: brandCyan,
      boxShadow: 'none',
    },
    minimal: {
      background: 'transparent',
      border: `1px solid ${colors.border.default}`,
      color: colors.text.secondary,
      boxShadow: 'none',
    },
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      style={{
        ...sizeStyles[size],
        ...variantStyles[variant],
        borderRadius: radius.lg,
        fontWeight: typography.weight.bold,
        fontFamily: typography.fontFamily,
        cursor: isExporting ? 'wait' : 'pointer',
        opacity: isExporting ? 0.7 : 1,
        transition: transitions.fast,
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[2],
      }}
    >
      <span>{isExporting ? '⏳' : '📄'}</span>
      {isExporting
        ? (isArabic ? 'جاري التصدير...' : 'Exporting...')
        : (isArabic ? 'تصدير التقرير' : 'Export Report')}
    </button>
  );
});
ProgressExportButton.displayName = 'ProgressExportButton';

export default ProgressExportButton;
