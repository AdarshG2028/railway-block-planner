export type Department =
  | "Engineering"
  | "Signal & Telecommunication (S&T)"
  | "Traction Distribution (TRD)";

export const DEPARTMENTS: Department[] = [
  "Engineering",
  "Signal & Telecommunication (S&T)",
  "Traction Distribution (TRD)",
];

export const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export const EQUIPMENT_OPTIONS = [
  "Tamping Machine",
  "Tower Wagon",
  "Signal Testing Equipment",
  "Rail Crane",
  "Track Recording Car",
] as const;

export const SECTIONS = ["LNL-PUNE", "BPL", "RKMP"] as const;

export type Window = {
  date?: string;
  startTime?: string;
  endTime?: string;
  durationHours?: number;
  trafficLevel?: string;
  trafficScore?: number;
  weatherSuitable?: boolean;
  overallScore?: number;
  score?: number;
  optionId?: string;
};

export type AssetRisk = {
  asset_id: string;
  snapshot_date?: string;
  risk_probability?: number;
  risk_score?: number;
  risk_level?: string;
  recommended_action?: string;
  predicted_probability?: number;
  predicted_class?: number | string;
};

export type Decision = {
  requestId?: string;
  status?: string;
  sectionId?: string;
  fromLocation?: string;
  toLocation?: string;
  fromKm?: number;
  toKm?: number;
  linearSpanKm?: number;
  lineConfiguration?: string;
  department?: string;
  maintenanceType?: string;
  priority?: string;
  userPreferences?: Record<string, unknown>;
  safetyProtocols?: {
    speedRestriction?: string;
    safetyPrecautions?: string | string[];
    powerBlockRequired?: boolean;
    trafficBlockRequired?: boolean;
  };
  recommendedWindow?: Window;
  multiDepartmentCoordination?: {
    integratedDepartments?: string[];
    isMultiDepartment?: boolean;
    downtimeSavedHours?: number;
    primaryTask?: Record<string, unknown>;
    coLocatedTasks?: Array<Record<string, unknown>>;
  };
  interDepartmentSequencing?: Array<{
    phase?: number;
    timeWindow?: string;
    department?: string;
    safetyAction?: string;
    operatingProtocol?: string;
  }>;
  corridorStarvationAnalysis?: Record<string, unknown>;
  blockProductivityAndBuffers?: Record<string, unknown>;
  specialTrafficCalendar?: Record<string, unknown>;
  reasons?: string[];
  alternativeOptions?: Window[];
};

export type BlockRequest = {
  _id?: string;
  id?: string;
  requestId: string;
  sectionId?: string;
  department?: string;
  maintenanceType?: string;
  fromKm?: number;
  toKm?: number;
  preferredDate?: string;
  input?: Record<string, unknown>;
  decision?: Decision;
  status?: string;
  selectedWindow?: Window;
  assetRisk?: AssetRisk | null;
  auditTrail?: Array<{ action?: string; at?: string; by?: string; note?: string }>;
  createdAt?: string;
  updatedAt?: string;
};

export type Kpis = {
  evaluation_summary?: {
    title?: string;
    prototype_disclaimer?: string;
    corridor?: string;
    evaluation_period?: string;
  };
  before_vs_after?: Record<string, Record<string, unknown>>;
  kpis?: Record<string, number>;
};

export type WhatIfResult = {
  simulation_query?: Record<string, unknown>;
  has_conflict?: boolean;
  conflict_summary?: Record<string, number>;
  conflicting_trains?: Array<{
    train_number?: string;
    train_name?: string;
    train_type?: string;
    scheduled_passage?: string;
    priority?: string;
    estimated_delay_minutes?: number;
  }>;
  recommended_alternative?: {
    start_time?: string;
    end_time?: string;
    conflicts?: number;
    note?: string;
  };
  recommendation?: string;
};

export type GeneratedBlock = {
  block_id: string;
  date?: string;
  corridor?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  duration?: string | number;
  selected_tasks?: Array<{
    task_id?: string;
    department?: string;
    task_type?: string;
    asset_id?: string;
    priority_score?: number;
    priority_level?: string;
    estimated_duration?: string | number;
  }>;
  departments?: string[];
  affected_assets?: string[];
  affected_trains?: Array<{
    train_number?: string;
    train_name?: string;
    rake_type?: string;
    entry_time?: string;
    exit_time?: string;
    can_be_regulated?: boolean;
    delay_minutes?: number;
  }>;
  optimization_score?: number;
  reason_recommendation?: string;
};

export type PlanResult = {
  planning_horizon?: string;
  start_date?: string;
  end_date?: string;
  corridor?: string;
  total_tasks_processed?: number;
  generated_blocks?: GeneratedBlock[];
  task_priorities?: PriorityResult[];
  conflicts?: unknown[];
  kpis?: Record<string, number>;
  before_vs_after_evaluation?: Record<string, unknown>;
  recommendations?: string[];
};

export type PriorityResult = {
  task_id?: string;
  priority_score?: number;
  priority_level?: string;
  major_contributing_factors?: string[];
  raw_task_reference?: Record<string, unknown>;
};

export type RiskRow = {
  asset_id: string;
  snapshot_date?: string;
  predicted_probability?: number;
  predicted_class?: number | string;
  risk_probability?: number;
  risk_score?: number;
  risk_level?: string;
  recommended_action?: string;
};

export type RiskExplanation = Record<string, string | number | undefined> & {
  asset_id?: string;
  snapshot_date?: string;
  ensemble_probability?: number;
  risk_level?: string;
};

export type ApprovalStatus = {
  blockId: string;
  status: string;
  departmentApprovedAt?: string;
  drmApprovedAt?: string;
  bdmsSubmittedAt?: string;
};
