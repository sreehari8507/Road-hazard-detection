import React, { useState, useEffect } from 'react';
import { DemoModeBadge } from '../components/common/DemoModeBadge';
import { StatusIndicator } from '../components/common/StatusIndicator';
import { apiClient } from '../services/apiClient';
import {
  Settings,
  RotateCcw,
  Sparkles,
  Server,
  Activity,
  Sliders,
  Volume2,
  VolumeX,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface SettingsPageProps {
  onReplayIntro?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onReplayIntro }) => {
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>('http://127.0.0.1:8000/api');
  const [apiHealth, setApiHealth] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    apiClient.checkHealth().then(setApiHealth);
  }, []);

  const handleReplayIntro = () => {
    localStorage.removeItem('cyclopsIntroSeen');
    if (onReplayIntro) {
      onReplayIntro();
    } else {
      window.location.href = '/?replay=true';
    }
  };

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full font-mono text-xs text-slate-300">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              System Settings
            </h1>
            <DemoModeBadge text="CONFIG" />
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Configure telemetry polling, simulation preferences, and cinematic sequence playback
          </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 1. CINEMATIC INTRO REPLAY */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white font-display mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Replay Cinematic Visor Activation
            </h3>
            <p className="text-slate-400 text-xs font-sans">
              Experience the 7-stage optical visor power-on, reflection sweep, eye charge, and red laser flash sequence.
            </p>
          </div>
          <button
            onClick={handleReplayIntro}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] shrink-0"
          >
            Replay Intro
          </button>
        </div>

        {/* 2. DEMO & SIMULATION PREFERENCES */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-display">
            Simulation &amp; Mode Controls
          </h3>

          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <div>
              <span className="text-white font-semibold block">Demo Simulation Mode</span>
              <span className="text-[11px] text-slate-400">Generate realistic mock detections if YOLO models are inactive.</span>
            </div>
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              className="accent-cyan-400 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <div>
              <span className="text-white font-semibold block">Reduced Motion Mode</span>
              <span className="text-[11px] text-slate-400">Minimize animations and skip flash sequences.</span>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="accent-cyan-400 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-white font-semibold block">Audio Chimes</span>
              <span className="text-[11px] text-slate-400">Audible deceleration cues upon high-risk hazard detection.</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3. BACKEND API CONFIGURATION */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              FastAPI Telemetry Server
            </h3>
            <StatusIndicator />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1.5">
              API Base URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] space-y-1">
            <div className="text-slate-400">Service Status: <span className="text-emerald-400 font-bold">{apiHealth?.status ?? 'Connecting...'}</span></div>
            <div className="text-slate-400">Hardware Profile: <span className="text-cyan-300">{apiHealth?.hardware_profile ?? '8 GB RAM Optimized'}</span></div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Preferences Applied</span>
            </span>
          )}
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
          >
            Save Configuration
          </button>
        </div>

      </div>

    </div>
  );
};
