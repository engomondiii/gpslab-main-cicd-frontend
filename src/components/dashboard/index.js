/**
 * GPS Lab Platform - Dashboard Components Index
 * 
 * @module components/dashboard
 */

// Dashboard Overview
export { 
  default as StatsWidget,
  StatIcons 
} from './DashboardOverview/StatsWidget';

export { 
  default as ActivityFeed,
  ACTIVITY_TYPES,
  ActivityItem,
  formatRelativeTime 
} from './DashboardOverview/ActivityFeed';

export { default as DashboardOverview } from './DashboardOverview/DashboardOverview';

// Stage Progress
export { 
  default as StageCard,
  STAGE_STATUS 
} from './StageProgress/StageCard';

export { 
  default as StageProgressMap,
  ADVENTURES 
} from './StageProgress/StageProgressMap';

// Quick Actions
export { 
  default as QuickActions,
  DEFAULT_ACTIONS,
  QuickActionButton 
} from './QuickActions/QuickActions';

// Recent Activity
export { 
  default as RecentActivity,
  ACTIVITY_FILTERS,
  ACTIVITY_CONFIG,
  ActivityTimelineItem 
} from './RecentActivity/RecentActivity';

// Command Center
export { 
  default as CommandCenterMap,
  NODE_TYPES 
} from './CommandCenter/CommandCenterMap';

export { default as CommandCenter } from './CommandCenter/CommandCenter';