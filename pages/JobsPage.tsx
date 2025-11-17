import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';
import { mockJobs } from '../data/mockData';
import type { Job, User } from '../types';

interface JobsPageProps {
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const JobListing: React.FC<{ job: Job }> = ({ job }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <h3 className="text-lg font-bold text-brand-blue dark:text-brand-gold">{job.title}</h3>
      <p className="mt-1 text-brand-secondary dark:text-slate-300 flex items-center gap-4">
        <span><Icon name="briefcase" className="inline h-4 w-4 mr-1" /> {job.department}</span>
        <span><Icon name="location" className="inline h-4 w-4 mr-1" /> {job.location}</span>
      </p>
    </div>
    <div className="flex-shrink-0 w-full sm:w-auto">
      <button className="bg-brand-gold text-brand-blue font-bold py-2 px-5 rounded-lg w-full sm:w-auto hover:bg-yellow-300 transition-colors">Apply Now</button>
    </div>
  </div>
);

const JobsPage: React.FC<JobsPageProps> = ({ onNavigate, onSearch, currentUser, onLogout }) => {
  const jobsByDepartment: { [key: string]: Job[] } = mockJobs.reduce((acc, job) => {
    (acc[job.department] = acc[job.department] || []).push(job);
    return acc;
  }, {} as { [key: string]: Job[] });

  return (
    <>
      <Header onNavigate={onNavigate} onSearch={onSearch} currentUser={currentUser} onLogout={onLogout} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold">Work With Us</h1>
            <p className="mt-2 text-lg max-w-2xl mx-auto text-brand-secondary dark:text-slate-400">
              Join our mission to empower small businesses. We're a passionate, remote-first team looking for talented individuals to help us grow.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-12">
            {Object.entries(jobsByDepartment).map(([department, jobs]) => (
              <div key={department}>
                <h2 className="text-2xl font-bold mb-6">{department}</h2>
                <div className="space-y-4">
                  {jobs.map(job => (
                    <JobListing key={job.id} job={job} />
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default JobsPage;
