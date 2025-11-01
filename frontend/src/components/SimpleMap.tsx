import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Map as MapIcon, ZoomIn, ZoomOut } from 'lucide-react';

export function SimpleMap() {
  const { wells, selectedWell, selectWell } = useApp();
  const [zoom, setZoom] = useState(1);
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
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  return (
    <div 
      className="relative flex-1 h-screen bg-[#2d3442] overflow-hidden"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Main Map Content */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s'
        }}
      >
        <svg width="1400" height="900" viewBox="0 0 1400 900" style={{ maxWidth: 'none' }}>
          {/* Grid background */}
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)"/>
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#475569" strokeWidth="1"/>
            </pattern>
          </defs>
          
          <rect width="1400" height="900" fill="#1e293b"/>
          <rect width="1400" height="900" fill="url(#grid)" opacity="0.3"/>
          
          {/* North America - Clean shape */}
          <path d="M 200,200 L 250,150 L 350,140 L 450,160 L 550,150 L 650,170 L 750,190 L 850,230 L 950,280 L 1000,350 L 980,450 L 920,520 L 850,570 L 750,600 L 650,620 L 550,640 L 450,650 L 350,640 L 250,610 L 180,550 L 140,470 L 130,380 L 150,290 Z" 
            fill="#3f4b5a" stroke="#576574" strokeWidth="2" opacity="0.9"/>
          
          {/* USA mainland detailed */}
          <path d="M 250,320 L 350,310 L 450,320 L 550,330 L 650,350 L 750,380 L 850,420 L 900,470 L 880,530 L 820,560 L 750,570 L 650,580 L 550,590 L 450,595 L 350,585 L 280,560 L 230,520 L 200,470 L 190,420 L 200,370 Z" 
            fill="#4a5568" stroke="#64748b" strokeWidth="1.5"/>
          
          {/* Texas highlighted region */}
          <ellipse cx="620" cy="520" rx="120" ry="80" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="8,4" opacity="0.4"/>
          
          {/* Major cities */}
          <g className="cities" fill="#9ca3af" fontSize="11" fontFamily="system-ui">
            <text x="620" y="525" fontWeight="bold" fontSize="12">Houston</text>
            <text x="570" y="485">Dallas</text>
            <text x="590" y="550">San Antonio</text>
            <text x="720" y="515">New Orleans</text>
            <text x="300" y="370">San Francisco</text>
            <text x="310" y="440">Los Angeles</text>
            <text x="450" y="360">Denver</text>
            <text x="650" y="340">Chicago</text>
            <text x="870" y="350">New York</text>
            <text x="920" y="320">Boston</text>
            <text x="800" y="430">Atlanta</text>
            <text x="350" y="285">Seattle</text>
          </g>
          
          {/* State borders (subtle) */}
          <line x1="550" y1="400" x2="550" y2="550" stroke="#64748b" strokeWidth="0.5" opacity="0.2" strokeDasharray="3,3"/>
          <line x1="650" y1="400" x2="650" y2="550" stroke="#64748b" strokeWidth="0.5" opacity="0.2" strokeDasharray="3,3"/>
          <line x1="450" y1="400" x2="450" y2="550" stroke="#64748b" strokeWidth="0.5" opacity="0.2" strokeDasharray="3,3"/>
        </svg>

        {/* HQ Marker - Houston */}
        <div
          className="absolute"
          style={{
            left: '620px',
            top: '520px',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-white/10 rounded-full animate-ping"></div>
            <div className="relative w-12 h-12 bg-white rounded-full border-4 border-slate-700 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
              <span className="text-slate-900 font-bold">HQ</span>
            </div>
          </div>
        </div>

        {/* Wells around Houston */}
        {[
          { id: 34, x: 580, y: 500 },
          { id: 12, x: 640, y: 540 },
          { id: 7, x: 590, y: 530 },
          { id: 56, x: 650, y: 510 },
          { id: 23, x: 615, y: 505 }
        ].map((pos) => {
          const well = wells.find(w => w.id === pos.id);
          if (!well) return null;

          const colors = {
            LEAK: { bg: '#ef4444', border: '#fca5a5' },
            WARNING: { bg: '#eab308', border: '#fde047' },
            RESOLVED: { bg: '#3b82f6', border: '#93c5fd' },
            NORMAL: { bg: '#22c55e', border: '#86efac' }
          };

          const color = colors[well.status as keyof typeof colors] || colors.NORMAL;
          const isSelected = selectedWell?.id === well.id;
          const isPulsing = well.status === 'LEAK' || well.status === 'WARNING';

          return (
            <div
              key={well.id}
              className="absolute cursor-pointer"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 30 : 25
              }}
              onClick={(e) => {
                e.stopPropagation();
                selectWell(well.id);
              }}
            >
              {isPulsing && (
                <div className="absolute -inset-2 rounded-full animate-ping" style={{ backgroundColor: color.bg, opacity: 0.5 }}></div>
              )}
              <div
                className="relative rounded-full border-3 shadow-lg hover:scale-125 transition-all"
                style={{
                  width: isSelected ? '28px' : '22px',
                  height: isSelected ? '28px' : '22px',
                  backgroundColor: color.bg,
                  borderColor: color.border,
                  borderWidth: '3px'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{well.id}</span>
                </div>
              </div>
              
              {/* Route to HQ */}
              {isSelected && (
                <svg className="absolute pointer-events-none" style={{ left: '-300px', top: '-100px', width: '600px', height: '200px' }}>
                  <line
                    x1={pos.x - pos.x + 300}
                    y1={pos.y - pos.y + 100}
                    x2={620 - pos.x + 300}
                    y2={520 - pos.y + 100}
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

      {/* Controls */}
      <div className="absolute top-4 left-4 z-40 space-y-3">
        <div className="bg-slate-950/95 border border-slate-800 rounded-lg px-4 py-2 backdrop-blur">
          <div className="text-xs text-slate-500 uppercase">Location</div>
          <div className="text-sm font-bold text-white">North America - Texas</div>
        </div>

        <div className="bg-slate-950/95 border border-slate-800 rounded-lg p-4 min-w-[200px] backdrop-blur">
          <div className="text-xs font-bold text-white mb-3">Map Legend</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-slate-400">Pytheas HQ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-400">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-400">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-400">Leak</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 right-4 z-40 flex flex-col gap-2">
        <button onClick={() => setZoom(prev => Math.min(3, prev + 0.2))} className="bg-slate-950/95 hover:bg-slate-900 text-white p-3 rounded-lg border border-slate-800 backdrop-blur">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))} className="bg-slate-950/95 hover:bg-slate-900 text-white p-3 rounded-lg border border-slate-800 backdrop-blur">
          <ZoomOut className="w-5 h-5" />
        </button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="bg-slate-950/95 hover:bg-slate-900 text-white p-3 rounded-lg border border-slate-800 backdrop-blur">
          <MapIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 bg-slate-950/95 border border-slate-800 px-4 py-2 rounded-lg text-xs backdrop-blur z-40">
        <MapIcon className="w-3 h-3 inline mr-2 text-slate-400" />
        <span className="text-white font-semibold">Zoom: {Math.round(zoom * 100)}%</span>
        <span className="text-slate-600 mx-2">•</span>
        <span className="text-slate-400">{wells.length} Wells</span>
      </div>
    </div>
  );
}

