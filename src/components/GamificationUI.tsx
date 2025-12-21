import { memo } from 'react';
import AchievementToast from './AchievementToast';
import ProgressDashboard from './ProgressDashboard';
import ScrollProgressTracker from './ScrollProgressTracker';
import ActivityFeed from './ActivityFeed';
import NotificationCenter from './NotificationCenter';
import { ProgressExportButton } from './ProgressExport';

const GamificationUI = memo(() => (
  <>
    <AchievementToast />
    <ProgressDashboard />
    <ScrollProgressTracker />
    <ActivityFeed />
    <NotificationCenter />
    {/* Hidden export button that listens for export-progress event */}
    <div style={{ position: 'fixed', bottom: -100, left: -100, opacity: 0, pointerEvents: 'none' }}>
      <ProgressExportButton />
    </div>
  </>
));

GamificationUI.displayName = 'GamificationUI';

export default GamificationUI;
