import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Award, Shield } from 'lucide-react';

interface CounterProps {
  value: number;
  duration?: number;
}

function AnimatedCounter({ value, duration = 1000 }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

interface LiveMetricsOverlayProps {
  esgCredits: number;
  carbonAvoided: number;
  insuranceSavings: number;
  show: boolean;
}

export function LiveMetricsOverlay({ esgCredits, carbonAvoided, insuranceSavings, show }: LiveMetricsOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-slate-900/95 backdrop-blur-xl border-2 border-blue-500/50 rounded-2xl shadow-2xl p-8 min-w-[500px]">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-2">
            VALUE CREATED
          </h2>
          <p className="text-slate-400 text-sm">Real-time blockchain metrics</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4">
              <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                <AnimatedCounter value={esgCredits} />
              </div>
              <div className="text-xs text-green-400">ESG Credits</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-4">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                <AnimatedCounter value={carbonAvoided} />
              </div>
              <div className="text-xs text-blue-400">tCO₂e Avoided</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                $<AnimatedCounter value={insuranceSavings} />
              </div>
              <div className="text-xs text-green-400">Total Savings</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700 text-center">
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-green-400">
            ${((esgCredits * 50) + insuranceSavings).toLocaleString()}
          </div>
          <div className="text-sm text-slate-400 mt-1">Total Value Generated</div>
        </div>
      </div>
    </div>
  );
}

