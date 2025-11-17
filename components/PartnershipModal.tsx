
import React, { useState } from 'react';
import type { Stall } from '../types';
import { Icon } from './Icon';

interface PartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposerStall: Stall;
  recipientStall: Stall;
  onSubmit: (message: string) => void;
}

const PartnershipModal: React.FC<PartnershipModalProps> = ({ isOpen, onClose, proposerStall, recipientStall, onSubmit }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSubmit(message);
      setIsSubmitting(false);
      setMessage('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md transform transition-all"
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 id="modal-title" className="text-lg font-bold text-brand-blue dark:text-brand-gold">
                Propose Partnership
              </h3>
              <p className="text-sm text-brand-secondary dark:text-slate-400 mt-1">
                To: <span className="font-semibold">{recipientStall.name}</span>
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full text-brand-secondary dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <Icon name="x" className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <label htmlFor="partnership-message" className="block text-sm font-medium text-brand-dark dark:text-slate-300 mb-2">
              Your Message
            </label>
            <textarea
              id="partnership-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi ${recipientStall.name.split(' ')[0]}, I'm from ${proposerStall.name} and I'd love to discuss a potential partnership...`}
              rows={5}
              className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-brand-light dark:bg-brand-dark focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold focus:border-transparent outline-none transition"
              required
            />
            <div className="mt-6 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-medium text-brand-secondary dark:text-slate-300 bg-gray-200 dark:bg-slate-700 rounded-md hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || !message.trim()} 
                className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-opacity-90 disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <Icon name="message" className="h-5 w-5" />
                {isSubmitting ? 'Sending...' : 'Send Proposal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnershipModal;
