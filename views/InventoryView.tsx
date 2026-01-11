
import React, { useState } from 'react';
import { Character, City, Item } from '../types';
import { TradeSystem } from '../services/gameService';
import { ItemSlot } from '../components/ItemSlot';

interface InventoryViewProps {
  character: Character;
  currentCity: City;
  onSellItem: (item: Item) => void;
  onDiscardItem: (item: Item) => void;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  item: Item | null;
  count: number;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ character, currentCity, onSellItem, onDiscardItem }) => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    item: null,
    count: 0
  });
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Filter only items that can be traded according to TradeSystem rules
  const tradeableItems = character.inventory.filter(item => 
    TradeSystem.canTrade(character.job, item, false).can
  );

  const getItemCount = (itemName: string) => {
    return character.inventory.filter(i => i.name === itemName).length;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip.visible) {
      setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    }
  };

  const showTooltip = (e: React.MouseEvent, item: Item) => {
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      item: item,
      count: getItemCount(item.name)
    });
  };

  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleModalAction = (action: 'sell' | 'discard') => {
    if (!selectedItem) return;
    if (action === 'sell') {
      onSellItem(selectedItem);
    } else {
      onDiscardItem(selectedItem);
    }
    setSelectedItem(null);
  };

  return (
    <div className="p-5 animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
      <h3 className="text-lg font-black text-white italic mb-6">STASH (TRADEABLE)</h3>
      
      {tradeableItems.length === 0 ? (
        <div className="text-center text-slate-500 py-10 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-800 rounded-xl">
          거래 가능한 아이템이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2" onMouseMove={handleMouseMove}>
          {tradeableItems.map((item) => (
            <ItemSlot 
              key={item.id} 
              item={item} 
              className="w-full aspect-square"
              showTooltip={false} // 내부 툴팁 비활성화 (마우스 추적 툴팁 사용)
              onMouseEnter={(e) => showTooltip(e, item)}
              onMouseLeave={hideTooltip}
              onClick={() => handleItemClick(item)}
            />
          ))}
          {/* 빈 슬롯 채우기 (선택사항, 그리드 모양 유지를 위해 추가) */}
          {Array.from({ length: Math.max(0, 25 - tradeableItems.length) }).map((_, i) => (
             <ItemSlot key={`empty-${i}`} className="w-full aspect-square opacity-30 pointer-events-none" />
          ))}
        </div>
      )}

      {/* Mouse Follow Tooltip */}
      {tooltip.visible && tooltip.item && (
        <div 
          className="fixed z-[100] bg-slate-950/95 backdrop-blur border border-slate-600 p-3 rounded-lg shadow-2xl pointer-events-none min-w-[150px]"
          style={{ 
            top: `${tooltip.y + 15}px`, 
            left: `${Math.min(tooltip.x + 15, window.innerWidth - 170)}px` 
          }}
        >
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700">
             <span className="text-xs font-black text-white">{tooltip.item.name}</span>
             <span className="text-[9px] font-bold text-amber-500">x{tooltip.count}</span>
          </div>
          <div className="space-y-1">
             <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">구매처</span>
                <span className="text-slate-200 font-bold">{tooltip.item.originCity || 'Unknown'}</span>
             </div>
             <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">개당 가치</span>
                <span className="text-emerald-400 font-bold">{tooltip.item.price.toLocaleString()} G</span>
             </div>
             <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">무게</span>
                <span className="text-slate-200 font-bold">{TradeSystem.getWeight(character.job, tooltip.item)} kg</span>
             </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-[150] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-xs shadow-2xl space-y-4">
            <div className="text-center">
               <div className="w-16 h-16 bg-slate-800 rounded-xl mx-auto flex items-center justify-center mb-3 border border-slate-600">
                  <span className="text-2xl font-black text-white">{selectedItem.name.substring(0, 1)}</span>
               </div>
               <h3 className="text-lg font-black text-white">{selectedItem.name}</h3>
               <p className="text-xs text-slate-400 mt-1">{selectedItem.type} · {selectedItem.weight}kg</p>
            </div>
            
            <div className="bg-black/30 p-3 rounded-lg space-y-2">
               <div className="flex justify-between text-xs">
                  <span className="text-slate-500">구매처</span>
                  <span className="text-slate-300 font-bold">{selectedItem.originCity || '알 수 없음'}</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span className="text-slate-500">현재 가치</span>
                  {(() => {
                    const marketItem = currentCity.inventory.find(i => i.name === selectedItem.name);
                    const sellPrice = marketItem 
                      ? TradeSystem.getEffectivePrice(character.job, currentCity, marketItem, false)
                      : Math.floor(selectedItem.price * 0.5);
                    return <span className="text-emerald-400 font-bold">+{sellPrice.toLocaleString()} G</span>;
                  })()}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
               <button 
                 onClick={() => handleModalAction('sell')}
                 className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
               >
                 판매하기
               </button>
               <button 
                 onClick={() => handleModalAction('discard')}
                 className="bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
               >
                 버리기
               </button>
            </div>
            <button 
              onClick={() => setSelectedItem(null)}
              className="w-full py-3 text-slate-500 text-xs font-bold hover:text-slate-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
