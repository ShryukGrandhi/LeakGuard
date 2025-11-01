import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Well, AgentMessage, BlockchainEvent, ESGMetrics, ViewMode, WalletState, SimulationState } from '../types';
import { MasterAgent } from '../agents/MasterAgent';
import { Toast } from '../components/ToastNotification';

interface AppContextType {
  wells: Well[];
  selectedWell: Well | null;
  messages: AgentMessage[];
  blockchainEvents: BlockchainEvent[];
  esgMetrics: ESGMetrics;
  viewMode: ViewMode;
  walletState: WalletState;
  simulationState: SimulationState;
  masterAgent: MasterAgent;
  toasts: Toast[];
  showContractModal: boolean;
  showCrewModal: boolean;
  selectWell: (wellId: number | null) => void;
  setViewMode: (mode: ViewMode) => void;
  startLeakSimulation: (wellId: number) => void;
  approveContract: () => void;
  rejectContract: () => void;
  completeCrewDispatch: () => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock well data - Pytheas operations around Houston
const MOCK_WELLS: Well[] = [
  {
    id: 34,
    name: 'Permian Basin – Well #34',
    location: 'West Texas',
    coordinates: [-103.5, 31.5],
    status: 'NORMAL',
    methaneLevel: 0.8,
    integrityScore: 95,
    lastReading: Date.now(),
    readings: [],
    riskTrend: 'stable'
  },
  {
    id: 12,
    name: 'Eagle Ford – Well #12',
    location: 'South Texas',
    coordinates: [-98.5, 28.5],
    status: 'NORMAL',
    methaneLevel: 0.6,
    integrityScore: 98,
    lastReading: Date.now(),
    readings: [],
    riskTrend: 'stable'
  },
  {
    id: 7,
    name: 'Delaware Basin – Well #7',
    location: 'West Texas',
    coordinates: [-104.0, 32.0],
    status: 'NORMAL',
    methaneLevel: 1.2,
    integrityScore: 92,
    lastReading: Date.now(),
    readings: [],
    riskTrend: 'stable'
  },
  {
    id: 56,
    name: 'Haynesville – Well #56',
    location: 'East Texas',
    coordinates: [-94.0, 32.5],
    status: 'NORMAL',
    methaneLevel: 0.9,
    integrityScore: 94,
    lastReading: Date.now(),
    readings: [],
    riskTrend: 'stable'
  },
  {
    id: 23,
    name: 'Midland Basin – Well #23',
    location: 'West Texas',
    coordinates: [-102.0, 32.0],
    status: 'NORMAL',
    methaneLevel: 0.7,
    integrityScore: 96,
    lastReading: Date.now(),
    readings: [],
    riskTrend: 'stable'
  }
];

// HQ Location - Houston
export const HQ_COORDINATES: [number, number] = [-95.3698, 29.7604];

export function AppProvider({ children }: { children: ReactNode }) {
  const [masterAgent] = useState(() => new MasterAgent());
  const [wells, setWells] = useState<Well[]>(MOCK_WELLS);
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [blockchainEvents, setBlockchainEvents] = useState<BlockchainEvent[]>([]);
  const [esgMetrics, setESGMetrics] = useState<ESGMetrics>(masterAgent.getESGMetrics());
  const [viewMode, setViewMode] = useState<ViewMode>('operations');
  const [walletState, setWalletState] = useState<WalletState>({ connected: false });
  const [simulationState, setSimulationState] = useState<SimulationState>({ active: false, progress: 0 });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [currentSimulationWell, setCurrentSimulationWell] = useState<number | null>(null);

  // Initialize edge agents for all wells - RUN ONCE
  useEffect(() => {
    let initialized = false;
    
    if (initialized) return;
    initialized = true;

    console.log('Initializing edge agents...');
    
    wells.forEach(well => {
      const agent = masterAgent.registerEdgeAgent(well.id);
      // Initialize with some baseline readings
      for (let i = 0; i < 10; i++) {
        agent.addReading(well.methaneLevel + (Math.random() - 0.5) * 0.2);
      }
    });

    // Subscribe to master agent events - ONCE
    masterAgent.onMessage((message) => {
      setMessages(prev => [...prev, message].slice(-50)); // Keep last 50 messages
    });

    masterAgent.onBlockchainEvent((event) => {
      setBlockchainEvents(prev => [...prev, event].slice(-20)); // Keep last 20 events
    });

    // Initial system message
    setTimeout(() => {
      setMessages([{
        id: 'init',
        timestamp: Date.now(),
        agent: 'system',
        message: '🟢 LeakGuard-AI Multi-Agent System Online - All wells connected to Pytheas HQ',
        type: 'success'
      }]);
    }, 500);
  }, []); // EMPTY - Run only once

  // Update well data periodically - OPTIMIZED
  useEffect(() => {
    const interval = setInterval(() => {
      setWells(prevWells => {
        return prevWells.map(well => {
          const agent = masterAgent.getEdgeAgent(well.id);
          if (!agent) return well;

          // During simulation, generate anomalous readings
          if (simulationState.active && simulationState.wellId === well.id) {
            const newReading = 2.5 + Math.random() * 0.5; // Above threshold
            agent.addReading(newReading);
          } else {
            // Normal operation - less frequent updates when not simulating
            const newReading = well.methaneLevel + (Math.random() - 0.5) * 0.1;
            agent.addReading(Math.max(0, newReading));
          }

          return {
            ...well,
            methaneLevel: agent.getLatestReading(),
            readings: agent.getReadings(),
            integrityScore: agent.calculateIntegrityScore(),
            riskTrend: agent.calculateRiskTrend(),
            lastReading: Date.now()
          };
        });
      });
    }, 3000); // Changed from 2000ms to 3000ms - less frequent

    return () => clearInterval(interval);
  }, [simulationState.active, simulationState.wellId]); // Only re-run when simulation changes

  // Update ESG metrics - LESS FREQUENT
  useEffect(() => {
    const interval = setInterval(() => {
      setESGMetrics(masterAgent.getESGMetrics());
    }, 2000); // Changed from 1000ms to 2000ms
    return () => clearInterval(interval);
  }, [masterAgent]); // Only masterAgent dependency

  const selectWell = (wellId: number | null) => {
    if (wellId === null) {
      setSelectedWell(null);
    } else {
      const well = wells.find(w => w.id === wellId);
      if (well) {
        console.log('Selected well:', well);
        setSelectedWell(well);
      } else {
        console.error('Well not found:', wellId);
        setSelectedWell(null);
      }
    }
  };

  // Toast management
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const startLeakSimulation = async (wellId: number) => {
    const well = wells.find(w => w.id === wellId);
    if (!well || simulationState.active) return;

    setCurrentSimulationWell(wellId);
    setSimulationState({ active: true, wellId, stage: 'detection', progress: 0 });

    // IMMEDIATE visual feedback - turn node red
    setWells(prev => prev.map(w => 
      w.id === wellId ? { ...w, status: 'LEAK' } : w
    ));

    addToast({
      type: 'warning',
      title: '⚠️ Anomaly Detected',
      message: `${well.name} reporting elevated methane levels`
    });

    // Stage 1: Detection (0-10%)
    setMessages(prev => [...prev, {
      id: `sim-1-${Date.now()}`,
      timestamp: Date.now(),
      agent: 'edge',
      wellId,
      message: `⚠️ Edge Agent at ${well.name} detecting elevated methane levels...`,
      type: 'warning'
    }]);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setSimulationState(prev => ({ ...prev, progress: 10 }));

    // Stage 2: Leak confirmed (10-20%)
    setMessages(prev => [...prev, {
      id: `sim-2-${Date.now()}`,
      timestamp: Date.now(),
      agent: 'edge',
      wellId,
      message: `🚨 CRITICAL: ${well.name} - Methane > 2.0 PPM for 3+ readings. Initiating emergency protocol.`,
      type: 'alert'
    }]);

    addToast({
      type: 'error',
      title: '🚨 LEAK CONFIRMED',
      message: `Critical incident at ${well.name}. Initiating automated response.`
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    setSimulationState(prev => ({ ...prev, stage: 'validation', progress: 20 }));

    // Stage 3: Show contract modal (20-40%)
    setShowContractModal(true);
  };

  const approveContract = async () => {
    setShowContractModal(false);
    const well = wells.find(w => w.id === currentSimulationWell);
    if (!well) return;

    addToast({
      type: 'success',
      title: '✅ Contract Approved',
      message: 'Smart contract deployed to blockchain. Initiating response protocols.'
    });

    setSimulationState(prev => ({ ...prev, progress: 40 }));

    // Log to blockchain
    await new Promise(resolve => setTimeout(resolve, 800));
    await masterAgent.handleLeakAlert(well);

    addToast({
      type: 'money',
      title: '💰 Funds Escrowed',
      message: '$5,000 locked in smart contract for crew payment'
    });

    setSimulationState(prev => ({ ...prev, stage: 'response', progress: 60 }));

    // Show crew dispatch modal
    await new Promise(resolve => setTimeout(resolve, 500));
    setShowCrewModal(true);
  };

  const rejectContract = () => {
    setShowContractModal(false);
    addToast({
      type: 'warning',
      title: 'Contract Rejected',
      message: 'Automated response cancelled. Manual intervention required.'
    });
    
    // Reset simulation
    setSimulationState({ active: false, progress: 0 });
    setWells(prev => prev.map(w => 
      w.id === currentSimulationWell ? { ...w, status: 'NORMAL' } : w
    ));
    setCurrentSimulationWell(null);
  };

  const completeCrewDispatch = async () => {
    setShowCrewModal(false);
    const well = wells.find(w => w.id === currentSimulationWell);
    if (!well) return;

    addToast({
      type: 'success',
      title: '🚁 Crew Dispatched',
      message: 'Repair team en route. ETA: 18 minutes. Live tracking active.'
    });

    setSimulationState(prev => ({ ...prev, progress: 80 }));

    // Simulate crew arrival and repair
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setMessages(prev => [...prev, {
      id: `sim-repair-${Date.now()}`,
      timestamp: Date.now(),
      agent: 'system',
      wellId: currentSimulationWell!,
      message: `🔧 Crew arrived at ${well.name}. Beginning repair operations...`,
      type: 'info'
    }]);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setSimulationState(prev => ({ ...prev, stage: 'resolution', progress: 90 }));

    // Resolution
    await masterAgent.resolveLeak(well);
    
    setWells(prev => prev.map(w => 
      w.id === currentSimulationWell ? { ...w, status: 'RESOLVED', methaneLevel: 0.8 } : w
    ));

    addToast({
      type: 'success',
      title: '✅ Leak Repaired',
      message: `${well.name} sealed successfully. Minting ESG credits...`
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    addToast({
      type: 'money',
      title: '💚 ESG Credits Minted',
      message: '50 carbon credits earned ($2,500 value). Insurance savings: $25,000'
    });

    setSimulationState(prev => ({ ...prev, stage: 'complete', progress: 100 }));

    // Reset after delay
    setTimeout(() => {
      setSimulationState({ active: false, progress: 0 });
      setWells(prev => prev.map(w => 
        w.id === currentSimulationWell ? { ...w, status: 'NORMAL' } : w
      ));
      setCurrentSimulationWell(null);
    }, 2000);
  };

  const connectWallet = async () => {
    // Demo mode - simulate wallet connection
    setWalletState({
      connected: true,
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      network: 'Hardhat Local'
    });
    
    setMessages(prev => [...prev, {
      id: `wallet-${Date.now()}`,
      timestamp: Date.now(),
      agent: 'system',
      message: '🔗 Wallet connected - Demo mode active',
      type: 'success'
    }]);
  };

  const disconnectWallet = () => {
    setWalletState({ connected: false });
    setMessages(prev => [...prev, {
      id: `wallet-${Date.now()}`,
      timestamp: Date.now(),
      agent: 'system',
      message: '🔌 Wallet disconnected',
      type: 'info'
    }]);
  };

  return (
    <AppContext.Provider value={{
      wells,
      selectedWell,
      messages,
      blockchainEvents,
      esgMetrics,
      viewMode,
      walletState,
      simulationState,
      masterAgent,
      toasts,
      showContractModal,
      showCrewModal,
      selectWell,
      setViewMode,
      startLeakSimulation,
      approveContract,
      rejectContract,
      completeCrewDispatch,
      connectWallet,
      disconnectWallet,
      addToast,
      removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

