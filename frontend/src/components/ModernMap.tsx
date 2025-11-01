import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Map as MapIcon, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export function ModernMap() {
  const { wells, selectedWell, selectWell } = useApp();
  const [zoom, setZoom] = useState(1.2);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom(prev => Math.max(0.5, Math.min(4, prev + delta)));
  };

  return (
    <div 
      className="relative flex-1 h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-purple-950/20"></div>
      </div>

      {/* Map Container */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <svg width="1600" height="900" viewBox="0 0 1600 900" className="drop-shadow-2xl">
          <defs>
            {/* Gradient for ocean */}
            <radialGradient id="oceanGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            
            {/* Glow effect for continents */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Ocean background */}
          <rect width="1600" height="900" fill="url(#oceanGradient)"/>

          {/* Grid overlay */}
          <g opacity="0.15">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2="900" stroke="#334155" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 75} x2="1600" y2={i * 75} stroke="#334155" strokeWidth="0.5" />
            ))}
          </g>

          {/* Continents - Simplified modern shapes */}
          
          {/* North America */}
          <path d="M 200,200 L 280,140 L 400,130 L 520,150 L 640,140 L 740,170 L 820,210 L 900,270 L 950,350 L 960,430 L 920,510 L 850,570 L 750,610 L 640,640 L 520,650 L 400,640 L 300,610 L 220,560 L 160,480 L 140,390 L 150,300 L 180,240 Z" 
            fill="#1e3a4f" stroke="#2563eb" strokeWidth="1.5" filter="url(#glow)" opacity="0.9"/>
          
          {/* South America */}
          <path d="M 550,680 L 600,720 L 640,780 L 650,850 L 620,900 L 550,850 L 500,780 L 480,720 L 500,680 Z" 
            fill="#1e3a4f" stroke="#2563eb" strokeWidth="1" opacity="0.7"/>
          
          {/* Europe */}
          <path d="M 900,200 L 950,180 L 1000,190 L 1040,210 L 1050,250 L 1030,290 L 990,310 L 950,300 L 910,270 L 890,230 Z" 
            fill="#1e3a4f" stroke="#2563eb" strokeWidth="1" opacity="0.7"/>
          
          {/* Africa */}
          <path d="M 920,380 L 980,360 L 1040,380 L 1080,430 L 1100,510 L 1090,600 L 1050,680 L 990,730 L 930,750 L 880,730 L 850,670 L 840,590 L 860,510 L 890,440 Z" 
            fill="#1e3a4f" stroke="#2563eb" strokeWidth="1" opacity="0.7"/>
          
          {/* Asia */}
          <path d="M 1050,150 L 1150,140 L 1250,160 L 1350,180 L 1450,200 L 1500,250 L 1520,320 L 1500,400 L 1450,460 L 1380,500 L 1300,520 L 1220,510 L 1150,480 L 1100,430 L 1070,360 L 1060,280 L 1070,220 Z" 
            fill="#1e3a4f" stroke="#2563eb" strokeWidth="1" opacity="0.7"/>

          {/* Major cities as subtle glows */}
          <g className="cities" opacity="0.8">
            {/* North America Cities */}
            <circle cx="320" cy="260" r="2" fill="#94a3b8" className="animate-pulse" style={{ animationDuration: '3s' }}/>
            <text x="328" y="263" fill="#cbd5e1" fontSize="10" fontFamily="system-ui" fontWeight="300">San Francisco</text>
            
            <circle cx="300" cy="330" r="2" fill="#94a3b8"/>
            <text x="308" y="333" fill="#cbd5e1" fontSize="10" fontFamily="system-ui" fontWeight="300">Los Angeles</text>
            
            <circle cx="520" cy="280" r="2" fill="#94a3b8"/>
            <text x="528" y="283" fill="#cbd5e1" fontSize="10" fontFamily="system-ui" fontWeight="300">Chicago</text>
            
            <circle cx="720" cy="300" r="2" fill="#94a3b8"/>
            <text x="728" y="303" fill="#cbd5e1" fontSize="10" fontFamily="system-ui" fontWeight="300">New York</text>
            
            <circle cx="620" cy="430" r="3" fill="#3b82f6" className="animate-pulse"/>
            <text x="630" y="435" fill="#60a5fa" fontSize="12" fontFamily="system-ui" fontWeight="600">Houston</text>
            
            <circle cx="570" cy="400" r="2" fill="#94a3b8"/>
            <text x="578" y="403" fill="#cbd5e1" fontSize="10" fontFamily="system-ui" fontWeight="300">Dallas</text>
            
            <circle cx="650" cy="460" r="2" fill="#94a3b8"/>
            <text x="658" y="463" fill="#cbd5e1" fontSize="10" fontFamily="system-ui" fontWeight="300">New Orleans</text>
          </g>

          {/* Texas region glow */}
          <ellipse cx="610" cy="425" rx="100" ry="70" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite"/>
          </ellipse>
        </svg>

        {/* HQ Marker - Houston */}
        <div
          className="absolute"
          style={{
            left: '38.75%',
            top: '48%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50
          }}
        >
          <div className="relative">
            <div className="absolute -inset-8 bg-blue-500/20 rounded-full blur-xl"></div>
            <div className="absolute -inset-4 bg-blue-500/30 rounded-full animate-ping"></div>
            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-4 border-blue-300 shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer">
              <span className="text-white font-bold text-sm drop-shadow-lg">HQ</span>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none">
              <div className="bg-slate-900/95 border border-blue-500/50 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                <span className="text-blue-300 text-xs font-bold">Pytheas HQ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wells around Houston */}
        {[
          { id: 34, x: 36, y: 46.5, label: 'Permian' },
          { id: 12, x: 40, y: 50, label: 'Eagle Ford' },
          { id: 7, x: 37, y: 49, label: 'Delaware' },
          { id: 56, x: 41, y: 47, label: 'Haynesville' },
          { id: 23, x: 38.5, y: 47.5, label: 'Midland' }
        ].map((pos) => {
          const well = wells.find(w => w.id === pos.id);
          if (!well) return null;

          const colors = {
            LEAK: { bg: 'from-red-500 to-red-600', border: 'border-red-300', glow: 'bg-red-500/30', text: 'text-red-300' },
            WARNING: { bg: 'from-yellow-500 to-yellow-600', border: 'border-yellow-300', glow: 'bg-yellow-500/30', text: 'text-yellow-300' },
            RESOLVED: { bg: 'from-blue-500 to-blue-600', border: 'border-blue-300', glow: 'bg-blue-500/30', text: 'text-blue-300' },
            NORMAL: { bg: 'from-green-500 to-green-600', border: 'border-green-300', glow: 'bg-green-500/30', text: 'text-green-300' }
          };

          const color = colors[well.status as keyof typeof colors] || colors.NORMAL;
          const isSelected = selectedWell?.id === well.id;
          const isPulsing = well.status === 'LEAK' || well.status === 'WARNING';

          return (
            <div
              key={well.id}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 60 : 40
              }}
              onClick={(e) => {
                e.stopPropagation();
                selectWell(well.id);
              }}
            >
              <div className="relative group">
                {/* Glow effect */}
                <div className={`absolute -inset-6 ${color.glow} rounded-full blur-lg ${isPulsing ? 'animate-pulse' : ''}`}></div>
                {isPulsing && (
                  <div className={`absolute -inset-3 ${color.glow} rounded-full animate-ping`}></div>
                )}
                
                {/* Marker */}
                <div
                  className={`relative bg-gradient-to-br ${color.bg} rounded-full border-3 ${color.border} shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-125 ${
                    isSelected ? 'w-10 h-10 ring-4 ring-white/30' : 'w-8 h-8'
                  }`}
                >
                  <span className="text-white font-bold text-sm drop-shadow-lg">{well.id}</span>
                </div>

                {/* Label on hover/select */}
                {isSelected && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none animate-fadeIn">
                    <div className={`bg-slate-900/95 border ${color.border} rounded-lg px-3 py-1.5 backdrop-blur-sm`}>
                      <span className={`${color.text} text-xs font-bold`}>{pos.label} Basin</span>
                    </div>
                  </div>
                )}
                
                {/* Connection line to HQ when selected */}
                {isSelected && (
                  <svg className="absolute pointer-events-none" style={{ 
                    left: '-400px', 
                    top: '-200px', 
                    width: '800px', 
                    height: '400px',
                    overflow: 'visible'
                  }}>
                    <defs>
                      <linearGradient id={`lineGrad${well.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={well.status === 'LEAK' ? '#ef4444' : '#3b82f6'} stopOpacity="0.8"/>
                        <stop offset="100%" stopColor={well.status === 'LEAK' ? '#ef4444' : '#3b82f6'} stopOpacity="0.2"/>
                      </linearGradient>
                    </defs>
                    <line
                      x1="400"
                      y1="200"
                      x2={400 + (38.75 - pos.x) * 25}
                      y2={200 + (48 - pos.y) * 25}
                      stroke={`url(#lineGrad${well.id})`}
                      strokeWidth="3"
                      strokeDasharray="8,4"
                    >
                      <animate attributeName="stroke-dashoffset" from="0" to="24" dur="1s" repeatCount="indefinite"/>
                    </line>
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Controls - Top Left */}
      <div className="absolute top-6 left-6 z-50 space-y-3">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-5 py-3 shadow-2xl">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Location</div>
          <div className="text-base font-bold text-white">Texas Operations</div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl min-w-[220px]">
          <div className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
            Map Legend
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-blue-300 shadow-lg"></div>
              <span className="text-slate-300 font-medium">Pytheas HQ</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-2 border-green-300"></div>
              <span className="text-slate-400">Normal</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full border-2 border-yellow-300"></div>
              <span className="text-slate-400">Warning</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-red-300"></div>
              <span className="text-slate-400">Critical</span>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded"></div>
              <span className="text-slate-400">Active Link</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Controls - Bottom Right */}
      <div className="absolute bottom-28 right-6 z-50 flex flex-col gap-2">
        <button
          onClick={() => setZoom(prev => Math.min(4, prev + 0.3))}
          className="w-12 h-12 bg-slate-900/90 backdrop-blur-xl hover:bg-slate-800 text-white rounded-xl border border-slate-700/50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev - 0.3))}
          className="w-12 h-12 bg-slate-900/90 backdrop-blur-xl hover:bg-slate-800 text-white rounded-xl border border-slate-700/50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={() => { setZoom(1.2); setPan({ x: 0, y: 0 }); }}
          className="w-12 h-12 bg-slate-900/90 backdrop-blur-xl hover:bg-slate-800 text-white rounded-xl border border-slate-700/50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Map Info - Bottom Left */}
      <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl px-4 py-3 shadow-2xl z-50">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-400">Live</span>
          </div>
          <div className="w-px h-4 bg-slate-700"></div>
          <span className="text-white font-semibold">Zoom {Math.round(zoom * 100)}%</span>
          <div className="w-px h-4 bg-slate-700"></div>
          <span className="text-slate-400">{wells.length} Wells Active</span>
        </div>
      </div>

      {/* Hint Text */}
      {!isDragging && zoom === 1.2 && pan.x === 0 && pan.y === 0 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 pointer-events-none z-10 animate-fadeIn">
          <div className="text-center">
            <p className="text-slate-600 text-sm font-medium mb-1">🖱️ Drag to explore • 🔍 Scroll to zoom</p>
            <p className="text-slate-700 text-xs">Click any well marker for details</p>
          </div>
        </div>
      )}
    </div>
  );
}

