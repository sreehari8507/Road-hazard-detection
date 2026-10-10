import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { apiClient } from '../services/apiClient';
import { DemoModeBadge } from '../components/common/DemoModeBadge';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, PieChart as PieIcon } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiClient.getAnalytics().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading analytics telemetry...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Road Risk Analytics
            </h1>
            <DemoModeBadge text="SIMULATED AGGREGATE" />
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Statistical modeling of hazard distribution, severity clusters, and temporal frequency
          </p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. HAZARDS BY TYPE (BAR CHART) */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Hazards By Classification
            </h3>
            <span className="text-[10px] font-mono text-slate-500">AGGREGATE INCIDENTS</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hazards_by_type}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="type" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070A0F', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="count" fill="#00E5FF" radius={[4, 4, 0, 0]} name="Recorded Count" />
                <Bar dataKey="risk_avg" fill="#F97316" radius={[4, 4, 0, 0]} name="Avg Risk Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. SEVERITY DISTRIBUTION (DONUT / PIE) */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-orange-400" />
              Severity Breakdown
            </h3>
            <span className="text-[10px] font-mono text-slate-500">RISK TIERS</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.severity_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.severity_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#070A0F', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. TEMPORAL DISTRIBUTION (LINE CHART) */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              24-Hour Temporal Incident Frequency
            </h3>
            <span className="text-[10px] font-mono text-slate-500">TIME OF DAY</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.temporal_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070A0F', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="potholes" stroke="#F97316" strokeWidth={2} name="Potholes" dot={false} />
                <Line type="monotone" dataKey="waterlogging" stroke="#00E5FF" strokeWidth={2} name="Waterlogging" dot={false} />
                <Line type="monotone" dataKey="debris" stroke="#FBBF24" strokeWidth={2} name="Debris" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. VEHICLE ENCOUNTER RATES (HORIZONTAL BARS) */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Encounters by Vehicle Fleet Class
            </h3>
            <span className="text-[10px] font-mono text-slate-500">FLEET TELEMETRY</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.vehicle_encounter_rates}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis type="number" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis dataKey="vehicle" type="category" stroke="#64748B" fontSize={10} fontFamily="monospace" width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070A0F', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="encounters" fill="#38BDF8" radius={[0, 4, 4, 0]} name="Encounters" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* DISCLAIMER */}
      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 text-center">
        * All analytics metrics are generated from simulated telemetry for demonstration of the CYCLOPS data visualization layer.
      </div>

    </div>
  );
};
