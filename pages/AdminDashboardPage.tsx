import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';
import type { Stall, PartnershipRequest, User } from '../types';

interface AdminDashboardPageProps {
  stalls: Stall[];
  partnershipRequests: PartnershipRequest[];
  onNavigate: (page: string) => void;
  currentUser: User;
  onLogout: () => void;
  onUpdateStallStatus: (stallId: string, status: 'active' | 'suspended' | 'banned') => void;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change }) => (
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
    {change && <p className="text-sm text-gray-500 mt-2">{change}</p>}
  </div>
);

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ stalls, partnershipRequests, onNavigate, currentUser, onLogout, onUpdateStallStatus }) => {
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
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

  const totalStalls = stalls.length;
  const totalProducts = stalls.reduce((acc, stall) => acc + stall.products.length, 0);
  const totalRevenue = stalls
    .flatMap(s => s.products)
    .reduce((acc, p) => acc + p.price, 0);

  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 7500 },
  ];
  const maxSales = Math.max(...salesData.map(d => d.sales));
  
  const recentActivities = [
    ...stalls.slice(-2).map(s => ({ type: 'stall', text: `${s.name} joined the platform.` })),
    ...partnershipRequests.slice(-2).map(p => ({ type: 'partnership', text: `${p.proposerStall.name} proposed partnership to ${p.recipientStall.name}.` })),
  ].slice(0, 4);
  
  const getStatusClass = (status: Stall['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'banned':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleAction = (stallId: string, status: Stall['status']) => {
    const stallName = stalls.find(s => s.id === stallId)?.name || 'this stall';
    if (window.confirm(`Are you sure you want to ${status} ${stallName}?`)) {
        onUpdateStallStatus(stallId, status);
    }
    setOpenActionMenu(null);
  };

  return (
    <>
      <Header onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-extrabold mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Revenue (Simulated)" value={`$${totalRevenue.toLocaleString()}`} icon="dollar-sign" change="+12.5% this month"/>
            <StatCard title="Total Stalls" value={totalStalls.toString()} icon="store" change="+2 new stalls this week"/>
            <StatCard title="Total Products" value={totalProducts.toString()} icon="package" />
            <StatCard title="Partnerships" value={partnershipRequests.length.toString()} icon="briefcase" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Sales Performance</h2>
               <div className="flex items-end justify-around h-64 space-x-2">
                {salesData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-brand-blue/80 dark:bg-brand-gold/80 rounded-t-md hover:opacity-80 transition-opacity"
                      style={{ height: `${(data.sales / maxSales) * 100}%` }}
                      title={`$${data.sales.toLocaleString()}`}
                    ></div>
                    <span className="text-xs font-medium mt-2 text-brand-secondary dark:text-slate-400">{data.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <ul className="space-y-4">
                {recentActivities.map((activity, index) => (
                    <li key={index} className="flex items-start">
                        <div className="bg-brand-light dark:bg-brand-dark p-2 rounded-full mr-3 mt-1">
                           <Icon name={activity.type === 'stall' ? 'store' : 'briefcase'} className="h-5 w-5 text-brand-secondary" />
                        </div>
                        <p className="text-sm text-brand-dark dark:text-slate-300">{activity.text}</p>
                    </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Stalls Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Stall Name</th>
                    <th scope="col" className="px-6 py-3">Category</th>
                    <th scope="col" className="px-6 py-3">Products</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Featured</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stalls.map(stall => (
                    <tr key={stall.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{stall.name}</th>
                      <td className="px-6 py-4">{stall.category}</td>
                      <td className="px-6 py-4">{stall.products.length}</td>
                       <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(stall.status)}`}>
                          {stall.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stall.featured ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{stall.featured ? 'Yes' : 'No'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setOpenActionMenu(openActionMenu === stall.id ? null : stall.id)} className="font-medium text-brand-blue dark:text-brand-gold hover:underline">Actions</button>
                            {openActionMenu === stall.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-md shadow-lg z-10 border dark:border-slate-700">
                                    <div className="py-1">
                                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800">Modify</button>
                                        {stall.status !== 'suspended' && <button onClick={() => handleAction(stall.id, 'suspended')} className="block w-full text-left px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-slate-800">Suspend</button>}
                                        {stall.status !== 'banned' && <button onClick={() => handleAction(stall.id, 'banned')} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-800">Ban</button>}
                                        {stall.status !== 'active' && <button onClick={() => handleAction(stall.id, 'active')} className="block w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-slate-800">Reactivate</button>}
                                    </div>
                                </div>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default AdminDashboardPage;