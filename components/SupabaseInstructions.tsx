import React, { useState } from 'react';
import { Icon } from './Icon';

interface SupabaseInstructionsProps {
  onCheckAgain: () => void;
}

const SupabaseInstructions: React.FC<SupabaseInstructionsProps> = ({ onCheckAgain }) => {
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- 1. CREATE an ENUM type for stall status
CREATE TYPE public.stall_status AS ENUM (
    'active',
    'suspended',
    'banned'
);

-- 2. CREATE the 'stalls' table
CREATE TABLE public.stalls (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NOT NULL,
    slogan text,
    category text,
    logo_url text,
    banner_url text,
    description text,
    mission text,
    products jsonb,
    gallery jsonb,
    reviews jsonb,
    location jsonb,
    contact jsonb,
    featured boolean DEFAULT false,
    status public.stall_status DEFAULT 'active'::public.stall_status,
    PRIMARY KEY (id)
);

-- 3. CREATE the 'profiles' table
CREATE TABLE public.profiles (
    id uuid NOT NULL,
    name text,
    role text DEFAULT 'user'::text,
    PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- 4. Enable Row Level Security (RLS) for the tables
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. CREATE security policies to allow access
-- Policy: Allow anyone to read stalls
CREATE POLICY "Allow public read access to stalls" ON public.stalls
    FOR SELECT USING (true);

-- Policy: Allow users to read all profiles
CREATE POLICY "Allow public read access to profiles" ON public.profiles
    FOR SELECT USING (true);

-- Policy: Allow users to create/update their own profile
CREATE POLICY "Users can insert and update their own profile" ON public.profiles
    FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8">
        <div className="text-center">
            <Icon name="dashboard" className="h-16 w-16 mx-auto text-brand-blue dark:text-brand-gold mb-4" />
            <h1 className="text-3xl font-extrabold text-brand-dark dark:text-white">Set Up Your Database Tables</h1>
            <p className="mt-2 text-lg text-brand-secondary dark:text-slate-300">
                Your Supabase project is connected, but the database tables are missing.
            </p>
        </div>

        <div className="mt-8 text-left bg-brand-light dark:bg-brand-dark p-6 rounded-lg border dark:border-slate-700">
          <h2 className="text-xl font-bold mb-4">Complete Your Setup</h2>
          <ol className="list-decimal list-inside space-y-4 text-brand-secondary dark:text-slate-400">
            <li>
              Go to the{' '}
              <a 
                href="https://supabase.com/dashboard/project/_/sql/new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-blue dark:text-brand-gold font-semibold hover:underline"
              >
                SQL Editor
              </a>{' '}
              in your Supabase project dashboard.
            </li>
            <li>
              Copy the complete SQL script below.
              <div className="relative mt-2">
                <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto max-h-64">
                    <code>{sqlScript}</code>
                </pre>
                <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold py-1 px-2 rounded"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </li>
            <li>
                Paste the script into the SQL editor and click <strong className="text-brand-dark dark:text-white">Run</strong>.
            </li>
            <li>
                Once the script has finished, come back here and click the button below.
            </li>
          </ol>
        </div>
        <div className="mt-8 text-center">
            <button 
                onClick={onCheckAgain}
                className="bg-brand-gold text-brand-blue font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition-colors text-lg"
            >
                I've run the script, check again!
            </button>
        </div>
      </div>
    </div>
  );
};

export default SupabaseInstructions;