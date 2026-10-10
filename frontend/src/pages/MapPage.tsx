import React from 'react';
import { GoogleHazardMap } from '../components/map/GoogleHazardMap';
import { MapPin, Navigation, Info, ShieldCheck, Gauge, ArrowRight, ArrowLeft, ArrowUp, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MapPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* 1. CLEAN SPACIOUS HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight flex items-center gap-2.5">
              <MapPin className="w-7 h-7 text-cyan-400" />
              <span>Live Google Map Tracking &amp; Road Hazards</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Choose your real GPS location, view official Google TrafficLayer road congestion, and inspect your real pinned hazards.
          </p>
        </div>

        <button
          onClick={() => navigate('/detection')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 self-start sm:self-auto"
        >
          <span>Upload New Hazard Media</span>
        </button>
      </div>

      {/* 2. REAL GOOGLE HAZARD MAP */}
      <GoogleHazardMap showControls={true} />

      {/* 3. DRIVER HAZARD ACTION GUIDE (WHAT TO DO NEXT) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Driver Response Protocol: What To Do For Each Road Hazard</span>
        </h2>
        <p className="text-xs text-slate-400">
          When approaching any road hazard, always execute the corresponding defensive driving maneuver:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          {/* Pothole */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xl">🕳️</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                HIGH RISK
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Asphalt Pothole / Crater</h4>
            <div className="text-xs font-mono text-cyan-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" />
              <span>Target Speed: 25-30 km/h</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong>Maneuver:</strong> Brake smoothly <em>before</em> the rim. Steer 1.8m to the clear side of lane. Do not brake inside the hole.
            </div>
          </div>

          {/* Waterlogging */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xl">🌊</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                HIGH RISK
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Standing Water / Aquaplaning</h4>
            <div className="text-xs font-mono text-cyan-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" />
              <span>Target Speed: 25 km/h</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong>Maneuver:</strong> Hold steering wheel straight with firm grip. <strong>DO NOT</strong> swerve or brake abruptly to prevent spinning out.
            </div>
          </div>

          {/* Debris */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xl">📦</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                MODERATE RISK
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Road Debris / Obstacles</h4>
            <div className="text-xs font-mono text-cyan-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" />
              <span>Target Speed: 40 km/h</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong>Maneuver:</strong> Check rearview mirrors. Shift 1.5m left or right into the clear zone, or straddle centerline at reduced speed.
            </div>
          </div>

          {/* Fallen Tree / Total Blockage */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xl">🌲</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                CRITICAL
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Fallen Tree / Road Blockage</h4>
            <div className="text-xs font-mono text-red-400 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Target Speed: 0 km/h (STOP)</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong>Maneuver:</strong> Bring vehicle to an <strong>immediate complete stop</strong>. Turn on 4-way hazard flashers and find an alternate detour.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
