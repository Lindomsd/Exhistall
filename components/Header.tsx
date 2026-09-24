import React, { useState } from 'react';
import { Icon } from './Icon';
import type { User } from '../types';

interface HeaderProps {
  onBack?: () => void;
  onNavigate: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  isLoginPage?: boolean;
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onBack, onNavigate, currentUser, onLogout, isLoginPage = false, onSearch }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch?.(searchTerm);
  };

  const closeAndNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleCreateStallClick = () => {
    if (currentUser) {
      closeAndNavigate('create-stall');
    } else if (window.confirm('You need to be logged in to set up a stall. Would you like to log in or create an account?')) {
      closeAndNavigate('login');
    }
  };

  const navLinks = [
    { name: 'Market square', page: 'home' },
    { name: 'Browse aisles', page: 'marketplace' },
    { name: 'Exhibition halls', page: 'exhibitions' },
    { name: 'Find a stall', page: 'categories' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-blue/95 text-white shadow-lg backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center">
            {onBack ? <button type="button" onClick={onBack} className="mr-1 rounded-full p-2 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" aria-label="Back"><Icon name="arrow-left" className="h-5 w-5" /></button> : null}
            <button type="button" onClick={() => onNavigate('home')} className="flex min-w-0 items-center gap-2 rounded-lg p-2 text-left transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gold text-brand-blue shadow-sm"><Icon name="store" className="h-5 w-5" /></span>
              <span className="market-display-font truncate text-2xl font-bold tracking-tight">Exhistall</span>
            </button>
          </div>

          {!isLoginPage && onSearch && <div className="hidden min-w-0 flex-1 px-3 md:flex md:justify-center"><form onSubmit={handleSearchSubmit} className="relative w-full max-w-md"><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search the market…" className="block w-full rounded-full border border-white/10 bg-white/15 py-2 pl-4 pr-10 text-sm text-white placeholder-blue-100 outline-none transition focus:border-brand-gold focus:bg-white/20 focus:ring-2 focus:ring-brand-gold/30" aria-label="Search the market" /><button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3" aria-label="Submit search"><Icon name="search" className="h-5 w-5 text-brand-gold" /></button></form></div>}

          {!isLoginPage && <div className="flex items-center"><div className="hidden items-center gap-1 lg:flex">{navLinks.map((link) => <button type="button" key={link.page} onClick={() => onNavigate(link.page)} className="rounded-full px-3 py-2 text-sm font-bold text-blue-100 transition hover:bg-white/10 hover:text-white">{link.name}</button>)}{currentUser ? <><button type="button" onClick={() => onNavigate(currentUser.stallId ? 'stallholder-dashboard' : 'create-stall')} className="rounded-full px-3 py-2 text-sm font-bold text-blue-100 transition hover:bg-white/10 hover:text-white">{currentUser.stallId ? 'My stall' : 'Open a stall'}</button>{currentUser.role === 'admin' && <button type="button" onClick={() => onNavigate('admin')} className="rounded-full px-3 py-2 text-sm font-bold text-blue-100 transition hover:bg-white/10 hover:text-white">Admin</button>}<button type="button" onClick={onLogout} className="ml-1 rounded-full border border-white/20 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10">Leave</button></> : <><button type="button" onClick={() => onNavigate('login')} className="rounded-full px-3 py-2 text-sm font-bold text-blue-100 transition hover:bg-white/10 hover:text-white">Sign in</button><button type="button" onClick={handleCreateStallClick} className="market-chip ml-1 rounded-full bg-brand-gold px-4 py-2 text-sm font-extrabold text-brand-blue hover:bg-yellow-300">Open a stall</button></>}</div><div className="ml-1 lg:hidden"><button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="rounded-xl p-2 text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" aria-label="Open market menu"><Icon name={isMobileMenuOpen ? 'x' : 'menu'} className="h-6 w-6" /></button></div></div>}
        </div>
      </div>
      {isMobileMenuOpen && !isLoginPage && <div className="border-t border-white/10 bg-brand-blue px-4 pb-5 pt-3 shadow-xl"><div className="container mx-auto"><form onSubmit={(event) => { handleSearchSubmit(event); setMobileMenuOpen(false); }} className="relative md:hidden"><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search the market…" className="w-full rounded-full bg-white/15 py-3 pl-4 pr-10 text-white placeholder-blue-100 outline-none focus:ring-2 focus:ring-brand-gold" aria-label="Search the market" /><button type="submit" className="absolute inset-y-0 right-0 pr-3"><Icon name="search" className="h-5 w-5 text-brand-gold" /></button></form><nav className="mt-3 grid gap-1">{navLinks.map((link) => <button type="button" key={link.page} onClick={() => closeAndNavigate(link.page)} className="rounded-lg px-3 py-3 text-left font-bold text-blue-100 transition hover:bg-white/10 hover:text-white">{link.name}</button>)}{currentUser ? <>{currentUser.stallId && <button type="button" onClick={() => closeAndNavigate('stallholder-dashboard')} className="rounded-lg px-3 py-3 text-left font-bold text-blue-100 transition hover:bg-white/10 hover:text-white">My stall</button>}{currentUser.role === 'admin' && <button type="button" onClick={() => closeAndNavigate('admin')} className="rounded-lg px-3 py-3 text-left font-bold text-blue-100 transition hover:bg-white/10 hover:text-white">Admin</button>}<button type="button" onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="mt-2 rounded-full border border-white/20 px-4 py-3 text-left font-bold text-white">Leave the market</button></> : <><button type="button" onClick={() => closeAndNavigate('login')} className="rounded-lg px-3 py-3 text-left font-bold text-blue-100 transition hover:bg-white/10 hover:text-white">Sign in</button><button type="button" onClick={handleCreateStallClick} className="market-chip mt-2 rounded-full bg-brand-gold px-4 py-3 text-left font-extrabold text-brand-blue">Open a stall</button></>}</nav></div></div>}
    </header>
  );
};

export default Header;
