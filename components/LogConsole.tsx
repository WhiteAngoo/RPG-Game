
import React, { useRef, useEffect } from 'react';
import { CombatLog } from '../types';

interface LogConsoleProps {
  logs: CombatLog[];
}

export const LogConsole: React.FC<LogConsoleProps> = ({ logs }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="fixed bottom-[72px] left-0 right-0 h-32 bg-slate-950/90 border-t border-slate-800 p-2 overflow-y-auto text-[10px] font-mono z-10 flex flex-col gap-1 backdrop-blur-sm shadow-2xl">
      <div className="sticky top-0 bg-slate-950/50 text-slate-500 font-bold uppercase mb-1 px-1 flex justify-between">
        <span>Global Feed</span>
        <span className="animate-pulse">● Live Network</span>
      </div>
      {logs.map((log) => (
        <div key={log.id} className={`px-2 py-0.5 rounded ${
          log.type === 'error' ? 'text-red-400 bg-red-400/10' : 
          log.type === 'combat' ? 'text-orange-300 bg-orange-300/10 font-bold' : 
          log.type === 'trade' ? 'text-emerald-400' : 
          log.type === 'network' ? 'text-indigo-400 italic' : 
          log.type === 'narrative' ? 'text-cyan-300 italic' : 
          log.type === 'danger' ? 'text-red-500 font-black' : 
          'text-slate-400'}`}>
          <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
          {log.message}
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
};
