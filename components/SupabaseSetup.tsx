import React from 'react';
import { Icon } from './Icon';

const SupabaseSetup: React.FC = () => {
  // FIX: The code snippet was inside an unclosed template literal, causing the component to not return JSX.
  // The snippet has also been updated to be more helpful and consistent with supabaseClient.ts.
  const codeSnippet = `// In supabaseClient.ts
const supabaseUrl = 'https://mculbqeiwilkcwvyqwtg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jdWxicWVpd2lsa2N3dnlxd3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNjg3OTYsImV4cCI6MjA3ODk0NDc5Nn0.j5t2uK01DTjizx7Un8hhFg40AY7sIoeQ5Az5FeA3MI0';`;

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8 text-center">
        <Icon name="store" className="h-16 w-16 mx-auto text-brand-blue dark:text-brand-gold mb-4" />
        <h1 className="text-3xl font-extrabold text-brand-dark dark:text-white">Welcome to Exhistalls!</h1>
        <p className="mt-2 text-lg text-brand-secondary dark:text-slate-300">
          One last step to get your marketplace running.
        </p>

        <div className="mt-8 text-left bg-brand-light dark:bg-brand-dark p-6 rounded-lg border dark:border-slate-700">
          <h2 className="text-xl font-bold mb-4">Connect to Supabase</h2>
          <p className="mb-4 text-brand-secondary dark:text-slate-400">
            This application requires a Supabase backend to function. Please update the configuration file with your project's credentials.
          </p>
          <ol className="list-decimal list-inside space-y-3">
            <li>
              Open the file: <code className="bg-gray-200 dark:bg-slate-700 font-mono p-1 rounded-md text-sm">supabaseClient.ts</code>
            </li>
            <li>
              Find your Supabase URL and public 'anon' key in your project's API settings.
              <a 
                href="https://supabase.com/dashboard/project/_/settings/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-blue dark:text-brand-gold font-semibold ml-2 hover:underline"
              >
                Find my keys &rarr;
              </a>
            </li>
            <li>
              Replace the placeholder values in the file with your keys, like this:
              <pre className="bg-gray-800 text-white p-4 rounded-md mt-2 text-sm overflow-x-auto">
                <code>{codeSnippet.trim()}</code>
              </pre>
            </li>
          </ol>
          <p className="mt-6 text-sm text-brand-secondary dark:text-slate-400">
            Once you save the file, the application will automatically reload.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetup;
