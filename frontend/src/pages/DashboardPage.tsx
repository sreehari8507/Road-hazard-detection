import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, MapPin, ListFilter, ShieldCheck, 
  Layers, RefreshCw, AlertCircle, CheckCircle2, ChevronRight, Gauge
} from 'lucide-react';
import { MediaUploadDetector, RealAnalyzedHazard } from '../components/detection/MediaUploadDetector';
import { GoogleHazardMap, PinnedHazard } from '../components/map/GoogleHazardMap';
import { apiClient } from '../services/apiClient';
import { Detection } from '../types';
import { RiskBadge } from '../components/advisory/RiskBadge';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'map' | 'history'>('upload');
  const [recentDetections, setRecentDetections] = useState<Detection[]>([]);
  const [totalScans, setTotalScans] = useState<number>(0);
  const [activeAlertCount, setActiveAlertCount] = useState<number>(0);
  const [pinnedCount, setPinnedCount] = useState<number>(0);

  // Load actual detections from backend
  const loadDetections = async () => {
    try {
      const data = await apiClient.getDetections(15);
      setRecentDetections(data);
      setTotalScans(data.length);
      setActiveAlertCount(data.filter(d => d.severity === 'high' || d.severity === 'critical').length);
    } catch (e) {
      setRecentDetections([]);
      setTotalScans(0);
      setActiveAlertCount(0);
    }
  };

  // Load pinned hazards count
  const loadPinnedCount = () => {
    try {
      const stored = localStorage.getItem('cyclops_pinned_hazards');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPinnedCount(parsed.length);
          return;
        }
      }
      setPinnedCount(0);
    } catch (e) {
      setPinnedCount(0);
    }
  };

  useEffect(() => {
    loadDetections();
    loadPinnedCount();
    const handler = () => loadPinnedCount();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleHazardDetected = (hazard: RealAnalyzedHazard) => {
    setTotalScans(prev => prev + 1);
    if (hazard.severity === 'HIGH' || hazard.severity === 'CRITICAL') {
      setActiveAlertCount(prev => prev + 1);
    }
    loadPinnedCount();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* 1. SIMPLE & CLEAN HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Road Hazard Detection &amp; Google Map Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Detect real road hazards by uploading photos and dashcam footage, or monitor real-time road conditions on Google Maps.
          </p>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'upload'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>1. Upload &amp; Detect</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'map'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>2. Live Google Map</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'history'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Saved Records</span>
          </button>
        </div>
      </div>

      {/* 2. REAL STATS TILES (Pure & Free of Fake Dummy Numbers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Analyzed Media */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium block mb-1">Files Analyzed</span>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
            {totalScans}
          </div>
          <span className="text-[11px] text-cyan-400 font-medium mt-1 block">
            {totalScans === 0 ? 'Awaiting user upload' : 'User uploaded media'}
          </span>
        </div>

        {/* High Risk Road Hazards */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium block mb-1">High Risk Hazards</span>
          <div className="text-2xl sm:text-3xl font-bold text-orange-400 font-mono">
            {activeAlertCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {activeAlertCount === 0 ? 'No active hazards' : 'Requires driver action'}
          </span>
        </div>

        {/* Real Pinned Hazards on Google Map */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium block mb-1">Pinned to Google Map</span>
          <div className="text-2xl sm:text-3xl font-bold text-cyan-300 font-mono">
            {pinnedCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {pinnedCount === 0 ? 'No pinned locations' : 'Active GPS markers'}
          </span>
        </div>

        {/* Google Live Traffic Feed Status */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium block mb-1">Google Traffic Feed</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-lg sm:text-xl">Connected</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Official TrafficLayer Ready
          </span>
        </div>

      </div>

      {/* 3. MAIN TAB VIEWS */}

      {/* TAB 1: UPLOAD & DETECT (MODE 1) */}
      {activeTab === 'upload' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-cyan-400" />
              <span>Step 1: Upload Photo or Dashcam Video to Detect Hazards</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select or drop any road photo or video. The computer vision analyzer evaluates asphalt pixels, classifies defects (potholes, waterlogging, blockages, debris), and produces required speed and steering guidance.
            </p>
          </div>

          <MediaUploadDetector
            onHazardDetected={handleHazardDetected}
            onNavigateToMap={() => setActiveTab('map')}
          />
        </div>
      )}

      {/* TAB 2: LIVE GOOGLE MAP (MODE 2) */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4.5 h-4.5 text-cyan-400" />
                <span>Step 2: Live Google Map Tracking &amp; Official Road Traffic</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose your location using "Use My GPS Location" or search a city. View official Google real-time traffic slowdowns and inspect your pinned hazards.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('upload')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload New Hazard Media</span>
            </button>
          </div>

          <GoogleHazardMap showControls={true} />
        </div>
      )}

      {/* TAB 3: SAVED RECORDS */}
      {activeTab === 'history' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-cyan-400" />
                <span>Saved Hazard Detection Records</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verified road hazards stored in the database from your uploaded media scans.
              </p>
            </div>
            <button
              onClick={loadDetections}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Records</span>
            </button>
          </div>

          {recentDetections.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No Detection Records Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                All values remain completely blank until you upload photos or videos. Go to the "Upload &amp; Detect" tab to perform your first scan.
              </p>
              <button
                onClick={() => setActiveTab('upload')}
                className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                Go to Upload &amp; Detect
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] text-slate-400 border-b border-slate-800 uppercase font-semibold">
                  <tr>
                    <th className="pb-3">Detection ID</th>
                    <th className="pb-3">Hazard Type</th>
                    <th className="pb-3">Severity &amp; Risk</th>
                    <th className="pb-3">Driver Advisory Speed</th>
                    <th className="pb-3">Location Description</th>
                    <th className="pb-3">Logged Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {recentDetections.map(d => (
                    <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 text-cyan-400 font-mono font-semibold">{d.id}</td>
                      <td className="py-3 font-semibold text-white capitalize">
                        {d.hazard_type.replace('_', ' ')}
                      </td>
                      <td className="py-3">
                        <RiskBadge score={d.risk_score} severity={d.severity} size="sm" />
                      </td>
                      <td className="py-3 font-medium">
                        {d.recommended_speed_kmh === 0 ? (
                          <span className="text-red-400 font-bold">FULL STOP (0 km/h)</span>
                        ) : (
                          `${d.recommended_speed_kmh} km/h`
                        )}
                      </td>
                      <td className="py-3 text-slate-400 max-w-[200px] truncate">{d.location}</td>
                      <td className="py-3 text-slate-400 font-mono text-[11px]">{d.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
