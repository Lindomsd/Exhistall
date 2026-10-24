import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { api } from './services/api';
import type {
  Exhibition,
  ExhibitionBookingRequest,
  ExhibitionInput,
  PartnershipRequest,
  ProductInput,
  PromotionInput,
  QuoteRequest,
  QuoteRequestInput,
  Stall,
  StallInput,
  User,
} from './types';

// Route-level code splitting keeps the initial download small.
const HomePage = lazy(() => import('./pages/HomePage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const ExhibitionsPage = lazy(() => import('./pages/ExhibitionsPage'));
const NetworkingPage = lazy(() => import('./pages/NetworkingPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CreateStallPage = lazy(() => import('./pages/CreateStallPage'));
const StallPage = lazy(() => import('./pages/StallPage'));
const StallholderDashboardPage = lazy(() => import('./pages/StallholderDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminMfaPage = lazy(() => import('./pages/AdminMfaPage'));

/** Map a logical page key (as used by pages/Header) to a real URL. */
function hrefFor(page: string, stallId?: string): string {
  switch (page) {
    case 'home':
      return '/';
    case 'marketplace':
      return '/marketplace';
    case 'categories':
      return '/categories';
    case 'exhibitions':
      return '/exhibitions';
    case 'networking':
      return '/networking';
    case 'pricing':
      return '/pricing';
    case 'help':
    case 'guides':
      return '/help';
    case 'about':
      return '/about';
    case 'blog':
      return '/blog';
    case 'jobs':
      return '/jobs';
    case 'claim':
      return '/claim';
    case 'privacy':
      return '/privacy';
    case 'terms':
      return '/terms';
    case 'login':
      return '/login';
    case 'create-stall':
      return '/open-a-stall';
    case 'admin':
      return '/admin';
    case 'admin-mfa':
      return '/admin/mfa';
    case 'stallholder-dashboard':
      return '/dashboard';
    case 'searchResults':
      return '/search';
    case 'stall':
      return stallId ? `/stall/${stallId}` : '/';
    default:
      return '/';
  }
}

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg font-semibold opacity-70">Loading…</p>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

interface StallRouteProps {
  stalls: Stall[];
  onProposePartnership: (target: Stall, message: string) => Promise<void>;
  onCreateQuoteRequest: (stallId: string, input: QuoteRequestInput) => Promise<void>;
  onNavigate: (page: string, stallId?: string) => void;
  onSearch: (query: string) => void;
  onLogout: () => void;
  currentUser: User | null;
}

function StallRoute({
  stalls,
  onProposePartnership,
  onCreateQuoteRequest,
  onNavigate,
  onSearch,
  onLogout,
  currentUser,
}: StallRouteProps) {
  const { stallId } = useParams();
  const stall = stalls.find((s) => s.id === stallId);
  if (!stall) return <Navigate to="/" replace />;
  return (
    <StallPage
      stall={stall}
      onBack={() => onNavigate('home')}
      currentUser={currentUser}
      onProposePartnership={onProposePartnership}
      onCreateQuoteRequest={onCreateQuoteRequest}
      onNavigate={onNavigate}
      onSearch={onSearch}
      onLogout={onLogout}
    />
  );
}

interface SearchRouteProps {
  allStalls: Stall[];
  onStallClick: (stall: Stall) => void;
  onNavigate: (page: string, stallId?: string) => void;
  onSearch: (query: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

function SearchRoute({
  allStalls,
  onStallClick,
  onNavigate,
  onSearch,
  currentUser,
  onLogout,
}: SearchRouteProps) {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allStalls.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.category ?? '').toLowerCase().includes(q),
    );
  }, [allStalls, query]);
  return (
    <NetworkingPage
      stalls={results}
      onStallClick={onStallClick}
      onNavigate={onNavigate}
      onSearch={onSearch}
      pageTitle="Search Results"
      searchQuery={query}
      currentUser={currentUser}
      onLogout={onLogout}
    />
  );
}

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [publicStalls, setPublicStalls] = useState<Stall[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [publicExhibitionsLoading, setPublicExhibitionsLoading] = useState(true);
  const [adminStalls, setAdminStalls] = useState<Stall[]>([]);
  const [adminExhibitions, setAdminExhibitions] = useState<Exhibition[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [myStall, setMyStall] = useState<Stall | null>(null);
  const [partnershipRequests, setPartnershipRequests] = useState<PartnershipRequest[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [bookingRequests, setBookingRequests] = useState<ExhibitionBookingRequest[]>([]);
  const [mfaVerified, setMfaVerified] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const [extraStalls, setExtraStalls] = useState<Stall[]>([]);
  const [attemptedStalls, setAttemptedStalls] = useState<Set<string>>(new Set());

  const loadStallholderData = useCallback(async (user: User) => {
    if (user.role === 'admin') {
      const [stalls, profileList, allExhibitions, requests] = await Promise.all([
        api.getAllStallsForAdmin(),
        api.getUsers(),
        api.getAllExhibitionsForAdmin(),
        api.getExhibitionBookingRequestsForAdmin(),
      ]);
      setAdminStalls(stalls);
      setUsers(profileList);
      setAdminExhibitions(allExhibitions);
      setBookingRequests(requests);
    }
    if (user.stallId) {
      const stall = await api.getStallById(user.stallId);
      setMyStall(stall);
      setExtraStalls((prev) =>
        stall && !prev.some((s) => s.id === stall.id) ? [...prev, stall] : prev,
      );
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
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setAppLoading(true);
      try {
        const [user, stalls] = await Promise.all([api.getCurrentUser(), api.getStalls()]);
        if (!active) return;
        setCurrentUser(user);
        setPublicStalls(stalls);
        try {
          setExhibitions(await api.getExhibitions());
        } catch (error) {
          console.error('Failed to load public exhibition halls:', error);
          setExhibitions([]);
        } finally {
          if (active) setPublicExhibitionsLoading(false);
        }
        if (user?.role === 'admin') {
          const state = await api.getAdminMfaState();
          if (!active) return;
          setMfaVerified(state.verified);
          if (state.verified) await loadStallholderData(user);
        } else if (user) {
          await loadStallholderData(user);
        }
      } catch (error) {
        console.error('Failed to initialize app data:', error);
      } finally {
        if (active) setAppLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadStallholderData]);

  // Resolve stalls that a deep link points at but that aren't in the loaded lists.
  useEffect(() => {
    const match = location.pathname.match(/^\/stall\/([^/]+)$/);
    if (!match) return;
    const id = match[1];
    if (
      publicStalls.some((s) => s.id === id) ||
      adminStalls.some((s) => s.id === id) ||
      extraStalls.some((s) => s.id === id) ||
      myStall?.id === id ||
      attemptedStalls.has(id)
    ) {
      return;
    }
    setAttemptedStalls((prev) => new Set(prev).add(id));
    let active = true;
    api
      .getStallById(id)
      .then((stall) => {
        if (active && stall) setExtraStalls((prev) => [...prev, stall]);
      })
      .catch((error) => console.error('Failed to load stall:', error));
    return () => {
      active = false;
    };
  }, [location.pathname, publicStalls, adminStalls, extraStalls, myStall, attemptedStalls]);

  const allStalls = useMemo(
    () => [...publicStalls, ...adminStalls, ...extraStalls],
    [publicStalls, adminStalls, extraStalls],
  );

  const applyStallUpdate = useCallback((updated: Stall | null) => {
    if (!updated) return;
    setMyStall((prev) => (prev && prev.id === updated.id ? updated : prev));
    setAdminStalls((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setPublicStalls((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setExtraStalls((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }, []);

  const handleNavigate = useCallback(
    (page: string, stallId?: string) => {
      if (page === 'admin') {
        if (currentUser?.role !== 'admin') {
          navigate('/login');
          return;
        }
        if (!mfaVerified) {
          navigate('/admin/mfa');
          return;
        }
      }
      navigate(hrefFor(page, stallId));
    },
    [currentUser, mfaVerified, navigate],
  );

  const handleStallClick = useCallback(
    (stall: Stall) => navigate(`/stall/${stall.id}`),
    [navigate],
  );

  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        navigate('/');
        return;
      }
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    },
    [navigate],
  );

  const handleLogin = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      let user: User | null;
      try {
        user = await api.login(email, password);
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
      if (!user) return false;
      setCurrentUser(user);
      if (user.role === 'admin') {
        setMfaVerified(false);
        navigate('/admin/mfa');
      } else if (user.stallId) {
        await loadStallholderData(user);
        navigate('/dashboard');
      } else {
        await loadStallholderData(user);
        navigate('/');
      }
      return true;
    },
    [loadStallholderData, navigate],
  );

  const handleSignUp = useCallback(
    async (
      name: string,
      email: string,
      password: string,
    ): Promise<{ success: boolean; confirmationRequired: boolean; message?: string }> => {
      try {
        const result = await api.signUp(name, email, password);
        if (result.user) {
          setCurrentUser(result.user);
          await loadStallholderData(result.user);
          navigate(result.user.stallId ? '/dashboard' : '/');
        }
        return { success: true, confirmationRequired: result.confirmationRequired };
      } catch (error) {
        console.error('Sign-up failed:', error);
        return {
          success: false,
          confirmationRequired: false,
          message: error instanceof Error ? error.message : 'Account creation failed.',
        };
      }
    },
    [loadStallholderData, navigate],
  );

  const handleLogout = useCallback(async () => {
    await api.logout();
    setCurrentUser(null);
    setMyStall(null);
    setPartnershipRequests([]);
    setQuoteRequests([]);
    setBookingRequests([]);
    setAdminStalls([]);
    setUsers([]);
    setMfaVerified(false);
    navigate('/');
  }, [navigate]);

  const handleMfaVerified = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setMfaVerified(true);
    await loadStallholderData(currentUser);
    navigate('/admin');
  }, [currentUser, loadStallholderData, navigate]);

  const handleUpdateStallStatus = useCallback(async (stallId: string, status: Stall['status']) => {
    const updated = await api.updateStallStatus(stallId, status);
    if (!updated) {
      alert('Failed to update stall status.');
      return;
    }
    setAdminStalls((prev) => prev.map((s) => (s.id === stallId ? updated : s)));
    if (status === 'active') {
      setPublicStalls((prev) =>
        prev.some((s) => s.id === stallId)
          ? prev.map((s) => (s.id === stallId ? updated : s))
          : [...prev, updated],
      );
    } else {
      setPublicStalls((prev) => prev.filter((s) => s.id !== stallId));
    }
    alert(`Stall status updated to ${status}.`);
  }, []);

  const handleCreateStall = useCallback(
    async (input: StallInput) => {
      const created = await api.createStall(input);
      if (!created) return;
      setAdminStalls((prev) => [...prev, created]);
      const fresh = await api.getCurrentUser();
      if (fresh) {
        setCurrentUser(fresh);
        await loadStallholderData(fresh);
      }
    },
    [loadStallholderData],
  );

  const handleUpdateStall = useCallback(
    async (stallId: string, input: Partial<StallInput>) => {
      const updated = await api.updateStall(stallId, input);
      if (updated) applyStallUpdate(updated);
    },
    [applyStallUpdate],
  );

  const handleAddProduct = useCallback(
    async (stallId: string, input: ProductInput) =>
      applyStallUpdate(await api.addProduct(stallId, input)),
    [applyStallUpdate],
  );
  const handleUpdateProduct = useCallback(
    async (stallId: string, productId: string, input: Partial<ProductInput>) =>
      applyStallUpdate(await api.updateProduct(stallId, productId, input)),
    [applyStallUpdate],
  );
  const handleDeleteProduct = useCallback(
    async (stallId: string, productId: string) =>
      applyStallUpdate(await api.deleteProduct(stallId, productId)),
    [applyStallUpdate],
  );

  const handleAddPromotion = useCallback(
    async (stallId: string, input: PromotionInput) =>
      applyStallUpdate(await api.addPromotion(stallId, input)),
    [applyStallUpdate],
  );
  const handleUpdatePromotion = useCallback(
    async (stallId: string, promotionId: string, input: Partial<PromotionInput>) =>
      applyStallUpdate(await api.updatePromotion(stallId, promotionId, input)),
    [applyStallUpdate],
  );
  const handleDeletePromotion = useCallback(
    async (stallId: string, promotionId: string) =>
      applyStallUpdate(await api.deletePromotion(stallId, promotionId)),
    [applyStallUpdate],
  );

  const handleAddGalleryItem = useCallback(
    async (stallId: string, url: string) =>
      applyStallUpdate(await api.addGalleryItem(stallId, url)),
    [applyStallUpdate],
  );
  const handleDeleteGalleryItem = useCallback(
    async (stallId: string, item: { id: string }) =>
      applyStallUpdate(await api.deleteGalleryItem(stallId, item.id)),
    [applyStallUpdate],
  );

  const handleUpdatePartnershipStatus = useCallback(
    async (id: string, status: PartnershipRequest['status']) => {
      const updated = await api.updatePartnershipRequestStatus(id, status);
      if (updated) setPartnershipRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    },
    [],
  );

  const handleCreateQuoteRequest = useCallback(
    (stallId: string, input: QuoteRequestInput) => api.createQuoteRequest(stallId, input),
    [],
  );
  const handleUpdateQuoteRequestStatus = useCallback(
    async (id: string, status: QuoteRequest['status']) => {
      const updated = await api.updateQuoteRequestStatus(id, status);
      if (updated) setQuoteRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    },
    [],
  );

  const handleCreateBookingRequest = useCallback(
    async (
      exhibitionId: string,
      input: Parameters<typeof api.createExhibitionBookingRequest>[1],
    ) => {
      if (!currentUser) throw new Error('Please sign in before requesting an exhibition stall.');
      await api.createExhibitionBookingRequest(exhibitionId, input);
    },
    [currentUser],
  );

  const handleUpdateBookingRequestStatus = useCallback(
    async (id: string, status: ExhibitionBookingRequest['status']) => {
      const updated = await api.updateExhibitionBookingRequestStatus(id, status);
      if (updated) setBookingRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    },
    [],
  );

  const refreshExhibitions = useCallback(async () => {
    const [publicList, adminList] = await Promise.all([
      api.getExhibitions(),
      currentUser?.role === 'admin' ? api.getAllExhibitionsForAdmin() : Promise.resolve(null),
    ]);
    setExhibitions(publicList);
    if (adminList) setAdminExhibitions(adminList);
  }, [currentUser]);

  const handleCreateExhibition = useCallback(
    async (input: ExhibitionInput) => {
      await api.createExhibition(input);
      await refreshExhibitions();
    },
    [refreshExhibitions],
  );
  const handleUpdateExhibition = useCallback(
    async (id: string, input: Partial<ExhibitionInput>) => {
      await api.updateExhibition(id, input);
      await refreshExhibitions();
    },
    [refreshExhibitions],
  );
  const handleDeleteExhibition = useCallback(
    async (id: string) => {
      await api.deleteExhibition(id);
      await refreshExhibitions();
    },
    [refreshExhibitions],
  );
  const handleAssignStallToExhibition = useCallback(
    async (exhibitionId: string, stallId: string, boothLabel: string, sortOrder: number) => {
      await api.assignStallToExhibition(exhibitionId, stallId, boothLabel, sortOrder);
      await refreshExhibitions();
    },
    [refreshExhibitions],
  );
  const handleRemoveStallFromExhibition = useCallback(
    async (exhibitionId: string, stallId: string) => {
      await api.removeStallFromExhibition(exhibitionId, stallId);
      await refreshExhibitions();
    },
    [refreshExhibitions],
  );

  const handleProposePartnership = useCallback(
    async (target: Stall, message: string) => {
      if (!myStall) {
        alert('You must have a stall to propose a partnership.');
        return;
      }
      const created = await api.proposePartnership(myStall, target, message);
      setPartnershipRequests((prev) => [...prev, created]);
    },
    [myStall],
  );

  if (appLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-light text-brand-dark">
        <p className="text-xl font-semibold">Loading Exhistall…</p>
      </div>
    );
  }

  const commonProps = {
    onNavigate: handleNavigate,
    currentUser,
    onLogout: handleLogout,
    onSearch: handleSearch,
  };

  return (
    <div className="min-h-screen font-sans">
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage stalls={publicStalls} onStallClick={handleStallClick} {...commonProps} />
            }
          />
          <Route
            path="/marketplace"
            element={
              <MarketplacePage
                stalls={publicStalls}
                onStallClick={handleStallClick}
                {...commonProps}
              />
            }
          />
          <Route path="/categories" element={<CategoriesPage {...commonProps} />} />
          <Route
            path="/exhibitions"
            element={
              <ExhibitionsPage
                exhibitions={exhibitions}
                isLoading={publicExhibitionsLoading}
                onStallClick={handleStallClick}
                onCreateBookingRequest={handleCreateBookingRequest}
                {...commonProps}
              />
            }
          />
          <Route
            path="/networking"
            element={
              <NetworkingPage
                stalls={publicStalls}
                onStallClick={handleStallClick}
                {...commonProps}
              />
            }
          />
          <Route path="/pricing" element={<PricingPage {...commonProps} />} />
          <Route path="/help" element={<HelpCenterPage {...commonProps} />} />
          <Route path="/about" element={<AboutPage {...commonProps} />} />
          <Route path="/blog" element={<BlogPage {...commonProps} />} />
          <Route path="/jobs" element={<JobsPage {...commonProps} />} />
          <Route path="/claim" element={<LegalPage pageType="claim" {...commonProps} />} />
          <Route path="/privacy" element={<LegalPage pageType="privacy" {...commonProps} />} />
          <Route path="/terms" element={<LegalPage pageType="terms" {...commonProps} />} />
          <Route
            path="/open-a-stall"
            element={<CreateStallPage onCreateStall={handleCreateStall} {...commonProps} />}
          />
          <Route
            path="/search"
            element={
              <SearchRoute
                allStalls={publicStalls}
                onStallClick={handleStallClick}
                onNavigate={handleNavigate}
                onSearch={handleSearch}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/stall/:stallId"
            element={
              <StallRoute
                stalls={allStalls}
                onProposePartnership={handleProposePartnership}
                onCreateQuoteRequest={handleCreateQuoteRequest}
                onNavigate={handleNavigate}
                onSearch={handleSearch}
                onLogout={handleLogout}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={handleLogin}
                onSignUp={handleSignUp}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              !currentUser || !myStall ? (
                <Navigate to="/" replace />
              ) : (
                <StallholderDashboardPage
                  stall={myStall}
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
              )
            }
          />
          <Route
            path="/admin/mfa"
            element={
              currentUser?.role !== 'admin' ? (
                <Navigate to="/login" replace />
              ) : mfaVerified ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminMfaPage
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onVerified={handleMfaVerified}
                  onNavigate={handleNavigate}
                />
              )
            }
          />
          <Route
            path="/admin"
            element={
              currentUser?.role !== 'admin' ? (
                <Navigate to="/login" replace />
              ) : !mfaVerified ? (
                <Navigate to="/admin/mfa" replace />
              ) : (
                <AdminDashboardPage
                  stalls={adminStalls}
                  users={users}
                  exhibitions={adminExhibitions}
                  bookingRequests={bookingRequests}
                  onCreateExhibition={handleCreateExhibition}
                  onUpdateExhibition={handleUpdateExhibition}
                  onDeleteExhibition={handleDeleteExhibition}
                  onAssignStallToExhibition={handleAssignStallToExhibition}
                  onRemoveStallFromExhibition={handleRemoveStallFromExhibition}
                  onUpdateBookingRequestStatus={handleUpdateBookingRequestStatus}
                  onUpdateStallStatus={handleUpdateStallStatus}
                  onNavigate={handleNavigate}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onSearch={handleSearch}
                />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
