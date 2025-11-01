import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Link, Zap, CheckCircle } from 'lucide-react';

export function BlockchainTransactionViewer() {
  const { blockchainEvents } = useApp();

  if (blockchainEvents.length === 0) return null;

  const recentEvents = blockchainEvents.slice(-3);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
      <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500/30 rounded-lg shadow-2xl p-3 min-w-[400px]">
        <div className="flex items-center gap-2 mb-2">
          <Link className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-blue-400 text-xs font-bold">BLOCKCHAIN LIVE</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div>
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        <div className="space-y-2">
          {recentEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-2 text-xs animate-slideInUp">
              <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
              <span className="text-white font-medium truncate">{event.details}</span>
              <Zap className="w-3 h-3 text-yellow-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

