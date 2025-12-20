import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../../utils/pdf';
import type { LabModuleMetrics } from '../../types/moduleMetrics';
import {
  getBandMeta,
  getModuleLabel,
  formatTimestamp,
  sortSessionsByTime,
} from './roleDashboardUtils';

const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

const escapeCsv = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

export const downloadCsvRows = (rows: Array<Array<string | number | null | undefined>>, filename: string) => {
  const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), filename);
};

const drawSparkline = (doc: Awaited<ReturnType<typeof createPdfDoc>>, values: number[], x: number, y: number, width: number, height: number) => {
  if (values.length < 2) return;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / Math.max(values.length - 1, 1);
  let prevX = x;
  let prevY = y + height - ((values[0] - min) / range) * height;

  doc.setDrawColor(143, 211, 204);
  doc.setLineWidth(1);

  values.slice(1).forEach((value, index) => {
    const nextX = x + (index + 1) * step;
    const nextY = y + height - ((value - min) / range) * height;
    doc.line(prevX, prevY, nextX, nextY);
    prevX = nextX;
    prevY = nextY;
  });
};

export const downloadParentReportPdf = async ({
  sessions,
  latestByModule,
  isArabic,
}: {
  sessions: LabModuleMetrics[];
  latestByModule: Record<string, LabModuleMetrics | null>;
  isArabic: boolean;
}) => {
  const doc = await createPdfDoc();
  const locale = isArabic ? 'ar-SA' : 'en-US';
  const sorted = sortSessionsByTime(sessions);
  const pageHeight = doc.internal.pageSize.getHeight();

  const latestSessions = Object.values(latestByModule).filter(Boolean) as LabModuleMetrics[];
  const averageScore = latestSessions.length
    ? Math.round(latestSessions.reduce((sum, session) => sum + session.score100, 0) / latestSessions.length)
    : 0;

  const text = {
    title: isArabic ? 'تقرير ولي الأمر' : 'Parent Report',
    summary: isArabic ? 'ملخص الأداء' : 'Performance Summary',
    modules: isArabic ? 'نتائج الوحدات' : 'Module Results',
    average: isArabic ? 'متوسط الدرجة' : 'Average Score',
    updated: isArabic ? 'آخر تحديث' : 'Last Updated',
    disclaimer: isArabic
      ? 'ملاحظة: هذا تقرير فحص غير تشخيصي ولا يغني عن التقييم السريري.'
      : 'Note: This screening report is non-diagnostic and does not replace clinical evaluation.',
  };

  let y = 62;
  doc.setFont('Cairo', 'bold');
  doc.setFontSize(18);
  y = writePdfText(doc, text.title, PDF_MARGIN_X, y, { lineHeight: 22 });

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(11);
  y = writePdfText(
    doc,
    `${text.updated}: ${sorted.length ? formatTimestamp(sorted[sorted.length - 1].timestamp, locale) : '-'}`,
    PDF_MARGIN_X,
    y + 8,
    { lineHeight: 16 },
  );

  y = writePdfText(doc, `${text.average}: ${averageScore}/100`, PDF_MARGIN_X, y + 4, { lineHeight: 16 });
  y = writePdfText(doc, text.disclaimer, PDF_MARGIN_X, y + 8, { lineHeight: 16, maxWidth: 520 });

  doc.setFont('Cairo', 'bold');
  doc.setFontSize(13);
  y = writePdfText(doc, text.modules, PDF_MARGIN_X, y + 18, { lineHeight: 18 });

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(11);
  Object.entries(latestByModule).forEach(([moduleId, session]) => {
    if (!session) return;
    const bandMeta = getBandMeta(session.band);
    const label = getModuleLabel(moduleId, isArabic);
    y = writePdfText(
      doc,
      `${label}: ${session.score100}/100 · ${isArabic ? bandMeta.labelAr : bandMeta.label}`,
      PDF_MARGIN_X,
      y + 6,
      { lineHeight: 16 },
    );
    if (y > pageHeight - 80) {
      doc.addPage();
      y = 62;
    }
  });

  doc.save(isArabic ? 'تقرير-ولي-الامر.pdf' : 'parent-report.pdf');
};

export const downloadClinicianReportPdf = async ({
  sessions,
  latestByModule,
  isArabic,
  fatigueSlope,
  consistencyAverage,
}: {
  sessions: LabModuleMetrics[];
  latestByModule: Record<string, LabModuleMetrics | null>;
  isArabic: boolean;
  fatigueSlope: number;
  consistencyAverage: number | null;
}) => {
  const doc = await createPdfDoc();
  const locale = isArabic ? 'ar-SA' : 'en-US';
  const sorted = sortSessionsByTime(sessions);
  const pageHeight = doc.internal.pageSize.getHeight();

  const text = {
    title: isArabic ? 'تقرير الأخصائي' : 'Clinician Report',
    summary: isArabic ? 'ملخص الجلسات' : 'Session Summary',
    sessions: isArabic ? 'عدد الجلسات' : 'Total Sessions',
    range: isArabic ? 'النطاق الزمني' : 'Date Range',
    fatigue: isArabic ? 'ميل الإجهاد' : 'Fatigue Slope',
    consistency: isArabic ? 'متوسط الاتساق' : 'Average Consistency',
    modules: isArabic ? 'نتائج الوحدات' : 'Module Results',
    disclaimer: isArabic
      ? 'هذا التقرير للمتابعة السريرية ويعتمد على بيانات الفحص غير التشخيصي.'
      : 'This report is for clinical follow-up and is based on non-diagnostic screening data.',
    trend: isArabic ? 'اتجاه الدرجات' : 'Score Trend',
  };

  const range = sorted.length
    ? `${formatTimestamp(sorted[0].timestamp, locale)} — ${formatTimestamp(sorted[sorted.length - 1].timestamp, locale)}`
    : '-';

  let y = 62;
  doc.setFont('Cairo', 'bold');
  doc.setFontSize(18);
  y = writePdfText(doc, text.title, PDF_MARGIN_X, y, { lineHeight: 22 });

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(11);
  y = writePdfText(doc, text.disclaimer, PDF_MARGIN_X, y + 8, { lineHeight: 16, maxWidth: 520 });

  doc.setFont('Cairo', 'bold');
  doc.setFontSize(13);
  y = writePdfText(doc, text.summary, PDF_MARGIN_X, y + 16, { lineHeight: 18 });

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(11);
  y = writePdfText(doc, `${text.sessions}: ${sorted.length}`, PDF_MARGIN_X, y + 6, { lineHeight: 16 });
  y = writePdfText(doc, `${text.range}: ${range}`, PDF_MARGIN_X, y + 4, { lineHeight: 16, maxWidth: 520 });
  y = writePdfText(doc, `${text.fatigue}: ${fatigueSlope.toFixed(2)}`, PDF_MARGIN_X, y + 4, { lineHeight: 16 });
  y = writePdfText(
    doc,
    `${text.consistency}: ${consistencyAverage === null ? '-' : consistencyAverage.toFixed(1)}`,
    PDF_MARGIN_X,
    y + 4,
    { lineHeight: 16 },
  );

  doc.setFont('Cairo', 'bold');
  doc.setFontSize(12);
  y = writePdfText(doc, text.trend, PDF_MARGIN_X, y + 16, { lineHeight: 18 });
  const scoreValues = sorted.map((session) => session.score100);
  drawSparkline(doc, scoreValues, PDF_MARGIN_X, y + 6, 220, 40);
  y += 60;

  doc.setFont('Cairo', 'bold');
  doc.setFontSize(13);
  y = writePdfText(doc, text.modules, PDF_MARGIN_X, y + 6, { lineHeight: 18 });
  doc.setFont('Cairo', 'normal');
  doc.setFontSize(11);

  Object.entries(latestByModule).forEach(([moduleId, session]) => {
    if (!session) return;
    const bandMeta = getBandMeta(session.band);
    const label = getModuleLabel(moduleId, isArabic);
    y = writePdfText(
      doc,
      `${label}: ${session.score100}/100 · ${isArabic ? bandMeta.labelAr : bandMeta.label}`,
      PDF_MARGIN_X,
      y + 6,
      { lineHeight: 16 },
    );
    const fatigue = typeof session.fatigueIndex === 'number' ? session.fatigueIndex.toFixed(1) : '-';
    const consistency = typeof session.consistency === 'number' ? session.consistency.toFixed(1) : '-';
    y = writePdfText(
      doc,
      `${isArabic ? 'الإجهاد' : 'Fatigue'}: ${fatigue} · ${isArabic ? 'الاتساق' : 'Consistency'}: ${consistency}`,
      PDF_MARGIN_X,
      y + 4,
      { lineHeight: 16 },
    );
    if (y > pageHeight - 80) {
      doc.addPage();
      y = 62;
    }
  });

  doc.save(isArabic ? 'تقرير-الأخصائي.pdf' : 'clinician-report.pdf');
};

