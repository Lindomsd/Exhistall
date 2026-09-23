import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api, type AdminMfaState } from '../services/api';
import type { User } from '../types';

interface AdminMfaPageProps {
  currentUser: User;
  onLogout: () => void;
  onVerified: () => Promise<void>;
  onNavigate: (page: string) => void;
}

const AdminMfaPage: React.FC<AdminMfaPageProps> = ({ currentUser, onLogout, onVerified, onNavigate }) => {
  const [state, setState] = useState<AdminMfaState | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const loadState = async () => {
    try {
      setState(await api.getAdminMfaState());
    } catch {
      setError('We could not check your administrator security status. Please sign in again.');
    }
  };

  useEffect(() => { void loadState(); }, []);

  const startSetup = async () => {
    setError('');
    setIsBusy(true);
    try {
      const enrollment = await api.enrolAdminMfa();
      setFactorId(enrollment.factorId);
      setQrCode(enrollment.qrCode);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not start two-factor setup.');
    } finally {
      setIsBusy(false);
    }
  };

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsBusy(true);
    try {
      const activeFactor = factorId ?? state?.factorId;
      if (!activeFactor) throw new Error('Start two-factor setup first.');
      await api.verifyAdminMfa(activeFactor, code);
      await onVerified();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'That code could not be verified.');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} />
      <main className="flex flex-grow items-center justify-center bg-brand-light px-4 py-12 dark:bg-brand-dark">
        <section className="w-full max-w-lg rounded-xl bg-white p-7 shadow-xl dark:bg-slate-800">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-blue dark:text-brand-gold">Administrator security</p>
          <h1 className="mt-2 text-2xl font-extrabold">Verify it’s you</h1>
          <p className="mt-3 text-sm text-brand-secondary dark:text-slate-300">Administrator tools can approve stalls and view protected records. They need a time-based one-time code in addition to your password.</p>
          {!qrCode && !state?.enrolled && <button type="button" onClick={() => void startSetup()} disabled={isBusy} className="mt-6 w-full rounded-lg bg-brand-blue px-5 py-3 font-bold text-white disabled:opacity-60">{isBusy ? 'Preparing setup…' : 'Set up authenticator app'}</button>}
          {qrCode && <div className="mt-6 rounded-lg border border-slate-200 p-4 text-center dark:border-slate-600"><p className="mb-3 text-sm font-medium">Scan this with Google Authenticator, Microsoft Authenticator, Authy, or another authenticator app.</p><img src={qrCode} alt="Authenticator setup QR code" className="mx-auto h-48 w-48 rounded bg-white p-2" /></div>}
          {(state?.enrolled || factorId) && <form onSubmit={verify} className="mt-6 space-y-4"><div><label htmlFor="mfa-code" className="mb-2 block text-sm font-bold">Authenticator code</label><input id="mfa-code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} required pattern="[0-9]{6}" placeholder="123456" className="w-full rounded-md border border-slate-300 bg-white p-3 text-center text-xl tracking-[0.4em] outline-none focus:ring-2 focus:ring-brand-blue dark:border-slate-600 dark:bg-brand-dark dark:focus:ring-brand-gold" /></div><button disabled={isBusy || code.length !== 6} className="w-full rounded-lg bg-brand-blue px-5 py-3 font-bold text-white disabled:opacity-60">{isBusy ? 'Verifying…' : 'Verify and open admin area'}</button></form>}
          {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">{error}</p>}
          <button type="button" onClick={onLogout} className="mt-6 text-sm font-bold text-brand-blue underline dark:text-brand-gold">Sign out instead</button>
        </section>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default AdminMfaPage;
