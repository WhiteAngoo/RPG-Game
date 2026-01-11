import React from 'react';
import { Entity } from '../types';
import { ProgressBar } from './ProgressBar';

interface EntityCardProps {
  entity: Entity;
  isPlayer?: boolean;
}

export const EntityCard: React.FC<EntityCardProps> = ({ entity, isPlayer }) => {
  return (
    <div className={`p-4 rounded-lg border-2 ${isPlayer ? 'bg-slate-800 border-blue-600' : 'bg-red-900/20 border-red-600'}`}>
      <div className="flex items-center gap-4 mb-3">
        {entity.image && (
          <img src={entity.image} alt={entity.name} className="w-12 h-12 rounded bg-black object-cover border border-gray-600" />
        )}
        <div>
          <h3 className={`font-bold text-lg ${isPlayer ? 'text-blue-400' : 'text-red-400'}`}>{entity.name}</h3>
          <p className="text-xs text-gray-400">Lv. {entity.level} {entity.type}</p>
        </div>
      </div>

      <ProgressBar 
        current={entity.stats.hp || 0} 
        max={entity.stats.maxHp || 0} 
        colorClass="bg-red-500" 
        label="HP" 
      />
      {isPlayer && (
        <ProgressBar 
          current={entity.stats.mp || 0} 
          max={entity.stats.maxMp || 0} 
          colorClass="bg-blue-500" 
          label="MP" 
        />
      )}
      
      {!isPlayer && entity.description && (
        <p className="text-xs text-gray-400 italic mt-2 border-t border-gray-700 pt-2">
          "{entity.description}"
        </p>
      )}
    </div>
  );
};