import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';
import ExhibitionManager from '../components/ExhibitionManager';
import ExhibitionBookingRequestInbox from '../components/ExhibitionBookingRequestInbox';
import type {
  Exhibition,
  ExhibitionBookingRequest,
  ExhibitionBookingStatus,
  ExhibitionInput,
  Stall,
  User,
} from '../types';

interface AdminDashboardPageProps {
  stalls: Stall[];
  users: User[];
  onNavigate: (page: string, stallId?: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onUpdateStallStatus: (stallId: string, status: Stall['status']) => Promise<void> | void;
  exhibitions: Exhibition[];
  onCreateExhibition: (input: ExhibitionInput) => Promise<void>;
  onUpdateExhibition: (id: string, input: Partial<ExhibitionInput>) => Promise<void>;
  onDeleteExhibition: (id: string) => Promise<void>;
  onAssignStallToExhibition: (
    exhibitionId: string,
    stallId: string,
    boothLabel: string,
    sortOrder: number,
  ) => Promise<void>;
  onRemoveStallFromExhibition: (exhibitionId: string, stallId: string) => Promise<void>;
  bookingRequests: ExhibitionBookingRequest[];
  onUpdateBookingRequestStatus: (id: string, status: ExhibitionBookingStatus) => Promise<void>;
  onSearch: (query: string) => void;
}

type TabKey = 'stalls' | 'exhibitions' | 'booking-requests' | 'users';
type StatusFilter = 'all' | Stall['status'];

const STATUSES: StatusFilter[] = ['all', 'pending_review', 'active', 'suspended', 'banned'];

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
      <div className="flex items-center">
        <div className="rounded-full bg-brand-blue/10 p-3 dark:bg-brand-gold/10">
          <Icon name={icon} className="h-6 w-6 text-brand-blue dark:text-brand-gold" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-brand-secondary dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-brand-dark dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function stallStatusClass(status: Stall['status']): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'suspended':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'banned':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'pending_review':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

function roleClass(role: User['role']): string {
  return role === 'admin'
    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}

export default function AdminDashboardPage({
  stalls,
  users,
  onNavigate,
  currentUser,
  onLogout,
  onUpdateStallStatus,
  exhibitions,
  onCreateExhibition,
  onUpdateExhibition,
  onDeleteExhibition,
  onAssignStallToExhibition,
  onRemoveStallFromExhibition,
  bookingRequests,
  onUpdateBookingRequestStatus,
  onSearch,
}: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('stalls');
  const [openActionsStallId, setOpenActionsStallId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const actionsMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setOpenActionsStallId(null);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const filteredStalls = useMemo(
    () => stalls.filter((stall) => statusFilter === 'all' || stall.status === statusFilter),
    [stalls, statusFilter],
  );

  const stats = {
    totalStalls: stalls.length,
    pendingStalls: stalls.filter((stall) => stall.status === 'pending_review').length,
    totalUsers: users.length,
    totalAdmins: users.filter((user) => user.role === 'admin').length,
  };

  const pendingBookings = bookingRequests.filter((request) => request.status === 'pending').length;

  const changeStallStatus = (stallId: string, nextStatus: Stall['status']) => {
    const name = stalls.find((stall) => stall.id === stallId)?.name || 'this stall';
    let message = `Are you sure you want to change status to ${nextStatus} for ${name}?`;
    if (nextStatus === 'active') message = `Are you sure you want to APPROVE ${name}?`;
    if (nextStatus === 'banned')
      message = `Are you sure you want to REJECT and BAN ${name}? This is irreversible.`;
    if (window.confirm(message)) onUpdateStallStatus(stallId, nextStatus);
    setOpenActionsStallId(null);
  };

  const tabButtonClass = (tab: TabKey) =>
    `${
      activeTab === tab
        ? 'border-brand-blue text-brand-blue dark:border-brand-gold dark:text-brand-gold'
        : 'border-transparent text-brand-secondary hover:border-gray-400'
    } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`;

  const renderStallsTab = () => (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
      <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-xl font-bold whitespace-nowrap">
          Stalls Management ({filteredStalls.length} found)
        </h2>
        <div>
          <label htmlFor="status-filter" className="sr-only">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="w-full rounded-md border border-gray-300 bg-brand-light p-2 outline-none transition focus:ring-2 focus:ring-brand-blue dark:border-slate-600 dark:bg-brand-dark dark:focus:ring-brand-gold"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Stall Name
              </th>
              <th scope="col" className="px-6 py-3">
                Owner
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStalls.map((stall) => {
              const owner = users.find((user) => user.id === stall.ownerId);
              return (
                <tr
                  key={stall.id}
                  className="border-b bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    {stall.name}
                  </th>
                  <td className="px-6 py-4">{owner?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">{stall.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${stallStatusClass(stall.status)}`}
                    >
                      {stall.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenActionsStallId(openActionsStallId === stall.id ? null : stall.id)
                        }
                        className="font-medium text-brand-blue hover:underline dark:text-brand-gold"
                      >
                        Actions
                      </button>
                      {openActionsStallId === stall.id && (
                        <div
                          ref={actionsMenuRef}
                          className="absolute right-0 z-10 mt-2 w-48 rounded-md border bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
                        >
                          <div className="py-1">
                            <MenuItem icon="eye" onClick={() => onNavigate('stall', stall.id)}>
                              View Stall
                            </MenuItem>
                            {stall.status === 'pending_review' && (
                              <Fragment>
                                <MenuItem
                                  icon="check-circle"
                                  tone="green"
                                  onClick={() => changeStallStatus(stall.id, 'active')}
                                >
                                  Approve
                                </MenuItem>
                                <MenuItem
                                  icon="x"
                                  tone="red"
                                  onClick={() => changeStallStatus(stall.id, 'banned')}
                                >
                                  Reject
                                </MenuItem>
                              </Fragment>
                            )}
                            {stall.status === 'active' && (
                              <Fragment>
                                <MenuItem
                                  tone="yellow"
                                  onClick={() => changeStallStatus(stall.id, 'suspended')}
                                >
                                  Suspend
                                </MenuItem>
                                <MenuItem
                                  tone="red"
                                  onClick={() => changeStallStatus(stall.id, 'banned')}
                                >
                                  Ban
                                </MenuItem>
                              </Fragment>
                            )}
                            {stall.status === 'suspended' && (
                              <MenuItem
                                tone="green"
                                onClick={() => changeStallStatus(stall.id, 'active')}
                              >
                                Reactivate
                              </MenuItem>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredStalls.length === 0 && (
          <div className="py-8 text-center text-brand-secondary dark:text-slate-400">
            No stalls match the current filters.
          </div>
        )}
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
      <h2 className="mb-4 text-xl font-bold">Users Management ({users.length} total)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                User Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Stall Owned
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const ownedStall = stalls.find((stall) => stall.id === user.stallId);
              return (
                <tr
                  key={user.id}
                  className="border-b bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    {user.name}
                  </th>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${roleClass(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{ownedStall?.name || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Fragment>
      <Header
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
        onSearch={onSearch}
      />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-extrabold">Admin Dashboard</h1>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Stalls" value={String(stats.totalStalls)} icon="store" />
            <StatCard title="Pending Approval" value={String(stats.pendingStalls)} icon="package" />
            <StatCard title="Total Users" value={String(stats.totalUsers)} icon="users" />
            <StatCard title="Admins" value={String(stats.totalAdmins)} icon="user-circle" />
          </div>

          <div className="mb-8 border-b border-gray-300 dark:border-slate-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button onClick={() => setActiveTab('stalls')} className={tabButtonClass('stalls')}>
                Stalls
              </button>
              <button
                onClick={() => setActiveTab('exhibitions')}
                className={tabButtonClass('exhibitions')}
              >
                Exhibition halls
              </button>
              <button
                onClick={() => setActiveTab('booking-requests')}
                className={tabButtonClass('booking-requests')}
              >
                Booking requests{pendingBookings ? ` (${pendingBookings})` : ''}
              </button>
              <button onClick={() => setActiveTab('users')} className={tabButtonClass('users')}>
                Users
              </button>
            </nav>
          </div>

          {activeTab === 'stalls' && renderStallsTab()}
          {activeTab === 'exhibitions' && (
            <ExhibitionManager
              exhibitions={exhibitions}
              stalls={stalls}
              onCreate={onCreateExhibition}
              onUpdate={onUpdateExhibition}
              onDelete={onDeleteExhibition}
              onAssign={onAssignStallToExhibition}
              onRemove={onRemoveStallFromExhibition}
              onOpenStall={(stall) => onNavigate('stall', stall.id)}
            />
          )}
          {activeTab === 'booking-requests' && (
            <ExhibitionBookingRequestInbox
              requests={bookingRequests}
              onUpdateStatus={onUpdateBookingRequestStatus}
            />
          )}
          {activeTab === 'users' && renderUsersTab()}
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </Fragment>
  );
}

function MenuItem({
  children,
  icon,
  tone = 'default',
  onClick,
}: {
  children: React.ReactNode;
  icon?: string;
  tone?: 'default' | 'green' | 'red' | 'yellow';
  onClick: () => void;
}) {
  const toneClass =
    tone === 'green'
      ? 'text-green-600 dark:text-green-400'
      : tone === 'red'
        ? 'text-red-600 dark:text-red-400'
        : tone === 'yellow'
          ? 'text-yellow-600 dark:text-yellow-400'
          : 'text-gray-700 dark:text-slate-300';
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-800 ${toneClass}`}
    >
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
    </button>
  );
}
