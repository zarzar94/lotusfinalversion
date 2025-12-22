import React, { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface PatientInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  nationality: string;
  idNumber: string;
}

interface GuardianInfo {
  relationship: 'mother' | 'father' | 'guardian' | 'self' | '';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
}

interface MedicalHistory {
  hasHearingLoss: boolean | null;
  hearingLossDetails: string;
  hasEarInfections: boolean | null;
  earInfectionDetails: string;
  hasTubesOrSurgery: boolean | null;
  surgeryDetails: string;
  currentMedications: string;
  allergies: string;
  previousTherapies: string[];
  otherMedicalConditions: string;
}

interface AuditoryProfile {
  soundSensitivity: number; // 1-5 scale
  attentionDifficulty: number;
  speechProcessing: number;
  readingDifficulty: number;
  followingInstructions: number;
  noisyEnvironments: number;
  primaryConcerns: string[];
  concernsDescription: string;
  goalsForTreatment: string;
}

interface SchoolInfo {
  schoolName: string;
  gradeLevel: string;
  teacherName: string;
  teacherEmail: string;
  hasIEP: boolean | null;
  specialServices: string[];
  academicChallenges: string;
}

interface ConsentInfo {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  dataProcessingAccepted: boolean;
  photoConsent: boolean;
  researchConsent: boolean;
  signature: string;
  signatureDate: string;
}

interface FormData {
  patient: PatientInfo;
  guardian: GuardianInfo;
  medical: MedicalHistory;
  auditory: AuditoryProfile;
  school: SchoolInfo;
  consent: ConsentInfo;
}

interface ValidationErrors {
  [key: string]: string;
}

type FormStep = 'patient' | 'guardian' | 'medical' | 'auditory' | 'school' | 'consent' | 'review';

interface SignupIntakeFormProps {
  onSubmit?: (data: FormData) => void;
  onCancel?: () => void;
  isChildPatient?: boolean;
}

// =============================================================================
// DESIGN TOKENS
// =============================================================================

const brand = {
  cyan: '#00D4FF',
  cyanDark: '#00A8CC',
  purple: '#8B5CF6',
  purpleDark: '#7C3AED',
  coral: '#FF6B6B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  dark: '#0A0A0F',
  card: 'rgba(255,255,255,0.03)',
  cardHover: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.7)',
    muted: 'rgba(255,255,255,0.5)',
  },
};

const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${brand.dark} 0%, #1a1a2e 50%, #16213e 100%)`,
    padding: '2rem',
    fontFamily: 'Cairo, sans-serif',
  } as React.CSSProperties,
  formCard: {
    maxWidth: '900px',
    margin: '0 auto',
    background: brand.card,
    border: `1px solid ${brand.border}`,
    borderRadius: '24px',
    overflow: 'hidden',
  } as React.CSSProperties,
  header: {
    background: `linear-gradient(135deg, ${brand.cyan}20 0%, ${brand.purple}20 100%)`,
    padding: '2rem',
    borderBottom: `1px solid ${brand.border}`,
    textAlign: 'center' as const,
  } as React.CSSProperties,
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: brand.text.primary,
    margin: 0,
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '1rem',
    color: brand.text.secondary,
    margin: 0,
  } as React.CSSProperties,
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1.5rem 2rem',
    borderBottom: `1px solid ${brand.border}`,
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  progressStep: (isActive: boolean, isCompleted: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    background: isActive
      ? `linear-gradient(135deg, ${brand.cyan}30 0%, ${brand.purple}30 100%)`
      : isCompleted
        ? `${brand.success}20`
        : 'transparent',
    border: `1px solid ${isActive ? brand.cyan : isCompleted ? brand.success : brand.border}`,
    transition: 'all 0.3s ease',
  } as React.CSSProperties),
  stepNumber: (isActive: boolean, isCompleted: boolean) => ({
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    background: isCompleted
      ? brand.success
      : isActive
        ? brand.cyan
        : brand.border,
    color: isCompleted || isActive ? brand.dark : brand.text.muted,
  } as React.CSSProperties),
  stepLabel: (isActive: boolean) => ({
    fontSize: '0.85rem',
    color: isActive ? brand.text.primary : brand.text.muted,
    fontWeight: isActive ? 600 : 400,
  } as React.CSSProperties),
  content: {
    padding: '2rem',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: brand.text.primary,
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  } as React.CSSProperties,
  fieldGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  } as React.CSSProperties,
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: brand.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties,
  required: {
    color: brand.coral,
    fontSize: '0.85rem',
  } as React.CSSProperties,
  input: (hasError: boolean) => ({
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: `1px solid ${hasError ? brand.error : brand.border}`,
    background: 'rgba(255,255,255,0.05)',
    color: brand.text.primary,
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  } as React.CSSProperties),
  select: (hasError: boolean) => ({
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: `1px solid ${hasError ? brand.error : brand.border}`,
    background: 'rgba(255,255,255,0.05)',
    color: brand.text.primary,
    fontSize: '1rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left 1rem center',
    paddingLeft: '2.5rem',
  } as React.CSSProperties),
  textarea: (hasError: boolean) => ({
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: `1px solid ${hasError ? brand.error : brand.border}`,
    background: 'rgba(255,255,255,0.05)',
    color: brand.text.primary,
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: '100px',
    fontFamily: 'inherit',
  } as React.CSSProperties),
  errorText: {
    fontSize: '0.8rem',
    color: brand.error,
    marginTop: '0.25rem',
  } as React.CSSProperties,
  radioGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  radioOption: (isSelected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    border: `1px solid ${isSelected ? brand.cyan : brand.border}`,
    background: isSelected ? `${brand.cyan}15` : 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties),
  radioLabel: {
    fontSize: '0.9rem',
    color: brand.text.primary,
    cursor: 'pointer',
  } as React.CSSProperties,
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  } as React.CSSProperties,
  checkboxOption: (isSelected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: `1px solid ${isSelected ? brand.purple : brand.border}`,
    background: isSelected ? `${brand.purple}15` : 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties),
  checkboxBox: (isSelected: boolean) => ({
    width: '20px',
    height: '20px',
    borderRadius: '6px',
    border: `2px solid ${isSelected ? brand.purple : brand.border}`,
    background: isSelected ? brand.purple : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: brand.text.primary,
    fontSize: '0.75rem',
    flexShrink: 0,
  } as React.CSSProperties),
  slider: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: brand.border,
    appearance: 'none' as const,
    cursor: 'pointer',
  } as React.CSSProperties,
  sliderValue: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
    fontSize: '0.8rem',
    color: brand.text.muted,
  } as React.CSSProperties,
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  } as React.CSSProperties,
  chip: (isSelected: boolean) => ({
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    border: `1px solid ${isSelected ? brand.cyan : brand.border}`,
    background: isSelected ? `${brand.cyan}20` : 'transparent',
    color: isSelected ? brand.cyan : brand.text.secondary,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties),
  booleanToggle: {
    display: 'flex',
    gap: '0.75rem',
  } as React.CSSProperties,
  booleanOption: (isSelected: boolean, isYes: boolean) => ({
    flex: 1,
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: `1px solid ${isSelected ? (isYes ? brand.success : brand.coral) : brand.border}`,
    background: isSelected ? (isYes ? `${brand.success}15` : `${brand.coral}15`) : 'transparent',
    color: isSelected ? (isYes ? brand.success : brand.coral) : brand.text.secondary,
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center' as const,
  } as React.CSSProperties),
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '1.5rem 2rem',
    borderTop: `1px solid ${brand.border}`,
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  button: (variant: 'primary' | 'secondary' | 'outline') => ({
    padding: '0.875rem 2rem',
    borderRadius: '12px',
    border: variant === 'outline' ? `1px solid ${brand.border}` : 'none',
    background: variant === 'primary'
      ? `linear-gradient(135deg, ${brand.cyan} 0%, ${brand.purple} 100%)`
      : variant === 'secondary'
        ? brand.success
        : 'transparent',
    color: brand.text.primary,
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties),
  reviewSection: {
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid ${brand.border}`,
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  reviewTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: brand.cyan,
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as React.CSSProperties,
  reviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  } as React.CSSProperties,
  reviewItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  } as React.CSSProperties,
  reviewLabel: {
    fontSize: '0.8rem',
    color: brand.text.muted,
  } as React.CSSProperties,
  reviewValue: {
    fontSize: '0.95rem',
    color: brand.text.primary,
  } as React.CSSProperties,
  editButton: {
    background: 'transparent',
    border: 'none',
    color: brand.cyan,
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  } as React.CSSProperties,
};

// =============================================================================
// INITIAL DATA
// =============================================================================

const initialFormData: FormData = {
  patient: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    idNumber: '',
  },
  guardian: {
    relationship: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    preferredContact: 'phone',
  },
  medical: {
    hasHearingLoss: null,
    hearingLossDetails: '',
    hasEarInfections: null,
    earInfectionDetails: '',
    hasTubesOrSurgery: null,
    surgeryDetails: '',
    currentMedications: '',
    allergies: '',
    previousTherapies: [],
    otherMedicalConditions: '',
  },
  auditory: {
    soundSensitivity: 3,
    attentionDifficulty: 3,
    speechProcessing: 3,
    readingDifficulty: 3,
    followingInstructions: 3,
    noisyEnvironments: 3,
    primaryConcerns: [],
    concernsDescription: '',
    goalsForTreatment: '',
  },
  school: {
    schoolName: '',
    gradeLevel: '',
    teacherName: '',
    teacherEmail: '',
    hasIEP: null,
    specialServices: [],
    academicChallenges: '',
  },
  consent: {
    termsAccepted: false,
    privacyAccepted: false,
    dataProcessingAccepted: false,
    photoConsent: false,
    researchConsent: false,
    signature: '',
    signatureDate: '',
  },
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const SignupIntakeForm: React.FC<SignupIntakeFormProps> = ({
  onSubmit,
  onCancel,
  isChildPatient = true,
}) => {
  const { isArabic } = useLanguage();
  const [currentStep, setCurrentStep] = useState<FormStep>('patient');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // ---------------------------------------------------------------------------
  // TRANSLATIONS
  // ---------------------------------------------------------------------------

  const t = useMemo(() => ({
    title: isArabic ? 'نموذج التسجيل والقبول' : 'Registration & Intake Form',
    subtitle: isArabic
      ? 'يرجى إكمال جميع الحقول المطلوبة للمتابعة'
      : 'Please complete all required fields to proceed',
    steps: {
      patient: isArabic ? 'المريض' : 'Patient',
      guardian: isArabic ? 'الوصي' : 'Guardian',
      medical: isArabic ? 'التاريخ الطبي' : 'Medical',
      auditory: isArabic ? 'الملف السمعي' : 'Auditory',
      school: isArabic ? 'المدرسة' : 'School',
      consent: isArabic ? 'الموافقة' : 'Consent',
      review: isArabic ? 'المراجعة' : 'Review',
    },
    patient: {
      title: isArabic ? 'معلومات المريض' : 'Patient Information',
      firstName: isArabic ? 'الاسم الأول' : 'First Name',
      lastName: isArabic ? 'اسم العائلة' : 'Last Name',
      dateOfBirth: isArabic ? 'تاريخ الميلاد' : 'Date of Birth',
      gender: isArabic ? 'الجنس' : 'Gender',
      male: isArabic ? 'ذكر' : 'Male',
      female: isArabic ? 'أنثى' : 'Female',
      other: isArabic ? 'آخر' : 'Other',
      nationality: isArabic ? 'الجنسية' : 'Nationality',
      idNumber: isArabic ? 'رقم الهوية' : 'ID Number',
    },
    guardian: {
      title: isArabic ? 'معلومات الوصي/ولي الأمر' : 'Guardian Information',
      relationship: isArabic ? 'صلة القرابة' : 'Relationship',
      mother: isArabic ? 'الأم' : 'Mother',
      father: isArabic ? 'الأب' : 'Father',
      guardian: isArabic ? 'الوصي' : 'Guardian',
      self: isArabic ? 'نفسي' : 'Self',
      firstName: isArabic ? 'الاسم الأول' : 'First Name',
      lastName: isArabic ? 'اسم العائلة' : 'Last Name',
      email: isArabic ? 'البريد الإلكتروني' : 'Email',
      phone: isArabic ? 'رقم الهاتف' : 'Phone Number',
      alternatePhone: isArabic ? 'رقم بديل' : 'Alternate Phone',
      preferredContact: isArabic ? 'طريقة التواصل المفضلة' : 'Preferred Contact Method',
    },
    medical: {
      title: isArabic ? 'التاريخ الطبي' : 'Medical History',
      hearingLoss: isArabic ? 'هل يعاني المريض من ضعف السمع؟' : 'Does the patient have hearing loss?',
      earInfections: isArabic ? 'هل يعاني من التهابات الأذن المتكررة؟' : 'History of ear infections?',
      tubesOrSurgery: isArabic ? 'هل خضع لعمليات جراحية في الأذن؟' : 'Any ear tubes or surgery?',
      currentMedications: isArabic ? 'الأدوية الحالية' : 'Current Medications',
      allergies: isArabic ? 'الحساسية' : 'Allergies',
      previousTherapies: isArabic ? 'العلاجات السابقة' : 'Previous Therapies',
      otherConditions: isArabic ? 'حالات طبية أخرى' : 'Other Medical Conditions',
      yes: isArabic ? 'نعم' : 'Yes',
      no: isArabic ? 'لا' : 'No',
    },
    auditory: {
      title: isArabic ? 'الملف السمعي' : 'Auditory Profile',
      soundSensitivity: isArabic ? 'الحساسية للأصوات' : 'Sound Sensitivity',
      attentionDifficulty: isArabic ? 'صعوبة التركيز' : 'Attention Difficulty',
      speechProcessing: isArabic ? 'معالجة الكلام' : 'Speech Processing',
      readingDifficulty: isArabic ? 'صعوبة القراءة' : 'Reading Difficulty',
      followingInstructions: isArabic ? 'اتباع التعليمات' : 'Following Instructions',
      noisyEnvironments: isArabic ? 'التعامل مع البيئات الصاخبة' : 'Noisy Environments',
      primaryConcerns: isArabic ? 'المخاوف الرئيسية' : 'Primary Concerns',
      concernsDescription: isArabic ? 'وصف المخاوف' : 'Describe Concerns',
      goals: isArabic ? 'أهداف العلاج' : 'Treatment Goals',
      low: isArabic ? 'منخفض' : 'Low',
      high: isArabic ? 'مرتفع' : 'High',
    },
    school: {
      title: isArabic ? 'معلومات المدرسة' : 'School Information',
      schoolName: isArabic ? 'اسم المدرسة' : 'School Name',
      gradeLevel: isArabic ? 'المستوى الدراسي' : 'Grade Level',
      teacherName: isArabic ? 'اسم المعلم' : 'Teacher Name',
      teacherEmail: isArabic ? 'بريد المعلم' : 'Teacher Email',
      hasIEP: isArabic ? 'هل لديه خطة تعليم فردية (IEP)؟' : 'Does the child have an IEP?',
      specialServices: isArabic ? 'الخدمات الخاصة' : 'Special Services',
      academicChallenges: isArabic ? 'التحديات الأكاديمية' : 'Academic Challenges',
    },
    consent: {
      title: isArabic ? 'الموافقة والإقرار' : 'Consent & Acknowledgment',
      termsTitle: isArabic ? 'الشروط والأحكام' : 'Terms & Conditions',
      termsAccepted: isArabic
        ? 'أوافق على شروط وأحكام الخدمة'
        : 'I agree to the Terms of Service',
      privacyAccepted: isArabic
        ? 'أوافق على سياسة الخصوصية'
        : 'I agree to the Privacy Policy',
      dataProcessing: isArabic
        ? 'أوافق على معالجة البيانات لأغراض العلاج'
        : 'I consent to data processing for treatment purposes',
      photoConsent: isArabic
        ? 'أوافق على التقاط الصور/الفيديو لأغراض التوثيق'
        : 'I consent to photo/video capture for documentation',
      researchConsent: isArabic
        ? 'أوافق على المشاركة في الأبحاث المجهولة (اختياري)'
        : 'I consent to participation in anonymized research (optional)',
      signature: isArabic ? 'التوقيع الرقمي' : 'Digital Signature',
      signatureHint: isArabic ? 'اكتب اسمك الكامل كتوقيع' : 'Type your full name as signature',
    },
    review: {
      title: isArabic ? 'مراجعة المعلومات' : 'Review Information',
      edit: isArabic ? 'تعديل' : 'Edit',
    },
    concerns: {
      attention: isArabic ? 'صعوبات الانتباه' : 'Attention difficulties',
      processing: isArabic ? 'مشاكل المعالجة السمعية' : 'Auditory processing issues',
      sensitivity: isArabic ? 'الحساسية للأصوات' : 'Sound sensitivity',
      speech: isArabic ? 'تأخر الكلام' : 'Speech delays',
      reading: isArabic ? 'صعوبات القراءة' : 'Reading difficulties',
      behavior: isArabic ? 'المشاكل السلوكية' : 'Behavioral issues',
      academic: isArabic ? 'التحديات الأكاديمية' : 'Academic challenges',
      social: isArabic ? 'المهارات الاجتماعية' : 'Social skills',
    },
    therapies: {
      speechTherapy: isArabic ? 'علاج النطق' : 'Speech Therapy',
      occupationalTherapy: isArabic ? 'العلاج الوظيفي' : 'Occupational Therapy',
      behavioralTherapy: isArabic ? 'العلاج السلوكي' : 'Behavioral Therapy',
      physicalTherapy: isArabic ? 'العلاج الطبيعي' : 'Physical Therapy',
      musicTherapy: isArabic ? 'العلاج بالموسيقى' : 'Music Therapy',
      playTherapy: isArabic ? 'العلاج باللعب' : 'Play Therapy',
    },
    services: {
      speechServices: isArabic ? 'خدمات النطق' : 'Speech Services',
      resourceRoom: isArabic ? 'غرفة المصادر' : 'Resource Room',
      counseling: isArabic ? 'الإرشاد النفسي' : 'Counseling',
      occupationalTherapy: isArabic ? 'العلاج الوظيفي' : 'Occupational Therapy',
      readingIntervention: isArabic ? 'تدخل القراءة' : 'Reading Intervention',
      behaviorSupport: isArabic ? 'دعم السلوك' : 'Behavior Support',
    },
    buttons: {
      next: isArabic ? 'التالي' : 'Next',
      previous: isArabic ? 'السابق' : 'Previous',
      submit: isArabic ? 'إرسال' : 'Submit',
      cancel: isArabic ? 'إلغاء' : 'Cancel',
      save: isArabic ? 'حفظ المسودة' : 'Save Draft',
    },
    validation: {
      required: isArabic ? 'هذا الحقل مطلوب' : 'This field is required',
      invalidEmail: isArabic ? 'بريد إلكتروني غير صالح' : 'Invalid email address',
      invalidPhone: isArabic ? 'رقم هاتف غير صالح' : 'Invalid phone number',
      minLength: (n: number) => isArabic ? `الحد الأدنى ${n} أحرف` : `Minimum ${n} characters`,
      acceptTerms: isArabic ? 'يجب الموافقة على الشروط' : 'You must accept the terms',
    },
  }), [isArabic]);

  // ---------------------------------------------------------------------------
  // STEP CONFIGURATION
  // ---------------------------------------------------------------------------

  const steps: FormStep[] = useMemo(() =>
    isChildPatient
      ? ['patient', 'guardian', 'medical', 'auditory', 'school', 'consent', 'review']
      : ['patient', 'guardian', 'medical', 'auditory', 'consent', 'review'],
    [isChildPatient]
  );

  const stepIndex = steps.indexOf(currentStep);

  // ---------------------------------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------------------------------

  const validateField = useCallback((section: string, field: string, value: unknown): string => {
    const key = `${section}.${field}`;

    // Required field validations
    const requiredFields: Record<string, boolean> = {
      'patient.firstName': true,
      'patient.lastName': true,
      'patient.dateOfBirth': true,
      'patient.gender': true,
      'guardian.relationship': true,
      'guardian.firstName': true,
      'guardian.lastName': true,
      'guardian.email': true,
      'guardian.phone': true,
      'consent.termsAccepted': true,
      'consent.privacyAccepted': true,
      'consent.dataProcessingAccepted': true,
      'consent.signature': true,
    };

    if (requiredFields[key] && !value) {
      return t.validation.required;
    }

    // Email validation
    if (field === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value as string)) {
        return t.validation.invalidEmail;
      }
    }

    // Phone validation
    if ((field === 'phone' || field === 'alternatePhone') && value) {
      const phoneRegex = /^0[15][0-9]{8}$/;
      if (!phoneRegex.test((value as string).replace(/\s/g, ''))) {
        return t.validation.invalidPhone;
      }
    }

    // Consent checkboxes
    if (section === 'consent' && field.endsWith('Accepted') && !value) {
      return t.validation.acceptTerms;
    }

    return '';
  }, [t]);

  const validateStep = useCallback((step: FormStep): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    const validateSection = (section: keyof FormData) => {
      const sectionData = formData[section];
      Object.entries(sectionData).forEach(([field, value]) => {
        const error = validateField(section, field, value);
        if (error) {
          newErrors[`${section}.${field}`] = error;
          isValid = false;
        }
      });
    };

    switch (step) {
      case 'patient':
        validateSection('patient');
        break;
      case 'guardian':
        validateSection('guardian');
        break;
      case 'medical':
        // No required fields in medical section
        break;
      case 'auditory':
        // No required fields in auditory section
        break;
      case 'school':
        // No required fields in school section
        break;
      case 'consent':
        validateSection('consent');
        break;
      case 'review':
        // Validate all sections
        steps.forEach(s => {
          if (s !== 'review') {
            validateSection(s === 'school' && !isChildPatient ? 'patient' : s as keyof FormData);
          }
        });
        break;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, steps, isChildPatient, validateField]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const updateField = useCallback(<S extends keyof FormData>(
    section: S,
    field: keyof FormData[S],
    value: FormData[S][keyof FormData[S]]
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    const key = `${section}.${String(field)}`;
    setTouched(prev => new Set(prev).add(key));

    // Clear error when field is updated
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }, [errors]);

  const toggleArrayField = useCallback(<S extends keyof FormData>(
    section: S,
    field: keyof FormData[S],
    value: string
  ) => {
    setFormData(prev => {
      const arr = prev[section][field] as string[];
      const newArr = arr.includes(value)
        ? arr.filter(v => v !== value)
        : [...arr, value];
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArr,
        },
      };
    });
  }, []);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      const nextIndex = stepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex]);
      }
    }
  }, [currentStep, stepIndex, steps, validateStep]);

  const handlePrevious = useCallback(() => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  }, [stepIndex, steps]);

  const handleSubmit = useCallback(() => {
    if (validateStep('review')) {
      onSubmit?.(formData);
    }
  }, [formData, onSubmit, validateStep]);

  const goToStep = useCallback((step: FormStep) => {
    setCurrentStep(step);
  }, []);

  // ---------------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------------

  const renderInput = (
    section: keyof FormData,
    field: string,
    label: string,
    type: string = 'text',
    required: boolean = false,
    placeholder?: string
  ) => {
    const key = `${section}.${field}`;
    const value = (formData[section] as Record<string, unknown>)[field] as string;
    const hasError = !!errors[key] && touched.has(key);

    return (
      <div style={styles.field}>
        <label style={styles.label}>
          {label}
          {required && <span style={styles.required}>*</span>}
        </label>
        <input
          type={type}
          value={value || ''}
          onChange={(e) => updateField(section, field as keyof FormData[typeof section], e.target.value as FormData[typeof section][keyof FormData[typeof section]])}
          style={styles.input(hasError)}
          placeholder={placeholder}
          dir={isArabic ? 'rtl' : 'ltr'}
        />
        {hasError && <span style={styles.errorText}>{errors[key]}</span>}
      </div>
    );
  };

  const renderSelect = (
    section: keyof FormData,
    field: string,
    label: string,
    options: { value: string; label: string }[],
    required: boolean = false
  ) => {
    const key = `${section}.${field}`;
    const value = (formData[section] as Record<string, unknown>)[field] as string;
    const hasError = !!errors[key] && touched.has(key);

    return (
      <div style={styles.field}>
        <label style={styles.label}>
          {label}
          {required && <span style={styles.required}>*</span>}
        </label>
        <select
          value={value || ''}
          onChange={(e) => updateField(section, field as keyof FormData[typeof section], e.target.value as FormData[typeof section][keyof FormData[typeof section]])}
          style={styles.select(hasError)}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <option value="">{isArabic ? 'اختر...' : 'Select...'}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {hasError && <span style={styles.errorText}>{errors[key]}</span>}
      </div>
    );
  };

  const renderTextarea = (
    section: keyof FormData,
    field: string,
    label: string,
    required: boolean = false,
    placeholder?: string
  ) => {
    const key = `${section}.${field}`;
    const value = (formData[section] as Record<string, unknown>)[field] as string;
    const hasError = !!errors[key] && touched.has(key);

    return (
      <div style={styles.field}>
        <label style={styles.label}>
          {label}
          {required && <span style={styles.required}>*</span>}
        </label>
        <textarea
          value={value || ''}
          onChange={(e) => updateField(section, field as keyof FormData[typeof section], e.target.value as FormData[typeof section][keyof FormData[typeof section]])}
          style={styles.textarea(hasError)}
          placeholder={placeholder}
          dir={isArabic ? 'rtl' : 'ltr'}
        />
        {hasError && <span style={styles.errorText}>{errors[key]}</span>}
      </div>
    );
  };

  const renderBooleanToggle = (
    section: keyof FormData,
    field: string,
    label: string
  ) => {
    const value = (formData[section] as Record<string, unknown>)[field] as boolean | null;

    return (
      <div style={styles.field}>
        <label style={styles.label}>{label}</label>
        <div style={styles.booleanToggle}>
          <button
            type="button"
            onClick={() => updateField(section, field as keyof FormData[typeof section], true as FormData[typeof section][keyof FormData[typeof section]])}
            style={styles.booleanOption(value === true, true)}
          >
            {t.medical.yes}
          </button>
          <button
            type="button"
            onClick={() => updateField(section, field as keyof FormData[typeof section], false as FormData[typeof section][keyof FormData[typeof section]])}
            style={styles.booleanOption(value === false, false)}
          >
            {t.medical.no}
          </button>
        </div>
      </div>
    );
  };

  const renderSlider = (
    section: keyof FormData,
    field: string,
    label: string
  ) => {
    const value = (formData[section] as Record<string, unknown>)[field] as number;

    return (
      <div style={styles.field}>
        <label style={styles.label}>{label}: {value}/5</label>
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => updateField(section, field as keyof FormData[typeof section], parseInt(e.target.value) as FormData[typeof section][keyof FormData[typeof section]])}
          style={styles.slider}
        />
        <div style={styles.sliderValue}>
          <span>{t.auditory.low}</span>
          <span>{t.auditory.high}</span>
        </div>
      </div>
    );
  };

  const renderChipSelect = (
    section: keyof FormData,
    field: string,
    label: string,
    options: { value: string; label: string }[]
  ) => {
    const values = (formData[section] as Record<string, unknown>)[field] as string[];

    return (
      <div style={styles.field}>
        <label style={styles.label}>{label}</label>
        <div style={styles.chipContainer}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleArrayField(section, field as keyof FormData[typeof section], opt.value)}
              style={styles.chip(values.includes(opt.value))}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderCheckbox = (
    section: keyof FormData,
    field: string,
    label: string,
    required: boolean = false
  ) => {
    const key = `${section}.${field}`;
    const value = (formData[section] as Record<string, unknown>)[field] as boolean;
    const hasError = !!errors[key] && touched.has(key);

    return (
      <div
        style={styles.checkboxOption(value)}
        onClick={() => updateField(section, field as keyof FormData[typeof section], !value as FormData[typeof section][keyof FormData[typeof section]])}
      >
        <div style={styles.checkboxBox(value)}>
          {value && '✓'}
        </div>
        <span style={styles.radioLabel}>
          {label}
          {required && <span style={styles.required}>*</span>}
        </span>
        {hasError && <span style={{ ...styles.errorText, marginLeft: 'auto' }}>{errors[key]}</span>}
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // RENDER SECTIONS
  // ---------------------------------------------------------------------------

  const renderPatientStep = () => (
    <>
      <h3 style={styles.sectionTitle}>
        <span>👤</span>
        {t.patient.title}
      </h3>
      <div style={styles.fieldGroup}>
        {renderInput('patient', 'firstName', t.patient.firstName, 'text', true)}
        {renderInput('patient', 'lastName', t.patient.lastName, 'text', true)}
      </div>
      <div style={styles.fieldGroup}>
        {renderInput('patient', 'dateOfBirth', t.patient.dateOfBirth, 'date', true)}
        {renderSelect('patient', 'gender', t.patient.gender, [
          { value: 'male', label: t.patient.male },
          { value: 'female', label: t.patient.female },
          { value: 'other', label: t.patient.other },
        ], true)}
      </div>
      <div style={styles.fieldGroup}>
        {renderInput('patient', 'nationality', t.patient.nationality)}
        {renderInput('patient', 'idNumber', t.patient.idNumber)}
      </div>
    </>
  );

  const renderGuardianStep = () => (
    <>
      <h3 style={styles.sectionTitle}>
        <span>👨‍👩‍👧</span>
        {t.guardian.title}
      </h3>
      <div style={styles.fieldGroup}>
        {renderSelect('guardian', 'relationship', t.guardian.relationship, [
          { value: 'mother', label: t.guardian.mother },
          { value: 'father', label: t.guardian.father },
          { value: 'guardian', label: t.guardian.guardian },
          { value: 'self', label: t.guardian.self },
        ], true)}
      </div>
      <div style={styles.fieldGroup}>
        {renderInput('guardian', 'firstName', t.guardian.firstName, 'text', true)}
        {renderInput('guardian', 'lastName', t.guardian.lastName, 'text', true)}
      </div>
      <div style={styles.fieldGroup}>
        {renderInput('guardian', 'email', t.guardian.email, 'email', true)}
        {renderInput('guardian', 'phone', t.guardian.phone, 'tel', true, '05XXXXXXXX')}
      </div>
      <div style={styles.fieldGroup}>
        {renderInput('guardian', 'alternatePhone', t.guardian.alternatePhone, 'tel', false, '05XXXXXXXX')}
        {renderSelect('guardian', 'preferredContact', t.guardian.preferredContact, [
          { value: 'phone', label: isArabic ? 'هاتف' : 'Phone' },
          { value: 'email', label: isArabic ? 'بريد إلكتروني' : 'Email' },
          { value: 'whatsapp', label: 'WhatsApp' },
        ])}
      </div>
    </>
  );

  const renderMedicalStep = () => (
    <>
      <h3 style={styles.sectionTitle}>
        <span>🏥</span>
        {t.medical.title}
      </h3>
      <div style={styles.fieldGroup}>
        {renderBooleanToggle('medical', 'hasHearingLoss', t.medical.hearingLoss)}
        {formData.medical.hasHearingLoss &&
          renderTextarea('medical', 'hearingLossDetails', isArabic ? 'التفاصيل' : 'Details')
        }
      </div>
      <div style={styles.fieldGroup}>
        {renderBooleanToggle('medical', 'hasEarInfections', t.medical.earInfections)}
        {formData.medical.hasEarInfections &&
          renderTextarea('medical', 'earInfectionDetails', isArabic ? 'التفاصيل' : 'Details')
        }
      </div>
      <div style={styles.fieldGroup}>
        {renderBooleanToggle('medical', 'hasTubesOrSurgery', t.medical.tubesOrSurgery)}
        {formData.medical.hasTubesOrSurgery &&
          renderTextarea('medical', 'surgeryDetails', isArabic ? 'التفاصيل' : 'Details')
        }
      </div>
      <div style={styles.fieldGroup}>
        {renderTextarea('medical', 'currentMedications', t.medical.currentMedications)}
        {renderTextarea('medical', 'allergies', t.medical.allergies)}
      </div>
      {renderChipSelect('medical', 'previousTherapies', t.medical.previousTherapies, [
        { value: 'speechTherapy', label: t.therapies.speechTherapy },
        { value: 'occupationalTherapy', label: t.therapies.occupationalTherapy },
        { value: 'behavioralTherapy', label: t.therapies.behavioralTherapy },
        { value: 'physicalTherapy', label: t.therapies.physicalTherapy },
        { value: 'musicTherapy', label: t.therapies.musicTherapy },
        { value: 'playTherapy', label: t.therapies.playTherapy },
      ])}
      {renderTextarea('medical', 'otherMedicalConditions', t.medical.otherConditions)}
    </>
  );

  const renderAuditoryStep = () => (
    <>
      <h3 style={styles.sectionTitle}>
        <span>🎧</span>
        {t.auditory.title}
      </h3>
      <div style={styles.fieldGroup}>
        {renderSlider('auditory', 'soundSensitivity', t.auditory.soundSensitivity)}
        {renderSlider('auditory', 'attentionDifficulty', t.auditory.attentionDifficulty)}
      </div>
      <div style={styles.fieldGroup}>
        {renderSlider('auditory', 'speechProcessing', t.auditory.speechProcessing)}
        {renderSlider('auditory', 'readingDifficulty', t.auditory.readingDifficulty)}
      </div>
      <div style={styles.fieldGroup}>
        {renderSlider('auditory', 'followingInstructions', t.auditory.followingInstructions)}
        {renderSlider('auditory', 'noisyEnvironments', t.auditory.noisyEnvironments)}
      </div>
      {renderChipSelect('auditory', 'primaryConcerns', t.auditory.primaryConcerns, [
        { value: 'attention', label: t.concerns.attention },
        { value: 'processing', label: t.concerns.processing },
        { value: 'sensitivity', label: t.concerns.sensitivity },
        { value: 'speech', label: t.concerns.speech },
        { value: 'reading', label: t.concerns.reading },
        { value: 'behavior', label: t.concerns.behavior },
        { value: 'academic', label: t.concerns.academic },
        { value: 'social', label: t.concerns.social },
      ])}
      {renderTextarea('auditory', 'concernsDescription', t.auditory.concernsDescription)}
      {renderTextarea('auditory', 'goalsForTreatment', t.auditory.goals)}
    </>
  );

  const renderSchoolStep = () => (
    <>
      <h3 style={styles.sectionTitle}>
        <span>🏫</span>
        {t.school.title}
      </h3>
      <div style={styles.fieldGroup}>
        {renderInput('school', 'schoolName', t.school.schoolName)}
        {renderInput('school', 'gradeLevel', t.school.gradeLevel)}
      </div>
      <div style={styles.fieldGroup}>
        {renderInput('school', 'teacherName', t.school.teacherName)}
        {renderInput('school', 'teacherEmail', t.school.teacherEmail, 'email')}
      </div>
      {renderBooleanToggle('school', 'hasIEP', t.school.hasIEP)}
      {renderChipSelect('school', 'specialServices', t.school.specialServices, [
        { value: 'speechServices', label: t.services.speechServices },
        { value: 'resourceRoom', label: t.services.resourceRoom },
        { value: 'counseling', label: t.services.counseling },
        { value: 'occupationalTherapy', label: t.services.occupationalTherapy },
        { value: 'readingIntervention', label: t.services.readingIntervention },
        { value: 'behaviorSupport', label: t.services.behaviorSupport },
      ])}
      {renderTextarea('school', 'academicChallenges', t.school.academicChallenges)}
    </>
  );

  const renderConsentStep = () => (
    <>
      <h3 style={styles.sectionTitle}>
        <span>📝</span>
        {t.consent.title}
      </h3>
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ ...styles.label, marginBottom: '1rem', fontSize: '1rem' }}>
          {t.consent.termsTitle}
        </h4>
        <div style={styles.checkboxGroup}>
          {renderCheckbox('consent', 'termsAccepted', t.consent.termsAccepted, true)}
          {renderCheckbox('consent', 'privacyAccepted', t.consent.privacyAccepted, true)}
          {renderCheckbox('consent', 'dataProcessingAccepted', t.consent.dataProcessing, true)}
          {renderCheckbox('consent', 'photoConsent', t.consent.photoConsent)}
          {renderCheckbox('consent', 'researchConsent', t.consent.researchConsent)}
        </div>
      </div>
      <div style={styles.fieldGroup}>
        {renderInput('consent', 'signature', t.consent.signature, 'text', true, t.consent.signatureHint)}
        {renderInput('consent', 'signatureDate', isArabic ? 'تاريخ التوقيع' : 'Signature Date', 'date', true)}
      </div>
    </>
  );

  const renderReviewStep = () => {
    const renderReviewSection = (
      title: string,
      step: FormStep,
      items: { label: string; value: string | boolean | null | string[] }[]
    ) => (
      <div style={styles.reviewSection}>
        <div style={styles.reviewTitle}>
          <span>{title}</span>
          <button
            type="button"
            style={styles.editButton}
            onClick={() => goToStep(step)}
          >
            ✏️ {t.review.edit}
          </button>
        </div>
        <div style={styles.reviewGrid}>
          {items.filter(item => {
            if (item.value === null || item.value === undefined) return false;
            if (Array.isArray(item.value) && item.value.length === 0) return false;
            if (item.value === '') return false;
            return true;
          }).map((item, i) => (
            <div key={i} style={styles.reviewItem}>
              <span style={styles.reviewLabel}>{item.label}</span>
              <span style={styles.reviewValue}>
                {typeof item.value === 'boolean'
                  ? (item.value ? '✓' : '✗')
                  : Array.isArray(item.value)
                    ? item.value.join(', ')
                    : item.value
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <>
        <h3 style={styles.sectionTitle}>
          <span>📋</span>
          {t.review.title}
        </h3>

        {renderReviewSection(t.patient.title, 'patient', [
          { label: t.patient.firstName, value: formData.patient.firstName },
          { label: t.patient.lastName, value: formData.patient.lastName },
          { label: t.patient.dateOfBirth, value: formData.patient.dateOfBirth },
          { label: t.patient.gender, value: formData.patient.gender },
          { label: t.patient.nationality, value: formData.patient.nationality },
          { label: t.patient.idNumber, value: formData.patient.idNumber },
        ])}

        {renderReviewSection(t.guardian.title, 'guardian', [
          { label: t.guardian.relationship, value: formData.guardian.relationship },
          { label: t.guardian.firstName, value: formData.guardian.firstName },
          { label: t.guardian.lastName, value: formData.guardian.lastName },
          { label: t.guardian.email, value: formData.guardian.email },
          { label: t.guardian.phone, value: formData.guardian.phone },
          { label: t.guardian.preferredContact, value: formData.guardian.preferredContact },
        ])}

        {renderReviewSection(t.medical.title, 'medical', [
          { label: t.medical.hearingLoss, value: formData.medical.hasHearingLoss },
          { label: t.medical.earInfections, value: formData.medical.hasEarInfections },
          { label: t.medical.tubesOrSurgery, value: formData.medical.hasTubesOrSurgery },
          { label: t.medical.previousTherapies, value: formData.medical.previousTherapies },
          { label: t.medical.currentMedications, value: formData.medical.currentMedications },
          { label: t.medical.allergies, value: formData.medical.allergies },
        ])}

        {renderReviewSection(t.auditory.title, 'auditory', [
          { label: t.auditory.soundSensitivity, value: `${formData.auditory.soundSensitivity}/5` },
          { label: t.auditory.attentionDifficulty, value: `${formData.auditory.attentionDifficulty}/5` },
          { label: t.auditory.speechProcessing, value: `${formData.auditory.speechProcessing}/5` },
          { label: t.auditory.primaryConcerns, value: formData.auditory.primaryConcerns },
          { label: t.auditory.goals, value: formData.auditory.goalsForTreatment },
        ])}

        {isChildPatient && renderReviewSection(t.school.title, 'school', [
          { label: t.school.schoolName, value: formData.school.schoolName },
          { label: t.school.gradeLevel, value: formData.school.gradeLevel },
          { label: t.school.teacherName, value: formData.school.teacherName },
          { label: t.school.hasIEP, value: formData.school.hasIEP },
          { label: t.school.specialServices, value: formData.school.specialServices },
        ])}

        {renderReviewSection(t.consent.title, 'consent', [
          { label: t.consent.termsAccepted, value: formData.consent.termsAccepted },
          { label: t.consent.privacyAccepted, value: formData.consent.privacyAccepted },
          { label: t.consent.dataProcessing, value: formData.consent.dataProcessingAccepted },
          { label: t.consent.photoConsent, value: formData.consent.photoConsent },
          { label: t.consent.researchConsent, value: formData.consent.researchConsent },
          { label: t.consent.signature, value: formData.consent.signature },
        ])}
      </>
    );
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'patient': return renderPatientStep();
      case 'guardian': return renderGuardianStep();
      case 'medical': return renderMedicalStep();
      case 'auditory': return renderAuditoryStep();
      case 'school': return renderSchoolStep();
      case 'consent': return renderConsentStep();
      case 'review': return renderReviewStep();
      default: return null;
    }
  };

  return (
    <div style={styles.container} dir={isArabic ? 'rtl' : 'ltr'}>
      <div style={styles.formCard}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>{t.title}</h2>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>

        {/* Progress Steps */}
        <div style={styles.progressContainer}>
          {steps.map((step, index) => (
            <div
              key={step}
              style={styles.progressStep(step === currentStep, index < stepIndex)}
            >
              <div style={styles.stepNumber(step === currentStep, index < stepIndex)}>
                {index < stepIndex ? '✓' : index + 1}
              </div>
              <span style={styles.stepLabel(step === currentStep)}>
                {t.steps[step]}
              </span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={styles.content}>
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div style={styles.navigation}>
          <div>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={styles.button('outline')}
              >
                {t.buttons.cancel}
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                style={styles.button('outline')}
              >
                ← {t.buttons.previous}
              </button>
            )}
            {currentStep === 'review' ? (
              <button
                type="button"
                onClick={handleSubmit}
                style={styles.button('secondary')}
              >
                ✓ {t.buttons.submit}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                style={styles.button('primary')}
              >
                {t.buttons.next} →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupIntakeForm;
