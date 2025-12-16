import React, { useState, useCallback, useMemo } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';

/**
 * Berard AIT Registration/Intake Form
 * Digital version of the paper intake form
 * Multi-step wizard with:
 * 1. Personal Data
 * 2. Parent/Guardian Info (for children)
 * 3. Medical History
 * 4. Progress Tracking (optional - for returning clients)
 */

interface PersonalData {
  name: string;
  age: string;
  gender: 'male' | 'female' | '';
  birthDate: string;
  birthPlace: string;
  residence: string;
  siblingsBoys: string;
  siblingsGirls: string;
  educationLevel: string;
  nationality: string;
  work: string;
  mobile: string;
}

interface ParentInfo {
  fatherName: string;
  fatherWork: string;
  fatherEducation: string;
  fatherEmail: string;
  fatherMobile: string;
  fatherPhone: string;
  motherName: string;
  motherWork: string;
  motherEducation: string;
  motherEmail: string;
  motherMobile: string;
  motherPhone: string;
}

interface MedicalHistory {
  pregnancyProblems: 'yes' | 'no' | '';
  pregnancyDetails: string;
  birthProblems: 'yes' | 'no' | '';
  birthDetails: string;
  developmentDelay: {
    walking: boolean;
    speech: boolean;
    toiletTraining: boolean;
  };
  hearingImpairment: 'none' | 'mild' | 'moderate' | 'severe' | '';
  hearingAids: 'yes' | 'no' | '';
  cochlearImplant: 'yes' | 'no' | '';
  painTolerance: 'high' | 'low' | 'normal' | '';
  earProblems: 'none' | 'previous' | 'current' | '';
  earTubeSurgery: 'yes' | 'no' | '';
  earTubeRemovalDate: string;
  skinSensitivity: 'yes' | 'no' | '';
  skinSensitivityLocation: string;
  seizures: 'yes' | 'no' | '';
  diet: 'none' | 'previous' | 'current' | '';
  dietDetails: string;
  medications: 'none' | 'previous' | 'current' | '';
  medicationDetails: string;
  balanceDifficulty: 'yes' | 'no' | '';
  sleepDisorders: 'never' | 'rarely' | 'sometimes' | 'often' | '';
  fineMotorDifficulty: 'yes' | 'no' | '';
  anxiety: 'yes' | 'no' | '';
  anxietyTriggers: string;
  attentionDifficulty: 'yes' | 'no' | '';
  hyperactivity: 'yes' | 'no' | '';
  followingInstructions: 'yes' | 'no' | 'sometimes' | '';
  soundSensitivity: 'yes' | 'no' | '';
  speechDiscrimination: 'never' | 'sometimes' | 'often' | '';
  socialDiscomfort: 'yes' | 'no' | '';
}

interface PreviousAIT {
  hadPreviousAIT: 'yes' | 'no' | '';
  previousLocation1: string;
  previousDate1: string;
  previousLocation2: string;
  previousDate2: string;
}

type ImprovementLevel = 'clear' | 'slight' | 'none' | '';

interface ProgressTracking {
  previousDate: string;
  currentDate: string;
  sensoryChanges: {
    soundSensitivity: ImprovementLevel;
    eyeContact: ImprovementLevel;
    eatingPatterns: ImprovementLevel;
    sleep: ImprovementLevel;
    skinSensitivity: ImprovementLevel;
    handSkills: ImprovementLevel;
    walkingBalance: ImprovementLevel;
  };
  behavioralChanges: {
    hyperactivity: ImprovementLevel;
    attention: ImprovementLevel;
    focus: ImprovementLevel;
    followingCommands: ImprovementLevel;
    playingWithChildren: ImprovementLevel;
    selfReliance: ImprovementLevel;
    languageBehavior: ImprovementLevel;
    anxietyFear: ImprovementLevel;
    socialInteraction: ImprovementLevel;
  };
  otherNotes: string;
}

const STEPS = [
  { id: 1, title: 'البيانات الشخصية', icon: '👤' },
  { id: 2, title: 'بيانات ولي الأمر', icon: '👨‍👩‍👧' },
  { id: 3, title: 'التاريخ الطبي', icon: '🏥' },
  { id: 4, title: 'متابعة التقدم', icon: '📈' },
];

// Form field component for consistent styling
const FormField: React.FC<{
  label: string;
  children: React.ReactNode;
  required?: boolean;
}> = ({ label, children, required }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      display: 'block',
      marginBottom: 6,
      fontSize: 14,
      fontWeight: 600,
      color: 'rgba(255,255,255,0.9)',
    }}>
      {label}
      {required && <span style={{ color: brandPink, marginRight: 4 }}>*</span>}
    </label>
    {children}
  </div>
);

// Input styling
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 10,
  border: '1px solid rgba(143,211,204,0.3)',
  background: 'rgba(11,15,28,0.6)',
  color: '#fff',
  fontSize: 15,
  direction: 'rtl',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

// Radio/Checkbox group styling
const RadioGroup: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}> = ({ options, value, onChange, name }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    {options.map((opt) => (
      <label
        key={opt.value}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          borderRadius: 8,
          background: value === opt.value
            ? `linear-gradient(135deg, ${brandCyan}30, ${brandPurple}30)`
            : 'rgba(255,255,255,0.05)',
          border: `1px solid ${value === opt.value ? brandCyan : 'rgba(255,255,255,0.1)'}`,
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontSize: 14,
        }}
      >
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={(e) => onChange(e.target.value)}
          style={{ accentColor: brandCyan }}
        />
        {opt.label}
      </label>
    ))}
  </div>
);

// Improvement level selector for progress tracking
const ImprovementSelector: React.FC<{
  value: ImprovementLevel;
  onChange: (value: ImprovementLevel) => void;
  label: string;
}> = ({ value, onChange, label }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 16,
    alignItems: 'center',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    marginBottom: 8,
  }}>
    <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
    <div style={{ display: 'flex', gap: 8 }}>
      {[
        { v: 'clear' as ImprovementLevel, l: 'تحسن واضح', c: brandCyan },
        { v: 'slight' as ImprovementLevel, l: 'تحسن بسيط', c: brandPurple },
        { v: 'none' as ImprovementLevel, l: 'لم يتحسن', c: 'rgba(255,255,255,0.4)' },
      ].map((opt) => (
        <button
          key={opt.v}
          type="button"
          onClick={() => onChange(opt.v)}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: `1px solid ${value === opt.v ? opt.c : 'rgba(255,255,255,0.1)'}`,
            background: value === opt.v ? `${opt.c}20` : 'transparent',
            color: value === opt.v ? opt.c : 'rgba(255,255,255,0.6)',
            fontSize: 12,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {opt.l}
        </button>
      ))}
    </div>
  </div>
);

const IntakeForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isChild, setIsChild] = useState(true);
  const [isReturningClient, setIsReturningClient] = useState(false);

  // Form state
  const [personalData, setPersonalData] = useState<PersonalData>({
    name: '', age: '', gender: '', birthDate: '', birthPlace: '',
    residence: '', siblingsBoys: '', siblingsGirls: '', educationLevel: '',
    nationality: '', work: '', mobile: '',
  });

  const [parentInfo, setParentInfo] = useState<ParentInfo>({
    fatherName: '', fatherWork: '', fatherEducation: '', fatherEmail: '',
    fatherMobile: '', fatherPhone: '', motherName: '', motherWork: '',
    motherEducation: '', motherEmail: '', motherMobile: '', motherPhone: '',
  });

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    pregnancyProblems: '', pregnancyDetails: '', birthProblems: '', birthDetails: '',
    developmentDelay: { walking: false, speech: false, toiletTraining: false },
    hearingImpairment: '', hearingAids: '', cochlearImplant: '', painTolerance: '',
    earProblems: '', earTubeSurgery: '', earTubeRemovalDate: '', skinSensitivity: '',
    skinSensitivityLocation: '', seizures: '', diet: '', dietDetails: '',
    medications: '', medicationDetails: '', balanceDifficulty: '', sleepDisorders: '',
    fineMotorDifficulty: '', anxiety: '', anxietyTriggers: '', attentionDifficulty: '',
    hyperactivity: '', followingInstructions: '', soundSensitivity: '',
    speechDiscrimination: '', socialDiscomfort: '',
  });

  const [previousAIT, setPreviousAIT] = useState<PreviousAIT>({
    hadPreviousAIT: '', previousLocation1: '', previousDate1: '',
    previousLocation2: '', previousDate2: '',
  });

  const [progressTracking, setProgressTracking] = useState<ProgressTracking>({
    previousDate: '', currentDate: '',
    sensoryChanges: {
      soundSensitivity: '', eyeContact: '', eatingPatterns: '',
      sleep: '', skinSensitivity: '', handSkills: '', walkingBalance: '',
    },
    behavioralChanges: {
      hyperactivity: '', attention: '', focus: '', followingCommands: '',
      playingWithChildren: '', selfReliance: '', languageBehavior: '',
      anxietyFear: '', socialInteraction: '',
    },
    otherNotes: '',
  });

  const updatePersonalData = useCallback((field: keyof PersonalData, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateParentInfo = useCallback((field: keyof ParentInfo, value: string) => {
    setParentInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateMedicalHistory = useCallback((field: keyof MedicalHistory, value: unknown) => {
    setMedicalHistory(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateSensoryChanges = useCallback((field: keyof ProgressTracking['sensoryChanges'], value: ImprovementLevel) => {
    setProgressTracking(prev => ({
      ...prev,
      sensoryChanges: { ...prev.sensoryChanges, [field]: value },
    }));
  }, []);

  const updateBehavioralChanges = useCallback((field: keyof ProgressTracking['behavioralChanges'], value: ImprovementLevel) => {
    setProgressTracking(prev => ({
      ...prev,
      behavioralChanges: { ...prev.behavioralChanges, [field]: value },
    }));
  }, []);

  // Calculate progress percentage
  const progress = useMemo(() => {
    const totalSteps = isReturningClient ? 4 : 3;
    return Math.round((currentStep / totalSteps) * 100);
  }, [currentStep, isReturningClient]);

  const handleNext = () => {
    const maxStep = isReturningClient ? 4 : 3;
    if (currentStep < maxStep) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    // Create WhatsApp message with form summary
    const formSummary = `
*استمارة تسجيل برنامج Berard AIT*
━━━━━━━━━━━━━━━━━━━━

*البيانات الشخصية:*
الاسم: ${personalData.name}
العمر: ${personalData.age}
الجنس: ${personalData.gender === 'male' ? 'ذكر' : personalData.gender === 'female' ? 'أنثى' : ''}
الجوال: ${personalData.mobile}
الجنسية: ${personalData.nationality}

${isChild ? `*بيانات ولي الأمر:*
اسم الأب: ${parentInfo.fatherName}
جوال الأب: ${parentInfo.fatherMobile}
اسم الأم: ${parentInfo.motherName}
جوال الأم: ${parentInfo.motherMobile}` : ''}

*ملاحظات طبية:*
ضعف سمعي: ${medicalHistory.hearingImpairment === 'none' ? 'لا يوجد' : medicalHistory.hearingImpairment}
حساسية للأصوات: ${medicalHistory.soundSensitivity === 'yes' ? 'نعم' : 'لا'}
صعوبة في الانتباه: ${medicalHistory.attentionDifficulty === 'yes' ? 'نعم' : 'لا'}
فرط الحركة: ${medicalHistory.hyperactivity === 'yes' ? 'نعم' : 'لا'}

━━━━━━━━━━━━━━━━━━━━
أرغب في حجز موعد للتقييم
    `.trim();

    const encodedMessage = encodeURIComponent(formSummary);
    const phone = import.meta.env.VITE_CLINIC_PHONE || '+971000000000';
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            {/* Client type selector */}
            <div style={{
              display: 'flex',
              gap: 16,
              marginBottom: 24,
              padding: 16,
              background: 'rgba(143,211,204,0.05)',
              borderRadius: 12,
            }}>
              <label style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: 16,
                borderRadius: 10,
                background: isChild ? `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}20)` : 'transparent',
                border: `2px solid ${isChild ? brandCyan : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}>
                <input
                  type="radio"
                  checked={isChild}
                  onChange={() => setIsChild(true)}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: 28 }}>👶</span>
                <span style={{ fontWeight: 600 }}>طفل</span>
              </label>
              <label style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: 16,
                borderRadius: 10,
                background: !isChild ? `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}20)` : 'transparent',
                border: `2px solid ${!isChild ? brandCyan : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}>
                <input
                  type="radio"
                  checked={!isChild}
                  onChange={() => setIsChild(false)}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: 28 }}>🧑</span>
                <span style={{ fontWeight: 600 }}>بالغ</span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              <FormField label="الاسم الكامل" required>
                <input
                  type="text"
                  value={personalData.name}
                  onChange={(e) => updatePersonalData('name', e.target.value)}
                  style={inputStyle}
                  placeholder="أدخل الاسم الكامل"
                />
              </FormField>

              <FormField label="العمر" required>
                <input
                  type="number"
                  value={personalData.age}
                  onChange={(e) => updatePersonalData('age', e.target.value)}
                  style={inputStyle}
                  placeholder="العمر بالسنوات"
                />
              </FormField>

              <FormField label="الجنس" required>
                <RadioGroup
                  name="gender"
                  options={[
                    { value: 'male', label: 'ذكر' },
                    { value: 'female', label: 'أنثى' },
                  ]}
                  value={personalData.gender}
                  onChange={(v) => updatePersonalData('gender', v)}
                />
              </FormField>

              <FormField label="تاريخ الميلاد">
                <input
                  type="date"
                  value={personalData.birthDate}
                  onChange={(e) => updatePersonalData('birthDate', e.target.value)}
                  style={inputStyle}
                />
              </FormField>

              <FormField label="مكان الميلاد">
                <input
                  type="text"
                  value={personalData.birthPlace}
                  onChange={(e) => updatePersonalData('birthPlace', e.target.value)}
                  style={inputStyle}
                  placeholder="المدينة / الدولة"
                />
              </FormField>

              <FormField label="مكان الإقامة" required>
                <input
                  type="text"
                  value={personalData.residence}
                  onChange={(e) => updatePersonalData('residence', e.target.value)}
                  style={inputStyle}
                  placeholder="العنوان الحالي"
                />
              </FormField>

              <FormField label="عدد الإخوة">
                <div style={{ display: 'flex', gap: 12 }}>
                  <input
                    type="number"
                    value={personalData.siblingsBoys}
                    onChange={(e) => updatePersonalData('siblingsBoys', e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="أولاد"
                    min="0"
                  />
                  <input
                    type="number"
                    value={personalData.siblingsGirls}
                    onChange={(e) => updatePersonalData('siblingsGirls', e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="بنات"
                    min="0"
                  />
                </div>
              </FormField>

              <FormField label="الجنسية">
                <input
                  type="text"
                  value={personalData.nationality}
                  onChange={(e) => updatePersonalData('nationality', e.target.value)}
                  style={inputStyle}
                  placeholder="الجنسية"
                />
              </FormField>

              <FormField label="المستوى التعليمي">
                <input
                  type="text"
                  value={personalData.educationLevel}
                  onChange={(e) => updatePersonalData('educationLevel', e.target.value)}
                  style={inputStyle}
                  placeholder="الصف / المرحلة الدراسية"
                />
              </FormField>

              <FormField label="رقم الجوال" required>
                <input
                  type="tel"
                  value={personalData.mobile}
                  onChange={(e) => updatePersonalData('mobile', e.target.value)}
                  style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }}
                  placeholder="05XXXXXXXX"
                />
              </FormField>
            </div>

            {/* Previous AIT section */}
            <div style={{
              marginTop: 24,
              padding: 20,
              background: 'rgba(175,132,186,0.1)',
              borderRadius: 12,
              border: '1px solid rgba(175,132,186,0.2)',
            }}>
              <FormField label="هل سبق أن خضعت لجلسات تدريب التكامل السمعي؟">
                <RadioGroup
                  name="previousAIT"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={previousAIT.hadPreviousAIT}
                  onChange={(v) => {
                    setPreviousAIT(prev => ({ ...prev, hadPreviousAIT: v as 'yes' | 'no' }));
                    setIsReturningClient(v === 'yes');
                  }}
                />
              </FormField>

              {previousAIT.hadPreviousAIT === 'yes' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                  <FormField label="أين؟ (الجلسة الأولى)">
                    <input
                      type="text"
                      value={previousAIT.previousLocation1}
                      onChange={(e) => setPreviousAIT(prev => ({ ...prev, previousLocation1: e.target.value }))}
                      style={inputStyle}
                    />
                  </FormField>
                  <FormField label="متى؟">
                    <input
                      type="text"
                      value={previousAIT.previousDate1}
                      onChange={(e) => setPreviousAIT(prev => ({ ...prev, previousDate1: e.target.value }))}
                      style={inputStyle}
                    />
                  </FormField>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        if (!isChild) {
          // Skip to medical history for adults
          setCurrentStep(3);
          return null;
        }
        return (
          <div>
            <div style={{
              padding: 16,
              background: 'rgba(143,211,204,0.1)',
              borderRadius: 12,
              marginBottom: 24,
              textAlign: 'center',
            }}>
              <span style={{ fontSize: 24 }}>👨‍👩‍👧</span>
              <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.8)' }}>
                للأطفال، يُعبأ بواسطة ولي الأمر
              </p>
            </div>

            {/* Father's Info */}
            <div style={{
              padding: 20,
              background: 'rgba(143,211,204,0.05)',
              borderRadius: 12,
              marginBottom: 20,
            }}>
              <h4 style={{ margin: '0 0 16px', color: brandCyan, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>👨</span> بيانات الأب
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <FormField label="اسم الأب">
                  <input
                    type="text"
                    value={parentInfo.fatherName}
                    onChange={(e) => updateParentInfo('fatherName', e.target.value)}
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="العمل">
                  <input
                    type="text"
                    value={parentInfo.fatherWork}
                    onChange={(e) => updateParentInfo('fatherWork', e.target.value)}
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="المستوى التعليمي">
                  <input
                    type="text"
                    value={parentInfo.fatherEducation}
                    onChange={(e) => updateParentInfo('fatherEducation', e.target.value)}
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="البريد الإلكتروني">
                  <input
                    type="email"
                    value={parentInfo.fatherEmail}
                    onChange={(e) => updateParentInfo('fatherEmail', e.target.value)}
                    style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }}
                  />
                </FormField>
                <FormField label="الجوال">
                  <input
                    type="tel"
                    value={parentInfo.fatherMobile}
                    onChange={(e) => updateParentInfo('fatherMobile', e.target.value)}
                    style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }}
                  />
                </FormField>
                <FormField label="هاتف">
                  <input
                    type="tel"
                    value={parentInfo.fatherPhone}
                    onChange={(e) => updateParentInfo('fatherPhone', e.target.value)}
                    style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }}
                  />
                </FormField>
              </div>
            </div>

            {/* Mother's Info */}
            <div style={{
              padding: 20,
              background: 'rgba(176,18,112,0.05)',
              borderRadius: 12,
            }}>
              <h4 style={{ margin: '0 0 16px', color: brandPink, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>👩</span> بيانات الأم
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <FormField label="اسم الأم">
                  <input
                    type="text"
                    value={parentInfo.motherName}
                    onChange={(e) => updateParentInfo('motherName', e.target.value)}
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="العمل">
                  <input
                    type="text"
                    value={parentInfo.motherWork}
                    onChange={(e) => updateParentInfo('motherWork', e.target.value)}
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="المستوى التعليمي">
                  <input
                    type="text"
                    value={parentInfo.motherEducation}
                    onChange={(e) => updateParentInfo('motherEducation', e.target.value)}
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="البريد الإلكتروني">
                  <input
                    type="email"
                    value={parentInfo.motherEmail}
                    onChange={(e) => updateParentInfo('motherEmail', e.target.value)}
                    style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }}
                  />
                </FormField>
                <FormField label="الجوال">
                  <input
                    type="tel"
                    value={parentInfo.motherMobile}
                    onChange={(e) => updateParentInfo('motherMobile', e.target.value)}
                    style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }}
                  />
                </FormField>
                <FormField label="هاتف">
                  <input
                    type="tel"
                    value={parentInfo.motherPhone}
                    onChange={(e) => updateParentInfo('motherPhone', e.target.value)}
                    style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }}
                  />
                </FormField>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div style={{
              padding: 16,
              background: 'rgba(176,18,112,0.1)',
              borderRadius: 12,
              marginBottom: 24,
              textAlign: 'center',
            }}>
              <span style={{ fontSize: 24 }}>🏥</span>
              <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.8)' }}>
                التاريخ الطبي والحالة الصحية
              </p>
            </div>

            {/* Pregnancy & Birth */}
            <div style={{
              padding: 20,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 12,
              marginBottom: 20,
            }}>
              <h4 style={{ margin: '0 0 16px', color: brandPurple }}>الحمل والولادة</h4>

              <FormField label="هل تعرضت الأم لمشاكل أثناء فترة الحمل؟">
                <RadioGroup
                  name="pregnancyProblems"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.pregnancyProblems}
                  onChange={(v) => updateMedicalHistory('pregnancyProblems', v)}
                />
                {medicalHistory.pregnancyProblems === 'yes' && (
                  <input
                    type="text"
                    value={medicalHistory.pregnancyDetails}
                    onChange={(e) => updateMedicalHistory('pregnancyDetails', e.target.value)}
                    style={{ ...inputStyle, marginTop: 12 }}
                    placeholder="يرجى التوضيح..."
                  />
                )}
              </FormField>

              <FormField label="هل حدثت مشاكل أثناء وبعد الولادة؟">
                <RadioGroup
                  name="birthProblems"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.birthProblems}
                  onChange={(v) => updateMedicalHistory('birthProblems', v)}
                />
              </FormField>

              <FormField label="هل حدث تأخر في النمو؟">
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {[
                    { key: 'walking', label: 'المشي' },
                    { key: 'speech', label: 'الكلام' },
                    { key: 'toiletTraining', label: 'قضاء الحاجة' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 16px',
                        borderRadius: 8,
                        background: medicalHistory.developmentDelay[item.key as keyof typeof medicalHistory.developmentDelay]
                          ? `${brandPink}20`
                          : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${medicalHistory.developmentDelay[item.key as keyof typeof medicalHistory.developmentDelay] ? brandPink : 'rgba(255,255,255,0.1)'}`,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={medicalHistory.developmentDelay[item.key as keyof typeof medicalHistory.developmentDelay]}
                        onChange={(e) => updateMedicalHistory('developmentDelay', {
                          ...medicalHistory.developmentDelay,
                          [item.key]: e.target.checked,
                        })}
                        style={{ accentColor: brandPink }}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </FormField>
            </div>

            {/* Hearing */}
            <div style={{
              padding: 20,
              background: 'rgba(143,211,204,0.05)',
              borderRadius: 12,
              marginBottom: 20,
            }}>
              <h4 style={{ margin: '0 0 16px', color: brandCyan }}>السمع</h4>

              <FormField label="هل تعاني من ضعف سمعي؟">
                <RadioGroup
                  name="hearingImpairment"
                  options={[
                    { value: 'none', label: 'لا' },
                    { value: 'mild', label: 'بسيط' },
                    { value: 'moderate', label: 'متوسط' },
                    { value: 'severe', label: 'شديد' },
                  ]}
                  value={medicalHistory.hearingImpairment}
                  onChange={(v) => updateMedicalHistory('hearingImpairment', v)}
                />
              </FormField>

              <FormField label="هل تستخدم سماعات طبية؟">
                <RadioGroup
                  name="hearingAids"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.hearingAids}
                  onChange={(v) => updateMedicalHistory('hearingAids', v)}
                />
              </FormField>

              <FormField label="هل تم إجراء عملية زرع القوقعة الإلكترونية؟">
                <RadioGroup
                  name="cochlearImplant"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.cochlearImplant}
                  onChange={(v) => updateMedicalHistory('cochlearImplant', v)}
                />
              </FormField>

              <FormField label="هل يوجد مشاكل بالأذن؟">
                <RadioGroup
                  name="earProblems"
                  options={[
                    { value: 'none', label: 'لا يوجد' },
                    { value: 'previous', label: 'سابقاً' },
                    { value: 'current', label: 'حالياً' },
                  ]}
                  value={medicalHistory.earProblems}
                  onChange={(v) => updateMedicalHistory('earProblems', v)}
                />
              </FormField>

              <FormField label="هل تعاني من حساسية تجاه بعض الأصوات؟">
                <RadioGroup
                  name="soundSensitivity"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.soundSensitivity}
                  onChange={(v) => updateMedicalHistory('soundSensitivity', v)}
                />
              </FormField>

              <FormField label="هل تعاني من صعوبة في تمييز أصوات الكلام؟">
                <RadioGroup
                  name="speechDiscrimination"
                  options={[
                    { value: 'never', label: 'لا' },
                    { value: 'sometimes', label: 'أحياناً' },
                    { value: 'often', label: 'غالباً' },
                  ]}
                  value={medicalHistory.speechDiscrimination}
                  onChange={(v) => updateMedicalHistory('speechDiscrimination', v)}
                />
              </FormField>
            </div>

            {/* Behavioral */}
            <div style={{
              padding: 20,
              background: 'rgba(175,132,186,0.05)',
              borderRadius: 12,
              marginBottom: 20,
            }}>
              <h4 style={{ margin: '0 0 16px', color: brandPurple }}>السلوك والانتباه</h4>

              <FormField label="هل تعاني من تشتت الانتباه؟">
                <RadioGroup
                  name="attentionDifficulty"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.attentionDifficulty}
                  onChange={(v) => updateMedicalHistory('attentionDifficulty', v)}
                />
              </FormField>

              <FormField label="هل تعاني من فرط الحركة؟">
                <RadioGroup
                  name="hyperactivity"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.hyperactivity}
                  onChange={(v) => updateMedicalHistory('hyperactivity', v)}
                />
              </FormField>

              <FormField label="هل توجد صعوبة أو تأخر في اتباع الأوامر والتعليمات؟">
                <RadioGroup
                  name="followingInstructions"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                    { value: 'sometimes', label: 'أحياناً' },
                  ]}
                  value={medicalHistory.followingInstructions}
                  onChange={(v) => updateMedicalHistory('followingInstructions', v)}
                />
              </FormField>

              <FormField label="هل تعاني من القلق أو الخوف؟">
                <RadioGroup
                  name="anxiety"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.anxiety}
                  onChange={(v) => updateMedicalHistory('anxiety', v)}
                />
                {medicalHistory.anxiety === 'yes' && (
                  <input
                    type="text"
                    value={medicalHistory.anxietyTriggers}
                    onChange={(e) => updateMedicalHistory('anxietyTriggers', e.target.value)}
                    style={{ ...inputStyle, marginTop: 12 }}
                    placeholder="من ماذا؟"
                  />
                )}
              </FormField>

              <FormField label="هل تعاني من الانزعاج أو التوتر في وجود أشخاص حولك؟">
                <RadioGroup
                  name="socialDiscomfort"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.socialDiscomfort}
                  onChange={(v) => updateMedicalHistory('socialDiscomfort', v)}
                />
              </FormField>
            </div>

            {/* Other Medical */}
            <div style={{
              padding: 20,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 12,
            }}>
              <h4 style={{ margin: '0 0 16px', color: 'rgba(255,255,255,0.9)' }}>معلومات طبية أخرى</h4>

              <FormField label="ما هو مستوى القدرة على تحمل الألم؟">
                <RadioGroup
                  name="painTolerance"
                  options={[
                    { value: 'high', label: 'مرتفع' },
                    { value: 'normal', label: 'عادي' },
                    { value: 'low', label: 'منخفض' },
                  ]}
                  value={medicalHistory.painTolerance}
                  onChange={(v) => updateMedicalHistory('painTolerance', v)}
                />
              </FormField>

              <FormField label="هل تعاني من حساسية بالجلد؟">
                <RadioGroup
                  name="skinSensitivity"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.skinSensitivity}
                  onChange={(v) => updateMedicalHistory('skinSensitivity', v)}
                />
              </FormField>

              <FormField label="هل تعاني من نوبات صرع أو تشنجات حالياً أو سابقاً؟">
                <RadioGroup
                  name="seizures"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.seizures}
                  onChange={(v) => updateMedicalHistory('seizures', v)}
                />
              </FormField>

              <FormField label="هل تعاني من اضطرابات النوم؟">
                <RadioGroup
                  name="sleepDisorders"
                  options={[
                    { value: 'never', label: 'لا' },
                    { value: 'rarely', label: 'نادراً' },
                    { value: 'sometimes', label: 'أحياناً' },
                    { value: 'often', label: 'غالباً' },
                  ]}
                  value={medicalHistory.sleepDisorders}
                  onChange={(v) => updateMedicalHistory('sleepDisorders', v)}
                />
              </FormField>

              <FormField label="هل تتناول أدوية أو مكملات غذائية؟">
                <RadioGroup
                  name="medications"
                  options={[
                    { value: 'none', label: 'لا' },
                    { value: 'previous', label: 'سابقاً' },
                    { value: 'current', label: 'حالياً' },
                  ]}
                  value={medicalHistory.medications}
                  onChange={(v) => updateMedicalHistory('medications', v)}
                />
                {(medicalHistory.medications === 'previous' || medicalHistory.medications === 'current') && (
                  <input
                    type="text"
                    value={medicalHistory.medicationDetails}
                    onChange={(e) => updateMedicalHistory('medicationDetails', e.target.value)}
                    style={{ ...inputStyle, marginTop: 12 }}
                    placeholder="ما هي؟"
                  />
                )}
              </FormField>
            </div>
          </div>
        );

      case 4:
        if (!isReturningClient) return null;
        return (
          <div>
            <div style={{
              padding: 16,
              background: 'linear-gradient(135deg, rgba(143,211,204,0.1), rgba(175,132,186,0.1))',
              borderRadius: 12,
              marginBottom: 24,
              textAlign: 'center',
            }}>
              <span style={{ fontSize: 24 }}>📈</span>
              <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.8)' }}>
                متابعة التقدم للعملاء العائدين
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <FormField label="التاريخ السابق">
                <input
                  type="date"
                  value={progressTracking.previousDate}
                  onChange={(e) => setProgressTracking(prev => ({ ...prev, previousDate: e.target.value }))}
                  style={inputStyle}
                />
              </FormField>
              <FormField label="التاريخ الحالي">
                <input
                  type="date"
                  value={progressTracking.currentDate}
                  onChange={(e) => setProgressTracking(prev => ({ ...prev, currentDate: e.target.value }))}
                  style={inputStyle}
                />
              </FormField>
            </div>

            {/* Sensory Changes */}
            <div style={{
              padding: 20,
              background: 'rgba(143,211,204,0.05)',
              borderRadius: 12,
              marginBottom: 20,
            }}>
              <h4 style={{ margin: '0 0 16px', color: brandCyan }}>التغيرات الحسية</h4>

              <ImprovementSelector
                label="الحساسية السمعية (إن وجد)"
                value={progressTracking.sensoryChanges.soundSensitivity}
                onChange={(v) => updateSensoryChanges('soundSensitivity', v)}
              />
              <ImprovementSelector
                label="التواصل البصري"
                value={progressTracking.sensoryChanges.eyeContact}
                onChange={(v) => updateSensoryChanges('eyeContact', v)}
              />
              <ImprovementSelector
                label="تغير نمط الأكل (تجربة أنواع جديدة)"
                value={progressTracking.sensoryChanges.eatingPatterns}
                onChange={(v) => updateSensoryChanges('eatingPatterns', v)}
              />
              <ImprovementSelector
                label="النوم"
                value={progressTracking.sensoryChanges.sleep}
                onChange={(v) => updateSensoryChanges('sleep', v)}
              />
              <ImprovementSelector
                label="الحساسية الجلدية (إن وجد)"
                value={progressTracking.sensoryChanges.skinSensitivity}
                onChange={(v) => updateSensoryChanges('skinSensitivity', v)}
              />
              <ImprovementSelector
                label="المهارات اليدوية (القلم - الملعقة - الأزرار)"
                value={progressTracking.sensoryChanges.handSkills}
                onChange={(v) => updateSensoryChanges('handSkills', v)}
              />
              <ImprovementSelector
                label="المشي والاتزان"
                value={progressTracking.sensoryChanges.walkingBalance}
                onChange={(v) => updateSensoryChanges('walkingBalance', v)}
              />
            </div>

            {/* Behavioral Changes */}
            <div style={{
              padding: 20,
              background: 'rgba(175,132,186,0.05)',
              borderRadius: 12,
              marginBottom: 20,
            }}>
              <h4 style={{ margin: '0 0 16px', color: brandPurple }}>التغيرات السلوكية</h4>

              <ImprovementSelector
                label="فرط الحركة (إن وجد)"
                value={progressTracking.behavioralChanges.hyperactivity}
                onChange={(v) => updateBehavioralChanges('hyperactivity', v)}
              />
              <ImprovementSelector
                label="الانتباه (سمعياً وبصرياً)"
                value={progressTracking.behavioralChanges.attention}
                onChange={(v) => updateBehavioralChanges('attention', v)}
              />
              <ImprovementSelector
                label="التركيز (عدم التشتت)"
                value={progressTracking.behavioralChanges.focus}
                onChange={(v) => updateBehavioralChanges('focus', v)}
              />
              <ImprovementSelector
                label="اتباع الأوامر"
                value={progressTracking.behavioralChanges.followingCommands}
                onChange={(v) => updateBehavioralChanges('followingCommands', v)}
              />
              <ImprovementSelector
                label="اللعب مع الأطفال"
                value={progressTracking.behavioralChanges.playingWithChildren}
                onChange={(v) => updateBehavioralChanges('playingWithChildren', v)}
              />
              <ImprovementSelector
                label="الاعتماد على النفس"
                value={progressTracking.behavioralChanges.selfReliance}
                onChange={(v) => updateBehavioralChanges('selfReliance', v)}
              />
              <ImprovementSelector
                label="السلوك اللغوي"
                value={progressTracking.behavioralChanges.languageBehavior}
                onChange={(v) => updateBehavioralChanges('languageBehavior', v)}
              />
              <ImprovementSelector
                label="القلق والخوف"
                value={progressTracking.behavioralChanges.anxietyFear}
                onChange={(v) => updateBehavioralChanges('anxietyFear', v)}
              />
              <ImprovementSelector
                label="التفاعل العاطفي والاجتماعي"
                value={progressTracking.behavioralChanges.socialInteraction}
                onChange={(v) => updateBehavioralChanges('socialInteraction', v)}
              />
            </div>

            {/* Other Notes */}
            <FormField label="ملاحظات أخرى">
              <textarea
                value={progressTracking.otherNotes}
                onChange={(e) => setProgressTracking(prev => ({ ...prev, otherNotes: e.target.value }))}
                style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }}
                placeholder="أي ملاحظات إضافية..."
              />
            </FormField>
          </div>
        );

      default:
        return null;
    }
  };

  const maxStep = isReturningClient ? 4 : 3;

  return (
    <section id="intake-form" style={{ ...styles.sectionCard, position: 'relative', overflow: 'hidden' }}>
      {/* Logo watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.03,
        pointerEvents: 'none',
        width: 400,
        height: 400,
      }}>
        <img
          src="/assets/images/brain_logo.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 24px',
          background: 'linear-gradient(135deg, rgba(143,211,204,0.15), rgba(175,132,186,0.15))',
          borderRadius: 50,
          marginBottom: 16,
        }}>
          <img
            src="/assets/images/brain_logo.png"
            alt="Berard AIT"
            style={{ width: 40, height: 40, objectFit: 'contain' }}
          />
          <span style={{ fontWeight: 900, fontSize: 18 }}>Berard AIT</span>
        </div>
        <h2 style={styles.heading}>استمارة التسجيل</h2>
        <p style={{ ...styles.muted, maxWidth: 600, margin: '0 auto' }}>
          برنامج تدريب التكامل السمعي - يرجى تعبئة البيانات بدقة
        </p>
      </div>

      {/* Progress bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 32,
        flexWrap: 'wrap',
      }}>
        {STEPS.slice(0, maxStep).map((step, idx) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 25,
              border: 'none',
              background: currentStep === step.id
                ? `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`
                : currentStep > step.id
                  ? 'rgba(143,211,204,0.2)'
                  : 'rgba(255,255,255,0.05)',
              color: currentStep >= step.id ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontSize: 14,
              fontWeight: currentStep === step.id ? 700 : 500,
            }}
          >
            <span>{step.icon}</span>
            <span style={{ display: idx < 2 ? 'inline' : 'none' }}>{step.title}</span>
            {currentStep > step.id && <span style={{ color: brandCyan }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Progress percentage */}
      <div style={{
        height: 4,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        marginBottom: 32,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
          borderRadius: 2,
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Form content */}
      <div style={{ minHeight: 400 }}>
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        marginTop: 32,
        paddingTop: 24,
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          style={{
            ...styles.secondaryBtn,
            opacity: currentStep === 1 ? 0.5 : 1,
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>→</span> السابق
        </button>

        {currentStep < maxStep ? (
          <button
            onClick={handleNext}
            style={{
              ...styles.primaryBtn,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            التالي <span>←</span>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{
              ...styles.primaryBtn,
              background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>📤</span> إرسال عبر واتساب
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: 24,
        padding: 16,
        background: 'rgba(176,18,112,0.1)',
        borderRadius: 12,
        border: '1px solid rgba(176,18,112,0.2)',
        textAlign: 'center',
      }}>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          <strong style={{ color: brandPink }}>تنبيه:</strong> لا يعتبر برنامج تدريب التكامل السمعي Berard AIT علاجاً في حد ذاته،
          وإنما هو إعادة تدريب للدماغ عن طريق السمع كمحاولة لتحسين قدرته على استقبال الرسائل الواردة إليه من الحواس
          (السمع والبصر والشم والتذوق واللمس) ومعالجتها والاستجابة لها بشكل أفضل.
        </p>
      </div>
    </section>
  );
};

export default IntakeForm;
