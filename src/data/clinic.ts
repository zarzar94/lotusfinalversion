export const CLINIC = {
  /** Display name used across the site */
  name: 'Lotus Holistic Centre × Berard AIT Sound Lab',
  /** Primary city for targeting */
  city: 'أبوظبي – الإمارات العربية المتحدة',
  /** WhatsApp phone number in international format (digits only). Override via VITE_CLINIC_PHONE */
  whatsapp: (import.meta.env.VITE_CLINIC_PHONE as string | undefined)?.replace(/\D/g, '') ?? '971000000000',
  /** General email (optional). Override via VITE_CLINIC_EMAIL */
  email: (import.meta.env.VITE_CLINIC_EMAIL as string | undefined) ?? 'info@lotus-holistic.ae',
  /** Social links */
  socials: {
    tiktok: 'https://vt.tiktok.com/ZSydLErRH/',
    facebook: 'https://www.facebook.com/share/14LfPuhkdVH/',
    instagram: 'https://www.instagram.com/berard.ait.eg?igsh=MXVjNmFnZng3MHcyMg==',
    linkedin: 'https://www.linkedin.com/company/lotus-holistic-centre/',
  },
} as const;

export type ClinicInfo = typeof CLINIC;
