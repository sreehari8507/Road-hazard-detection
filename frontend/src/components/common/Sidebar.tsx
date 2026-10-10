import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  MapPin,
  ListFilter,
  ChevronRight,
  ShieldCheck
  , Cpu
} from 'lucide-react';
import { StatusIndicator } from './StatusIndicator';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload & Detect', path: '/detection', icon: UploadCloud },
    { name: 'Live Google Map', path: '/map', icon: MapPin },
    { name: 'Saved Records', path: '/history', icon: ListFilter },
    { name: 'Model Lab', path: '/model-lab', icon: Cpu },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#090D15] border-r border-slate-800/80 w-64 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            <div className="w-4 h-2 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center relative">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#EF4444]" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-wider text-white font-display">
              CY<span className="text-cyan-400">CL</span>OPS
            </h2>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Road Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
          Primary Modules
        </div>
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.1)] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </NavLink>
          );
        })}
      </nav>

      {/* Clean Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">System State</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            READY FOR INPUTS
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-mono text-slate-400">Backend API</span>
          <StatusIndicator />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
};
