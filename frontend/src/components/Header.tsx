import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Shield, MapPin, TrendingDown, Activity, Wallet } from 'lucide-react';

export const Header = React.memo(function Header() {
  const { wells, esgMetrics, viewMode, setViewMode, walletState, connectWallet, disconnectWallet, simulationState } = useApp();

  const activeWells = wells.filter(w => w.status !== 'LEAK').length;
  const esgRiskScore = Math.max(0, 100 - (esgMetrics.riskScoreImprovement * 0.5));
  const safetyScore = Math.min(100, 85 + esgMetrics.riskScoreImprovement);
  const hasActiveAlert = wells.some(w => w.status === 'LEAK');

  return (
    <div className="bg-slate-950 border-b border-slate-800">
      {/* Top Row: Logo and Controls */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-blue-500" strokeWidth={2} />
          <div>
            <h1 className="text-lg font-bold text-white">LeakGuard-AI</h1>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3" />
              <span>Pytheas HQ – Houston</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Toggle */}
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
            <button
              onClick={() => setViewMode('operations')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'operations'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Operations
            </button>
            <button
              onClick={() => setViewMode('investor')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'investor'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Investor
            </button>
          </div>

          <button
            onClick={walletState.connected ? disconnectWallet : connectWallet}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              walletState.connected
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Wallet className="w-4 h-4" />
            {walletState.connected
              ? `${walletState.address?.slice(0, 6)}...${walletState.address?.slice(-4)}`
              : 'Connect Wallet'
            }
          </button>
        </div>
      </div>

      {/* Bottom Row: Metric Cards */}
      <div className="px-6 py-4 flex items-center gap-4">
        <MetricCard
          icon={<Activity className="w-5 h-5" />}
          label="WELLS ONLINE"
          value={`${activeWells}/${wells.length}`}
          score={Math.round((activeWells / wells.length) * 100)}
          color="blue"
        />
        <MetricCard
          icon={<Shield className="w-5 h-5" />}
          label="SAFETY SCORE"
          value={`${safetyScore.toFixed(0)}/100`}
          score={safetyScore}
          color="green"
        />
        <MetricCard
          icon={<TrendingDown className="w-5 h-5" />}
          label="ESG RISK"
          value={`${esgRiskScore.toFixed(0)}/100`}
          score={100 - esgRiskScore}
          color="blue"
        />
        <MetricCard
          icon={<Activity className="w-5 h-5" />}
          label="EMISSIONS PREVENTED"
          value={`${esgMetrics.carbonAvoided} tCO₂e`}
          subtext={`$${(esgMetrics.carbonAvoided * 50).toLocaleString()} value`}
          color="green"
        />
        
        <div className="ml-auto px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg">
          <span className="text-xs text-slate-400 font-medium">
            Powered by Pytheas Operations Data
          </span>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  score?: number;
  subtext?: string;
  color: 'blue' | 'green';
}

function MetricCard({ icon, label, value, score, subtext, color }: MetricCardProps) {
  const colorClasses = {
    blue: { icon: 'text-blue-500', bar: 'bg-blue-600', bg: 'bg-slate-900' },
    green: { icon: 'text-green-500', bar: 'bg-green-600', bg: 'bg-slate-900' }
  };

  return (
    <div className={`${colorClasses[color].bg} border border-slate-800 rounded-lg px-4 py-3 min-w-[180px]`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={colorClasses[color].icon}>
          {icon}
        </div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          {label}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <div className="text-xl font-bold text-white">{value}</div>
      </div>
      {score !== undefined && (
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
          <div
            className={`${colorClasses[color].bar} h-1.5 rounded-full transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      )}
      {subtext && (
        <div className="text-xs text-slate-500 mt-1">{subtext}</div>
      )}
    </div>
  );
});


