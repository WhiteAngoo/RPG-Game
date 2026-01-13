import React from 'react';
import { Item, ItemType } from '../types';
import { ITEM_IMAGES } from '../itemAssets';

interface ItemSlotProps {
  item?: Item;
  type?: string;
  onClick?: () => void;
  className?: string;
  showTooltip?: boolean;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

export const ItemSlot: React.FC<ItemSlotProps> = ({
  item,
  type,
  onClick,
  className,
  showTooltip = true,
  onMouseEnter,
  onMouseLeave
}) => (
  <div
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`bg-slate-900 border border-slate-800 rounded-sm flex items-center justify-center relative hover:border-amber-500 transition-colors cursor-pointer group ${className || 'w-10 h-10'}`}
  >
    {type && !item && (
      <span className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">{type}</span>
    )}
    {item && (
      <>
        <div className={`w-full h-full p-1 rounded-sm ${item.type === ItemType.MAGIC ? 'bg-purple-900/20' : item.type === ItemType.STOLEN ? 'bg-red-900/20' : 'bg-slate-700/20'} flex items-center justify-center overflow-hidden`}>
          {ITEM_IMAGES[item.name] ? (
            <img src={ITEM_IMAGES[item.name]} alt={item.name} className="w-full h-full object-contain pixelated" style={{ imageRendering: 'pixelated' }} />
          ) : (
            <span className="text-[10px] font-black text-white/50">{item.name.substring(0, 1)}</span>
          )}
        </div>
        {/* 내부 툴팁 (showTooltip이 true일 때만 렌더링) */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-black/90 border border-slate-600 p-2 rounded z-50 hidden group-hover:block pointer-events-none z-[100]">
            <div className="text-[10px] font-bold text-white">{item.name}</div>
            <div className="text-[9px] text-amber-400">{item.price.toLocaleString()} G</div>
            <div className="text-[8px] text-slate-400">{item.type} · {item.weight}kg</div>
          </div>
        )}
      </>
    )}
  </div>
);
