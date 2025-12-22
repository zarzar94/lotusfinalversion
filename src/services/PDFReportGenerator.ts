import jsPDF from 'jspdf';
import { createPdfDoc, writePdfText, PDF_MARGIN_X } from '../utils/pdf';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export type ReportType =
  | 'assessment_summary'
  | 'treatment_progress'
  | 'session_log'
  | 'audiogram'
  | 'parent_report'
  | 'school_report'
  | 'discharge_summary'
  | 'certificate';

export interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  schoolName?: string;
  gradeLevel?: string;
  referralSource?: string;
}

export interface AssessmentData {
  date: string;
  practitionerName: string;
  audiogramResults?: {
    leftEar: number[];
    rightEar: number[];
    frequencies: number[];
  };
  auditoryProcessingScores: {
    attention: number;
    discrimination: number;
    sequencing: number;
    memory: number;
    comprehension: number;
  };
  behavioralObservations: string[];
  recommendations: string[];
  followUpDate?: string;
}

export interface SessionData {
  sessionNumber: number;
  date: string;
  time: string;
  duration: number;
  frequenciesUsed: string;
  volumeLevel: string;
  patientResponse: 'positive' | 'neutral' | 'challenging';
  observations: string;
  practitionerName: string;
}

export interface TreatmentData {
  startDate: string;
  endDate?: string;
  totalSessions: number;
  completedSessions: number;
  sessions: SessionData[];
  preAssessment?: AssessmentData;
  postAssessment?: AssessmentData;
  overallProgress: {
    category: string;
    initial: number;
    current: number;
    change: number;
  }[];
  clinicianNotes: string;
  parentFeedback?: string;
}

export interface ReportOptions {
  language: 'en' | 'ar';
  includeHeader: boolean;
  includeFooter: boolean;
  includeLogo: boolean;
  pageSize: 'a4' | 'letter';
  orientation: 'portrait' | 'landscape';
}

// =============================================================================
// DESIGN TOKENS
// =============================================================================

const colors = {
  primary: '#00D4FF',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  background: '#F9FAFB',
};

// =============================================================================
// PDF REPORT GENERATOR CLASS
// =============================================================================

export class PDFReportGenerator {
  private doc: jsPDF;
  private options: ReportOptions;
  private currentY: number;
  private pageHeight: number;
  private pageWidth: number;
  private marginTop: number;
  private marginBottom: number;
  private isArabic: boolean;

  constructor(options: Partial<ReportOptions> = {}) {
    this.options = {
      language: options.language || 'en',
      includeHeader: options.includeHeader ?? true,
      includeFooter: options.includeFooter ?? true,
      includeLogo: options.includeLogo ?? true,
      pageSize: options.pageSize || 'a4',
      orientation: options.orientation || 'portrait',
    };

    this.isArabic = this.options.language === 'ar';
    this.marginTop = 40;
    this.marginBottom = 30;
    this.currentY = this.marginTop;
    this.doc = new jsPDF({
      orientation: this.options.orientation,
      unit: 'mm',
      format: this.options.pageSize,
    });

    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
  }

  // ---------------------------------------------------------------------------
  // UTILITY METHODS
  // ---------------------------------------------------------------------------

  private async initializeDoc(): Promise<void> {
    this.doc = await createPdfDoc({
      orientation: this.options.orientation,
      unit: 'mm',
      format: this.options.pageSize,
    });
    this.currentY = this.marginTop;
  }

  private checkPageBreak(height: number): void {
    if (this.currentY + height > this.pageHeight - this.marginBottom) {
      this.doc.addPage();
      this.currentY = this.marginTop;
      if (this.options.includeHeader) {
        this.addPageHeader();
      }
    }
  }

  private addPageHeader(): void {
    // Header line
    this.doc.setDrawColor(0, 212, 255);
    this.doc.setLineWidth(0.5);
    this.doc.line(PDF_MARGIN_X, 15, this.pageWidth - PDF_MARGIN_X, 15);

    // Logo text
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 212, 255);
    writePdfText(
      this.doc,
      this.isArabic ? 'لوتس ساوند لاب' : 'Lotus Sound Lab',
      this.pageWidth - PDF_MARGIN_X,
      10,
      { align: this.isArabic ? 'right' : 'left' }
    );

    // Date
    this.doc.setTextColor(107, 114, 128);
    this.doc.setFontSize(8);
    writePdfText(
      this.doc,
      new Date().toLocaleDateString(this.isArabic ? 'ar-SA' : 'en-US'),
      PDF_MARGIN_X,
      10,
      { align: this.isArabic ? 'left' : 'right' }
    );
  }

  private addPageFooter(pageNum: number, totalPages: number): void {
    const footerY = this.pageHeight - 15;

    // Footer line
    this.doc.setDrawColor(229, 231, 235);
    this.doc.setLineWidth(0.3);
    this.doc.line(PDF_MARGIN_X, footerY - 5, this.pageWidth - PDF_MARGIN_X, footerY - 5);

    // Page number
    this.doc.setFontSize(8);
    this.doc.setTextColor(107, 114, 128);
    const pageText = this.isArabic
      ? `صفحة ${pageNum} من ${totalPages}`
      : `Page ${pageNum} of ${totalPages}`;
    writePdfText(
      this.doc,
      pageText,
      this.pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    // Confidentiality notice
    const notice = this.isArabic
      ? 'وثيقة سرية - للاستخدام الطبي فقط'
      : 'Confidential Document - For Medical Use Only';
    writePdfText(
      this.doc,
      notice,
      this.pageWidth - PDF_MARGIN_X,
      footerY,
      { align: this.isArabic ? 'right' : 'left' }
    );
  }

  private addTitle(text: string, level: 1 | 2 | 3 = 1): void {
    const sizes = { 1: 18, 2: 14, 3: 12 };
    const margins = { 1: 10, 2: 8, 3: 6 };

    this.checkPageBreak(margins[level] * 2);
    this.currentY += margins[level];

    this.doc.setFontSize(sizes[level]);
    this.doc.setTextColor(31, 41, 55);
    writePdfText(this.doc, text, PDF_MARGIN_X, this.currentY, {
      align: this.isArabic ? 'right' : 'left',
    });

    this.currentY += margins[level];

    if (level === 1) {
      // Underline for main title
      this.doc.setDrawColor(0, 212, 255);
      this.doc.setLineWidth(0.8);
      this.doc.line(PDF_MARGIN_X, this.currentY, PDF_MARGIN_X + 50, this.currentY);
      this.currentY += 5;
    }
  }

  private addParagraph(text: string): void {
    this.checkPageBreak(15);

    this.doc.setFontSize(10);
    this.doc.setTextColor(75, 85, 99);

    const lines = this.doc.splitTextToSize(
      text,
      this.pageWidth - (PDF_MARGIN_X * 2)
    );

    lines.forEach((line: string) => {
      this.checkPageBreak(5);
      writePdfText(this.doc, line, PDF_MARGIN_X, this.currentY, {
        align: this.isArabic ? 'right' : 'left',
      });
      this.currentY += 5;
    });

    this.currentY += 3;
  }

  private addLabelValue(label: string, value: string): void {
    this.checkPageBreak(8);

    this.doc.setFontSize(9);
    this.doc.setTextColor(107, 114, 128);
    writePdfText(this.doc, label + ':', PDF_MARGIN_X, this.currentY, {
      align: this.isArabic ? 'right' : 'left',
    });

    this.doc.setTextColor(31, 41, 55);
    writePdfText(this.doc, value, PDF_MARGIN_X + 50, this.currentY, {
      align: this.isArabic ? 'right' : 'left',
    });

    this.currentY += 6;
  }

  private addTable(
    headers: string[],
    rows: string[][],
    columnWidths?: number[]
  ): void {
    const defaultWidth = (this.pageWidth - PDF_MARGIN_X * 2) / headers.length;
    const widths = columnWidths || headers.map(() => defaultWidth);
    const rowHeight = 8;

    this.checkPageBreak(rowHeight * 2);

    // Header
    this.doc.setFillColor(249, 250, 251);
    this.doc.rect(PDF_MARGIN_X, this.currentY - 3, this.pageWidth - PDF_MARGIN_X * 2, rowHeight, 'F');

    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    let xPos = PDF_MARGIN_X + 2;
    headers.forEach((header, i) => {
      writePdfText(this.doc, header, xPos, this.currentY, {
        align: this.isArabic ? 'right' : 'left',
      });
      xPos += widths[i];
    });

    this.currentY += rowHeight;

    // Rows
    this.doc.setTextColor(31, 41, 55);
    rows.forEach((row, rowIndex) => {
      this.checkPageBreak(rowHeight);

      if (rowIndex % 2 === 1) {
        this.doc.setFillColor(249, 250, 251);
        this.doc.rect(PDF_MARGIN_X, this.currentY - 3, this.pageWidth - PDF_MARGIN_X * 2, rowHeight, 'F');
      }

      xPos = PDF_MARGIN_X + 2;
      row.forEach((cell, i) => {
        writePdfText(this.doc, cell, xPos, this.currentY, {
          align: this.isArabic ? 'right' : 'left',
        });
        xPos += widths[i];
      });

      this.currentY += rowHeight;
    });

    this.currentY += 5;
  }

  private addProgressBar(label: string, value: number, maxValue: number = 100): void {
    this.checkPageBreak(15);

    const barWidth = 80;
    const barHeight = 6;
    const barX = PDF_MARGIN_X + 60;
    const percentage = Math.min((value / maxValue) * 100, 100);

    // Label
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);
    writePdfText(this.doc, label, PDF_MARGIN_X, this.currentY, {
      align: this.isArabic ? 'right' : 'left',
    });

    // Background bar
    this.doc.setFillColor(229, 231, 235);
    this.doc.roundedRect(barX, this.currentY - 4, barWidth, barHeight, 2, 2, 'F');

    // Progress bar
    const color = percentage >= 70 ? colors.success : percentage >= 40 ? colors.warning : colors.error;
    const rgb = this.hexToRgb(color);
    this.doc.setFillColor(rgb.r, rgb.g, rgb.b);
    this.doc.roundedRect(barX, this.currentY - 4, (barWidth * percentage) / 100, barHeight, 2, 2, 'F');

    // Value
    this.doc.setTextColor(31, 41, 55);
    writePdfText(this.doc, `${value}%`, barX + barWidth + 5, this.currentY, {
      align: 'left',
    });

    this.currentY += 10;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  private addSignatureLine(label: string): void {
    this.checkPageBreak(20);
    this.currentY += 10;

    this.doc.setDrawColor(75, 85, 99);
    this.doc.setLineWidth(0.3);
    this.doc.line(PDF_MARGIN_X, this.currentY, PDF_MARGIN_X + 60, this.currentY);

    this.doc.setFontSize(8);
    this.doc.setTextColor(107, 114, 128);
    writePdfText(this.doc, label, PDF_MARGIN_X, this.currentY + 5, {
      align: this.isArabic ? 'right' : 'left',
    });

    this.currentY += 15;
  }

  // ---------------------------------------------------------------------------
  // REPORT GENERATORS
  // ---------------------------------------------------------------------------

  public async generateAssessmentReport(
    patient: PatientData,
    assessment: AssessmentData
  ): Promise<Blob> {
    await this.initializeDoc();

    // Title
    this.addTitle(
      this.isArabic ? 'تقرير التقييم السمعي' : 'Auditory Assessment Report'
    );

    // Patient Info Section
    this.addTitle(
      this.isArabic ? 'معلومات المريض' : 'Patient Information',
      2
    );

    const patientLabel = (en: string, ar: string) => this.isArabic ? ar : en;
    this.addLabelValue(patientLabel('Name', 'الاسم'), `${patient.firstName} ${patient.lastName}`);
    this.addLabelValue(patientLabel('Date of Birth', 'تاريخ الميلاد'), patient.dateOfBirth);
    this.addLabelValue(patientLabel('Guardian', 'ولي الأمر'), patient.guardianName);
    this.addLabelValue(patientLabel('Assessment Date', 'تاريخ التقييم'), assessment.date);
    this.addLabelValue(patientLabel('Practitioner', 'الممارس'), assessment.practitionerName);

    // Auditory Processing Scores
    this.addTitle(
      this.isArabic ? 'نتائج المعالجة السمعية' : 'Auditory Processing Scores',
      2
    );

    const scoreLabels = {
      attention: this.isArabic ? 'الانتباه' : 'Attention',
      discrimination: this.isArabic ? 'التمييز' : 'Discrimination',
      sequencing: this.isArabic ? 'التسلسل' : 'Sequencing',
      memory: this.isArabic ? 'الذاكرة' : 'Memory',
      comprehension: this.isArabic ? 'الفهم' : 'Comprehension',
    };

    Object.entries(assessment.auditoryProcessingScores).forEach(([key, value]) => {
      this.addProgressBar(scoreLabels[key as keyof typeof scoreLabels], value);
    });

    // Behavioral Observations
    if (assessment.behavioralObservations.length > 0) {
      this.addTitle(
        this.isArabic ? 'الملاحظات السلوكية' : 'Behavioral Observations',
        2
      );

      assessment.behavioralObservations.forEach((obs) => {
        this.addParagraph(`• ${obs}`);
      });
    }

    // Recommendations
    if (assessment.recommendations.length > 0) {
      this.addTitle(
        this.isArabic ? 'التوصيات' : 'Recommendations',
        2
      );

      assessment.recommendations.forEach((rec) => {
        this.addParagraph(`• ${rec}`);
      });
    }

    // Follow-up
    if (assessment.followUpDate) {
      this.addLabelValue(
        this.isArabic ? 'موعد المتابعة' : 'Follow-up Date',
        assessment.followUpDate
      );
    }

    // Signature
    this.addSignatureLine(
      this.isArabic ? 'توقيع الممارس' : 'Practitioner Signature'
    );

    // Add footers
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      if (this.options.includeFooter) {
        this.addPageFooter(i, totalPages);
      }
    }

    return this.doc.output('blob');
  }

  public async generateTreatmentProgressReport(
    patient: PatientData,
    treatment: TreatmentData
  ): Promise<Blob> {
    await this.initializeDoc();

    // Title
    this.addTitle(
      this.isArabic ? 'تقرير تقدم العلاج' : 'Treatment Progress Report'
    );

    // Patient Info
    this.addTitle(
      this.isArabic ? 'معلومات المريض' : 'Patient Information',
      2
    );

    const patientLabel = (en: string, ar: string) => this.isArabic ? ar : en;
    this.addLabelValue(patientLabel('Name', 'الاسم'), `${patient.firstName} ${patient.lastName}`);
    this.addLabelValue(patientLabel('Treatment Period', 'فترة العلاج'),
      `${treatment.startDate} - ${treatment.endDate || this.isArabic ? 'مستمر' : 'Ongoing'}`
    );
    this.addLabelValue(
      patientLabel('Sessions', 'الجلسات'),
      `${treatment.completedSessions} / ${treatment.totalSessions}`
    );

    // Progress Summary
    this.addTitle(
      this.isArabic ? 'ملخص التقدم' : 'Progress Summary',
      2
    );

    if (treatment.overallProgress.length > 0) {
      const headers = this.isArabic
        ? ['الفئة', 'البداية', 'الحالي', 'التغير']
        : ['Category', 'Initial', 'Current', 'Change'];

      const rows = treatment.overallProgress.map((p) => [
        p.category,
        `${p.initial}%`,
        `${p.current}%`,
        `${p.change >= 0 ? '+' : ''}${p.change}%`,
      ]);

      this.addTable(headers, rows);
    }

    // Session Log Summary
    if (treatment.sessions.length > 0) {
      this.addTitle(
        this.isArabic ? 'سجل الجلسات' : 'Session Log',
        2
      );

      const sessionHeaders = this.isArabic
        ? ['#', 'التاريخ', 'المدة', 'الاستجابة']
        : ['#', 'Date', 'Duration', 'Response'];

      const sessionRows = treatment.sessions.slice(0, 10).map((s) => [
        String(s.sessionNumber),
        s.date,
        `${s.duration} min`,
        s.patientResponse === 'positive'
          ? (this.isArabic ? 'إيجابي' : 'Positive')
          : s.patientResponse === 'neutral'
            ? (this.isArabic ? 'محايد' : 'Neutral')
            : (this.isArabic ? 'صعب' : 'Challenging'),
      ]);

      this.addTable(sessionHeaders, sessionRows);
    }

    // Clinician Notes
    if (treatment.clinicianNotes) {
      this.addTitle(
        this.isArabic ? 'ملاحظات الطبيب' : 'Clinician Notes',
        2
      );
      this.addParagraph(treatment.clinicianNotes);
    }

    // Parent Feedback
    if (treatment.parentFeedback) {
      this.addTitle(
        this.isArabic ? 'ملاحظات ولي الأمر' : 'Parent Feedback',
        2
      );
      this.addParagraph(treatment.parentFeedback);
    }

    // Signatures
    this.addSignatureLine(
      this.isArabic ? 'توقيع الممارس' : 'Practitioner Signature'
    );
    this.addSignatureLine(
      this.isArabic ? 'توقيع ولي الأمر' : 'Parent/Guardian Signature'
    );

    // Add footers
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      if (this.options.includeFooter) {
        this.addPageFooter(i, totalPages);
      }
    }

    return this.doc.output('blob');
  }

  public async generateSessionLog(
    patient: PatientData,
    sessions: SessionData[]
  ): Promise<Blob> {
    await this.initializeDoc();

    // Title
    this.addTitle(
      this.isArabic ? 'سجل الجلسات المفصل' : 'Detailed Session Log'
    );

    // Patient Info
    this.addLabelValue(
      this.isArabic ? 'المريض' : 'Patient',
      `${patient.firstName} ${patient.lastName}`
    );
    this.addLabelValue(
      this.isArabic ? 'إجمالي الجلسات' : 'Total Sessions',
      String(sessions.length)
    );

    this.currentY += 5;

    // Sessions
    sessions.forEach((session) => {
      this.checkPageBreak(40);

      this.addTitle(
        `${this.isArabic ? 'الجلسة' : 'Session'} #${session.sessionNumber}`,
        3
      );

      this.addLabelValue(
        this.isArabic ? 'التاريخ والوقت' : 'Date & Time',
        `${session.date} ${session.time}`
      );
      this.addLabelValue(
        this.isArabic ? 'المدة' : 'Duration',
        `${session.duration} ${this.isArabic ? 'دقيقة' : 'minutes'}`
      );
      this.addLabelValue(
        this.isArabic ? 'الترددات المستخدمة' : 'Frequencies Used',
        session.frequenciesUsed
      );
      this.addLabelValue(
        this.isArabic ? 'مستوى الصوت' : 'Volume Level',
        session.volumeLevel
      );
      this.addLabelValue(
        this.isArabic ? 'استجابة المريض' : 'Patient Response',
        session.patientResponse
      );

      if (session.observations) {
        this.addParagraph(session.observations);
      }

      this.doc.setDrawColor(229, 231, 235);
      this.doc.line(PDF_MARGIN_X, this.currentY, this.pageWidth - PDF_MARGIN_X, this.currentY);
      this.currentY += 5;
    });

    // Add footers
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      if (this.options.includeFooter) {
        this.addPageFooter(i, totalPages);
      }
    }

    return this.doc.output('blob');
  }

  public async generateCertificate(
    patient: PatientData,
    completionDate: string,
    practitionerName: string
  ): Promise<Blob> {
    await this.initializeDoc();

    // Center the certificate
    this.currentY = 60;

    // Decorative border
    this.doc.setDrawColor(0, 212, 255);
    this.doc.setLineWidth(2);
    this.doc.rect(15, 15, this.pageWidth - 30, this.pageHeight - 30);

    this.doc.setLineWidth(0.5);
    this.doc.rect(20, 20, this.pageWidth - 40, this.pageHeight - 40);

    // Logo
    this.doc.setFontSize(24);
    this.doc.setTextColor(0, 212, 255);
    writePdfText(
      this.doc,
      '🎧',
      this.pageWidth / 2,
      this.currentY,
      { align: 'center' }
    );
    this.currentY += 15;

    // Title
    this.doc.setFontSize(28);
    this.doc.setTextColor(31, 41, 55);
    writePdfText(
      this.doc,
      this.isArabic ? 'شهادة إتمام' : 'Certificate of Completion',
      this.pageWidth / 2,
      this.currentY,
      { align: 'center' }
    );
    this.currentY += 20;

    // Subtitle
    this.doc.setFontSize(14);
    this.doc.setTextColor(107, 114, 128);
    writePdfText(
      this.doc,
      this.isArabic
        ? 'برنامج تدريب التكامل السمعي بيرارد'
        : 'Bérard Auditory Integration Training Program',
      this.pageWidth / 2,
      this.currentY,
      { align: 'center' }
    );
    this.currentY += 30;

    // Presented to
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    writePdfText(
      this.doc,
      this.isArabic ? 'تُمنح هذه الشهادة لـ' : 'This certifies that',
      this.pageWidth / 2,
      this.currentY,
      { align: 'center' }
    );
    this.currentY += 15;

    // Patient Name
    this.doc.setFontSize(24);
    this.doc.setTextColor(139, 92, 246);
    writePdfText(
      this.doc,
      `${patient.firstName} ${patient.lastName}`,
      this.pageWidth / 2,
      this.currentY,
      { align: 'center' }
    );
    this.currentY += 20;

    // Has successfully completed
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    const completionText = this.isArabic
      ? 'قد أكمل بنجاح برنامج العلاج المكون من 10 أيام'
      : 'has successfully completed the 10-day treatment program';
    writePdfText(
      this.doc,
      completionText,
      this.pageWidth / 2,
      this.currentY,
      { align: 'center' }
    );
    this.currentY += 30;

    // Date
    this.doc.setFontSize(10);
    this.doc.setTextColor(75, 85, 99);
    writePdfText(
      this.doc,
      `${this.isArabic ? 'تاريخ الإتمام:' : 'Completion Date:'} ${completionDate}`,
      this.pageWidth / 2,
      this.currentY,
      { align: 'center' }
    );
    this.currentY += 40;

    // Signatures
    const sigY = this.currentY;
    const leftX = this.pageWidth / 4;
    const rightX = (this.pageWidth / 4) * 3;

    // Left signature line
    this.doc.line(leftX - 30, sigY, leftX + 30, sigY);
    this.doc.setFontSize(9);
    writePdfText(
      this.doc,
      practitionerName,
      leftX,
      sigY + 6,
      { align: 'center' }
    );
    this.doc.setTextColor(107, 114, 128);
    writePdfText(
      this.doc,
      this.isArabic ? 'الممارس المعتمد' : 'Certified Practitioner',
      leftX,
      sigY + 11,
      { align: 'center' }
    );

    // Right signature line
    this.doc.setTextColor(75, 85, 99);
    this.doc.line(rightX - 30, sigY, rightX + 30, sigY);
    writePdfText(
      this.doc,
      this.isArabic ? 'لوتس ساوند لاب' : 'Lotus Sound Lab',
      rightX,
      sigY + 6,
      { align: 'center' }
    );
    this.doc.setTextColor(107, 114, 128);
    writePdfText(
      this.doc,
      this.isArabic ? 'المدير الإكلينيكي' : 'Clinical Director',
      rightX,
      sigY + 11,
      { align: 'center' }
    );

    return this.doc.output('blob');
  }

  // ---------------------------------------------------------------------------
  // DOWNLOAD HELPER
  // ---------------------------------------------------------------------------

  public static async downloadReport(
    blob: Blob,
    filename: string
  ): Promise<void> {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export default PDFReportGenerator;
