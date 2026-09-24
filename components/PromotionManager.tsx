import React, { useState } from 'react';
import type { Promotion, PromotionInput } from '../types';
import AssetUploader from './AssetUploader';
import { Icon } from './Icon';

interface PromotionManagerProps {
  promotions: Promotion[];
  onAdd: (input: PromotionInput) => Promise<void>;
  onUpdate: (id: string, input: PromotionInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isSaving?: boolean;
}

const emptyPromotion = (): PromotionInput => ({
  title: '',
  description: '',
  imageUrl: '',
  promotionLabel: '',
  startAt: '',
  endAt: '',
  isActive: true,
  sortOrder: 0,
});

const toLocalDateTime = (value?: string) => value ? value.slice(0, 16) : '';

const PromotionManager: React.FC<PromotionManagerProps> = ({ promotions, onAdd, onUpdate, onDelete, isSaving = false }) => {
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [isComposerOpen, setComposerOpen] = useState(false);
  const [form, setForm] = useState<PromotionInput>(emptyPromotion());
  const [error, setError] = useState('');

  const begin = (promotion?: Promotion) => {
    setError('');
    setEditing(promotion ?? null);
    setForm(promotion ? {
      title: promotion.title,
      description: promotion.description,
      imageUrl: promotion.imageUrl,
      promotionLabel: promotion.promotionLabel,
      startAt: toLocalDateTime(promotion.startAt),
      endAt: toLocalDateTime(promotion.endAt),
      isActive: promotion.isActive,
      sortOrder: promotion.sortOrder,
    } : emptyPromotion());
    setComposerOpen(true);
  };

  const closeComposer = () => {
    setComposerOpen(false);
    setEditing(null);
    setForm(emptyPromotion());
    setError('');
  };

  const update = <K extends keyof PromotionInput>(key: K, value: PromotionInput[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.title.trim().length < 2) return setError('Give this special a clear title.');
    if (form.startAt && form.endAt && new Date(form.endAt) < new Date(form.startAt)) {
      return setError('The end date must be after the start date.');
    }

    setError('');
    const input: PromotionInput = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      promotionLabel: form.promotionLabel.trim(),
      startAt: form.startAt ? new Date(form.startAt).toISOString() : '',
      endAt: form.endAt ? new Date(form.endAt).toISOString() : '',
    };

    try {
      if (editing) await onUpdate(editing.id, input);
      else await onAdd(input);
      closeComposer();
    } catch {
      // The dashboard displays the specific server error above this panel.
    }
  };

  const remove = async (promotion: Promotion) => {
    if (!window.confirm(`Delete “${promotion.title}”? This cannot be undone.`)) return;
    try {
      await onDelete(promotion.id);
    } catch {
      // The dashboard displays the specific server error above this panel.
    }
  };

  const inputClass = 'w-full rounded-md border border-gray-300 bg-brand-light p-2 dark:border-slate-600 dark:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold disabled:cursor-not-allowed disabled:opacity-60';

  return <div className="space-y-7">
    <section className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Specials & promotions</h2>
          <p className="mt-1 text-sm text-brand-secondary dark:text-slate-400">Time-limited offers and announcements appear publicly only while active, within their dates, and while your stall is live.</p>
        </div>
        <button type="button" onClick={() => begin()} disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 font-bold text-white disabled:opacity-50">
          <Icon name="plus-circle" className="h-5 w-5" />New special
        </button>
      </div>

      {isComposerOpen && <form onSubmit={save} className="mt-6 space-y-5 rounded-lg border border-brand-blue/20 bg-brand-light p-5 dark:bg-slate-700/30">
        <div className="flex justify-between gap-3">
          <h3 className="text-lg font-bold">{editing ? 'Edit special' : 'Create a special'}</h3>
          <button type="button" onClick={closeComposer} disabled={isSaving} className="text-sm font-semibold text-brand-blue dark:text-brand-gold">Cancel</button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label htmlFor="promotion-title" className="mb-2 block text-sm font-medium">Title</label><input id="promotion-title" value={form.title} onChange={(event) => update('title', event.target.value)} required disabled={isSaving} className={inputClass} /></div>
          <div><label htmlFor="promotion-label" className="mb-2 block text-sm font-medium">Badge / callout</label><input id="promotion-label" value={form.promotionLabel} onChange={(event) => update('promotionLabel', event.target.value)} placeholder="e.g. Spring special" disabled={isSaving} className={inputClass} /></div>
        </div>
        <div><label htmlFor="promotion-description" className="mb-2 block text-sm font-medium">What is the offer?</label><textarea id="promotion-description" value={form.description} onChange={(event) => update('description', event.target.value)} rows={3} disabled={isSaving} className={inputClass} /></div>
        <AssetUploader label="Promotion image" value={form.imageUrl} onChange={(imageUrl) => update('imageUrl', imageUrl)} folder="promotions" helpText="Optional: add a clear image for the public offer card." disabled={isSaving} />
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label htmlFor="promotion-start" className="mb-2 block text-sm font-medium">Starts (optional)</label><input id="promotion-start" type="datetime-local" value={form.startAt || ''} onChange={(event) => update('startAt', event.target.value)} disabled={isSaving} className={inputClass} /></div>
          <div><label htmlFor="promotion-end" className="mb-2 block text-sm font-medium">Ends (optional)</label><input id="promotion-end" type="datetime-local" value={form.endAt || ''} onChange={(event) => update('endAt', event.target.value)} disabled={isSaving} className={inputClass} /></div>
        </div>
        <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.isActive} onChange={(event) => update('isActive', event.target.checked)} disabled={isSaving} className="h-4 w-4" />Publish this special when its dates allow</label>
        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button type="submit" disabled={isSaving} className="rounded-lg bg-brand-blue px-5 py-2 font-bold text-white disabled:opacity-50">{isSaving ? 'Saving…' : 'Save special'}</button>
      </form>}
    </section>

    <section className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
      <h2 className="text-xl font-bold">Your specials ({promotions.length})</h2>
      {promotions.length === 0 ? <p className="mt-4 rounded-md border border-dashed border-gray-300 p-7 text-center text-brand-secondary dark:border-slate-600 dark:text-slate-400">No specials yet. A focused offer gives visitors a reason to contact you now.</p> : <div className="mt-5 grid gap-4 md:grid-cols-2">{promotions.map((promotion) => <article key={promotion.id} className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
        {promotion.imageUrl && <img src={promotion.imageUrl} alt="" className="h-32 w-full object-cover" />}
        <div className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-[#b84c32]">{promotion.isActive ? 'Active' : 'Paused'}{promotion.promotionLabel ? ` · ${promotion.promotionLabel}` : ''}</p><h3 className="mt-1 font-bold">{promotion.title}</h3></div><div className="flex gap-3 text-sm font-semibold"><button type="button" onClick={() => begin(promotion)} disabled={isSaving} className="text-brand-blue dark:text-brand-gold">Edit</button><button type="button" onClick={() => void remove(promotion)} disabled={isSaving} className="text-red-600">Delete</button></div></div>
        {promotion.description && <p className="mt-2 text-sm text-brand-secondary dark:text-slate-400">{promotion.description}</p>}
        <p className="mt-3 text-xs text-brand-secondary dark:text-slate-400">{promotion.startAt ? `From ${new Date(promotion.startAt).toLocaleDateString()}` : 'Starts now'}{promotion.endAt ? ` · Ends ${new Date(promotion.endAt).toLocaleDateString()}` : ''}</p></div>
      </article>)}</div>}
    </section>
  </div>;
};

export default PromotionManager;
