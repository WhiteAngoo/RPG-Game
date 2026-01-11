
import React, { useState, useEffect } from 'react';
import { Character, City } from '../types';

interface MapViewProps {
  cities: City[];
  character: Character;
  activePlayers: any[];
  onStartTravel: (cityId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ cities, character, activePlayers, onStartTravel }) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(character.currentCityId);

  useEffect(() => {
    // 뷰가 열릴 때 현재 위치를 기본 선택
    setSelectedCityId(character.currentCityId);
  }, [character.currentCityId]);

  const selectedCity = cities.find(c => c.id === selectedCityId);

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Top Half: Visual Map Image (50%) */}
      <div className="h-1/2 relative bg-slate-900 overflow-hidden group border-b border-slate-800">
        {/* World Map Image */}
        <img 
          src="https://placehold.co/1200x800/1e293b/475569?text=World+Map"
          alt="World Map" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />

        {/* Cities Markers */}
        {cities.map(city => {
          const isSelected = city.id === selectedCityId;
          const isCurrent = city.id === character.currentCityId;

          return (
            <div
              key={city.id}
              onClick={() => setSelectedCityId(city.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 hover:z-20 hover:scale-110"
              style={{ left: `${city.coordinates.x}%`, top: `${city.coordinates.y}%` }}
            >
              <div className="relative flex items-center justify-center">
                {/* Selection Halo */}
                {isSelected && (
                  <div className="absolute w-10 h-10 bg-indigo-500/40 rounded-full animate-ping" />
                )}
                
                {/* Marker Shape */}
                {isSelected ? (
                   // Selected: Triangle
                   <div className="relative drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">
                     <div className="w-0 h-0 
                        border-l-[10px] border-l-transparent
                        border-r-[10px] border-r-transparent
                        border-b-[16px] border-b-indigo-500
                     " />
                     {isCurrent && <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-lg" />}
                   </div>
                ) : (
                  // Normal: Dot (Amber if current, Slate otherwise)
                  <div className={`w-3 h-3 rounded-full border-2 shadow-[0_0_5px_rgba(0,0,0,0.8)] transition-colors ${
                      isCurrent ? 'bg-amber-500 border-white' : 'bg-slate-800 border-slate-500 hover:bg-slate-600'
                    }`} 
                  />
                )}

                {/* Labels */}
                {isSelected && (
                  <div className="absolute top-full mt-2 whitespace-nowrap text-[10px] font-black px-2 py-1 rounded bg-black/90 text-white border border-indigo-500/50 z-30 shadow-xl">
                    {city.name}
                    {isCurrent && <span className="text-amber-500 ml-1">(Here)</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Half: City List (50%) */}
      <div className="h-1/2 bg-slate-950 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Destination</h3>
           <div className="text-[10px] text-slate-600">Total {cities.length} Areas</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {cities.map(city => {
            const isSelected = city.id === selectedCityId;
            const isCurrent = city.id === character.currentCityId;
            const playerCount = activePlayers.filter(p => p.cityId === city.id).length;

            return (
              <div 
                key={city.id}
                onClick={() => setSelectedCityId(city.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected 
                    ? 'bg-indigo-900/20 border-indigo-500/50 shadow-lg' 
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                     <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : isSelected ? 'bg-indigo-500' : 'bg-slate-600'}`} />
                     <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>{city.name}</span>
                  </div>
                  {playerCount > 0 && (
                    <span className="text-[9px] bg-slate-950 text-indigo-400 px-2 py-0.5 rounded-full font-bold border border-slate-800">{playerCount} Users</span>
                  )}
                </div>
                
                {isSelected && (
                  <div className="pl-4 border-l-2 border-indigo-500/30 ml-1 mt-1 animate-in fade-in slide-in-from-left-2 duration-200">
                    <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">{city.description}</p>
                    <div className="flex justify-between items-center">
                       <div className="flex gap-1">
                          {city.affinity.map(job => (
                            <span key={job} className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">{job} 우대</span>
                          ))}
                       </div>
                       
                       {isCurrent ? (
                         <button disabled className="bg-slate-800 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-700">
                            현재 위치
                         </button>
                       ) : (
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             onStartTravel(city.id);
                           }}
                           className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-lg shadow-lg active:scale-95 transition-colors"
                         >
                           이동하기
                         </button>
                       )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};