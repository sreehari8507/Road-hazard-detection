import React, { useState, useEffect } from 'react';
import { apiClient, onBackendStatusChange } from '../../services/apiClient';

export const StatusIndicator: React.FC = () => {
  const [online, setOnline] = useState<boolean>(apiClient.getBackendStatus());

  useEffect(() => {
    // Initial check
    apiClient.checkHealth().then(res => {
      setOnline(res.status === 'online');
    });

    const unsubscribe = onBackendStatusChange((isOnline) => {
      setOnline(isOnline);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
      <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
      <span className={online ? 'text-emerald-400' : 'text-amber-300'}>
        {online ? 'API ONLINE' : 'LOCAL SIMULATION'}
      </span>
    </div>
  );
};
