
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';

interface PlaceholderPageProps {
  pageTitle: string;
  onNavigate: (page: string) => void;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ pageTitle, onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={onNavigate} />
      <main className="flex-grow bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <Icon name="briefcase" className="h-16 w-16 mx-auto text-brand-blue dark:text-brand-gold mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark dark:text-brand-light capitalize">
              {pageTitle.replace('-', ' ')}
            </h1>
            <p className="mt-4 text-lg text-brand-secondary dark:text-slate-400">
              This page is currently under construction. Check back soon for exciting updates!
            </p>
            <div className="mt-8">
              <button
                onClick={() => onNavigate('home')}
                className="bg-brand-gold text-brand-blue font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 transition-colors"
              >
                Go Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default PlaceholderPage;
