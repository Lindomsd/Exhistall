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
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    imageUrl: product?.imageUrl || '',
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setFormData((previous) => ({ ...previous, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      setValidationError('Add a product name before saving.');
      return;
    }
    if (!Number.isFinite(formData.price) || formData.price < 0) {
      setValidationError('Enter a valid price of zero or more.');
      return;
    }
    setValidationError('');
    await onSubmit({ ...formData, name: formData.name.trim(), description: formData.description.trim(), imageUrl: formData.imageUrl.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-brand-dark dark:text-slate-300">Product name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSaving} className="w-full rounded-md border border-gray-300 bg-brand-light p-2 dark:border-slate-600 dark:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold" />
      </div>
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-brand-dark dark:text-slate-300">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} disabled={isSaving} className="w-full rounded-md border border-gray-300 bg-brand-light p-2 dark:border-slate-600 dark:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold" />
      </div>
      <div>
        <label htmlFor="price" className="mb-2 block text-sm font-medium text-brand-dark dark:text-slate-300">Price</label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" disabled={isSaving} className="w-full rounded-md border border-gray-300 bg-brand-light p-2 pl-7 dark:border-slate-600 dark:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold" />
        </div>
      </div>
      <AssetUploader label="Product image" value={formData.imageUrl} onChange={(imageUrl) => setFormData((previous) => ({ ...previous, imageUrl }))} folder="products" helpText="A clear product photo makes the marketplace easier to browse. Upload up to 5 MB or paste an image URL." disabled={isSaving} />
      {validationError && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{validationError}</p>}
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} disabled={isSaving} className="rounded-lg bg-gray-200 px-6 py-2 font-bold text-brand-dark transition-colors hover:bg-gray-300 disabled:cursor-not-allowed dark:bg-slate-700 dark:text-brand-light dark:hover:bg-slate-600">Cancel</button>
        <button type="submit" disabled={isSaving} className="rounded-lg bg-brand-blue px-6 py-2 font-bold text-white transition-colors hover:bg-opacity-90 disabled:cursor-wait disabled:bg-opacity-50">{isSaving ? 'Saving…' : 'Save product'}</button>
      </div>
    </form>
  );
};

export default ProductForm;
