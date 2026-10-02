import React from 'react';
import { ETH_TO_INR_RATE } from '../utils/constants';

export default function StatCards({ totalDonations = 259, totalEth = '4.299', totalDonors = '1,106' }) {
  // Clean up any stray dollar signs or formatters
  const cleanEth = typeof totalEth === 'string' ? totalEth.replace(/[^\d.]/g, '') : totalEth;
  const numEth = parseFloat(cleanEth) || 4.299;
  const inrEstimate = Math.round(numEth * ETH_TO_INR_RATE).toLocaleString('en-IN');
  const cleanDonors = typeof totalDonors === 'string' ? totalDonors.replace(/^\$/, '') : totalDonors;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-slate-800 mb-3 tracking-tight">Statistic</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Primary Blue Card */}
        <div className="rounded-xl bg-brand-600 text-white p-5">
          <div className="text-blue-100 text-xs font-medium mb-2">
            Total Donation
          </div>
          <div className="text-2xl font-bold mb-3 tracking-tight">
            {totalDonations}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-100 font-medium">
            <span>↗</span>
            <span>2.3% Increased last week</span>
          </div>
        </div>

        {/* Card 2: White Card - Total Alms */}
        <div className="rounded-xl bg-white border border-slate-100 p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-medium mb-2">
            Total Alms
          </div>
          <div className="text-2xl font-bold text-brand-600 mb-3 tracking-tight">
            {numEth.toFixed(3)} ETH
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span>↗</span>
            <span>₹{inrEstimate} Raised</span>
          </div>
        </div>

        {/* Card 3: White Card - Total Donor */}
        <div className="rounded-xl bg-white border border-slate-100 p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-medium mb-2">
            Total Donor
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">
            {cleanDonors}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-600 font-medium">
            <span>↗</span>
            <span>Verified On-Chain Backers</span>
          </div>
        </div>
      </div>
    </div>
  );
}

