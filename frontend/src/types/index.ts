export type WellStatus = 'NORMAL' | 'WARNING' | 'LEAK' | 'RESOLVED';

export type ViewMode = 'operations' | 'investor';

export interface Well {
  id: number;
  name: string;
  location: string;
  coordinates: [number, number]; // [lng, lat]
  status: WellStatus;
  methaneLevel: number; // PPM
  integrityScore: number; // 0-100
  lastReading: number; // timestamp
  readings: MethaneReading[];
  riskTrend: 'rising' | 'stable' | 'falling';
}

export interface MethaneReading {
  timestamp: number;
  ppm: number;
}

export interface AgentMessage {
  id: string;
  timestamp: number;
  agent: 'edge' | 'master' | 'system';
  wellId?: number;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
}

export interface BlockchainEvent {
  id: string;
  timestamp: number;
  type: 'incident' | 'drone' | 'crew' | 'credits' | 'insurance';
  wellId?: number;
  details: string;
  txHash?: string;
}

export interface ESGMetrics {
  creditsEarned: number;
  carbonAvoided: number; // tCO2e
  insuranceSavings: number; // USD
  paybackPeriod: number; // months
  riskScoreImprovement: number; // percentage
}

export interface WalletState {
  connected: boolean;
  address?: string;
  network?: string;
}

export interface SimulationState {
  active: boolean;
  wellId?: number;
  stage: 'detection' | 'validation' | 'response' | 'resolution' | 'complete';
  progress: number;
}

