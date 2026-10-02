import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Key, RefreshCw, MessageSquare, ArrowRight } from 'lucide-react';
import { DEFAULT_CONTRACT_ADDRESS } from '../utils/constants';

export default function HelpPage({ onNavigateTab }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How does FundFlow ensure 100% transparency?",
      a: "Every single donation is processed via an immutable Ethereum smart contract. There are zero centralized bank accounts or hidden ledgers. Funds stay locked in the smart contract escrow until released with documented milestone proofs that any donor can audit."
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
      a: `Yes. The contract is deployed at address ${DEFAULT_CONTRACT_ADDRESS} and is publicly verifiable on Sepolia Etherscan with all event signatures, transaction ledgers, and source code completely open-source.`
    },
    {
      q: "Do I need two separate wallets to test or present the project?",
      a: "No! FundFlow includes an interactive Role Mode Switcher at the top of the header bar ('Donor Mode' vs 'Organizer Mode'). You can effortlessly demonstrate both the contributor perspective (contribute only) and the organizer perspective (milestone withdrawals) using a single connected wallet during your academic mini project evaluation."
    },
    {
      q: "Why are valuations displayed in Indian Rupees (INR ₹)?",
      a: "All causes on FundFlow target real Indian grassroots initiatives (Zilla Parishad education in Pune, flood rescue in Kerala, drought relief in Marathwada). While contributions settle on Ethereum in ETH, real-time INR valuations (₹2,85,000 / ETH) provide immediate financial clarity to Indian donors and organizers."
    }
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Help Center & Frequently Asked Questions</h2>
        <p className="text-xs text-slate-400">Everything you need to know about decentralized charity, role simulation, and on-chain auditing</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs transition-all cursor-pointer"
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-50 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span>{faq.q}</span>
                </h3>
                <button
                  type="button"
                  className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"
                >
                  {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {isOpen && (
                <p className="text-xs text-slate-600 leading-relaxed pl-7 pt-3 border-t border-slate-50 mt-3">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Assistance Actions */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 mb-0.5">Need immediate testnet ETH?</h4>
          <p className="text-[11px] text-slate-500">Visit the Wallet tab for instant faucet links to fund your MetaMask test wallet.</p>
        </div>
        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('wallet')}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            <span>Go to Wallet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
