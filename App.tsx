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
import StallholderDashboardPage from './pages/StallholderDashboardPage';
import AdminMfaPage from './pages/AdminMfaPage';
import { api } from './services/api';
import type { Stall, StallInput, PartnershipRequest, User, Product, ProductInput, GalleryItem, Promotion, PromotionInput, QuoteRequest, QuoteRequestInput, QuoteRequestStatus } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [allStalls, setAllStalls] = useState<Stall[]>([]); // Includes pending, for admin
  const [partnershipRequests, setPartnershipRequests] = useState<PartnershipRequest[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stall[] | null>(null);
  const [currentUserStall, setCurrentUserStall] = useState<Stall | null>(null);
  const [adminMfaVerified, setAdminMfaVerified] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      try {
        const [fetchedUser, fetchedStalls] = await Promise.all([
          api.getCurrentUser(),
          api.getStalls()
        ]);
        setCurrentUser(fetchedUser);
        setStalls(fetchedStalls);
        
        if (fetchedUser?.role === 'admin') {
          const mfaState = await api.getAdminMfaState();
          setAdminMfaVerified(mfaState.verified);
          if (mfaState.verified) await fetchDataForUser(fetchedUser);
        } else if (fetchedUser) {
          await fetchDataForUser(fetchedUser);
        }

      } catch (error) {
        console.error("Failed to initialize app data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const fetchDataForUser = async (user: User) => {
    if (user.role === 'admin') {
      const [adminStalls, allUsers] = await Promise.all([
          api.getAllStallsForAdmin(),
          api.getUsers(),
      ]);
      setAllStalls(adminStalls);
      setUsers(allUsers);
    }
    if (user.stallId) {
      // A non-critical request must never stop an owner reaching their stall.
      const userStall = await api.getStallById(user.stallId);
      setCurrentUserStall(userStall);
      try {
        setPartnershipRequests(await api.getPartnershipRequestsForStall(user.stallId));
      } catch (error) {
        console.error('Failed to load partnership requests:', error);
        setPartnershipRequests([]);
      }
      try {
        setQuoteRequests(await api.getQuoteRequestsForStall(user.stallId));
      } catch (error) {
        console.error('Failed to load quote requests:', error);
        setQuoteRequests([]);
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(null);
      setCurrentPage('home');
      return;
    }
    const results = stalls.filter(
      stall =>
        stall.name.toLowerCase().includes(query.toLowerCase()) ||
        stall.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setCurrentPage('searchResults');
    window.scrollTo(0, 0);
  };

  const handleNavigate = (page: string, stallId?: string) => {
    if (page === 'admin' && currentUser?.role !== 'admin') {
      setCurrentPage('login');
      return;
    }
    if (page === 'admin' && !adminMfaVerified) {
      setCurrentPage('admin-mfa');
      return;
    }
     if (page === 'stall' && stallId) {
      const stall = allStalls.find(s => s.id === stallId) || stalls.find(s => s.id === stallId);
      if(stall) handleSelectStall(stall);
    } else {
      setCurrentPage(page);
      setSelectedStall(null);
    }
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

  const handleProposePartnership = async (recipientStall: Stall, message: string) => {
    if (!currentUserStall) {
      alert("You must have a stall to propose a partnership.");
      return;
    }
    const newRequest = await api.proposePartnership(currentUserStall, recipientStall, message);
    setPartnershipRequests(prev => [...prev, newRequest]);
  };
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    let user: User | null = null;
    try {
      user = await api.login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
    if (user) {
      setCurrentUser(user);
      if (user.role === 'admin') {
        setAdminMfaVerified(false);
        handleNavigate('admin-mfa');
      } else if (user.stallId) {
        await fetchDataForUser(user);
        handleNavigate('stallholder-dashboard');
      } else {
        await fetchDataForUser(user);
        handleNavigate('home');
      }
      return true;
    }
    return false;
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      const result = await api.signUp(name, email, password);
      if (result.user) {
        setCurrentUser(result.user);
        await fetchDataForUser(result.user);
        handleNavigate(result.user.stallId ? 'stallholder-dashboard' : 'home');
      }
      return { success: true, confirmationRequired: result.confirmationRequired };
    } catch (error) {
      console.error('Sign-up failed:', error);
      return { success: false, confirmationRequired: false, message: error instanceof Error ? error.message : 'Account creation failed.' };
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentUserStall(null);
    setPartnershipRequests([]);
    setQuoteRequests([]);
    setAllStalls([]);
    setUsers([]);
    setAdminMfaVerified(false);
    handleNavigate('home');
  };

  const handleAdminMfaVerified = async () => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setAdminMfaVerified(true);
    await fetchDataForUser(currentUser);
    handleNavigate('admin');
  };

  const handleUpdateStallStatus = async (stallId: string, status: Stall['status']) => {
    const updatedStall = await api.updateStallStatus(stallId, status);
    if (updatedStall) {
      setAllStalls(prevStalls => 
        prevStalls.map(s => s.id === stallId ? updatedStall : s)
      );
      // also update the public stalls if it becomes active
      if(updatedStall.status === 'active') {
        setStalls(prev => {
            const exists = prev.some(s => s.id === stallId);
            return exists ? prev.map(s => s.id === stallId ? updatedStall : s) : [...prev, updatedStall];
        });
      } else {
         setStalls(prev => prev.filter(s => s.id !== stallId));
      }
      alert(`Stall status updated to ${status}.`);
    } else {
       alert('Failed to update stall status.');
    }
  };
  
  const handleCreateStall = async (stallData: StallInput) => {
      const newStall = await api.createStall(stallData);
      if (newStall) {
          setAllStalls(prev => [...prev, newStall]);
          // This also updates currentUser in the API service
          const updatedUser = await api.getCurrentUser();
          if (updatedUser) {
            setCurrentUser(updatedUser);
            await fetchDataForUser(updatedUser);
          }
      }
  }

  const handleUpdateStall = async (stallId: string, updates: Partial<Stall>) => {
    const updatedStall = await api.updateStall(stallId, updates);
    if(updatedStall) {
      setCurrentUserStall(updatedStall);
      setAllStalls(prev => prev.map(s => s.id === stallId ? updatedStall : s));
      setStalls(prev => prev.map(s => s.id === stallId ? updatedStall : s));
    }
  }

  const handleAddProduct = async (stallId: string, productData: ProductInput) => {
    const updatedStall = await api.addProduct(stallId, productData);
    if(updatedStall) setCurrentUserStall(updatedStall);
  }

  const handleUpdateProduct = async (stallId: string, productId: string, updates: Partial<Product>) => {
    const updatedStall = await api.updateProduct(stallId, productId, updates);
    if(updatedStall) setCurrentUserStall(updatedStall);
  }

  const handleDeleteProduct = async (stallId: string, productId: string) => {
    const updatedStall = await api.deleteProduct(stallId, productId);
    if(updatedStall) setCurrentUserStall(updatedStall);
  }

  const handleAddPromotion = async (stallId: string, promotionData: PromotionInput) => {
    syncOwnedStall(await api.addPromotion(stallId, promotionData));
  };

  const handleUpdatePromotion = async (stallId: string, promotionId: string, updates: Partial<Promotion>) => {
    syncOwnedStall(await api.updatePromotion(stallId, promotionId, updates));
  };

  const handleDeletePromotion = async (stallId: string, promotionId: string) => {
    syncOwnedStall(await api.deletePromotion(stallId, promotionId));
  };

  const syncOwnedStall = (updatedStall: Stall | null) => {
    if (!updatedStall) return;
    setCurrentUserStall(updatedStall);
    setAllStalls((previous) => previous.map((stall) => stall.id === updatedStall.id ? updatedStall : stall));
    setStalls((previous) => previous.map((stall) => stall.id === updatedStall.id ? updatedStall : stall));
    setSelectedStall((previous) => previous?.id === updatedStall.id ? updatedStall : previous);
  };

  const handleAddGalleryItem = async (stallId: string, url: string) => {
    syncOwnedStall(await api.addGalleryItem(stallId, url));
  };

  const handleDeleteGalleryItem = async (stallId: string, item: GalleryItem) => {
    syncOwnedStall(await api.deleteGalleryItem(stallId, item.id));
  };

  const handleUpdatePartnershipStatus = async (requestId: string, status: 'accepted' | 'declined') => {
    const updatedRequest = await api.updatePartnershipRequestStatus(requestId, status);
    if (updatedRequest) {
      setPartnershipRequests(prev => prev.map(r => r.id === requestId ? updatedRequest : r));
    }
  }

  const handleCreateQuoteRequest = async (stallId: string, input: QuoteRequestInput) => {
    await api.createQuoteRequest(stallId, input);
  };

  const handleUpdateQuoteRequestStatus = async (requestId: string, status: QuoteRequestStatus) => {
    const updatedRequest = await api.updateQuoteRequestStatus(requestId, status);
    if (updatedRequest) setQuoteRequests((previous) => previous.map((request) => request.id === requestId ? updatedRequest : request));
  };

  useEffect(() => {
    document.body.className = 'bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light';
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-dark">
        <div className="text-center">
          <p className="text-xl font-semibold">Loading Exhistalls...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (currentPage === 'login') {
      return <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} onNavigate={handleNavigate} />;
    }
    
    if (currentPage === 'admin-mfa' && currentUser?.role === 'admin') {
      return <AdminMfaPage currentUser={currentUser} onLogout={handleLogout} onVerified={handleAdminMfaVerified} onNavigate={handleNavigate} />;
    }

    if (currentPage === 'admin' && currentUser?.role === 'admin' && adminMfaVerified) {
      return <AdminDashboardPage 
        stalls={allStalls} 
        users={users}
        onNavigate={handleNavigate} 
        currentUser={currentUser} 
        onLogout={handleLogout}
        onUpdateStallStatus={handleUpdateStallStatus}
        onSearch={handleSearch}
      />;
    }
    
    if (currentPage === 'stallholder-dashboard' && currentUserStall) {
      return (
        <StallholderDashboardPage 
          stall={currentUserStall}
          partnershipRequests={partnershipRequests}
          quoteRequests={quoteRequests}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          onSearch={handleSearch}
          onUpdateStall={handleUpdateStall}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddPromotion={handleAddPromotion}
          onUpdatePromotion={handleUpdatePromotion}
          onDeletePromotion={handleDeletePromotion}
          onAddGalleryItem={handleAddGalleryItem}
          onDeleteGalleryItem={handleDeleteGalleryItem}
          onUpdatePartnershipStatus={handleUpdatePartnershipStatus}
          onUpdateQuoteRequestStatus={handleUpdateQuoteRequestStatus}
        />
      );
    }
    
    if (currentPage === 'searchResults') {
      return (
        <NetworkingPage
          stalls={searchResults || []}
          onStallClick={handleSelectStall}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          pageTitle="Search Results"
          searchQuery={searchQuery}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      );
    }

    if (currentPage === 'stall' && selectedStall) {
      return (
        <StallPage 
          stall={selectedStall} 
          onBack={handleGoBack} 
          currentUser={currentUser}
          onProposePartnership={handleProposePartnership}
          onCreateQuoteRequest={handleCreateQuoteRequest}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          onLogout={handleLogout}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage stalls={stalls} onStallClick={handleSelectStall} onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout} />;
      case 'categories':
        return <CategoriesPage onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
      case 'marketplace':
        return <MarketplacePage stalls={stalls} onStallClick={handleSelectStall} onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
      case 'create-stall':
        return <CreateStallPage onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout} onCreateStall={handleCreateStall} />;
      case 'networking':
        return <NetworkingPage stalls={stalls} onStallClick={handleSelectStall} onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
      case 'exhibitions':
        return <ExhibitionsPage onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
      case 'help':
      case 'guides':
        return <HelpCenterPage onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
      case 'jobs':
        return <JobsPage onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
      case 'claim':
        return <LegalPage pageType="claim" onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
      case 'privacy':
        return <LegalPage pageType="privacy" onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
      case 'terms':
        return <LegalPage pageType="terms" onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
      default:
        return <HomePage stalls={stalls} onStallClick={handleSelectStall} onNavigate={handleNavigate} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout}/>;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {renderPage()}
    </div>
  );
};

export default App;
