import React, { useState } from 'react';
import { GoogleHazardMap, HazardItem } from './GoogleHazardMap';
import { Camera, Map as MapIcon, Columns, ShieldAlert, Navigation, Compass, AlertTriangle, Eye } from 'lucide-react';

interface LiveFeedSplitViewProps {
  initialViewMode?: 'split' | 'camera' | 'map';
}

export const LiveFeedSplitView: React.FC<LiveFeedSplitViewProps> = ({
  initialViewMode = 'split'
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'camera' | 'map'>(initialViewMode);
  const [activeHazard, setActiveHazard] = useState<HazardItem | null>(null);
  const [telemetry, setTelemetry] = useState<{ lat: number; lng: number; speed: number; heading: number }>({
    lat: 12.9654,
    lng: 80.2458,
    speed: 62,
    heading: 180
  });

  // Pick current camera sample based on active hazard or default to clear road
  const cameraSampleImage = activeHazard ? activeHazard.image : '/samples/clear.jpg';

  return (
    <div className="w-full space-y-4">
      
      {/* CLEAN TOP MODE BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl backdrop-blur-md">
        
        {/* Left: Telematics Quick Glance */}
        <div className="flex items-center gap-4 text-xs px-2">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-cyan-300 font-bold">{telemetry.speed} km/h</span>
          </div>
          <div className="h-3 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] hidden sm:flex">
            <span>GPS:</span>
            <span className="text-slate-200">{telemetry.lat.toFixed(4)}°N, {telemetry.lng.toFixed(4)}°E</span>
          </div>
          <div className="h-3 w-px bg-slate-700 hidden md:block" />
          <div className="text-[11px] font-mono text-slate-400 hidden md:block">
            Heading: <strong className="text-slate-200">{telemetry.heading}°</strong>
          </div>
        </div>

        {/* Right: View Mode Toggle Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'split'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split Screen</span>
          </button>

          <button
            onClick={() => setViewMode('camera')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'camera'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Camera Only</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'map'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Map Only</span>
          </button>
        </div>

      </div>

      {/* MAIN VIEW CONTENT CONTAINER */}
      <div className={`grid gap-4 ${
        viewMode === 'split' 
          ? 'grid-cols-1 lg:grid-cols-2' 
          : 'grid-cols-1'
      }`}>
        
        {/* FORWARD ADAS CAMERA FEED */}
        {(viewMode === 'split' || viewMode === 'camera') && (
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl flex flex-col">
            
            {/* Camera Header Banner */}
            <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="font-semibold text-white tracking-wide">
                  Forward ADAS Camera (1080P@60FPS)
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">
                ACTIVE AI INFERENCE
              </span>
            </div>

            {/* Video Canvas Container */}
            <div className={`relative w-full bg-black overflow-hidden flex items-center justify-center ${
              viewMode === 'split' ? 'h-[360px] sm:h-[460px] lg:h-[580px]' : 'h-[500px] sm:h-[620px]'
            }`}>
              <img
                src={cameraSampleImage}
                alt="Forward ADAS Dashcam Feed"
                className="w-full h-full object-cover select-none"
              />

              {/* Lens Vignette */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.7)_100%)]" />

              {/* Scanning Raster Line */}
              <div className="absolute inset-x-0 h-0.5 bg-cyan-400/50 shadow-[0_0_12px_#00E5FF] animate-hud-scan pointer-events-none" />

              {/* Tactical Camera HUD Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none font-mono text-[11px] text-white/90 drop-shadow-md">
                <div className="bg-black/70 px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-2">
                  <span className="text-red-400 font-bold">REC [●]</span>
                  <span>CAM-01 FRONT</span>
                </div>
                <div className="bg-black/70 px-2.5 py-1 rounded-md border border-white/20">
                  {telemetry.speed} KM/H • HDG {telemetry.heading}°
                </div>
              </div>

              {/* Bottom Telematics Bar */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none font-mono text-[11px] text-white/90 drop-shadow-md">
                <div className="bg-black/70 px-2.5 py-1 rounded-md border border-white/20">
                  LAT {telemetry.lat.toFixed(4)}°N • LON {telemetry.lng.toFixed(4)}°E
                </div>
                <div className="bg-black/70 px-2.5 py-1 rounded-md border border-white/20 text-cyan-300">
                  {activeHazard ? `ALERT: ${activeHazard.title}` : 'CORRIDOR CLEAR'}
                </div>
              </div>

              {/* Optical Hazard Detection Reticle if Hazard is Active */}
              {activeHazard && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-red-500 rounded-lg pointer-events-none animate-pulse shadow-[0_0_25px_rgba(239,68,68,0.7)] flex flex-col justify-between p-2">
                  <div className="flex justify-between text-[10px] font-mono font-bold text-red-400 bg-black/80 px-1.5 py-0.5 rounded w-max">
                    ⚠️ {activeHazard.title}
                  </div>
                  <div className="self-end text-[10px] font-mono font-bold text-white bg-red-600 px-1.5 py-0.5 rounded">
                    SEV: {activeHazard.severity}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* GOOGLE HAZARD MAP */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className="w-full">
            <GoogleHazardMap
              onHazardSelect={h => setActiveHazard(h)}
              onVehicleTelemetry={(t: any) => setTelemetry(t)}
              showControls={true}
              className={viewMode === 'split' ? 'lg:h-full' : ''}
            />
          </div>
        )}

      </div>

    </div>
  );
};
