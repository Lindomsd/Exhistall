import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for getting started and trying out the platform.',
    features: [
      'Basic Stall Profile',
      'Up to 5 product listings',
      'Standard customer support',
      'Access to marketplace',
    ],
    cta: 'Start for Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    price_suffix: '/ month',
    description: 'For growing businesses looking to enhance their brand.',
    features: [
      'Customizable Stall Profile',
      'Up to 50 product listings',
      'Photo & Video Gallery',
      'Priority customer support',
      'Partnership networking tools',
    ],
    cta: 'Choose Pro',
    popular: true,
  },
  {
    name: 'Featured',
    price: '$79',
    price_suffix: '/ month',
    description: 'For established brands seeking maximum visibility.',
    features: [
      'All features from Pro',
      'Featured on Homepage',
      'Top placement in search',
      'Analytics and reports',
      'Dedicated account manager',
    ],
    cta: 'Get Featured',
    popular: false,
  },
];

const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  return (
    <>
      <Header onNavigate={onNavigate} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold">Find the perfect plan for your business</h1>
            <p className="mt-4 text-lg text-brand-secondary dark:text-slate-400">
              Whether you're just starting out or ready to scale, we have a plan that fits your needs.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {plans.map(plan => (
              <div key={plan.name} className={`bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 flex flex-col ${plan.popular ? 'border-2 border-brand-gold' : ''}`}>
                {plan.popular && <span className="bg-brand-gold text-brand-blue text-xs font-bold px-3 py-1 rounded-full self-start mb-4">MOST POPULAR</span>}
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p className="mt-2 text-brand-secondary dark:text-slate-400">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-brand-dark dark:text-white">{plan.price}</span>
                  {plan.price_suffix && <span className="text-lg font-medium text-brand-secondary dark:text-slate-400">{plan.price_suffix}</span>}
                </div>
                <ul className="mt-6 space-y-4 text-brand-secondary dark:text-slate-300 flex-grow">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start">
                      <Icon name="check-circle" className="h-6 w-6 text-green-500 flex-shrink-0 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => onNavigate('create-stall')}
                  className={`mt-8 w-full py-3 rounded-lg font-bold transition-colors ${plan.popular ? 'bg-brand-gold text-brand-blue hover:bg-yellow-300' : 'bg-brand-blue text-white hover:bg-opacity-90'}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default PricingPage;
