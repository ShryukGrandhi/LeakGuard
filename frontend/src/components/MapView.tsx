import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useApp } from '../contexts/AppContext';
import { HQ_COORDINATES } from '../contexts/AppContext';
import { Map as MapIcon, Layers, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

// Using Mapbox demo token - works for development
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg';

try {
  mapboxgl.accessToken = MAPBOX_TOKEN;
  console.log('Mapbox token set successfully');
} catch (e) {
  console.error('Failed to set Mapbox token:', e);
}

// Map styles similar to Google Maps
const MAP_STYLES = [
  { id: 'streets', name: 'Streets', url: 'mapbox://styles/mapbox/streets-v12' },
  { id: 'satellite', name: 'Satellite', url: 'mapbox://styles/mapbox/satellite-streets-v12' },
  { id: 'dark', name: 'Dark', url: 'mapbox://styles/mapbox/dark-v11' },
  { id: 'light', name: 'Light', url: 'mapbox://styles/mapbox/light-v11' },
];

export function MapView() {
  const { wells, selectedWell, selectWell, simulationState } = useApp();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Map<number, mapboxgl.Marker>>(new Map());
  const hqMarker = useRef<mapboxgl.Marker | null>(null);
  const routeLine = useRef<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState('streets');
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('Initializing map...', { mapContainer: mapContainer.current, token: mapboxgl.accessToken });

    try {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: HQ_COORDINATES,
      zoom: 5.5,
      pitch: 0,
      attributionControl: false,
      interactive: true
    });

      map.current.on('load', () => {
        console.log('Map loaded successfully!');
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError(e.error?.message || 'Map failed to load');
      });
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    // Add HQ marker (Google Maps style with shadow)
    const hqEl = document.createElement('div');
    hqEl.className = 'hq-marker';
    hqEl.innerHTML = `
      <div style="
        position: relative;
        width: 56px;
        height: 56px;
        cursor: pointer;
      ">
        <!-- Outer glow -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 72px;
          height: 72px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse-glow 3s ease-in-out infinite;
        "></div>
        <!-- Main marker -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          border: 4px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.4);
        ">
          <span style="
            color: white; 
            font-size: 18px; 
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">HQ</span>
        </div>
      </div>
    `;

    hqMarker.current = new mapboxgl.Marker({ element: hqEl })
      .setLngLat(HQ_COORDINATES)
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add scale control (like Google Maps)
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
    
    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Enable drag rotate and pitch
    map.current.dragRotate.enable();
    map.current.touchZoomRotate.enable();

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update well markers
  useEffect(() => {
    if (!map.current) return;

    wells.forEach(well => {
      let marker = markers.current.get(well.id);

      if (!marker) {
        // Create new marker
        const el = document.createElement('div');
        el.className = 'well-marker';
        el.addEventListener('click', () => selectWell(well.id));
        
        marker = new mapboxgl.Marker({ element: el })
          .setLngLat(well.coordinates)
          .addTo(map.current!);
        
        markers.current.set(well.id, marker);
      }

      // Update marker appearance (Google Maps style pin)
      const el = marker.getElement();
      const isPulsing = well.status === 'LEAK' || well.status === 'WARNING';
      const isSelected = selectedWell?.id === well.id;
      const pinSize = isSelected ? 40 : 32;
      const pinHeight = isSelected ? 56 : 48;

      el.innerHTML = `
        <div style="
          position: relative;
          width: ${pinSize}px;
          height: ${pinHeight}px;
          cursor: pointer;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
          animation: ${isPulsing ? 'pulse 2s infinite' : 'none'};
        ">
          <!-- Pin body -->
          <div style="
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: ${pinSize}px;
            height: ${pinSize}px;
            background: ${getStatusColor(well.status)};
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: translateX(-50%) rotate(-45deg);
            box-shadow: 0 0 ${isPulsing ? '15px' : '8px'} ${getStatusGlow(well.status)};
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(45deg);
              color: white;
              font-size: ${isSelected ? '14px' : '11px'};
              font-weight: bold;
              text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            ">${well.id}</div>
          </div>
        </div>
      `;
    });

    // Add routing line if well is selected
    if (selectedWell && map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }

    if (selectedWell) {
      const routeGeoJSON = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: [HQ_COORDINATES, selectedWell.coordinates]
        }
      };

      if (!map.current.getSource('route')) {
        map.current.addSource('route', {
          type: 'geojson',
          data: routeGeoJSON as any
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': selectedWell.status === 'LEAK' ? '#ef4444' : '#3b82f6',
            'line-width': 2,
            'line-dasharray': [2, 2]
          }
        });
      } else {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData(routeGeoJSON as any);
      }
    }
  }, [wells, selectedWell]);

  // Change map style
  const changeMapStyle = (styleId: string) => {
    if (!map.current) return;
    const style = MAP_STYLES.find(s => s.id === styleId);
    if (style) {
      map.current.setStyle(style.url);
      setCurrentStyle(styleId);
      setShowStyleSelector(false);
    }
  };

  // Zoom controls
  const zoomIn = () => {
    if (map.current) {
      map.current.zoomIn({ duration: 300 });
    }
  };

  const zoomOut = () => {
    if (map.current) {
      map.current.zoomOut({ duration: 300 });
    }
  };

  const resetView = () => {
    if (map.current) {
      map.current.flyTo({
        center: HQ_COORDINATES,
        zoom: 5.5,
        pitch: 0,
        bearing: 0,
        duration: 1500
      });
    }
  };

  return (
    <div className="relative flex-1 h-screen bg-slate-900">
      {/* Map Loading Indicator */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-white font-semibold">Loading Map...</p>
            <p className="text-slate-500 text-sm mt-2">Connecting to Mapbox</p>
          </div>
        </div>
      )}

      {/* Map Error */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-900">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-white font-bold text-lg mb-2">Map Failed to Load</p>
            <p className="text-slate-400 text-sm mb-4">{mapError}</p>
            <p className="text-slate-500 text-xs">
              Note: Map visualization requires internet connection.
              Demo will continue to work with simulated map.
            </p>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="absolute inset-0 w-full h-full" style={{ minHeight: '100%' }} />
      
      {/* Map Controls - Top Left */}
      <div className="absolute top-4 left-4 z-10 space-y-3">
        {/* Location Badge */}
        <div className="bg-slate-950/95 border border-slate-800 rounded-lg px-4 py-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">LOCATION</div>
          <div className="text-sm font-bold text-white">Texas Operations</div>
        </div>

        {/* Map Legend */}
        <div className="bg-slate-950/95 border border-slate-800 rounded-lg p-4 min-w-[200px]">
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
          </div>
        </div>

        {/* Style Selector */}
        <div className="relative">
          <button
            onClick={() => setShowStyleSelector(!showStyleSelector)}
            className="flex items-center gap-2 bg-slate-950/95 hover:bg-slate-900 text-white px-4 py-2 rounded-lg border border-slate-800 font-medium transition-all text-sm"
          >
            <Layers className="w-4 h-4" />
            <span>Map Style</span>
          </button>

          {showStyleSelector && (
            <div className="absolute top-12 left-0 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden min-w-[160px]">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => changeMapStyle(style.id)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-900 transition-colors ${
                    currentStyle === style.id 
                      ? 'bg-blue-600 text-white font-semibold' 
                      : 'text-slate-300'
                  }`}
                >
                  {style.name}
                  {currentStyle === style.id && (
                    <span className="ml-2">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Zoom Controls */}
      <div className="absolute bottom-24 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="bg-slate-950/95 hover:bg-slate-900 text-white p-3 rounded-lg border border-slate-800 transition-all"
          title="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={zoomOut}
          className="bg-slate-950/95 hover:bg-slate-900 text-white p-3 rounded-lg border border-slate-800 transition-all"
          title="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={resetView}
          className="bg-slate-950/95 hover:bg-slate-900 text-white p-3 rounded-lg border border-slate-800 transition-all"
          title="Reset view to HQ"
        >
          <MapIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Map Info Overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-950/95 border border-slate-800 px-4 py-2 rounded-lg text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <MapIcon className="w-3 h-3" />
          <span className="font-medium text-white">
            {MAP_STYLES.find(s => s.id === currentStyle)?.name || 'Streets'}
          </span>
          <span className="text-slate-600">•</span>
          <span>{wells.length} Wells</span>
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        
        /* Hide Mapbox branding */
        .mapboxgl-ctrl-logo {
          display: none !important;
        }
        .mapboxgl-ctrl-attrib-button {
          display: none !important;
        }
        .mapboxgl-ctrl-attrib {
          display: none !important;
        }
        
        /* Mapbox control styling (Google Maps-like) */
        .mapboxgl-ctrl-group {
          background: white !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
          border: 1px solid rgba(0,0,0,0.1) !important;
        }
        
        .mapboxgl-ctrl-group button {
          width: 32px !important;
          height: 32px !important;
        }
        
        .mapboxgl-ctrl-group button + button {
          border-top: 1px solid rgba(0,0,0,0.1) !important;
        }
        
        .mapboxgl-ctrl-scale {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(0,0,0,0.1) !important;
          border-radius: 4px !important;
          padding: 4px 8px !important;
          font-size: 11px !important;
        }
      `}</style>
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'LEAK':
      return '#ef4444';
    case 'WARNING':
      return '#eab308';
    case 'RESOLVED':
      return '#10b981';
    default:
      return '#22c55e';
  }
}

function getStatusBorderColor(status: string): string {
  switch (status) {
    case 'LEAK':
      return '#fca5a5';
    case 'WARNING':
      return '#fde047';
    case 'RESOLVED':
      return '#6ee7b7';
    default:
      return '#86efac';
  }
}

function getStatusGlow(status: string): string {
  switch (status) {
    case 'LEAK':
      return 'rgba(239, 68, 68, 0.6)';
    case 'WARNING':
      return 'rgba(234, 179, 8, 0.6)';
    case 'RESOLVED':
      return 'rgba(16, 185, 129, 0.6)';
    default:
      return 'rgba(34, 197, 94, 0.3)';
  }
}

