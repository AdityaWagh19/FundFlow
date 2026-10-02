import React from 'react';

export default function HeroBanner({ campaign, onDonateClick }) {
  return (
    <div className="rounded-xl bg-brand-600 text-white p-6 flex items-center justify-between mb-6">
      <div className="max-w-xl">
        <h2 className="text-xl font-bold tracking-tight mb-1">
          {campaign?.title || "Save our students with your Donation!"}
        </h2>
        <p className="text-blue-100 text-xs line-clamp-1">
          {campaign?.description || "Providing direct tuition and living assistance to students facing sudden crises."}
        </p>
      </div>

      <div className="shrink-0 ml-4">
        <button
          onClick={() => onDonateClick(campaign)}
          className="px-5 py-2 bg-white hover:bg-slate-50 text-brand-600 font-semibold text-xs rounded-lg transition-colors"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
}
