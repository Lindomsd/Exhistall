import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StallForm from '../components/StallForm';
import type { Stall, User } from '../types';

interface CreateStallPageProps {
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  onCreateStall: (stallData: Omit<Stall, 'id' | 'ownerId' | 'status'>) => Promise<void>;
  currentUser: User | null;
  onLogout: () => void;
}

const CreateStallPage: React.FC<CreateStallPageProps> = ({ onNavigate, onSearch, onCreateStall, currentUser, onLogout }) => {
  
  const handleSubmit = async (formData: Omit<Stall, 'id' | 'ownerId' | 'status' | 'featured' | 'products' | 'gallery' | 'reviews'>) => {
    if (!currentUser) {
        alert("You must be logged in to create a stall.");
        onNavigate('login');
        return;
    }

    const stallData = {
        ...formData,
        logo_url: 'https://picsum.photos/seed/newlogo/200/200', // Placeholder
        banner_url: 'https://picsum.photos/seed/newbanner/1200/400', // Placeholder
    };

    await onCreateStall(stallData);
    alert("Stall submitted for review! You will be notified once it's approved by an admin.");
    onNavigate('stallholder-dashboard');
  };
  
  if (!currentUser) {
      // This is a fallback, the header should prevent non-logged-in users from getting here.
      return (
          <div className="flex flex-col min-h-screen">
               <Header onNavigate={onNavigate} onSearch={onSearch} currentUser={currentUser} onLogout={onLogout} />
               <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                    <p className="text-xl">Please log in to create a stall.</p>
                    <button onClick={() => onNavigate('login')} className="mt-4 bg-brand-blue text-white font-bold py-2 px-4 rounded">Login</button>
               </div>
               <Footer onNavigate={onNavigate} />
          </div>
      )
  }
  
  if (currentUser.stallId) {
       return (
          <div className="flex flex-col min-h-screen">
               <Header onNavigate={onNavigate} onSearch={onSearch} currentUser={currentUser} onLogout={onLogout} />
               <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                    <p className="text-xl">You already have a stall. You can manage it from your dashboard.</p>
                    <button onClick={() => onNavigate('stallholder-dashboard')} className="mt-4 bg-brand-gold text-brand-blue font-bold py-2 px-4 rounded">Go to Dashboard</button>
               </div>
               <Footer onNavigate={onNavigate} />
          </div>
      )
  }

  return (
    <>
      <Header onNavigate={onNavigate} onSearch={onSearch} currentUser={currentUser} onLogout={onLogout} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center mb-4">Create Your Stall</h1>
            <p className="text-center text-brand-secondary dark:text-slate-400 mb-10">Fill out the details below to get your virtual stall up and running. It will be submitted for admin review upon completion.</p>
            
            <StallForm onSubmit={handleSubmit} onCancel={() => onNavigate('home')} />

          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default CreateStallPage;
