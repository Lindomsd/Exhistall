import { useState } from 'react';
import { Icon } from './Icon';
import type { ExhibitionBookingRequest, ExhibitionBookingStatus } from '../types';

interface ExhibitionBookingRequestInboxProps {
  requests: ExhibitionBookingRequest[];
  onUpdateStatus: (id: string, status: ExhibitionBookingStatus) => Promise<void>;
}

const STATUS_STYLES: Record<ExhibitionBookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  declined: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
};

const PACKAGE_LABELS: Record<ExhibitionBookingRequest['requestedPackage'], string> = {
  standard: 'Standard stall',
  featured: 'Featured stall',
  premium: 'Premium showcase',
};

const STATUSES: { value: ExhibitionBookingStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
];

export default function ExhibitionBookingRequestInbox({
  requests,
  onUpdateStatus,
}: ExhibitionBookingRequestInboxProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const changeStatus = async (
    request: ExhibitionBookingRequest,
    nextStatus: ExhibitionBookingStatus,
  ) => {
    if (nextStatus === request.status) return;
    if (
      nextStatus === 'approved' &&
      !window.confirm(
        `Approve ${request.businessName}'s request? This does not assign a stall or record payment.`,
      )
    ) {
      return;
    }
    setUpdatingId(request.id);
    setError('');
    try {
      await onUpdateStatus(request.id, nextStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update this request.');
    } finally {
      setUpdatingId(null);
    }
  };

  const sorted = [...requests].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <section className="space-y-5">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
        <p className="text-xs font-extrabold tracking-[.18em] text-[#e2a316] uppercase">
          Private exhibitor leads
        </p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl font-bold">Stall booking requests</h2>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
            {pendingCount} pending
          </span>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-brand-secondary dark:text-slate-300">
          Review applications here. Approval is not a payment confirmation and does not add the
          exhibitor to a hall—use the Exhibition halls tab to make the final active-stall
          assignment.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200"
        >
          {error}
        </p>
      )}

      {sorted.length ? (
        <div className="space-y-4">
          {sorted.map((request) => (
            <article
              key={request.id}
              className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-extrabold">{request.businessName}</h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-extrabold capitalize ${STATUS_STYLES[request.status]}`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="mt-1 font-semibold text-brand-blue dark:text-brand-gold">
                    {request.exhibitionTitle || 'Exhibition hall unavailable'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Received {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
                <label className="text-sm font-bold">
                  Review status
                  <select
                    aria-label={`Status for ${request.businessName}`}
                    disabled={updatingId === request.id}
                    value={request.status}
                    onChange={(e) =>
                      changeStatus(request, e.target.value as ExhibitionBookingStatus)
                    }
                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold dark:border-slate-600 dark:bg-slate-900"
                  >
                    {STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-5 grid gap-3 border-y border-slate-200 py-4 text-sm sm:grid-cols-2 dark:border-slate-700">
                <p>
                  <strong>Contact:</strong> {request.contactName}
                </p>
                <p>
                  <strong>Requested:</strong> {PACKAGE_LABELS[request.requestedPackage]}
                </p>
                {request.stallName && (
                  <p>
                    <strong>Existing stall:</strong> {request.stallName}
                  </p>
                )}
                <p>
                  <a
                    href={`mailto:${request.email}`}
                    className="font-bold text-brand-blue hover:underline dark:text-brand-gold"
                  >
                    {request.email}
                  </a>
                </p>
                <p>
                  <a
                    href={`tel:${request.phone}`}
                    className="font-bold text-brand-blue hover:underline dark:text-brand-gold"
                  >
                    {request.phone}
                  </a>
                </p>
              </div>

              {request.message && (
                <p className="mt-4 leading-relaxed whitespace-pre-wrap text-brand-secondary dark:text-slate-200">
                  {request.message}
                </p>
              )}

              {request.status === 'approved' && (
                <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
                  Next step: arrange payment separately, then activate the business’s stall and
                  assign it from the Exhibition halls tab.
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-10 text-center shadow-lg dark:bg-slate-800">
          <Icon name="ticket" className="mx-auto h-10 w-10 text-[#e2a316]" />
          <h3 className="mt-3 text-xl font-bold">No booking requests yet</h3>
          <p className="mt-2 text-sm text-brand-secondary dark:text-slate-400">
            Published halls show a “Book a stall” button to signed-in applicants.
          </p>
        </div>
      )}
    </section>
  );
}
