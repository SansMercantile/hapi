export type ConstellationSystem = 'PTah' | 'Hathor' | 'MAMI_WATA' | 'SHANGO' | 'RA';

export interface LogisticsNode {
  id: string;
  name: string;
  system: ConstellationSystem;
  coordinates: { x: number; y: number };
  description: string;
  currentStock: number;
  maxCapacity: number;
  criticalResource: string;
  demandTrend: 'rising' | 'stable' | 'falling';
  hazardStatus: string | null;
}

export type ShipmentStatus = 'In Transit' | 'Arrived' | 'Delayed' | 'Rerouted' | 'Replenishing';

export interface Shipment {
  id: string;
  name: string;
  type: 'Standard' | 'Critical' | 'Climate-Sensitive';
  originId: string;
  destinationId: string;
  status: ShipmentStatus;
  cargo: string;
  cargoLoad: number; // percentage
  progress: number; // 0 to 100
  eta: number; // cycles remaining
  speed: number; // lightspeed factor
  activeHazard: string | null;
}

export interface DemandForecastPoint {
  cycle: string;
  predicted: number;
  actual?: number;
  withBuffer: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  system: ConstellationSystem | 'HAPI Core';
  type: 'info' | 'warning' | 'success';
  message: string;
}

export interface OperationalMetrics {
  totalActiveShipments: number;
  autonomousDirectivesCount: number;
  averageTransitEfficiency: number; // percentage
  globalRiskIndex: number; // percentage
  bufferSafetyMargin: number; // percentage
  hazardAwareScheduling: boolean;
  elasticBufferAllocation: boolean;
  crossSystemSync: boolean;
}
