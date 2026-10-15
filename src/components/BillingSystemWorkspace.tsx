import React from 'react';
import billingSystemHtml from '../data/billing-system.html?raw';

export const BillingSystemWorkspace: React.FC = () => (
  <iframe
    title="Anowara Medical Complex Billing System"
    srcDoc={billingSystemHtml}
    className="block w-full border-0 bg-slate-100"
    style={{ height: '100vh', minHeight: '100vh' }}
  />
);
