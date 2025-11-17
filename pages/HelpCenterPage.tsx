import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';
import { mockFaqs } from '../data/mockData';
import type { FaqItem } from '../types';

interface HelpCenterPageProps {
  onNavigate: (page: string) => void;
}

const FaqAccordion: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-slate-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-left"
      >
        <span className="font-semibold text-brand-dark dark:text-white">{item.question}</span>
        <Icon name="chevron-down" className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-4 text-brand-secondary dark:text-slate-300">
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  );
};

const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'stallholders', label: 'For Stallholders' },
    { id: 'shoppers', label: 'For Shoppers' },
  ];

  return (
    <>
      <Header onNavigate={onNavigate} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="bg-brand-blue text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-4xl font-extrabold">How can we help?</h1>
                <div className="mt-6 max-w-2xl mx-auto">
                    <div className="relative">
                        <input 
                            type="search"
                            placeholder="Search for answers..."
                            className="w-full p-4 pr-12 rounded-lg text-brand-dark"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                           <Icon name="search" className="h-6 w-6 text-brand-secondary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="border-b border-gray-200 dark:border-slate-700 mb-8">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-brand-blue dark:border-brand-gold text-brand-blue dark:text-brand-gold'
                        : 'border-transparent text-brand-secondary hover:text-brand-dark dark:hover:text-white hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="space-y-4">
              {mockFaqs[activeTab].map((faq, index) => (
                <FaqAccordion key={index} item={faq} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default HelpCenterPage;
