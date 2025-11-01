import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Map as MapIcon, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { HQ_COORDINATES } from '../contexts/AppContext';

export function MapFallback() {
  const { wells, selectedWell, selectWell } = useApp();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse/touch drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle wheel zoom (trackpad/mouse wheel)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(3, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.5, prev - 0.2));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 h-screen bg-slate-900 overflow-hidden"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Zoomable/Pannable Content */}
      <div 
        className="absolute inset-0 transition-transform duration-100"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          width: '200%',
          height: '200%',
          left: '-50%',
          top: '-50%'
        }} />

        {/* Texas Outline */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 1000 600" className="opacity-50">
            <path
              d="M 200,100 L 800,100 L 800,500 L 200,500 Z"
              fill="none"
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="2"
            />
            <text x="500" y="300" textAnchor="middle" fill="rgba(148, 163, 184, 0.3)" fontSize="48" fontWeight="bold">
              TEXAS
            </text>
          </svg>
        </div>

        {/* HQ Marker */}
        <div
          className="absolute z-10"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" style={{ width: '80px', height: '80px', marginLeft: '-12px', marginTop: '-12px' }}></div>
          <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full border-4 border-white shadow-2xl flex items-center justify-center cursor-pointer">
            <span className="text-white font-bold text-sm">HQ</span>
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-semibold">
              Pytheas HQ
            </div>
          </div>
        </div>
        </div>

        {/* Well Markers - Positioned around HQ */}
        {wells.map((well, idx) => {
        const angle = (idx * 360) / wells.length;
        const radius = 200;
        const x = 50 + Math.cos((angle * Math.PI) / 180) * radius / 10;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * radius / 10;
        
        const getStatusColor = () => {
          switch (well.status) {
            case 'LEAK': return 'bg-red-500 border-red-300 shadow-red-500/50';
            case 'WARNING': return 'bg-yellow-500 border-yellow-300 shadow-yellow-500/50';
            case 'RESOLVED': return 'bg-blue-500 border-blue-300 shadow-blue-500/50';
            default: return 'bg-green-500 border-green-300 shadow-green-500/50';
          }
        };

        const isSelected = selectedWell?.id === well.id;
        const isPulsing = well.status === 'LEAK' || well.status === 'WARNING';

        return (
          <div
            key={well.id}
            className="absolute z-10 cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => selectWell(well.id)}
          >
            <div className="relative">
              {isPulsing && (
                <div className="absolute inset-0 animate-ping rounded-full" style={{
                  width: isSelected ? '48px' : '36px',
                  height: isSelected ? '48px' : '36px',
                  backgroundColor: well.status === 'LEAK' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(234, 179, 8, 0.5)',
                  marginLeft: '-6px',
                  marginTop: '-6px'
                }}></div>
              )}
              <div
                className={`relative rounded-full border-4 shadow-xl transition-all ${getStatusColor()} ${
                  isSelected ? 'w-9 h-9' : 'w-7 h-7'
                } flex items-center justify-center hover:scale-110`}
              >
                <span className="text-white font-bold text-xs">{well.id}</span>
              </div>
              {isSelected && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-semibold">
                    Well #{well.id}
                  </div>
                </div>
              )}
            </div>

            {/* Route line to HQ if selected */}
            {isSelected && (
              <svg className="absolute" style={{ left: '-50%', top: '-50%', width: '200%', height: '200%', pointerEvents: 'none' }}>
                <line
                  x1="50%"
                  y1="50%"
                  x2="100%"
                  y2="100%"
                  stroke={well.status === 'LEAK' ? '#ef4444' : '#3b82f6'}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
              </svg>
            )}
          </div>
        );
        })}
      </div>

      {/* Map Controls - Top Left */}
      <div className="absolute top-4 left-4 z-30 space-y-3">
        {/* Location Badge */}
        <div className="bg-slate-950/95 border border-slate-800 rounded-lg px-4 py-2 backdrop-blur-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">LOCATION</div>
          <div className="text-sm font-bold text-white">Texas Operations</div>
        </div>

        {/* Map Legend */}
        <div className="bg-slate-950/95 border border-slate-800 rounded-lg p-4 min-w-[200px] backdrop-blur-sm">
          <div className="text-xs font-bold text-white mb-3">Map Legend</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-blue-300"></div>
              <span className="text-slate-400">Pytheas HQ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-400">Normal Operation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-400">Warning Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-400">Critical Leak</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <div className="w-8 h-0.5 border-t-2 border-dashed border-blue-500"></div>
              <span className="text-slate-400">Active Route</span>
            </div>
            <div className="pt-2 border-t border-slate-800 text-green-400 text-xs">
              ✓ {wells.length} wells monitored
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-24 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-slate-950/95 hover:bg-slate-900 text-white p-3 rounded-lg border border-slate-800 transition-all backdrop-blur-sm"
          title="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-slate-950/95 hover:bg-slate-900 text-white p-3 rounded-lg border border-slate-800 transition-all backdrop-blur-sm"
          title="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="bg-slate-950/95 hover:bg-slate-900 text-white p-3 rounded-lg border border-slate-800 transition-all backdrop-blur-sm"
          title="Reset view"
        >
          <MapIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Map Info */}
      <div className="absolute bottom-4 left-4 bg-slate-950/95 border border-slate-800 px-4 py-2 rounded-lg text-xs text-slate-400 backdrop-blur-sm z-30">
        <div className="flex items-center gap-2">
          <MapIcon className="w-3 h-3" />
          <span className="font-medium text-white">Interactive View</span>
          <span className="text-slate-600">•</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span className="text-slate-600">•</span>
          <span>{wells.length} Wells</span>
        </div>
      </div>

      {/* Instructions Overlay */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-5 opacity-30">
        <div className="text-center text-slate-600">
          <p className="text-sm font-semibold mb-1">🖱️ Drag to Pan • 🔍 Scroll to Zoom</p>
          <p className="text-xs">Click markers to view details</p>
        </div>
      </div>
    </div>
  );
}

