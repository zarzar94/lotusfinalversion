import jsPDF from 'jspdf';
import { brandCyan, brandPanel, brandPink } from '../components/styles';

export type ReportLocale = 'ar' | 'en';

interface ReportOptions {
  downloadName?: string;
  locale?: ReportLocale;
}

interface AssessmentPayload {
  patientName: string;
  score: number;
  notes: string;
}

interface TreatmentProgressPayload {
  patientName: string;
  daysCompleted: number;
  stars: number;
}

interface SessionLogPayload {
  sessionDate: string;
  notes: string;
  frequencyHz: number;
}

interface CertificatePayload {
  patientName: string;
  summary: string;
  completedOn: string;
}

const headers = {
  ar: {
    assessment: 'تقرير التقييم',
    progress: 'تقدم العلاج',
    log: 'سجل الجلسة',
    certificate: 'شهادة إتمام',
  },
  en: {
    assessment: 'Assessment Report',
    progress: 'Treatment Progress',
    log: 'Session Log',
    certificate: 'Certificate',
  },
};

const applyBase = (doc: jsPDF, locale: ReportLocale) => {
  if (locale === 'ar') {
    // Right-to-left alignment for Arabic copy
    // jsPDF supports align option; we mirror layout with manual coordinates
    doc.setTextColor(brandPanel);
  }
  doc.setFont('helvetica', 'normal');
};

const addHeader = (doc: jsPDF, title: string) => {
  doc.setFillColor(brandCyan);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(brandPanel);
  doc.setFontSize(18);
  doc.text(title, 12, 16);
  doc.setDrawColor(brandPink);
  doc.line(12, 20, 198, 20);
};

export class PDFReportGenerator {
  static generateAssessmentReport(payload: AssessmentPayload, options: ReportOptions = {}) {
    const locale = options.locale ?? 'ar';
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    applyBase(doc, locale);
    addHeader(doc, headers[locale].assessment);

    doc.setTextColor(brandPanel);
    doc.setFontSize(12);
    doc.text(`${locale === 'ar' ? 'المريض' : 'Patient'}: ${payload.patientName}`, 12, 36);
    doc.text(`${locale === 'ar' ? 'النتيجة' : 'Score'}: ${payload.score}`, 12, 46);
    doc.text(`${locale === 'ar' ? 'ملاحظات' : 'Notes'}: ${payload.notes}`, 12, 56, { maxWidth: 180 });

    if (options.downloadName) doc.save(options.downloadName);
    return doc;
  }

  static generateTreatmentProgress(payload: TreatmentProgressPayload, options: ReportOptions = {}) {
    const locale = options.locale ?? 'ar';
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    applyBase(doc, locale);
    addHeader(doc, headers[locale].progress);

    doc.setFontSize(12);
    doc.text(`${locale === 'ar' ? 'المريض' : 'Patient'}: ${payload.patientName}`, 12, 36);
    doc.text(`${locale === 'ar' ? 'أيام مكتملة' : 'Days completed'}: ${payload.daysCompleted}/10`, 12, 46);
    doc.text(`${locale === 'ar' ? 'نجوم التقدم' : 'Progress stars'}: ${'⭐'.repeat(payload.stars)}`, 12, 56);

    if (options.downloadName) doc.save(options.downloadName);
    return doc;
  }

  static generateSessionLog(payload: SessionLogPayload, options: ReportOptions = {}) {
    const locale = options.locale ?? 'ar';
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    applyBase(doc, locale);
    addHeader(doc, headers[locale].log);

    doc.setFontSize(12);
    doc.text(`${locale === 'ar' ? 'التاريخ' : 'Date'}: ${payload.sessionDate}`, 12, 36);
    doc.text(`${locale === 'ar' ? 'التردد' : 'Frequency'}: ${payload.frequencyHz}Hz`, 12, 46);
    doc.text(`${locale === 'ar' ? 'ملاحظات' : 'Notes'}: ${payload.notes}`, 12, 56, { maxWidth: 180 });

    if (options.downloadName) doc.save(options.downloadName);
    return doc;
  }

  static generateCertificate(payload: CertificatePayload, options: ReportOptions = {}) {
    const locale = options.locale ?? 'ar';
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    applyBase(doc, locale);
    addHeader(doc, headers[locale].certificate);

    doc.setFontSize(14);
    doc.text(`${payload.patientName}`, 12, 40);
    doc.text(payload.summary, 12, 50, { maxWidth: 180 });
    doc.text(`${locale === 'ar' ? 'اكتمل في' : 'Completed on'}: ${payload.completedOn}`, 12, 62);

    if (options.downloadName) doc.save(options.downloadName);
    return doc;
  }
}

export default PDFReportGenerator;
