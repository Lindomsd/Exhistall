import React, { useState } from 'react';
import type { Product } from '../types';

interface ProductFormProps {
    product?: Product | null;
    onSubmit: (formData: Omit<Product, 'id'>) => Promise<void>;
    onCancel: () => void;
    isSaving?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product = null, onSubmit, onCancel, isSaving }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        imageUrl: product?.imageUrl || 'https://picsum.photos/seed/newproduct/400/300', // Placeholder
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Product Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none"
                />
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none"
                />
            </div>
             <div>
                <label htmlFor="price" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Price</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full p-2 pl-7 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none"
                    />
                </div>
            </div>
             {/* Simple placeholder for image upload */}
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Image URL (placeholder)</label>
                <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none"
                />
            </div>
             <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 dark:bg-slate-700 text-brand-dark dark:text-brand-light font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-wait">
                    {isSaving ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
