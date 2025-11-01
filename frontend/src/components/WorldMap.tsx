import React, { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { Map as MapIcon, ZoomIn, ZoomOut } from 'lucide-react';

export function WorldMap() {
  const { wells, selectedWell, selectWell } = useApp();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleZoomIn = () => setZoom(prev => Math.min(3, prev + 0.2));
  const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.2));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  // Well positions relative to Houston (center)
  const wellPositions = [
    { id: 34, x: 50, y: 48, label: 'West Texas' },      // Permian Basin
    { id: 12, x: 52, y: 52, label: 'South Texas' },     // Eagle Ford
    { id: 7, x: 48, y: 47, label: 'Delaware Basin' },   // West
    { id: 56, x: 54, y: 49, label: 'East Texas' },      // Haynesville
    { id: 23, x: 49, y: 49, label: 'Midland Basin' }    // Central
  ];

  return (
    <div 
      className="relative flex-1 h-screen bg-[#2d3748] overflow-hidden"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Map Background */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* Use Stamen Toner (clean black and white) or OpenStreetMap tiles */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            url('https://stamen-tiles.a.ssl.fastly.net/toner/4/3/6.png'),
            url('https://tile.openstreetmap.org/4/3/6.png')
          `,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'invert(1) brightness(0.8) contrast(1.2)',
          opacity: imageError ? 0 : 1
        }} 
        onError={() => setImageError(true)}
        />
        
        {/* Fallback: Clean SVG Map if images fail */}
        {imageError && (
          <svg width="100%" height="100%" viewBox="0 0 1000 600" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100,116,139,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            
            {/* Background */}
            <rect width="1000" height="600" fill="#1e293b"/>
            <rect width="1000" height="600" fill="url(#grid)"/>
            
            {/* Continents - Simple but recognizable */}
            {/* North America */}
            <path d="M 50,150 Q 100,80 200,90 T 400,110 L 450,130 L 500,120 L 600,140 L 650,160 L 700,200 L 720,250 L 700,300 L 650,350 L 600,380 L 550,400 L 500,420 L 450,430 L 400,440 L 350,445 L 300,440 L 250,430 L 200,410 L 150,380 L 100,340 L 70,280 L 60,220 Z" 
              fill="#334155" stroke="#475569" strokeWidth="2"/>
            
            {/* City dots */}
            <circle cx="520" cy="290" r="3" fill="#94a3b8" />
            <text x="530" y="293" fill="#94a3b8" fontSize="10">Houston</text>
            
            <circle cx="480" cy="260" r="2" fill="#64748b" />
            <text x="485" y="263" fill="#64748b" fontSize="9">Dallas</text>
            
            <circle cx="200" cy="150" r="2" fill="#64748b" />
            <text x="205" y="153" fill="#64748b" fontSize="9">Seattle</text>
            
            <circle cx="180" cy="230" r="2" fill="#64748b" />
            <text x="185" y="233" fill="#64748b" fontSize="9">LA</text>
            
            <circle cx="530" cy="170" r="2" fill="#64748b" />
            <text x="535" y="173" fill="#64748b" fontSize="9">Chicago</text>
            
            <circle cx="670" cy="180" r="2" fill="#64748b" />
            <text x="675" y="183" fill="#64748b" fontSize="9">NYC</text>
          </svg>
        )}

        {/* HQ Marker - Houston */}
        <div
          className="absolute z-20"
          style={{
            left: '52%',
            top: '48.3%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" style={{ width: '60px', height: '60px', marginLeft: '-8px', marginTop: '-8px' }}></div>
            <div className="relative w-11 h-11 bg-white rounded-full border-3 border-slate-700 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <span className="text-slate-900 font-bold text-xs">HQ</span>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none">
              <div className="bg-slate-950/95 border border-slate-700 rounded px-2 py-1 text-xs text-white font-semibold">
                Pytheas HQ
              </div>
            </div>
          </div>
        </div>

        {/* Well Markers around Texas */}
        {wellPositions.map((pos) => {
          const well = wells.find(w => w.id === pos.id);
          if (!well) return null;

          const getStatusColor = () => {
            switch (well.status) {
              case 'LEAK': return { bg: '#ef4444', border: '#fca5a5', shadow: 'rgba(239, 68, 68, 0.6)' };
              case 'WARNING': return { bg: '#eab308', border: '#fde047', shadow: 'rgba(234, 179, 8, 0.6)' };
              case 'RESOLVED': return { bg: '#3b82f6', border: '#93c5fd', shadow: 'rgba(59, 130, 246, 0.6)' };
              default: return { bg: '#22c55e', border: '#86efac', shadow: 'rgba(34, 197, 94, 0.6)' };
            }
          };

          const colors = getStatusColor();
          const isSelected = selectedWell?.id === well.id;
          const isPulsing = well.status === 'LEAK' || well.status === 'WARNING';

          return (
            <div
              key={well.id}
              className="absolute z-20 cursor-pointer"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                selectWell(well.id);
              }}
            >
              <div className="relative">
                {isPulsing && (
                  <div 
                    className="absolute inset-0 rounded-full animate-ping" 
                    style={{
                      width: isSelected ? '44px' : '36px',
                      height: isSelected ? '44px' : '36px',
                      backgroundColor: colors.shadow,
                      marginLeft: '-6px',
                      marginTop: '-6px'
                    }}
                  />
                )}
                <div
                  className="relative rounded-full border-3 shadow-xl transition-all hover:scale-110"
                  style={{
                    width: isSelected ? '32px' : '24px',
                    height: isSelected ? '32px' : '24px',
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    borderWidth: '3px',
                    boxShadow: `0 0 ${isPulsing ? '20px' : '10px'} ${colors.shadow}`
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{well.id}</span>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none">
                    <div className="bg-slate-950/95 border border-slate-700 rounded px-2 py-1 text-xs text-white font-semibold">
                      Well #{well.id}
                    </div>
                  </div>
                )}
                
                {/* Route line to HQ when selected */}
                {isSelected && (
                  <svg className="absolute pointer-events-none" style={{ 
                    left: '-100%', 
                    top: '-100%', 
                    width: '300%', 
                    height: '300%',
                    overflow: 'visible'
                  }}>
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`${(52 - pos.x) / 3 * 100 + 50}%`}
                      y2={`${(48.3 - pos.y) / 3 * 100 + 50}%`}
                      stroke={well.status === 'LEAK' ? '#ef4444' : '#3b82f6'}
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.5"
                    />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-30 space-y-3">
        <div className="bg-slate-950/95 border border-slate-800 rounded-lg px-4 py-2 backdrop-blur-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">LOCATION</div>
          <div className="text-sm font-bold text-white">North America</div>
        </div>

        <div className="bg-slate-950/95 border border-slate-800 rounded-lg p-4 min-w-[200px] backdrop-blur-sm">
          <div className="text-xs font-bold text-white mb-3">Map Legend</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full border border-slate-700"></div>
              <span className="text-slate-400">Pytheas HQ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-400">Normal Operation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-400">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-400">Critical Leak</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <div className="w-8 h-0.5 border-t-2 border-dashed border-blue-500"></div>
              <span className="text-slate-400">Active Route</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-24 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-slate-950/95 hover:bg-slate-900 text-white p-3 rounded-lg border border-slate-800 transition-all backdrop-blur-sm"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-slate-950/95 hover:bg-slate-900 text-white p-3 rounded-lg border border-slate-800 transition-all backdrop-blur-sm"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="bg-slate-950/95 hover:bg-slate-900 text-white p-3 rounded-lg border border-slate-800 transition-all backdrop-blur-sm"
        >
          <MapIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Map Info */}
      <div className="absolute bottom-4 left-4 bg-slate-950/95 border border-slate-800 px-4 py-2 rounded-lg text-xs backdrop-blur-sm z-30">
        <div className="flex items-center gap-2">
          <MapIcon className="w-3 h-3 text-slate-400" />
          <span className="font-medium text-white">World Map</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Zoom: {Math.round(zoom * 100)}%</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">{wells.length} Wells</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <p className="text-slate-500 text-sm font-semibold">🖱️ Drag to Pan • 🔍 Scroll to Zoom</p>
      </div>
    </div>
  );
}

