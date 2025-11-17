
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';

interface CategoriesPageProps {
  onNavigate: (page: string) => void;
}

const categories = [
    { name: 'Food & Drink', icon: 'food' },
    { name: 'Fashion & Apparel', icon: 'fashion' },
    { name: 'Digital Services', icon: 'digital' },
    { name: 'Home & Craft', icon: 'craft' },
    { name: 'Health & Beauty', icon: 'health' },
    { name: 'Consulting', icon: 'consulting' },
    { name: 'Arts & Entertainment', icon: 'ticket' },
    { name: 'Automotive', icon: 'truck' },
];

const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  return (
    <>
      <Header onNavigate={onNavigate} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-extrabold text-center mb-12">Browse Categories</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => onNavigate('marketplace')}
                className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-transform duration-300"
              >
                <Icon name={category.icon} className="h-12 w-12 text-brand-blue dark:text-brand-gold mb-4" />
                <span className="text-lg font-semibold text-center">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default CategoriesPage;
