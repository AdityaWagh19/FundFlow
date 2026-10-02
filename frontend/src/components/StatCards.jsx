import React from 'react';

export default function StatCards({ totalDonations = 259, totalEth = '4.299', totalDonors = '1.106' }) {
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
            ${typeof totalEth === 'string' && totalEth.startsWith('$') ? totalEth.slice(1) : totalEth}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-600 font-medium">
            <span>↗</span>
            <span>4.9% Increased last week</span>
          </div>
        </div>

        {/* Card 3: White Card - Total Donor */}
        <div className="rounded-xl bg-white border border-slate-100 p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-medium mb-2">
            Total Donor
          </div>
          <div className="text-2xl font-bold text-brand-600 mb-3 tracking-tight">
            ${totalDonors}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
            <span>↘</span>
            <span>5.1% Downhill this week</span>
          </div>
        </div>
      </div>
    </div>
  );
}
