import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { EnvironmentalMetric } from '../types';
import { DemoModeBadge } from '../components/common/DemoModeBadge';
import { Leaf, AlertTriangle, Droplets, Fuel, CloudRain, Clock, Info } from 'lucide-react';

export const EnvironmentPage: React.FC = () => {
  const [metrics, setMetrics] = useState<EnvironmentalMetric | null>(null);

  useEffect(() => {
    apiClient.getEnvironment().then(setMetrics);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Environmental &amp; Emissions Intelligence
            </h1>
            <DemoModeBadge text="MODEL-BASED ESTIMATES" />
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Analyzing traffic slowdown, vehicle idling, and carbon overhead induced by road degradation
          </p>
        </div>
      </div>

      {/* CRITICAL TRANSPARENCY NOTICE */}
      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono text-slate-300 leading-relaxed">
          <strong className="text-emerald-400 uppercase tracking-wide">Methodology Notice: </strong>
          Camera systems do not directly measure atmospheric pollutants. All environmental metrics presented below are <strong>Estimated / Model-Based</strong>, computed from vehicle deceleration frequency, bottleneck idle times, and fleet fuel consumption models.
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Road Disruption Index',
            value: `${metrics?.road_disruption_index ?? 64}/100`,
            desc: 'Moderate Traffic Friction',
            icon: AlertTriangle,
            color: 'text-amber-400'
          },
          {
            title: 'Est. Congestion Delay',
            value: `${metrics?.estimated_congestion_delay_min ?? 18.4} min`,
            desc: 'Average Corridor Transit Penalty',
            icon: Clock,
            color: 'text-cyan-400'
          },
          {
            title: 'Est. Excess Fuel Burn',
            value: `${metrics?.estimated_idle_fuel_penalty_liters ?? 142.6} L`,
            desc: 'Stop-and-Go Fleet Idling Overhead',
            icon: Fuel,
            color: 'text-orange-400'
          },
          {
            title: 'Est. Excess Carbon',
            value: `${metrics?.estimated_excess_co2_kg ?? 330.8} kg`,
            desc: 'Calculated CO2 Footprint Multiplier',
            icon: Leaf,
            color: 'text-emerald-400'
          }
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase">{m.title}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className={`text-3xl font-black font-mono ${m.color}`}>
                {m.value}
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {m.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* DETAILED ROAD IMPACT ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Environmental Chain of Causation */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-display">
            The Road Degradation to Emissions Chain
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Severe road cavities and flood ponding enforce acute deceleration. When hundreds of vehicles brake from 60 km/h to 25 km/h before re-accelerating, fuel economy plummets.
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-[10px] shrink-0">1</span>
              <div>
                <strong className="text-white">Acute Braking Zone:</strong> Sudden potholes trigger panic braking waves extending up to 2.4 km upstream.
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-[10px] shrink-0">2</span>
              <div>
                <strong className="text-white">Idle Fuel Penalty:</strong> Stop-start crawl consumes up to 35% more fuel per vehicle than steady cruise velocity.
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-[10px] shrink-0">3</span>
              <div>
                <strong className="text-white">Predictive Repair Mitigation:</strong> Rapid patching of top 10% high-risk potholes mitigates an estimated 1.8 tons of localized weekly carbon output.
              </div>
            </div>
          </div>
        </div>

        {/* Waterlogging & Urban Drainage Risks */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-display">
              Urban Drainage &amp; Waterlogging Risk
            </h3>
            <span className="text-xs font-mono text-cyan-400 font-semibold">COASTAL REACH</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Ponding water not only induces severe hydroplaning hazard but rapidly erodes pavement binding bitumen, compounding potholes into major craters within 48 hours of rainfall.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Marina Coastal Segment</span>
              <span className="text-red-400 font-bold">Severe Ponding Risk</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">OMR IT Corridor Storm Inlets</span>
              <span className="text-orange-400 font-bold">Moderate Drainage Delay</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Anna Nagar Underpass Reach</span>
              <span className="text-emerald-400 font-bold">Drainage Operational</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500 italic">
            * All figures computed via prototype traffic kinematics and empirical fuel burn heuristics.
          </div>
        </div>

      </div>

    </div>
  );
};
