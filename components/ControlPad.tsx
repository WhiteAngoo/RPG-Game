import React from 'react';
import { GameState } from '../types';
import { Sword, Shield, Footprints, Skull, Sparkles } from 'lucide-react';

interface ControlPadProps {
  gameState: GameState;
  onExplore: () => void;
  onAttack: () => void;
  onDefend: () => void;
  onHeal: () => void;
  onFlee: () => void;
  isBusy: boolean;
}

export const ControlPad: React.FC<ControlPadProps> = ({ 
  gameState, 
  onExplore, 
  onAttack, 
  onDefend, 
  onHeal,
  onFlee,
  isBusy 
}) => {
  const btnBase = "flex flex-col items-center justify-center p-4 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border-b-4";

  if (gameState === GameState.EXPLORING) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        <button 
          onClick={onExplore} 
          disabled={isBusy}
          className={`${btnBase} bg-amber-600 border-amber-800 hover:bg-amber-500 text-white`}
        >
          <Footprints size={32} className="mb-1" />
          <span>EXPLORE FORWARD</span>
        </button>
      </div>
    );
  }

  if (gameState === GameState.COMBAT) {
    return (
      <div className="grid grid-cols-2 gap-3 p-4">
        <button 
          onClick={onAttack} 
          disabled={isBusy}
          className={`${btnBase} bg-red-600 border-red-800 hover:bg-red-500 text-white col-span-2`}
        >
          <Sword size={32} className="mb-1" />
          <span>ATTACK</span>
        </button>
        <button 
          onClick={onDefend} 
          disabled={isBusy}
          className={`${btnBase} bg-slate-600 border-slate-800 hover:bg-slate-500 text-white`}
        >
          <Shield size={24} className="mb-1" />
          <span>DEFEND</span>
        </button>
         <button 
          onClick={onHeal} 
          disabled={isBusy}
          className={`${btnBase} bg-green-600 border-green-800 hover:bg-green-500 text-white`}
        >
          <Sparkles size={24} className="mb-1" />
          <span>HEAL (10MP)</span>
        </button>
        <button 
          onClick={onFlee} 
          disabled={isBusy}
          className={`${btnBase} bg-yellow-600 border-yellow-800 hover:bg-yellow-500 text-white col-span-2`}
        >
          <Footprints size={24} className="mb-1" />
          <span>FLEE</span>
        </button>
      </div>
    );
  }

  return null;
};
