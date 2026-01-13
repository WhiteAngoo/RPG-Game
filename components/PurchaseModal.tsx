
import React, { useState, useEffect, useMemo } from 'react';
import { TradeItem, Character, ItemType } from '../types';
import { WEIGHT_LIMIT_MULTIPLIER } from '../constants';
import { GameService } from '../services/gameService';

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: TradeItem | null;
    character: Character;
    unitPrice: number;
    onConfirm: (item: TradeItem, quantity: number) => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
    isOpen,
    onClose,
    item,
    character,
    unitPrice,
    onConfirm
}) => {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (isOpen) setQuantity(1);
    }, [isOpen, item]);

    if (!isOpen || !item) return null;

    const weightLimit = character.currentStats.str * WEIGHT_LIMIT_MULTIPLIER;
    const currentTotalWeight = GameService.calculateTotalWeight(character.inventory, character.job);

    const totalPrice = unitPrice * quantity;
    const totalItemWeight = item.weight * quantity;
    const isAffordable = character.gold >= totalPrice;
    const isWeightOk = (currentTotalWeight + totalItemWeight) <= weightLimit;
    const isStockOk = quantity <= item.stock;

    const canBuy = isAffordable && isWeightOk && isStockOk;

    // Calculate Max buyable based on constraints
    const maxByStock = item.stock;
    const maxByGold = Math.floor(character.gold / unitPrice);
    const maxByWeight = Math.floor((weightLimit - currentTotalWeight) / item.weight);

    const absoluteMax = Math.max(1, Math.min(maxByStock, maxByGold, maxByWeight));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${item.type === ItemType.MAGIC ? 'bg-purple-900/50' : item.type === ItemType.STOLEN ? 'bg-red-900/50' : 'bg-slate-700/50'} flex items-center justify-center border border-white/10`}>
                        <span className="text-xl font-black text-white">{item.name.substring(0, 1)}</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white leading-none mb-1">{item.name}</h3>
                        <div className="text-xs text-slate-400 font-medium">{item.type} · 개당 {item.weight}kg</div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-6">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                            <div className="text-slate-500 font-bold mb-1">단가</div>
                            <div className="text-amber-400 font-black">{unitPrice.toLocaleString()} G</div>
                        </div>
                        <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                            <div className="text-slate-500 font-bold mb-1">재고</div>
                            <div className="text-slate-200 font-black">{item.stock} 개</div>
                        </div>
                    </div>

                    {/* Quantity Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-400">구매 수량</span>
                            <span className="text-indigo-400">{quantity} 개</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max={absoluteMax || 1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            disabled={absoluteMax <= 0}
                        />
                        <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase">
                            <span>1</span>
                            <span>Max {absoluteMax}</span>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 font-bold">총 가격</span>
                            <span className={`font-black ${isAffordable ? 'text-amber-400' : 'text-red-400'}`}>
                                {totalPrice.toLocaleString()} G
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-bold">총 무게</span>
                            <span className={`font-bold ${isWeightOk ? 'text-slate-300' : 'text-red-400'}`}>
                                {totalItemWeight} kg <span className="text-slate-600">/ {(weightLimit - currentTotalWeight).toFixed(1)} kg left</span>
                            </span>
                        </div>
                    </div>

                    {/* Warning Messages */}
                    {!isAffordable && <div className="text-[10px] text-red-400 font-bold text-center bg-red-950/30 py-1 rounded">골드가 부족합니다!</div>}
                    {!isWeightOk && <div className="text-[10px] text-red-400 font-bold text-center bg-red-950/30 py-1 rounded">무게 한도를 초과합니다!</div>}

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50 grid grid-cols-2 gap-3">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => canBuy && onConfirm(item, quantity)}
                        disabled={!canBuy}
                        className={`w-full py-2.5 rounded-xl font-black text-xs transition-all ${canBuy
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg active:scale-95'
                                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            }`}
                    >
                        구매 확정
                    </button>
                </div>

            </div>
        </div>
    );
};
