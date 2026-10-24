import { Fragment, useState } from 'react';
import { Icon } from './Icon';
import type { Exhibition, ExhibitionBookingPackage, ExhibitionBookingRequestInput } from '../types';

interface ExhibitionBookingModalProps {
  exhibition: Exhibition | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exhibitionId: string, input: ExhibitionBookingRequestInput) => Promise<void>;
}

const EMPTY_FORM: ExhibitionBookingRequestInput = {
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
  requestedPackage: 'standard',
  message: '',
};

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function ExhibitionBookingModal({
  exhibition,
  isOpen,
  onClose,
  onSubmit,
}: ExhibitionBookingModalProps) {
  const [form, setForm] = useState<ExhibitionBookingRequestInput>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !exhibition) return null;

  const updateField = <K extends keyof ExhibitionBookingRequestInput>(
    key: K,
    value: ExhibitionBookingRequestInput[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const resetAndClose = () => {
    if (submitting) return;
    setForm(EMPTY_FORM);
    setError('');
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (
      !form.businessName.trim() ||
      !form.contactName.trim() ||
      !form.email.trim() ||
      !form.phone.trim()
    ) {
      setError('Please add your business name, contact name, email and phone number.');
      return;
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(exhibition.id, {
        ...form,
        businessName: form.businessName.trim(),
        contactName: form.contactName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Your booking request could not be sent. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Request a stall in ${exhibition.title}`}
    >
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Icon name="check-circle" className="h-8 w-8" />
            </div>
            <h2 className="market-display-font mt-5 text-3xl font-bold">Request received</h2>
            <p className="mt-3 leading-relaxed text-brand-secondary dark:text-slate-300">
              Your request for a stall in <strong>{exhibition.title}</strong> is now with the
              exhibition team. They will contact you using the details you provided.
            </p>
            <p className="mt-3 text-sm text-brand-secondary dark:text-slate-400">
              Approval does not reserve a paid stall or publish a listing. Payment and final
              placement are arranged separately.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="mt-7 rounded-lg bg-brand-blue px-5 py-3 font-bold text-white hover:bg-blue-800"
            >
              Done
            </button>
          </div>
        ) : (
          <Fragment>
            <div className="flex items-start justify-between border-b border-slate-200 p-6 dark:border-slate-700">
              <div>
                <p className="text-xs font-extrabold tracking-[.18em] text-[#b84c32] uppercase">
                  Exhibitor application
                </p>
                <h2 className="market-display-font mt-1 text-2xl font-bold">Book a stall</h2>
                <p className="mt-2 text-sm text-brand-secondary dark:text-slate-300">
                  {exhibition.title}
                </p>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                aria-label="Close booking request"
                className="rounded-lg p-2 text-brand-secondary hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Icon name="x" className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <p className="rounded-lg bg-blue-50 p-3 text-sm leading-relaxed text-brand-blue dark:bg-blue-950/30 dark:text-blue-100">
                Send your details for review. An administrator will contact you and, if approved,
                arrange your stall assignment. No payment is collected here.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold">
                  Business or organisation name
                  <input
                    required
                    maxLength={140}
                    value={form.businessName}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
                  />
                </label>
                <label className="block text-sm font-bold">
                  Your name
                  <input
                    required
                    maxLength={120}
                    value={form.contactName}
                    onChange={(e) => updateField('contactName', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold">
                  Email
                  <input
                    required
                    type="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
                  />
                </label>
                <label className="block text-sm font-bold">
                  Phone or WhatsApp
                  <input
                    required
                    type="tel"
                    maxLength={40}
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
                  />
                </label>
              </div>

              <label className="block text-sm font-bold">
                Preferred stall package
                <select
                  value={form.requestedPackage}
                  onChange={(e) =>
                    updateField('requestedPackage', e.target.value as ExhibitionBookingPackage)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
                >
                  <option value="standard">Standard stall</option>
                  <option value="featured">Featured stall</option>
                  <option value="premium">Premium showcase</option>
                </select>
              </label>

              <label className="block text-sm font-bold">
                Tell us what you would like to exhibit{' '}
                <span className="font-normal text-brand-secondary">(optional)</span>
                <textarea
                  rows={4}
                  maxLength={2000}
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
                />
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  disabled={submitting}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 font-bold dark:border-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-brand-blue px-4 py-2.5 font-bold text-white disabled:opacity-60"
                >
                  {submitting ? 'Sending…' : 'Send booking request'}
                </button>
              </div>
            </form>
          </Fragment>
        )}
      </div>
    </div>
  );
}
