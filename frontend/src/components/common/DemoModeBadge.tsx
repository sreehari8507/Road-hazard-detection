import React from 'react';

export const DemoModeBadge: React.FC<{ text?: string }> = ({ text = "DEMO MODE" }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
      {text}
    </span>
  );
};
