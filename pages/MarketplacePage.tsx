import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Icon } from '../components/Icon';
import type { Stall, User } from '../types';

interface MarketplacePageProps { stalls: Stall[]; onNavigate: (page: string, stallId?: string) => void; onStallClick: (stall: Stall) => void; onSearch: (query: string) => void; currentUser: User | null; onLogout: () => void; }

type SortMode = 'featured' | 'price-low' | 'price-high' | 'name';

const MarketplacePage: React.FC<MarketplacePageProps> = ({ stalls, onNavigate, onSearch, currentUser, onLogout, onStallClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1500);
  const [sort, setSort] = useState<SortMode>('featured');
  const categories = useMemo(() => ['all', ...Array.from(new Set(stalls.map((stall) => stall.category))).sort()], [stalls]);
  const products = useMemo(() => stalls.flatMap((stall) => stall.products.map((product) => ({ product, stall }))), [stalls]);
  const highestPrice = useMemo(() => Math.max(100, ...products.map(({ product }) => product.price)), [products]);
  const activeStalls = new Set(products.map(({ stall }) => stall.id)).size;

  const filteredProducts = useMemo(() => products.filter(({ product, stall }) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || [product.name, product.description, stall.name, stall.category].some((value) => value.toLowerCase().includes(query));
    return matchesSearch && (category === 'all' || stall.category === category) && product.price <= maxPrice;
  }).sort((a, b) => {
    if (sort === 'price-low') return a.product.price - b.product.price;
    if (sort === 'price-high') return b.product.price - a.product.price;
    if (sort === 'name') return a.product.name.localeCompare(b.product.name);
    return Number(b.stall.featured) - Number(a.stall.featured) || a.stall.name.localeCompare(b.stall.name);
  }), [products, searchTerm, category, maxPrice, sort]);

  const resetFilters = () => { setSearchTerm(''); setCategory('all'); setMaxPrice(highestPrice); setSort('featured'); };

  return <>
    <Header onNavigate={onNavigate} onSearch={onSearch} currentUser={currentUser} onLogout={onLogout} />
    <main className="market-canvas min-h-screen">
      <section className="market-grain overflow-hidden bg-brand-blue px-4 py-12 text-white sm:px-6 lg:px-8"><div className="container mx-auto max-w-6xl"><p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-brand-gold"><span className="h-2 w-2 rounded-full bg-brand-gold" /> You are in the market</p><div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="market-display-font max-w-3xl text-5xl font-bold leading-none sm:text-6xl">Take a turn down the aisles.</h1><p className="mt-4 max-w-2xl text-lg text-blue-100">Browse the counters, discover something unexpected, then step into a stall to meet the people behind it.</p></div><div className="grid grid-cols-2 gap-3 text-center"><div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3"><strong className="market-display-font block text-3xl text-brand-gold">{activeStalls}</strong><span className="text-xs font-bold uppercase tracking-wide text-blue-100">stalls stocked</span></div><div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3"><strong className="market-display-font block text-3xl text-brand-gold">{products.length}</strong><span className="text-xs font-bold uppercase tracking-wide text-blue-100">items out</span></div></div></div></div></section>
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="market-stall bg-white p-5 dark:bg-slate-800"><div className="flex flex-col gap-5"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><label className="relative block min-w-0 flex-1"><span className="sr-only">Search the market</span><Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b84c32]" /><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="What are you looking for today?" className="w-full rounded-full border border-amber-900/15 bg-[#fff9ed] py-3 pl-12 pr-4 font-medium text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-blue" /></label><label className="flex shrink-0 items-center gap-2 text-sm font-bold text-brand-secondary">Arrange the counters <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} className="rounded-full border border-amber-900/15 bg-[#fff9ed] px-4 py-3 font-bold text-brand-dark outline-none focus:ring-2 focus:ring-brand-blue"><option value="featured">Featured first</option><option value="price-low">Lowest price</option><option value="price-high">Highest price</option><option value="name">A to Z</option></select></label></div>
          <div className="flex gap-2 overflow-x-auto pb-1"><button type="button" onClick={() => setCategory('all')} className={`market-chip shrink-0 rounded-full px-4 py-2 text-sm font-extrabold transition ${category === 'all' ? 'bg-brand-blue text-white' : 'bg-[#f3dfbb] text-brand-blue hover:bg-brand-gold'}`}>All aisles</button>{categories.slice(1).map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`market-chip shrink-0 rounded-full px-4 py-2 text-sm font-extrabold transition ${category === item ? 'bg-brand-blue text-white' : 'bg-[#f3dfbb] text-brand-blue hover:bg-brand-gold'}`}>{item}</button>)}</div>
          <div className="flex flex-col gap-3 border-t border-amber-900/10 pt-4 sm:flex-row sm:items-center"><label className="flex flex-1 items-center gap-3 text-sm font-bold text-brand-secondary">Budget up to <span className="rounded-full bg-brand-gold px-3 py-1 text-brand-blue">R {maxPrice}</span><input type="range" min="0" max={highestPrice} step="10" value={Math.min(maxPrice, highestPrice)} onChange={(event) => setMaxPrice(Number(event.target.value))} className="h-2 min-w-24 flex-1 cursor-pointer appearance-none rounded-lg bg-amber-100" /></label><button type="button" onClick={resetFilters} className="text-sm font-extrabold text-[#b84c32] hover:underline">Clear this browse</button></div>
        </div></section>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-extrabold uppercase tracking-[.18em] text-[#b84c32]">Today’s counter displays</p><h2 className="market-display-font mt-1 text-4xl font-bold text-brand-dark">{filteredProducts.length ? 'Things worth stopping for' : 'This lane is quiet just now'}</h2></div><p className="rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-secondary shadow-sm"><strong className="text-brand-blue">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'} in this browse</p></div>
        {filteredProducts.length ? <div className="mt-8 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">{filteredProducts.map(({ product, stall }) => <button type="button" key={product.id} onClick={() => onStallClick(stall)} aria-label={`Visit ${stall.name}`} className="rounded-2xl text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/40"><ProductCard product={product} /><span className="mt-3 flex items-center gap-2 px-1 text-sm font-extrabold text-brand-blue"><span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-[#f3dfbb]">{stall.logo_url ? <img src={stall.logo_url} alt="" className="h-full w-full object-cover" /> : stall.name.charAt(0)}</span> At {stall.name}<Icon name="arrow-right" className="ml-auto h-4 w-4 text-[#b84c32]" /></span></button>)}</div> : <div className="market-stall mt-8 bg-white px-6 py-16 text-center"><Icon name="search" className="mx-auto h-11 w-11 text-[#b84c32]" /><h3 className="market-display-font mt-4 text-3xl font-bold">Nothing on this counter yet</h3><p className="mt-2 text-brand-secondary">Try another aisle, a smaller search, or clear your browse.</p><button type="button" onClick={resetFilters} className="market-chip mt-6 rounded-full bg-brand-blue px-5 py-3 font-bold text-white">Show everything</button></div>}
      </div>
    </main><Footer onNavigate={onNavigate} />
  </>;
};

export default MarketplacePage;
