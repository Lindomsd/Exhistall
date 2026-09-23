import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
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
    <main className="bg-brand-light dark:bg-brand-dark"><div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-blue dark:text-brand-gold">The Exhistall marketplace</p><h1 className="mt-2 text-4xl font-extrabold">Browse what exhibitors offer</h1><p className="mt-3 text-brand-secondary dark:text-slate-400">Discover products and services, then visit each stall to learn more and get in touch.</p></div>
      <div className="grid gap-8 lg:grid-cols-4"><aside className="h-fit rounded-lg bg-white p-6 shadow-lg lg:sticky lg:top-24 dark:bg-slate-800"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">Filters</h2><button type="button" onClick={resetFilters} className="text-sm font-semibold text-brand-blue hover:underline dark:text-brand-gold">Clear</button></div><div className="space-y-6">
        <div><label htmlFor="marketplace-search" className="mb-2 block text-sm font-medium">Search</label><input type="search" id="marketplace-search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Product, stall, category…" className="w-full rounded-md border border-gray-300 bg-brand-light p-2 dark:border-slate-600 dark:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold" /></div>
        <div><label htmlFor="category" className="mb-2 block text-sm font-medium">Category</label><select id="category" value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-md border border-gray-300 bg-brand-light p-2 dark:border-slate-600 dark:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold">{categories.map((item) => <option key={item} value={item}>{item === 'all' ? 'All categories' : item}</option>)}</select></div>
        <div><label htmlFor="price" className="mb-2 block text-sm font-medium">Maximum price <span className="font-bold text-brand-blue dark:text-brand-gold">${maxPrice}</span></label><input type="range" id="price" min="0" max={highestPrice} step="10" value={Math.min(maxPrice, highestPrice)} onChange={(event) => setMaxPrice(Number(event.target.value))} className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700" /></div>
      </div></aside>
      <section className="lg:col-span-3"><div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-brand-secondary dark:text-slate-400"><strong className="text-brand-dark dark:text-white">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'} to explore</p><label className="flex items-center gap-2 text-sm font-medium">Sort <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} className="rounded-md border border-gray-300 bg-white p-2 dark:border-slate-600 dark:bg-slate-800"><option value="featured">Featured stalls</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Product name</option></select></label></div>
        {filteredProducts.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{filteredProducts.map(({ product, stall }) => <button type="button" key={product.id} onClick={() => onStallClick(stall)} aria-label={`Visit ${stall.name}`} className="rounded-lg text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/40 dark:focus-visible:ring-brand-gold/40"><ProductCard product={product} /><span className="mt-2 block truncate text-sm font-semibold text-brand-blue dark:text-brand-gold">By {stall.name}</span></button>)}</div> : <div className="rounded-lg border border-dashed border-gray-300 px-6 py-20 text-center dark:border-slate-600"><h3 className="text-2xl font-bold">No matching exhibits</h3><p className="mt-2 text-brand-secondary dark:text-slate-400">Try widening your search or clearing the filters.</p><button type="button" onClick={resetFilters} className="mt-5 rounded-lg bg-brand-blue px-4 py-2 font-bold text-white">Reset filters</button></div>}
      </section></div>
    </div></main><Footer onNavigate={onNavigate} />
  </>;
};

export default MarketplacePage;
