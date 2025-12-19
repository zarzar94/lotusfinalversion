import type { jsPDF } from 'jspdf';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../../utils/pdf';
import { translations } from '../../i18n/translations';
import { brandCyan, brandInk, brandPink, brandPurple, brandPurpleDark } from '../styles';
import { AssessmentSession, TestOutcome, TestKey } from './types';

const downloadBlob = (blob: Blob, filename: string) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

const safeJson = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return '"<unserializable>"';
  }
};

export type ReportTemplate = 'parent' | 'school';
export type ReportLang = 'ar' | 'en';
export type ReportOptions = { lang: ReportLang; template: ReportTemplate };

type ReportComposite = { label: string; message: string };

type Rgb = { r: number; g: number; b: number };

type PdfColorMethod = 'setTextColor' | 'setDrawColor' | 'setFillColor';

const getReportCopy = (lang: ReportLang) => translations[lang].games.report;

const formatDate = (lang: ReportLang, timestamp: number) =>
  new Date(timestamp).toLocaleString(lang === 'ar' ? 'ar' : 'en-US');

const hexToRgb = (hex: string): Rgb => {
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
};

const applyHexColor = (doc: jsPDF, hex: string, method: PdfColorMethod) => {
  const { r, g, b } = hexToRgb(hex);
  if (method === 'setTextColor') doc.setTextColor(r, g, b);
  if (method === 'setDrawColor') doc.setDrawColor(r, g, b);
  if (method === 'setFillColor') doc.setFillColor(r, g, b);
};

const ensurePage = (doc: jsPDF, y: number) => {
  if (y > 760) {
    doc.addPage();
    return 62;
  }
  return y;
};

const drawDivider = (doc: jsPDF, y: number, pageWidth: number, color: string) => {
  applyHexColor(doc, color, 'setDrawColor');
  doc.setLineWidth(0.7);
  doc.line(PDF_MARGIN_X, y, pageWidth - PDF_MARGIN_X, y);
  return y;
};

const writeSectionHeading = (doc: jsPDF, label: string, y: number, contentWidth: number, color: string) => {
  doc.setFont('Cairo', 'bold');
  doc.setFontSize(12);
  applyHexColor(doc, color, 'setTextColor');
  return writePdfText(doc, label, PDF_MARGIN_X, y, { maxWidth: contentWidth, lineHeight: 18 });
};

export const downloadSessionCsv = (session: AssessmentSession, options: ReportOptions) => {
  const { lang, template } = options;
  const copy = getReportCopy(lang);
  const rows: string[] = [];
  rows.push([
    copy.csvHeaders.sessionId,
    copy.csvHeaders.startedAt,
    copy.csvHeaders.testKey,
    copy.csvHeaders.title,
    copy.csvHeaders.result,
    copy.csvHeaders.scoreLabel,
    copy.csvHeaders.message,
    copy.csvHeaders.metricsJson,
  ].join(','));

  (Object.keys(session.outcomes) as TestKey[]).forEach((key) => {
    const o = session.outcomes[key];
    if (!o) return;
    const line = [
      session.id,
      new Date(session.startedAt).toISOString(),
      key,
      `"${o.title.replace(/"/g, '""')}"`,
      o.result,
      `"${String(o.scoreLabel).replace(/"/g, '""')}"`,
      `"${String(o.message).replace(/"/g, '""')}"`,
      `"${safeJson(o.metrics).replace(/"/g, '""')}"`,
    ].join(',');
    rows.push(line);
  });

  const csv = rows.join('\n');
  const templateTag = template.toUpperCase();
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `Berard-AIT-Screening-${templateTag}-${Date.now()}.csv`);
};

const writeMetrics = (
  doc: jsPDF,
  metrics: TestOutcome['metrics'],
  yStart: number,
  label: string,
  contentWidth: number,
  indent: number,
) => {
  let y = yStart;
  doc.setFont('Cairo', 'bold');
  doc.setFontSize(11);
  applyHexColor(doc, brandPurpleDark, 'setTextColor');
  y = writePdfText(doc, label, PDF_MARGIN_X + indent, y, { maxWidth: contentWidth - indent, lineHeight: 16 });

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(11);
  applyHexColor(doc, brandInk, 'setTextColor');
  for (const [key, value] of Object.entries(metrics)) {
    y = writePdfText(doc, `- ${key}: ${String(value)}`, PDF_MARGIN_X + indent, y + 4, { maxWidth: contentWidth - indent, lineHeight: 16 });
    y = ensurePage(doc, y);
  }
  return y;
};

export const downloadSessionPdf = async (session: AssessmentSession, options: ReportOptions, composite?: ReportComposite) => {
  const { lang, template } = options;
  const copy = getReportCopy(lang);
  const templateLabel = template === 'parent' ? copy.typeParent : copy.typeSchool;
  const intro = template === 'parent' ? copy.introParent : copy.introSchool;
  const subtitle = template === 'parent' ? copy.subtitleParent : copy.subtitleSchool;
  const resultLabels = translations[lang].games.resultMeta;
  const badgeLine = `${translations[lang].games.labBadge} | ${translations[lang].games.nonDiagnostic}`;

  const doc = await createPdfDoc();
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - PDF_MARGIN_X * 2;

  let y = 58;
  doc.setFont('Cairo', 'bold');
  doc.setFontSize(18);
  applyHexColor(doc, brandPurpleDark, 'setTextColor');
  y = writePdfText(doc, copy.title, PDF_MARGIN_X, y, { maxWidth: contentWidth, lineHeight: 22 });

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(12);
  applyHexColor(doc, brandCyan, 'setTextColor');
  y = writePdfText(doc, subtitle, PDF_MARGIN_X, y + 6, { maxWidth: contentWidth, lineHeight: 18 });

  doc.setFontSize(10);
  applyHexColor(doc, brandPurple, 'setTextColor');
  y = writePdfText(doc, badgeLine, PDF_MARGIN_X, y + 6, { maxWidth: contentWidth, lineHeight: 14 });

  y = drawDivider(doc, y + 8, pageWidth, brandCyan);

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(11);
  applyHexColor(doc, brandInk, 'setTextColor');
  y = writePdfText(doc, `${copy.sessionLabel}: ${session.id}`, PDF_MARGIN_X, y + 10, { maxWidth: contentWidth, lineHeight: 16 });
  y = writePdfText(doc, `${copy.dateLabel}: ${formatDate(lang, session.startedAt)}`, PDF_MARGIN_X, y + 4, { maxWidth: contentWidth, lineHeight: 16 });
  y = writePdfText(doc, `${copy.typeLabel}: ${templateLabel}`, PDF_MARGIN_X, y + 4, { maxWidth: contentWidth, lineHeight: 16 });

  y = drawDivider(doc, y + 10, pageWidth, brandPurple);

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(11);
  applyHexColor(doc, brandInk, 'setTextColor');
  y = writePdfText(doc, intro, PDF_MARGIN_X, y + 10, { maxWidth: contentWidth, lineHeight: 16 });

  if (session.headphoneCheck) {
    const hc = session.headphoneCheck;
    const hcLabel = hc.supported
      ? (hc.passed ? copy.headphoneStatus.pass : copy.headphoneStatus.fail)
      : copy.headphoneStatus.notSupported;
    doc.setFont('Cairo', 'bold');
    doc.setFontSize(11);
    applyHexColor(doc, brandPurpleDark, 'setTextColor');
    y = writePdfText(
      doc,
      `${copy.headphoneLabel}: ${hcLabel} (${hc.correct}/${hc.total})`,
      PDF_MARGIN_X,
      y + 10,
      { maxWidth: contentWidth, lineHeight: 16 }
    );
  }

  if (composite) {
    y = ensurePage(doc, y);
    y = writeSectionHeading(doc, copy.summaryHeading, y + 14, contentWidth, brandPurpleDark);
    doc.setFont('Cairo', 'normal');
    doc.setFontSize(11);
    applyHexColor(doc, brandInk, 'setTextColor');
    y = writePdfText(doc, `${copy.resultLabel}: ${composite.label}`, PDF_MARGIN_X, y + 6, { maxWidth: contentWidth, lineHeight: 16 });
    y = writePdfText(doc, composite.message, PDF_MARGIN_X, y + 4, { maxWidth: contentWidth, lineHeight: 16 });
  }

  y = ensurePage(doc, y);
  y = writeSectionHeading(doc, copy.resultsHeading, y + 16, contentWidth, brandPurpleDark);

  const ordered: TestKey[] = ['attention', 'frequency', 'sequence', 'questionnaire'];
  ordered.forEach((key, index) => {
    const o = session.outcomes[key];
    if (!o) return;

    const resultColor = o.result === 'high' ? brandCyan : o.result === 'medium' ? brandPurple : brandPink;
    doc.setFont('Cairo', 'bold');
    doc.setFontSize(12);
    applyHexColor(doc, resultColor, 'setTextColor');
    y = writePdfText(doc, `${index + 1}. ${o.title}`, PDF_MARGIN_X, y + 12, { maxWidth: contentWidth, lineHeight: 18 });

    doc.setFont('Cairo', 'normal');
    doc.setFontSize(11);
    applyHexColor(doc, brandInk, 'setTextColor');
    const resultLabel = resultLabels[o.result]?.label ?? o.result;
    y = writePdfText(doc, `${copy.resultLabel}: ${resultLabel}`, PDF_MARGIN_X, y + 4, { maxWidth: contentWidth, lineHeight: 16 });
    y = writePdfText(doc, `${copy.scoreLabel}: ${o.scoreLabel}`, PDF_MARGIN_X, y + 4, { maxWidth: contentWidth, lineHeight: 16 });
    y = writePdfText(doc, o.message, PDF_MARGIN_X, y + 4, { maxWidth: contentWidth, lineHeight: 16 });

    y = writeMetrics(doc, o.metrics, y + 6, copy.metricsHeading, contentWidth, 12);
    y = drawDivider(doc, y + 8, pageWidth, brandCyan);
    y = ensurePage(doc, y);
  });

  if (template === 'school') {
    y = ensurePage(doc, y);
    y = writeSectionHeading(doc, copy.supportsHeading, y + 16, contentWidth, brandPurpleDark);
    doc.setFont('Cairo', 'normal');
    doc.setFontSize(11);
    applyHexColor(doc, brandInk, 'setTextColor');
    for (const item of copy.supportsBullets) {
      y = writePdfText(doc, `- ${item}`, PDF_MARGIN_X, y + 4, { maxWidth: contentWidth, lineHeight: 16 });
      y = ensurePage(doc, y);
    }
  }

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(10);
  applyHexColor(doc, brandPurpleDark, 'setTextColor');
  y = writePdfText(doc, copy.footerNote, PDF_MARGIN_X, y + 14, { maxWidth: contentWidth, lineHeight: 14 });

  const templateTag = template.toUpperCase();
  doc.save(`Berard-AIT-Screening-Report-${templateTag}-${Date.now()}.pdf`);
};
