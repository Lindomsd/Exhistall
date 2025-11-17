import React from 'react';
import type { PartnershipRequest } from '../types';
import { Icon } from './Icon';

interface PartnershipRequestCardProps {
    request: PartnershipRequest;
    perspective: 'incoming' | 'outgoing';
    onUpdateStatus?: (requestId: string, status: 'accepted' | 'declined') => void;
}

const PartnershipRequestCard: React.FC<PartnershipRequestCardProps> = ({ request, perspective, onUpdateStatus }) => {
    
    const partnerStall = perspective === 'incoming' ? request.proposerStall : request.recipientStall;

    const getStatusInfo = () => {
        switch(request.status) {
            case 'pending': return { text: 'Pending', color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900' };
            case 'accepted': return { text: 'Accepted', color: 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900' };
            case 'declined': return { text: 'Declined', color: 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900' };
        }
    }
    const statusInfo = getStatusInfo();

    return (
        <div className="bg-brand-light dark:bg-brand-dark p-4 rounded-lg border dark:border-slate-700">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-brand-secondary dark:text-slate-400">
                      {perspective === 'incoming' ? 'From: ' : 'To: '}
                      <span className="font-bold">{partnerStall?.name}</span>
                    </p>
                    <p className="text-xs text-brand-secondary dark:text-slate-500">{new Date(request.date).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>{statusInfo.text}</span>
            </div>
            <p className="text-sm my-3 p-3 bg-white dark:bg-slate-800 rounded-md border dark:border-slate-600">{request.message}</p>
            {perspective === 'incoming' && request.status === 'pending' && onUpdateStatus && (
                <div className="flex justify-end gap-2">
                    <button onClick={() => onUpdateStatus(request.id, 'declined')} className="text-sm font-semibold text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 px-3 py-1 rounded-md">Decline</button>
                    <button onClick={() => onUpdateStatus(request.id, 'accepted')} className="text-sm font-semibold text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 px-3 py-1 rounded-md">Accept</button>
                </div>
            )}
        </div>
    );
};

export default PartnershipRequestCard;
