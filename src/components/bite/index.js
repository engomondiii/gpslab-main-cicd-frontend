/**
 * GPS Lab Platform - Bite Components Central Export
 * 
 * @module components/bite
 */

// BiteList Components
export { default as BiteListItem } from './BiteList/BiteListItem';
export { default as BiteList } from './BiteList/BiteList';

// BiteBoard Components (Kanban)
export { default as BiteBoardCard } from './BiteBoard/BiteBoardCard';
export { default as BiteBoardColumn } from './BiteBoard/BiteBoardColumn';
export { default as BiteBoard } from './BiteBoard/BiteBoard';

// BiteDetail Components
export { default as BiteDescription } from './BiteDetail/BiteDescription';
export { default as BiteAcceptanceCriteria } from './BiteDetail/BiteAcceptanceCriteria';
export { default as BiteDependencies } from './BiteDetail/BiteDependencies';
export { default as BiteDetail } from './BiteDetail/BiteDetail';

// BitePlanning Components
export { default as BiteWorkBreakdown } from './BitePlanning/BiteWorkBreakdown';
export { default as BitePlanningForm } from './BitePlanning/BitePlanningForm';

// BiteExecution Components
export { default as BiteNotes } from './BiteExecution/BiteNotes';
export { default as BiteResources } from './BiteExecution/BiteResources';
export { default as BiteWorkspace } from './BiteExecution/BiteWorkspace';

// BiteSubmission Components
export { default as BiteDeliverableUpload } from './BiteSubmission/BiteDeliverableUpload';
export { default as BiteMetadataForm } from './BiteSubmission/BiteMetadataForm';
export { default as BiteSubmissionForm } from './BiteSubmission/BiteSubmissionForm';

// BiteReview Components
export { default as BiteAIReview } from './BiteReview/BiteAIReview';
export { default as BitePeerReview } from './BiteReview/BitePeerReview';
export { default as BiteReviewPanel } from './BiteReview/BiteReviewPanel';

/**
 * Bite Status Constants
 */
export const BITE_STATUS = {
  backlog: { label: 'Backlog', color: 'neutral', icon: 'inbox' },
  planned: { label: 'Planned', color: 'info', icon: 'calendar' },
  in_progress: { label: 'In Progress', color: 'primary', icon: 'play' },
  review: { label: 'Review', color: 'warning', icon: 'eye' },
  completed: { label: 'Completed', color: 'success', icon: 'check' },
  blocked: { label: 'Blocked', color: 'error', icon: 'lock' }
};

/**
 * Bite Type Constants
 */
export const BITE_TYPE = {
  task: { label: 'Task', icon: 'clipboard' },
  coding: { label: 'Coding', icon: 'code' },
  research: { label: 'Research', icon: 'search' },
  design: { label: 'Design', icon: 'palette' },
  writing: { label: 'Writing', icon: 'document' },
  quiz: { label: 'Quiz', icon: 'question' }
};

/**
 * Bite Priority Constants
 */
export const BITE_PRIORITY = {
  low: { label: 'Low', weight: 1, color: 'neutral' },
  medium: { label: 'Medium', weight: 2, color: 'info' },
  high: { label: 'High', weight: 3, color: 'warning' },
  critical: { label: 'Critical', weight: 4, color: 'error' }
};