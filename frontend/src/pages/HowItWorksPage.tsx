import React, { useState } from 'react';
import { DemoModeBadge } from '../components/common/DemoModeBadge';
import {
  Camera,
  Scan,
  Tag,
  Gauge,
  ShieldAlert,
  BellRing,
  Database,
  BarChart4,
  ArrowRight,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'Capture',
      icon: Camera,
      short: 'Vehicle camera captures raw road footage.',
      detail: 'Standard commercial dashcams, forward ADAS cameras, or municipal fleet sensors capture continuous 1080p optical streams at 30–60 frames per second.',
      input: 'RGB Camera Sensor Stream (1920x1080 @ 30 FPS)',
      output: 'Normalized Tensor TensorBuffer[3, 640, 640]'
    },
    {
      step: '02',
      title: 'Detect',
      icon: Scan,
      short: 'Computer vision identifies possible hazards.',
      detail: 'Convolutional feature pyramids scan the roadway region-of-interest, identifying surface anomalies, pavement fractures, debris boundaries, and flood boundaries.',
      input: 'TensorBuffer[3, 640, 640]',
      output: 'Candidate Anchor Proposals & Bounding Boxes'
    },
    {
      step: '03',
      title: 'Classify',
      icon: Tag,
      short: 'The system identifies the hazard category.',
      detail: 'The multi-head classification layer categorizes candidates into designated classes: Pothole, Debris, Fallen Tree, Waterlogging, or Clear Pavement, generating softmax confidence scores.',
      input: 'Region Proposals [x, y, w, h]',
      output: 'Class: "pothole", Confidence: 0.94'
    },
    {
      step: '04',
      title: 'Assess',
      icon: Gauge,
      short: 'Severity and risk are calculated.',
      detail: 'The risk engine cross-references hazard dimensions, host vehicle velocity, wet-road friction coefficients, and vehicle class inertia to produce a composite risk index from 0 to 100.',
      input: 'HazardClass + Speed(65km/h) + Weather("clear")',
      output: 'Risk Score: 87 / 100 (HIGH SEVERITY)'
    },
    {
      step: '05',
      title: 'Advise',
      icon: ShieldAlert,
      short: 'The advisory engine calculates recommended speed & actions.',
      detail: 'A transparent rule-based advisory engine synthesizes an actionable deceleration target (e.g. Reduce to 30 km/h) and tactile driving instructions (brake smoothly, avoid swerving).',
      input: 'Risk Score: 87, Posted Limit: 60 km/h',
      output: 'Recommended Speed: 30 km/h + Maneuver Vector'
    },
    {
      step: '06',
      title: 'Alert',
      icon: BellRing,
      short: 'The driver receives a clear tactical warning.',
      detail: 'Within 30 milliseconds of detection, the vehicle cockpit HUD renders high-contrast bounding boxes, speed advisory badges, and audible chimes to ensure safe deceleration.',
      input: 'Advisory Target: 30 km/h',
      output: 'HUD Flash Notification + Audio Deceleration Cue'
    },
    {
      step: '07',
      title: 'Record',
      icon: Database,
      short: 'The event is stored with time and location.',
      detail: 'Telemetry data, precise GPS coordinates, hazard category, and timestamp are securely recorded into an edge database buffer and synchronized with municipal servers.',
      input: 'Detection Payload + GPS (12.9716° N, 80.2433° E)',
      output: 'SQLite Record #CYC-20260921-A109F2'
    },
    {
      step: '08',
      title: 'Analyze',
      icon: BarChart4,
      short: 'Aggregated data supports infrastructure road health.',
      detail: 'City road authorities query aggregated fleet telemetry to track corridor degradation curves, prioritize pavement re-surfacing, and plan storm drainage interventions.',
      input: 'Aggregated Fleet Detection Callsets',
      output: 'Road Health Index & Municipal Resurfacing Priority'
    }
  ];

  const current = steps[activeStep];
  const CurrentIcon = current.icon;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              How CYCLOPS Works
            </h1>
            <DemoModeBadge text="8-STAGE PIPELINE" />
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            The complete journey from optical sensor frame capture to tactical driver guidance and municipal analytics
          </p>
        </div>
      </div>

      {/* HORIZONTAL STEP NAVIGATION BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isActive
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(0,229,255,0.2)] text-white'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {s.step}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              </div>
              <span className="text-xs font-bold font-display truncate">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* SELECTED STEP INTERACTIVE INSPECTOR */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              <CurrentIcon className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                STAGE {current.step} OF 08
              </span>
              <h2 className="text-2xl font-extrabold text-white font-display">
                {current.title} — {current.short}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={activeStep === 0}
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono disabled:opacity-40"
            >
              Next Step
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-light">
          {current.detail}
        </p>

        {/* INPUT / OUTPUT DATA SCHEMAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
              INPUT DATA CONTRACT:
            </span>
            <div className="text-slate-300 bg-slate-900/80 p-2.5 rounded border border-slate-800/80">
              {current.input}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] text-cyan-400 uppercase tracking-wider block font-bold">
              OUTPUT TRANSFORM:
            </span>
            <div className="text-cyan-300 bg-cyan-950/30 p-2.5 rounded border border-cyan-500/30">
              {current.output}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
