import React, { useState } from 'react';

interface ActionPanelProps {
  onAction: (action: string) => void;
  suggestions: string[];
  disabled: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ onAction, suggestions, disabled }) => {
  const [customInput, setCustomInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim() && !disabled) {
      onAction(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <div className="flex-none bg-rpg-800 border-t border-rpg-700 p-3 pb-safe z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
      {/* Suggestions Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {suggestions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => onAction(action)}
            disabled={disabled}
            className="bg-rpg-700 hover:bg-rpg-600 active:bg-rpg-600 active:scale-95 transition-all text-xs font-medium py-3 px-2 rounded border border-rpg-600 text-left truncate disabled:opacity-50 disabled:cursor-not-allowed text-slate-200"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Custom Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="What do you want to do?"
          disabled={disabled}
          className="flex-1 bg-rpg-900 text-slate-200 text-sm rounded border border-rpg-600 px-3 py-3 focus:outline-none focus:border-rpg-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !customInput.trim()}
          className="bg-rpg-accent text-white rounded px-4 py-2 font-bold text-sm disabled:opacity-50 active:bg-blue-600 transition-colors"
        >
          Go
        </button>
      </form>
    </div>
  );
};
