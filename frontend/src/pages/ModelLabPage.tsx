import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { ModelInfo } from '../types';
import { DemoModeBadge } from '../components/common/DemoModeBadge';
import { Cpu, Zap, Activity, HardDrive, ShieldCheck, CheckCircle2, Info } from 'lucide-react';

export const ModelLabPage: React.FC = () => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [activeModel, setActiveModel] = useState<string>('mod-yolo-v8e');

  useEffect(() => {
    apiClient.getModels().then(setModels);
  }, []);

  const selected = models.find(m => m.id === activeModel) || models[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              AI Model Lab &amp; Architecture Benchmarks
            </h1>
            <DemoModeBadge text="ILLUSTRATIVE VALUES" />
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Comparative evaluation of edge detector topologies, inference latency, and memory footprints
          </p>
        </div>
      </div>

      {/* TRANSPARENCY NOTICE */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono text-slate-300 leading-relaxed">
          <strong className="text-amber-400 uppercase tracking-wide">Prototype Benchmark Notice: </strong>
          The metrics below represent illustrative simulated architectural benchmarks designed to guide edge hardware deployment (e.g. Raspberry Pi 5 vs NVIDIA Jetson Orin vs Laptop CPU). These are not published peer-reviewed figures.
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[11px]">
              <tr>
                <th className="p-3.5">Candidate Model</th>
                <th className="p-3.5">mAP Accuracy</th>
                <th className="p-3.5">Inference Speed</th>
                <th className="p-3.5">Memory Profile</th>
                <th className="p-3.5">Latency</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Select</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {models.map(m => (
                <tr
                  key={m.id}
                  onClick={() => setActiveModel(m.id)}
                  className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                    activeModel === m.id ? 'bg-cyan-950/30' : ''
                  }`}
                >
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <Cpu className={`w-4 h-4 ${activeModel === m.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{m.name}</span>
                  </td>
                  <td className="p-3.5 text-cyan-300 font-bold">{m.accuracy}</td>
                  <td className="p-3.5 text-emerald-400">{m.speed}</td>
                  <td className="p-3.5 text-slate-400">{m.memory}</td>
                  <td className="p-3.5 text-slate-200">{m.latency_ms} ms</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                      activeModel === m.id ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {activeModel === m.id ? 'Active' : 'Inspect'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED ARCHITECTURE DOSSIER */}
      {selected && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                TOPOLOGY DOSSIER
              </span>
              <h3 className="text-xl font-bold text-white font-display">
                {selected.name}
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                {selected.accuracy} mAP@50
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
                {selected.latency_ms}ms Latency
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            <div className="space-y-3">
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Backbone &amp; Neck Topology</span>
                <p className="text-white font-semibold text-sm mt-0.5">{selected.architecture}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Hardware Deployment Target</span>
                <p className="text-slate-300 mt-0.5">
                  Optimized for edge inferencing on low-power automotive compute boards and commercial dashcams.
                </p>
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] block uppercase mb-2">Supported Road Hazard Classes</span>
              <div className="flex flex-wrap gap-1.5">
                {selected.supported_hazards.map(h => (
                  <span key={h} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-200">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
