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
    <button type="button" onClick={() => onClick(stall)} className="market-stall group block w-full bg-white text-left transition duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/40 dark:bg-slate-800 dark:focus-visible:ring-brand-gold/40">
      <div className="relative h-44 overflow-hidden bg-brand-blue/15 dark:bg-slate-700">
        {stall.banner_url ? <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={stall.banner_url} alt={`${stall.name} stall front`} /> : <div className="flex h-full items-center justify-center bg-[#f3dfbb] px-5 text-center text-xl font-bold text-brand-blue">{stall.name}</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/55 via-transparent to-transparent" />
        <span className="absolute right-3 top-3 rounded-full bg-[#fff9ed] px-3 py-1 text-xs font-extrabold text-brand-blue shadow-sm">{stall.category}</span>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-brand-blue/90 px-3 py-1 text-xs font-bold text-white"><Icon name="store" className="h-3.5 w-3.5 text-brand-gold" /> Visit stall</span>
      </div>
      <div className="relative px-5 pb-5 pt-4">
        <div className="absolute -top-8 left-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-brand-blue shadow-md dark:border-slate-800">
          {stall.logo_url ? <img className="h-full w-full object-cover" src={stall.logo_url} alt={`${stall.name} logo`} /> : <span aria-hidden="true" className="text-xl font-extrabold text-white">{stall.name.charAt(0).toUpperCase()}</span>}
        </div>
        <div className="min-w-0 pl-20"><h3 className="truncate text-xl font-extrabold text-brand-blue dark:text-brand-gold">{stall.name}</h3><p className="truncate text-sm text-brand-secondary dark:text-slate-400">{stall.slogan || 'Come see what is on the counter'}</p></div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-amber-900/10 pt-4 text-sm text-brand-secondary dark:text-slate-400">
          <span className="flex min-w-0 items-center gap-1"><Icon name="location" className="h-4 w-4 shrink-0 text-[#b84c32]" /><span className="truncate">{location}</span></span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 font-bold text-amber-800"><Icon name="star" className="h-4 w-4 text-brand-gold" />{averageRating ? `${averageRating}` : 'New'}</span>
        </div>
      </div>
    </button>
  );
};

export default StallCard;
