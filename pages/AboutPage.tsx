import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';
import { mockTeamMembers } from '../data/mockData';
import type { TeamMember } from '../types';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div className="text-center">
    <img className="mx-auto h-32 w-32 rounded-full object-cover" src={member.imageUrl} alt={member.name} />
    <h3 className="mt-4 text-lg font-bold text-brand-dark dark:text-white">{member.name}</h3>
    <p className="text-brand-blue dark:text-brand-gold">{member.title}</p>
  </div>
);

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <>
      <Header onNavigate={onNavigate} />
      <main>
        {/* Hero Section */}
        <div className="bg-brand-blue">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white">
              Empowering Small Businesses in the Digital Age.
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-brand-gold">
              We believe every business, no matter how small, deserves a beautiful and functional space to connect with customers and grow. That's why we created Exhistalls.
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="py-16 bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-lg text-brand-secondary dark:text-slate-300 leading-relaxed">
                Founded in a small coffee shop by a group of passionate developers and entrepreneurs, Exhistalls was born from a simple idea: what if every small business could have a virtual stall as vibrant and unique as a physical one, without the high costs and logistical nightmares? We saw talented artisans, creators, and service providers struggling to be seen in a crowded digital world. We decided to build a platform that was more than just a marketplace—it's a community, a networking hub, and a launchpad for dreams.
              </p>
            </div>
          </div>
        </div>
        
        {/* Meet the Team Section */}
        <div className="py-16 bg-brand-light dark:bg-brand-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10">Meet the Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {mockTeamMembers.map(member => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-brand-gold">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-3xl font-bold text-brand-blue">Ready to Join Our Community?</h2>
            <p className="mt-2 text-lg text-brand-blue/80">Create your own virtual stall or explore the amazing products from our sellers.</p>
            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => onNavigate('create-stall')} className="bg-brand-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
                Create a Stall
              </button>
              <button onClick={() => onNavigate('marketplace')} className="bg-white text-brand-blue font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                Explore Marketplace
              </button>
            </div>
          </div>
        </div>

      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default AboutPage;
