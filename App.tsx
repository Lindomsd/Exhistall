import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import StallPage from './pages/StallPage';
import { mockStalls, mockPartnershipRequests } from './data/mockData';
import type { Stall, PartnershipRequest } from './types';

const App: React.FC = () => {
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [partnershipRequests, setPartnershipRequests] = useState<PartnershipRequest[]>(mockPartnershipRequests);
  
  // Assume the first stall is our logged-in user's stall for demo purposes
  const currentUserStall = mockStalls[0];

  const handleSelectStall = (stall: Stall) => {
    setSelectedStall(stall);
    window.scrollTo(0, 0);
  };

  const handleGoBack = () => {
    setSelectedStall(null);
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


  useEffect(() => {
    document.body.className = 'bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light';
  }, []);

  return (
    <div className="min-h-screen font-sans">
      {selectedStall ? (
        <StallPage 
          stall={selectedStall} 
          onBack={handleGoBack} 
          currentUserStall={currentUserStall}
          partnershipRequests={partnershipRequests}
          onProposePartnership={handleProposePartnership}
        />
      ) : (
        <HomePage stalls={mockStalls} onStallClick={handleSelectStall} />
      )}
    </div>
  );
};

export default App;
