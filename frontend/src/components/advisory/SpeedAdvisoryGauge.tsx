import React from 'react';
import { Gauge, ShieldAlert, AlertTriangle, CheckCircle2, Navigation } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

interface SpeedAdvisoryGaugeProps {
  hazardType: string;
  recommendedSpeed: number;
  currentSpeed?: number;
  postedLimit?: number;
  riskScore: number;
  severity: string;
  actions: string[];
  explanation?: string;
  isCompact?: boolean;
}

export const SpeedAdvisoryGauge: React.FC<SpeedAdvisoryGaugeProps> = ({
  hazardType,
  recommendedSpeed,
  currentSpeed = 60,
  postedLimit = 60,
  riskScore,
  severity,
  actions,
  explanation,
  isCompact = false
}) => {
  const isStop = recommendedSpeed === 0;

  return (
    <div className={`rounded-xl border transition-all duration-300 ${
      severity === 'critical' 
        ? 'hud-panel-red border-red-500/50' 
        : severity === 'high' 
        ? 'bg-[#0D121E] border-orange-500/40' 
        : 'hud-panel-cyan'
    } p-5`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-4 h-4 ${severity === 'critical' ? 'text-red-400' : 'text-cyan-400'}`} />
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">
            Speed &amp; Tactical Advisory
          </span>
        </div>
        <RiskBadge score={riskScore} severity={severity} size="sm" />
      </div>

      {/* Main Speed Gauge Visual */}
      <div className="my-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Recommended Speed Callout */}
        <div className="flex items-center gap-4">
          <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border ${
            isStop 
              ? 'bg-red-600 border-red-400 text-white animate-pulse shadow-[0_0_25px_rgba(239,68,68,0.6)]' 
              : 'bg-slate-900 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
          }`}>
            {isStop ? (
              <span className="text-sm font-black font-mono tracking-widest text-center px-1">
                STOP
              </span>
            ) : (
              <>
                <span className="text-3xl font-black font-mono leading-none tracking-tight">
                  {recommendedSpeed}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase mt-0.5">
                  km/h
                </span>
              </>
            )}
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              ADVISORY TARGET
            </span>
            <h4 className="text-base font-bold text-white font-display uppercase tracking-wide">
              {isStop ? 'HALT REQUIRED' : `REDUCE TO ${recommendedSpeed} KM/H`}
            </h4>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-1">
              <span>Current: <strong className="text-slate-200">{currentSpeed} km/h</strong></span>
              <span>•</span>
              <span>Limit: <strong className="text-slate-200">{postedLimit} km/h</strong></span>
            </div>
          </div>
        </div>

        {/* Speed differential badge */}
        <div className="text-right sm:block flex items-center justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">SPEED DELTA</span>
          <span className={`text-sm font-mono font-bold ${currentSpeed > recommendedSpeed ? 'text-amber-400' : 'text-emerald-400'}`}>
            {currentSpeed > recommendedSpeed ? `-${currentSpeed - recommendedSpeed} km/h required` : 'Nominal Pace'}
          </span>
        </div>
      </div>

      {/* Explanation quote */}
      {explanation && (
        <p className="text-xs text-slate-300 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 mb-3">
          &ldquo;{explanation}&rdquo;
        </p>
      )}

      {/* Recommended Actions Checklist */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase block mb-1">
          Safety Actions Required:
        </span>
        {actions.map((act, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>{act}</span>
          </div>
        ))}
      </div>

      {/* Legal Prototype Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-800/70 text-[10px] font-mono text-slate-400 leading-tight">
        * Advisory computed by prototype Rule-Based Advisory Engine. Does not replace traffic regulations or driver responsibility.
      </div>
    </div>
  );
};
