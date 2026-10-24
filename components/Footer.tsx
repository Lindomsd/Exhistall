import { Link } from 'react-router-dom';

interface FooterProps {
  onNavigate?: (page: string, stallId?: string) => void;
}

const PAGE_PATH: Record<string, string> = {
  home: '/',
  marketplace: '/marketplace',
  categories: '/categories',
  'create-stall': '/open-a-stall',
  pricing: '/pricing',
  guides: '/help',
  help: '/help',
  about: '/about',
  contact: '/help',
  privacy: '/privacy',
  terms: '/terms',
};

const EXPLORE = [
  { name: 'Browse aisles', page: 'marketplace' },
  { name: 'Find a stall', page: 'categories' },
  { name: 'Market square', page: 'home' },
];
const STALLHOLDER = [
  { name: 'Open a stall', page: 'create-stall' },
  { name: 'Pricing', page: 'pricing' },
  { name: 'Stallholder guides', page: 'guides' },
];
const MARKET_HELP = [
  { name: 'Help centre', page: 'help' },
  { name: 'About Exhistall', page: 'about' },
  { name: 'Contact the market', page: 'contact' },
];
const HOUSE_RULES = [
  { name: 'Privacy', page: 'privacy' },
  { name: 'Terms', page: 'terms' },
];

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { name: string; page: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-extrabold tracking-[.18em] text-brand-gold uppercase">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.page + link.name}>
            <Link
              to={PAGE_PATH[link.page] ?? '/'}
              className="text-sm font-medium text-blue-100 transition hover:text-white hover:underline"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer(_props: FooterProps) {
  return (
    <footer className="overflow-hidden bg-brand-blue text-brand-light">
      <div className="awning-blue h-4" />
      <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <Link
              to="/"
              className="rounded-lg p-1 text-left transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              aria-label="Exhistall home"
            >
              <img
                src="/brand/exhistall-logo-reversed.svg"
                alt="Exhistall — the digital marketplace"
                className="h-14 w-auto max-w-[15rem]"
              />
            </Link>
            <p className="mt-4 max-w-sm leading-relaxed text-blue-100">
              A digital marketplace where independent businesses can put out their best work and
              visitors can wander, discover and connect.
            </p>
            <Link
              to="/open-a-stall"
              className="market-chip mt-6 rounded-full bg-brand-gold px-5 py-3 font-extrabold text-brand-blue hover:bg-brand-sunlit"
            >
              Set up your stall
            </Link>
          </div>
          <FooterLinkGroup title="Explore" links={EXPLORE} />
          <FooterLinkGroup title="Stallholders" links={STALLHOLDER} />
          <div className="grid grid-cols-2 gap-6 lg:block">
            <FooterLinkGroup title="Market help" links={MARKET_HELP} />
            <div className="mt-0 lg:mt-8">
              <FooterLinkGroup title="House rules" links={HOUSE_RULES} />
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-blue-200 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Exhistall. Made for the people behind the stalls.</p>
          <p className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-gold" /> The market is always growing.
          </p>
        </div>
      </div>
    </footer>
  );
}
