import React, { useState, useRef, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';
import type { Stall, User } from '../types';

interface AdminDashboardPageProps {
  stalls: Stall[];
  users: User[];
  onNavigate: (page: string, stallId?: string) => void;
  currentUser: User;
  onLogout: () => void;
  onUpdateStallStatus: (stallId: string, status: Stall['status']) => void;
  onSearch: (query: string) => void;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
    <div className="flex items-center">
      <div className="bg-brand-blue/10 dark:bg-brand-gold/10 p-3 rounded-full">
        <Icon name={icon} className="h-6 w-6 text-brand-blue dark:text-brand-gold" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-brand-secondary dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-brand-dark dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ stalls, users, onNavigate, currentUser, onLogout, onUpdateStallStatus, onSearch }) => {
  const [activeTab, setActiveTab] = useState('stalls');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | Stall['status']>('all');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenActionMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const filteredStalls = useMemo(() => {
    return stalls.filter(stall => statusFilter === 'all' || stall.status === statusFilter);
  }, [stalls, statusFilter]);

  const stats = {
      totalStalls: stalls.length,
      pendingStalls: stalls.filter(s => s.status === 'pending_review').length,
      totalUsers: users.length,
      totalAdmins: users.filter(u => u.role === 'admin').length
  };
  
  const getStatusClass = (status: Stall['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'banned': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const getUserRoleClass = (role: User['role']) => {
      return role === 'admin' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }

  const handleAction = (stallId: string, status: Stall['status']) => {
    const stallName = stalls.find(s => s.id === stallId)?.name || 'this stall';
    let confirmationText = `Are you sure you want to change status to ${status} for ${stallName}?`;
    if (status === 'active') confirmationText = `Are you sure you want to APPROVE ${stallName}?`;
    if (status === 'banned') confirmationText = `Are you sure you want to REJECT and BAN ${stallName}? This is irreversible.`;

    if (window.confirm(confirmationText)) {
        onUpdateStallStatus(stallId, status);
    }
    setOpenActionMenu(null);
  };

  const StallsManagement = () => (
     <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-xl font-bold whitespace-nowrap">Stalls Management ({filteredStalls.length} found)</h2>
          <div>
              <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | Stall['status'])}
                className="p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold outline-none transition w-full"
              >
                <option value="all">All Statuses</option>
                <option value="pending_review">Pending Review</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Stall Name</th>
                <th scope="col" className="px-6 py-3">Owner</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStalls.map(stall => {
                const owner = users.find(u => u.id === stall.ownerId);
                return (
                <tr key={stall.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{stall.name}</th>
                   <td className="px-6 py-4">{owner?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">{stall.category}</td>
                   <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(stall.status)}`}>
                      {stall.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                        <button onClick={() => setOpenActionMenu(openActionMenu === stall.id ? null : stall.id)} className="font-medium text-brand-blue dark:text-brand-gold hover:underline">Actions</button>
                        {openActionMenu === stall.id && (
                            <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-md shadow-lg z-10 border dark:border-slate-700">
                                <div className="py-1">
                                    <button onClick={() => onNavigate('stall', stall.id)} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"><Icon name="eye" className="h-4 w-4"/> View Stall</button>
                                    {stall.status === 'pending_review' && (
                                        <>
                                            <button onClick={() => handleAction(stall.id, 'active')} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-slate-800"><Icon name="check-circle" className="h-4 w-4"/> Approve</button>
                                            <button onClick={() => handleAction(stall.id, 'banned')} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-800"><Icon name="x" className="h-4 w-4"/> Reject</button>
                                        </>
                                    )}
                                    {stall.status === 'active' && (
                                        <>
                                            <button onClick={() => handleAction(stall.id, 'suspended')} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-slate-800">Suspend</button>
                                            <button onClick={() => handleAction(stall.id, 'banned')} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-800">Ban</button>
                                        </>
                                    )}
                                     {stall.status === 'suspended' && (
                                        <button onClick={() => handleAction(stall.id, 'active')} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-slate-800">Reactivate</button>
                                     )}
                                </div>
                            </div>
                        )}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          {filteredStalls.length === 0 && (
            <div className="text-center py-8 text-brand-secondary dark:text-slate-400">
              No stalls match the current filters.
            </div>
          )}
        </div>
    </div>
  );

  const UsersManagement = () => (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Users Management ({users.length} total)</h2>
         <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">User Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Stall Owned</th>
              </tr>
            </thead>
            <tbody>
                {users.map(user => {
                    const stall = stalls.find(s => s.id === user.stallId);
                    return(
                        <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</th>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getUserRoleClass(user.role)}`}>{user.role}</span>
                            </td>
                            <td className="px-6 py-4">{stall?.name || 'N/A'}</td>
                        </tr>
                    )
                })}
            </tbody>
          </table>
        </div>
      </div>
  );


  return (
    <>
      <Header onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} onSearch={onSearch} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-extrabold mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Stalls" value={stats.totalStalls.toString()} icon="store" />
            <StatCard title="Pending Approval" value={stats.pendingStalls.toString()} icon="package" />
            <StatCard title="Total Users" value={stats.totalUsers.toString()} icon="users" />
            <StatCard title="Admins" value={stats.totalAdmins.toString()} icon="user-circle" />
          </div>

          <div className="mb-8 border-b border-gray-300 dark:border-slate-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('stalls')} className={`${activeTab === 'stalls' ? 'border-brand-blue dark:border-brand-gold text-brand-blue dark:text-brand-gold' : 'border-transparent text-brand-secondary hover:border-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Stalls</button>
                <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'border-brand-blue dark:border-brand-gold text-brand-blue dark:text-brand-gold' : 'border-transparent text-brand-secondary hover:border-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Users</button>
            </nav>
          </div>

          {activeTab === 'stalls' ? <StallsManagement /> : <UsersManagement />}
          
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default AdminDashboardPage;
