import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from './Icon';
import type { Exhibition, ExhibitionInput, ExhibitionStatus, Stall } from '../types';

type ExhibitionManagerProps = {
  exhibitions: Exhibition[];
  stalls: Stall[];
  onCreate: (input: ExhibitionInput) => Promise<void>;
  onUpdate: (id: string, updates: Partial<ExhibitionInput>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAssign: (exhibitionId: string, stallId: string, boothLabel: string, sortOrder: number) => Promise<void>;
  onRemove: (exhibitionId: string, stallId: string) => Promise<void>;
  onOpenStall: (stall: Stall) => void;
};

type FormState = {
  title: string;
  description: string;
  heroImageUrl: string;
  location: string;
  startsAt: string;
  endsAt: string;
  status: ExhibitionStatus;
  sortOrder: string;
};

const blankForm: FormState = { title: '', description: '', heroImageUrl: '', location: '', startsAt: '', endsAt: '', status: 'draft', sortOrder: '0' };
const toLocalInput = (value?: string) => value ? new Date(value).toISOString().slice(0, 16) : '';
const toForm = (exhibition: Exhibition): FormState => ({ title: exhibition.title, description: exhibition.description, heroImageUrl: exhibition.heroImageUrl, location: exhibition.location, startsAt: toLocalInput(exhibition.startsAt), endsAt: toLocalInput(exhibition.endsAt), status: exhibition.status, sortOrder: String(exhibition.sortOrder) });
const toInput = (form: FormState): ExhibitionInput => ({ title: form.title, description: form.description, heroImageUrl: form.heroImageUrl, location: form.location, startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined, endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined, status: form.status, sortOrder: Number(form.sortOrder) || 0 });

const ExhibitionManager: React.FC<ExhibitionManagerProps> = ({ exhibitions, stalls, onCreate, onUpdate, onDelete, onAssign, onRemove, onOpenStall }) => {
  const [form, setForm] = useState<FormState>(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedStallId, setSelectedStallId] = useState('');
  const [boothLabel, setBoothLabel] = useState('');
  const [boothSortOrder, setBoothSortOrder] = useState('0');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const activeStalls = useMemo(() => stalls.filter((stall) => stall.status === 'active'), [stalls]);
  const selectedExhibition = exhibitions.find((exhibition) => exhibition.id === editingId);
  const eligibleStalls = selectedExhibition ? activeStalls.filter((stall) => !selectedExhibition.stalls.some((assignment) => assignment.stall.id === stall.id)) : [];

  useEffect(() => {
    setSelectedStallId(eligibleStalls[0]?.id ?? '');
  }, [editingId, exhibitions, stalls]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => setForm((current) => ({ ...current, [field]: value }));
  const reset = () => { setEditingId(null); setForm(blankForm); setMessage(''); };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) { setMessage('A hall title is required.'); return; }
    setSaving(true); setMessage('');
    try {
      if (editingId) await onUpdate(editingId, toInput(form)); else await onCreate(toInput(form));
      reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save the exhibition hall.'); }
    finally { setSaving(false); }
  };

  const edit = (exhibition: Exhibition) => { setEditingId(exhibition.id); setForm(toForm(exhibition)); setMessage(''); };
  const removeHall = async (exhibition: Exhibition) => {
    if (!window.confirm(`Delete “${exhibition.title}” and its stall assignments? This cannot be undone.`)) return;
    setSaving(true); setMessage('');
    try { await onDelete(exhibition.id); if (editingId === exhibition.id) reset(); } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not delete the exhibition hall.'); } finally { setSaving(false); }
  };
  const assign = async () => {
    if (!editingId || !selectedStallId) return;
    setSaving(true); setMessage('');
    try { await onAssign(editingId, selectedStallId, boothLabel, Number(boothSortOrder) || 0); setBoothLabel(''); setBoothSortOrder('0'); } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not add the stall to this hall.'); } finally { setSaving(false); }
  };
  const removeAssignment = async (stall: Stall) => {
    if (!editingId || !window.confirm(`Remove ${stall.name} from this hall?`)) return;
    setSaving(true); setMessage('');
    try { await onRemove(editingId, stall.id); } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not remove the stall.'); } finally { setSaving(false); }
  };

  return <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
    <section className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
      <div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold">Exhibition halls</h2><p className="mt-1 text-sm text-brand-secondary dark:text-slate-400">Create curated halls, then assign active stalls to each one.</p></div><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-brand-blue px-3 py-2 text-sm font-bold text-brand-blue hover:bg-brand-blue/5 dark:border-brand-gold dark:text-brand-gold"><Icon name="plus-circle" className="h-4 w-4" />New hall</button></div>
      {exhibitions.length === 0 ? <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-brand-secondary dark:border-slate-600 dark:text-slate-400">No exhibition halls have been created.</p> : <div className="space-y-3">{exhibitions.map((exhibition) => <div key={exhibition.id} className={`rounded-xl border p-4 ${editingId === exhibition.id ? 'border-brand-blue bg-brand-blue/5 dark:border-brand-gold dark:bg-brand-gold/5' : 'border-slate-200 dark:border-slate-700'}`}><div className="flex gap-3"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-bold">{exhibition.title}</h3><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${exhibition.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : exhibition.status === 'archived' ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>{exhibition.status}</span></div><p className="mt-1 text-sm text-brand-secondary dark:text-slate-400">{exhibition.stalls.length} assigned · {exhibition.startsAt ? new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium' }).format(new Date(exhibition.startsAt)) : 'Date TBC'}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => edit(exhibition)} className="rounded-lg p-2 text-brand-blue hover:bg-brand-blue/10 dark:text-brand-gold" aria-label={`Edit ${exhibition.title}`}><Icon name="edit" className="h-5 w-5" /></button><button type="button" onClick={() => removeHall(exhibition)} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30" aria-label={`Delete ${exhibition.title}`}><Icon name="trash" className="h-5 w-5" /></button></div></div></div>)}</div>}
    </section>

    <section className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
      <h2 className="text-xl font-bold">{editingId ? 'Edit exhibition hall' : 'Create exhibition hall'}</h2>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block text-sm font-bold">Hall title<input required value={form.title} onChange={(event) => updateField('title', event.target.value)} maxLength={140} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900" /></label>
        <label className="block text-sm font-bold">Description<textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900" /></label>
        <label className="block text-sm font-bold">Hero image URL <span className="font-normal text-brand-secondary">(optional)</span><input type="url" value={form.heroImageUrl} onChange={(event) => updateField('heroImageUrl', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900" /></label>
        <label className="block text-sm font-bold">Location <span className="font-normal text-brand-secondary">(optional)</span><input value={form.location} onChange={(event) => updateField('location', event.target.value)} maxLength={160} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900" /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-bold">Starts<input type="datetime-local" value={form.startsAt} onChange={(event) => updateField('startsAt', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900" /></label><label className="block text-sm font-bold">Ends<input type="datetime-local" value={form.endsAt} onChange={(event) => updateField('endsAt', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900" /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-bold">Visibility<select value={form.status} onChange={(event) => updateField('status', event.target.value as ExhibitionStatus)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="block text-sm font-bold">Display order<input type="number" value={form.sortOrder} onChange={(event) => updateField('sortOrder', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900" /></label></div>
        {message && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{message}</p>}
        <div className="flex gap-3"><button disabled={saving} type="submit" className="rounded-lg bg-brand-blue px-4 py-2.5 font-bold text-white disabled:opacity-60">{saving ? 'Saving…' : editingId ? 'Save hall' : 'Create hall'}</button>{editingId && <button type="button" onClick={reset} className="rounded-lg border border-slate-300 px-4 py-2.5 font-bold dark:border-slate-600">Cancel</button>}</div>
      </form>

      {selectedExhibition && <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700"><h3 className="text-lg font-bold">Stalls in {selectedExhibition.title}</h3><p className="mt-1 text-sm text-brand-secondary dark:text-slate-400">Only active stalls are eligible for public assignment.</p><div className="mt-4 flex flex-col gap-2"><select value={selectedStallId} onChange={(event) => setSelectedStallId(event.target.value)} disabled={!eligibleStalls.length || saving} className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900"><option value="">{eligibleStalls.length ? 'Choose an active stall' : 'No unassigned active stalls'}</option>{eligibleStalls.map((stall) => <option key={stall.id} value={stall.id}>{stall.name}</option>)}</select><div className="grid grid-cols-[1fr_7rem] gap-2"><input placeholder="Booth label (optional)" value={boothLabel} onChange={(event) => setBoothLabel(event.target.value)} maxLength={80} className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900" /><input aria-label="Stall display order" type="number" value={boothSortOrder} onChange={(event) => setBoothSortOrder(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900" /></div><button type="button" onClick={assign} disabled={!selectedStallId || saving} className="rounded-lg bg-brand-blue px-4 py-2.5 font-bold text-white disabled:opacity-60">Add stall</button></div><div className="mt-4 space-y-2">{selectedExhibition.stalls.length === 0 ? <p className="text-sm text-brand-secondary dark:text-slate-400">No stalls are assigned yet.</p> : selectedExhibition.stalls.map(({ stall, boothLabel: assignedBoothLabel }) => <div key={stall.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"><img src={stall.logo_url || stall.banner_url} alt="" className="h-10 w-10 rounded object-cover" /><button type="button" onClick={() => onOpenStall(stall)} className="min-w-0 flex-1 text-left"><span className="block truncate font-bold">{stall.name}</span><span className="block truncate text-sm text-brand-secondary dark:text-slate-400">{assignedBoothLabel || stall.category}</span></button><button type="button" onClick={() => removeAssignment(stall)} disabled={saving} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400" aria-label={`Remove ${stall.name}`}><Icon name="trash" className="h-5 w-5" /></button></div>)}</div></div>}
    </section>
  </div>;
};

export default ExhibitionManager;
