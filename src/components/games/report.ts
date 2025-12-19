import type { jsPDF } from 'jspdf';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../../utils/pdf';
import { translations } from '../../i18n/translations';
import type { Language } from '../../context/LanguageContext';
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

const getReportLabels = (language: Language) => translations[language].report;


export const downloadSessionCsv = (session: AssessmentSession) => {
  const rows: string[] = [];
  rows.push(['session_id', 'started_at', 'test_key', 'title', 'result', 'score_label', 'message', 'metrics_json'].join(','));

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
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `Berard-AIT-Screening-${Date.now()}.csv`);
};

const writeMetrics = (doc: jsPDF, metrics: TestOutcome['metrics'], yStart: number) => {
  let y = yStart;
  doc.setFont('Cairo', 'normal');
  doc.setFontSize(11);
  for (const [k, v] of Object.entries(metrics)) {
    y = writePdfText(doc, `• ${k}: ${String(v)}`, PDF_MARGIN_X, y, { maxWidth: 520, lineHeight: 16 });
    if (y > 760) {
      doc.addPage();
      y = 62;
    }
  }
  return y;
};

export const downloadSessionPdf = async (
  session: AssessmentSession,
  composite?: { label: string; message: string },
  language: Language = 'ar',
) => {
  const labels = getReportLabels(language);
  const doc = await createPdfDoc();
  doc.setFont('Cairo', 'bold');

  let y = 62;
  doc.setFontSize(18);
  y = writePdfText(doc, labels.title, PDF_MARGIN_X, y, { maxWidth: 520, lineHeight: 22 });

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(12);
  y = writePdfText(doc, labels.subtitle, PDF_MARGIN_X, y + 6, { maxWidth: 520, lineHeight: 18 });

  doc.setFontSize(11);
  y = writePdfText(doc, `${labels.session}: ${session.id}`, PDF_MARGIN_X, y + 10, { maxWidth: 520, lineHeight: 16 });
  y = writePdfText(doc, `${labels.date}: ${new Date(session.startedAt).toLocaleString()}`, PDF_MARGIN_X, y + 4, { maxWidth: 520, lineHeight: 16 });

  y = writePdfText(doc, labels.disclaimer, PDF_MARGIN_X, y + 8, { maxWidth: 520, lineHeight: 16 });

  if (session.headphoneCheck) {
    const hc = session.headphoneCheck;
    const status = hc.supported ? (hc.passed ? labels.pass : labels.fail) : labels.notSupported;
    y = writePdfText(
      doc,
      `${labels.headphoneCheck}: ${status} (${hc.correct}/${hc.total})`,
      PDF_MARGIN_X,
      y + 10,
      { maxWidth: 520, lineHeight: 16 }
    );
  }

  if (composite) {
    doc.setFont('Cairo', 'bold');
    doc.setFontSize(14);
    y = writePdfText(doc, `${labels.summary}: ${composite.label}`, PDF_MARGIN_X, y + 14, { maxWidth: 520, lineHeight: 18 });
    doc.setFont('Cairo', 'normal');
    doc.setFontSize(11);
    y = writePdfText(doc, composite.message, PDF_MARGIN_X, y + 6, { maxWidth: 520, lineHeight: 16 });
  }

  // Per-test outcomes
  const ordered: TestKey[] = ['attention', 'frequency', 'sequence', 'questionnaire'];
  for (const key of ordered) {
    const o = session.outcomes[key];
    if (!o) continue;

    doc.setFont('Cairo', 'bold');
    doc.setFontSize(14);
    y = writePdfText(doc, o.title, PDF_MARGIN_X, y + 16, { maxWidth: 520, lineHeight: 18 });

    doc.setFont('Cairo', 'normal');
    doc.setFontSize(11);
    y = writePdfText(doc, `${labels.result}: ${o.scoreLabel} | ${labels.classification}: ${o.result}`, PDF_MARGIN_X, y + 6, { maxWidth: 520, lineHeight: 16 });
    y = writePdfText(doc, o.message, PDF_MARGIN_X, y + 4, { maxWidth: 520, lineHeight: 16 });

    y = writeMetrics(doc, o.metrics, y + 6);

    if (y > 760) {
      doc.addPage();
      y = 62;
    }
  }

  doc.save(`Berard-AIT-Screening-Report-${Date.now()}.pdf`);
};
