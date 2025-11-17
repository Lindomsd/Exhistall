import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import StallPage from './pages/StallPage';
import CategoriesPage from './pages/CategoriesPage';
import MarketplacePage from './pages/MarketplacePage';
import CreateStallPage from './pages/CreateStallPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ExhibitionsPage from './pages/ExhibitionsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import JobsPage from './pages/JobsPage';
import LegalPage from './pages/LegalPage';
import NetworkingPage from './pages/NetworkingPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import { mockStalls, mockPartnershipRequests, mockUsers } from './data/mockData';
import type { Stall, PartnershipRequest, User } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [stalls, setStalls] = useState<Stall[]>(mockStalls);
  const [partnershipRequests, setPartnershipRequests] = useState<PartnershipRequest[]>(mockPartnershipRequests);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const currentUserStall = stalls[0];

  const handleNavigate = (page: string) => {
    // If trying to access admin page without being an admin, redirect to login
    if (page === 'admin' && currentUser?.role !== 'admin') {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
    setSelectedStall(null);
    window.scrollTo(0, 0);
  };

  const handleSelectStall = (stall: Stall) => {
    setSelectedStall(stall);
    setCurrentPage('stall');
    window.scrollTo(0, 0);
  };

  const handleGoBack = () => {
    setSelectedStall(null);
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  const handleProposePartnership = (recipientStall: Stall, message: string) => {
    const newRequest: PartnershipRequest = {
      id: `pr-${Date.now()}`,
      proposerStall: currentUserStall,
      recipientStall,
      message,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    setPartnershipRequests(prev => [...prev, newRequest]);
  };
  
  const handleLogin = (email: string, password: string): boolean => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user && user.role === 'admin') {
      setCurrentUser(user);
      handleNavigate('admin');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleNavigate('home');
  };

  const handleUpdateStallStatus = (stallId: string, status: 'active' | 'suspended' | 'banned') => {
    setStalls(prevStalls => 
      prevStalls.map(stall => 
        stall.id === stallId ? { ...stall, status } : stall
      )
    );
  };

  useEffect(() => {
    document.body.className = 'bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light';
  }, []);

  const renderPage = () => {
    if (currentPage === 'login') {
      return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
    }
    
    if (currentPage === 'admin') {
      if (currentUser?.role === 'admin') {
        return <AdminDashboardPage 
          stalls={stalls} 
          partnershipRequests={partnershipRequests} 
          onNavigate={handleNavigate} 
          currentUser={currentUser} 
          onLogout={handleLogout}
          onUpdateStallStatus={handleUpdateStallStatus}
        />;
      } else {
        // This is a fallback, handleNavigate should prevent this.
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} initialError="You must be logged in to view this page." />;
      }
    }

    if (currentPage === 'stall' && selectedStall) {
      return (
        <StallPage 
          stall={selectedStall} 
          onBack={handleGoBack} 
          currentUserStall={currentUserStall}
          partnershipRequests={partnershipRequests}
          onProposePartnership={handleProposePartnership}
          onNavigate={handleNavigate}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage stalls={stalls} onStallClick={handleSelectStall} onNavigate={handleNavigate} />;
      case 'categories':
        return <CategoriesPage onNavigate={handleNavigate} />;
      case 'marketplace':
        return <MarketplacePage stalls={stalls} onNavigate={handleNavigate} />;
      case 'create-stall':
        return <CreateStallPage onNavigate={handleNavigate} />;
      case 'networking':
        return <NetworkingPage stalls={stalls} onStallClick={handleSelectStall} onNavigate={handleNavigate} />;
      case 'exhibitions':
        return <ExhibitionsPage onNavigate={handleNavigate} />;
      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} />;
      case 'help':
      case 'guides':
        return <HelpCenterPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} />;
      case 'jobs':
        return <JobsPage onNavigate={handleNavigate} />;
      case 'claim':
        return <LegalPage pageType="claim" onNavigate={handleNavigate} />;
      case 'privacy':
        return <LegalPage pageType="privacy" onNavigate={handleNavigate} />;
      case 'terms':
        return <LegalPage pageType="terms" onNavigate={handleNavigate} />;
      default:
        // Fallback to home for unknown pages
        return <HomePage stalls={stalls} onStallClick={handleSelectStall} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {renderPage()}
    </div>
  );
};

export default App;