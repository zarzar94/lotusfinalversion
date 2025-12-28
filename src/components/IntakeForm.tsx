import React, { useState, useCallback, useMemo, memo } from 'react';
import { styles, brandCyan, brandPink, brandPurple, colors, intakePalette } from './styles';
import { BrainIcon, UserIcon, HeartIcon, ChartIcon, CheckCircleIcon, ClipboardIcon } from './Icons';
import { renderLabIcon } from './icons/index';
import { useLanguage } from '../context/LanguageContext';

/**
 * Berard AIT Registration/Intake Form
 * Designed as a Professional Notepad/Clipboard Interface
 */

interface PersonalData {
  name: string;
  age: string;
  gender: 'male' | 'female' | '';
  birthDate: string;
  residence: string;
  nationality: string;
  mobile: string;
  educationLevel: string;
}

interface ParentInfo {
  fatherName: string;
  fatherMobile: string;
  fatherEmail: string;
  motherName: string;
  motherMobile: string;
  motherEmail: string;
}

interface MedicalHistory {
  hearingImpairment: 'none' | 'mild' | 'moderate' | 'severe' | '';
  soundSensitivity: 'yes' | 'no' | '';
  speechDiscrimination: 'never' | 'sometimes' | 'often' | '';
  attentionDifficulty: 'yes' | 'no' | '';
  hyperactivity: 'yes' | 'no' | '';
  followingInstructions: 'yes' | 'no' | 'sometimes' | '';
  seizures: 'yes' | 'no' | '';
  sleepDisorders: 'never' | 'rarely' | 'sometimes' | 'often' | '';
}

type ImprovementLevel = 'clear' | 'slight' | 'none' | '';

interface ProgressTracking {
  sensoryChanges: {
    soundSensitivity: ImprovementLevel;
    eyeContact: ImprovementLevel;
    sleep: ImprovementLevel;
    handSkills: ImprovementLevel;
  };
  behavioralChanges: {
    attention: ImprovementLevel;
    hyperactivity: ImprovementLevel;
    followingCommands: ImprovementLevel;
    socialInteraction: ImprovementLevel;
  };
}

const STEPS = [
  { id: 1, titleAr: 'البيانات الشخصية', titleEn: 'Personal Details', icon: <UserIcon size={16} color={intakePalette.inkMuted} /> },
  { id: 2, titleAr: 'ولي الأمر', titleEn: 'Parent/Guardian', icon: <HeartIcon size={16} color={intakePalette.inkMuted} /> },
  { id: 3, titleAr: 'التاريخ الطبي', titleEn: 'Medical History', icon: <ClipboardIcon size={16} color={intakePalette.inkMuted} /> },
  { id: 4, titleAr: 'متابعة التقدم', titleEn: 'Progress Tracking', icon: <ChartIcon size={16} color={intakePalette.inkMuted} /> },
];

// Notepad styled input
const notepadInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 4,
  border: `1px solid ${intakePalette.border}`,
  background: 'rgba(255,255,255,0.9)',
  color: intakePalette.ink,
  fontSize: 14,
  fontFamily: "'Cairo', serif",
  outline: 'none',
};

// Field label for notepad
const NotepadField = memo(({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      display: 'block',
      marginBottom: 6,
      fontSize: 13,
      fontWeight: 700,
      color: intakePalette.inkMuted,
    }}>
      {label}
      {required && <span style={{ color: brandPink, marginRight: 4 }}>*</span>}
    </label>
    {children}
  </div>
));
NotepadField.displayName = 'NotepadField';

// Radio option for notepad
const NotepadRadio = memo(({ options, value, onChange, name }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}) => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    {options.map((opt) => (
      <label
        key={opt.value}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          borderRadius: 4,
          background: value === opt.value ? 'rgba(143,211,204,0.2)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${value === opt.value ? brandCyan : intakePalette.border}`,
          cursor: 'pointer',
          fontSize: 13,
          color: intakePalette.ink,
        }}
      >
        <div style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          border: `2px solid ${value === opt.value ? brandCyan : intakePalette.borderMuted}`,
          background: value === opt.value ? brandCyan : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {value === opt.value && <div style={{ width: 6, height: 6, borderRadius: '50%', background: intakePalette.white }} />}
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
));
NotepadRadio.displayName = 'NotepadRadio';

// Improvement selector
const ImprovementSelector = memo(({ value, onChange, label }: {
  value: ImprovementLevel;
  onChange: (value: ImprovementLevel) => void;
  label: string;
}) => {
  const { isArabic } = useLanguage();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: `1px dashed ${intakePalette.borderStrong}`,
    }}>
      <span style={{ fontSize: 13, color: intakePalette.inkMuted }}>{label}</span>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { v: 'clear' as ImprovementLevel, l: isArabic ? 'واضح' : 'Clear', c: colors.success },
          { v: 'slight' as ImprovementLevel, l: isArabic ? 'بسيط' : 'Slight', c: brandCyan },
          { v: 'none' as ImprovementLevel, l: isArabic ? 'لا' : 'No', c: intakePalette.borderMuted },
        ].map((opt) => (
          <button
            key={opt.v}
            type="button"
            onClick={() => onChange(opt.v)}
            style={{
              padding: '4px 10px',
              borderRadius: 4,
              border: `1px solid ${value === opt.v ? opt.c : intakePalette.border}`,
              background: value === opt.v ? `${opt.c}15` : 'transparent',
              color: value === opt.v ? opt.c : intakePalette.inkSoft,
              fontSize: 11,
              cursor: 'pointer',
              fontWeight: value === opt.v ? 700 : 400,
            }}
          >
            {opt.l}
          </button>
        ))}
      </div>
    </div>
  );
});
ImprovementSelector.displayName = 'ImprovementSelector';

const IntakeForm: React.FC = () => {
  const { isArabic, direction, t } = useLanguage();
  const fieldStyle = useMemo<React.CSSProperties>(() => ({
    ...notepadInputStyle,
    direction,
    textAlign: isArabic ? 'right' : 'left',
  }), [direction, isArabic]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isChild, setIsChild] = useState(true);
  const [isReturningClient, setIsReturningClient] = useState(false);
  const [hadPreviousAIT, setHadPreviousAIT] = useState('');

  const [personalData, setPersonalData] = useState<PersonalData>({
    name: '', age: '', gender: '', birthDate: '', residence: '', nationality: '', mobile: '', educationLevel: '',
  });

  const [parentInfo, setParentInfo] = useState<ParentInfo>({
    fatherName: '', fatherMobile: '', fatherEmail: '', motherName: '', motherMobile: '', motherEmail: '',
  });

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    hearingImpairment: '', soundSensitivity: '', speechDiscrimination: '', attentionDifficulty: '',
    hyperactivity: '', followingInstructions: '', seizures: '', sleepDisorders: '',
  });

  const [progressTracking, setProgressTracking] = useState<ProgressTracking>({
    sensoryChanges: { soundSensitivity: '', eyeContact: '', sleep: '', handSkills: '' },
    behavioralChanges: { attention: '', hyperactivity: '', followingCommands: '', socialInteraction: '' },
  });

  const updatePersonalData = useCallback((field: keyof PersonalData, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateParentInfo = useCallback((field: keyof ParentInfo, value: string) => {
    setParentInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateMedicalHistory = useCallback((field: keyof MedicalHistory, value: string) => {
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

  const maxStep = isReturningClient ? 4 : 3;
  const progress = useMemo(() => Math.round((currentStep / maxStep) * 100), [currentStep, maxStep]);

  const handleNext = useCallback(() => {
    if (currentStep < maxStep) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, maxStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(() => {
    const formSummary = (isArabic ? `
*استمارة تسجيل - Berard AIT*
━━━━━━━━━━━━━━━━━━━━

*البيانات الشخصية:*
الاسم: ${personalData.name}
العمر: ${personalData.age}
الجنس: ${personalData.gender === 'male' ? 'ذكر' : personalData.gender === 'female' ? 'أنثى' : ''}
الجوال: ${personalData.mobile}

${isChild ? `*بيانات ولي الأمر:*
جوال الأب: ${parentInfo.fatherMobile}
جوال الأم: ${parentInfo.motherMobile}` : ''}

*التاريخ الطبي:*
حساسية للأصوات: ${medicalHistory.soundSensitivity === 'yes' ? 'نعم' : 'لا'}
تشتت الانتباه: ${medicalHistory.attentionDifficulty === 'yes' ? 'نعم' : 'لا'}

━━━━━━━━━━━━━━━━━━━━
أرغب في حجز موعد للتقييم
    ` : `
*Berard AIT Intake Form*
━━━━━━━━━━━━━━━━━━━━

*Personal Details:*
Name: ${personalData.name}
Age: ${personalData.age}
Gender: ${personalData.gender === 'male' ? 'Male' : personalData.gender === 'female' ? 'Female' : ''}
Mobile: ${personalData.mobile}

${isChild ? `*Parent/Guardian:*
Father mobile: ${parentInfo.fatherMobile}
Mother mobile: ${parentInfo.motherMobile}` : ''}

*Medical History:*
Sound sensitivity: ${medicalHistory.soundSensitivity === 'yes' ? 'Yes' : 'No'}
Attention difficulty: ${medicalHistory.attentionDifficulty === 'yes' ? 'Yes' : 'No'}

━━━━━━━━━━━━━━━━━━━━
I would like to book an assessment appointment
    `).trim();

    const phone = import.meta.env.VITE_CLINIC_PHONE || '+971000000000';
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(formSummary)}`, '_blank');
  }, [personalData, parentInfo, medicalHistory, isChild, isArabic]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            {/* Patient Type */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              {[
                { val: true, label: isArabic ? 'طفل' : 'Child', desc: isArabic ? 'أقل من 18' : 'Under 18' },
                { val: false, label: isArabic ? 'بالغ' : 'Adult', desc: '18+' },
              ].map((opt) => (
                <label key={opt.label} style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: 6,
                  background: isChild === opt.val ? 'rgba(143,211,204,0.15)' : intakePalette.paper,
                  border: `2px solid ${isChild === opt.val ? brandCyan : intakePalette.borderStrong}`,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}>
                  <input type="radio" checked={isChild === opt.val} onChange={() => setIsChild(opt.val)} style={{ display: 'none' }} />
                  <div style={{ fontWeight: 700, fontSize: 16, color: intakePalette.ink }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: intakePalette.inkSoft }}>{opt.desc}</div>
                </label>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <NotepadField label={isArabic ? 'اسم المريض' : 'Patient Name'} required>
                <input type="text" value={personalData.name} onChange={(e) => updatePersonalData('name', e.target.value)}
                  style={fieldStyle} placeholder={isArabic ? 'الاسم الكامل' : 'Full name'} />
              </NotepadField>

              <NotepadField label={isArabic ? 'العمر' : 'Age'} required>
                <input type="number" value={personalData.age} onChange={(e) => updatePersonalData('age', e.target.value)}
                  style={fieldStyle} placeholder={isArabic ? 'السنوات' : 'Years'} />
              </NotepadField>

              <NotepadField label={isArabic ? 'الجنس' : 'Gender'} required>
                <NotepadRadio name="gender" options={[{ value: 'male', label: isArabic ? 'ذكر' : 'Male' }, { value: 'female', label: isArabic ? 'أنثى' : 'Female' }]}
                  value={personalData.gender} onChange={(v) => updatePersonalData('gender', v)} />
              </NotepadField>

              <NotepadField label={isArabic ? 'رقم الجوال' : 'Mobile Number'} required>
                <input type="tel" value={personalData.mobile} onChange={(e) => updatePersonalData('mobile', e.target.value)}
                  style={{ ...fieldStyle, direction: 'ltr', textAlign: isArabic ? 'right' : 'left' }} placeholder="+971 XX XXX XXXX" />
              </NotepadField>

              <NotepadField label={isArabic ? 'مكان الإقامة' : 'Location'}>
                <input type="text" value={personalData.residence} onChange={(e) => updatePersonalData('residence', e.target.value)}
                  style={fieldStyle} placeholder={isArabic ? 'المدينة / الدولة' : 'City / country'} />
              </NotepadField>

              <NotepadField label={isArabic ? 'المستوى التعليمي' : 'Education Level'}>
                <input type="text" value={personalData.educationLevel} onChange={(e) => updatePersonalData('educationLevel', e.target.value)}
                  style={fieldStyle} placeholder={isArabic ? 'الصف / المرحلة' : 'Grade / stage'} />
              </NotepadField>
            </div>

            {/* Previous AIT */}
            <div style={{ marginTop: 24, padding: 16, background: intakePalette.paperWarm, borderRadius: 6, border: `1px solid ${intakePalette.borderStrong}` }}>
              <NotepadField label={isArabic ? 'هل سبق أن خضعت لجلسات AIT؟' : 'Have you previously done AIT sessions?'}>
                <NotepadRadio name="prevAIT" options={[{ value: 'yes', label: isArabic ? 'نعم' : 'Yes' }, { value: 'no', label: isArabic ? 'لا' : 'No' }]}
                  value={hadPreviousAIT} onChange={(v) => { setHadPreviousAIT(v); setIsReturningClient(v === 'yes'); }} />
              </NotepadField>
            </div>
          </div>
        );

      case 2:
        if (!isChild) { setCurrentStep(3); return null; }
        return (
          <div>
            {/* Father */}
            <div style={{ padding: 20, background: intakePalette.paperMint, borderRadius: 6, marginBottom: 20, border: `1px solid ${intakePalette.sectionFatherBorder}` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: intakePalette.sectionFatherInk, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {renderLabIcon('\u{1F468}', { size: 16, tone: 'muted' })}
                  <span>{isArabic ? '?????? ????' : 'Father Details'}</span>
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <NotepadField label={isArabic ? 'الاسم' : 'Name'}>
                  <input type="text" value={parentInfo.fatherName} onChange={(e) => updateParentInfo('fatherName', e.target.value)} style={fieldStyle} />
                </NotepadField>
                <NotepadField label={isArabic ? 'الجوال' : 'Mobile'} required>
                  <input type="tel" value={parentInfo.fatherMobile} onChange={(e) => updateParentInfo('fatherMobile', e.target.value)}
                    style={{ ...fieldStyle, direction: 'ltr', textAlign: isArabic ? 'right' : 'left' }} />
                </NotepadField>
                <NotepadField label={isArabic ? 'البريد الإلكتروني' : 'Email'}>
                  <input type="email" value={parentInfo.fatherEmail} onChange={(e) => updateParentInfo('fatherEmail', e.target.value)}
                    style={{ ...fieldStyle, direction: 'ltr', textAlign: isArabic ? 'right' : 'left' }} />
                </NotepadField>
              </div>
            </div>

            {/* Mother */}
            <div style={{ padding: 20, background: intakePalette.paperRose, borderRadius: 6, border: `1px solid ${intakePalette.sectionMotherBorder}` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: intakePalette.sectionMotherInk, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {renderLabIcon('\u{1F469}', { size: 16, tone: 'muted' })}
                  <span>{isArabic ? '?????? ????' : 'Mother Details'}</span>
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <NotepadField label={isArabic ? 'الاسم' : 'Name'}>
                  <input type="text" value={parentInfo.motherName} onChange={(e) => updateParentInfo('motherName', e.target.value)} style={fieldStyle} />
                </NotepadField>
                <NotepadField label={isArabic ? 'الجوال' : 'Mobile'} required>
                  <input type="tel" value={parentInfo.motherMobile} onChange={(e) => updateParentInfo('motherMobile', e.target.value)}
                    style={{ ...fieldStyle, direction: 'ltr', textAlign: isArabic ? 'right' : 'left' }} />
                </NotepadField>
                <NotepadField label={isArabic ? 'البريد الإلكتروني' : 'Email'}>
                  <input type="email" value={parentInfo.motherEmail} onChange={(e) => updateParentInfo('motherEmail', e.target.value)}
                    style={{ ...fieldStyle, direction: 'ltr', textAlign: isArabic ? 'right' : 'left' }} />
                </NotepadField>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            {/* Hearing */}
            <div style={{ padding: 20, background: intakePalette.paperCool, borderRadius: 6, marginBottom: 20, border: `1px solid ${intakePalette.sectionHearingBorder}` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: intakePalette.sectionHearingInk, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BrainIcon size={18} color={intakePalette.sectionHearingInk} /> {isArabic ? 'السمع والمعالجة' : 'Hearing & Processing'}
              </div>

              <NotepadField label={isArabic ? 'ضعف سمعي؟' : 'Hearing impairment?'}>
                <NotepadRadio name="hearing" options={[
                  { value: 'none', label: isArabic ? 'لا' : 'No' }, { value: 'mild', label: isArabic ? 'بسيط' : 'Mild' },
                  { value: 'moderate', label: isArabic ? 'متوسط' : 'Moderate' }, { value: 'severe', label: isArabic ? 'شديد' : 'Severe' },
                ]} value={medicalHistory.hearingImpairment} onChange={(v) => updateMedicalHistory('hearingImpairment', v)} />
              </NotepadField>

              <NotepadField label={isArabic ? 'حساسية للأصوات؟' : 'Sound sensitivity?'}>
                <NotepadRadio name="soundSens" options={[{ value: 'yes', label: isArabic ? 'نعم' : 'Yes' }, { value: 'no', label: isArabic ? 'لا' : 'No' }]}
                  value={medicalHistory.soundSensitivity} onChange={(v) => updateMedicalHistory('soundSensitivity', v)} />
              </NotepadField>

              <NotepadField label={isArabic ? 'صعوبة تمييز الكلام؟' : 'Difficulty understanding speech?'}>
                <NotepadRadio name="speech" options={[
                  { value: 'never', label: isArabic ? 'لا' : 'Never' }, { value: 'sometimes', label: isArabic ? 'أحياناً' : 'Sometimes' }, { value: 'often', label: isArabic ? 'غالباً' : 'Often' },
                ]} value={medicalHistory.speechDiscrimination} onChange={(v) => updateMedicalHistory('speechDiscrimination', v)} />
              </NotepadField>
            </div>

            {/* Behavior */}
            <div style={{ padding: 20, background: intakePalette.paperLavender, borderRadius: 6, border: `1px solid ${intakePalette.sectionBehaviorBorder}` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: intakePalette.sectionBehaviorInk, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ChartIcon size={18} color={intakePalette.sectionBehaviorInk} /> {isArabic ? 'السلوك والانتباه' : 'Behavior & Attention'}
              </div>

              <NotepadField label={isArabic ? 'تشتت الانتباه؟' : 'Attention difficulty?'}>
                <NotepadRadio name="attention" options={[{ value: 'yes', label: isArabic ? 'نعم' : 'Yes' }, { value: 'no', label: isArabic ? 'لا' : 'No' }]}
                  value={medicalHistory.attentionDifficulty} onChange={(v) => updateMedicalHistory('attentionDifficulty', v)} />
              </NotepadField>

              <NotepadField label={isArabic ? 'فرط الحركة؟' : 'Hyperactivity?'}>
                <NotepadRadio name="hyper" options={[{ value: 'yes', label: isArabic ? 'نعم' : 'Yes' }, { value: 'no', label: isArabic ? 'لا' : 'No' }]}
                  value={medicalHistory.hyperactivity} onChange={(v) => updateMedicalHistory('hyperactivity', v)} />
              </NotepadField>

              <NotepadField label={isArabic ? 'صعوبة اتباع التعليمات؟' : 'Difficulty following instructions?'}>
                <NotepadRadio name="follow" options={[
                  { value: 'yes', label: isArabic ? 'نعم' : 'Yes' }, { value: 'no', label: isArabic ? 'لا' : 'No' }, { value: 'sometimes', label: isArabic ? 'أحياناً' : 'Sometimes' },
                ]} value={medicalHistory.followingInstructions} onChange={(v) => updateMedicalHistory('followingInstructions', v)} />
              </NotepadField>
            </div>
          </div>
        );

      case 4:
        if (!isReturningClient) return null;
        return (
          <div>
            {/* Sensory */}
            <div style={{ padding: 20, background: intakePalette.paperCool, borderRadius: 6, marginBottom: 20, border: `1px solid ${intakePalette.sectionHearingBorder}` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: intakePalette.sectionHearingInk, marginBottom: 16 }}>
                <BrainIcon size={18} color={intakePalette.sectionHearingInk} /> {isArabic ? 'التغيرات الحسية' : 'Sensory Changes'}
              </div>
              <ImprovementSelector label={isArabic ? 'الحساسية السمعية' : 'Sound sensitivity'} value={progressTracking.sensoryChanges.soundSensitivity}
                onChange={(v) => updateSensoryChanges('soundSensitivity', v)} />
              <ImprovementSelector label={isArabic ? 'التواصل البصري' : 'Eye contact'} value={progressTracking.sensoryChanges.eyeContact}
                onChange={(v) => updateSensoryChanges('eyeContact', v)} />
              <ImprovementSelector label={isArabic ? 'النوم' : 'Sleep'} value={progressTracking.sensoryChanges.sleep}
                onChange={(v) => updateSensoryChanges('sleep', v)} />
              <ImprovementSelector label={isArabic ? 'المهارات اليدوية' : 'Hand skills'} value={progressTracking.sensoryChanges.handSkills}
                onChange={(v) => updateSensoryChanges('handSkills', v)} />
            </div>

            {/* Behavioral */}
            <div style={{ padding: 20, background: intakePalette.paperLavender, borderRadius: 6, border: `1px solid ${intakePalette.sectionBehaviorBorder}` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: intakePalette.sectionBehaviorInk, marginBottom: 16 }}>
                <ChartIcon size={18} color={intakePalette.sectionBehaviorInk} /> {isArabic ? 'التغيرات السلوكية' : 'Behavioral Changes'}
              </div>
              <ImprovementSelector label={isArabic ? 'الانتباه والتركيز' : 'Attention & focus'} value={progressTracking.behavioralChanges.attention}
                onChange={(v) => updateBehavioralChanges('attention', v)} />
              <ImprovementSelector label={isArabic ? 'فرط الحركة' : 'Hyperactivity'} value={progressTracking.behavioralChanges.hyperactivity}
                onChange={(v) => updateBehavioralChanges('hyperactivity', v)} />
              <ImprovementSelector label={isArabic ? 'اتباع الأوامر' : 'Following instructions'} value={progressTracking.behavioralChanges.followingCommands}
                onChange={(v) => updateBehavioralChanges('followingCommands', v)} />
              <ImprovementSelector label={isArabic ? 'التفاعل الاجتماعي' : 'Social interaction'} value={progressTracking.behavioralChanges.socialInteraction}
                onChange={(v) => updateBehavioralChanges('socialInteraction', v)} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const clipboardCSS = useMemo(() => `
    .notepad-paper {
      background:
        repeating-linear-gradient(
          transparent 0px,
          transparent 27px,
          ${intakePalette.line} 28px
        ),
        linear-gradient(180deg, ${intakePalette.paperTop} 0%, ${intakePalette.paperBottom} 100%);
    }
    .notepad-paper::-webkit-scrollbar { width: 8px; }
    .notepad-paper::-webkit-scrollbar-track { background: ${intakePalette.line}; border-radius: 4px; }
    .notepad-paper::-webkit-scrollbar-thumb { background: ${intakePalette.border}; border-radius: 4px; }
  `, []);

  return (
    <section id="intake-form" style={styles.sectionCard}>
      <style>{clipboardCSS}</style>

      {/* Section Title */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{
          margin: '0 0 8px',
          fontSize: 24,
          background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {isArabic ? 'استمارة التسجيل' : 'Registration Form'}
        </h2>
        <p style={{ margin: 0, opacity: 0.7, fontSize: 14 }}>
          {isArabic ? 'سجل بياناتك للحجز والتقييم المبدئي' : 'Enter your details for booking and initial assessment'}
        </p>
      </div>

      {/* CLIPBOARD FRAME */}
      <div style={{
        maxWidth: 700,
        margin: '0 auto',
        position: 'relative',
      }}>
        {/* Clipboard Board */}
        <div style={{
          background: `linear-gradient(180deg, ${intakePalette.clipboardStart} 0%, ${intakePalette.clipboardMid} 50%, ${intakePalette.clipboardEnd} 100%)`,
          borderRadius: '20px 20px 12px 12px',
          padding: '60px 16px 16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.1), inset 0 -2px 0 rgba(0,0,0,0.2)',
          position: 'relative',
        }}>
          {/* Metal Clip */}
          <div style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 60,
            background: `linear-gradient(180deg, ${intakePalette.clipMetalStart} 0%, ${intakePalette.clipMetalMid} 50%, ${intakePalette.clipMetalEnd} 100%)`,
            borderRadius: '8px 8px 0 0',
            boxShadow: '0 -5px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 8,
          }}>
            {/* Clip inner */}
            <div style={{
              width: 80,
              height: 30,
              background: `linear-gradient(180deg, ${intakePalette.clipInnerStart} 0%, ${intakePalette.clipInnerEnd} 100%)`,
              borderRadius: '4px 4px 0 0',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
            }} />
          </div>

          {/* Clip arms */}
          <div style={{
            position: 'absolute',
            top: 35,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 140,
            height: 25,
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <div style={{
              width: 30,
              height: 25,
              background: `linear-gradient(90deg, ${intakePalette.clipArmStart}, ${intakePalette.clipArmEnd})`,
              borderRadius: '0 0 6px 6px',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }} />
            <div style={{
              width: 30,
              height: 25,
              background: `linear-gradient(90deg, ${intakePalette.clipArmEnd}, ${intakePalette.clipArmStart})`,
              borderRadius: '0 0 6px 6px',
              boxShadow: '-2px 2px 4px rgba(0,0,0,0.2)',
            }} />
          </div>

          {/* PAPER */}
          <div
            className="notepad-paper"
            style={{
              borderRadius: 6,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 30px rgba(0,0,0,0.03)',
              overflow: 'hidden',
            }}
          >
            {/* Paper Header - Hole punches */}
            <div style={{
              padding: '12px 20px',
              borderBottom: `1px solid ${intakePalette.borderStrong}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: intakePalette.paper,
            }}>
              <div style={{ display: 'flex', gap: 30 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: intakePalette.border, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: intakePalette.border, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: intakePalette.border, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }} />
              </div>
              <div style={{ fontSize: 12, color: intakePalette.inkFaint, fontStyle: 'italic' }}>
                {t('auto.IntakeForm.k1', "Berard AIT - Sound Lab")}
              </div>
            </div>

            {/* Step Tabs */}
            <div style={{
              display: 'flex',
              gap: 6,
              padding: '12px 16px',
              background: intakePalette.paperTan,
              borderBottom: `2px solid ${intakePalette.borderStrong}`,
              overflowX: 'auto',
            }}>
              {STEPS.slice(0, maxStep).map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: '6px 6px 0 0',
                    border: 'none',
                    background: currentStep === step.id ? intakePalette.paperTop : 'transparent',
                    boxShadow: currentStep === step.id ? '0 -2px 4px rgba(0,0,0,0.05)' : 'none',
                    color: currentStep === step.id ? intakePalette.ink : intakePalette.inkFaint,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: currentStep === step.id ? 700 : 500,
                    whiteSpace: 'nowrap',
                    borderBottom: currentStep === step.id ? '2px solid transparent' : 'none',
                    marginBottom: currentStep === step.id ? -2 : 0,
                  }}
                >
                  {step.icon}
                  {isArabic ? step.titleAr : step.titleEn}
                  {currentStep > step.id && <CheckCircleIcon size={14} color={colors.success} />}
                </button>
              ))}
            </div>

            {/* Progress */}
            <div style={{ padding: '8px 20px', background: intakePalette.paper, borderBottom: `1px solid ${intakePalette.line}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: intakePalette.inkFaint, marginBottom: 4 }}>
                <span>{isArabic ? 'التقدم' : 'Progress'}</span>
                <span>{progress}%</span>
              </div>
              <div style={{ height: 4, background: intakePalette.line, borderRadius: 2 }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
                  borderRadius: 2,
                  transition: 'width 0.3s',
                }} />
              </div>
            </div>

            {/* Paper Content */}
            <div style={{
              padding: '20px',
              minHeight: 400,
              maxHeight: '50vh',
              overflowY: 'auto',
            }}>
              {renderStep()}
            </div>

            {/* Paper Footer - Navigation */}
            <div style={{
              padding: '16px 20px',
              borderTop: `1px solid ${intakePalette.borderStrong}`,
              background: intakePalette.paper,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                style={{
                  padding: '10px 20px',
                  borderRadius: 6,
                  border: `1px solid ${intakePalette.border}`,
                  background: currentStep === 1 ? intakePalette.line : intakePalette.paperTop,
                  color: currentStep === 1 ? intakePalette.inkDisabled : intakePalette.inkMuted,
                  cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {isArabic ? '→ السابق' : '← Previous'}
              </button>

              {currentStep < maxStep ? (
                <button
                  onClick={handleNext}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 6,
                    border: 'none',
                    background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                    color: intakePalette.white,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(143,211,204,0.3)',
                  }}
                >
                  {isArabic ? 'التالي ←' : 'Next →'}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 6,
                    border: 'none',
                    background: `linear-gradient(135deg, ${colors.success}, ${intakePalette.successDeep})`,
                    color: intakePalette.white,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {renderLabIcon('\u{1F4DE}', { size: 16, tone: 'success' })}
                    <span>{isArabic ? '????? ??? ??????' : 'Send via WhatsApp'}</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
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
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
          {isArabic ? (
            <>
              <strong style={{ color: brandPink, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {renderLabIcon('\u{26A0}\u{FE0F}', { size: 12, tone: 'warning' })}
                تنبيه:
              </strong>{' '}
              لا يعتبر برنامج Berard AIT علاجاً في حد ذاته، وإنما هو إعادة تدريب للدماغ عن طريق السمع لتحسين المعالجة
              الحسية.
            </>
          ) : (
            <>
              <strong style={{ color: brandPink, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {renderLabIcon('\u{26A0}\u{FE0F}', { size: 12, tone: 'warning' })}
                Note:
              </strong>{' '}
              Berard AIT is not a treatment in itself; it is a brain retraining approach through listening to improve
              sensory processing.
            </>
          )}
        </p>
      </div>
    </section>
  );
};

export default memo(IntakeForm);
