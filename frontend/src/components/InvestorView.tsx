import React from 'react';
import { useApp } from '../contexts/AppContext';
import { DollarSign, TrendingUp, Shield, Calendar, Award, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateESGReport } from '../utils/pdfExport';

export function InvestorView() {
  const { esgMetrics, wells, addToast } = useApp();

  const insuranceSavingsData = [
    { month: 'Jan', savings: 15000 },
    { month: 'Feb', savings: 22000 },
    { month: 'Mar', savings: 18000 },
    { month: 'Apr', savings: 28000 },
    { month: 'May', savings: 35000 },
    { month: 'Jun', savings: esgMetrics.insuranceSavings }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 70, color: '#22c55e' },
    { name: 'Medium Risk', value: 25, color: '#eab308' },
    { name: 'High Risk', value: 5, color: '#ef4444' }
  ];

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Investor Analytics
        </h2>
        <p className="text-sm text-slate-400 mt-1">ESG & Financial Performance</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Key Quote */}
        <div className="bg-gradient-to-br from-blue-900/30 to-green-900/30 rounded-lg p-4 border border-blue-700/50">
          <p className="text-sm text-blue-200 font-medium italic leading-relaxed">
            "Every avoided leak = Verified ESG credits + lower risk financing."
          </p>
        </div>

        {/* Primary Metrics */}
        <div className="space-y-3">
          <InvestorMetric
            icon={<Award className="w-5 h-5 text-green-400" />}
            label="ESG Credits Earned"
            value={esgMetrics.creditsEarned.toLocaleString()}
            unit="credits"
            subtext={`$${(esgMetrics.creditsEarned * 50).toLocaleString()} market value @ $50/credit`}
            color="green"
          />

          <InvestorMetric
            icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
            label="Carbon Avoided"
            value={esgMetrics.carbonAvoided.toLocaleString()}
            unit="tCO₂e"
            subtext="Verified emissions prevention"
            color="blue"
          />

          <InvestorMetric
            icon={<DollarSign className="w-5 h-5 text-green-400" />}
            label="Insurance Savings"
            value={`$${esgMetrics.insuranceSavings.toLocaleString()}`}
            unit="USD"
            subtext="Year-to-date cost reduction"
            color="green"
          />

          <InvestorMetric
            icon={<Calendar className="w-5 h-5 text-blue-400" />}
            label="Payback Period"
            value={esgMetrics.paybackPeriod.toString()}
            unit="months"
            subtext="System ROI timeline"
            color="blue"
          />
        </div>

        {/* Insurance Savings Chart */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            Monthly Insurance Savings
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={insuranceSavingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" style={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '6px'
                }}
                formatter={(value: any) => `$${value.toLocaleString()}`}
              />
              <Bar dataKey="savings" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Score Improvement */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            Risk Score Improvement
          </h3>
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Current Improvement</span>
              <span className="text-lg font-bold text-green-400">
                +{esgMetrics.riskScoreImprovement.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, esgMetrics.riskScoreImprovement * 2)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Lower risk = Better financing terms
            </p>
          </div>
        </div>

        {/* Well Risk Distribution */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-white mb-3">Well Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-around mt-2">
            {riskDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-slate-400">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <button 
          onClick={() => {
            generateESGReport(esgMetrics, wells);
            addToast({
              type: 'success',
              title: '📄 ESG Report Generated',
              message: 'Comprehensive audit report downloaded successfully'
            });
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/20"
        >
          <FileText className="w-4 h-4" />
          Export ESG Report
        </button>

        {/* Bottom Pitch */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <p className="text-xs text-slate-300 text-center leading-relaxed">
            <strong className="text-blue-400">Pytheas AI restores production.</strong>
            <br />
            <strong className="text-green-400">LeakGuard-AI protects it.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function InvestorMetric({ icon, label, value, unit, subtext, color }: any) {
  const colorClasses = {
    green: 'border-green-700/50 bg-green-900/20',
    blue: 'border-blue-700/50 bg-blue-900/20'
  };

  return (
    <div className={`rounded-lg p-4 border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            {icon}
            <span className="text-xs font-medium">{label}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{value}</span>
            <span className="text-sm text-slate-400">{unit}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{subtext}</p>
        </div>
      </div>
    </div>
  );
}

