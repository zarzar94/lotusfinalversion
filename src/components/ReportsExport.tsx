/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Reports Export System
 * Comprehensive report generation with multiple format options
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  brand,
  gradients,
  shadows,
  spacing,
  radius,
  typography,
  transitions,
  cards,
  buttons,
  dashboardExport,
} from '../styles';
import { renderLabIcon, ChecklistIcon, ReportIcon, DownloadIcon } from './icons';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ReportSection {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  included: boolean;
  required?: boolean;
}

interface ReportFormat {
  id: 'pdf' | 'csv' | 'json';
  name: string;
  icon: string;
  description: string;
  descriptionAr: string;
}

interface ReportsExportProps {
  patientName?: string;
  sessionDate?: string;
  onExport?: (format: string, sections: string[]) => void;
  onClose?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const reportSections: ReportSection[] = [
  {
    id: 'summary',
    name: 'Executive Summary',
    nameAr: 'الملخص التنفيذي',
    description: 'Overview of assessment results and key findings',
    descriptionAr: 'نظرة عامة على نتائج التقييم والنتائج الرئيسية',
    icon: '📋',
    included: true,
    required: true,
  },
  {
    id: 'attention',
    name: 'Attention & Focus',
    nameAr: 'الانتباه والتركيز',
    description: 'Detailed attention test metrics and analysis',
    descriptionAr: 'مقاييس اختبار الانتباه التفصيلية والتحليل',
    icon: '🎯',
    included: true,
  },
  {
    id: 'frequency',
    name: 'Frequency Discrimination',
    nameAr: 'تمييز التردد',
    description: 'Pitch perception thresholds and patterns',
    descriptionAr: 'عتبات إدراك النغمة والأنماط',
    icon: '〰️',
    included: true,
  },
  {
    id: 'sequencing',
    name: 'Auditory Sequencing',
    nameAr: 'التسلسل السمعي',
    description: 'Memory span and pattern recognition results',
    descriptionAr: 'نتائج مدى الذاكرة والتعرف على الأنماط',
    icon: '📊',
    included: true,
  },
  {
    id: 'dichotic',
    name: 'Binaural Processing',
    nameAr: 'المعالجة ثنائية الأذن',
    description: 'Left/right ear integration and separation',
    descriptionAr: 'تكامل وفصل الأذن اليسرى/اليمنى',
    icon: '🎧',
    included: true,
  },
  {
    id: 'snr',
    name: 'Speech in Noise',
    nameAr: 'الكلام في الضوضاء',
    description: 'SNR threshold and word recognition scores',
    descriptionAr: 'عتبة نسبة الإشارة إلى الضوضاء ودرجات التعرف على الكلمات',
    icon: '🔊',
    included: true,
  },
  {
    id: 'fatigue',
    name: 'Fatigue Analysis',
    nameAr: 'تحليل التعب',
    description: 'Performance consistency and fatigue patterns',
    descriptionAr: 'ثبات الأداء وأنماط التعب',
    icon: '⚡',
    included: false,
  },
  {
    id: 'recommendations',
    name: 'Clinical Recommendations',
    nameAr: 'التوصيات السريرية',
    description: 'Treatment suggestions and next steps',
    descriptionAr: 'اقتراحات العلاج والخطوات التالية',
    icon: '💡',
    included: true,
    required: true,
  },
  {
    id: 'comparison',
    name: 'Historical Comparison',
    nameAr: 'المقارنة التاريخية',
    description: 'Progress comparison with previous assessments',
    descriptionAr: 'مقارنة التقدم مع التقييمات السابقة',
    icon: '📈',
    included: false,
  },
  {
    id: 'raw_data',
    name: 'Raw Data',
    nameAr: 'البيانات الخام',
    description: 'Detailed trial-by-trial data export',
    descriptionAr: 'تصدير بيانات التجربة المفصلة',
    icon: '📁',
    included: false,
  },
];

const reportFormats: ReportFormat[] = [
  {
    id: 'pdf',
    name: 'PDF Report',
    icon: '📄',
    description: 'Professional formatted report for printing and sharing',
    descriptionAr: 'تقرير منسق احترافي للطباعة والمشاركة',
  },
  {
    id: 'csv',
    name: 'CSV Export',
    icon: '📊',
    description: 'Spreadsheet data for analysis in Excel or Google Sheets',
    descriptionAr: 'بيانات جداول للتحليل في Excel أو Google Sheets',
  },
  {
    id: 'json',
    name: 'JSON Data',
    icon: '🔧',
    description: 'Structured data for integration with other systems',
    descriptionAr: 'بيانات منظمة للتكامل مع الأنظمة الأخرى',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    ...dashboardExport.exportPanel,
    maxWidth: '800px',
    margin: '0 auto',
    padding: spacing[6],
  } as React.CSSProperties,

  header: {
    ...dashboardExport.exportHeader,
    marginBottom: spacing[6],
  } as React.CSSProperties,

  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: spacing[2],
  } as React.CSSProperties,

  subtitle: {
    fontSize: typography.size.sm,
    color: '#888',
  } as React.CSSProperties,

  patientInfo: {
    display: 'flex',
    gap: spacing[6],
    padding: spacing[4],
    background: `${brand.panel}`,
    borderRadius: radius.lg,
    marginBottom: spacing[6],
  } as React.CSSProperties,

  patientLabel: {
    fontSize: typography.size.xs,
    color: '#666',
    marginBottom: spacing[1],
  } as React.CSSProperties,

  patientValue: {
    fontSize: typography.size.base,
    color: '#fff',
    fontWeight: typography.weight.bold,
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[4],
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  } as React.CSSProperties,

  sectionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: spacing[3],
    marginBottom: spacing[6],
  } as React.CSSProperties,

  sectionCard: {
    ...cards.glass,
    padding: spacing[3],
    cursor: 'pointer',
    transition: transitions.fast,
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[3],
  } as React.CSSProperties,

  sectionCardActive: {
    border: `2px solid ${brand.cyan}`,
    boxShadow: shadows.glow.cyan,
  } as React.CSSProperties,

  sectionCardDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  } as React.CSSProperties,

  checkbox: {
    width: '20px',
    height: '20px',
    borderRadius: radius.sm,
    border: `2px solid ${brand.cyan}40`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.size.xs,
    flexShrink: 0,
    marginTop: '2px',
  } as React.CSSProperties,

  checkboxChecked: {
    background: brand.cyan,
    borderColor: brand.cyan,
    color: brand.ink,
  } as React.CSSProperties,

  sectionContent: {
    flex: 1,
  } as React.CSSProperties,

  sectionName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[1],
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  } as React.CSSProperties,

  sectionDescription: {
    fontSize: typography.size.xs,
    color: '#888',
    lineHeight: 1.4,
  } as React.CSSProperties,

  requiredBadge: {
    fontSize: '10px',
    background: `${brand.purple}30`,
    color: brand.purple,
    padding: `0 ${spacing[1]}`,
    borderRadius: radius.sm,
  } as React.CSSProperties,

  formatSelector: {
    display: 'flex',
    gap: spacing[4],
    marginBottom: spacing[6],
  } as React.CSSProperties,

  formatCard: {
    flex: 1,
    ...cards.glass,
    padding: spacing[4],
    cursor: 'pointer',
    transition: transitions.fast,
    textAlign: 'center' as const,
  } as React.CSSProperties,

  formatCardActive: {
    border: `2px solid ${brand.cyan}`,
  } as React.CSSProperties,

  formatIcon: {
    fontSize: '2rem',
    marginBottom: spacing[2],
  } as React.CSSProperties,

  formatName: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[1],
  } as React.CSSProperties,

  formatDescription: {
    fontSize: typography.size.xs,
    color: '#888',
  } as React.CSSProperties,

  previewSection: {
    padding: spacing[4],
    background: `${brand.ink}`,
    borderRadius: radius.lg,
    marginBottom: spacing[6],
    border: `1px solid #333`,
  } as React.CSSProperties,

  previewTitle: {
    fontSize: typography.size.sm,
    color: '#666',
    marginBottom: spacing[3],
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,

  previewContent: {
    ...dashboardExport.reportPreview,
    maxHeight: '200px',
    overflow: 'auto',
  } as React.CSSProperties,

  previewItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]} 0`,
    borderBottom: '1px solid #333',
    fontSize: typography.size.sm,
  } as React.CSSProperties,

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing[4],
  } as React.CSSProperties,

  cancelButton: {
    ...buttons.ghost,
    padding: `${spacing[3]} ${spacing[6]}`,
  } as React.CSSProperties,

  exportButton: {
    ...dashboardExport.exportButton,
    padding: `${spacing[3]} ${spacing[8]}`,
    background: gradients.cyanPurple,
  } as React.CSSProperties,

  selectAllButton: {
    ...buttons.ghost,
    padding: `${spacing[1]} ${spacing[3]}`,
    fontSize: typography.size.xs,
    borderRadius: radius.full,
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const ReportsExport: React.FC<ReportsExportProps> = ({
  patientName = 'Demo Patient',
  sessionDate = new Date().toLocaleDateString(),
  onExport,
  onClose,
}) => {
  const { isArabic } = useLanguage();
  const [selectedSections, setSelectedSections] = useState<string[]>(
    reportSections.filter(s => s.included).map(s => s.id)
  );
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const toggleSection = useCallback((sectionId: string) => {
    const section = reportSections.find(s => s.id === sectionId);
    if (section?.required) return; // Can't toggle required sections

    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedSections(reportSections.map(s => s.id));
  }, []);

  const selectRequired = useCallback(() => {
    setSelectedSections(reportSections.filter(s => s.required || s.included).map(s => s.id));
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onExport?.(selectedFormat, selectedSections);
    setIsExporting(false);
  }, [selectedFormat, selectedSections, onExport]);

  const selectedSectionDetails = useMemo(() =>
    reportSections.filter(s => selectedSections.includes(s.id)),
    [selectedSections]
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span style={{ display: 'inline-flex', alignItems: 'center', marginInlineEnd: spacing[2] }}>
            <ReportIcon size={20} tone="cyan" />
          </span>
          {isArabic ? 'تصدير التقرير' : 'Export Report'}
        </h2>
        <p style={styles.subtitle}>
          {isArabic
            ? 'حدد الأقسام والتنسيق لتقريرك'
            : 'Select sections and format for your report'}
        </p>
      </div>

      {/* Patient Info */}
      <div style={styles.patientInfo}>
        <div>
          <div style={styles.patientLabel}>
            {isArabic ? 'المريض' : 'Patient'}
          </div>
          <div style={styles.patientValue}>{patientName}</div>
        </div>
        <div>
          <div style={styles.patientLabel}>
            {isArabic ? 'تاريخ الجلسة' : 'Session Date'}
          </div>
          <div style={styles.patientValue}>{sessionDate}</div>
        </div>
      </div>

      {/* Sections Selection */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
          <h3 style={styles.sectionTitle}>
            <span style={{ display: 'inline-flex', alignItems: 'center', marginInlineEnd: spacing[2] }}>
              <ChecklistIcon size={18} tone="cyan" />
            </span>
            {isArabic ? 'أقسام التقرير' : 'Report Sections'}
          </h3>
          <div style={{ display: 'flex', gap: spacing[2] }}>
            <button style={styles.selectAllButton} onClick={selectAll}>
              {isArabic ? 'تحديد الكل' : 'Select All'}
            </button>
            <button style={styles.selectAllButton} onClick={selectRequired}>
              {isArabic ? 'الأساسية فقط' : 'Essential Only'}
            </button>
          </div>
        </div>

        <div style={styles.sectionsGrid}>
          {reportSections.map(section => {
            const isSelected = selectedSections.includes(section.id);
            return (
              <div
                key={section.id}
                style={{
                  ...styles.sectionCard,
                  ...(isSelected ? styles.sectionCardActive : {}),
                  ...(section.required && !isSelected ? styles.sectionCardDisabled : {}),
                }}
                onClick={() => toggleSection(section.id)}
              >
                <div
                  style={{
                    ...styles.checkbox,
                    ...(isSelected ? styles.checkboxChecked : {}),
                  }}
                >
                  {isSelected ? '✓' : ''}
                </div>
                <div style={styles.sectionContent}>
                  <div style={styles.sectionName}>
                    {renderLabIcon(section.icon, { size: 16, style: { color: brand.cyan } })} {isArabic ? section.nameAr : section.name}
                    {section.required && (
                      <span style={styles.requiredBadge}>
                        {isArabic ? 'مطلوب' : 'Required'}
                      </span>
                    )}
                  </div>
                  <div style={styles.sectionDescription}>
                    {isArabic ? section.descriptionAr : section.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <h3 style={styles.sectionTitle}>
          <span style={{ display: 'inline-flex', alignItems: 'center', marginInlineEnd: spacing[2] }}>
            <DownloadIcon size={18} tone="cyan" />
          </span>
          {isArabic ? 'تنسيق الملف' : 'File Format'}
        </h3>
        <div style={styles.formatSelector}>
          {reportFormats.map(format => (
            <div
              key={format.id}
              style={{
                ...styles.formatCard,
                ...(selectedFormat === format.id ? styles.formatCardActive : {}),
              }}
              onClick={() => setSelectedFormat(format.id)}
            >
              <div style={styles.formatIcon}>
                {renderLabIcon(format.icon, { size: 24, style: { color: brand.cyan } })}
              </div>
              <div style={styles.formatName}>{format.name}</div>
              <div style={styles.formatDescription}>
                {isArabic ? format.descriptionAr : format.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div style={styles.previewSection}>
        <div style={styles.previewTitle}>
          {isArabic ? 'معاينة المحتوى' : 'Content Preview'}
        </div>
        <div style={styles.previewContent}>
          {selectedSectionDetails.map(section => (
            <div key={section.id} style={styles.previewItem}>
              <span>{renderLabIcon(section.icon, { size: 16, style: { color: brand.cyan } })}</span>
              <span>{isArabic ? section.nameAr : section.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        {onClose && (
          <button style={styles.cancelButton} onClick={onClose}>
            {isArabic ? 'إلغاء' : 'Cancel'}
          </button>
        )}
        <button
          style={{
            ...styles.exportButton,
            opacity: isExporting ? 0.7 : 1,
          }}
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting
            ? isArabic ? '⏳ جاري التصدير...' : '⏳ Exporting...'
            : isArabic ? `📥 تصدير ${reportFormats.find(f => f.id === selectedFormat)?.name}` : `📥 Export ${reportFormats.find(f => f.id === selectedFormat)?.name}`}
        </button>
      </div>
    </div>
  );
};

export default ReportsExport;
