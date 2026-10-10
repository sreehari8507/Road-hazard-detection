import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Eye,
  CheckCircle,
  X
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { Detection } from '../types';
import { RiskBadge } from '../components/advisory/RiskBadge';
import { DemoModeBadge } from '../components/common/DemoModeBadge';

export const HistoryPage: React.FC = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHazard, setSelectedHazard] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Detection | null>(null);

  useEffect(() => {
    apiClient.getDetections(50).then(setDetections);
  }, []);

  const filtered = detections.filter(d => {
    const matchesSearch =
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hazard_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesHazard = selectedHazard === 'all' || d.hazard_type === selectedHazard;
    const matchesSeverity = selectedSeverity === 'all' || d.severity.toLowerCase() === selectedSeverity.toLowerCase();
    const matchesVehicle = selectedVehicle === 'all' || d.vehicle_type === selectedVehicle;

    return matchesSearch && matchesHazard && matchesSeverity && matchesVehicle;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Hazard', 'Confidence', 'Severity', 'Risk Score', 'Advisory Speed (km/h)', 'Vehicle', 'Location', 'Timestamp'];
    const rows = filtered.map(d => [
      d.id,
      d.hazard_type,
      (d.confidence * 100).toFixed(0) + '%',
      d.severity,
      d.risk_score,
      d.recommended_speed_kmh,
      d.vehicle_type,
      `"${d.location}"`,
      d.timestamp
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cyclops_detection_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Incident Detection History
            </h1>
            <DemoModeBadge text="DATABASE ARCHIVE" />
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Search, filter, and inspect verified road hazard encounters
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 hover:text-white transition-all self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center gap-3">
        {/* Text Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, route, or hazard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Hazard Filter */}
        <select
          value={selectedHazard}
          onChange={(e) => setSelectedHazard(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
        >
          <option value="all">All Hazards</option>
          <option value="pothole">Potholes</option>
          <option value="debris">Debris</option>
          <option value="fallen_tree">Fallen Trees</option>
          <option value="waterlogging">Waterlogging</option>
        </select>

        {/* Severity Filter */}
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="moderate">Moderate</option>
          <option value="low">Low</option>
        </select>

        {/* Vehicle Filter */}
        <select
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
        >
          <option value="all">All Vehicles</option>
          <option value="passenger_car">Passenger Car</option>
          <option value="emergency">Emergency</option>
          <option value="commercial">Commercial</option>
          <option value="bus">Bus</option>
          <option value="service">Service</option>
        </select>
      </div>

      {/* DETECTIONS TABLE */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[11px]">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Hazard</th>
                <th className="p-3.5">Confidence</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Speed Target</th>
                <th className="p-3.5">Vehicle</th>
                <th className="p-3.5">Corridor</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.length > 0 ? (
                filtered.map(d => (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedItem(d)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 text-cyan-400 font-bold">{d.id}</td>
                    <td className="p-3.5 font-semibold text-white capitalize">{d.hazard_type.replace('_', ' ')}</td>
                    <td className="p-3.5">{(d.confidence * 100).toFixed(0)}%</td>
                    <td className="p-3.5">
                      <RiskBadge score={d.risk_score} severity={d.severity} size="sm" />
                    </td>
                    <td className="p-3.5">
                      {d.recommended_speed_kmh === 0 ? (
                        <span className="text-red-400 font-bold">STOP</span>
                      ) : (
                        `${d.recommended_speed_kmh} km/h`
                      )}
                    </td>
                    <td className="p-3.5 capitalize text-slate-400">{d.vehicle_type.replace('_', ' ')}</td>
                    <td className="p-3.5 text-slate-300 truncate max-w-[200px]">{d.location}</td>
                    <td className="p-3.5 text-slate-500">{new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="p-3.5 text-right text-cyan-400 hover:text-cyan-300">
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    No detections match the selected query criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL DRAWER */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0D121E] border border-cyan-500/50 rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs text-slate-300">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
                  INCIDENT TELEMETRY DOSSIER
                </span>
                <h3 className="text-lg font-bold text-white font-display capitalize">
                  {selectedItem.hazard_type.replace('_', ' ')} #{selectedItem.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Thumbnail */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src={selectedItem.image_url?.replace('.svg', '.jpg') || `/samples/${selectedItem.hazard_type}.jpg`}
                alt={selectedItem.hazard_type}
                className="w-full h-full object-cover"
                style={{ filter: 'contrast(1.05) brightness(0.98)' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">SEVERITY / RISK</span>
                <RiskBadge score={selectedItem.risk_score} severity={selectedItem.severity} size="sm" />
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">RECOMMENDED SPEED</span>
                <span className="text-base font-bold text-cyan-400">
                  {selectedItem.recommended_speed_kmh === 0 ? 'STOP (0 km/h)' : `${selectedItem.recommended_speed_kmh} km/h`}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] block mb-1">LOCATION &amp; CONDITIONS</span>
              <p className="text-white font-semibold">{selectedItem.location}</p>
              <p className="text-slate-400 mt-0.5">{selectedItem.road_condition} • Weather: {selectedItem.weather}</p>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] block mb-1">RECOMMENDED ACTIONS</span>
              <div className="space-y-1">
                {selectedItem.recommended_actions.map((act, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-200">
                    <CheckCircle className="w-3 h-3 text-cyan-400" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono uppercase tracking-wider"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
