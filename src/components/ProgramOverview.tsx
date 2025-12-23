import { styles, brandCyan, brandPink, brandPurpleDark } from './styles';
import { useLanguage } from '../context/LanguageContext';

const ProgramOverview = () => {
  const { t } = useLanguage();

  return (
    <section id="overview" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>{t('programOverview.title')}</h2>
          <span style={styles.chip}>{t('programOverview.chip')}</span>
        </div>

        <p style={styles.bodyText}>
          {t('programOverview.description')}
        </p>
        <p style={styles.muted}>
          {t('programOverview.disclaimer')}
        </p>
      </div>

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: 16 }}>
        <div style={styles.section}>
          <h3 style={{ ...styles.h3, marginTop: 0 }}>{t('programOverview.howItWorks')}</h3>
          <ul style={{ margin: 0, paddingInlineStart: 18, lineHeight: 1.8, opacity: 0.92 }}>
            <li><b>{t('programOverview.howItWorksList.sessions')}</b></li>
            <li>{t('programOverview.howItWorksList.duration')}</li>
            <li>{t('programOverview.howItWorksList.gap')}</li>
            <li>{t('programOverview.howItWorksList.testing')}</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={{ ...styles.h3, marginTop: 0 }}>{t('programOverview.suitableFor')}</h3>
          <p style={styles.bodyText}>
            {t('programOverview.suitableDescription')}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)', borderColor: 'rgba(143,211,204,0.25)' }}>{t('programOverview.conditions.apd')}</span>
            <span style={{ ...styles.chip, background: 'rgba(175,132,186,0.12)', borderColor: 'rgba(175,132,186,0.25)' }}>{t('programOverview.conditions.hypersensitivity')}</span>
            <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.12)', borderColor: 'rgba(176,18,112,0.25)' }}>{t('programOverview.conditions.attention')}</span>
            <span style={styles.chip}>{t('programOverview.conditions.learningDifficulties')}</span>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={{ ...styles.h3, marginTop: 0 }}>{t('programOverview.whySchools')}</h3>
          <p style={styles.bodyText}>
            {t('programOverview.whySchoolsDescription')}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
            <a href="/assessment#games" style={{ ...styles.primaryBtn, textDecoration: 'none' }}>{t('programOverview.startInteractive')}</a>
            <a href="/partners#schools" style={{ ...styles.ghostBtn, textDecoration: 'none' }}>{t('programOverview.schoolPartnerships')}</a>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a href="/results#results" style={{ ...styles.primaryBtn, textDecoration: 'none', background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}>
          {t('programOverview.viewResults')}
        </a>
        <a href="/assessment#checklist" style={{ ...styles.ghostBtn, textDecoration: 'none', borderColor: 'rgba(143,211,204,0.25)' }}>
          {t('programOverview.startChecklist')}
        </a>
        <a href="/contact#contact" style={{ ...styles.ghostBtn, textDecoration: 'none', color: brandCyan }}>
          {t('programOverview.bookContact')}
        </a>
      </div>
    </section>
  );
};

export default ProgramOverview;
