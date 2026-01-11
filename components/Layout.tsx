import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col h-[100dvh] w-full bg-rpg-900 text-slate-200 overflow-hidden font-sans ${className}`}>
      {children}
    </div>
  );
};
