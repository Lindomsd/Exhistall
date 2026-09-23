import React from 'react';
import type { Stall } from '../types';
import { Icon } from './Icon';

interface StallCardProps {
  stall: Stall;
  onClick: (stall: Stall) => void;
}

const StallCard: React.FC<StallCardProps> = ({ stall, onClick }) => {
  const averageRating = stall.reviews.length
    ? (stall.reviews.reduce((total, review) => total + review.rating, 0) / stall.reviews.length).toFixed(1)
    : null;
  const location = stall.location.address.split(',').map((part) => part.trim()).filter(Boolean).pop() || 'Online / location on request';

  return (
    <button type="button" onClick={() => onClick(stall)} className="group block w-full overflow-hidden rounded-lg bg-white text-left shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/40 dark:bg-slate-800 dark:focus-visible:ring-brand-gold/40">
      <div className="relative h-40 bg-brand-blue/15 dark:bg-slate-700">
        {stall.banner_url ? <img className="h-full w-full object-cover" src={stall.banner_url} alt={`${stall.name} banner`} /> : <div className="flex h-full items-center justify-center text-lg font-bold text-brand-blue dark:text-brand-gold">{stall.name}</div>}
        <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/10" />
        <span className="absolute right-2 top-2 rounded-full bg-brand-gold px-2 py-1 text-xs font-bold text-brand-blue">{stall.category}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          {stall.logo_url ? <img className="h-12 w-12 rounded-full border-2 border-brand-light object-cover dark:border-slate-600" src={stall.logo_url} alt={`${stall.name} logo`} /> : <div aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-light bg-brand-blue text-lg font-bold text-white dark:border-slate-600">{stall.name.charAt(0).toUpperCase()}</div>}
          <div className="min-w-0"><h3 className="truncate text-lg font-bold text-brand-blue dark:text-brand-gold">{stall.name}</h3><p className="truncate text-sm text-brand-secondary dark:text-slate-400">{stall.slogan || 'Explore this stall'}</p></div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-brand-secondary dark:text-slate-400">
          <span className="flex min-w-0 items-center gap-1"><Icon name="location" className="h-4 w-4 shrink-0 text-brand-blue dark:text-brand-gold" /><span className="truncate">{location}</span></span>
          <span className="flex shrink-0 items-center gap-1"><Icon name="star" className="h-4 w-4 text-brand-gold" />{averageRating ? `${averageRating} (${stall.reviews.length})` : 'New'}</span>
        </div>
      </div>
    </button>
  );
};

export default StallCard;
