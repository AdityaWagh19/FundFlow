import React from 'react';
import SafeImage from './SafeImage';
import UserAvatar from './UserAvatar';

export default function LiveFeed({ donations = [], campaigns = [] }) {
  // If real donations exist, display the 4 newest ones
  const recentTransactions = donations.slice(0, 4);

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          Recent Blockchain Transactions
        </h3>
        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
          Sepolia EVM
        </span>
      </div>

      {recentTransactions.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-xs">
          No transactions recorded yet.
        </div>
      ) : (
        <div className="space-y-3.5">
          {recentTransactions.map((tx, idx) => {
            // Match with campaign image if available
            const matchingCampaign = campaigns.find(
              (c) => c.id === tx.campaignId || c.title === tx.campaign
            );
            const image = matchingCampaign?.image || tx.image;

            return (
              <div key={tx.txHash || idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    {image ? (
                      <SafeImage
                        src={image}
                        alt={tx.campaign || 'Cause'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserAvatar account={tx.address || tx.donor} size="md" className="w-full h-full" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[150px]">
                      {tx.campaign || 'Humanitarian Cause'}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono">{tx.name || 'Donor'}</span>
                      <span>•</span>
                      <span>{tx.start || 'Recent'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-brand-600 font-mono">
                    {tx.inrAmount || tx.amount}
                  </div>
                  {tx.inrAmount && tx.amount && (
                    <div className="text-[10px] text-slate-400 font-mono">
                      {tx.amount}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
