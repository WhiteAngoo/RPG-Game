
import React from 'react';
import { Character, City, JobClass } from '../types';
import { JOB_DEFINITIONS } from '../constants';

const StatBar: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => (
  <div className="flex flex-col gap-0.5 mb-2">
    <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
      <span>{label}</span>
      <span>{value} / {max}</span>
    </div>
    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${(value / max) * 100}%` }} />
    </div>
  </div>
);

interface GameHeaderProps {
  character: Character;
  currentCity?: City;
  currentView: string;
  onNavigateToMap: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ character, currentCity, currentView, onNavigateToMap }) => {
  return (
    <header className="p-5 bg-slate-900 border-b border-slate-800 z-20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black text-white ${JOB_DEFINITIONS[character.job].color}`}>
              {character.job}
            </span>
            <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Rank F</span>
          </div>
          <h1 className="text-2xl font-black text-white">{character.name}</h1>
        </div>
        <div className="text-right">
          <div className="text-amber-400 font-black text-xl leading-none">
            {character.gold.toLocaleString()}<span className="text-xs ml-1">G</span>
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Funds</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <StatBar label="STR" value={character.currentStats.str} max={JOB_DEFINITIONS[character.job].maxStats.str} color="bg-red-500" />
        <StatBar label="INT" value={character.currentStats.int} max={JOB_DEFINITIONS[character.job].maxStats.int} color="bg-blue-500" />
        <StatBar label="DEX" value={character.currentStats.dex} max={JOB_DEFINITIONS[character.job].maxStats.dex} color="bg-emerald-500" />
        <StatBar label="WIS" value={character.currentStats.wis} max={JOB_DEFINITIONS[character.job].maxStats.wis} color="bg-amber-500" />
      </div>

      {currentView !== 'character' && currentCity && (
        <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div className="overflow-hidden">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Location</div>
            <div className="text-sm font-black text-white truncate">{currentCity.name}</div>
          </div>
          <button onClick={onNavigateToMap} className="ml-auto bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-slate-300">도시 이동</button>
        </div>
      )}
    </header>
  );
};
