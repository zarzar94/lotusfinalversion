import type { jsPDF } from 'jspdf';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../../utils/pdf';
import { translations } from '../../i18n/translations';
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

const getReportCopy = (lang: ReportLang) => translations[lang].games.report;

const formatDate = (lang: ReportLang, timestamp: number) =>
  new Date(timestamp).toLocaleString(lang === 'ar' ? 'ar' : 'en-US');

const ensurePage = (doc: jsPDF, y: number) => {
  if (y > 760) {
    doc.addPage();
    return 62;
  }
  return y;
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

const writeMetrics = (doc: jsPDF, metrics: TestOutcome['metrics'], yStart: number, label: string) => {
  let y = yStart;
  doc.setFont('Cairo', 'bold');
  doc.setFontSize(11);
  y = writePdfText(doc, label, PDF_MARGIN_X, y, { maxWidth: 520, lineHeight: 16 });

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(11);
  for (const [key, value] of Object.entries(metrics)) {
    y = writePdfText(doc, `- ${key}: ${String(value)}`, PDF_MARGIN_X, y + 4, { maxWidth: 520, lineHeight: 16 });
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

  const doc = await createPdfDoc();
  doc.setFont('Cairo', 'bold');

  let y = 62;
  doc.setFontSize(18);
  y = writePdfText(doc, copy.title, PDF_MARGIN_X, y, { maxWidth: 520, lineHeight: 22 });

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(12);
  y = writePdfText(doc, subtitle, PDF_MARGIN_X, y + 8, { maxWidth: 520, lineHeight: 18 });

  doc.setFontSize(11);
  y = writePdfText(doc, `${copy.sessionLabel}: ${session.id}`, PDF_MARGIN_X, y + 8, { maxWidth: 520, lineHeight: 16 });
  y = writePdfText(doc, `${copy.dateLabel}: ${formatDate(lang, session.startedAt)}`, PDF_MARGIN_X, y + 4, { maxWidth: 520, lineHeight: 16 });
  y = writePdfText(doc, `${copy.typeLabel}: ${templateLabel}`, PDF_MARGIN_X, y + 4, { maxWidth: 520, lineHeight: 16 });
  y = writePdfText(doc, intro, PDF_MARGIN_X, y + 8, { maxWidth: 520, lineHeight: 16 });

  if (session.headphoneCheck) {
    const hc = session.headphoneCheck;
    const hcLabel = hc.supported
      ? (hc.passed ? copy.headphoneStatus.pass : copy.headphoneStatus.fail)
      : copy.headphoneStatus.notSupported;
    y = writePdfText(
      doc,
      `${copy.headphoneLabel}: ${hcLabel} (${hc.correct}/${hc.total})`,
      PDF_MARGIN_X,
      y + 10,
      { maxWidth: 520, lineHeight: 16 }
    );
  }

  if (composite) {
    doc.setFont('Cairo', 'bold');
    doc.setFontSize(13);
    y = writePdfText(doc, copy.summaryHeading, PDF_MARGIN_X, y + 14, { maxWidth: 520, lineHeight: 18 });
    doc.setFont('Cairo', 'normal');
    doc.setFontSize(11);
    y = writePdfText(doc, `${copy.resultLabel}: ${composite.label}`, PDF_MARGIN_X, y + 6, { maxWidth: 520, lineHeight: 16 });
    y = writePdfText(doc, composite.message, PDF_MARGIN_X, y + 4, { maxWidth: 520, lineHeight: 16 });
  }

  y = ensurePage(doc, y);
  doc.setFont('Cairo', 'bold');
  doc.setFontSize(13);
  y = writePdfText(doc, copy.resultsHeading, PDF_MARGIN_X, y + 14, { maxWidth: 520, lineHeight: 18 });

  const ordered: TestKey[] = ['attention', 'frequency', 'sequence', 'questionnaire'];
  for (const key of ordered) {
    const o = session.outcomes[key];
    if (!o) continue;

    doc.setFont('Cairo', 'bold');
    doc.setFontSize(12);
    y = writePdfText(doc, o.title, PDF_MARGIN_X, y + 12, { maxWidth: 520, lineHeight: 18 });

    doc.setFont('Cairo', 'normal');
    doc.setFontSize(11);
    const resultLabel = resultLabels[o.result]?.label ?? o.result;
    y = writePdfText(doc, `${copy.resultLabel}: ${resultLabel}`, PDF_MARGIN_X, y + 4, { maxWidth: 520, lineHeight: 16 });
    y = writePdfText(doc, `${copy.scoreLabel}: ${o.scoreLabel}`, PDF_MARGIN_X, y + 4, { maxWidth: 520, lineHeight: 16 });
    y = writePdfText(doc, o.message, PDF_MARGIN_X, y + 4, { maxWidth: 520, lineHeight: 16 });

    y = writeMetrics(doc, o.metrics, y + 6, copy.metricsHeading);
    y = ensurePage(doc, y);
  }

  if (template === 'school') {
    doc.setFont('Cairo', 'bold');
    doc.setFontSize(13);
    y = writePdfText(doc, copy.supportsHeading, PDF_MARGIN_X, y + 14, { maxWidth: 520, lineHeight: 18 });

    doc.setFont('Cairo', 'normal');
    doc.setFontSize(11);
    for (const item of copy.supportsBullets) {
      y = writePdfText(doc, `- ${item}`, PDF_MARGIN_X, y + 4, { maxWidth: 520, lineHeight: 16 });
      y = ensurePage(doc, y);
    }
  }

  const templateTag = template.toUpperCase();
  doc.save(`Berard-AIT-Screening-Report-${templateTag}-${Date.now()}.pdf`);
};
