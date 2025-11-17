import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import StallCard from '../components/StallCard';
import type { Stall, User } from '../types';

interface MarketplacePageProps {
  stalls: Stall[];
  onNavigate: (page: string, stallId?: string) => void;
  onStallClick: (stall: Stall) => void;
  onSearch: (query: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const MarketplacePage: React.FC<MarketplacePageProps> = ({ stalls, onNavigate, onSearch, currentUser, onLogout, onStallClick }) => {
  const allProducts = useMemo(() => stalls.flatMap(stall => stall.products), [stalls]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(500);
  
  const categories = useMemo(() => ['all', ...Array.from(new Set(stalls.map(s => s.category)))], [stalls]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const stallOfProduct = stalls.find(s => s.products.some(p => p.id === product.id));
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || (stallOfProduct && stallOfProduct.category === category);
      const matchesPrice = product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [allProducts, searchTerm, category, maxPrice, stalls]);

  return (
    <>
      <Header onNavigate={onNavigate} onSearch={onSearch} currentUser={currentUser} onLogout={onLogout} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-extrabold text-center mb-4">Marketplace</h1>
          <p className="text-center text-brand-secondary dark:text-slate-400 mb-10">Discover unique products from our talented stallholders.</p>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters */}
            <aside className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg h-fit sticky top-24">
              <h2 className="text-xl font-bold mb-4">Filters</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Search</label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Product name..."
                    className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold focus:border-transparent outline-none transition"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Max Price: <span className="font-bold text-brand-blue dark:text-brand-gold">${maxPrice}</span></label>
                  <input
                    type="range"
                    id="price"
                    min="0"
                    max="1500"
                    step="10"
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              {filteredProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} onClick={() => {
                        const stall = stalls.find(s => s.products.some(p => p.id === product.id));
                        if(stall) onStallClick(stall);
                    }} className="cursor-pointer">
                        <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-bold">No Products Found</h3>
                  <p className="text-brand-secondary dark:text-slate-400 mt-2">Try adjusting your filters to find what you're looking for.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default MarketplacePage;
