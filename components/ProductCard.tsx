import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-md dark:bg-slate-800">
    <div className="relative h-48 bg-brand-blue/10 dark:bg-slate-700">
      {product.imageUrl ? <img className="h-full w-full object-cover" src={product.imageUrl} alt={product.name} /> : <div className="flex h-full items-center justify-center px-4 text-center text-sm font-semibold text-brand-secondary dark:text-slate-300">Product image coming soon</div>}
    </div>
    <div className="flex flex-grow flex-col p-4">
      <h3 className="truncate text-base font-semibold text-brand-dark dark:text-white">{product.name}</h3>
      {product.description && <p className="mt-1 flex-grow text-sm text-brand-secondary dark:text-slate-400">{product.description}</p>}
      <p className="mt-4 text-lg font-bold text-brand-blue dark:text-brand-gold">${product.price.toFixed(2)}</p>
    </div>
  </article>
);

export default ProductCard;
