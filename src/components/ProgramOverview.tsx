import { styles, brandCyan, brandPink, brandPurpleDark } from './styles';
import LabButtonAnchor from './labui/LabButtonAnchor';
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
            <LabButtonAnchor href="/assessment#games" variant="primary">
              {t('programOverview.startInteractive')}
            </LabButtonAnchor>
            <LabButtonAnchor href="/partners#schools" variant="ghost">
              {t('programOverview.schoolPartnerships')}
            </LabButtonAnchor>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <LabButtonAnchor
          href="/results#results"
          variant="primary"
          style={{ background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}
        >
          {t('programOverview.viewResults')}
        </LabButtonAnchor>
        <LabButtonAnchor
          href="/assessment#checklist"
          variant="ghost"
          style={{ borderColor: 'rgba(143,211,204,0.25)' }}
        >
          {t('programOverview.startChecklist')}
        </LabButtonAnchor>
        <LabButtonAnchor href="/contact#contact" variant="ghost" style={{ color: brandCyan }}>
          {t('programOverview.bookContact')}
        </LabButtonAnchor>
      </div>
    </section>
  );
};

export default ProgramOverview;
