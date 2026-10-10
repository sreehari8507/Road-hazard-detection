import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Cpu,
  ArrowRight,
  Activity,
  Layers,
  Truck,
  Car,
  Bus,
  Siren,
  Wrench,
  Leaf,
  CheckCircle,
  Eye,
  Radar,
  Sparkles,
  AlertTriangle,
  Compass
} from 'lucide-react';
import { RoadVisualization } from '../components/landing/RoadVisualization';
import { DemoModeBadge } from '../components/common/DemoModeBadge';
import { RiskBadge } from '../components/advisory/RiskBadge';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#070A0F] text-slate-100 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto mb-10">
          {/* Tagline pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SEE THE ROAD. UNDERSTAND THE RISK. PROTECT THE FUTURE.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 font-display leading-[1.08]">
            See the Road. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-white">
              Understand the Risk.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed mb-8">
            Cyclops transforms standard vehicle cameras into intelligent road-monitoring systems that detect hazards, assess risk, advise safe driving responses, record road conditions, and support smarter infrastructure decisions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] focus:outline-none"
            >
              <span>Launch Cyclops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/technology"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-slate-600 font-medium text-sm transition-all backdrop-blur"
            >
              <span>Explore the Technology</span>
            </Link>
          </div>
        </div>

        {/* HERO ROAD TELEMETRY VISUALIZATION */}
        <div className="mt-8 max-w-5xl mx-auto">
          <RoadVisualization />
        </div>
      </section>

      {/* 2. LIVE HAZARD INTELLIGENCE CARDS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-semibold block mb-1">
              Real-Time Classification
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Primary Hazard Categories
            </h2>
          </div>
          <DemoModeBadge text="SIMULATION FEEDS" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: 'Potholes',
              desc: 'Structural road cavities threatening rim deformation and suspension fatigue.',
              risk: 87,
              sev: 'HIGH',
              advisory: 'Reduce to 30 km/h',
              img: '/samples/pothole.jpg',
              accent: 'border-orange-500/40'
            },
            {
              title: 'Debris',
              desc: 'Loose obstacles and shed freight causing tire puncture and evasive collisions.',
              risk: 58,
              sev: 'MODERATE',
              advisory: 'Reduce to 40 km/h',
              img: '/samples/debris.jpg',
              accent: 'border-amber-500/40'
            },
            {
              title: 'Waterlogging',
              desc: 'Standing stormwater films inducing aquaplaning and submerged road damage.',
              risk: 78,
              sev: 'HIGH',
              advisory: 'Reduce to 25 km/h',
              img: '/samples/waterlogging.jpg',
              accent: 'border-cyan-500/40'
            },
            {
              title: 'Fallen Trees',
              desc: 'Catastrophic carriage blockages requiring emergency deceleration.',
              risk: 96,
              sev: 'CRITICAL',
              advisory: 'STOP / DO NOT PROCEED',
              img: '/samples/fallen_tree.jpg',
              accent: 'border-red-500/50'
            }
          ].map(card => (
            <div
              key={card.title}
              className={`rounded-xl border ${card.accent} bg-slate-900/60 p-5 flex flex-col justify-between transition-all duration-300 hover:border-cyan-400/60 group`}
            >
              <div>
                <div className="aspect-[16/10] rounded-lg overflow-hidden mb-4 border border-slate-800 bg-slate-950">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white font-display">{card.title}</h3>
                  <RiskBadge score={card.risk} severity={card.sev} size="sm" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {card.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">RECOMMENDED SPEED</span>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {card.advisory}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS WORKFLOW */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-semibold block mb-2">
              Autonomous Intelligence Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-4">
              From Camera Frame to Safety Action
            </h2>
            <p className="text-sm text-slate-400">
              CYCLOPS executes continuous high-frequency inference to detect road degradation, calculate multi-variable risk, and deliver tactical driver guidance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
            {[
              { step: '01', title: 'Capture', desc: 'Vehicle Dashcam / Sensor' },
              { step: '02', title: 'Preprocess', desc: 'Normalized Tensors' },
              { step: '03', title: 'Detect', desc: 'Feature Extraction' },
              { step: '04', title: 'Classify', desc: 'Hazard Categorization' },
              { step: '05', title: 'Assess', desc: 'Physics-Aware Risk' },
              { step: '06', title: 'Advise', desc: 'Speed & Maneuvers' },
              { step: '07', title: 'Alert', desc: 'Tactical Cockpit HUD' },
              { step: '08', title: 'Analyze', desc: 'Municipal Road Health' }
            ].map((s, idx) => (
              <div key={s.step} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400 font-bold mb-1">
                  {s.step}
                </span>
                <h4 className="text-sm font-bold text-white font-display mb-1">{s.title}</h4>
                <p className="text-[11px] text-slate-400 leading-tight">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold uppercase tracking-wider"
            >
              <span>Explore Interactive 8-Step Deep Dive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WHY CYCLOPS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-semibold block mb-2">
              Critical Infrastructure Need
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-6 leading-tight">
              Why Real-Time Hazard Intelligence Matters
            </h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                Road networks span thousands of kilometers and cannot be manually surveyed continuously. Hazards such as craters, debris, and ponding appear rapidly after heavy rain and heavy transport wear.
              </p>
              <p>
                Delayed detection leads to severe vehicular suspensions damage, rollover crashes, traffic congestion, and emergency response delays.
              </p>
              <p>
                CYCLOPS decentralizes road health intelligence across commercial fleets, municipal sweepers, transit buses, and consumer vehicles—creating a live, crowd-sourced digital twin of road safety.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-2xl font-black text-cyan-400 font-mono">10x Faster</div>
                <div className="text-xs text-slate-400 mt-1">Hazard Identification vs. Manual Survey</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-2xl font-black text-emerald-400 font-mono">-38%</div>
                <div className="text-xs text-slate-400 mt-1">Estimated Shock Damage to Vehicle Fleets</div>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="space-y-4">
            {[
              {
                title: 'Continuous Vision Monitoring',
                desc: 'Infers hazard signatures frame-by-frame with low latency at edge speeds.'
              },
              {
                title: 'Physics-Aware Speed Advisories',
                desc: 'Dynamically adapts deceleration targets according to vehicle mass and braking limits.'
              },
              {
                title: 'Road Health Indexing',
                desc: 'Aggregates surface anomalies to empower municipal engineers with prioritization data.'
              },
              {
                title: 'Environmental Slow-Down Metrics',
                desc: 'Models fuel wastage and emissions penalties resulting from recurring hazard congestion.'
              }
            ].map(f => (
              <div key={f.title} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-4">
                <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white font-display">{f.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VEHICLE ECOSYSTEM */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/70 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-semibold block mb-2">
              Vehicle-Aware Interpretation
            </span>
            <h2 className="text-3xl font-extrabold text-white font-display mb-3">
              Tailored Dynamics For Every Fleet Class
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A pothole causes differing risks to a passenger sedan versus a 40-ton commercial hauler or an emergency ambulance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { icon: Car, name: 'Passenger Cars', desc: 'Rim deformation, tire puncture, steering loss avoidance.' },
              { icon: Siren, name: 'Emergency Vehicles', desc: 'Tactical high-speed routing with priority clearance.' },
              { icon: Truck, name: 'Commercial Haulers', desc: 'Extended braking distance & rollover load stabilization.' },
              { icon: Bus, name: 'Transit Buses', desc: 'Standing passenger inertia & smooth deceleration.' },
              { icon: Wrench, name: 'Service Sweepers', desc: 'Road clearing logistics & municipal data collection.' }
            ].map(v => {
              const Icon = v.icon;
              return (
                <div key={v.name} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between text-center">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-display mb-1">{v.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold uppercase tracking-wider"
            >
              <span>View Vehicle Dynamics Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. ENVIRONMENTAL IMPACT SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-950 p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4">
              <Leaf className="w-3.5 h-3.5" />
              <span>ESTIMATED / MODEL-BASED METRICS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white font-display mb-4">
              Environmental &amp; Fuel Impact Intelligence
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
              Road degradation causes chronic deceleration, stop-and-go bottlenecking, and extended vehicular idle times. CYCLOPS calculates model-based estimates of excess fuel consumption and carbon penalties.
            </p>

            <div className="p-3 bg-black/60 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 mb-6">
              * Note: Cameras do not directly measure atmospheric emissions. Figures are derived from vehicle stop-start traffic flow and congestion deceleration models.
            </div>

            <Link
              to="/environment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all"
            >
              <span>Explore Environmental Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-gradient-to-b from-[#070A0F] to-[#040609] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-display mb-4">
            Start Exploring Cyclops
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mb-8 font-light">
            Deploy the simulated road hazard intelligence cockpit and test real-time detections across our Chennai demo corridor.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(0,229,255,0.4)]"
            >
              Launch Command Center
            </Link>
            <Link
              to="/detection"
              className="px-7 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-sm tracking-wider"
            >
              Test Detection Lab
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-slate-800 bg-[#040609] text-slate-500 text-xs font-mono text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            CYCLOPS &copy; {new Date().getFullYear()} • Autonomous Road Hazard &amp; Environmental Intelligence
          </div>
          <div className="flex items-center gap-4">
            <DemoModeBadge text="PROTOTYPE BUILD" />
            <span>Lightweight 8 GB RAM Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
