export interface CountPercentage {
  count: number;
  percentage: number;
}

export interface Breakdown {
  total: number;
  breakdown: Record<string, CountPercentage>;
}

export interface DashboardSummary {
  overallStatistics: {
    totalProducers: number;
    totalTasks: number;
    totalCarriers: number;
    totalAgencies: number;
  };
  keyMetrics: {
    overdueTasks: number;
    highPriorityTasks: number;
    activeProducers: number;
    pendingProducers: number;
    activeCarriers: number;
    tasksCompletedLast30Days: number;
  };
  recentActivity: {
    taskStatusBreakdown: Record<string, number>;
    producerStatusBreakdown: Record<string, number>;
  };
}

export interface AgencyAnalytics {
  agenciesByState: Record<string, number>;
  stateDistribution: {
    total: number;
    distribution: Record<string, CountPercentage>;
  };
}

export interface CarrierAnalytics {
  carriersByStatus: Record<string, number>;
  carriersByState: Record<string, number>;
  statusBreakdown: Breakdown;
}

export interface ProducerWithTaskCount {
  producerId: number;
  producerName: string;
  status: string;
  state: string;
  taskCount: number;
}

export interface ProducerAnalytics {
  producersByStatus: Record<string, number>;
  producersByState: Record<string, number>;
  producersWithTaskCounts: ProducerWithTaskCount[];
  statusBreakdown: Breakdown;
}

export interface TaskAnalytics {
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  tasksByTimeBucket: Record<string, number>;
  tasksPerProducer: { producerId: number; producerName: string; taskCount: number }[];
  dailyCompletionTrend: { date: string; count: number }[];
}

export interface QueryResponse {
  success: boolean;
  message: string;
  intent?: unknown;
  data?: Record<string, unknown>[] | null;
  executionTimeMs: number;
}
