import React, { useState } from 'react';
import { Icon } from './Icon';
import type { User } from '../types';

interface HeaderProps {
  onBack?: () => void;
  onNavigate: (page: string) => void;
  currentUser?: User | null;
  onLogout?: () => void;
  isLoginPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onBack, onNavigate, currentUser, onLogout, isLoginPage = false }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Categories', page: 'categories' },
    { name: 'Marketplace', page: 'marketplace' },
  ];

  return (
    <header className="bg-brand-blue text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {onBack ? (
               <button onClick={onBack} className="mr-2 p-2 rounded-full hover:bg-white/10 transition-colors">
                 <Icon name="arrow-left" className="h-6 w-6"/>
               </button>
            ) : null}
            <button onClick={() => onNavigate('home')} className="flex-shrink-0 flex items-center gap-2 p-2 rounded-md hover:bg-white/10">
               <Icon name="store" className="h-8 w-8 text-brand-gold"/>
              <span className="text-2xl font-bold">Exhistalls</span>
            </button>
          </div>
          
          {!isLoginPage && (
            <>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navLinks.map(link => (
                    <button key={link.name} onClick={() => onNavigate(link.page)} className="text-gray-300 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium">{link.name}</button>
                  ))}
                  {currentUser && onLogout ? (
                    <>
                      <span className="text-gray-300 px-3 py-2 text-sm font-medium">Welcome, {currentUser.name}</span>
                      <button onClick={onLogout} className="bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-bold transition-colors">Logout</button>
                    </>
                  ) : (
                    <button onClick={() => onNavigate('create-stall')} className="bg-brand-gold text-brand-blue hover:bg-yellow-400 px-3 py-2 rounded-md text-sm font-bold transition-colors">Create a Stall</button>
                  )}
                </div>
              </div>
              <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  <Icon name={isMobileMenuOpen ? "x" : "menu"} className="h-6 w-6"/>
                </button>
              </div>
            </>
          )}

        </div>
      </div>
      {isMobileMenuOpen && !isLoginPage && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
                <button key={link.name} onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }} className="text-gray-300 hover:bg-white/10 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">{link.name}</button>
              ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
             <div className="px-2">
                {currentUser && onLogout ? (
                   <>
                    <div className="px-3 py-2 text-base font-medium text-white">Signed in as {currentUser.name}</div>
                    <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="mt-2 bg-red-500 text-white hover:bg-red-600 block w-full text-left px-3 py-2 rounded-md text-base font-bold transition-colors">Logout</button>
                   </>
                ) : (
                   <button onClick={() => { onNavigate('create-stall'); setMobileMenuOpen(false); }} className="bg-brand-gold text-brand-blue hover:bg-yellow-400 block w-full text-left px-3 py-2 rounded-md text-base font-bold transition-colors">Create a Stall</button>
                )}
             </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
