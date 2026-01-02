import { memo } from 'react';

import DashboardShell from '../components/dashboard/DashboardShell';
import ParentDashboard from '../components/analytics/ParentDashboard';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { brandPurple } from '../components/styles';

function ParentDashboardPage() {
  const { isArabic } = useLanguage();
  usePageTitle();

  return (
    <DashboardShell
      title={isArabic ? 'لوحة أولياء الأمور' : 'Parent Dashboard'}
      subtitle={isArabic
        ? 'متابعة تقدم الطفل ونتائج الجلسات والتقارير.'
        : 'Track your child\'s progress, sessions, and reports.'}
      badgeLabel={isArabic ? 'ولي الأمر' : 'Parent'}
      badgeTone={brandPurple}
    >
      <ParentDashboard />
    </DashboardShell>
  );
}

export default memo(ParentDashboardPage);
