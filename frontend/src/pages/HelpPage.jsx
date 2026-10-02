import React from 'react';
import { HelpCircle, ChevronRight, ExternalLink, ShieldCheck, Key, RefreshCw } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      q: "How does FundFlow ensure 100% transparency?",
      a: "Every single donation is processed via an immutable Ethereum smart contract. There are zero centralized bank accounts or hidden ledgers. Funds stay locked in the smart contract escrow until released with documented milestone proofs."
    },
    {
      q: "How do organizers withdraw collected funds?",
      a: "Campaign organizers cannot withdraw funds arbitrarily. To execute a withdrawal, the organizer must input the exact amount, provide a detailed reasoning description, and attach an IPFS hash of verified purchase invoices or hospital receipts."
    },
    {
      q: "Where do I get free Sepolia ETH to test donations?",
      a: "You can obtain free testnet ETH from Google Cloud's Web3 Faucet, Alchemy Sepolia Faucet, or the PoW mining faucet. Navigate to the 'Wallet' tab in the sidebar for one-click access."
    },
    {
      q: "Can anyone audit the smart contract code?",
      a: "Yes. The contract is deployed at address 0xa96C6Da4CDDdE292918efCdA174F933BaBE918fa and is publicly verifiable on Sepolia Etherscan with all event signatures and source code open-source."
    }
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Help Center & Frequently Asked Questions</h2>
        <p className="text-xs text-slate-400">Everything you need to know about decentralized charity and on-chain auditing</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-50 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed pl-7">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
