
import React from 'react';
import { Character, City, Item } from '../types';
import { TradeSystem } from '../services/gameService';

interface InventoryViewProps {
  character: Character;
  currentCity: City;
  onSellItem: (item: Item) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ character, currentCity, onSellItem }) => {
  return (
    <div className="p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="text-lg font-black text-white italic mb-6">STASH</h3>
      <div className="space-y-3">
        {character.inventory.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-900 flex justify-between items-center">
            <div className="flex-1 mr-4">
              <div className="font-bold text-white mb-1">{item.name}</div>
              <div className="text-[10px] text-slate-500 font-medium">무게: {TradeSystem.getWeight(character.job, item)}kg</div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-black text-sm mb-2">+{TradeSystem.getEffectivePrice(character.job, currentCity, currentCity.inventory.find(i => i.name === item.name) || currentCity.inventory[0], false).toLocaleString()} G</div>
              <button onClick={() => onSellItem(item)} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold active:scale-95">판매</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
