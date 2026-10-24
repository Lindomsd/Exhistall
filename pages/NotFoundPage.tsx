import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';

export default function NotFoundPage() {
  return (
    <main className="market-canvas flex min-h-screen items-center justify-center px-4 py-20 text-white">
      <div className="market-grain mx-auto max-w-xl text-center">
        <Icon name="store" className="mx-auto h-14 w-14 text-brand-gold" />
        <p className="market-display-font mt-4 text-6xl font-bold">404</p>
        <h1 className="mt-2 text-2xl font-bold">This aisle doesn’t exist</h1>
        <p className="mt-3 text-blue-100">
          The page you were looking for has wandered off. Let’s get you back to the market square.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="market-chip inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3 font-extrabold text-brand-blue transition hover:bg-brand-sunlit"
          >
            <Icon name="arrow-right" className="h-5 w-5" /> Back to the market
          </Link>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20"
          >
            Browse stalls
          </Link>
        </div>
      </div>
    </main>
  );
}
