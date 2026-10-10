import React, { useState, useEffect } from 'react';
import { ShieldAlert, Crosshair, Navigation, AlertTriangle, Cpu, Radio, Video, Camera, Compass } from 'lucide-react';
import { RiskBadge } from '../advisory/RiskBadge';

export const RoadVisualization: React.FC = () => {
  const [activeHazardIndex, setActiveHazardIndex] = useState(0);
  const [isLiveStream, setIsLiveStream] = useState(true);
  const [timestamp, setTimestamp] = useState<string>('');

  const scenarios = [
    {
      type: 'POTHOLE',
      tag: 'STRUCTURAL CAVITY #4092',
      confidence: '94.2%',
      riskScore: 87,
      severity: 'HIGH',
      advisory: 'REDUCE TO 30 km/h',
      location: '12.9654° N, 80.2458° E • OMR IT Expressway',
      image: '/samples/pothole.jpg',
      bbox: { x: '37%', y: '43%', width: '30%', height: '20%' },
      depthNote: 'Estimated crater depth: 8.5 cm • Rim fracture risk'
    },
    {
      type: 'WATERLOGGING',
      tag: 'HYDROPLANING PONDING #2184',
      confidence: '92.6%',
      riskScore: 78,
      severity: 'HIGH',
      advisory: 'REDUCE TO 25 km/h',
      location: '13.0489° N, 80.2825° E • Marina Coastal Segment',
      image: '/samples/waterlogging.jpg',
      bbox: { x: '8%', y: '36%', width: '84%', height: '46%' },
      depthNote: 'Surface water layer ~22 mm • Friction coeff: 0.28'
    },
    {
      type: 'FALLEN TREE',
      tag: 'TOTAL LANE BLOCKAGE #8911',
      confidence: '97.8%',
      riskScore: 96,
      severity: 'CRITICAL',
      advisory: 'STOP / DO NOT PROCEED',
      location: '13.0827° N, 80.2107° E • Anna Nagar 2nd Ave',
      image: '/samples/fallen_tree.jpg',
      bbox: { x: '25%', y: '18%', width: '68%', height: '44%' },
      depthNote: 'Dual-lane tree blockage • Emergency halt triggered'
    },
    {
      type: 'DEBRIS',
      tag: 'CARGO OBSTACLE #5519',
      confidence: '89.4%',
      riskScore: 58,
      severity: 'MODERATE',
      advisory: 'REDUCE TO 40 km/h',
      location: '12.9856° N, 80.1982° E • Airport GST Overpass',
      image: '/samples/debris.jpg',
      bbox: { x: '36%', y: '32%', width: '36%', height: '23%' },
      depthNote: 'Fallen wooden cargo pallets & metal scrap in center lane'
    }
  ];

  // Auto rotate scenarios every 6 seconds for demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHazardIndex((prev) => (prev + 1) % scenarios.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [scenarios.length]);

  // Live OSD dashcam clock
  useEffect(() => {
    const clock = setInterval(() => {
      const now = new Date();
      setTimestamp(now.toISOString().replace('T', ' ').slice(0, 19));
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  const active = scenarios[activeHazardIndex];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/80 bg-[#050810] shadow-[0_0_60px_rgba(0,0,0,0.8)] select-none">
      
      {/* AUTHENTIC VEHICLE DASHCAM / ADAS TOP OSD BAR */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/90 border-b border-slate-800 text-[11px] font-mono backdrop-blur z-20 text-slate-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-red-500 font-bold tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            REC
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-bold">CAM 01 [FRONT WIDE 140°]</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-400">1080P @ 60 FPS • H.265</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono">{timestamp || '2026-09-21 20:45:12'}</span>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setIsLiveStream(!isLiveStream)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              isLiveStream ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isLiveStream ? 'STREAM ACTIVE' : 'PAUSED'}
          </button>
        </div>
      </div>

      {/* ROAD FEED VIEWPORT */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
        
        {/* Real Vehicle Dashcam Photograph */}
        <img
          src={active.image}
          alt={active.type}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isLiveStream ? 'animate-pulse-slow' : ''
          }`}
          style={{
            filter: 'contrast(1.05) brightness(0.98)'
          }}
        />

        {/* Subtle camera lens vignette overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 pointer-events-none" />

        {/* Subtle optical scanline raster */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-24 w-full animate-hud-scan pointer-events-none opacity-40" />

        {/* Dashcam Windshield HUD Watermark */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 text-[11px] font-mono text-slate-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur px-2.5 py-1 rounded border border-slate-700/60">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>GPS: {active.location}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-black/50 px-2 py-0.5 rounded w-fit">
            <span>SENSORS: OPTICAL + ACCEL + GYRO</span>
          </div>
        </div>

        {/* AI DETECTION BOUNDING BOX OVER PHOTOREALISTIC HAZARD */}
        <div 
          className="absolute border-2 border-red-500 rounded-sm transition-all duration-700 z-20 flex flex-col justify-between p-2 shadow-[0_0_30px_rgba(239,68,68,0.7)] backdrop-brightness-110"
          style={{
            left: active.bbox.x,
            top: active.bbox.y,
            width: active.bbox.width,
            height: active.bbox.height
          }}
        >
          {/* Tactical HUD Corner Reticles */}
          <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-white drop-shadow" />
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-white drop-shadow" />
          <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-white drop-shadow" />
          <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-white drop-shadow" />

          {/* Floating AI Recognition Tag Above Box */}
          <div className="absolute -top-8 left-0 bg-red-600/95 text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded shadow-xl flex items-center gap-2 whitespace-nowrap border border-red-400">
            <span>{active.type}</span>
            <span className="bg-black/40 px-1 rounded text-[10px]">{active.confidence}</span>
            <span className="text-[10px] text-red-200 font-normal hidden sm:inline">[{active.tag}]</span>
          </div>

          {/* Sub-label inside box */}
          <div className="mt-auto self-end bg-black/85 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-orange-300 border border-orange-500/50 shadow">
            {active.severity} RISK
          </div>
        </div>

        {/* SPEED ADVISORY OVERLAY CARD (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 hud-panel-cyan p-3.5 rounded-xl max-w-xs hidden sm:block shadow-2xl">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            SAFETY ADVISORY ENGINE
          </div>
          <div className="text-base font-black font-mono text-white tracking-wide">
            {active.advisory}
          </div>
          <div className="text-[11px] text-slate-300 font-sans mt-0.5 font-light">
            {active.depthNote}
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
            <RiskBadge score={active.riskScore} severity={active.severity} size="sm" />
            <span className="text-[10px] font-mono text-cyan-300">Confidence: {active.confidence}</span>
          </div>
        </div>

        {/* SPEEDOMETER TELEMETRY (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20 bg-black/85 backdrop-blur border border-slate-800 px-4 py-2.5 rounded-xl text-right font-mono shadow-2xl">
          <div className="text-[10px] text-slate-400 tracking-wider">HOST VEHICLE SPEED</div>
          <div className="text-2xl font-black text-white leading-none my-0.5">
            58 <span className="text-xs text-slate-400 font-normal">km/h</span>
          </div>
          <div className={`text-[10px] font-bold ${active.advisory.includes('STOP') ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
            {active.advisory.includes('STOP') ? 'HALT REQUIRED' : 'DECELERATION ACTIVE'}
          </div>
        </div>

      </div>

      {/* INTERACTIVE SCENARIO SELECTOR SWITCH */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider">
            Switch Real Dashcam Feed:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {scenarios.map((s, idx) => (
            <button
              key={s.type}
              onClick={() => setActiveHazardIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                activeHazardIndex === idx
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {s.type}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
