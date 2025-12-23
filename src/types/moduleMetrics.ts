import type { TestKey, TestMetrics, TestTrial } from '../components/games/types';

export type SessionQualityFlag = {
  code: string;
  label?: string;
  description?: string;
  severity?: 'info' | 'warning' | 'critical';
};

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
  qualityFlags?: SessionQualityFlag[];
};
