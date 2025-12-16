import { FormEvent, useMemo, useState } from 'react';

import { CLINIC } from '../data/clinic';
import { handleWhatsApp } from '../utils/whatsapp';
import { styles } from './styles';

const normaliseDigits = (value: string) => value.replace(/\D/g, '');

// Accept most international formats (UAE-friendly). WhatsApp supports 9-15 digits.
const isValidPhone = (value: string) => {
  const digits = normaliseDigits(value);
  return digits.length >= 9 && digits.length <= 15;
};

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const requiredValid = useMemo(() => name.trim().length > 1 && message.trim().length > 4 && isValidPhone(phone), [name, message, phone]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!requiredValid) return;

    const details = `الاسم: ${name}\nرقم الهاتف: ${phone}\nالبريد الإلكتروني: ${email || '—'}\n\nالرسالة:\n${message}`;

    handleWhatsApp(details);
    setSubmitted(true);
  };

  return (
    <section id="contact" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>تواصل معنا</h2>
          <span style={styles.chip}>📍 {CLINIC.city}</span>
        </div>
        <p style={styles.bodyText}>
          جاهزون لاستقبال أولياء الأمور، وكذلك تنسيق عروض تجريبية وشراكات مع المدارس والجامعات.
        </p>
        <p style={styles.muted}>
          سيتم فتح WhatsApp تلقائياً عند الإرسال. إذا لم يظهر، تأكد من السماح بالنوافذ المنبثقة.
        </p>
      </div>

      {submitted ? (
        <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
          <div style={{ ...styles.section, marginBottom: 0 }}>
            <h3 style={styles.h3}>تم تجهيز الرسالة ✅</h3>
            <p style={styles.bodyText}>
              إذا لم يُفتح WhatsApp، يمكنك مراسلتنا مباشرة على الرقم: <b dir="ltr">{CLINIC.whatsapp}</b>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              href={`mailto:${CLINIC.email}`}
              style={{ ...styles.ghostBtn, textDecoration: 'none' }}
            >
              مراسلة بالبريد
            </a>
            <a
              href={CLINIC.socials.instagram}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.ghostBtn, textDecoration: 'none' }}
            >
              Instagram
            </a>
            <a
              href={CLINIC.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.ghostBtn, textDecoration: 'none' }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          <div style={styles.form}>
            <label style={styles.formField}>
              <span style={{ fontWeight: 800 }}>الاسم الكامل</span>
              <input
                style={styles.input}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="مثال: محمد أحمد"
                autoComplete="name"
                required
              />
            </label>

            <label style={styles.formField}>
              <span style={{ fontWeight: 800 }}>رقم الهاتف (WhatsApp)</span>
              <input
                style={styles.input}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="مثال: 9715XXXXXXXX أو 05XXXXXXXX"
                autoComplete="tel"
                inputMode="tel"
                dir="ltr"
                required
              />
              {!phone ? null : isValidPhone(phone) ? null : (
                <span style={{ ...styles.muted, color: '#fca5a5' }}>أدخل رقم صحيح (9–15 رقم)</span>
              )}
            </label>

            <label style={styles.formField}>
              <span style={{ fontWeight: 800 }}>البريد الإلكتروني (اختياري)</span>
              <input
                style={styles.input}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                autoComplete="email"
                inputMode="email"
                dir="ltr"
              />
            </label>
          </div>

          <label style={styles.formField}>
            <span style={{ fontWeight: 800 }}>رسالتك</span>
            <textarea
              style={styles.textarea}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="اكتب نبذة عن الحالة / الهدف / أو طلب عرض للمدرسة"
              rows={6}
              required
            />
          </label>

          <button type="submit" style={requiredValid ? styles.primaryBtn : styles.disabledBtn} disabled={!requiredValid}>
            إرسال عبر WhatsApp
          </button>
        </form>
      )}
    </section>
  );
};

export default ContactForm;
