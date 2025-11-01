import { Well, AgentMessage, BlockchainEvent, ESGMetrics } from '../types';
import { EdgeAgent } from './EdgeAgent';

/**
 * Master Agent - Runs at Pytheas HQ
 * Aggregates alerts, validates incidents, triggers smart contract actions
 */
export class MasterAgent {
  private edgeAgents: Map<number, EdgeAgent> = new Map();
  private messageCallbacks: ((message: AgentMessage) => void)[] = [];
  private blockchainCallbacks: ((event: BlockchainEvent) => void)[] = [];
  private esgMetrics: ESGMetrics = {
    creditsEarned: 0,
    carbonAvoided: 0,
    insuranceSavings: 0,
    paybackPeriod: 24,
    riskScoreImprovement: 0
  };

  constructor() {}

  /**
   * Register an edge agent for a well
   */
  registerEdgeAgent(wellId: number): EdgeAgent {
    const agent = new EdgeAgent(wellId);
    this.edgeAgents.set(wellId, agent);
    return agent;
  }

  /**
   * Get edge agent for a well
   */
  getEdgeAgent(wellId: number): EdgeAgent | undefined {
    return this.edgeAgents.get(wellId);
  }

  /**
   * Subscribe to agent messages
   */
  onMessage(callback: (message: AgentMessage) => void): void {
    this.messageCallbacks.push(callback);
  }

  /**
   * Subscribe to blockchain events
   */
  onBlockchainEvent(callback: (event: BlockchainEvent) => void): void {
    this.blockchainCallbacks.push(callback);
  }

  /**
   * Send message to all subscribers
   */
  private sendMessage(message: Omit<AgentMessage, 'id' | 'timestamp'>): void {
    const fullMessage: AgentMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      ...message
    };
    this.messageCallbacks.forEach(cb => cb(fullMessage));
  }

  /**
   * Emit blockchain event
   */
  private emitBlockchainEvent(event: Omit<BlockchainEvent, 'id' | 'timestamp'>): void {
    const fullEvent: BlockchainEvent = {
      id: `evt-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      ...event
    };
    this.blockchainCallbacks.forEach(cb => cb(fullEvent));
  }

  /**
   * Validate and respond to leak alert
   */
  async handleLeakAlert(well: Well): Promise<void> {
    this.sendMessage({
      agent: 'master',
      wellId: well.id,
      message: `🔍 Master Agent validating ${well.name} anomaly...`,
      type: 'info'
    });

    // Validate anomaly
    await this.delay(1000);
    
    this.sendMessage({
      agent: 'master',
      wellId: well.id,
      message: `✅ Leak confirmed at ${well.name}. Triggering response protocols.`,
      type: 'alert'
    });

    // Record incident on blockchain
    await this.recordIncident(well);
    
    // Dispatch drone
    await this.dispatchDrone(well);
    
    // Create repair crew bounty
    await this.createRepairBounty(well);
  }

  /**
   * Record incident on blockchain
   */
  private async recordIncident(well: Well): Promise<void> {
    await this.delay(800);
    
    this.emitBlockchainEvent({
      type: 'incident',
      wellId: well.id,
      details: `Incident recorded: ${well.name} - Level: CRITICAL`,
      txHash: this.generateMockTxHash()
    });

    this.sendMessage({
      agent: 'system',
      wellId: well.id,
      message: `📝 On-chain incident log created for ${well.name}`,
      type: 'success'
    });
  }

  /**
   * Dispatch autonomous drone inspection
   */
  private async dispatchDrone(well: Well): Promise<void> {
    await this.delay(1000);
    
    this.emitBlockchainEvent({
      type: 'drone',
      wellId: well.id,
      details: `Drone dispatched to ${well.name}`,
      txHash: this.generateMockTxHash()
    });

    this.sendMessage({
      agent: 'master',
      wellId: well.id,
      message: `🚁 Autonomous drone dispatched to ${well.name}`,
      type: 'info'
    });
  }

  /**
   * Create repair crew bounty
   */
  private async createRepairBounty(well: Well): Promise<void> {
    await this.delay(1200);
    
    this.emitBlockchainEvent({
      type: 'crew',
      wellId: well.id,
      details: `Repair crew bounty created for ${well.name}`,
      txHash: this.generateMockTxHash()
    });

    this.sendMessage({
      agent: 'master',
      wellId: well.id,
      message: `👷 Repair crew bounty created - $5,000 reward`,
      type: 'success'
    });
  }

  /**
   * Resolve leak and mint ESG credits
   */
  async resolveLeak(well: Well): Promise<void> {
    await this.delay(1000);

    this.sendMessage({
      agent: 'master',
      wellId: well.id,
      message: `🔧 Leak repaired at ${well.name}. Processing ESG credits...`,
      type: 'success'
    });

    // Calculate avoided emissions (example: 50 tCO2e per prevented leak)
    const creditsToMint = 50;
    
    await this.mintESGCredits(well, creditsToMint);
    
    // Update metrics
    this.esgMetrics.creditsEarned += creditsToMint;
    this.esgMetrics.carbonAvoided += creditsToMint;
    this.esgMetrics.insuranceSavings += 25000; // $25k per incident prevented
    this.esgMetrics.riskScoreImprovement += 2;

    this.sendMessage({
      agent: 'system',
      wellId: well.id,
      message: `✨ Leak resolved. Total ESG credits: ${this.esgMetrics.creditsEarned}`,
      type: 'success'
    });
  }

  /**
   * Mint ESG credits
   */
  private async mintESGCredits(well: Well, amount: number): Promise<void> {
    await this.delay(800);
    
    this.emitBlockchainEvent({
      type: 'credits',
      wellId: well.id,
      details: `${amount} ESG credits minted for ${well.name}`,
      txHash: this.generateMockTxHash()
    });

    this.sendMessage({
      agent: 'master',
      wellId: well.id,
      message: `💚 ${amount} ESG credits minted (${amount} tCO2e avoided)`,
      type: 'success'
    });
  }

  /**
   * Get current ESG metrics
   */
  getESGMetrics(): ESGMetrics {
    return { ...this.esgMetrics };
  }

  /**
   * Generate mock transaction hash
   */
  private generateMockTxHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  /**
   * Utility delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

