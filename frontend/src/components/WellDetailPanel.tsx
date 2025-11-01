import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { X, AlertTriangle, Activity, TrendingUp, Zap, Plane, Users, Sparkles, FileText, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { generateWellReport } from '../utils/pdfExport';

export const WellDetailPanel = React.memo(function WellDetailPanel() {
  const { selectedWell, selectWell, startLeakSimulation, simulationState, addToast } = useApp();

  if (!selectedWell) return null;

  // Safety checks for readings
  const readings = selectedWell.readings || [];
  const chartData = readings.length > 0 
    ? readings.slice(-20).map(reading => ({
        time: new Date(reading.timestamp).toLocaleTimeString(),
        ppm: reading.ppm
      }))
    : [{ time: 'Now', ppm: selectedWell.methaneLevel }];

  // Generate forecast
  const lastReading = readings.length > 0 ? readings[readings.length - 1] : null;
  const forecastData = [];
  if (lastReading) {
    for (let i = 1; i <= 10; i++) {
      const trend = selectedWell.riskTrend === 'rising' ? 0.05 : 
                   selectedWell.riskTrend === 'falling' ? -0.05 : 0;
      forecastData.push({
        time: `+${i * 3}m`,
        ppm: Math.max(0, lastReading.ppm + trend * i),
        forecast: true
      });
    }
  }

  const combinedData = [...chartData, ...forecastData];

  return (
    <div className="w-[400px] bg-slate-950 border-l border-slate-800 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={selectedWell.status} />
            <span className="text-xs text-slate-500">WELL {selectedWell.id}</span>
          </div>
          <h2 className="text-lg font-bold text-white mb-1">{selectedWell.name}</h2>
          <p className="text-sm text-slate-400">{selectedWell.location}</p>
        </div>
        <button
          onClick={() => selectWell(null)}
          className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-900 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Methane</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {selectedWell.methaneLevel.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500">PPM {getTrendIcon(selectedWell.riskTrend)}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Integrity</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {selectedWell.integrityScore.toFixed(0)}
            </div>
            <div className="text-xs text-slate-500">Score /100</div>
          </div>
        </div>

        {/* Risk Forecast Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            30-Min Risk Forecast
          </h3>
          {combinedData && combinedData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={combinedData}>
              <defs>
                <linearGradient id="ppmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                style={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="#64748b" 
                style={{ fontSize: 10 }}
                domain={[0, 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '6px'
                }}
              />
              <Area
                type="monotone"
                dataKey="ppm"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#ppmGradient)"
                strokeDasharray={(data: any) => data.forecast ? "5 5" : "0"}
              />
            </AreaChart>
          </ResponsiveContainer>
          ) : (
            <div className="h-[150px] flex items-center justify-center text-slate-500 text-sm">
              Loading data...
            </div>
          )}
          <p className="text-xs text-slate-400 mt-2">
            Dashed line = AI prediction based on current trend
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white mb-3">Response Actions</h3>
          
          <ActionButton
            icon={<AlertTriangle className="w-4 h-4" />}
            label="START LEAK SIMULATION"
            onClick={() => startLeakSimulation(selectedWell.id)}
            variant="danger"
            disabled={simulationState.active}
            loading={simulationState.active && simulationState.wellId === selectedWell.id}
            progress={simulationState.wellId === selectedWell.id ? simulationState.progress : 0}
            pulse={!simulationState.active}
          />

          <ActionButton
            icon={<Plane className="w-4 h-4" />}
            label="Deploy Drone Inspection"
            onClick={() => {
              addToast({
                type: 'success',
                title: '🚁 Drone Dispatched',
                message: `Autonomous drone deployed to ${selectedWell.name}. ETA: 8 minutes.`
              });
            }}
            variant="secondary"
          />

          <ActionButton
            icon={<Users className="w-4 h-4" />}
            label="Send Repair Crew"
            onClick={() => {
              addToast({
                type: 'info',
                title: '👷 Crew Contacted',
                message: `Searching for available repair crews near ${selectedWell.name}...`
              });
              setTimeout(() => {
                addToast({
                  type: 'success',
                  title: '✅ Crew Assigned',
                  message: 'Repair team found. ETA: 22 minutes.'
                });
              }, 2000);
            }}
            variant="secondary"
          />

          <ActionButton
            icon={<Sparkles className="w-4 h-4" />}
            label="Mint ESG Credits"
            onClick={() => {
              const credits = 25;
              addToast({
                type: 'money',
                title: '💚 ESG Credits Minted',
                message: `${credits} carbon credits minted for ${selectedWell.name} ($${credits * 50} value)`
              });
            }}
            variant="success"
          />

          <ActionButton
            icon={<FileText className="w-4 h-4" />}
            label="Export Well Report"
            onClick={() => {
              generateWellReport(selectedWell);
              addToast({
                type: 'success',
                title: '📄 Report Generated',
                message: `Well #${selectedWell.id} report downloaded successfully`
              });
            }}
            variant="secondary"
          />
        </div>

        {/* Simulation Progress */}
        {simulationState.active && simulationState.wellId === selectedWell.id && (
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
            <p className="text-sm text-blue-300 font-medium mb-2">
              Simulation Stage: {simulationState.stage.toUpperCase()}
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${simulationState.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

function StatusBadge({ status }: { status: string }) {
  const config = {
    NORMAL: { bg: 'bg-green-500', text: 'text-white', label: 'NORMAL' },
    WARNING: { bg: 'bg-yellow-500', text: 'text-white', label: 'WARNING' },
    LEAK: { bg: 'bg-red-500', text: 'text-white', label: 'LEAK' },
    RESOLVED: { bg: 'bg-blue-500', text: 'text-white', label: 'RESOLVED' }
  };

  const { bg, text, label } = config[status as keyof typeof config] || config.NORMAL;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md ${bg} ${text} text-xs font-bold uppercase tracking-wide`}>
      {label}
    </span>
  );
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case 'rising':
      return '↗';
    case 'falling':
      return '↘';
    default:
      return '→';
  }
}


function ActionButton({ icon, label, onClick, variant, disabled, loading, progress, pulse }: any) {
  const variants = {
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all ${
        variants[variant as keyof typeof variants]
      } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${pulse ? 'animate-pulse-glow' : ''}`}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          <span>Running: {progress}%</span>
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  );
}

