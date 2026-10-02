import React from 'react';
import { ExternalLink, HeartHandshake, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

export default function MyDonationsPage({ donations }) {
  const { account, balance } = useWeb3();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">My Philanthropy & Donation History</h2>
        <p className="text-xs text-slate-400">Cryptographically verifiable on-chain records associated with your wallet</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-600 text-white p-5 rounded-xl">
          <div className="text-blue-100 text-xs font-medium mb-1">Total Lifetime Contributed</div>
          <div className="text-2xl font-bold mb-1">2.30 ETH</div>
          <div className="text-xs text-blue-100 font-medium">≈ ₹6,55,500 INR</div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-xs">
          <div className="text-slate-400 text-xs font-medium mb-1">Causes Supported</div>
          <div className="text-2xl font-bold text-slate-800 mb-1">5 Initiatives</div>
          <div className="text-xs text-emerald-600 font-medium">100% Escrow Verified</div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-xs">
          <div className="text-slate-400 text-xs font-medium mb-1">Impact Transparency Score</div>
          <div className="text-2xl font-bold text-brand-600 mb-1">100% Audited</div>
          <div className="text-xs text-slate-400 font-mono">Ethereum Sepolia</div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">On-Chain Contribution Ledger</h3>
          <span className="text-xs text-slate-400 font-mono">
            {account ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Demo View'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="pb-3 font-medium">Campaign Name</th>
                <th className="pb-3 font-medium">Date & Timestamp</th>
                <th className="pb-3 font-medium">Contribution (ETH)</th>
                <th className="pb-3 font-medium">Value (INR)</th>
                <th className="pb-3 font-medium">Tx Hash</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {donations.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 pr-4 font-semibold text-slate-800">
                    {item.campaign}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-500">
                    {item.start}
                  </td>
                  <td className="py-3.5 pr-4 font-bold text-brand-600 font-mono">
                    {item.amount}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600 font-medium">
                    {item.inrAmount || '₹1,28,250'}
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-slate-400">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${item.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-brand-600 flex items-center gap-1"
                    >
                      <span>{item.txHash}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3.5 text-right font-semibold text-brand-600">
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
