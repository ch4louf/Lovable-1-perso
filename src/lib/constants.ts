// Application constants
export const APP_NAME = 'ProcessOS';

// Route paths
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  LIBRARY: '/library',
  LIBRARY_DESIGN: '/library/design',
  LIBRARY_RUN: '/library/run',
  PROCESS: '/process/:id',
  PROCESS_EDIT: '/process/:id/edit',
  RUN: '/run/:id',
  RUNS: '/runs',
  TASKS: '/tasks',
  TEAM: '/team',
  BILLING: '/billing',
  SETTINGS: '/settings',
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  PROFILE: 'profile',
  WORKSPACE: 'workspace',
  TEAMS: 'teams',
  TEAM_MEMBERSHIPS: 'team-memberships',
  PROCESSES: 'processes',
  PROCESS_VERSIONS: 'process-versions',
  PROCESS_STEPS: 'process-steps',
  RUNS: 'runs',
  TASKS: 'tasks',
  NOTIFICATIONS: 'notifications',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
} as const;

// UI constants
export const UI = {
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 72,
  HEADER_HEIGHT: 64,
  TOAST_DURATION: 5000,
} as const;
