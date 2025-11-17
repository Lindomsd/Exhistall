
import React from 'react';
import type { Stall } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StallCard from '../components/StallCard';
import { Icon } from '../components/Icon';

interface HomePageProps {
  stalls: Stall[];
  onStallClick: (stall: Stall) => void;
  onNavigate: (page: string) => void;
}

const categories = [
    { name: 'Food & Drink', icon: 'food' },
    { name: 'Fashion & Apparel', icon: 'fashion' },
    { name: 'Digital Services', icon: 'digital' },
    { name: 'Home & Craft', icon: 'craft' },
    { name: 'Health & Beauty', icon: 'health' },
    { name: 'Consulting', icon: 'consulting' },
];


const HomePage: React.FC<HomePageProps> = ({ stalls, onStallClick, onNavigate }) => {
  const featuredStalls = stalls.filter(stall => stall.featured);

  return (
    <>
      <Header onNavigate={onNavigate} />
      <main>
        {/* Hero Section */}
        <div className="bg-brand-blue">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white">
              Showcase. Sell. Connect.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gold">
              Your Business, Your Stall, Your Marketplace.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => onNavigate('marketplace')} className="bg-brand-gold text-brand-blue font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 transition-colors">
                Explore Stalls
              </button>
              <button onClick={() => onNavigate('create-stall')} className="bg-white/20 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/30 transition-colors">
                Create Your Stall
              </button>
            </div>
          </div>
        </div>

        {/* Featured Stalls Section */}
        <div className="py-16 bg-brand-light dark:bg-brand-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10">Featured Stalls</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredStalls.map(stall => (
                <StallCard key={stall.id} stall={stall} onClick={onStallClick} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Categories Section */}
        <div className="py-16 bg-white dark:bg-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-10">Browse by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <button key={category.name} onClick={() => onNavigate('categories')} className="flex flex-col items-center justify-center p-6 bg-brand-light dark:bg-brand-dark rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
                            <Icon name={category.icon} className="h-10 w-10 text-brand-blue dark:text-brand-gold mb-3" />
                            <span className="font-semibold text-center">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* All Stalls Section */}
        <div className="py-16 bg-brand-light dark:bg-brand-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10">All Stalls</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stalls.map(stall => (
                <StallCard key={stall.id} stall={stall} onClick={onStallClick} />
              ))}
            </div>
          </div>
        </div>

      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default HomePage;
