import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignUp: (name: string, email: string, password: string) => Promise<{ success: boolean; confirmationRequired: boolean; message?: string }>;
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSignUp, onNavigate }) => {
  const [mode, setMode] = useState<'sign-in' | 'register'>('sign-in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      if (mode === 'sign-in') {
        const success = await onLogin(email, password);
        if (!success) setError('We could not sign you in. Check your email and password, then try again.');
      } else {
        const result = await onSignUp(name, email, password);
        if (!result.success) {
          setError(result.message ?? 'We could not create your account. Please try again.');
        } else if (result.confirmationRequired) {
          setMessage('Check your inbox to confirm your email, then return here to sign in and open your stall.');
          setMode('sign-in');
          setPassword('');
        } else {
          onNavigate('create-stall');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (nextMode: 'sign-in' | 'register') => {
    setMode(nextMode);
    setError('');
    setMessage('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header onNavigate={onNavigate} isLoginPage currentUser={null} onLogout={() => {}} />
      <main className="flex flex-grow items-center justify-center bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-slate-800">
            <div className="mb-8 text-center">
              <Icon name="user-circle" className="mx-auto h-12 w-12 text-brand-blue dark:text-brand-gold" />
              <h1 className="mt-2 text-2xl font-extrabold">{mode === 'register' ? 'Open your stall account' : 'Welcome back'}</h1>
              <p className="mt-2 text-sm text-brand-secondary dark:text-slate-400">
                {mode === 'register' ? 'Create an account, verify your email, then submit your stall for review.' : 'Sign in to manage your stall or explore the market.'}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-bold dark:bg-slate-700">
              <button type="button" onClick={() => switchMode('sign-in')} className={`rounded-md px-3 py-2 transition \${mode === 'sign-in' ? 'bg-white text-brand-blue shadow dark:bg-slate-800 dark:text-brand-gold' : 'text-brand-secondary dark:text-slate-300'}`}>Sign in</button>
              <button type="button" onClick={() => switchMode('register')} className={`rounded-md px-3 py-2 transition \${mode === 'register' ? 'bg-white text-brand-blue shadow dark:bg-slate-800 dark:text-brand-gold' : 'text-brand-secondary dark:text-slate-300'}`}>Create account</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-brand-dark dark:text-slate-300">Your name</label>
                <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} autoComplete="name" placeholder="Your name" className="w-full rounded-md border border-gray-300 bg-brand-light p-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-brand-blue dark:border-slate-600 dark:bg-brand-dark dark:focus:ring-brand-gold" />
              </div>}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-brand-dark dark:text-slate-300">Email address</label>
                <input type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="you@example.com" className="w-full rounded-md border border-gray-300 bg-brand-light p-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-brand-blue dark:border-slate-600 dark:bg-brand-dark dark:focus:ring-brand-gold" />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-brand-dark dark:text-slate-300">Password</label>
                <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={mode === 'register' ? 12 : 1} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} placeholder="At least 12 characters" className="w-full rounded-md border border-gray-300 bg-brand-light p-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-brand-blue dark:border-slate-600 dark:bg-brand-dark dark:focus:ring-brand-gold" />
                {mode === 'register' && <p className="mt-1 text-xs text-brand-secondary dark:text-slate-400">Use a unique password of at least 12 characters.</p>}
              </div>
              {error && <p className="rounded-md bg-red-50 p-3 text-center text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">{error}</p>}
              {message && <p className="rounded-md bg-emerald-50 p-3 text-center text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200" role="status">{message}</p>}
              <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-brand-blue px-6 py-3 font-bold text-white transition-colors hover:bg-opacity-90 disabled:cursor-wait disabled:bg-opacity-50">
                {isLoading ? 'Please wait…' : mode === 'register' ? 'Create stall account' : 'Sign in'}
              </button>
            </form>
            <p className="mt-6 text-center text-xs text-brand-secondary dark:text-slate-400">Stalls are reviewed before they appear publicly. Administrator access is protected separately and is never created from this form.</p>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LoginPage;
