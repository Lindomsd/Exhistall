import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { User } from '../types';

interface LegalPageProps {
  pageType: 'terms' | 'privacy' | 'claim';
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const privacyContact = import.meta.env.VITE_PRIVACY_CONTACT_EMAIL?.trim();
const PrivacyContact: React.FC = () => privacyContact ? (
  <a className="font-semibold text-brand-blue underline dark:text-brand-gold" href={`mailto:${privacyContact}`}>{privacyContact}</a>
) : (
  <span className="font-semibold text-amber-700 dark:text-amber-300">The market operator must publish its privacy contact before public launch.</span>
);

const legalContent = {
  terms: {
    title: 'Terms of Use',
    content: (
      <>
        <p><strong>Effective 23 September 2026.</strong> Exhistall is a virtual exhibition and market where organisations can present products, services and business information. By using it, you agree to these terms and the Privacy Notice.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">Accounts and stalls</h3>
        <p>Keep your account credentials private and provide accurate information. A stallholder may create one stall linked to their account. New stalls are submitted for review; they remain private until an administrator approves them. Approval is not a guarantee of sales, enquiries or continued listing.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">Your content</h3>
        <p>You remain responsible for the business details, product and service information, images, prices, links and other material you add. You confirm that you have the rights and permissions needed to publish it and that it is accurate, lawful and not misleading. Do not upload sensitive personal information or content that infringes another person’s rights.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">Marketplace rules</h3>
        <p>Do not use Exhistall for unlawful activity, spam, fraud, harmful content, unauthorised advertising, or attempts to interfere with the platform or other users. We may review, suspend, remove or restrict a stall or content where this is reasonably necessary to protect the market, users or legal obligations.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">Independent businesses</h3>
        <p>Stallholders are independent organisations. Exhistall does not sell their goods or services, enter into their customer contracts, or guarantee the quality, availability, safety or legality of any listing. Deal directly with the stallholder before making a decision.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">Availability and changes</h3>
        <p>We may update, maintain or change the platform and these terms. Where a material change is made, the effective date will be updated. Nothing in these terms excludes rights that cannot lawfully be excluded.</p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy Notice',
    content: (
      <>
        <p><strong>Effective 23 September 2026.</strong> This notice explains how Exhistall processes personal information while operating the virtual market. It is designed around South Africa’s Protection of Personal Information Act (POPIA), but should be reviewed and completed by the market operator before public launch.</p>

        <h3 className="text-xl font-bold mt-6 mb-2">Who is responsible</h3>
        <p>The operator of Exhistall is the responsible party for personal information processed through this platform. Privacy and POPIA requests can be sent to: <PrivacyContact /> The operator must also publish its registered business details and Information Officer details where required.</p>

        <h3 className="text-xl font-bold mt-6 mb-2">Information processed</h3>
        <p>We process account details (name and email address), sign-in and session data, stallholder and business information, public contact details that a stallholder chooses to list, product and service listings, uploaded images, partnership requests, reviews, and technical records needed to secure and operate the service.</p>

        <h3 className="text-xl font-bold mt-6 mb-2">Why we use it</h3>
        <p>We use this information to create and secure accounts; host, moderate and publish stalls; enable stallholder management and business-to-business partnership requests; respond to requests; prevent misuse; and meet legal obligations. We process information only where a lawful justification applies, including providing the service you request, legitimate operational and security interests, consent where required, or compliance with law.</p>

        <h3 className="text-xl font-bold mt-6 mb-2">What is public</h3>
        <p>Once a stall is approved, its business name, logo, description, category, products, gallery items and any contact details the stallholder entered may be visible to anyone visiting the marketplace. Do not place private or sensitive personal information in a public listing. Pending stalls are visible only to their owner and authorised administrators.</p>

        <h3 className="text-xl font-bold mt-6 mb-2">Service providers and international transfers</h3>
        <p>Exhistall uses hosting, authentication, database and media-storage providers to operate the platform. These providers may process information in countries outside South Africa. The operator must maintain appropriate operator agreements and safeguards for any cross-border processing, as POPIA requires.</p>

        <h3 className="text-xl font-bold mt-6 mb-2">Retention and security</h3>
        <p>We retain account and stall information only for as long as it is needed for the purposes above, legitimate record-keeping, dispute resolution or legal obligations, then delete or de-identify it where appropriate. Access is controlled through authenticated accounts and database rules; no security measure is absolute. If a security compromise creates a reasonable risk that personal information was accessed or acquired without authorisation, the operator will follow its POPIA notification obligations.</p>

        <h3 className="text-xl font-bold mt-6 mb-2">Your rights</h3>
        <p>You may ask to access, correct, update or delete your personal information, object to certain processing, or lodge a complaint. Start with <PrivacyContact />. You may also complain to the Information Regulator of South Africa. We may need to verify your identity before acting on a request.</p>

        <h3 className="text-xl font-bold mt-6 mb-2">Browser storage and cookies</h3>
        <p>Exhistall currently uses essential browser storage to keep an authenticated session active and protect account access. It does not currently load analytics, advertising or marketing tags. If non-essential cookies or similar technologies are introduced, they must be described here and remain off until an appropriate consent choice is available. You can clear browser storage in your browser settings; doing so will sign you out.</p>

        <h3 className="text-xl font-bold mt-6 mb-2">Marketing</h3>
        <p>Exhistall does not currently send marketing messages from this platform. If this changes, direct marketing preferences and an easy opt-out will be provided as required by law.</p>
      </>
    ),
  },
  claim: {
    title: 'Claim Your Business',
    content: (
      <>
        <p className="text-center mb-8">Business claims are not enabled yet. To protect stallholders, ownership changes must be verified by the market operator rather than collected through an unsecured form.</p>
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-6 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
          <h3 className="text-xl font-bold">Need to claim a listing?</h3>
          <p className="mt-2">Contact the market operator from its verified support channel. Do not send passwords, identity documents or sensitive information through public forms.</p>
        </div>
      </>
    ),
  },
};

const LegalPage: React.FC<LegalPageProps> = ({ pageType, onNavigate, onSearch, currentUser, onLogout }) => {
  const { title, content } = legalContent[pageType];

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={onNavigate} onSearch={onSearch} currentUser={currentUser} onLogout={onLogout} />
      <main className="flex-grow bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center mb-10">{title}</h1>
            <div className={`prose dark:prose-invert max-w-none text-brand-secondary dark:text-slate-300 leading-relaxed ${pageType !== 'claim' ? 'bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md' : ''}`}>
              {content}
            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LegalPage;
