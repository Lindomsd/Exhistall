import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';

interface LoginPageProps {
  onLogin: (email: string, password: string) => boolean;
  onNavigate: (page: string) => void;
  initialError?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate, initialError }) => {
  const [email, setEmail] = useState('admin@exhistalls.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(initialError || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(email, password);
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={onNavigate} isLoginPage={true} />
      <main className="flex-grow bg-brand-light dark:bg-brand-dark flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl">
            <div className="text-center mb-8">
               <Icon name="store" className="h-12 w-12 mx-auto text-brand-blue dark:text-brand-gold"/>
              <h1 className="text-2xl font-extrabold mt-2">Admin Login</h1>
              <p className="text-sm text-brand-secondary dark:text-slate-400">Enter your credentials to access the dashboard.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold focus:border-transparent outline-none transition"
                />
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <div>
                <button type="submit" className="w-full bg-brand-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
                  Login
                </button>
              </div>

              <div className="text-center">
                  <p className="text-xs text-slate-500">
                      This is a simulated login for demonstration purposes. In a real application, this would be a secure, backend-validated process.
                  </p>
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
