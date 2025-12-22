/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Booking System
 * Virtual consultation and treatment session booking interface
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  brand,
  gradients,
  shadows,
  spacing,
  radius,
  typography,
  transitions,
  cards,
  buttons,
  forms,
} from '../styles';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface BookingSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  type: 'consultation' | 'assessment' | 'follow_up';
}

interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  type: 'consultation' | 'assessment' | 'follow_up';
  selectedSlot: string | null;
  notes: string;
  preferredContact: 'whatsapp' | 'phone' | 'email';
}

interface BookingSystemProps {
  onBookingComplete?: (booking: BookingFormData) => void;
  onClose?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const generateMockSlots = (): BookingSlot[] => {
  const slots: BookingSlot[] = [];
  const types: BookingSlot['type'][] = ['consultation', 'assessment', 'follow_up'];
  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  for (let day = 1; day <= 14; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    if (date.getDay() === 5 || date.getDay() === 6) continue; // Skip weekends

    times.forEach((time, idx) => {
      slots.push({
        id: `${date.toISOString().split('T')[0]}-${time}`,
        date: date.toISOString().split('T')[0],
        time,
        available: Math.random() > 0.3,
        type: types[idx % 3],
      });
    });
  }
  return slots;
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    background: gradients.panel,
    borderRadius: radius.xl,
    border: `1px solid ${brand.cyan}30`,
    padding: spacing[6],
    maxWidth: '800px',
    margin: '0 auto',
  } as React.CSSProperties,

  header: {
    textAlign: 'center' as const,
    marginBottom: spacing[6],
  } as React.CSSProperties,

  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: spacing[2],
  } as React.CSSProperties,

  subtitle: {
    color: brand.cyan,
    fontSize: typography.size.sm,
    opacity: 0.8,
  } as React.CSSProperties,

  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing[4],
    marginBottom: spacing[6],
  } as React.CSSProperties,

  step: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]} ${spacing[4]}`,
    borderRadius: radius.full,
    fontSize: typography.size.sm,
    transition: transitions.normal,
  } as React.CSSProperties,

  stepActive: {
    background: `${brand.cyan}20`,
    color: brand.cyan,
    border: `1px solid ${brand.cyan}40`,
  } as React.CSSProperties,

  stepComplete: {
    background: `${brand.purple}20`,
    color: brand.purple,
    border: `1px solid ${brand.purple}40`,
  } as React.CSSProperties,

  stepPending: {
    background: 'transparent',
    color: '#666',
    border: '1px solid #333',
  } as React.CSSProperties,

  stepNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  } as React.CSSProperties,

  typeSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing[4],
    marginBottom: spacing[6],
  } as React.CSSProperties,

  typeCard: {
    ...cards.glass,
    padding: spacing[4],
    cursor: 'pointer',
    transition: transitions.normal,
    textAlign: 'center' as const,
  } as React.CSSProperties,

  typeCardActive: {
    border: `2px solid ${brand.cyan}`,
    boxShadow: shadows.glow.cyan,
  } as React.CSSProperties,

  typeIcon: {
    fontSize: '2rem',
    marginBottom: spacing[2],
  } as React.CSSProperties,

  typeLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[1],
  } as React.CSSProperties,

  typeDescription: {
    fontSize: typography.size.xs,
    color: '#888',
  } as React.CSSProperties,

  calendarContainer: {
    marginBottom: spacing[6],
  } as React.CSSProperties,

  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  } as React.CSSProperties,

  calendarMonth: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#fff',
  } as React.CSSProperties,

  calendarNav: {
    display: 'flex',
    gap: spacing[2],
  } as React.CSSProperties,

  navButton: {
    ...buttons.ghost,
    padding: spacing[2],
    borderRadius: radius.md,
  } as React.CSSProperties,

  dateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: spacing[2],
    marginBottom: spacing[4],
  } as React.CSSProperties,

  dayHeader: {
    textAlign: 'center' as const,
    fontSize: typography.size.xs,
    color: '#666',
    padding: spacing[2],
  } as React.CSSProperties,

  dateCell: {
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    cursor: 'pointer',
    transition: transitions.fast,
    fontSize: typography.size.sm,
  } as React.CSSProperties,

  dateCellAvailable: {
    background: `${brand.cyan}10`,
    color: brand.cyan,
    border: `1px solid ${brand.cyan}30`,
  } as React.CSSProperties,

  dateCellSelected: {
    background: brand.cyan,
    color: brand.ink,
    fontWeight: typography.weight.bold,
  } as React.CSSProperties,

  dateCellUnavailable: {
    background: 'transparent',
    color: '#444',
    cursor: 'not-allowed',
  } as React.CSSProperties,

  timeSlots: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: spacing[2],
    marginBottom: spacing[6],
  } as React.CSSProperties,

  timeSlot: {
    padding: spacing[3],
    borderRadius: radius.md,
    textAlign: 'center' as const,
    fontSize: typography.size.sm,
    cursor: 'pointer',
    transition: transitions.fast,
  } as React.CSSProperties,

  timeSlotAvailable: {
    background: `${brand.purple}10`,
    color: brand.purple,
    border: `1px solid ${brand.purple}30`,
  } as React.CSSProperties,

  timeSlotSelected: {
    background: brand.purple,
    color: '#fff',
    border: `1px solid ${brand.purple}`,
  } as React.CSSProperties,

  timeSlotUnavailable: {
    background: '#1a1a1a',
    color: '#444',
    cursor: 'not-allowed',
    textDecoration: 'line-through',
  } as React.CSSProperties,

  formSection: {
    marginBottom: spacing[6],
  } as React.CSSProperties,

  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing[4],
  } as React.CSSProperties,

  formField: {
    marginBottom: spacing[4],
  } as React.CSSProperties,

  label: {
    display: 'block',
    fontSize: typography.size.sm,
    color: '#888',
    marginBottom: spacing[1],
  } as React.CSSProperties,

  input: {
    ...forms.input,
    width: '100%',
  } as React.CSSProperties,

  textarea: {
    ...forms.textarea,
    width: '100%',
    minHeight: '100px',
  } as React.CSSProperties,

  radioGroup: {
    display: 'flex',
    gap: spacing[4],
    marginTop: spacing[2],
  } as React.CSSProperties,

  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    cursor: 'pointer',
    fontSize: typography.size.sm,
    color: '#ccc',
  } as React.CSSProperties,

  summary: {
    ...cards.glass,
    padding: spacing[4],
    marginBottom: spacing[6],
  } as React.CSSProperties,

  summaryTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[3],
  } as React.CSSProperties,

  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${spacing[2]} 0`,
    borderBottom: '1px solid #333',
    fontSize: typography.size.sm,
  } as React.CSSProperties,

  summaryLabel: {
    color: '#888',
  } as React.CSSProperties,

  summaryValue: {
    color: brand.cyan,
    fontWeight: typography.weight.bold,
  } as React.CSSProperties,

  actions: {
    display: 'flex',
    gap: spacing[4],
    justifyContent: 'flex-end',
  } as React.CSSProperties,

  backButton: {
    ...buttons.ghost,
    padding: `${spacing[3]} ${spacing[6]}`,
  } as React.CSSProperties,

  nextButton: {
    ...buttons.primary,
    padding: `${spacing[3]} ${spacing[6]}`,
  } as React.CSSProperties,

  submitButton: {
    ...buttons.primary,
    padding: `${spacing[3]} ${spacing[8]}`,
    background: gradients.cyanPurple,
  } as React.CSSProperties,

  successMessage: {
    textAlign: 'center' as const,
    padding: spacing[8],
  } as React.CSSProperties,

  successIcon: {
    fontSize: '4rem',
    marginBottom: spacing[4],
  } as React.CSSProperties,

  successTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: brand.cyan,
    marginBottom: spacing[2],
  } as React.CSSProperties,

  successText: {
    color: '#888',
    marginBottom: spacing[4],
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const BookingSystem: React.FC<BookingSystemProps> = ({
  onBookingComplete,
  onClose,
}) => {
  const { t, isArabic } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    email: '',
    type: 'consultation',
    selectedSlot: null,
    notes: '',
    preferredContact: 'whatsapp',
  });

  const slots = useMemo(() => generateMockSlots(), []);

  const bookingTypes = [
    {
      id: 'consultation' as const,
      icon: '📞',
      label: isArabic ? 'استشارة أولية' : 'Initial Consultation',
      labelAr: 'استشارة أولية',
      description: isArabic ? '30 دقيقة مجانية' : '30 min free consultation',
      descriptionAr: '30 دقيقة مجانية',
    },
    {
      id: 'assessment' as const,
      icon: '🎧',
      label: isArabic ? 'تقييم سمعي' : 'Hearing Assessment',
      labelAr: 'تقييم سمعي',
      description: isArabic ? 'تقييم شامل 60 دقيقة' : '60 min full assessment',
      descriptionAr: 'تقييم شامل 60 دقيقة',
    },
    {
      id: 'follow_up' as const,
      icon: '📊',
      label: isArabic ? 'متابعة' : 'Follow-up Session',
      labelAr: 'متابعة',
      description: isArabic ? 'جلسة متابعة 30 دقيقة' : '30 min follow-up',
      descriptionAr: 'جلسة متابعة 30 دقيقة',
    },
  ];

  const stepLabels = [
    isArabic ? 'نوع الحجز' : 'Booking Type',
    isArabic ? 'التاريخ والوقت' : 'Date & Time',
    isArabic ? 'معلوماتك' : 'Your Info',
    isArabic ? 'تأكيد' : 'Confirm',
  ];

  const availableDates = useMemo(() => {
    const dates = new Set(
      slots.filter(s => s.available && s.type === formData.type).map(s => s.date)
    );
    return dates;
  }, [slots, formData.type]);

  const availableTimesForDate = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter(
      s => s.date === selectedDate && s.available && s.type === formData.type
    );
  }, [slots, selectedDate, formData.type]);

  const handleTypeSelect = useCallback((type: BookingFormData['type']) => {
    setFormData(prev => ({ ...prev, type, selectedSlot: null }));
    setSelectedDate(null);
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, selectedSlot: null }));
  }, []);

  const handleTimeSelect = useCallback((slotId: string) => {
    setFormData(prev => ({ ...prev, selectedSlot: slotId }));
  }, []);

  const handleInputChange = useCallback((field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    setIsSubmitted(true);
    onBookingComplete?.(formData);
  }, [formData, onBookingComplete]);

  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return !!formData.type;
      case 2:
        return !!formData.selectedSlot;
      case 3:
        return formData.name.length >= 2 && formData.phone.length >= 10;
      default:
        return true;
    }
  }, [step, formData]);

  const selectedSlotInfo = useMemo(() => {
    if (!formData.selectedSlot) return null;
    return slots.find(s => s.id === formData.selectedSlot);
  }, [slots, formData.selectedSlot]);

  if (isSubmitted) {
    return (
      <div style={styles.container}>
        <div style={styles.successMessage}>
          <div style={styles.successIcon}>✅</div>
          <div style={styles.successTitle}>
            {isArabic ? 'تم تأكيد الحجز!' : 'Booking Confirmed!'}
          </div>
          <p style={styles.successText}>
            {isArabic
              ? 'سنتواصل معك قريباً لتأكيد موعدك'
              : 'We will contact you shortly to confirm your appointment'}
          </p>
          <button style={styles.nextButton} onClick={onClose}>
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {isArabic ? '📅 حجز موعد' : '📅 Book Appointment'}
        </h2>
        <p style={styles.subtitle}>
          {isArabic
            ? 'احجز استشارتك أو جلسة التقييم'
            : 'Schedule your consultation or assessment session'}
        </p>
      </div>

      {/* Step Indicator */}
      <div style={styles.stepIndicator}>
        {stepLabels.map((label, idx) => (
          <div
            key={idx}
            style={{
              ...styles.step,
              ...(idx + 1 === step
                ? styles.stepActive
                : idx + 1 < step
                ? styles.stepComplete
                : styles.stepPending),
            }}
          >
            <span style={styles.stepNumber}>
              {idx + 1 < step ? '✓' : idx + 1}
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Select Type */}
      {step === 1 && (
        <div style={styles.typeSelector}>
          {bookingTypes.map(type => (
            <div
              key={type.id}
              style={{
                ...styles.typeCard,
                ...(formData.type === type.id ? styles.typeCardActive : {}),
              }}
              onClick={() => handleTypeSelect(type.id)}
            >
              <div style={styles.typeIcon}>{type.icon}</div>
              <div style={styles.typeLabel}>{type.label}</div>
              <div style={styles.typeDescription}>{type.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Select Date & Time */}
      {step === 2 && (
        <div style={styles.calendarContainer}>
          <div style={styles.calendarHeader}>
            <span style={styles.calendarMonth}>
              {new Date().toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <div style={styles.dateGrid}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={styles.dayHeader}>
                {isArabic
                  ? ['أحد', 'اثن', 'ثلث', 'أربع', 'خمس', 'جمع', 'سبت'][
                      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day)
                    ]
                  : day}
              </div>
            ))}

            {Array.from({ length: 14 }).map((_, idx) => {
              const date = new Date();
              date.setDate(date.getDate() + idx);
              const dateStr = date.toISOString().split('T')[0];
              const isAvailable = availableDates.has(dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={idx}
                  style={{
                    ...styles.dateCell,
                    ...(isSelected
                      ? styles.dateCellSelected
                      : isAvailable
                      ? styles.dateCellAvailable
                      : styles.dateCellUnavailable),
                  }}
                  onClick={() => isAvailable && handleDateSelect(dateStr)}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <>
              <h4 style={{ color: '#fff', marginBottom: spacing[3] }}>
                {isArabic ? 'اختر الوقت:' : 'Select Time:'}
              </h4>
              <div style={styles.timeSlots}>
                {availableTimesForDate.map(slot => (
                  <div
                    key={slot.id}
                    style={{
                      ...styles.timeSlot,
                      ...(formData.selectedSlot === slot.id
                        ? styles.timeSlotSelected
                        : slot.available
                        ? styles.timeSlotAvailable
                        : styles.timeSlotUnavailable),
                    }}
                    onClick={() => slot.available && handleTimeSelect(slot.id)}
                  >
                    {slot.time}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Contact Info */}
      {step === 3 && (
        <div style={styles.formSection}>
          <div style={styles.formGrid}>
            <div style={styles.formField}>
              <label style={styles.label}>
                {isArabic ? 'الاسم الكامل *' : 'Full Name *'}
              </label>
              <input
                style={styles.input}
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'}
              />
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>
                {isArabic ? 'رقم الهاتف *' : 'Phone Number *'}
              </label>
              <input
                style={styles.input}
                type="tel"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="05XXXXXXXX"
                dir="ltr"
              />
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>
                {isArabic ? 'البريد الإلكتروني' : 'Email (optional)'}
              </label>
              <input
                style={styles.input}
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
          </div>

          <div style={styles.formField}>
            <label style={styles.label}>
              {isArabic ? 'طريقة التواصل المفضلة' : 'Preferred Contact Method'}
            </label>
            <div style={styles.radioGroup}>
              {[
                { id: 'whatsapp', label: 'WhatsApp' },
                { id: 'phone', label: isArabic ? 'اتصال' : 'Phone Call' },
                { id: 'email', label: isArabic ? 'بريد إلكتروني' : 'Email' },
              ].map(option => (
                <label key={option.id} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="contact"
                    checked={formData.preferredContact === option.id}
                    onChange={() =>
                      handleInputChange('preferredContact', option.id as BookingFormData['preferredContact'])
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div style={styles.formField}>
            <label style={styles.label}>
              {isArabic ? 'ملاحظات إضافية' : 'Additional Notes'}
            </label>
            <textarea
              style={styles.textarea}
              value={formData.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
              placeholder={
                isArabic
                  ? 'أي معلومات إضافية تود مشاركتها...'
                  : 'Any additional information you would like to share...'
              }
            />
          </div>
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 4 && (
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>
            {isArabic ? 'ملخص الحجز' : 'Booking Summary'}
          </h3>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>
              {isArabic ? 'نوع الموعد:' : 'Appointment Type:'}
            </span>
            <span style={styles.summaryValue}>
              {bookingTypes.find(t => t.id === formData.type)?.label}
            </span>
          </div>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>
              {isArabic ? 'التاريخ والوقت:' : 'Date & Time:'}
            </span>
            <span style={styles.summaryValue}>
              {selectedSlotInfo
                ? `${selectedSlotInfo.date} @ ${selectedSlotInfo.time}`
                : '-'}
            </span>
          </div>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>
              {isArabic ? 'الاسم:' : 'Name:'}
            </span>
            <span style={styles.summaryValue}>{formData.name}</span>
          </div>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>
              {isArabic ? 'الهاتف:' : 'Phone:'}
            </span>
            <span style={styles.summaryValue}>{formData.phone}</span>
          </div>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>
              {isArabic ? 'طريقة التواصل:' : 'Contact Method:'}
            </span>
            <span style={styles.summaryValue}>{formData.preferredContact}</span>
          </div>

          {formData.notes && (
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>
                {isArabic ? 'ملاحظات:' : 'Notes:'}
              </span>
              <span style={styles.summaryValue}>{formData.notes}</span>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={styles.actions}>
        {step > 1 && (
          <button style={styles.backButton} onClick={() => setStep(s => s - 1)}>
            {isArabic ? '← السابق' : '← Back'}
          </button>
        )}

        {step < 4 ? (
          <button
            style={{
              ...styles.nextButton,
              opacity: canProceed ? 1 : 0.5,
              cursor: canProceed ? 'pointer' : 'not-allowed',
            }}
            onClick={() => canProceed && setStep(s => s + 1)}
            disabled={!canProceed}
          >
            {isArabic ? 'التالي →' : 'Next →'}
          </button>
        ) : (
          <button style={styles.submitButton} onClick={handleSubmit}>
            {isArabic ? '✓ تأكيد الحجز' : '✓ Confirm Booking'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingSystem;
