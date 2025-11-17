
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';

interface CreateStallPageProps {
  onNavigate: (page: string) => void;
}

const InputField: React.FC<{ id: string, label: string, type?: string, placeholder?: string, required?: boolean }> = ({ id, label, type = "text", placeholder, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">{label}</label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      required={required}
      className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold focus:border-transparent outline-none transition"
    />
  </div>
);

const TextAreaField: React.FC<{ id: string, label: string, placeholder?: string, rows?: number }> = ({ id, label, placeholder, rows = 4 }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">{label}</label>
    <textarea
      id={id}
      placeholder={placeholder}
      rows={rows}
      className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold focus:border-transparent outline-none transition"
    />
  </div>
);

const FileUploadField: React.FC<{ id: string, label: string, helpText: string }> = ({ id, label, helpText }) => (
    <div>
        <label className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">{label}</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <Icon name="upload" className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-slate-400">
                    <label htmlFor={id} className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-brand-blue dark:text-brand-gold hover:text-opacity-80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue">
                        <span>Upload a file</span>
                        <input id={id} name={id} type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-500">{helpText}</p>
            </div>
        </div>
    </div>
);


const CreateStallPage: React.FC<CreateStallPageProps> = ({ onNavigate }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission here.
    // For now, we'll just navigate home.
    alert("Stall created successfully! (Demo)");
    onNavigate('home');
  };

  return (
    <>
      <Header onNavigate={onNavigate} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center mb-4">Create Your Stall</h1>
            <p className="text-center text-brand-secondary dark:text-slate-400 mb-10">Fill out the details below to get your virtual stall up and running.</p>
            
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg space-y-8">
              {/* Section 1: Basic Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-slate-700 pb-2">Basic Information</h2>
                <InputField id="stall-name" label="Stall Name" placeholder="e.g., Artisan Bakes" required />
                <InputField id="slogan" label="Slogan" placeholder="e.g., Handcrafted with love." required />
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Category</label>
                  <select id="category" required className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold focus:border-transparent outline-none transition">
                    <option>Food & Drink</option>
                    <option>Fashion & Apparel</option>
                    <option>Digital Services</option>
                    <option>Home & Craft</option>
                    <option>Health & Beauty</option>
                    <option>Consulting</option>
                  </select>
                </div>
                <TextAreaField id="description" label="Stall Description" placeholder="Tell us about your business..." />
              </div>

              {/* Section 2: Branding */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-slate-700 pb-2">Branding</h2>
                <FileUploadField id="logo" label="Logo" helpText="PNG, JPG, GIF up to 10MB" />
                <FileUploadField id="banner" label="Banner Image" helpText="PNG, JPG, GIF up to 10MB. Recommended 1200x400px." />
              </div>

              {/* Section 3: Contact Details */}
               <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-slate-700 pb-2">Contact Details</h2>
                 <InputField id="address" label="Address" placeholder="123 Main St, Cityville" />
                 <InputField id="phone" label="Phone Number" type="tel" placeholder="555-123-4567" />
                 <InputField id="email" label="Email Address" type="email" placeholder="contact@yourbusiness.com" />
                 <InputField id="website" label="Website" type="url" placeholder="https://yourbusiness.com" />
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button type="button" onClick={() => onNavigate('home')} className="bg-gray-200 dark:bg-slate-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-dark dark:text-brand-light hover:bg-gray-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Cancel
                  </button>
                  <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                    Create Stall
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default CreateStallPage;
