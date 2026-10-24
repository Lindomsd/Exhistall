/**
 * Shown in place of the marketplace when the app has not been connected to a
 * Supabase project yet (no public VITE_SUPABASE_* values). Keeps the deployed
 * app honest and self-documenting instead of rendering an empty market.
 */
export default function SetupNotice() {
  return (
    <main className="market-canvas min-h-screen px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="market-grain mx-auto max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-white/10 px-4 py-2 text-xs font-bold tracking-[.18em] text-brand-gold uppercase">
          <span className="h-2 w-2 rounded-full bg-brand-gold" /> First-time setup
        </p>
        <h1 className="market-display-font mt-5 text-4xl font-bold sm:text-5xl">
          Exhistall is ready to open — just connect the market.
        </h1>
        <p className="mt-4 text-lg text-blue-100">
          This app runs on Supabase for accounts, stalls and exhibition halls. Add your public
          project credentials and run the migrations to bring the market to life.
        </p>

        <ol className="mt-8 space-y-4">
          <li className="rounded-xl border border-white/15 bg-white/5 p-5">
            <p className="font-bold text-brand-gold">1 · Create a Supabase project</p>
            <p className="mt-1 text-sm text-blue-100">
              Then run the SQL in <code className="text-white">supabase/migrations</code> from the
              SQL editor (or <code className="text-white">supabase db push</code>).
            </p>
          </li>
          <li className="rounded-xl border border-white/15 bg-white/5 p-5">
            <p className="font-bold text-brand-gold">2 · Add public environment values</p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-[#091B42] p-3 text-sm leading-relaxed text-blue-100">
              {`VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key`}
            </pre>
            <p className="mt-1 text-sm text-blue-100">
              Locally put these in <code className="text-white">.env.local</code>; on Netlify add
              them under Site&nbsp;settings&nbsp;→&nbsp;Environment&nbsp;variables.
            </p>
          </li>
          <li className="rounded-xl border border-white/15 bg-white/5 p-5">
            <p className="font-bold text-brand-gold">3 · Restart the dev server</p>
            <p className="mt-1 text-sm text-blue-100">
              Run <code className="text-white">npm run dev</code> again and the market will load.
            </p>
          </li>
        </ol>

        <p className="mt-8 text-sm text-blue-200">
          Only ever add public, browser-safe <code>anon/publishable</code> keys here — never a
          service-role key.
        </p>
      </div>
    </main>
  );
}
