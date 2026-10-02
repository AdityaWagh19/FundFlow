import React from 'react';
import SafeImage from './SafeImage';

export default function TrendingCampaigns({ campaigns, onDonateClick }) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Trending Campaign</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {campaigns.slice(0, 3).map((c) => {
          const percent = c.percent || Math.min(100, Math.round(((Number(c.amountCollected) || 0) / (Number(c.targetAmount) || 1)) * 100));
          return (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Campaign Image with SafeImage fallback */}
                <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-slate-100">
                  <SafeImage
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title & Description */}
                <h4 className="text-xs font-bold text-slate-800 tracking-tight mb-1 line-clamp-1">
                  {c.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                  {c.description}
                </p>

                {/* Amounts & Percentage in INR */}
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1.5">
                  <span className="text-brand-600 font-bold">{c.raisedFormatted || `₹${Math.round(parseFloat(c.amountCollected || 0) * 285000).toLocaleString('en-IN')}`}</span>
                  <span className="text-slate-500">Goal: {c.targetFormatted || `₹${Math.round(parseFloat(c.targetAmount || 1) * 285000).toLocaleString('en-IN')}`}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{percent}%</span>
                </div>

                {/* Progress Bar - minimalist flat */}
                <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden mb-4">
                  <div
                    className="h-full bg-brand-600 rounded-sm transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button - clean rounded rectangle */}
              <button
                onClick={() => onDonateClick(c)}
                className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Donate now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
