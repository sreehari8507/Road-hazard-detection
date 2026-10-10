import React, { useState } from 'react';
import { MapPin, AlertCircle, Info, Navigation, ShieldAlert, Crosshair, Filter } from 'lucide-react';
import { RiskBadge } from '../advisory/RiskBadge';

export interface MapMarker {
  id: string;
  type: 'pothole' | 'waterlogging' | 'fallen_tree' | 'debris';
  name: string;
  location: string;
  coordinates: string;
  riskScore: number;
  severity: string;
  advisorySpeed: number;
  x: number; // percentage on map
  y: number; // percentage on map
}

const CHENNAI_DEMO_MARKERS: MapMarker[] = [
  {
    id: 'MK-1',
    type: 'pothole',
    name: 'OMR Deep Pothole Crater',
    location: 'OMR IT Corridor (Near Kandanchavadi)',
    coordinates: '12.9654° N, 80.2458° E',
    riskScore: 87,
    severity: 'HIGH',
    advisorySpeed: 30,
    x: 68,
    y: 72
  },
  {
    id: 'MK-2',
    type: 'waterlogging',
    name: 'Marina Coastal Ponding',
    location: 'Marina Beach Road (Kamarajar Salai)',
    coordinates: '13.0489° N, 80.2825° E',
    riskScore: 78,
    severity: 'HIGH',
    advisorySpeed: 25,
    x: 82,
    y: 38
  },
  {
    id: 'MK-3',
    type: 'fallen_tree',
    name: 'Fallen Banyan Tree Blockage',
    location: 'Anna Nagar 2nd Avenue',
    coordinates: '13.0827° N, 80.2107° E',
    riskScore: 96,
    severity: 'CRITICAL',
    advisorySpeed: 0,
    x: 32,
    y: 22
  },
  {
    id: 'MK-4',
    type: 'debris',
    name: 'Scattered Metal Shipping Box',
    location: 'Airport Demo Route (GST Overpass)',
    coordinates: '12.9856° N, 80.1982° E',
    riskScore: 58,
    severity: 'MODERATE',
    advisorySpeed: 40,
    x: 28,
    y: 65
  },
  {
    id: 'MK-5',
    type: 'pothole',
    name: 'Guindy Junction Aggregate Loss',
    location: 'Guindy Industrial Estate Link',
    coordinates: '13.0067° N, 80.2206° E',
    riskScore: 46,
    severity: 'MODERATE',
    advisorySpeed: 45,
    x: 48,
    y: 52
  }
];

export const InteractiveVectorMap: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(CHENNAI_DEMO_MARKERS[0]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredMarkers = CHENNAI_DEMO_MARKERS.filter(m => {
    if (activeFilter === 'all') return true;
    return m.type === activeFilter;
  });

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#060911] shadow-2xl flex flex-col select-none">
      
      {/* MAP HEADER / FILTERS */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-10">
        <div>
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            CHENNAI DEMO ZONE • INFRASTRUCTURE HAZARD MAP
          </h3>
          <p className="text-[11px] font-mono text-slate-400">
            Simulated high-precision GPS telematics &amp; hazard distribution grid
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'pothole', 'waterlogging', 'fallen_tree', 'debris'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono capitalize transition-all ${
                activeFilter === f
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* MAP CANVAS (Interactive SVG Representation) */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/8] bg-[#070B14] overflow-hidden">
        
        {/* Background Grid & Contour Map Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-35" preserveAspectRatio="none">
          <defs>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 229, 255, 0.12)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
          
          {/* Simulated Coastline (Bay of Bengal / Marina) */}
          <path
            d="M 850,-50 Q 820,200 880,500"
            fill="none"
            stroke="rgba(0, 229, 255, 0.4)"
            strokeWidth="3"
            strokeDasharray="8,4"
          />
          <text x="90%" y="30%" fill="rgba(0, 229, 255, 0.3)" fontSize="12" fontFamily="monospace" transform="rotate(80 90% 30%)">
            BAY OF BENGAL (COASTAL REACH)
          </text>

          {/* Primary Highway Arterials */}
          <path d="M 50,450 Q 300,320 700,550" fill="none" stroke="#334155" strokeWidth="10" />
          <path d="M 50,450 Q 300,320 700,550" fill="none" stroke="#00E5FF" strokeWidth="2" strokeDasharray="10,10" opacity="0.6" />
          
          {/* Mount Road / GST Road Corridor */}
          <path d="M 150,550 Q 400,280 800,100" fill="none" stroke="#334155" strokeWidth="8" />
          <path d="M 150,550 Q 400,280 800,100" fill="none" stroke="#94A3B8" strokeWidth="1.5" opacity="0.5" />

          {/* OMR IT Expressway Corridor */}
          <path d="M 550,220 L 720,550" fill="none" stroke="#334155" strokeWidth="8" />
          <path d="M 550,220 L 720,550" fill="none" stroke="#38BDF8" strokeWidth="2" opacity="0.7" />

          {/* Inner Ring Road */}
          <circle cx="45%" cy="40%" r="180" fill="none" stroke="#1E293B" strokeWidth="6" />
        </svg>

        {/* HAZARD PINS */}
        {filteredMarkers.map(m => {
          const isSelected = selectedMarker?.id === m.id;
          const isCritical = m.severity === 'CRITICAL';
          const isHigh = m.severity === 'HIGH';

          return (
            <div
              key={m.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              onClick={() => setSelectedMarker(m)}
            >
              {/* Pulse Waves */}
              <span className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${
                isCritical ? 'bg-red-500' : isHigh ? 'bg-orange-500' : 'bg-cyan-500'
              }`} />

              {/* Pin Base */}
              <div className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-125 ${
                isSelected 
                  ? 'bg-white border-cyan-400 scale-125 shadow-[0_0_20px_#00E5FF]'
                  : isCritical
                  ? 'bg-red-600 border-red-300 text-white'
                  : isHigh
                  ? 'bg-orange-600 border-orange-300 text-white'
                  : 'bg-slate-900 border-cyan-400 text-cyan-400'
              }`}>
                <AlertCircle className="w-4 h-4" />
              </div>

              {/* Label tooltip */}
              <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-black/90 border border-slate-700 text-[10px] font-mono text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                {m.name}
              </div>
            </div>
          );
        })}

        {/* SELECTED MARKER TELEMETRY POPUP */}
        {selectedMarker && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-30 hud-panel-cyan p-4 rounded-xl shadow-2xl border border-cyan-500/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                  {selectedMarker.type.replace('_', ' ')} • TELEMETRY SNAPSHOT
                </span>
                <h4 className="text-base font-bold text-white font-display">
                  {selectedMarker.name}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedMarker.location}
                </p>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {selectedMarker.coordinates}
                </p>
              </div>

              <RiskBadge score={selectedMarker.riskScore} severity={selectedMarker.severity} size="sm" />
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Recommended Speed:</span>
              <span className={`font-bold ${selectedMarker.advisorySpeed === 0 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
                {selectedMarker.advisorySpeed === 0 ? 'STOP / DO NOT PROCEED' : `${selectedMarker.advisorySpeed} km/h`}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
