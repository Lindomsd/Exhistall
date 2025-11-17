import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';
import { mockExhibitions } from '../data/mockData';
import type { Exhibition, User } from '../types';

interface ExhibitionsPageProps {
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const ExhibitionCard: React.FC<{ exhibition: Exhibition }> = ({ exhibition }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
    <img className="h-48 w-full object-cover" src={exhibition.imageUrl} alt={exhibition.title} />
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-brand-dark dark:text-white">{exhibition.title}</h3>
        <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
          exhibition.status === 'upcoming' 
          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {exhibition.status}
        </span>
      </div>
      <p className="mt-2 flex items-center gap-2 text-brand-secondary dark:text-slate-400">
        <Icon name="calendar" className="h-5 w-5" />
        <span>{exhibition.date}</span>
      </p>
      <p className="mt-3 text-brand-secondary dark:text-slate-300">{exhibition.description}</p>
      <button className={`mt-4 font-semibold py-2 px-4 rounded-lg w-full transition-colors ${
        exhibition.status === 'upcoming'
        ? 'bg-brand-blue text-white hover:bg-opacity-90'
        : 'bg-gray-200 dark:bg-slate-700 text-brand-secondary dark:text-slate-300 cursor-default'
      }`}>
        {exhibition.status === 'upcoming' ? 'View Event' : 'View Archive'}
      </button>
    </div>
  </div>
);

const ExhibitionsPage: React.FC<ExhibitionsPageProps> = ({ onNavigate, onSearch, currentUser, onLogout }) => {
  const upcomingExhibitions = mockExhibitions.filter(e => e.status === 'upcoming');
  const pastExhibitions = mockExhibitions.filter(e => e.status === 'past');

  return (
    <>
      <Header onNavigate={onNavigate} onSearch={onSearch} currentUser={currentUser} onLogout={onLogout} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold">Virtual Exhibitions</h1>
            <p className="mt-2 text-lg text-brand-secondary dark:text-slate-400">Join our curated events and discover amazing collections of stalls.</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8">Upcoming Exhibitions</h2>
            {upcomingExhibitions.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingExhibitions.map(ex => (
                  <ExhibitionCard key={ex.id} exhibition={ex} />
                ))}
              </div>
            ) : (
              <p className="text-center text-brand-secondary dark:text-slate-400 py-8">No upcoming exhibitions scheduled. Check back soon!</p>
            )}
          </div>
          
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Past Exhibitions</h2>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastExhibitions.map(ex => (
                  <ExhibitionCard key={ex.id} exhibition={ex} />
                ))}
              </div>
          </div>

        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default ExhibitionsPage;
