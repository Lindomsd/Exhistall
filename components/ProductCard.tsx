
import React from 'react';
import type { Product } from '../types';
import { Icon } from './Icon';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden group flex flex-col">
      <div className="relative">
        <img className="h-48 w-full object-cover" src={product.imageUrl} alt={product.name} />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-brand-gold text-brand-blue font-bold py-2 px-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
                View Product
            </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-semibold text-brand-dark dark:text-white truncate">{product.name}</h3>
        <p className="text-sm text-brand-secondary dark:text-slate-400 mt-1 flex-grow">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-bold text-brand-blue dark:text-brand-gold">${product.price.toFixed(2)}</p>
          <button className="bg-brand-blue text-white hover:bg-opacity-90 p-2 rounded-full transition-colors">
            <Icon name="cart" className="h-5 w-5" />
            <span className="sr-only">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
