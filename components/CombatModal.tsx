import React from 'react';
import { Character, Encounter } from '../types';

interface CombatModalProps {
  encounter: Encounter | null;
  character: Character | null;
  combatAnim: { playerHp: number; enemyHp: number } | null;
  narrative?: string;
  isProcessing?: boolean;
  onBattle: () => void;
  onMagic: () => void;
  onBribe: () => void;
  onFlee: () => void;
}

export const CombatModal: React.FC<CombatModalProps> = ({ 
  encounter, 
  character, 
  combatAnim, 
  narrative,
  isProcessing,
  onBattle, 
  onMagic,
  onBribe, 
  onFlee 
}) => {
  if (!encounter) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-6 animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Ambient Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none" />
        
        {combatAnim ? (
          <div className="flex flex-col gap-6 py-2 relative z-10 flex-1 overflow-y-auto">
            <div className="text-center font-black text-white text-xl italic uppercase tracking-widest animate-pulse">Engaging Combat!</div>
            
            <div className="space-y-6">
              {/* Player HP */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black text-indigo-400 uppercase"><span>{character?.name}</span><span>{combatAnim.playerHp}/100</span></div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${combatAnim.playerHp}%` }} /></div>
              </div>
              
              {/* VS Indicator / Processing Spinner */}
              <div className="flex justify-center h-12 items-center">
                 {isProcessing ? (
                   <div className="w-8 h-8 rounded-full border-4 border-slate-500 border-t-white animate-spin"></div>
                 ) : (
                   <div className="text-2xl font-black text-red-500 italic">VS</div>
                 )}
              </div>
              
              {/* Enemy HP */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black text-red-400 uppercase"><span>{encounter.name}</span><span>{combatAnim.enemyHp}/100</span></div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${combatAnim.enemyHp}%` }} /></div>
              </div>

              {/* Narrative Log */}
              {narrative && (
                <div className="bg-black/40 border border-slate-700 p-4 rounded-xl text-xs text-slate-300 leading-relaxed italic animate-in fade-in slide-in-from-bottom-2">
                  "{narrative}"
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button 
                onClick={onBattle} 
                disabled={isProcessing}
                className="bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                <span>⚔️</span> ATTACK
              </button>
              <button 
                onClick={onMagic} 
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                <span>✨</span> MAGIC
              </button>
              <button 
                onClick={onBribe} 
                disabled={isProcessing}
                className="bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                <span>💰</span> BRIBE
              </button>
              <button 
                onClick={onFlee} 
                disabled={isProcessing}
                className="bg-slate-600 hover:bg-slate-500 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                <span>🏃</span> FLEE
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 font-bold animate-pulse">
            Loading Encounter...
          </div>
        )}
      </div>
    </div>
  );
};