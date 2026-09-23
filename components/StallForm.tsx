import React, { useState } from 'react';
import type { Stall, StallInput } from '../types';
import AssetUploader from './AssetUploader';

interface StallFormProps {
  stall?: Partial<Stall>;
  onSubmit: (formData: StallInput) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
  submitLabel?: string;
}

const StallForm: React.FC<StallFormProps> = ({ stall, onSubmit, onCancel, isSaving = false, submitLabel }) => {
  const [formData, setFormData] = useState({
    name: stall?.name || '', slogan: stall?.slogan || '', category: stall?.category || 'Food & Drink',
    logo_url: stall?.logo_url || '', banner_url: stall?.banner_url || '', description: stall?.description || '',
    mission: stall?.mission || '', address: stall?.location?.address || '', phone: stall?.contact?.phone || '',
    email: stall?.contact?.email || '', website: stall?.contact?.website || '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit({
      name: formData.name, slogan: formData.slogan, category: formData.category, logo_url: formData.logo_url,
      banner_url: formData.banner_url, description: formData.description, mission: formData.mission,
      location: { address: formData.address, lat: stall?.location?.lat ?? 0, lng: stall?.location?.lng ?? 0 },
      contact: { phone: formData.phone, email: formData.email, website: formData.website },
    });
  };

  const inputClass = 'w-full rounded-md border border-gray-300 bg-brand-light p-2 dark:border-slate-600 dark:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-6">
        <h2 className="border-b border-gray-300 pb-4 text-2xl font-bold dark:border-slate-700">Basic information</h2>
        <div><label htmlFor="name" className="mb-2 block text-sm font-medium">Stall name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSaving} className={inputClass} /></div>
        <div><label htmlFor="slogan" className="mb-2 block text-sm font-medium">Slogan / tagline</label><input type="text" id="slogan" name="slogan" value={formData.slogan} onChange={handleChange} disabled={isSaving} className={inputClass} /></div>
        <div className="grid gap-6 md:grid-cols-2">
          <AssetUploader label="Stall logo" value={formData.logo_url} onChange={(logo_url) => setFormData((previous) => ({ ...previous, logo_url }))} folder="logos" helpText="Square images work best. Upload up to 5 MB or paste an image URL." disabled={isSaving} />
          <AssetUploader label="Stall banner" value={formData.banner_url} onChange={(banner_url) => setFormData((previous) => ({ ...previous, banner_url }))} folder="banners" helpText="Wide landscape images work best. Upload up to 5 MB or paste an image URL." disabled={isSaving} />
        </div>
        <div><label htmlFor="category" className="mb-2 block text-sm font-medium">Category</label><select id="category" name="category" value={formData.category} onChange={handleChange} disabled={isSaving} className={inputClass}><option>Food & Drink</option><option>Fashion & Apparel</option><option>Digital Services</option><option>Home & Craft</option><option>Health & Beauty</option><option>Consulting</option><option>Arts & Entertainment</option><option>Automotive</option></select></div>
      </section>
      <section className="space-y-6">
        <h2 className="border-b border-gray-300 pb-4 text-2xl font-bold dark:border-slate-700">About your business</h2>
        <div><label htmlFor="description" className="mb-2 block text-sm font-medium">Description</label><textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} disabled={isSaving} className={inputClass} /></div>
        <div><label htmlFor="mission" className="mb-2 block text-sm font-medium">Mission statement</label><textarea id="mission" name="mission" value={formData.mission} onChange={handleChange} rows={3} disabled={isSaving} className={inputClass} /></div>
      </section>
      <section className="space-y-6">
        <h2 className="border-b border-gray-300 pb-4 text-2xl font-bold dark:border-slate-700">Contact information</h2>
        <div><label htmlFor="address" className="mb-2 block text-sm font-medium">Address</label><input type="text" id="address" name="address" value={formData.address} onChange={handleChange} disabled={isSaving} className={inputClass} /></div>
        <div className="grid gap-6 md:grid-cols-2"><div><label htmlFor="phone" className="mb-2 block text-sm font-medium">Phone number</label><input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={isSaving} className={inputClass} /></div><div><label htmlFor="email" className="mb-2 block text-sm font-medium">Public email</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} disabled={isSaving} className={inputClass} /></div></div>
        <div><label htmlFor="website" className="mb-2 block text-sm font-medium">Website URL</label><input type="url" id="website" name="website" placeholder="https://example.com" value={formData.website} onChange={handleChange} disabled={isSaving} className={inputClass} /></div>
      </section>
      <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} disabled={isSaving} className="rounded-lg bg-gray-200 px-6 py-2 font-bold text-brand-dark transition-colors hover:bg-gray-300 disabled:cursor-not-allowed dark:bg-slate-700 dark:text-brand-light dark:hover:bg-slate-600">Cancel</button><button type="submit" disabled={isSaving} className="rounded-lg bg-brand-blue px-6 py-2 font-bold text-white transition-colors hover:bg-opacity-90 disabled:cursor-wait disabled:bg-opacity-50">{isSaving ? 'Saving…' : submitLabel ?? (stall ? 'Save changes' : 'Submit for review')}</button></div>
    </form>
  );
};

export default StallForm;
