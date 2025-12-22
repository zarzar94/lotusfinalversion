import type { jsPDF } from 'jspdf';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../../utils/pdf';
import { AssessmentSession, TestOutcome, TestKey } from './types';

const downloadBlob = (blob: Blob, filename: string): void => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

const safeJson = (value: unknown): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return '"<unserializable>"';
  }
};

export const downloadSessionCsv = (session: AssessmentSession): void => {
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

const writeMetrics = (doc: jsPDF, metrics: TestOutcome['metrics'], yStart: number): number => {
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

export const downloadSessionPdf = async (session: AssessmentSession, composite?: { label: string; message: string }): Promise<void> => {
  const doc = await createPdfDoc();
  doc.setFont('Cairo', 'bold');

  let y = 62;
  doc.setFontSize(18);
  y = writePdfText(doc, 'Berard AIT Sound Lab — تقرير فحص سمعي تفاعلي', PDF_MARGIN_X, y, { maxWidth: 520, lineHeight: 22 });

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(11);
  y = writePdfText(doc, `Session: ${session.id}`, PDF_MARGIN_X, y + 10, { maxWidth: 520, lineHeight: 16 });
  y = writePdfText(doc, `Date: ${new Date(session.startedAt).toLocaleString()}`, PDF_MARGIN_X, y + 4, { maxWidth: 520, lineHeight: 16 });

  y = writePdfText(
    doc,
    'تنبيه مهم: هذا فحص تفاعلي (Screening) للتوعية وقياس مؤشرات عامة. لا يعتبر تشخيصاً طبياً ولا يغني عن تقييم سريري باستخدام أدوات معيارية ومعايرة سماعات.',
    PDF_MARGIN_X,
    y + 8,
    { maxWidth: 520, lineHeight: 16 }
  );

  if (session.headphoneCheck) {
    const hc = session.headphoneCheck;
    y = writePdfText(
      doc,
      `Headphone check: ${hc.supported ? (hc.passed ? 'PASS' : 'FAIL') : 'NOT SUPPORTED'} (${hc.correct}/${hc.total})`,
      PDF_MARGIN_X,
      y + 10,
      { maxWidth: 520, lineHeight: 16 }
    );
  }

  if (composite) {
    doc.setFont('Cairo', 'bold');
    doc.setFontSize(14);
    y = writePdfText(doc, `الخلاصة: ${composite.label}`, PDF_MARGIN_X, y + 14, { maxWidth: 520, lineHeight: 18 });
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
    y = writePdfText(doc, `النتيجة: ${o.scoreLabel} | التصنيف: ${o.result}`, PDF_MARGIN_X, y + 6, { maxWidth: 520, lineHeight: 16 });
    y = writePdfText(doc, o.message, PDF_MARGIN_X, y + 4, { maxWidth: 520, lineHeight: 16 });

    y = writeMetrics(doc, o.metrics, y + 6);

    if (y > 760) {
      doc.addPage();
      y = 62;
    }
  }

  doc.save(`Berard-AIT-Screening-Report-${Date.now()}.pdf`);
};
