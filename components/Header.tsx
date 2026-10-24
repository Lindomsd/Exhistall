import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import type { User } from '../types';

interface HeaderProps {
  onNavigate: (page: string, stallId?: string) => void;
  onSearch?: (query: string) => void;
  currentUser?: User | null;
  onLogout?: () => void;
  onBack?: () => void;
  isLoginPage?: boolean;
}

const NAV_ITEMS = [
  { label: 'Market square', to: '/' },
  { label: 'Browse aisles', to: '/marketplace' },
  { label: 'Exhibition halls', to: '/exhibitions' },
  { label: 'Find a stall', to: '/categories' },
];

export default function Header({
  onNavigate,
  onSearch,
  currentUser,
  onLogout,
  onBack,
  isLoginPage = false,
}: HeaderProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch?.(query);
    setMenuOpen(false);
  };

  const goTo = (page: string) => {
    setMenuOpen(false);
    onNavigate(page);
  };

  const openStall = () => {
    if (currentUser) {
      goTo('create-stall');
    } else if (
      window.confirm(
        'You need to be logged in to set up a stall. Would you like to log in or create an account?',
      )
    ) {
      goTo('login');
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-2 text-sm font-bold transition ${
      isActive ? 'bg-white/15 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-blue/95 text-white shadow-lg backdrop-blur">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="mr-1 rounded-full p-2 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                aria-label="Back"
              >
                <Icon name="arrow-left" className="h-5 w-5" />
              </button>
            ) : null}
            <Link
              to="/"
              className="rounded-lg p-2 text-left transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              aria-label="Exhistall home"
            >
              <img
                src="/brand/exhistall-logo-light.svg"
                alt="Exhistall — the digital marketplace"
                className="h-10 w-auto max-w-[10.75rem] sm:h-11 sm:max-w-[13.5rem]"
              />
            </Link>
          </div>

          {!isLoginPage && onSearch && (
            <div className="hidden min-w-0 flex-1 px-3 md:flex md:justify-center">
              <form onSubmit={submitSearch} className="relative w-full max-w-md">
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search the market…"
                  className="block w-full rounded-full border border-white/10 bg-white/15 py-2 pr-10 pl-4 text-sm text-white placeholder-blue-100 outline-none transition focus:border-brand-gold focus:bg-white/20 focus:ring-2 focus:ring-brand-gold/30"
                  aria-label="Search the market"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label="Submit search"
                >
                  <Icon name="search" className="h-5 w-5 text-brand-gold" />
                </button>
              </form>
            </div>
          )}

          {!isLoginPage && (
            <div className="flex items-center">
              <div className="hidden items-center gap-1 lg:flex">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={navLinkClass}
                    end={item.to === '/'}
                  >
                    {item.label}
                  </NavLink>
                ))}
                {currentUser ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        goTo(currentUser.stallId ? 'stallholder-dashboard' : 'create-stall')
                      }
                      className="rounded-full px-3 py-2 text-sm font-bold text-blue-100 transition hover:bg-white/10 hover:text-white"
                    >
                      {currentUser.stallId ? 'My stall' : 'Open a stall'}
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        type="button"
                        onClick={() => goTo('admin')}
                        className="rounded-full px-3 py-2 text-sm font-bold text-blue-100 transition hover:bg-white/10 hover:text-white"
                      >
                        Admin
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onLogout}
                      className="ml-1 rounded-full border border-white/20 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                    >
                      Leave
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => goTo('login')}
                      className="rounded-full px-3 py-2 text-sm font-bold text-blue-100 transition hover:bg-white/10 hover:text-white"
                    >
                      Sign in
                    </button>
                    <button
                      type="button"
                      onClick={openStall}
                      className="market-chip ml-1 rounded-full bg-brand-gold px-4 py-2 text-sm font-extrabold text-brand-blue hover:bg-yellow-300"
                    >
                      Open a stall
                    </button>
                  </>
                )}
              </div>

              <div className="ml-1 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="rounded-xl p-2 text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                  aria-label="Open market menu"
                  aria-expanded={menuOpen}
                >
                  <Icon name={menuOpen ? 'x' : 'menu'} className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {menuOpen && !isLoginPage && (
        <div className="border-t border-white/10 bg-brand-blue px-4 pt-3 pb-5 shadow-xl">
          <div className="mx-auto">
            {onSearch && (
              <form onSubmit={submitSearch} className="relative md:hidden">
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search the market…"
                  className="w-full rounded-full bg-white/15 py-3 pr-10 pl-4 text-white placeholder-blue-100 outline-none focus:ring-2 focus:ring-brand-gold"
                  aria-label="Search the market"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3"
                  aria-label="Submit search"
                >
                  <Icon name="search" className="h-5 w-5 text-brand-gold" />
                </button>
              </form>
            )}
            <nav className="mt-3 grid gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(item.to);
                  }}
                  className="rounded-lg px-3 py-3 text-left font-bold text-blue-100 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </button>
              ))}
              {currentUser ? (
                <>
                  {currentUser.stallId && (
                    <MobileAction onClick={() => goTo('stallholder-dashboard')}>
                      My stall
                    </MobileAction>
                  )}
                  {currentUser.role === 'admin' && (
                    <MobileAction onClick={() => goTo('admin')}>Admin</MobileAction>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onLogout?.();
                      setMenuOpen(false);
                    }}
                    className="mt-2 rounded-full border border-white/20 px-4 py-3 text-left font-bold text-white"
                  >
                    Leave the market
                  </button>
                </>
              ) : (
                <>
                  <MobileAction onClick={() => goTo('login')}>Sign in</MobileAction>
                  <button
                    type="button"
                    onClick={() => {
                      openStall();
                      setMenuOpen(false);
                    }}
                    className="market-chip mt-2 rounded-full bg-brand-gold px-4 py-3 text-left font-extrabold text-brand-blue"
                  >
                    Open a stall
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileAction({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick();
      }}
      className="rounded-lg px-3 py-3 text-left font-bold text-blue-100 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}
