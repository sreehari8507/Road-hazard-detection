import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { VehicleProfile } from '../types';
import { DemoModeBadge } from '../components/common/DemoModeBadge';
import { Car, Siren, Truck, Bus, Wrench, ShieldAlert, Gauge, Activity, Info } from 'lucide-react';

export const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleProfile[]>([]);

  useEffect(() => {
    apiClient.getVehicles().then(setVehicles);
  }, []);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'emergency': return Siren;
      case 'commercial': return Truck;
      case 'bus': return Bus;
      case 'service': return Wrench;
      default: return Car;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Vehicle Intelligence &amp; Fleet Dynamics
            </h1>
            <DemoModeBadge text="MULTI-FLEET MATRIX" />
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Adapting road hazard risk calculations and deceleration profiles according to vehicle mass and operational constraints
          </p>
        </div>
      </div>

      {/* METHODOLOGY EXPLANATION */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono text-slate-300 leading-relaxed">
          <strong className="text-cyan-400 uppercase tracking-wide">Vehicle-Aware Model Assumption: </strong>
          Heavier vehicles have longer braking distance and higher roll inertia. Emergency vehicles require priority tactical routing. CYCLOPS dynamically scales stopping distances, recommended speeds, and alert thresholds by fleet profile.
        </div>
      </div>

      {/* FLEET CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(v => {
          const Icon = getVehicleIcon(v.vehicle_type);
          return (
            <div key={v.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-5 hover:border-cyan-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 uppercase">
                    {v.id}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-display mb-1">{v.name}</h3>
                <span className="text-xs font-mono text-cyan-400 font-semibold block capitalize mb-4">
                  {v.vehicle_type.replace('_', ' ')} Profile
                </span>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">ACTIVE UNITS</span>
                    <span className="text-base font-bold text-white">{v.active_units}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">AVG ADVISORY SPEED</span>
                    <span className="text-base font-bold text-cyan-300">{v.avg_advisory_speed} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">RISK EVENTS LOGGED</span>
                    <span className="text-base font-bold text-orange-400">{v.risk_events}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">BRAKING FACTOR</span>
                    <span className="text-base font-bold text-slate-200">
                      {v.dynamics?.braking_multiplier ?? 1.0}x
                    </span>
                  </div>
                </div>
              </div>

              {/* Specific Operational Dynamics Callout */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                  DYNAMICS CONSTRAINT:
                </span>
                <p className="text-slate-300">
                  {v.dynamics?.priority || v.dynamics?.cargo_shift_risk || v.dynamics?.passenger_inertia_risk || 'Standard braking & avoidance envelope.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
