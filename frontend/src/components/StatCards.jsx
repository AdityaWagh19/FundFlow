import React from 'react';
import { ETH_TO_INR_RATE } from '../utils/constants';

export default function StatCards({
  campaigns = [],
  donations = [],
  totalDonations,
  totalEth,
  totalDonors,
}) {
  // Dynamically calculate from real on-chain campaigns & donations ledger
  const dynamicEth =
    campaigns.length > 0
      ? campaigns.reduce((acc, c) => acc + parseFloat(c.amountCollected || 0), 0)
      : parseFloat(totalEth) || 0;

  const dynamicDonationsCount =
    donations.length > 0 ? donations.length : (totalDonations !== undefined ? totalDonations : 0);

  const dynamicDonorsCount =
    donations.length > 0
      ? Math.max(1, new Set(donations.map((d) => (d.address || d.donor || '').toLowerCase()).filter(Boolean)).size)
      : (totalDonors !== undefined ? totalDonors : 0);

  const inrEstimate = Math.round(dynamicEth * ETH_TO_INR_RATE).toLocaleString('en-IN');

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Platform Overview</h3>
        <span className="text-[10px] text-slate-400 font-medium font-mono">Aggregated from Smart Contract Escrows</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Primary Blue Card - Total Donations Count */}
        <div className="rounded-xl bg-brand-600 text-white p-5 shadow-xs">
          <div className="text-blue-100 text-xs font-medium mb-2">
            Total Donations Recorded
          </div>
          <div className="text-2xl font-bold mb-3 tracking-tight font-mono">
            {dynamicDonationsCount}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-100 font-medium">
            <span>↗</span>
            <span>Immutable Ledger Records</span>
          </div>
        </div>

        {/* Card 2: White Card - Total Alms (INR / ETH) */}
        <div className="rounded-xl bg-white border border-slate-100 p-5 shadow-xs">
          <div className="text-slate-400 text-xs font-medium mb-2">
            Total Capital Raised
          </div>
          <div className="text-2xl font-bold text-brand-600 mb-3 tracking-tight font-mono">
            ₹{inrEstimate}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span>↗</span>
            <span className="font-mono">{dynamicEth.toFixed(3)} ETH on Sepolia</span>
          </div>
        </div>

        {/* Card 3: White Card - Total Unique Donors */}
        <div className="rounded-xl bg-white border border-slate-100 p-5 shadow-xs">
          <div className="text-slate-400 text-xs font-medium mb-2">
            Verified Contributors
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-3 tracking-tight font-mono">
            {dynamicDonorsCount}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-600 font-medium">
            <span>↗</span>
            <span>Unique Ethereum Wallets</span>
          </div>
        </div>
      </div>
    </div>
  );
}
