import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StallCard from '../components/StallCard';
import type { Stall } from '../types';

interface NetworkingPageProps {
  stalls: Stall[];
  onStallClick: (stall: Stall) => void;
  onNavigate: (page: string) => void;
}

const NetworkingPage: React.FC<NetworkingPageProps> = ({ stalls, onStallClick, onNavigate }) => {
  return (
    <>
      <Header onNavigate={onNavigate} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold">Stallholder Network</h1>
            <p className="mt-2 text-lg text-brand-secondary dark:text-slate-400">Discover and connect with other businesses on the platform.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {stalls.map(stall => (
              <StallCard key={stall.id} stall={stall} onClick={onStallClick} />
            ))}
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default NetworkingPage;
