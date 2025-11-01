import React, { useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Radio, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const AlertFeed = React.memo(function AlertFeed() {
  const { messages } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive - DEBOUNCED
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages.length]); // Only when message count changes

  return (
    <div className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col h-screen">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-base font-bold text-white">Agent Communications</h2>
        <p className="text-xs text-slate-500 mt-1">Powered by Edge + Master Agents</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 flex items-center gap-2">
          <span className="text-sm text-slate-500 flex-1">System active...</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
});

const MessageItem = React.memo(function MessageItem({ message }: { message: any }) {
  const isAgent = message.agent === 'edge' || message.agent === 'master';
  
  const getAgentLabel = () => {
    switch (message.agent) {
      case 'edge':
        return 'Edge Agent';
      case 'master':
        return 'Master Agent';
      case 'system':
        return 'System';
      default:
        return 'Agent';
    }
  };

  const getTypeColor = () => {
    switch (message.type) {
      case 'alert':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className={`${isAgent ? 'mr-8' : 'ml-8'}`}>
      <div className={`rounded-xl px-4 py-3 ${isAgent ? 'bg-slate-900 border border-slate-800' : 'bg-blue-600'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-semibold ${isAgent ? 'text-slate-400' : 'text-blue-200'}`}>
            {getAgentLabel()}
          </span>
          <span className={`text-[10px] ${isAgent ? 'text-slate-600' : 'text-blue-200'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className={`text-sm leading-relaxed ${isAgent ? getTypeColor() : 'text-white'}`}>
          {message.message}
        </p>
      </div>
    </div>
  );
});
