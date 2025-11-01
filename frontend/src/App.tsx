import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Header } from './components/Header';
import { AlertFeed } from './components/AlertFeed';
import { MapView } from './components/MapView';
import { MapFallback } from './components/MapFallback';
import { WorldMap } from './components/WorldMap';
import { SimpleMap } from './components/SimpleMap';
import { ModernMap } from './components/ModernMap';
import { WellDetailPanel } from './components/WellDetailPanel';
import { InvestorView } from './components/InvestorView';
import { ContractModal } from './components/ContractModal';
import { CrewDispatchModal } from './components/CrewDispatchModal';
import { ToastNotification } from './components/ToastNotification';
import { BlockchainTransactionViewer } from './components/BlockchainTransactionViewer';
import { LiveMetricsOverlay } from './components/LiveMetricsOverlay';
import { ScreenFlash } from './components/ScreenFlash';
import { StatusIndicator } from './components/StatusIndicator';

function AppContent() {
  const { 
    viewMode, 
    selectedWell, 
    showContractModal, 
    showCrewModal,
    toasts,
    esgMetrics,
    simulationState,
    approveContract,
    rejectContract,
    completeCrewDispatch,
    removeToast
  } = useApp();

  const [flashTrigger, setFlashTrigger] = useState<'red' | 'green' | 'blue' | null>(null);
  const [showMetricsOverlay, setShowMetricsOverlay] = useState(false);

  // Trigger flash effects based on simulation stage
  useEffect(() => {
    if (simulationState.stage === 'detection' && simulationState.progress === 10) {
      setFlashTrigger('red');
      setTimeout(() => setFlashTrigger(null), 300);
    }
    if (simulationState.stage === 'complete') {
      setFlashTrigger('green');
      setTimeout(() => setFlashTrigger(null), 300);
      setShowMetricsOverlay(true);
      setTimeout(() => setShowMetricsOverlay(false), 4000);
    }
  }, [simulationState.stage, simulationState.progress]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (showContractModal || showCrewModal)) {
        rejectContract();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showContractModal, showCrewModal, rejectContract]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden relative">
      <StatusIndicator active={simulationState.active} />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <AlertFeed />
        <MapFallback />
        {viewMode === 'operations' && selectedWell && <WellDetailPanel />}
        {viewMode === 'investor' && <InvestorView />}
      </div>

      {/* Modals */}
      {showContractModal && selectedWell && (
        <ContractModal
          wellName={selectedWell.name}
          wellId={selectedWell.id}
          onApprove={approveContract}
          onReject={rejectContract}
        />
      )}

      {showCrewModal && selectedWell && (
        <CrewDispatchModal
          wellName={selectedWell.name}
          onComplete={completeCrewDispatch}
        />
      )}

      {/* Toast Notifications */}
      <ToastNotification toasts={toasts} onRemove={removeToast} />

      {/* Blockchain Transaction Viewer */}
      <BlockchainTransactionViewer />

      {/* Live Metrics Overlay */}
      <LiveMetricsOverlay
        esgCredits={esgMetrics.creditsEarned}
        carbonAvoided={esgMetrics.carbonAvoided}
        insuranceSavings={esgMetrics.insuranceSavings}
        show={showMetricsOverlay}
      />

      {/* Screen Flash Effects */}
      {flashTrigger && <ScreenFlash color={flashTrigger} trigger={true} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

