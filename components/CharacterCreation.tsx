
import React from 'react';
import { JobClass, NetworkState } from '../types';
import { JOB_DEFINITIONS, JOB_IMAGES } from '../constants';

interface CharacterCreationProps {
  networkState: NetworkState;
  onSelectClass: (job: JobClass) => void;
}

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ networkState, onSelectClass }) => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col z-[100] font-sans selection:bg-amber-500/30">
      {/* Cinematic Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">CLASS</span> SELECT
          </h1>
          <p className="text-amber-500/80 font-bold tracking-[0.5em] text-xs md:text-sm mt-2 ml-1">CHOOSE YOUR DESTINY</p>
        </div>
        
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-auto">
          <div className={`w-2 h-2 rounded-full ${networkState.serverStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'}`} />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            {networkState.serverStatus === 'connected' ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* 2x2 Grid Layout */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-2 h-full">
        {Object.values(JOB_DEFINITIONS).map((def) => (
          <div
            key={def.type}
            onClick={() => onSelectClass(def.type)}
            className="relative group overflow-hidden cursor-pointer border border-white/5 hover:border-amber-500/50 hover:z-10 transition-all duration-300"
          >
            {/* Image Background with zoom effect */}
            <div className="absolute inset-0 bg-slate-900">
              <img
                src={JOB_IMAGES[def.type]}
                alt={def.type}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out filter grayscale group-hover:grayscale-0"
              />
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
            <div className={`absolute inset-0 bg-gradient-to-t ${def.color.replace('bg-', 'from-')}/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay`} />

            {/* Character Info */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              {/* Class Icon/Name */}
              <div className="flex items-end gap-4 mb-4">
                <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg">
                  {def.type}
                </h2>
                <div className={`h-1 flex-1 mb-3 bg-gradient-to-r ${def.color.replace('bg-', 'from-')} to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500`} />
              </div>

              {/* Description */}
              <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed max-w-md opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                {def.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mt-6 border-t border-white/10 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                  {[
                    { label: 'STR', val: def.maxStats.str },
                    { label: 'INT', val: def.maxStats.int },
                    { label: 'DEX', val: def.maxStats.dex },
                    { label: 'WIS', val: def.maxStats.wis }
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="text-[10px] font-bold text-white/40 mb-1">{stat.label}</div>
                      <div className="text-lg font-black text-white">{stat.val}</div>
                      <div className="h-0.5 bg-white/20 mt-1 rounded-full overflow-hidden">
                        <div className={`h-full bg-white`} style={{ width: `${stat.val}%` }} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
