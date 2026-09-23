import React from react;
import type { Product } from ../types;
import { Icon } from ./Icon;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <article className="market-stall flex h-full flex-col bg-white dark:bg-slate-800">
    <div className="relative h-52 overflow-hidden bg-[#f3dfbb] dark:bg-slate-700">
      {product.imageUrl ? <img className="h-full w-full object-cover transition duration-500 hover:scale-105" src={product.imageUrl} alt={product.name} /> : <div className="flex h-full flex-col items-center justify-center px-4 text-center text-sm font-semibold text-brand-secondary dark:text-slate-300"><Icon name="package" className="mb-2 h-9 w-9 text-[#b84c32]" />Freshly added to the counter</div>}
      <span className="product-tag absolute bottom-3 left-0 bg-brand-gold py-2 pl-4 pr-5 text-sm font-extrabold text-brand-blue shadow-sm">R {product.price.toFixed(2)}</span>
    </div>
    <div className="flex flex-grow flex-col p-5">
      <h3 className="truncate text-lg font-extrabold text-brand-dark dark:text-white">{product.name}</h3>
      {product.description && <p className="mt-2 flex-grow text-sm leading-relaxed text-brand-secondary dark:text-slate-400">{product.description}</p>}
      <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#b84c32]"><Icon name="arrow-right" className="h-4 w-4" /> See it at this stall</p>
    </div>
  </article>
);

export default ProductCard;
