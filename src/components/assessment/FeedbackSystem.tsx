import { useState } from 'react';
import { styles, brandCyan, brandPink } from '../styles';

interface FeedbackPayload {
  categories: Record<string, number>;
  recommendation: number;
  comments: string;
  consent: boolean;
}

const translations = {
  ar: {
    title: 'نظام الملاحظات الشامل',
    subtitle: 'تقييم الفئات + مقياس توصية (NPS) + اقتراحات تحسين + موافقة متابعة',
    categories: ['التجربة العامة', 'سهولة الاستخدام', 'جودة الصوت', 'الدعم'],
    nps: 'ما مدى احتمالية أن توصي بنا لصديق؟',
    suggestions: 'اقتراحاتك للتحسين',
    consent: 'أوافق على التواصل للمتابعة',
    submit: 'إرسال الملاحظات',
    badge: 'NPS + تقييمات',
  },
  en: {
    title: 'Comprehensive Feedback System',
    subtitle: 'Category ratings + NPS-style recommendation + improvements + follow-up consent',
    categories: ['Overall experience', 'Ease of use', 'Audio quality', 'Support'],
    nps: 'How likely are you to recommend us to a friend?',
    suggestions: 'Improvement suggestions',
    consent: 'I agree to be contacted for follow-up',
    submit: 'Submit feedback',
    badge: 'NPS + Ratings',
  },
};

const FeedbackSystem = ({ locale = 'ar', onSubmit }: { locale?: 'ar' | 'en'; onSubmit?: (payload: FeedbackPayload) => void }) => {
  const t = translations[locale];
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [nps, setNps] = useState(8);
  const [comments, setComments] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = () => {
    const payload: FeedbackPayload = {
      categories,
      recommendation: nps,
      comments,
      consent,
    };
    onSubmit?.(payload);
  };

  return (
    <section style={{ ...styles.sectionCard, display: 'grid', gap: 16 }}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>{t.title}</h2>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.15)' }}>{t.badge}</span>
        </div>
        <p style={styles.bodyText}>{t.subtitle}</p>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ ...styles.section, display: 'grid', gap: 10 }}>
          {t.categories.map((category) => (
            <div key={category} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ flex: 1, ...styles.bodyText }}>{category}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCategories({ ...categories, [category]: idx + 1 })}
                    style={{
                      ...styles.ghostBtn,
                      padding: '6px 10px',
                      borderColor: (categories[category] ?? 0) > idx ? brandCyan : 'rgba(255,255,255,0.08)',
                      background: (categories[category] ?? 0) > idx ? 'rgba(143,211,204,0.12)' : 'transparent',
                    }}
                  >
                    {(idx + 1).toString()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...styles.section, display: 'grid', gap: 10 }}>
          <div style={{ ...styles.sectionHeaderRow, alignItems: 'center' }}>
            <span style={styles.bodyText}>{t.nps}</span>
            <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.12)', color: brandPink }}>{nps}/10</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            value={nps}
            onChange={(e) => setNps(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ ...styles.section, display: 'grid', gap: 8 }}>
          <label style={styles.bodyText} htmlFor="suggestions">{t.suggestions}</label>
          <textarea
            id="suggestions"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            style={{
              minHeight: 100,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              padding: 10,
              color: 'white',
            }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span style={{ ...styles.bodyText, opacity: 0.85 }}>{t.consent}</span>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" onClick={handleSubmit} style={{ ...styles.primaryBtn, padding: '10px 16px' }}>
          {t.submit}
        </button>
      </div>
    </section>
  );
};

export default FeedbackSystem;
