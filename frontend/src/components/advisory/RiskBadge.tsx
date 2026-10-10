import React from 'react';

interface RiskBadgeProps {
  score: number;
  severity?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, severity, size = 'md' }) => {
  let label = severity ? severity.toUpperCase() : 'LOW';
  let colorClass = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';

  if (score > 75 || label === 'CRITICAL') {
    label = 'CRITICAL';
    colorClass = 'bg-red-950/80 text-red-400 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.25)]';
  } else if (score > 50 || label === 'HIGH') {
    label = 'HIGH';
    colorClass = 'bg-orange-950/80 text-orange-400 border-orange-500/50';
  } else if (score > 25 || label === 'MODERATE') {
    label = 'MODERATE';
    colorClass = 'bg-amber-950/80 text-amber-300 border-amber-500/40';
  } else {
    label = 'LOW';
    colorClass = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm font-semibold'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-mono tracking-wider font-bold ${colorClass} ${sizeClasses[size]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{label}</span>
      <span className="opacity-60 text-[10px]">({score}/100)</span>
    </span>
  );
};
