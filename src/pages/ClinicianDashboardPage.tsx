import { memo } from 'react';

import DashboardShell from '../components/dashboard/DashboardShell';
import ClinicianDashboard from '../components/analytics/ClinicianDashboard';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { brandPink } from '../components/styles';

function ClinicianDashboardPage() {
  const { isArabic } = useLanguage();
  usePageTitle();

  return (
    <DashboardShell
      title={isArabic ? 'لوحة الأخصائيين' : 'Clinician Dashboard'}
      subtitle={isArabic
        ? 'مقاييس الوحدات، المتابعة الطولية، وتقارير قابلة للتوقيع.'
        : 'Module metrics, longitudinal tracking, and signed reports.'}
      badgeLabel={isArabic ? 'أخصائي' : 'Clinician'}
      badgeTone={brandPink}
    >
      <ClinicianDashboard />
    </DashboardShell>
  );
}

export default memo(ClinicianDashboardPage);
