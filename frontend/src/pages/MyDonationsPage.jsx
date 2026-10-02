import React from 'react';
import { ExternalLink, HeartHandshake, CheckCircle2, ShieldCheck, ArrowRight, Wallet } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { ETH_TO_INR_RATE } from '../utils/constants';

export default function MyDonationsPage({ myDonations = [], onExploreClick }) {
  const { account, connectWallet } = useWeb3();

  const totalEth = myDonations.reduce((acc, curr) => {
    const rawAmt = typeof curr.amount === 'string' ? curr.amount.replace(' ETH', '') : curr.amount;
    const val = parseFloat(rawAmt) || 0;
    return acc + val;
  }, 0);

  const totalInr = (totalEth * ETH_TO_INR_RATE).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });

  const uniqueCauses = new Set(myDonations.map((d) => d.campaignId || d.campaign)).size;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">My Philanthropy & Donation History</h2>
        <p className="text-xs text-slate-400">Cryptographically verifiable on-chain records associated with your wallet</p>
      </div>

      {/* Dynamic KPI Cards calculated from real on-chain data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-600 text-white p-5 rounded-xl">
          <div className="text-blue-100 text-xs font-medium mb-1">Total Lifetime Contributed</div>
          <div className="text-2xl font-bold mb-1 font-mono">{totalEth.toFixed(4)} ETH</div>
          <div className="text-xs text-blue-100 font-medium">≈ ₹{totalInr} INR</div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-xs">
          <div className="text-slate-400 text-xs font-medium mb-1">Causes Supported</div>
          <div className="text-2xl font-bold text-slate-800 mb-1">{uniqueCauses} Initiatives</div>
          <div className="text-xs text-emerald-600 font-medium">100% Escrow Verified</div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-xs">
          <div className="text-slate-400 text-xs font-medium mb-1">Audited Status</div>
          <div className="text-2xl font-bold text-brand-600 mb-1">100% On-Chain</div>
          <div className="text-xs text-slate-400 font-mono">Ethereum Sepolia (11155111)</div>
        </div>
      </div>

      {/* Donations Table or Empty State */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">On-Chain Contribution Ledger</h3>
          <span className="text-xs text-slate-400 font-mono">
            {account ? `Wallet: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Not Connected'}
          </span>
        </div>

        {!account ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-brand-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Wallet className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Connect Your Wallet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Connect your MetaMask wallet to view your real on-chain contributions and immutable audit trail.
            </p>
            <button
              onClick={connectWallet}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <span>Connect MetaMask</span>
            </button>
          </div>
        ) : myDonations.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mx-auto mb-2">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Contributions Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't contributed to any causes from this wallet yet. Browse verified initiatives to make your first on-chain contribution!
            </p>
            {onExploreClick && (
              <button
                onClick={onExploreClick}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <span>Browse Active Causes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-medium">Campaign Name</th>
                  <th className="pb-3 font-medium">Date & Timestamp</th>
                  <th className="pb-3 font-medium">Contribution (ETH)</th>
                  <th className="pb-3 font-medium">Value (INR)</th>
                  <th className="pb-3 font-medium">Explorer Link</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {myDonations.map((item, idx) => (
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
                      {item.inrAmount}
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-slate-400">
                      <a
                        href={item.txHash && item.txHash.length > 20 ? `https://sepolia.etherscan.io/tx/${item.txHash}` : `https://sepolia.etherscan.io/address/${account}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-brand-600 flex items-center gap-1"
                      >
                        <span className="truncate max-w-[120px]">{item.txHash || 'View on Sepolia'}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="py-3.5 text-right font-semibold text-brand-600">
                      {item.status || 'Completed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
