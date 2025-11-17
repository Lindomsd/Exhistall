import React from 'react';
import { Icon } from './Icon';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  
  const solutions = [{name: 'Marketplace', page: 'marketplace'}, {name: 'Networking', page: 'networking'}, {name: 'Exhibitions', page: 'exhibitions'}];
  const support = [{name: 'Pricing', page: 'pricing'}, {name: 'Help Center', page: 'help'}, {name: 'Guides', page: 'guides'}, {name: 'Admin', page: 'admin'}];
  const company = [{name: 'About', page: 'about'}, {name: 'Blog', page: 'blog'}, {name: 'Jobs', page: 'jobs'}];
  const legal = [{name: 'Claim', page: 'claim'}, {name: 'Privacy', page: 'privacy'}, {name: 'Terms', page: 'terms'}];

  return (
    <footer className="bg-brand-blue text-brand-light">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
            <ul className="mt-4 space-y-4">
              {solutions.map(link => (
                <li key={link.page}><button onClick={() => onNavigate(link.page)} className="text-base text-gray-300 hover:text-white">{link.name}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              {support.map(link => (
                <li key={link.page}><button onClick={() => onNavigate(link.page)} className="text-base text-gray-300 hover:text-white">{link.name}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              {company.map(link => (
                <li key={link.page}><button onClick={() => onNavigate(link.page)} className="text-base text-gray-300 hover:text-white">{link.name}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              {legal.map(link => (
                <li key={link.page}><button onClick={() => onNavigate(link.page)} className="text-base text-gray-300 hover:text-white">{link.name}</button></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {/* Social Icons would go here */}
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} Exhistalls, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;