
import React from 'react';
import { Character, Item } from '../types';
import { JOB_IMAGES } from '../constants';
import { ItemSlot } from '../components/ItemSlot';

interface CharacterViewProps {
  character: Character;
  onSellItem: (item: Item) => void;
}

export const CharacterView: React.FC<CharacterViewProps> = ({ character, onSellItem }) => {
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Top Section: Split 50/50 */}
      <div className="h-[45%] flex border-b border-slate-800">
        {/* Left: Character Image */}
        <div className="w-1/2 bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
          <img 
            src={JOB_IMAGES[character.job]} 
            alt={character.job} 
            className="max-h-full max-w-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] z-0" 
          />
          <div className="absolute bottom-2 left-3 z-20">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{character.job}</div>
             <div className="text-lg font-black text-white italic leading-none">Lv.1</div>
          </div>
        </div>

        {/* Right: Equipment Slots (Visual) */}
        <div className="w-1/2 bg-slate-950 p-4 flex flex-col justify-center">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Equipment</h3>
          <div className="grid grid-cols-2 gap-3 justify-items-center">
            <ItemSlot type="HEAD" />
            <ItemSlot type="BODY" />
            <ItemSlot type="MAIN" />
            <ItemSlot type="OFF" />
            <ItemSlot type="LEGS" />
            <ItemSlot type="FEET" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Stash Grid */}
      <div className="flex-1 bg-slate-900/50 p-4 overflow-y-auto">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black text-white italic">INVENTORY</h3>
            <div className="text-[10px] font-bold text-slate-500 uppercase">{character.inventory.length} Items</div>
         </div>
         {/* Grid gap removed (gap-0) and columns kept at 7 */}
         <div className="grid grid-cols-7 gap-0 content-start">
            {/* Render Actual Inventory Items */}
            {character.inventory.map((item) => (
              <ItemSlot 
                key={item.id} 
                item={item} 
                onClick={() => onSellItem(item)} 
                className="w-full aspect-square" 
              />
            ))}
            {/* Fill remaining slots to look like a grid bag (e.g. up to 35 slots for 7x5) */}
            {Array.from({ length: Math.max(0, 35 - character.inventory.length) }).map((_, i) => (
              <ItemSlot 
                key={`empty-${i}`} 
                className="w-full aspect-square" 
              />
            ))}
         </div>
      </div>
    </div>
  );
};
