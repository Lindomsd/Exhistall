import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface LegalPageProps {
  pageType: 'terms' | 'privacy' | 'claim';
  onNavigate: (page: string) => void;
}

const legalContent = {
  terms: {
    title: 'Terms of Service',
    content: (
      <>
        <p>Welcome to Exhistalls. By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy. Please read them carefully.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">1. Your Account</h3>
        <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">2. Stallholder Responsibilities</h3>
        <p>As a stallholder, you agree to provide accurate information about yourself and your products. You are responsible for all content you post, including product descriptions, images, and prices. You must handle customer inquiries and orders in a timely and professional manner.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">3. Prohibited Conduct</h3>
        <p>You may not use the platform for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    content: (
      <>
        <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">1. Collection of Your Information</h3>
        <p>We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, and in connection with other activities, services, features or resources we make available on our Site.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">2. How We Use Your Information</h3>
        <p>We may use the information we collect from you to personalize your experience, to improve our website, to process transactions, and to send periodic emails regarding your order or other products and services.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">3. Sharing Your Personal Information</h3>
        <p>We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners for the purposes outlined above.</p>
      </>
    ),
  },
  claim: {
    title: 'Claim Your Business',
    content: (
      <>
        <p className="text-center mb-8">Is your business already listed on Exhistalls? Fill out the form below to claim your stall and take control of your profile.</p>
        <form className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
           <div>
              <label htmlFor="business-name" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Business Name</label>
              <input type="text" id="business-name" required className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold focus:border-transparent outline-none transition" />
           </div>
           <div>
              <label htmlFor="your-name" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Your Full Name</label>
              <input type="text" id="your-name" required className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold focus:border-transparent outline-none transition" />
           </div>
           <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Your Email Address</label>
              <input type="email" id="email" required className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold focus:border-transparent outline-none transition" />
           </div>
           <div className="pt-2">
              <button type="submit" className="w-full bg-brand-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
                Submit Claim
              </button>
           </div>
        </form>
      </>
    ),
  }
};

const LegalPage: React.FC<LegalPageProps> = ({ pageType, onNavigate }) => {
  const { title, content } = legalContent[pageType];

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={onNavigate} />
      <main className="flex-grow bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center mb-10">{title}</h1>
            <div className={`prose dark:prose-invert max-w-none text-brand-secondary dark:text-slate-300 leading-relaxed ${pageType !== 'claim' ? 'bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md' : ''}`}>
              {content}
            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LegalPage;
