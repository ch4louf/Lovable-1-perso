// Manual database types that mirror the schema
// This avoids import issues with auto-generated types during build

// ============= ENUMS =============
export type AppRole = 'admin' | 'manager' | 'member';
export type VersionStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type RunStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'READY_TO_SUBMIT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'PENDING_VALIDATION' | 'COMPLETED';
export type StepType = 'CHECKBOX' | 'TEXT_INPUT' | 'FILE_UPLOAD' | 'INFO';
export type TaskStatus = 'OPEN' | 'DONE';
export type NotificationType = 'TASK_ASSIGNED' | 'REVIEW_REQUIRED' | 'PROCESS_OUTDATED' | 'VERSION_PUBLISHED' | 'RUN_BLOCKED' | 'MENTION' | 'SLA_BREACH' | 'STALE_RUN';
export type TeamColor = 'indigo' | 'emerald' | 'amber' | 'slate' | 'pink' | 'blue' | 'purple' | 'gray' | 'red' | 'cyan';

// ============= USER PERMISSIONS (JSONB) =============
export interface UserPermissions {
  canDesign: boolean;
  canVerifyDesign: boolean;
  canExecute: boolean;
  canVerifyRun: boolean;
  canManageTeam: boolean;
  canAccessBilling: boolean;
}

// ============= WORKSPACE =============
export interface Workspace {
  id: string;
  name: string;
  settings: WorkspaceSettings | null;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceSettings {
  default_review_frequency_days: number;
  default_review_due_lead_days: number;
}

// ============= PROFILE =============
export interface Profile {
  id: string;
  workspace_id: string | null;
  email: string;
  first_name: string;
  last_name: string;
  job_title: string | null;
  avatar_url: string | null;
  status: string | null;
  permissions: UserPermissions | null;
  created_at: string;
  updated_at: string;
}

// ============= TEAM =============
export interface Team {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  color: TeamColor;
  lead_user_id: string | null;
  created_at: string;
  updated_at: string;
}

// ============= TEAM MEMBERSHIP =============
export interface TeamMembership {
  id: string;
  team_id: string;
  user_id: string;
  role: 'member' | 'lead';
  created_at: string;
}

// ============= USER ROLE =============
export interface UserRole {
  id: string;
  user_id: string;
  workspace_id: string;
  role: AppRole;
  created_at: string;
}

// ============= PROCESS DEFINITION =============
export interface ProcessDefinition {
  id: string;
  workspace_id: string;
  title: string;
  category: string;
  is_public: boolean | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// ============= PROCESS VERSION =============
export interface ProcessVersion {
  id: string;
  process_id: string;
  version_number: number;
  status: VersionStatus;
  description: string | null;
  
  // Governance
  editor_user_id: string | null;
  editor_job_title: string | null;
  editor_team_id: string | null;
  publisher_user_id: string | null;
  publisher_job_title: string | null;
  publisher_team_id: string | null;
  executor_user_id: string | null;
  executor_job_title: string | null;
  executor_team_id: string | null;
  run_validator_user_id: string | null;
  run_validator_job_title: string | null;
  run_validator_team_id: string | null;
  
  // Review
  review_frequency_days: number | null;
  review_due_lead_days: number | null;
  last_reviewed_at: string | null;
  last_reviewed_by: string | null;
  
  // Execution
  sequential_execution: boolean | null;
  estimated_duration_days: number | null;
  
  // Meta
  created_by: string | null;
  created_by_name: string | null;
  published_at: string | null;
  published_by: string | null;
  created_at: string;
  updated_at: string;
}

// ============= PROCESS STEP =============
export interface ProcessStep {
  id: string;
  version_id: string;
  order_index: number;
  text: string;
  input_type: StepType;
  required: boolean | null;
  assigned_user_id: string | null;
  assigned_job_title: string | null;
  assigned_job_titles: string[] | null;
  assigned_user_ids: string[] | null;
  assigned_team_ids: string[] | null;
  style: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

// ============= PROCESS RUN =============
export interface ProcessRun {
  id: string;
  process_id: string;
  version_id: string;
  workspace_id: string;
  run_name: string;
  status: RunStatus;
  started_by: string | null;
  started_by_name: string | null;
  started_at: string;
  completed_at: string | null;
  validated_at: string | null;
  validator_user_id: string | null;
  step_values: Record<string, any> | null;
  completed_step_ids: string[] | null;
  due_at: string | null;
  health_score: number | null;
  last_interaction_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============= TASK =============
export interface Task {
  id: string;
  run_id: string;
  step_id: string;
  workspace_id: string;
  assignee_user_id: string | null;
  assignee_job_title: string | null;
  assignee_team_id: string | null;
  status: TaskStatus;
  completed_at: string | null;
  completed_by: string | null;
  created_at: string;
  updated_at: string;
}

// ============= NOTIFICATION =============
export interface Notification {
  id: string;
  user_id: string;
  workspace_id: string | null;
  title: string;
  message: string;
  notification_type: NotificationType;
  link_id: string | null;
  link_type: 'RUN' | 'PROCESS' | 'MY_TASKS' | 'REVIEWS' | null;
  read: boolean | null;
  created_at: string;
}

// ============= STEP FEEDBACK =============
export interface StepFeedback {
  id: string;
  run_id: string;
  step_id: string;
  user_id: string;
  user_name: string;
  text: string;
  feedback_type: 'BLOCKER' | 'ADVISORY' | 'PRAISE';
  resolved: boolean | null;
  created_at: string;
}

// ============= ACTIVITY LOG =============
export interface ActivityLog {
  id: string;
  run_id: string;
  user_id: string;
  user_name: string;
  action: string;
  timestamp: string;
}

// ============= EXTENDED TYPES =============
export interface ProfileWithTeams extends Profile {
  team_memberships?: (TeamMembership & { team: Team })[];
  user_roles?: UserRole[];
}

export interface ProcessVersionWithSteps extends ProcessVersion {
  steps: ProcessStep[];
  process: ProcessDefinition;
}

export interface ProcessRunWithDetails extends ProcessRun {
  version: ProcessVersionWithSteps;
  process: ProcessDefinition;
}

export interface TaskWithContext extends Task {
  run: ProcessRun;
  step: ProcessStep;
}
