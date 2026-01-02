import { memo } from 'react';

import DashboardShell from '../components/dashboard/DashboardShell';
import SchoolDashboard from '../components/analytics/SchoolDashboard';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { colors } from '../components/styles';

function EducatorDashboardPage() {
  const { isArabic } = useLanguage();
  usePageTitle();

  return (
    <DashboardShell
      title={isArabic ? 'لوحة المدرسة' : 'School Dashboard'}
      subtitle={isArabic
        ? 'فرز صفّي، تقارير مجمعة، وشراكات المدرسة.'
        : 'Classroom screening, aggregated reports, and school partnerships.'}
      badgeLabel={isArabic ? 'مدرسة' : 'School'}
      badgeTone={colors.warning}
    >
      <SchoolDashboard />
    </DashboardShell>
  );
}

export default memo(EducatorDashboardPage);
