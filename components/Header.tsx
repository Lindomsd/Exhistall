
import React from 'react';
import { Icon } from './Icon';

interface HeaderProps {
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <header className="bg-brand-blue text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {onBack ? (
               <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors">
                 <Icon name="arrow-left" className="h-6 w-6"/>
               </button>
            ) : null}
            <div className="flex-shrink-0 flex items-center gap-2">
               <Icon name="store" className="h-8 w-8 text-brand-gold"/>
              <span className="text-2xl font-bold">Exhistalls</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-gray-300 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="#" className="text-gray-300 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Categories</a>
              <a href="#" className="text-gray-300 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Marketplace</a>
              <a href="#" className="bg-brand-gold text-brand-blue hover:bg-yellow-400 px-3 py-2 rounded-md text-sm font-bold transition-colors">Create a Stall</a>
            </div>
          </div>
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <Icon name="menu" className="h-6 w-6"/>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
