import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getColor = (type: LogEntry['type']) => {
    switch(type) {
      case 'combat': return 'text-red-400';
      case 'danger': return 'text-orange-500 font-bold';
      case 'loot': return 'text-yellow-400';
      case 'narrative': return 'text-blue-300 italic';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-900/90 border-t border-b border-gray-700 font-mono text-sm space-y-2 min-h-[150px]">
      {logs.map((log) => (
        <div key={log.id} className={`${getColor(log.type)} animate-fadeIn`}>
          <span className="opacity-50 text-xs mr-2">[{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
          {log.message}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};
