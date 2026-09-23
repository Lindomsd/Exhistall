import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StallForm from '../components/StallForm';
import ProductForm from '../components/ProductForm';
import PartnershipRequestCard from '../components/PartnershipRequestCard';
import GalleryManager from '../components/GalleryManager';
import { Icon } from '../components/Icon';
import type { Stall, StallInput, PartnershipRequest, User, Product, ProductInput, GalleryItem } from '../types';

interface StallholderDashboardPageProps {
  stall: Stall;
  partnershipRequests: PartnershipRequest[];
  onNavigate: (page: string) => void;
  currentUser: User;
  onLogout: () => void;
  onSearch: (query: string) => void;
  onUpdateStall: (stallId: string, updates: Partial<Stall>) => Promise<void>;
  onAddProduct: (stallId: string, productData: Omit<Product, 'id'>) => Promise<void>;
  onUpdateProduct: (stallId: string, productId: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (stallId: string, productId: string) => Promise<void>;
  onAddGalleryItem: (stallId: string, url: string) => Promise<void>;
  onDeleteGalleryItem: (stallId: string, item: GalleryItem) => Promise<void>;
  onUpdatePartnershipStatus: (requestId: string, status: 'accepted' | 'declined') => Promise<void>;
}

const StatCard: React.FC<{ title: string; value: string; icon: string; }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
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

type ProductModalState = {
    isOpen: boolean;
    mode: 'add' | 'edit';
    product: Product | null;
}

const StallholderDashboardPage: React.FC<StallholderDashboardPageProps> = (props) => {
  const { 
    stall, 
    partnershipRequests,
    onNavigate, 
    currentUser, 
    onLogout, 
    onSearch,
    onUpdateStall,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onAddGalleryItem,
    onDeleteGalleryItem,
    onUpdatePartnershipStatus
  } = props;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [productModal, setProductModal] = useState<ProductModalState>({ isOpen: false, mode: 'add', product: null });
  
  const handleStallUpdate = async (formData: StallInput) => {
      setIsSaving(true);
      setActionError('');
      try {
        await onUpdateStall(stall.id, formData);
        setActiveTab('overview');
      } catch (error) {
        setActionError(error instanceof Error ? error.message : 'We could not update your stall. Please try again.');
      } finally {
        setIsSaving(false);
      }
  }

  const handleProductSubmit = async (productData: ProductInput) => {
      setIsSaving(true);
      setActionError('');
      try {
        if(productModal.mode === 'add') {
          await onAddProduct(stall.id, productData);
        } else if (productModal.product) {
          await onUpdateProduct(stall.id, productModal.product.id, productData);
        }
        setProductModal({ isOpen: false, mode: 'add', product: null });
      } catch (error) {
        setActionError(error instanceof Error ? error.message : 'We could not save this product. Please try again.');
      } finally {
        setIsSaving(false);
      }
  }

  const handleDeleteProductClick = async (productId: string) => {
      if(window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
          setActionError('');
          try {
            await onDeleteProduct(stall.id, productId);
          } catch (error) {
            setActionError(error instanceof Error ? error.message : 'We could not delete this product. Please try again.');
          }
      }
  }

  const handleAddGalleryItem = async (url: string) => {
      setIsSaving(true);
      setActionError('');
      try {
        await onAddGalleryItem(stall.id, url);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'We could not add this gallery image. Please try again.';
        setActionError(message);
        throw new Error(message);
      } finally {
        setIsSaving(false);
      }
  }

  const handleDeleteGalleryItem = async (item: GalleryItem) => {
      if (!window.confirm('Remove this image from your gallery?')) return;
      setIsSaving(true);
      setActionError('');
      try {
        await onDeleteGalleryItem(stall.id, item);
      } catch (error) {
        setActionError(error instanceof Error ? error.message : 'We could not remove this gallery image. Please try again.');
      } finally {
        setIsSaving(false);
      }
  }

  const incomingRequests = partnershipRequests.filter(r => r.recipientStallId === stall.id);
  const outgoingRequests = partnershipRequests.filter(r => r.proposerStallId === stall.id);

  const getStatusChip = () => {
    switch (stall.status) {
      case 'active': return <span className="text-sm font-semibold text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900 px-3 py-1 rounded-full">Active</span>;
      case 'pending_review': return <span className="text-sm font-semibold text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900 px-3 py-1 rounded-full">Pending Review</span>;
      case 'suspended': return <span className="text-sm font-semibold text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900 px-3 py-1 rounded-full">Suspended</span>;
      case 'banned': return <span className="text-sm font-semibold text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900 px-3 py-1 rounded-full">Banned</span>;
    }
  }

  const renderTabContent = () => {
      switch (activeTab) {
          case 'edit-stall':
              return (
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-bold mb-6">Edit Your Stall Information</h2>
                      <StallForm 
                        stall={stall}
                        onSubmit={handleStallUpdate}
                        onCancel={() => setActiveTab('overview')}
                        isSaving={isSaving}
                      />
                  </div>
              );
          case 'manage-products':
              return (
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Manage Products</h2>
                            <button onClick={() => setProductModal({isOpen: true, mode: 'add', product: null})} className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-colors">
                                <Icon name="plus-circle" className="h-5 w-5" /> Add New Product
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                               <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                  <tr>
                                    <th className="px-6 py-3">Product Name</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Actions</th>
                                  </tr>
                               </thead>
                               <tbody>
                                  {stall.products.map(p => (
                                      <tr key={p.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                          <th className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{p.name}</th>
                                          <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                                          <td className="px-6 py-4 flex gap-4">
                                              <button onClick={() => setProductModal({ isOpen: true, mode: 'edit', product: p })} className="font-medium text-brand-blue dark:text-brand-gold hover:underline">Edit</button>
                                              <button onClick={() => handleDeleteProductClick(p.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                          </td>
                                      </tr>
                                  ))}
                               </tbody>
                          </table>
                          {stall.products.length === 0 && <p className="text-center py-8 text-brand-secondary dark:text-slate-400">You haven't added any products yet.</p>}
                        </div>
                   </div>
              );
          case 'manage-gallery':
              return <GalleryManager gallery={stall.gallery} onAdd={handleAddGalleryItem} onDelete={handleDeleteGalleryItem} isSaving={isSaving} />;
          case 'partnerships':
              return (
                  <div>
                      <h2 className="text-2xl font-bold mb-6">Partnership Requests</h2>
                      <div className="grid md:grid-cols-2 gap-8">
                          <div>
                              <h3 className="text-lg font-semibold mb-4">Incoming ({incomingRequests.length})</h3>
                              <div className="space-y-4">
                                {incomingRequests.map(req => <PartnershipRequestCard key={req.id} request={req} perspective="incoming" onUpdateStatus={onUpdatePartnershipStatus} />)}
                                {incomingRequests.length === 0 && <p className="text-sm text-brand-secondary dark:text-slate-400">No incoming partnership requests.</p>}
                              </div>
                          </div>
                          <div>
                              <h3 className="text-lg font-semibold mb-4">Outgoing ({outgoingRequests.length})</h3>
                               <div className="space-y-4">
                                {outgoingRequests.map(req => <PartnershipRequestCard key={req.id} request={req} perspective="outgoing" />)}
                                {outgoingRequests.length === 0 && <p className="text-sm text-brand-secondary dark:text-slate-400">You haven't sent any partnership requests.</p>}
                              </div>
                          </div>
                      </div>
                  </div>
              );
          case 'overview':
          default:
              return (
                  <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <StatCard title="Total Products" value={stall.products.length.toString()} icon="package" />
                          <StatCard title="Total Reviews" value={stall.reviews.length.toString()} icon="star" />
                          <StatCard title="Partnerships" value={partnershipRequests.length.toString()} icon="briefcase" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
                           <h2 className="text-2xl font-bold mb-4">Stall Status</h2>
                           <div className="flex items-center gap-4">
                             <p className="text-brand-secondary dark:text-slate-300">Your stall is currently:</p>
                             {getStatusChip()}
                           </div>
                           {stall.status === 'pending_review' && <p className="mt-2 text-sm text-brand-secondary dark:text-slate-400">Your stall is not public yet. You can continue editing it, adding products and preparing its gallery while an administrator reviews it.</p>}
                           {stall.status === 'active' && <p className="mt-2 text-sm text-brand-secondary dark:text-slate-400">Your stall is live and visible to everyone on the marketplace!</p>}
                      </div>
                  </div>
              );
      }
  }

  const tabs = [
    {id: 'overview', label: 'Overview', icon: 'dashboard'},
    {id: 'edit-stall', label: 'Edit Stall', icon: 'edit'},
    {id: 'manage-products', label: 'Manage Products', icon: 'package'},
    {id: 'manage-gallery', label: 'Manage Gallery', icon: 'upload'},
    {id: 'partnerships', label: 'Partnerships', icon: 'briefcase'},
  ];

  return (
    <>
      <Header onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} onSearch={onSearch} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-extrabold mb-2">My Dashboard</h1>
          <p className="text-brand-secondary dark:text-slate-400 mb-8">Manage your stall, products, and partnerships here.</p>

          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg sticky top-24">
                    <nav className="flex flex-col gap-2">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 p-3 rounded-md text-sm font-semibold transition-colors w-full text-left ${
                                    activeTab === tab.id ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-gold/20 dark:text-brand-gold' : 'hover:bg-gray-100 dark:hover:bg-slate-700/50'
                                }`}
                            >
                                <Icon name={tab.icon} className="h-5 w-5" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>
            <div className="lg:col-span-3">
              {actionError && <p role="alert" className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{actionError}</p>}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />

      {productModal.isOpen && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                 <div className="p-6">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{productModal.mode === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
                        <button onClick={() => setProductModal({isOpen: false, mode: 'add', product: null})} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><Icon name="x" className="h-5 w-5"/></button>
                     </div>
                     {actionError && <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{actionError}</p>}
                     <ProductForm 
                        product={productModal.product}
                        onSubmit={handleProductSubmit}
                        onCancel={() => setProductModal({isOpen: false, mode: 'add', product: null})}
                        isSaving={isSaving}
                     />
                 </div>
            </div>
         </div>
      )}
    </>
  );
};

export default StallholderDashboardPage;
