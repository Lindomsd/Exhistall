import React, { useState } from 'react';
import type { Stall } from '../types';

interface StallFormProps {
    stall?: Partial<Stall>;
    onSubmit: (formData: any) => Promise<void>;
    onCancel: () => void;
    isSaving?: boolean;
}

const StallForm: React.FC<StallFormProps> = ({ stall, onSubmit, onCancel, isSaving }) => {
    const [formData, setFormData] = useState({
        // FIX: Use optional chaining to safely access properties on the potentially undefined 'stall' prop.
        name: stall?.name || '',
        slogan: stall?.slogan || '',
        category: stall?.category || 'Food & Drink',
        description: stall?.description || '',
        mission: stall?.mission || '',
        address: stall?.location?.address || '',
        phone: stall?.contact?.phone || '',
        email: stall?.contact?.email || '',
        website: stall?.contact?.website || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const stallData = {
            name: formData.name,
            slogan: formData.slogan,
            category: formData.category,
            description: formData.description,
            mission: formData.mission,
            location: {
                address: formData.address,
                lat: 0, // In real app, geocode address
                lng: 0,
            },
            contact: {
                phone: formData.phone,
                email: formData.email,
                website: formData.website,
            },
        };
        onSubmit(stallData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg space-y-8">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-slate-700 pb-4">Basic Information</h2>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Stall Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none" />
                </div>
                <div>
                    <label htmlFor="slogan" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Slogan / Tagline</label>
                    <input type="text" id="slogan" name="slogan" value={formData.slogan} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Category</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none">
                        <option>Food & Drink</option>
                        <option>Fashion & Apparel</option>
                        <option>Digital Services</option>
                        <option>Home & Craft</option>
                        <option>Health & Beauty</option>
                        <option>Consulting</option>
                    </select>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-slate-700 pb-4">About Your Business</h2>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none"></textarea>
                </div>
                <div>
                    <label htmlFor="mission" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Mission Statement</label>
                    <textarea id="mission" name="mission" value={formData.mission} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none"></textarea>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-slate-700 pb-4">Contact Information</h2>
                 <div>
                    <label htmlFor="address" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Address</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Phone Number</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Public Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="website" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Website URL</label>
                    <input type="url" id="website" name="website" placeholder="https://example.com" value={formData.website} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none" />
                </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 dark:bg-slate-700 text-brand-dark dark:text-brand-light font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-wait">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

export default StallForm;