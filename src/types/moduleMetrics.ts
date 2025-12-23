import type { TestKey, TestMetrics, TestTrial } from '../components/games/types';

export type LabModuleMetrics = {
  moduleId: TestKey | 'unknown';
  timestamp: string;
  rawMetrics: Record<string, number>;
  metrics: TestMetrics;
  trials?: TestTrial[];
  score100: number;
  band: 'high' | 'mid' | 'low';
  fatigueIndex?: number;
  fatigueSlope?: number;
  consistency?: number;
  qualityFlags?: string[];
  notes?: string;
};
