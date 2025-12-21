export type LabModuleMetrics = {
  moduleId: string;
  timestamp: string;
  rawMetrics: Record<string, number>;
  score100: number;
  band: 'high' | 'mid' | 'low';
  fatigueIndex?: number;
  consistency?: number;
  notes?: string;
};
