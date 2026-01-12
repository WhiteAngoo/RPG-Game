
import React from 'react';

interface BottomNavProps {
  currentView: string;
  onViewChange: (view: 'inventory' | 'shop' | 'map' | 'character' | 'admin') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 flex justify-around p-3 pb-6 z-[30]">
      <button onClick={() => onViewChange('character')} className={`flex flex-col items-center gap-1 p-2 ${currentView === 'character' ? 'text-indigo-400' : 'text-slate-500'}`}>
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <span className="text-[10px] font-black uppercase tracking-tighter">Char</span>
      </button>
      <button onClick={() => onViewChange('shop')} className={`flex flex-col items-center gap-1 p-2 ${currentView === 'shop' ? 'text-indigo-400' : 'text-slate-500'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        <span className="text-[10px] font-black uppercase tracking-tighter">Market</span>
      </button>
      <button onClick={() => onViewChange('inventory')} className={`flex flex-col items-center gap-1 p-2 ${currentView === 'inventory' ? 'text-indigo-400' : 'text-slate-500'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 5h6v2H9V5zm11 15H4V9h16v11z" /></svg>
        <span className="text-[10px] font-black uppercase tracking-tighter">Stash</span>
      </button>
      <button onClick={() => onViewChange('map')} className={`flex flex-col items-center gap-1 p-2 ${currentView === 'map' ? 'text-indigo-400' : 'text-slate-500'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.488V5.512a2 2 0 011.553-1.954L9 2l5.447 2.724A2 2 0 0116 6.512v9.976a2 2 0 01-1.553 1.954L9 20z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 2v18" /></svg>
        <span className="text-[10px] font-black uppercase tracking-tighter">World</span>
      </button>
      <button onClick={() => onViewChange('admin')} className={`flex flex-col items-center gap-1 p-2 ${currentView === 'admin' ? 'text-indigo-400' : 'text-slate-500'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <span className="text-[10px] font-black uppercase tracking-tighter text-amber-500/80">Assets</span>
      </button>
    </nav>
  );
};
