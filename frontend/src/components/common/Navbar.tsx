import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, UploadCloud, MapPin, ListFilter } from 'lucide-react';
import { StatusIndicator } from './StatusIndicator';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload & Detect', path: '/detection', icon: UploadCloud },
    { name: 'Google Map', path: '/map', icon: MapPin },
    { name: 'Incident Records', path: '/history', icon: ListFilter },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#070A0F]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* BRAND LOGO */}
        <Link to="/dashboard" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 group-hover:border-cyan-400 flex items-center justify-center transition-all duration-300 shadow-md">
            <div className="w-5 h-2.5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center relative overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-wider text-white font-display">
              CY<span className="text-cyan-400">CL</span>OPS
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              AI ROAD SAFETY
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT STATUS INDICATOR */}
        <div className="hidden sm:flex items-center gap-3">
          <StatusIndicator />
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <div className="flex sm:hidden items-center gap-2">
          <StatusIndicator />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-800 bg-[#070A0F]/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
