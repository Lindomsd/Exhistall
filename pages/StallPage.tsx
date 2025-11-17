
import React, { useState } from 'react';
import type { Stall, Review, PartnershipRequest } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import PartnershipModal from '../components/PartnershipModal';
import { Icon } from '../components/Icon';

interface StallPageProps {
  stall: Stall;
  onBack: () => void;
  currentUserStall: Stall;
  partnershipRequests: PartnershipRequest[];
  onProposePartnership: (recipientStall: Stall, message: string) => void;
  onNavigate: (page: string) => void;
}

const StallPage: React.FC<StallPageProps> = ({ stall, onBack, currentUserStall, partnershipRequests, onProposePartnership, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isPartnershipModalOpen, setPartnershipModalOpen] = useState(false);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
        <Icon key={i} name="star" className={`h-5 w-5 ${i < rating ? 'text-brand-gold' : 'text-gray-300 dark:text-gray-600'}`} />
    ));
  };

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'products', label: `Products (${stall.products.length})` },
    { id: 'gallery', label: `Gallery (${stall.gallery.length})` },
    { id: 'reviews', label: `Reviews (${stall.reviews.length})` },
  ];

  const isOwnStall = currentUserStall.id === stall.id;

  const existingProposal = partnershipRequests.find(
    req =>
      (req.proposerStall.id === currentUserStall.id && req.recipientStall.id === stall.id) ||
      (req.proposerStall.id === stall.id && req.recipientStall.id === currentUserStall.id)
  );

  const handlePropose = (message: string) => {
    onProposePartnership(stall, message);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stall.products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        );
      case 'gallery':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stall.gallery.map(item => (
              <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                <img src={item.type === 'image' ? item.url : item.thumbnailUrl} alt="Gallery item" className="w-full h-full object-cover" />
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="play" className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'reviews':
        return (
          <div className="space-y-6 max-w-3xl mx-auto">
            {stall.reviews.map(review => (
              <div key={review.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{review.author}</span>
                  <div className="flex items-center">{renderStars(review.rating)}</div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{new Date(review.date).toLocaleDateString()}</p>
                <p className="mt-2 text-brand-secondary dark:text-slate-300">{review.comment}</p>
              </div>
            ))}
            {stall.reviews.length === 0 && <p className="text-center text-brand-secondary dark:text-slate-400 py-8">No reviews yet.</p>}
          </div>
        );
      case 'about':
      default:
        return (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-2">About {stall.name}</h3>
              <p className="whitespace-pre-wrap dark:text-slate-300 leading-relaxed">{stall.description}</p>
              <h3 className="text-xl font-bold mt-6 mb-2">Our Mission</h3>
              <p className="whitespace-pre-wrap dark:text-slate-300 leading-relaxed">{stall.mission}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact & Location</h3>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                    <Icon name="location" className="h-5 w-5 text-brand-blue dark:text-brand-gold flex-shrink-0 mt-1"/>
                    <span className="text-sm">{stall.location.address}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Icon name="phone" className="h-5 w-5 text-brand-blue dark:text-brand-gold flex-shrink-0"/>
                    <a href={`tel:${stall.contact.phone}`} className="text-sm hover:underline">{stall.contact.phone}</a>
                </div>
                <div className="flex items-center gap-3">
                    <Icon name="email" className="h-5 w-5 text-brand-blue dark:text-brand-gold flex-shrink-0"/>
                    <a href={`mailto:${stall.contact.email}`} className="text-sm hover:underline">{stall.contact.email}</a>
                </div>
                 <div className="flex items-center gap-3">
                    <Icon name="website" className="h-5 w-5 text-brand-blue dark:text-brand-gold flex-shrink-0"/>
                    <a href={`https://${stall.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">{stall.contact.website}</a>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };


  return (
    <>
      <Header onBack={onBack} onNavigate={onNavigate} />
      <main className="bg-brand-light dark:bg-brand-dark pb-16">
        {/* Stall Header */}
        <div className="relative h-48 md:h-64 bg-gray-200">
          <img src={stall.bannerUrl} alt={`${stall.name} banner`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col md:flex-row items-start -mt-20 md:-mt-24">
            <div className="flex-shrink-0">
               <img className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 shadow-lg" src={stall.logoUrl} alt={`${stall.name} logo`} />
            </div>
            <div className="mt-4 md:mt-20 md:ml-6 text-brand-dark dark:text-brand-light">
              <h1 className="text-2xl md:text-4xl font-bold">{stall.name}</h1>
              <p className="text-md text-brand-secondary dark:text-slate-300 mt-1">{stall.slogan}</p>
            </div>
            <div className="w-full md:w-auto mt-4 md:mt-20 md:ml-auto flex items-center gap-2 flex-wrap justify-start md:justify-end">
              <button className="bg-white dark:bg-slate-700 text-brand-dark dark:text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors shadow-md">
                <Icon name="message" className="h-5 w-5" />
                Message
              </button>
              {!isOwnStall && (
                <button 
                  onClick={() => setPartnershipModalOpen(true)}
                  disabled={!!existingProposal}
                  className="bg-brand-blue text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 hover:bg-opacity-90 transition-colors shadow-md disabled:bg-brand-secondary disabled:cursor-not-allowed">
                  <Icon name="briefcase" className="h-5 w-5" />
                  {existingProposal ? 'Proposal Sent' : 'Propose Partnership'}
                </button>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-8 border-b border-gray-300 dark:border-slate-700">
            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-brand-blue dark:border-brand-gold text-brand-blue dark:text-brand-gold'
                      : 'border-transparent text-brand-secondary dark:text-slate-400 hover:text-brand-dark dark:hover:text-brand-light hover:border-gray-400 dark:hover:border-slate-500'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="mt-8">
            {renderTabContent()}
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate}/>
      {!isOwnStall && (
        <PartnershipModal 
            isOpen={isPartnershipModalOpen}
            onClose={() => setPartnershipModalOpen(false)}
            proposerStall={currentUserStall}
            recipientStall={stall}
            onSubmit={handlePropose}
        />
      )}
    </>
  );
};

export default StallPage;
