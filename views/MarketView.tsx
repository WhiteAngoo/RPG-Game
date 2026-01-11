
import React from 'react';
import { Character, City, ItemType, TradeItem } from '../types';
import { TradeSystem } from '../services/gameService';

interface MarketViewProps {
  currentCity: City;
  character: Character;
  totalWeight: number;
  weightLimit: number;
  onBuyItem: (item: TradeItem) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({ currentCity, character, totalWeight, weightLimit, onBuyItem }) => {
  return (
    <div className="p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-white italic">SHARED MARKET</h3>
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Weight</div>
          <div className={`text-xs font-black ${totalWeight > weightLimit * 0.9 ? 'text-red-400' : 'text-slate-300'}`}>
            {totalWeight} / {weightLimit} kg
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {currentCity.inventory.map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl border border-slate-800 bg-slate-900 flex justify-between items-center shadow-md">
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white">{item.name}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded font-black ${item.type === ItemType.MAGIC ? 'bg-purple-900 text-purple-200' : item.type === ItemType.STOLEN ? 'bg-red-900 text-red-200' : 'bg-slate-800 text-slate-400'}`}>{item.type}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">실시간 재고: {item.stock} · {item.weight}kg</div>
            </div>
            <div className="text-right">
              <div className="text-amber-400 font-black text-sm mb-2">{TradeSystem.getEffectivePrice(character.job, currentCity, item, true).toLocaleString()} G</div>
              <button onClick={() => onBuyItem(item)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold active:scale-95">구매</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
