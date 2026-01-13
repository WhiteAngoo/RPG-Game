
import React from 'react';
import { Character, City, ItemType, TradeItem } from '../types';
import { TradeSystem } from '../services/gameService';
import { ItemSlot } from '../components/ItemSlot';
import { PurchaseModal } from '../components/PurchaseModal';

interface MarketViewProps {
  currentCity: City;
  character: Character;
  totalWeight: number;
  weightLimit: number;
  onBuyItem: (item: TradeItem, quantity?: number) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({ currentCity, character, totalWeight, weightLimit, onBuyItem }) => {
  const [selectedItem, setSelectedItem] = React.useState<TradeItem | null>(null);

  return (
    <div className="h-full flex flex-col p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Header Info */}
      <div className="flex justify-between items-end mb-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-xl font-black text-white italic tracking-wider mb-1">MARKETPLACE</h3>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{currentCity.name} Local Market</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Capacity</div>
          <div className={`text-sm font-black ${totalWeight > weightLimit * 0.9 ? 'text-red-400' : 'text-slate-300'}`}>
            {totalWeight.toFixed(1)} <span className="text-slate-600">/</span> {weightLimit} <span className="text-[10px] text-slate-600">kg</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex-1 bg-slate-900/30 rounded-xl overflow-y-auto p-4 border border-slate-800/50">
        <div className="grid grid-cols-7 gap-2 content-start">
          {currentCity.inventory.map((item, idx) => {
            // Convert TradeItem to Item-like interface for ItemSlot
            // We only need name for the letter icon logic inside ItemSlot to work roughly
            // But ItemSlot expects 'Item'. Let's check ItemSlot implementation.
            // ItemSlot checks 'item.type' and 'item.name'. TradeItem has these.
            // We can cast or just pass it as is if compatible.
            // TradeItem extends Omit<Item, 'id'>. ItemSlot expects Item (with id).
            // ItemSlot uses 'item.name.substring(0,1)'.
            // We can fake an ID or cast it.
            const displayItem = { ...item, id: `market-${idx}`, price: TradeSystem.getEffectivePrice(character.job, currentCity, item, true) } as any;

            return (
              <div key={idx} className="relative group">
                <ItemSlot
                  item={displayItem}
                  onClick={() => setSelectedItem(item)}
                  className="w-full aspect-square !rounded-xl !border-slate-700/50 hover:!border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all bg-slate-800/80"
                  showTooltip={false} // We will use a custom tooltip or rely on the modal
                />
                {/* Stock Badge */}
                <div className="absolute -top-1.5 -right-1.5 bg-slate-950 text-indigo-400 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-slate-700 shadow-lg z-10 pointer-events-none">
                  {item.stock}
                </div>
                {/* Price Tag (Hover) */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none pt-1">
                  <div className="bg-black/90 text-center rounded py-1 border border-slate-700">
                    <div className="text-[9px] font-bold text-amber-400">{displayItem.price.toLocaleString()} G</div>
                    <div className="text-[8px] text-slate-500">{item.name}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        character={character}
        unitPrice={selectedItem ? TradeSystem.getEffectivePrice(character.job, currentCity, selectedItem, true) : 0}
        onConfirm={(item, quantity) => {
          onBuyItem(item, quantity);
          setSelectedItem(null);
        }}
      />
    </div>
  );
};
