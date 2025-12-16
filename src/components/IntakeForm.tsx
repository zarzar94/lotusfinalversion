import React, { useState, useCallback, useMemo, memo } from 'react';
import { styles, brandCyan, brandPink, brandPurple } from './styles';
import { BrainIcon, UserIcon, HeartIcon, ChartIcon, CheckCircleIcon, ClipboardIcon } from './Icons';

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
  { id: 1, title: 'البيانات الشخصية', icon: <UserIcon size={16} color="#5a4a3a" /> },
  { id: 2, title: 'ولي الأمر', icon: <HeartIcon size={16} color="#5a4a3a" /> },
  { id: 3, title: 'التاريخ الطبي', icon: <ClipboardIcon size={16} color="#5a4a3a" /> },
  { id: 4, title: 'متابعة التقدم', icon: <ChartIcon size={16} color="#5a4a3a" /> },
];

// Notepad styled input
const notepadInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 4,
  border: '1px solid #c4b8a8',
  background: 'rgba(255,255,255,0.9)',
  color: '#3a3020',
  fontSize: 14,
  fontFamily: "'Cairo', serif",
  direction: 'rtl',
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
      color: '#5a4a3a',
    }}>
      {label}
      {required && <span style={{ color: '#b01270', marginRight: 4 }}>*</span>}
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
          border: `1px solid ${value === opt.value ? brandCyan : '#c4b8a8'}`,
          cursor: 'pointer',
          fontSize: 13,
          color: '#3a3020',
        }}
      >
        <div style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          border: `2px solid ${value === opt.value ? brandCyan : '#9a8a7a'}`,
          background: value === opt.value ? brandCyan : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {value === opt.value && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
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
}) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px dashed #d4c8b8',
  }}>
    <span style={{ fontSize: 13, color: '#5a4a3a' }}>{label}</span>
    <div style={{ display: 'flex', gap: 6 }}>
      {[
        { v: 'clear' as ImprovementLevel, l: 'واضح', c: '#22c55e' },
        { v: 'slight' as ImprovementLevel, l: 'بسيط', c: brandCyan },
        { v: 'none' as ImprovementLevel, l: 'لا', c: '#9a8a7a' },
      ].map((opt) => (
        <button
          key={opt.v}
          type="button"
          onClick={() => onChange(opt.v)}
          style={{
            padding: '4px 10px',
            borderRadius: 4,
            border: `1px solid ${value === opt.v ? opt.c : '#c4b8a8'}`,
            background: value === opt.v ? `${opt.c}15` : 'transparent',
            color: value === opt.v ? opt.c : '#7a6a5a',
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
));
ImprovementSelector.displayName = 'ImprovementSelector';

const IntakeForm: React.FC = () => {
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
    const formSummary = `
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
    `.trim();

    const phone = import.meta.env.VITE_CLINIC_PHONE || '+971000000000';
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(formSummary)}`, '_blank');
  }, [personalData, parentInfo, medicalHistory, isChild]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            {/* Patient Type */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              {[
                { val: true, label: 'طفل', desc: 'أقل من 18' },
                { val: false, label: 'بالغ', desc: '18+' },
              ].map((opt) => (
                <label key={opt.label} style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: 6,
                  background: isChild === opt.val ? 'rgba(143,211,204,0.15)' : '#faf8f5',
                  border: `2px solid ${isChild === opt.val ? brandCyan : '#d4c8b8'}`,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}>
                  <input type="radio" checked={isChild === opt.val} onChange={() => setIsChild(opt.val)} style={{ display: 'none' }} />
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#3a3020' }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: '#7a6a5a' }}>{opt.desc}</div>
                </label>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <NotepadField label="اسم المريض" required>
                <input type="text" value={personalData.name} onChange={(e) => updatePersonalData('name', e.target.value)}
                  style={notepadInputStyle} placeholder="الاسم الكامل" />
              </NotepadField>

              <NotepadField label="العمر" required>
                <input type="number" value={personalData.age} onChange={(e) => updatePersonalData('age', e.target.value)}
                  style={notepadInputStyle} placeholder="السنوات" />
              </NotepadField>

              <NotepadField label="الجنس" required>
                <NotepadRadio name="gender" options={[{ value: 'male', label: 'ذكر' }, { value: 'female', label: 'أنثى' }]}
                  value={personalData.gender} onChange={(v) => updatePersonalData('gender', v)} />
              </NotepadField>

              <NotepadField label="رقم الجوال" required>
                <input type="tel" value={personalData.mobile} onChange={(e) => updatePersonalData('mobile', e.target.value)}
                  style={{ ...notepadInputStyle, direction: 'ltr', textAlign: 'right' }} placeholder="+971 XX XXX XXXX" />
              </NotepadField>

              <NotepadField label="مكان الإقامة">
                <input type="text" value={personalData.residence} onChange={(e) => updatePersonalData('residence', e.target.value)}
                  style={notepadInputStyle} placeholder="المدينة / الدولة" />
              </NotepadField>

              <NotepadField label="المستوى التعليمي">
                <input type="text" value={personalData.educationLevel} onChange={(e) => updatePersonalData('educationLevel', e.target.value)}
                  style={notepadInputStyle} placeholder="الصف / المرحلة" />
              </NotepadField>
            </div>

            {/* Previous AIT */}
            <div style={{ marginTop: 24, padding: 16, background: '#faf5f0', borderRadius: 6, border: '1px solid #d4c8b8' }}>
              <NotepadField label="هل سبق أن خضعت لجلسات AIT؟">
                <NotepadRadio name="prevAIT" options={[{ value: 'yes', label: 'نعم' }, { value: 'no', label: 'لا' }]}
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
            <div style={{ padding: 20, background: '#f8faf9', borderRadius: 6, marginBottom: 20, border: '1px solid #c4d8d4' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#3a5a4a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                👨 بيانات الأب
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <NotepadField label="الاسم">
                  <input type="text" value={parentInfo.fatherName} onChange={(e) => updateParentInfo('fatherName', e.target.value)} style={notepadInputStyle} />
                </NotepadField>
                <NotepadField label="الجوال" required>
                  <input type="tel" value={parentInfo.fatherMobile} onChange={(e) => updateParentInfo('fatherMobile', e.target.value)}
                    style={{ ...notepadInputStyle, direction: 'ltr', textAlign: 'right' }} />
                </NotepadField>
                <NotepadField label="البريد الإلكتروني">
                  <input type="email" value={parentInfo.fatherEmail} onChange={(e) => updateParentInfo('fatherEmail', e.target.value)}
                    style={{ ...notepadInputStyle, direction: 'ltr', textAlign: 'right' }} />
                </NotepadField>
              </div>
            </div>

            {/* Mother */}
            <div style={{ padding: 20, background: '#faf5f8', borderRadius: 6, border: '1px solid #d8c4c8' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#5a3a4a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                👩 بيانات الأم
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <NotepadField label="الاسم">
                  <input type="text" value={parentInfo.motherName} onChange={(e) => updateParentInfo('motherName', e.target.value)} style={notepadInputStyle} />
                </NotepadField>
                <NotepadField label="الجوال" required>
                  <input type="tel" value={parentInfo.motherMobile} onChange={(e) => updateParentInfo('motherMobile', e.target.value)}
                    style={{ ...notepadInputStyle, direction: 'ltr', textAlign: 'right' }} />
                </NotepadField>
                <NotepadField label="البريد الإلكتروني">
                  <input type="email" value={parentInfo.motherEmail} onChange={(e) => updateParentInfo('motherEmail', e.target.value)}
                    style={{ ...notepadInputStyle, direction: 'ltr', textAlign: 'right' }} />
                </NotepadField>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            {/* Hearing */}
            <div style={{ padding: 20, background: '#f5fafa', borderRadius: 6, marginBottom: 20, border: '1px solid #b8d4d4' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#3a5a5a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BrainIcon size={18} color="#3a5a5a" /> السمع والمعالجة
              </div>

              <NotepadField label="ضعف سمعي؟">
                <NotepadRadio name="hearing" options={[
                  { value: 'none', label: 'لا' }, { value: 'mild', label: 'بسيط' },
                  { value: 'moderate', label: 'متوسط' }, { value: 'severe', label: 'شديد' },
                ]} value={medicalHistory.hearingImpairment} onChange={(v) => updateMedicalHistory('hearingImpairment', v)} />
              </NotepadField>

              <NotepadField label="حساسية للأصوات؟">
                <NotepadRadio name="soundSens" options={[{ value: 'yes', label: 'نعم' }, { value: 'no', label: 'لا' }]}
                  value={medicalHistory.soundSensitivity} onChange={(v) => updateMedicalHistory('soundSensitivity', v)} />
              </NotepadField>

              <NotepadField label="صعوبة تمييز الكلام؟">
                <NotepadRadio name="speech" options={[
                  { value: 'never', label: 'لا' }, { value: 'sometimes', label: 'أحياناً' }, { value: 'often', label: 'غالباً' },
                ]} value={medicalHistory.speechDiscrimination} onChange={(v) => updateMedicalHistory('speechDiscrimination', v)} />
              </NotepadField>
            </div>

            {/* Behavior */}
            <div style={{ padding: 20, background: '#faf5fa', borderRadius: 6, border: '1px solid #d4b8d4' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#5a3a5a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ChartIcon size={18} color="#5a3a5a" /> السلوك والانتباه
              </div>

              <NotepadField label="تشتت الانتباه؟">
                <NotepadRadio name="attention" options={[{ value: 'yes', label: 'نعم' }, { value: 'no', label: 'لا' }]}
                  value={medicalHistory.attentionDifficulty} onChange={(v) => updateMedicalHistory('attentionDifficulty', v)} />
              </NotepadField>

              <NotepadField label="فرط الحركة؟">
                <NotepadRadio name="hyper" options={[{ value: 'yes', label: 'نعم' }, { value: 'no', label: 'لا' }]}
                  value={medicalHistory.hyperactivity} onChange={(v) => updateMedicalHistory('hyperactivity', v)} />
              </NotepadField>

              <NotepadField label="صعوبة اتباع التعليمات؟">
                <NotepadRadio name="follow" options={[
                  { value: 'yes', label: 'نعم' }, { value: 'no', label: 'لا' }, { value: 'sometimes', label: 'أحياناً' },
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
            <div style={{ padding: 20, background: '#f5fafa', borderRadius: 6, marginBottom: 20, border: '1px solid #b8d4d4' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#3a5a5a', marginBottom: 16 }}>
                <BrainIcon size={18} color="#3a5a5a" /> التغيرات الحسية
              </div>
              <ImprovementSelector label="الحساسية السمعية" value={progressTracking.sensoryChanges.soundSensitivity}
                onChange={(v) => updateSensoryChanges('soundSensitivity', v)} />
              <ImprovementSelector label="التواصل البصري" value={progressTracking.sensoryChanges.eyeContact}
                onChange={(v) => updateSensoryChanges('eyeContact', v)} />
              <ImprovementSelector label="النوم" value={progressTracking.sensoryChanges.sleep}
                onChange={(v) => updateSensoryChanges('sleep', v)} />
              <ImprovementSelector label="المهارات اليدوية" value={progressTracking.sensoryChanges.handSkills}
                onChange={(v) => updateSensoryChanges('handSkills', v)} />
            </div>

            {/* Behavioral */}
            <div style={{ padding: 20, background: '#faf5fa', borderRadius: 6, border: '1px solid #d4b8d4' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#5a3a5a', marginBottom: 16 }}>
                <ChartIcon size={18} color="#5a3a5a" /> التغيرات السلوكية
              </div>
              <ImprovementSelector label="الانتباه والتركيز" value={progressTracking.behavioralChanges.attention}
                onChange={(v) => updateBehavioralChanges('attention', v)} />
              <ImprovementSelector label="فرط الحركة" value={progressTracking.behavioralChanges.hyperactivity}
                onChange={(v) => updateBehavioralChanges('hyperactivity', v)} />
              <ImprovementSelector label="اتباع الأوامر" value={progressTracking.behavioralChanges.followingCommands}
                onChange={(v) => updateBehavioralChanges('followingCommands', v)} />
              <ImprovementSelector label="التفاعل الاجتماعي" value={progressTracking.behavioralChanges.socialInteraction}
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
          #e8e0d8 28px
        ),
        linear-gradient(180deg, #fefcf9 0%, #f8f4ee 100%);
    }
    .notepad-paper::-webkit-scrollbar { width: 8px; }
    .notepad-paper::-webkit-scrollbar-track { background: #e8e0d8; border-radius: 4px; }
    .notepad-paper::-webkit-scrollbar-thumb { background: #c4b8a8; border-radius: 4px; }
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
          استمارة التسجيل
        </h2>
        <p style={{ margin: 0, opacity: 0.7, fontSize: 14 }}>
          سجل بياناتك للحجز والتقييم المبدئي
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
          background: 'linear-gradient(180deg, #b89c72 0%, #9a8060 50%, #8a7050 100%)',
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
            background: 'linear-gradient(180deg, #e0e0e0 0%, #a0a0a0 50%, #c0c0c0 100%)',
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
              background: 'linear-gradient(180deg, #c8c8c8 0%, #888 100%)',
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
              background: 'linear-gradient(90deg, #b0b0b0, #909090)',
              borderRadius: '0 0 6px 6px',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }} />
            <div style={{
              width: 30,
              height: 25,
              background: 'linear-gradient(90deg, #909090, #b0b0b0)',
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
              borderBottom: '1px solid #d4c8b8',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#faf8f5',
            }}>
              <div style={{ display: 'flex', gap: 30 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#c4b8a8', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#c4b8a8', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#c4b8a8', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }} />
              </div>
              <div style={{ fontSize: 12, color: '#8a7a6a', fontStyle: 'italic' }}>
                Berard AIT - Sound Lab
              </div>
            </div>

            {/* Step Tabs */}
            <div style={{
              display: 'flex',
              gap: 6,
              padding: '12px 16px',
              background: '#f5f0ea',
              borderBottom: '2px solid #d4c8b8',
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
                    background: currentStep === step.id ? '#fefcf9' : 'transparent',
                    boxShadow: currentStep === step.id ? '0 -2px 4px rgba(0,0,0,0.05)' : 'none',
                    color: currentStep === step.id ? '#3a3020' : '#8a7a6a',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: currentStep === step.id ? 700 : 500,
                    whiteSpace: 'nowrap',
                    borderBottom: currentStep === step.id ? '2px solid transparent' : 'none',
                    marginBottom: currentStep === step.id ? -2 : 0,
                  }}
                >
                  {step.icon}
                  {step.title}
                  {currentStep > step.id && <CheckCircleIcon size={14} color="#22c55e" />}
                </button>
              ))}
            </div>

            {/* Progress */}
            <div style={{ padding: '8px 20px', background: '#faf8f5', borderBottom: '1px solid #e8e0d8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8a7a6a', marginBottom: 4 }}>
                <span>التقدم</span>
                <span>{progress}%</span>
              </div>
              <div style={{ height: 4, background: '#e8e0d8', borderRadius: 2 }}>
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
              borderTop: '1px solid #d4c8b8',
              background: '#faf8f5',
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
                  border: '1px solid #c4b8a8',
                  background: currentStep === 1 ? '#e8e0d8' : '#fefcf9',
                  color: currentStep === 1 ? '#a09080' : '#5a4a3a',
                  cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                → السابق
              </button>

              {currentStep < maxStep ? (
                <button
                  onClick={handleNext}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 6,
                    border: 'none',
                    background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(143,211,204,0.3)',
                  }}
                >
                  التالي ←
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 6,
                    border: 'none',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                  }}
                >
                  📤 إرسال عبر واتساب
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
          <strong style={{ color: brandPink }}>⚠ تنبيه:</strong> لا يعتبر برنامج Berard AIT علاجاً في حد ذاته،
          وإنما هو إعادة تدريب للدماغ عن طريق السمع لتحسين المعالجة الحسية.
        </p>
      </div>
    </section>
  );
};

export default memo(IntakeForm);
