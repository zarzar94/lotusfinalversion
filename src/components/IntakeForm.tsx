import React, { useState, useCallback, useMemo } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';
import { BrainIcon, UserIcon, HeartIcon, ChartIcon, CheckCircleIcon, ClipboardIcon } from './Icons';
import { BrainLogoSVG } from './BrainLogo';

/**
 * Berard AIT Registration/Intake Form
 * Designed as a Medical Tech Board/Tablet Interface
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
  { id: 1, title: 'البيانات الشخصية', icon: <UserIcon size={18} /> },
  { id: 2, title: 'بيانات ولي الأمر', icon: <HeartIcon size={18} /> },
  { id: 3, title: 'التاريخ الطبي', icon: <ClipboardIcon size={18} /> },
  { id: 4, title: 'متابعة التقدم', icon: <ChartIcon size={18} /> },
];

// Medical tablet input style
const tabletInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 8,
  border: '2px solid rgba(143,211,204,0.2)',
  background: 'rgba(0,20,30,0.6)',
  color: '#00ffcc',
  fontSize: 15,
  fontFamily: 'monospace',
  direction: 'rtl',
  outline: 'none',
  transition: 'all 0.2s ease',
};

// Form field component - medical style
const MedicalField: React.FC<{
  label: string;
  children: React.ReactNode;
  required?: boolean;
}> = ({ label, children, required }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
      fontSize: 13,
      fontWeight: 700,
      color: brandCyan,
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      letterSpacing: 1,
    }}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: required ? brandPink : brandCyan,
        boxShadow: required ? `0 0 8px ${brandPink}` : `0 0 8px ${brandCyan}`,
      }} />
      {label}
      {required && <span style={{ color: brandPink, fontSize: 10 }}>مطلوب</span>}
    </label>
    {children}
  </div>
);

// Radio selector - medical style
const MedicalRadio: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}> = ({ options, value, onChange, name }) => (
  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
    {options.map((opt) => (
      <label
        key={opt.value}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 18px',
          borderRadius: 8,
          background: value === opt.value
            ? `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}15)`
            : 'rgba(0,20,30,0.5)',
          border: `2px solid ${value === opt.value ? brandCyan : 'rgba(143,211,204,0.15)'}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'monospace',
          fontSize: 14,
          color: value === opt.value ? brandCyan : 'rgba(255,255,255,0.7)',
        }}
      >
        <div style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: `2px solid ${value === opt.value ? brandCyan : 'rgba(143,211,204,0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: value === opt.value ? brandCyan : 'transparent',
          transition: 'all 0.2s ease',
        }}>
          {value === opt.value && (
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#0a1520',
            }} />
          )}
        </div>
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={(e) => onChange(e.target.value)}
          style={{ display: 'none' }}
        />
        {opt.label}
      </label>
    ))}
  </div>
);

// Improvement level selector - medical monitor style
const VitalSelector: React.FC<{
  value: ImprovementLevel;
  onChange: (value: ImprovementLevel) => void;
  label: string;
}> = ({ value, onChange, label }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 16,
    alignItems: 'center',
    padding: '14px 18px',
    background: 'rgba(0,20,30,0.4)',
    borderRadius: 8,
    marginBottom: 10,
    border: '1px solid rgba(143,211,204,0.1)',
  }}>
    <span style={{
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'monospace',
      color: 'rgba(255,255,255,0.85)',
    }}>{label}</span>
    <div style={{ display: 'flex', gap: 8 }}>
      {[
        { v: 'clear' as ImprovementLevel, l: 'تحسن واضح', c: '#22c55e' },
        { v: 'slight' as ImprovementLevel, l: 'تحسن بسيط', c: brandCyan },
        { v: 'none' as ImprovementLevel, l: 'لم يتحسن', c: 'rgba(255,255,255,0.3)' },
      ].map((opt) => (
        <button
          key={opt.v}
          type="button"
          onClick={() => onChange(opt.v)}
          style={{
            padding: '8px 14px',
            borderRadius: 6,
            border: `2px solid ${value === opt.v ? opt.c : 'rgba(255,255,255,0.08)'}`,
            background: value === opt.v ? `${opt.c}20` : 'transparent',
            color: value === opt.v ? opt.c : 'rgba(255,255,255,0.4)',
            fontSize: 11,
            fontFamily: 'monospace',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: value === opt.v ? 700 : 500,
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            {/* Patient Type Selector */}
            <div style={{
              display: 'flex',
              gap: 16,
              marginBottom: 28,
              padding: 20,
              background: 'rgba(0,20,30,0.5)',
              borderRadius: 12,
              border: '1px solid rgba(143,211,204,0.1)',
            }}>
              {[
                { val: true, label: 'طفل', icon: '👶', desc: 'أقل من 18 سنة' },
                { val: false, label: 'بالغ', icon: '🧑', desc: '18 سنة أو أكثر' },
              ].map((opt) => (
                <label
                  key={opt.label}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    padding: 20,
                    borderRadius: 10,
                    background: isChild === opt.val
                      ? `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`
                      : 'transparent',
                    border: `2px solid ${isChild === opt.val ? brandCyan : 'rgba(143,211,204,0.15)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <input
                    type="radio"
                    checked={isChild === opt.val}
                    onChange={() => setIsChild(opt.val)}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: 36 }}>{opt.icon}</span>
                  <span style={{
                    fontWeight: 800,
                    fontSize: 16,
                    color: isChild === opt.val ? brandCyan : 'rgba(255,255,255,0.6)',
                    fontFamily: 'monospace',
                  }}>{opt.label}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{opt.desc}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 18 }}>
              <MedicalField label="اسم المريض" required>
                <input
                  type="text"
                  value={personalData.name}
                  onChange={(e) => updatePersonalData('name', e.target.value)}
                  style={tabletInputStyle}
                  placeholder="الاسم الكامل..."
                />
              </MedicalField>

              <MedicalField label="العمر" required>
                <input
                  type="number"
                  value={personalData.age}
                  onChange={(e) => updatePersonalData('age', e.target.value)}
                  style={tabletInputStyle}
                  placeholder="00"
                />
              </MedicalField>

              <MedicalField label="الجنس" required>
                <MedicalRadio
                  name="gender"
                  options={[
                    { value: 'male', label: 'ذكر' },
                    { value: 'female', label: 'أنثى' },
                  ]}
                  value={personalData.gender}
                  onChange={(v) => updatePersonalData('gender', v)}
                />
              </MedicalField>

              <MedicalField label="تاريخ الميلاد">
                <input
                  type="date"
                  value={personalData.birthDate}
                  onChange={(e) => updatePersonalData('birthDate', e.target.value)}
                  style={tabletInputStyle}
                />
              </MedicalField>

              <MedicalField label="مكان الإقامة" required>
                <input
                  type="text"
                  value={personalData.residence}
                  onChange={(e) => updatePersonalData('residence', e.target.value)}
                  style={tabletInputStyle}
                  placeholder="المدينة / الدولة"
                />
              </MedicalField>

              <MedicalField label="الجنسية">
                <input
                  type="text"
                  value={personalData.nationality}
                  onChange={(e) => updatePersonalData('nationality', e.target.value)}
                  style={tabletInputStyle}
                  placeholder="الجنسية"
                />
              </MedicalField>

              <MedicalField label="رقم الجوال" required>
                <input
                  type="tel"
                  value={personalData.mobile}
                  onChange={(e) => updatePersonalData('mobile', e.target.value)}
                  style={{ ...tabletInputStyle, direction: 'ltr', textAlign: 'right' }}
                  placeholder="+971 XX XXX XXXX"
                />
              </MedicalField>

              <MedicalField label="المستوى التعليمي">
                <input
                  type="text"
                  value={personalData.educationLevel}
                  onChange={(e) => updatePersonalData('educationLevel', e.target.value)}
                  style={tabletInputStyle}
                  placeholder="الصف / المرحلة"
                />
              </MedicalField>
            </div>

            {/* Previous AIT */}
            <div style={{
              marginTop: 28,
              padding: 20,
              background: 'rgba(175,132,186,0.08)',
              borderRadius: 12,
              border: '1px solid rgba(175,132,186,0.2)',
            }}>
              <MedicalField label="هل سبق أن خضعت لجلسات AIT؟">
                <MedicalRadio
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
              </MedicalField>

              {previousAIT.hadPreviousAIT === 'yes' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                  <MedicalField label="أين؟">
                    <input
                      type="text"
                      value={previousAIT.previousLocation1}
                      onChange={(e) => setPreviousAIT(prev => ({ ...prev, previousLocation1: e.target.value }))}
                      style={tabletInputStyle}
                    />
                  </MedicalField>
                  <MedicalField label="متى؟">
                    <input
                      type="text"
                      value={previousAIT.previousDate1}
                      onChange={(e) => setPreviousAIT(prev => ({ ...prev, previousDate1: e.target.value }))}
                      style={tabletInputStyle}
                    />
                  </MedicalField>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        if (!isChild) {
          setCurrentStep(3);
          return null;
        }
        return (
          <div>
            {/* Father Info */}
            <div style={{
              padding: 24,
              background: 'rgba(143,211,204,0.05)',
              borderRadius: 12,
              marginBottom: 24,
              border: '1px solid rgba(143,211,204,0.15)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: '1px solid rgba(143,211,204,0.1)',
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}20)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}>👨</div>
                <span style={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: brandCyan,
                  fontFamily: 'monospace',
                }}>بيانات الأب</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <MedicalField label="الاسم">
                  <input
                    type="text"
                    value={parentInfo.fatherName}
                    onChange={(e) => updateParentInfo('fatherName', e.target.value)}
                    style={tabletInputStyle}
                  />
                </MedicalField>
                <MedicalField label="الجوال" required>
                  <input
                    type="tel"
                    value={parentInfo.fatherMobile}
                    onChange={(e) => updateParentInfo('fatherMobile', e.target.value)}
                    style={{ ...tabletInputStyle, direction: 'ltr', textAlign: 'right' }}
                  />
                </MedicalField>
                <MedicalField label="البريد الإلكتروني">
                  <input
                    type="email"
                    value={parentInfo.fatherEmail}
                    onChange={(e) => updateParentInfo('fatherEmail', e.target.value)}
                    style={{ ...tabletInputStyle, direction: 'ltr', textAlign: 'right' }}
                  />
                </MedicalField>
                <MedicalField label="العمل">
                  <input
                    type="text"
                    value={parentInfo.fatherWork}
                    onChange={(e) => updateParentInfo('fatherWork', e.target.value)}
                    style={tabletInputStyle}
                  />
                </MedicalField>
              </div>
            </div>

            {/* Mother Info */}
            <div style={{
              padding: 24,
              background: 'rgba(176,18,112,0.05)',
              borderRadius: 12,
              border: '1px solid rgba(176,18,112,0.15)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: '1px solid rgba(176,18,112,0.1)',
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${brandPink}20, ${brandPurple}20)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}>👩</div>
                <span style={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: brandPink,
                  fontFamily: 'monospace',
                }}>بيانات الأم</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <MedicalField label="الاسم">
                  <input
                    type="text"
                    value={parentInfo.motherName}
                    onChange={(e) => updateParentInfo('motherName', e.target.value)}
                    style={tabletInputStyle}
                  />
                </MedicalField>
                <MedicalField label="الجوال" required>
                  <input
                    type="tel"
                    value={parentInfo.motherMobile}
                    onChange={(e) => updateParentInfo('motherMobile', e.target.value)}
                    style={{ ...tabletInputStyle, direction: 'ltr', textAlign: 'right' }}
                  />
                </MedicalField>
                <MedicalField label="البريد الإلكتروني">
                  <input
                    type="email"
                    value={parentInfo.motherEmail}
                    onChange={(e) => updateParentInfo('motherEmail', e.target.value)}
                    style={{ ...tabletInputStyle, direction: 'ltr', textAlign: 'right' }}
                  />
                </MedicalField>
                <MedicalField label="العمل">
                  <input
                    type="text"
                    value={parentInfo.motherWork}
                    onChange={(e) => updateParentInfo('motherWork', e.target.value)}
                    style={tabletInputStyle}
                  />
                </MedicalField>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            {/* Hearing Section */}
            <div style={{
              padding: 24,
              background: 'rgba(143,211,204,0.05)',
              borderRadius: 12,
              marginBottom: 24,
              border: '1px solid rgba(143,211,204,0.15)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
                color: brandCyan,
                fontFamily: 'monospace',
                fontWeight: 700,
              }}>
                <BrainIcon size={20} color={brandCyan} />
                <span>السمع والمعالجة السمعية</span>
              </div>

              <MedicalField label="هل تعاني من ضعف سمعي؟">
                <MedicalRadio
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
              </MedicalField>

              <MedicalField label="حساسية تجاه الأصوات؟">
                <MedicalRadio
                  name="soundSensitivity"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.soundSensitivity}
                  onChange={(v) => updateMedicalHistory('soundSensitivity', v)}
                />
              </MedicalField>

              <MedicalField label="صعوبة في تمييز الكلام؟">
                <MedicalRadio
                  name="speechDiscrimination"
                  options={[
                    { value: 'never', label: 'لا' },
                    { value: 'sometimes', label: 'أحياناً' },
                    { value: 'often', label: 'غالباً' },
                  ]}
                  value={medicalHistory.speechDiscrimination}
                  onChange={(v) => updateMedicalHistory('speechDiscrimination', v)}
                />
              </MedicalField>
            </div>

            {/* Behavior Section */}
            <div style={{
              padding: 24,
              background: 'rgba(175,132,186,0.05)',
              borderRadius: 12,
              marginBottom: 24,
              border: '1px solid rgba(175,132,186,0.15)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
                color: brandPurple,
                fontFamily: 'monospace',
                fontWeight: 700,
              }}>
                <ChartIcon size={20} color={brandPurple} />
                <span>السلوك والانتباه</span>
              </div>

              <MedicalField label="تشتت الانتباه؟">
                <MedicalRadio
                  name="attentionDifficulty"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.attentionDifficulty}
                  onChange={(v) => updateMedicalHistory('attentionDifficulty', v)}
                />
              </MedicalField>

              <MedicalField label="فرط الحركة؟">
                <MedicalRadio
                  name="hyperactivity"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.hyperactivity}
                  onChange={(v) => updateMedicalHistory('hyperactivity', v)}
                />
              </MedicalField>

              <MedicalField label="صعوبة اتباع التعليمات؟">
                <MedicalRadio
                  name="followingInstructions"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                    { value: 'sometimes', label: 'أحياناً' },
                  ]}
                  value={medicalHistory.followingInstructions}
                  onChange={(v) => updateMedicalHistory('followingInstructions', v)}
                />
              </MedicalField>
            </div>

            {/* Other Medical */}
            <div style={{
              padding: 24,
              background: 'rgba(0,20,30,0.3)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <MedicalField label="نوبات صرع / تشنجات؟">
                <MedicalRadio
                  name="seizures"
                  options={[
                    { value: 'yes', label: 'نعم' },
                    { value: 'no', label: 'لا' },
                  ]}
                  value={medicalHistory.seizures}
                  onChange={(v) => updateMedicalHistory('seizures', v)}
                />
              </MedicalField>

              <MedicalField label="اضطرابات النوم؟">
                <MedicalRadio
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
              </MedicalField>
            </div>
          </div>
        );

      case 4:
        if (!isReturningClient) return null;
        return (
          <div>
            {/* Sensory Changes */}
            <div style={{
              padding: 24,
              background: 'rgba(143,211,204,0.05)',
              borderRadius: 12,
              marginBottom: 24,
              border: '1px solid rgba(143,211,204,0.15)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
                color: brandCyan,
                fontFamily: 'monospace',
                fontWeight: 700,
              }}>
                <BrainIcon size={20} color={brandCyan} />
                <span>التغيرات الحسية</span>
              </div>

              <VitalSelector
                label="الحساسية السمعية"
                value={progressTracking.sensoryChanges.soundSensitivity}
                onChange={(v) => updateSensoryChanges('soundSensitivity', v)}
              />
              <VitalSelector
                label="التواصل البصري"
                value={progressTracking.sensoryChanges.eyeContact}
                onChange={(v) => updateSensoryChanges('eyeContact', v)}
              />
              <VitalSelector
                label="النوم"
                value={progressTracking.sensoryChanges.sleep}
                onChange={(v) => updateSensoryChanges('sleep', v)}
              />
              <VitalSelector
                label="المهارات اليدوية"
                value={progressTracking.sensoryChanges.handSkills}
                onChange={(v) => updateSensoryChanges('handSkills', v)}
              />
            </div>

            {/* Behavioral Changes */}
            <div style={{
              padding: 24,
              background: 'rgba(175,132,186,0.05)',
              borderRadius: 12,
              border: '1px solid rgba(175,132,186,0.15)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
                color: brandPurple,
                fontFamily: 'monospace',
                fontWeight: 700,
              }}>
                <ChartIcon size={20} color={brandPurple} />
                <span>التغيرات السلوكية</span>
              </div>

              <VitalSelector
                label="الانتباه والتركيز"
                value={progressTracking.behavioralChanges.attention}
                onChange={(v) => updateBehavioralChanges('attention', v)}
              />
              <VitalSelector
                label="فرط الحركة"
                value={progressTracking.behavioralChanges.hyperactivity}
                onChange={(v) => updateBehavioralChanges('hyperactivity', v)}
              />
              <VitalSelector
                label="اتباع الأوامر"
                value={progressTracking.behavioralChanges.followingCommands}
                onChange={(v) => updateBehavioralChanges('followingCommands', v)}
              />
              <VitalSelector
                label="التفاعل الاجتماعي"
                value={progressTracking.behavioralChanges.socialInteraction}
                onChange={(v) => updateBehavioralChanges('socialInteraction', v)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const maxStep = isReturningClient ? 4 : 3;
  const currentTime = new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('ar-AE', { day: 'numeric', month: 'short', year: 'numeric' });

  const css = useMemo(() => `
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes blink {
      0%, 50%, 100% { opacity: 1; }
      25%, 75% { opacity: 0.5; }
    }
    .tablet-screen::-webkit-scrollbar {
      width: 6px;
    }
    .tablet-screen::-webkit-scrollbar-track {
      background: rgba(0,20,30,0.5);
    }
    .tablet-screen::-webkit-scrollbar-thumb {
      background: ${brandCyan}40;
      border-radius: 3px;
    }
  `, []);

  return (
    <section id="intake-form" style={{ ...styles.sectionCard, padding: 0, overflow: 'hidden' }}>
      <style>{css}</style>

      {/* Medical Tablet Frame */}
      <div style={{
        background: 'linear-gradient(180deg, #1a1f2e 0%, #0a0f18 100%)',
        borderRadius: 20,
        border: '3px solid #2a3040',
        overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}>
        {/* Tablet Top Bezel - Status Bar */}
        <div style={{
          padding: '12px 20px',
          background: 'linear-gradient(90deg, #0a1520, #0f1a28)',
          borderBottom: '2px solid rgba(143,211,204,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(143,211,204,0.3)',
            }}>
              <BrainLogoSVG size={28} />
            </div>
            <div>
              <div style={{
                fontSize: 14,
                fontWeight: 800,
                color: brandCyan,
                fontFamily: 'monospace',
              }}>BERARD AIT</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                Patient Registration System
              </div>
            </div>
          </div>

          {/* Status indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              background: 'rgba(34,197,94,0.15)',
              borderRadius: 6,
              border: '1px solid rgba(34,197,94,0.3)',
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                animation: 'blink 2s infinite',
              }} />
              <span style={{ fontSize: 11, color: '#22c55e', fontFamily: 'monospace', fontWeight: 600 }}>
                ONLINE
              </span>
            </div>
            <div style={{ textAlign: 'left', fontFamily: 'monospace' }}>
              <div style={{ fontSize: 14, color: brandCyan, fontWeight: 700 }}>{currentTime}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{currentDate}</div>
            </div>
          </div>
        </div>

        {/* Step Navigation - Medical Monitor Style */}
        <div style={{
          padding: '16px 20px',
          background: 'rgba(0,20,30,0.5)',
          borderBottom: '1px solid rgba(143,211,204,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          overflowX: 'auto',
        }}>
          {STEPS.slice(0, maxStep).map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 20px',
                borderRadius: 8,
                border: `2px solid ${currentStep === step.id ? brandCyan : 'rgba(143,211,204,0.15)'}`,
                background: currentStep === step.id
                  ? `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`
                  : 'rgba(0,20,30,0.5)',
                color: currentStep === step.id ? brandCyan : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'monospace',
                fontSize: 13,
                fontWeight: currentStep === step.id ? 700 : 500,
                whiteSpace: 'nowrap',
              }}
            >
              {step.icon}
              <span>{step.title}</span>
              {currentStep > step.id && <CheckCircleIcon size={16} color="#22c55e" />}
            </button>
          ))}
        </div>

        {/* Progress Bar - Vital Signs Style */}
        <div style={{
          padding: '12px 20px',
          background: 'rgba(0,10,20,0.5)',
          borderBottom: '1px solid rgba(143,211,204,0.1)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
              PROGRESS
            </span>
            <span style={{ fontSize: 13, color: brandCyan, fontFamily: 'monospace', fontWeight: 700 }}>
              {progress}%
            </span>
          </div>
          <div style={{
            height: 6,
            background: 'rgba(0,20,30,0.8)',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
              borderRadius: 3,
              transition: 'width 0.5s ease',
              boxShadow: `0 0 10px ${brandCyan}50`,
            }} />
          </div>
        </div>

        {/* Main Screen Content */}
        <div
          className="tablet-screen"
          style={{
            padding: '24px 20px',
            minHeight: 450,
            maxHeight: '60vh',
            overflowY: 'auto',
            background: 'rgba(0,10,20,0.3)',
          }}
        >
          {renderStep()}
        </div>

        {/* Bottom Navigation - Control Panel */}
        <div style={{
          padding: '20px',
          background: 'linear-gradient(180deg, rgba(0,20,30,0.8), #0a1520)',
          borderTop: '2px solid rgba(143,211,204,0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 24px',
              borderRadius: 8,
              border: '2px solid rgba(143,211,204,0.2)',
              background: 'rgba(0,20,30,0.6)',
              color: currentStep === 1 ? 'rgba(255,255,255,0.3)' : brandCyan,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontFamily: 'monospace',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.3s ease',
            }}
          >
            <span>→</span> السابق
          </button>

          {currentStep < maxStep ? (
            <button
              onClick={handleNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 32px',
                borderRadius: 8,
                border: 'none',
                background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: 700,
                boxShadow: `0 0 20px ${brandCyan}30`,
                transition: 'all 0.3s ease',
              }}
            >
              التالي <span>←</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 32px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: 700,
                boxShadow: '0 0 20px rgba(34,197,94,0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              <span>📤</span> إرسال عبر واتساب
            </button>
          )}
        </div>

        {/* Tablet Bottom Bezel */}
        <div style={{
          padding: '10px 20px',
          background: '#0a1015',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 4,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 2,
            margin: '0 auto',
          }} />
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: 20,
        padding: 16,
        background: 'rgba(176,18,112,0.1)',
        borderRadius: 12,
        border: '1px solid rgba(176,18,112,0.2)',
        textAlign: 'center',
      }}>
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontFamily: 'monospace' }}>
          <strong style={{ color: brandPink }}>⚠ تنبيه:</strong> لا يعتبر برنامج Berard AIT علاجاً في حد ذاته،
          وإنما هو إعادة تدريب للدماغ عن طريق السمع لتحسين المعالجة الحسية.
        </p>
      </div>
    </section>
  );
};

export default IntakeForm;
