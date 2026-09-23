import React, { useState } from 'react';
import type { GalleryItem } from '../types';
import AssetUploader from './AssetUploader';
import { Icon } from './Icon';

interface GalleryManagerProps {
  gallery: GalleryItem[];
  onAdd: (url: string) => Promise<void>;
  onDelete: (item: GalleryItem) => Promise<void>;
  isSaving?: boolean;
}

const GalleryManager: React.FC<GalleryManagerProps> = ({ gallery, onAdd, onDelete, isSaving = false }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const addImage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageUrl.trim()) {
      setError('Upload an image or add its URL first.');
      return;
    }
    setError('');
    try {
      await onAdd(imageUrl);
      setImageUrl('');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'We could not add this image. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
        <h2 className="text-2xl font-bold">Gallery</h2>
        <p className="mt-1 text-sm text-brand-secondary dark:text-slate-400">Add photographs that help visitors understand your products, services, and exhibition space.</p>
        <form onSubmit={addImage} className="mt-6 space-y-4">
          <AssetUploader label="Gallery image" value={imageUrl} onChange={setImageUrl} folder="gallery" helpText="Upload JPG, PNG, WebP, or GIF up to 5 MB. You may also use an image URL." disabled={isSaving} />
          {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
          <button type="submit" disabled={isSaving || !imageUrl.trim()} className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 font-bold text-white transition-colors hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            <Icon name="plus-circle" className="h-5 w-5" /> {isSaving ? 'Saving…' : 'Add to gallery'}
          </button>
        </form>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Your images</h2>
          <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-semibold text-brand-blue dark:bg-brand-gold/15 dark:text-brand-gold">{gallery.length}</span>
        </div>
        {gallery.length === 0 ? (
          <p className="rounded-md border border-dashed border-gray-300 p-8 text-center text-brand-secondary dark:border-slate-600 dark:text-slate-400">Your gallery is empty. Add a few photos to bring your stall to life.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {gallery.map((item) => (
              <article key={item.id} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-700">
                <img src={item.type === 'image' ? item.url : item.thumbnailUrl || item.url} alt="Stall gallery" className="h-full w-full object-cover" />
                <button type="button" onClick={() => onDelete(item)} disabled={isSaving} aria-label="Delete gallery image" className="absolute right-2 top-2 rounded-full bg-white/95 p-2 text-red-600 opacity-100 shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 disabled:cursor-not-allowed">
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default GalleryManager;
