import React from 'react';
import { Icon } from './Icon';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const explore = [{ name: 'Browse aisles', page: 'marketplace' }, { name: 'Find a stall', page: 'categories' }, { name: 'Market square', page: 'home' }];
  const stallholder = [{ name: 'Open a stall', page: 'create-stall' }, { name: 'Pricing', page: 'pricing' }, { name: 'Stallholder guides', page: 'guides' }];
  const help = [{ name: 'Help centre', page: 'help' }, { name: 'About Exhistall', page: 'about' }, { name: 'Contact the market', page: 'contact' }];
  const legal = [{ name: 'Privacy', page: 'privacy' }, { name: 'Terms', page: 'terms' }];

  const LinkList: React.FC<{ title: string; links: { name: string; page: string }[] }> = ({ title, links }) => <div><h3 className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-gold">{title}</h3><ul className="mt-4 space-y-3">{links.map((link) => <li key={link.page}><button type="button" onClick={() => onNavigate(link.page)} className="text-sm font-medium text-blue-100 transition hover:text-white hover:underline">{link.name}</button></li>)}</ul></div>;

  return (
    <footer className="overflow-hidden bg-brand-blue text-brand-light">
      <div className="awning-blue h-4" />
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div><div className="flex items-center gap-2"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold text-brand-blue"><Icon name="store" className="h-6 w-6" /></span><span className="market-display-font text-3xl font-bold">Exhistall</span></div><p className="mt-4 max-w-sm leading-relaxed text-blue-100">A digital market where independent businesses can put out their best work and visitors can wander, discover and connect.</p><button type="button" onClick={() => onNavigate('create-stall')} className="market-chip mt-6 rounded-full bg-brand-gold px-5 py-3 font-extrabold text-brand-blue hover:bg-yellow-300">Set up your stall</button></div>
          <LinkList title="Explore" links={explore} /><LinkList title="Stallholders" links={stallholder} /><div className="grid grid-cols-2 gap-6 lg:block"><LinkList title="Market help" links={help} /><div className="mt-0 lg:mt-8"><LinkList title="House rules" links={legal} /></div></div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-blue-200 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Exhistall. Made for the people behind the stalls.</p><p className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-gold" /> The market is always growing.</p></div>
      </div>
    </footer>
  );
};

export default Footer;
