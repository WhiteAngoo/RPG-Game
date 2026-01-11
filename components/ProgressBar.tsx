import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  colorClass: string;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, max, colorClass, label }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  return (
    <div className="w-full mb-2">
      <div className="flex justify-between text-xs uppercase font-bold mb-1 tracking-wider text-gray-400">
        <span>{label}</span>
        <span>{current}/{max}</span>
      </div>
      <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
        <div 
          className={`h-full ${colorClass} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
