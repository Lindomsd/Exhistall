import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StallCard from '../components/StallCard';
import type { Stall, User } from '../types';

interface NetworkingPageProps {
  stalls: Stall[];
  onStallClick: (stall: Stall) => void;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  pageTitle?: string;
  searchQuery?: string;
  currentUser: User | null;
  onLogout: () => void;
}

const NetworkingPage: React.FC<NetworkingPageProps> = ({ stalls, onStallClick, onNavigate, onSearch, pageTitle, searchQuery, currentUser, onLogout }) => {
  const title = pageTitle || "Stallholder Network";
  const subtitle = searchQuery 
    ? `${stalls.length} result(s) found for "${searchQuery}"`
    : "Discover and connect with other businesses on the platform.";

  return (
    <>
      <Header onNavigate={onNavigate} onSearch={onSearch} currentUser={currentUser} onLogout={onLogout} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold">{title}</h1>
            <p className="mt-2 text-lg text-brand-secondary dark:text-slate-400">{subtitle}</p>
          </div>
          
          {stalls.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {stalls.map(stall => (
                <StallCard key={stall.id} stall={stall} onClick={onStallClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold">No Stalls Found</h2>
              <p className="text-brand-secondary dark:text-slate-400 mt-2">
                Your search did not match any stalls. Please try a different query.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default NetworkingPage;
