import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const success = await onLogin(email, password);
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
    // On success, App.tsx will handle navigation
    setIsLoading(false);
  };
  
  const fillDemoCredentials = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setEmail('admin@exhistalls.com');
      setPassword('password');
    } else {
      setEmail('alice@example.com');
      setPassword('password');
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={onNavigate} isLoginPage={true} currentUser={null} onLogout={() => {}} />
      <main className="flex-grow bg-brand-light dark:bg-brand-dark flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl">
            <div className="text-center mb-8">
               <Icon name="user-circle" className="h-12 w-12 mx-auto text-brand-blue dark:text-brand-gold"/>
              <h1 className="text-2xl font-extrabold mt-2">Welcome Back!</h1>
              <p className="text-sm text-brand-secondary dark:text-slate-400">Log in to manage your stall or explore.</p>
            </div>
            
            <div className="text-xs text-brand-secondary dark:text-slate-500 mt-2 bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-md border border-yellow-300 dark:border-yellow-700">
                <p className="font-bold mb-2">Demo Mode:</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={() => fillDemoCredentials('user')} className="flex-1 text-center bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded hover:bg-yellow-300 dark:hover:bg-yellow-800/80">Log in as Stallholder</button>
                    <button onClick={() => fillDemoCredentials('admin')} className="flex-1 text-center bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded hover:bg-yellow-300 dark:hover:bg-yellow-800/80">Log in as Admin</button>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold focus:border-transparent outline-none transition"
                />
              </div>
               <div>
                <label htmlFor="password"className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold focus:border-transparent outline-none transition"
                />
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-brand-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-wait"
                >
                  {isLoading ? 'Logging In...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LoginPage;
