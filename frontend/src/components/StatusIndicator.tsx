import React from 'react';
import { Activity } from 'lucide-react';

export function StatusIndicator({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="fixed top-4 right-1/2 transform translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-red-900/90 backdrop-blur-md border-2 border-red-500 rounded-full px-6 py-3 shadow-2xl shadow-red-500/50 animate-pulse">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-white animate-pulse" />
          <span className="text-white font-bold text-lg">🚨 ACTIVE INCIDENT IN PROGRESS</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

