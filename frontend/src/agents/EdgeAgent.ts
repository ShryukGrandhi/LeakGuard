import { Well, MethaneReading, AgentMessage } from '../types';

/**
 * Edge Agent - Runs locally at each well
 * Monitors methane levels and detects anomalies
 */
export class EdgeAgent {
  private wellId: number;
  private readings: MethaneReading[] = [];
  private readonly LEAK_THRESHOLD = 2.0; // PPM
  private readonly ALERT_WINDOW = 3; // consecutive readings

  constructor(wellId: number) {
    this.wellId = wellId;
  }

  /**
   * Add new methane reading
   */
  addReading(ppm: number): void {
    const reading: MethaneReading = {
      timestamp: Date.now(),
      ppm
    };
    this.readings.push(reading);
    
    // Keep last 30 readings for trend analysis
    if (this.readings.length > 30) {
      this.readings.shift();
    }
  }

  /**
   * Anomaly detection logic
   * Threshold: last 3 readings > 2.0 PPM → leak
   */
  detectAnomaly(): boolean {
    if (this.readings.length < this.ALERT_WINDOW) {
      return false;
    }

    const recentReadings = this.readings.slice(-this.ALERT_WINDOW);
    return recentReadings.every(r => r.ppm > this.LEAK_THRESHOLD);
  }

  /**
   * Calculate risk trend using simple linear regression
   */
  calculateRiskTrend(): 'rising' | 'stable' | 'falling' {
    if (this.readings.length < 5) return 'stable';

    const recent = this.readings.slice(-10);
    const n = recent.length;
    
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    recent.forEach((reading, i) => {
      sumX += i;
      sumY += reading.ppm;
      sumXY += i * reading.ppm;
      sumX2 += i * i;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    if (slope > 0.05) return 'rising';
    if (slope < -0.05) return 'falling';
    return 'stable';
  }

  /**
   * Generate predicted readings for next 30 minutes
   */
  predictFuture(minutes: number = 30): MethaneReading[] {
    if (this.readings.length < 2) return [];

    const lastReading = this.readings[this.readings.length - 1];
    const trend = this.calculateRiskTrend();
    
    let changeRate = 0;
    if (trend === 'rising') changeRate = 0.1;
    if (trend === 'falling') changeRate = -0.1;

    const predictions: MethaneReading[] = [];
    for (let i = 1; i <= minutes; i++) {
      predictions.push({
        timestamp: lastReading.timestamp + i * 60000,
        ppm: Math.max(0, lastReading.ppm + changeRate * i)
      });
    }

    return predictions;
  }

  /**
   * Calculate integrity score based on reading stability
   */
  calculateIntegrityScore(): number {
    if (this.readings.length < 5) return 100;

    const recent = this.readings.slice(-10);
    const variance = this.calculateVariance(recent.map(r => r.ppm));
    const avgPpm = recent.reduce((sum, r) => sum + r.ppm, 0) / recent.length;

    // Score decreases with higher PPM and variance
    let score = 100 - (avgPpm * 10) - (variance * 5);
    return Math.max(0, Math.min(100, score));
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getReadings(): MethaneReading[] {
    return [...this.readings];
  }

  getLatestReading(): number {
    return this.readings.length > 0 
      ? this.readings[this.readings.length - 1].ppm 
      : 0;
  }
}

