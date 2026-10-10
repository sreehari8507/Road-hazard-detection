import React from 'react';
import { DemoModeBadge } from '../components/common/DemoModeBadge';
import { Cpu, Layers, ShieldAlert, Zap, HardDrive, CheckCircle2, Code2, Calculator, Info } from 'lucide-react';

export const TechnologyPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Technology &amp; System Architecture
            </h1>
            <DemoModeBadge text="ARCHITECTURE SPECS" />
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Deep dive into the CYCLOPS edge detection pipeline, risk equations, and speed advisory algorithms
          </p>
        </div>
      </div>

      {/* 1. END-TO-END DATAFLOW PIPELINE */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-display">
            End-to-End Processing Architecture
          </h2>
          <span className="text-xs font-mono text-cyan-400">11-STAGE PIPELINE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {[
            {
              stage: '01. Ingestion & Preprocessing',
              items: [
                'Camera Sensor (1080p @ 30-60 FPS)',
                'Frame Buffer & Downsampling (640x640)',
                'Tensor Normalization (0.0 to 1.0 RGB)'
              ]
            },
            {
              stage: '02. Vision & Risk Modeling',
              items: [
                'Feature Extraction (DetectionEngine)',
                'Bounding Proposal & Confidence Scorer',
                'RuleBasedAdvisoryEngine Physics Eval'
              ]
            },
            {
              stage: '03. Delivery & Telemetry',
              items: [
                'Cockpit HUD Deceleration Alert',
                'SQLite Event & Geo-Coordinate Persistence',
                'Aggregated Road Health & Analytics'
              ]
            }
          ].map(col => (
            <div key={col.stage} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-cyan-400 font-bold uppercase tracking-wider">{col.stage}</h4>
              <ul className="space-y-1.5 text-slate-300">
                {col.items.map((it, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 2. THE RISK SCORE ALGORITHM */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white font-display">
              Transparent Risk Calculation Model
            </h2>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">
            PROTOTYPE RULE-BASED RISK MODEL
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
          <div className="text-cyan-400 font-bold">
            Risk_Score = min(100, Base_Severity × W_confidence × W_weather × W_speed × W_vehicle)
          </div>
          <div className="text-slate-400 text-[11px] pt-1">
            Where:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
            <li><strong>Base_Severity:</strong> Pothole (87), Debris (58), Fallen Tree (96), Waterlogging (78)</li>
            <li><strong>W_confidence:</strong> Optical model detection confidence multiplier (0.85 – 0.99)</li>
            <li><strong>W_weather:</strong> Adverse weather coefficient (+8 risk for rain, +12 for severe storm)</li>
            <li><strong>W_vehicle:</strong> Mass-inertia penalty (+5 risk for commercial trucks/buses with high stopping distance)</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
          <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/40 text-emerald-400">
            <div className="font-bold text-sm">0 – 25</div>
            <div className="text-[10px] uppercase text-slate-400 mt-0.5">LOW RISK</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/40 text-amber-300">
            <div className="font-bold text-sm">26 – 50</div>
            <div className="text-[10px] uppercase text-slate-400 mt-0.5">MODERATE RISK</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-orange-500/40 text-orange-400">
            <div className="font-bold text-sm">51 – 75</div>
            <div className="text-[10px] uppercase text-slate-400 mt-0.5">HIGH RISK</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-red-500/50 text-red-400">
            <div className="font-bold text-sm">76 – 100</div>
            <div className="text-[10px] uppercase text-slate-400 mt-0.5">CRITICAL RISK</div>
          </div>
        </div>
      </div>

      {/* 3. SPEED ADVISORY ENGINE LOGIC */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white font-display">
          Speed Advisory Constraint Rules
        </h2>
        <div className="space-y-3 text-xs font-mono text-slate-300">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <strong className="text-white">Rule 1: Legal Speed Limit Ceiling</strong>
            <p className="text-slate-400 mt-0.5">
              The advisory engine strictly guarantees: <code className="text-cyan-300">Recommended_Speed &le; Posted_Speed_Limit</code>. No advisory ever advises exceeding posted legal limits.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <strong className="text-white">Rule 2: Critical Blockage Halt</strong>
            <p className="text-slate-400 mt-0.5">
              When encountering impassable obstacles (e.g. Fallen Tree spanning lanes), the advisory target drops to <code className="text-red-400">0 km/h (STOP / DO NOT PROCEED)</code> with emergency flasher triggers.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <strong className="text-white">Rule 3: Hydroplaning Critical Velocity</strong>
            <p className="text-slate-400 mt-0.5">
              For waterlogging events exceeding 5mm water depth, speed is capped at 25 km/h to keep vehicle velocity well below the hydroplaning dynamic pressure limit (Vp = 6.35 * sqrt(tire_pressure)).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
