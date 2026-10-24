import { Fragment, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';
import ExhibitionBookingModal from '../components/ExhibitionBookingModal';
import type { Exhibition, ExhibitionBookingRequestInput, Stall, User } from '../types';

interface ExhibitionsPageProps {
  exhibitions: Exhibition[];
  isLoading: boolean;
  onStallClick: (stall: Stall) => void;
  onNavigate: (page: string, stallId?: string) => void;
  onSearch: (query: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onCreateBookingRequest: (
    exhibitionId: string,
    input: ExhibitionBookingRequestInput,
  ) => Promise<void>;
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-ZA', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function formatDates(exhibition: Exhibition): string {
  if (!exhibition.startsAt) return 'Dates to be announced';
  const start = DATE_FORMAT.format(new Date(exhibition.startsAt));
  if (!exhibition.endsAt) return start;
  const end = DATE_FORMAT.format(new Date(exhibition.endsAt));
  return `${start} – ${end}`;
}

export default function ExhibitionsPage({
  exhibitions,
  isLoading,
  onStallClick,
  onNavigate,
  onSearch,
  currentUser,
  onLogout,
  onCreateBookingRequest,
}: ExhibitionsPageProps) {
  const [bookingExhibition, setBookingExhibition] = useState<Exhibition | null>(null);

  const startBooking = (exhibition: Exhibition) => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }
    setBookingExhibition(exhibition);
  };

  return (
    <Fragment>
      <Header
        onNavigate={onNavigate}
        onSearch={onSearch}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <main className="bg-brand-light dark:bg-brand-dark">
        <section className="border-b border-brand-blue/10 bg-gradient-to-br from-brand-blue to-blue-800 text-white">
          <div className="mx-auto px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-blue-100">
                <Icon name="building-office" className="h-4 w-4" /> Curated virtual halls
              </p>
              <h1 className="market-display-font text-4xl font-extrabold sm:text-5xl">
                Step into an Exhibition Hall
              </h1>
              <p className="mt-4 text-lg text-blue-100">
                Explore themed showcases, meet verified local businesses and visit every stall from
                one place.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {isLoading ? (
            <p className="py-16 text-center text-brand-secondary dark:text-slate-400">
              Opening the exhibition halls…
            </p>
          ) : exhibitions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand-blue/30 bg-white p-10 text-center shadow-sm dark:bg-slate-800">
              <Icon
                name="building-office"
                className="mx-auto h-12 w-12 text-brand-blue dark:text-brand-gold"
              />
              <h2 className="mt-4 text-2xl font-bold">New halls are being prepared</h2>
              <p className="mx-auto mt-2 max-w-lg text-brand-secondary dark:text-slate-400">
                There are no public exhibitions just yet. Browse the market square while the next
                showcase is curated.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('marketplace')}
                className="mt-6 rounded-lg bg-brand-blue px-5 py-3 font-bold text-white transition hover:bg-blue-800"
              >
                Browse stalls
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {exhibitions.map((exhibition) => (
                <article
                  key={exhibition.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10"
                >
                  {exhibition.heroImageUrl ? (
                    <img
                      src={exhibition.heroImageUrl}
                      alt=""
                      className="h-56 w-full object-cover sm:h-72"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-blue to-blue-800 text-brand-gold">
                      <Icon name="building-office" className="h-16 w-16" />
                    </div>
                  )}
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <p className="text-sm font-bold tracking-wider text-brand-blue uppercase dark:text-brand-gold">
                          Now showing
                        </p>
                        <h2 className="mt-1 text-3xl font-extrabold text-brand-dark dark:text-white">
                          {exhibition.title}
                        </h2>
                      </div>
                      <div className="space-y-2 text-sm text-brand-secondary sm:text-right dark:text-slate-300">
                        <p className="flex items-center gap-2 sm:justify-end">
                          <Icon
                            name="calendar"
                            className="h-5 w-5 text-brand-blue dark:text-brand-gold"
                          />
                          {formatDates(exhibition)}
                        </p>
                        {exhibition.location && (
                          <p className="flex items-center gap-2 sm:justify-end">
                            <Icon
                              name="location"
                              className="h-5 w-5 text-brand-blue dark:text-brand-gold"
                            />
                            {exhibition.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {exhibition.description && (
                      <p className="mt-5 max-w-3xl leading-7 text-brand-secondary dark:text-slate-300">
                        {exhibition.description}
                      </p>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => startBooking(exhibition)}
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-3 font-bold text-white transition hover:bg-blue-800"
                      >
                        <Icon name="ticket" className="h-5 w-5" />
                        Book a stall
                      </button>
                      {!currentUser && (
                        <p className="text-sm text-brand-secondary dark:text-slate-400">
                          Sign in to submit a booking request.
                        </p>
                      )}
                    </div>

                    <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-bold">Inside this hall</h3>
                        <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-bold text-brand-blue dark:bg-brand-gold/10 dark:text-brand-gold">
                          {exhibition.stalls.length}{' '}
                          {exhibition.stalls.length === 1 ? 'stall' : 'stalls'}
                        </span>
                      </div>
                      {exhibition.stalls.length === 0 ? (
                        <p className="text-brand-secondary dark:text-slate-400">
                          The exhibitors will be announced shortly.
                        </p>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {exhibition.stalls.map(({ stall, boothLabel }) => (
                            <button
                              key={stall.id}
                              type="button"
                              onClick={() => onStallClick(stall)}
                              className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-blue hover:shadow-md dark:border-slate-700 dark:hover:border-brand-gold"
                            >
                              <img
                                src={stall.logo_url || stall.banner_url}
                                alt=""
                                className="h-14 w-14 rounded-lg bg-slate-100 object-cover"
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-bold text-brand-dark dark:text-white">
                                  {stall.name}
                                </span>
                                <span className="block truncate text-sm text-brand-secondary dark:text-slate-400">
                                  {boothLabel || stall.category}
                                </span>
                              </span>
                              <Icon
                                name="arrow-right"
                                className="h-5 w-5 shrink-0 text-brand-blue transition group-hover:translate-x-1 dark:text-brand-gold"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
      <ExhibitionBookingModal
        exhibition={bookingExhibition}
        isOpen={Boolean(bookingExhibition)}
        onClose={() => setBookingExhibition(null)}
        onSubmit={onCreateBookingRequest}
      />
    </Fragment>
  );
}
