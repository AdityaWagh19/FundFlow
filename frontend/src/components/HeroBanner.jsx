import React from 'react';

export default function HeroBanner({ campaign, onDonateClick }) {
  return (
    <div className="rounded-xl bg-brand-600 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="max-w-xl">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight mb-1">
          {campaign?.title || "Support Rural Maharashtra Students: Digital Education & Grants"}
        </h2>
        <p className="text-blue-100 text-xs line-clamp-2 sm:line-clamp-1">
          {campaign?.description || "Providing high-speed tablets, educational kits, and scholarship grants for Zilla Parishad school students across Maharashtra."}
        </p>
      </div>

      <div className="shrink-0 sm:ml-4">
        <button
          onClick={() => onDonateClick(campaign)}
          className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-brand-600 font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center shadow-xs"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
}

