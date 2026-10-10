import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete, forcePlay = false }) => {
  // Stages:
  // 0: Initial Dark Charging (0.0s - 0.8s)
  // 1: Visor Dial Lock & Energy Accumulation (0.8s - 1.8s)
  // 2: OPTIC BLAST ERUPTION - Full Comic Explosion (1.8s - 3.8s)
  // 3: White Shockwave Flash (3.8s - 4.3s)
  // 4: CYCLOPS Logo Carved from Laser (4.3s - 6.0s)
  // 5: Dissolve to App (6.0s - 6.6s)
  const [stage, setStage] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && !forcePlay) {
      setReducedMotion(true);
      onComplete();
    }
  }, [forcePlay, onComplete]);

  // Web Audio Synthesizer for Epic Optic Blast Sound
  const playBlastAudio = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 1. Charge Rise Sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.0);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);

      // 2. Explosive Blast Impact (Noise + Low Rumble)
      setTimeout(() => {
        if (!ctx) return;
        // Low rumble sub-bass
        const rumble = ctx.createOscillator();
        const rumbleGain = ctx.createGain();
        rumble.type = 'triangle';
        rumble.frequency.setValueAtTime(160, ctx.currentTime);
        rumble.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 1.5);
        rumbleGain.gain.setValueAtTime(0.6, ctx.currentTime);
        rumbleGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        rumble.connect(rumbleGain);
        rumbleGain.connect(ctx.destination);
        rumble.start();
        rumble.stop(ctx.currentTime + 1.5);

        // White noise blast
        const bufferSize = ctx.sampleRate * 1.2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 1.2);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        whiteNoise.start();
        whiteNoise.stop(ctx.currentTime + 1.2);
      }, 950);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }, []);

  // Stage timeline controller
  useEffect(() => {
    if (reducedMotion) return;

    const t1 = setTimeout(() => setStage(1), 700);   // Dial lock & energy gather
    const t2 = setTimeout(() => {
      setStage(2);                                  // OPTIC BLAST ERUPTION
      if (soundEnabled) playBlastAudio();
    }, 1800);
    const t3 = setTimeout(() => setStage(3), 3600);  // White flash burst
    const t4 = setTimeout(() => setStage(4), 4100);  // Logo carved from laser
    const t5 = setTimeout(() => setStage(5), 5800);  // Dissolve to app
    const t6 = setTimeout(() => {
      localStorage.setItem('cyclopsIntroSeen', 'true');
      onComplete();
    }, 6400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete, reducedMotion, soundEnabled, playBlastAudio]);

  const handleSkip = useCallback(() => {
    localStorage.setItem('cyclopsIntroSeen', 'true');
    onComplete();
  }, [onComplete]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next && stage >= 1) {
      playBlastAudio();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none transition-opacity duration-700 ${
        stage === 5 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="region"
      aria-label="CYCLOPS Optic Power Sequence"
    >
      {/* Top Floating Action Controls */}
      <div className="absolute top-6 inset-x-6 z-50 flex items-center justify-between pointer-events-auto">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur transition-all"
          title={soundEnabled ? "Mute audio" : "Enable optic blast sound effect"}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          <span>{soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>
        </button>

        <button
          onClick={handleSkip}
          className="px-4 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-xs font-mono tracking-wider uppercase text-slate-300 hover:text-white border border-slate-700/80 hover:border-red-500/80 backdrop-blur transition-all"
        >
          Skip [ESC]
        </button>
      </div>

      {/* STAGE 0 & 1: DARK SILHOUETTE & OPTIC VISOR DIAL CHARGING */}
      {stage < 2 && (
        <div className="relative flex flex-col items-center justify-center text-center px-4">
          
          {/* Glowing Red Energy Rings Collapsing Inward */}
          <div className="relative flex items-center justify-center w-64 h-64">
            <span className={`absolute w-56 h-56 rounded-full border border-red-500/30 transition-all duration-700 ${stage === 1 ? 'scale-50 opacity-100' : 'scale-100 opacity-20'}`} />
            <span className={`absolute w-40 h-40 rounded-full border-2 border-dashed border-red-500/60 animate-spin transition-all duration-700 ${stage === 1 ? 'scale-75' : 'scale-100'}`} style={{ animationDuration: '4s' }} />
            <span className={`absolute w-24 h-24 rounded-full bg-red-600/30 blur-xl animate-pulse transition-all duration-500 ${stage === 1 ? 'opacity-100 scale-150' : 'opacity-30 scale-100'}`} />
            
            {/* Visor Ruby Quartz Lens Core */}
            <div className={`relative w-28 h-10 rounded-full bg-red-600 border-2 border-red-400 flex items-center justify-center shadow-[0_0_40px_#EF4444] transition-all duration-500 ${
              stage === 1 ? 'scale-125 shadow-[0_0_80px_#EF4444]' : 'scale-100'
            }`}>
              <div className="w-12 h-2.5 rounded-full bg-white shadow-[0_0_20px_#FFFFFF] animate-pulse" />
            </div>
          </div>

          {/* Telemetry Status Bar */}
          <div className="mt-8 space-y-1 font-mono text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-red-500 font-bold animate-pulse">
              {stage === 1 ? 'TARGET LOCKED • RELEASE CONDUIT' : 'OPTIC APERTURE INITIALIZING'}
            </div>
            <div className="text-[11px] text-slate-500 tracking-widest">
              RUBY-QUARTZ VISOR DIAL ACTIVATED
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: FULL OPTIC BLAST COMIC ERUPTION (IMAGE + KINETIC LASER EFFECTS) */}
      {stage >= 2 && stage < 4 && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black animate-optic-rumble">
          
          {/* THE EXPLOSIVE USER IMAGE */}
          <div className="relative w-full h-full flex items-center justify-center animate-speed-zoom">
            <img
              src="/intro/cyclops_blast.jpg"
              alt="Cyclops Unleashing Optic Blast"
              className="w-full h-full object-contain md:object-cover scale-105 filter contrast-125 brightness-110"
            />

            {/* Glowing Golden & Fiery Radial Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(239,68,68,0.4)_70%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

            {/* Radiant Kinetic Anime Speed Lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 animate-pulse" preserveAspectRatio="none" viewBox="0 0 100 100">
              <line x1="50" y1="35" x2="0" y2="0" stroke="#FFF" strokeWidth="0.6" />
              <line x1="50" y1="35" x2="15" y2="0" stroke="#FF4500" strokeWidth="0.8" />
              <line x1="50" y1="35" x2="85" y2="0" stroke="#FF4500" strokeWidth="0.8" />
              <line x1="50" y1="35" x2="100" y2="0" stroke="#FFF" strokeWidth="0.6" />
              <line x1="50" y1="35" x2="0" y2="50" stroke="#FFF" strokeWidth="0.5" />
              <line x1="50" y1="35" x2="100" y2="50" stroke="#FFF" strokeWidth="0.5" />
              <line x1="50" y1="35" x2="0" y2="100" stroke="#FFD700" strokeWidth="0.6" />
              <line x1="50" y1="35" x2="100" y2="100" stroke="#FFD700" strokeWidth="0.6" />
            </svg>

            {/* MASSIVE CROSSING "X" LASER BEAM BLAST GLOW */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Beam 1: Top-Left to Bottom-Right */}
              <div 
                className="absolute w-[200vw] h-[6px] md:h-[10px] bg-white shadow-[0_0_30px_#FFF,0_0_60px_#FF2200,0_0_120px_#FF0000] rotate-[38deg]"
              />
              {/* Beam 2: Top-Right to Bottom-Left */}
              <div 
                className="absolute w-[200vw] h-[6px] md:h-[10px] bg-white shadow-[0_0_30px_#FFF,0_0_60px_#FF2200,0_0_120px_#FF0000] -rotate-[38deg]"
              />
              {/* Central White Optic Nexus Flare */}
              <div className="absolute w-40 h-40 md:w-64 md:h-64 rounded-full bg-white blur-2xl animate-ping opacity-90" />
            </div>

            {/* Flying Embers & Shockwave Ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full border-4 border-amber-400/60 blur-sm animate-ping" />
            </div>
          </div>

        </div>
      )}

      {/* STAGE 3: BLINDING WHITE SOLAR SHOCKWAVE FLASH */}
      {stage === 3 && (
        <div className="absolute inset-0 z-40 bg-white flex items-center justify-center animate-pulse">
          <div className="w-screen h-12 bg-red-600 blur-2xl" />
        </div>
      )}

      {/* STAGE 4: CYCLOPS LOGO CARVED FROM THE LASER BLAST */}
      {stage >= 4 && (
        <div className="relative z-30 flex flex-col items-center justify-center text-center px-6 max-w-2xl">
          
          {/* Laser Slash Line */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_#EF4444] mb-8 animate-pulse" />

          {/* Eye Icon with Ruby Glow */}
          <div className="mb-4 relative">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.7)] flex items-center justify-center">
              <div className="w-9 h-4 rounded-full bg-black border border-red-400 flex items-center justify-center relative overflow-hidden">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_12px_#EF4444]" />
              </div>
            </div>
            <div className="absolute -inset-2 rounded-2xl bg-red-500/30 blur-xl -z-10 animate-pulse" />
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-2 font-display">
            CY<span className="text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]">CL</span>OPS
          </h1>

          {/* Tagline */}
          <p className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-cyan-300 font-bold mb-3">
            AI Road Hazard &amp; Environmental Intelligence
          </p>

          <p className="text-sm text-slate-300 font-light max-w-md mb-8">
            See the Road. Understand the Risk. Protect the Future.
          </p>

          {/* Enter Platform Button */}
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:shadow-[0_0_45px_rgba(239,68,68,0.8)]"
          >
            <span>Launch Platform Now →</span>
          </button>
        </div>
      )}

      {/* Bottom Footer Caption */}
      <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          CYCLOPS SENSOR ARCHITECTURE • POWERED BY OPTIC INTELLIGENCE
        </span>
      </div>

    </div>
  );
};
