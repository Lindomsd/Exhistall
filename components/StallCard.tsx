
import React from 'react';
import type { Stall } from '../types';
import { Icon } from './Icon';

interface StallCardProps {
  stall: Stall;
  onClick: (stall: Stall) => void;
}

const StallCard: React.FC<StallCardProps> = ({ stall, onClick }) => {
  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer group"
      onClick={() => onClick(stall)}
    >
      <div className="relative">
        <img className="h-40 w-full object-cover" src={stall.bannerUrl} alt={`${stall.name} banner`} />
        <div className="absolute top-0 left-0 w-full h-full bg-black/30 group-hover:bg-black/10 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 bg-brand-gold text-brand-blue text-xs font-bold px-2 py-1 rounded-full">{stall.category}</div>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <img className="h-12 w-12 rounded-full object-cover border-2 border-brand-light dark:border-slate-600" src={stall.logoUrl} alt={`${stall.name} logo`} />
          <div>
            <h3 className="text-lg font-bold text-brand-blue dark:text-brand-gold">{stall.name}</h3>
            <p className="text-sm text-brand-secondary dark:text-slate-400 truncate">{stall.slogan}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm text-brand-secondary dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Icon name="location" className="h-4 w-4 text-brand-blue dark:text-brand-gold" />
            <span>{stall.location.address.split(',')[1]}</span>
          </div>
          <div className="flex items-center gap-1">
             <Icon name="star" className="h-4 w-4 text-brand-gold" />
            <span>{stall.reviews.length > 0 ? (stall.reviews.reduce((acc, r) => acc + r.rating, 0) / stall.reviews.length).toFixed(1) : 'New'} ({stall.reviews.length})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StallCard;
