import React, { useState } from 'react';
import type { Product, ProductInput } from '../types';
import AssetUploader from './AssetUploader';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (formData: ProductInput) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product = null, onSubmit, onCancel, isSaving = false }) => {
  const [formData, setFormData] = useState<ProductInput>({
    name: product?.name || '', description: product?.description || '', price: product?.price || 0,
    imageUrl: product?.imageUrl || '', listingType: product?.listingType || 'product', category: product?.category || '',
    priceNote: product?.priceNote || '', compareAtPrice: product?.compareAtPrice,
    isAvailable: product?.isAvailable ?? true, featured: product?.featured ?? false, sortOrder: product?.sortOrder || 0,
  });
  const [validationError, setValidationError] = useState('');

  const update = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setFormData((previous) => ({ ...previous, [key]: value }));
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formData.name.trim().length < 2) return setValidationError('Use a name with at least two characters.');
    if (!Number.isFinite(formData.price) || formData.price < 0) return setValidationError('Enter a valid price of zero or more.');
    if (formData.compareAtPrice !== undefined && (!Number.isFinite(formData.compareAtPrice) || formData.compareAtPrice < formData.price)) return setValidationError('The regular price must be at least the current price.');
    setValidationError('');
    await onSubmit({ ...formData, name: formData.name.trim(), description: formData.description.trim(), category: formData.category.trim(), priceNote: formData.priceNote.trim(), imageUrl: formData.imageUrl.trim() });
  };
  const inputClass = 'w-full rounded-md border border-gray-300 bg-brand-light p-2 dark:border-slate-600 dark:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold disabled:cursor-not-allowed disabled:opacity-60';

  return <form onSubmit={handleSubmit} className="space-y-5">
    <div className="grid gap-5 sm:grid-cols-2">
      <div><label htmlFor="listingType" className="mb-2 block text-sm font-medium">Listing type</label><select id="listingType" value={formData.listingType} onChange={(event) => update('listingType', event.target.value as ProductInput['listingType'])} disabled={isSaving} className={inputClass}><option value="product">Product</option><option value="service">Service</option></select></div>
      <div><label htmlFor="category" className="mb-2 block text-sm font-medium">Catalogue category</label><input id="category" value={formData.category} onChange={(event) => update('category', event.target.value)} placeholder="e.g. Catering or Web design" disabled={isSaving} className={inputClass} /></div>
    </div>
    <div><label htmlFor="name" className="mb-2 block text-sm font-medium">{formData.listingType === 'service' ? 'Service name' : 'Product name'}</label><input id="name" value={formData.name} onChange={(event) => update('name', event.target.value)} required disabled={isSaving} className={inputClass} /></div>
    <div><label htmlFor="description" className="mb-2 block text-sm font-medium">Description</label><textarea id="description" value={formData.description} onChange={(event) => update('description', event.target.value)} rows={4} disabled={isSaving} className={inputClass} /></div>
    <div className="grid gap-5 sm:grid-cols-2">
      <div><label htmlFor="price" className="mb-2 block text-sm font-medium">Current price (R)</label><input type="number" id="price" value={formData.price} onChange={(event) => update('price', Number(event.target.value))} required min="0" step="0.01" disabled={isSaving} className={inputClass} /></div>
      <div><label htmlFor="compareAtPrice" className="mb-2 block text-sm font-medium">Regular price (optional)</label><input type="number" id="compareAtPrice" value={formData.compareAtPrice ?? ''} onChange={(event) => update('compareAtPrice', event.target.value === '' ? undefined : Number(event.target.value))} min="0" step="0.01" disabled={isSaving} className={inputClass} /></div>
    </div>
    <div><label htmlFor="priceNote" className="mb-2 block text-sm font-medium">Price note</label><input id="priceNote" value={formData.priceNote} onChange={(event) => update('priceNote', event.target.value)} placeholder="e.g. Per person, from, or while stock lasts" disabled={isSaving} className={inputClass} /></div>
    <AssetUploader label="Listing image" value={formData.imageUrl} onChange={(imageUrl) => update('imageUrl', imageUrl)} folder="products" helpText="A clear image helps visitors decide. JPG, PNG, WebP or GIF up to 5 MB." disabled={isSaving} />
    <div className="grid gap-3 rounded-lg bg-brand-light p-4 dark:bg-slate-700/40 sm:grid-cols-2"><label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={formData.isAvailable} onChange={(event) => update('isAvailable', event.target.checked)} disabled={isSaving} className="h-4 w-4" /> Available to visitors</label><label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={formData.featured} onChange={(event) => update('featured', event.target.checked)} disabled={isSaving} className="h-4 w-4" /> Feature this listing</label></div>
    {validationError && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{validationError}</p>}
    <div className="flex justify-end gap-4 pt-2"><button type="button" onClick={onCancel} disabled={isSaving} className="rounded-lg bg-gray-200 px-5 py-2 font-bold text-brand-dark dark:bg-slate-700 dark:text-brand-light">Cancel</button><button type="submit" disabled={isSaving} className="rounded-lg bg-brand-blue px-5 py-2 font-bold text-white disabled:opacity-50">{isSaving ? 'Saving…' : 'Save listing'}</button></div>
  </form>;
};
export default ProductForm;
