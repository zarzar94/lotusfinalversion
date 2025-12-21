import { CLINIC } from '../data/clinic';

/**
 * Opens WhatsApp chat with the clinic.
 * Optionally include a pre-filled message.
 */
export const handleWhatsApp = (message?: string): void => {
  const clinicPhone = CLINIC.whatsapp;
  if (!clinicPhone) {
    alert('رقم واتساب غير مضاف بعد. الرجاء إضافة VITE_CLINIC_PHONE في الإعدادات.');
    return;
  }

  const phone = clinicPhone.replace(/\D/g, '');
  const url = message
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${phone}`;

  window.open(url, '_blank', 'noopener,noreferrer');
};
