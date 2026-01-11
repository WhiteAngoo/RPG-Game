import React from 'react';
import { Character } from '../types';

interface StatsBarProps {
  stats: Character;
  location: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats, location }) => {
  const hp = stats.currentStats.hp || 100;
  const maxHp = stats.currentStats.maxHp || 100;
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  return (
    <div className="flex-none bg-rpg-800 border-b border-rpg-700 p-3 shadow-md z-10">
      <div className="flex justify-between items-center mb-2 text-xs font-bold tracking-wider text-rpg-600 uppercase">
        <span>{location}</span>
        <span>Lvl 1 {stats.job}</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-400 font-bold">HP</span>
            <span className="text-slate-400">{hp}/{maxHp}</span>
          </div>
          <div className="h-2 bg-rpg-900 rounded-full overflow-hidden border border-rpg-700">
            <div 
              className="h-full bg-red-500 transition-all duration-500 ease-out"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-yellow-500 font-mono">
          <span>🪙</span>
          <span>{stats.gold}</span>
        </div>
      </div>
    </div>
  );
};