import { Fragment } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StallCard from '../components/StallCard';
import { Icon } from '../components/Icon';
import type { Stall, User } from '../types';

interface HomePageProps {
  stalls: Stall[];
  onStallClick: (stall: Stall) => void;
  onNavigate: (page: string, stallId?: string) => void;
  onSearch: (query: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const AISLES = [
  { name: 'Food & Drink', icon: 'food', colour: 'bg-orange-100 text-orange-800' },
  { name: 'Fashion & Apparel', icon: 'fashion', colour: 'bg-rose-100 text-rose-800' },
  { name: 'Digital Services', icon: 'digital', colour: 'bg-sky-100 text-sky-800' },
  { name: 'Home & Craft', icon: 'craft', colour: 'bg-amber-100 text-amber-800' },
  { name: 'Health & Beauty', icon: 'health', colour: 'bg-emerald-100 text-emerald-800' },
  { name: 'Consulting', icon: 'consulting', colour: 'bg-violet-100 text-violet-800' },
];

export default function HomePage({
  stalls,
  onStallClick,
  onNavigate,
  onSearch,
  currentUser,
  onLogout,
}: HomePageProps) {
  const featuredStalls = stalls.filter((stall) => stall.featured);
  const displayStalls = featuredStalls.length ? featuredStalls : stalls.slice(0, 3);
  const totalProducts = stalls.reduce((sum, stall) => sum + stall.products.length, 0);
  const aisleCount = new Set(stalls.map((stall) => stall.category)).size;

  return (
    <Fragment>
      <Header
        onNavigate={onNavigate}
        onSearch={onSearch}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <main className="market-canvas">
        {/* Hero */}
        <section className="market-grain overflow-hidden bg-brand-blue px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24">
          <div className="relative mx-auto max-w-6xl">
            <div className="pointer-events-none absolute -left-8 top-8 h-24 w-24 rounded-full border border-brand-gold/30 sm:h-40 sm:w-40" />
            <div className="pointer-events-none absolute -right-4 top-20 h-16 w-16 rounded-full bg-brand-gold/20 blur-xl sm:h-28 sm:w-28" />
            <div className="mx-auto max-w-4xl text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-white/10 px-4 py-2 text-xs font-bold tracking-[.18em] text-brand-gold uppercase">
                <span className="h-2 w-2 rounded-full bg-brand-gold" /> Market doors are open
              </p>
              <h1 className="market-display-font mx-auto mt-5 max-w-4xl text-5xl leading-[.95] font-bold text-white sm:text-6xl lg:text-7xl">
                Wander in. See what <span className="text-brand-gold">your neighbours</span> are
                making.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100 sm:text-xl">
                A lively digital market full of independent stalls, useful services, bright ideas
                and the people behind them.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace')}
                  className="market-chip inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3 font-extrabold text-brand-blue transition hover:bg-brand-sunlit"
                >
                  <Icon name="arrow-right" className="h-5 w-5" /> Enter the market
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('create-stall')}
                  className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20"
                >
                  <Icon name="store" className="h-5 w-5" /> Set up a stall
                </button>
              </div>
            </div>
            <div className="market-arch relative mx-auto mt-12 max-w-5xl overflow-hidden border border-brand-gold/25 bg-brand-blue shadow-2xl shadow-black/20">
              <img
                src="/social/exhistall-hero-marketplace.svg"
                alt="A welcoming Exhistall exhibition hall and digital marketplace"
                className="h-52 w-full object-cover object-center sm:h-72 lg:h-80"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-blue/90 via-brand-blue/35 to-transparent px-5 pt-14 pb-5 sm:px-8 sm:pb-7">
                <p className="text-xs font-extrabold tracking-[.18em] text-brand-gold uppercase">
                  A place to exhibit, sell and connect
                </p>
                <p className="mt-1 text-sm font-medium text-white sm:text-base">
                  Every stall has a story. Make yours easy to find.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="market-lane border-y border-white/10 bg-brand-blue py-5">
          <div className="mx-auto grid grid-cols-3 gap-3 px-4 text-center sm:px-6 lg:px-8">
            <div>
              <strong className="market-display-font block text-3xl text-brand-blue sm:text-4xl">
                {stalls.length}
              </strong>
              <span className="text-xs font-bold tracking-wide text-brand-secondary uppercase">
                stalls open
              </span>
            </div>
            <div>
              <strong className="market-display-font block text-3xl text-brand-blue sm:text-4xl">
                {totalProducts}
              </strong>
              <span className="text-xs font-bold tracking-wide text-brand-secondary uppercase">
                things to discover
              </span>
            </div>
            <div>
              <strong className="market-display-font block text-3xl text-brand-blue sm:text-4xl">
                {aisleCount}
              </strong>
              <span className="text-xs font-bold tracking-wide text-brand-secondary uppercase">
                market aisles
              </span>
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="bg-brand-blue py-16 sm:py-20">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-extrabold tracking-[.18em] text-brand-gold uppercase">
                  Featured lane
                </p>
                <h2 className="market-display-font mt-2 text-4xl font-bold text-brand-dark">
                  Meet the stallholders
                </h2>
                <p className="mt-2 max-w-xl text-brand-secondary">
                  Take a slow walk past the stalls that are making today’s market interesting.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('marketplace')}
                className="inline-flex w-fit items-center gap-2 font-extrabold text-brand-blue hover:text-brand-gold"
              >
                <span>Walk the full market</span>
                <Icon name="arrow-right" className="h-5 w-5" />
              </button>
            </div>

            {displayStalls.length ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {displayStalls.map((stall) => (
                  <StallCard key={stall.id} stall={stall} onClick={onStallClick} />
                ))}
              </div>
            ) : (
              <div className="market-stall bg-white p-12 text-center">
                <Icon name="store" className="mx-auto h-12 w-12 text-brand-gold" />
                <h2 className="market-display-font mt-4 text-3xl font-bold">
                  The first stalls are on their way
                </h2>
                <p className="mx-auto mt-2 max-w-md text-brand-secondary">
                  Bring the market to life by opening the first stall and sharing what you do.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('create-stall')}
                  className="market-chip mt-6 rounded-full bg-brand-blue px-5 py-3 font-bold text-white"
                >
                  Open your stall
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Aisles */}
        <section className="border-y border-white/10 bg-brand-midnight py-16 sm:py-20">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-extrabold tracking-[.18em] text-brand-gold uppercase">
                Pick a lane
              </p>
              <h2 className="market-display-font mt-2 text-4xl font-bold">
                What are you in the mood to find?
              </h2>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {AISLES.map((aisle) => (
                <button
                  key={aisle.name}
                  type="button"
                  onClick={() => onNavigate('marketplace')}
                  className={`market-chip group flex min-h-36 flex-col items-center justify-center rounded-2xl border border-white/15 p-4 transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/40 ${aisle.colour}`}
                >
                  <Icon
                    name={aisle.icon}
                    className="mb-3 h-10 w-10 transition group-hover:scale-110"
                  />
                  <span className="text-center text-sm font-extrabold">{aisle.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-blue px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold tracking-[.2em] text-brand-gold uppercase">
              Bring your people with you
            </p>
            <h2 className="market-display-font mt-3 text-4xl font-bold text-white">
              Have something worth stopping for?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-blue-100">
              Set up your digital stall, show your work and make it easy for visitors to find you.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('create-stall')}
              className="market-chip mt-7 rounded-full bg-brand-gold px-6 py-3 font-extrabold text-brand-blue hover:bg-brand-sunlit"
            >
              Open a stall at Exhistall
            </button>
          </div>
        </section>
      </main>
      <Footer onNavigate={onNavigate} />
    </Fragment>
  );
}
