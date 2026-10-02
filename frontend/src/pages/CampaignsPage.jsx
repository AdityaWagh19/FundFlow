import React, { useState } from 'react';
import SafeImage from '../components/SafeImage';
import { CATEGORIES } from '../utils/constants';
import { Search, MapPin, Target, Sparkles, Filter } from 'lucide-react';

export default function CampaignsPage({ campaigns, onDonateClick }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = campaigns.filter((c) => {
    const matchesCat = selectedCategory === 'all' || c.category === Number(selectedCategory);
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Active Fundraising Causes</h2>
          <p className="text-xs text-slate-400">Verified humanitarian campaigns across India with audited smart contract escrow</p>
        </div>

        {/* Category Filter Chips (Clean rounded-lg, no pills) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-500'
            }`}
          >
            All Causes
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-500'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => {
          const percent = c.percent || Math.min(100, Math.round(((Number(c.amountCollected) || 0) / (Number(c.targetAmount) || 1)) * 100));
          const cat = CATEGORIES.find((item) => item.id === c.category) || CATEGORIES[0];

          return (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Banner Thumbnail */}
                <div className="w-full h-40 rounded-lg overflow-hidden mb-3.5 bg-slate-100 relative">
                  <SafeImage
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-700 shadow-xs">
                    {cat.name}
                  </div>
                </div>

                {/* Location if present */}
                {c.location && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                    <MapPin className="w-3 h-3 text-brand-600 shrink-0" />
                    <span>{c.location}</span>
                  </div>
                )}

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-1.5 line-clamp-1">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {c.description}
                </p>

                {/* Progress & Numbers */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="text-brand-600 font-bold">{c.raisedFormatted || `${c.amountCollected} ETH`}</span>
                  <span className="text-slate-400 font-normal">Goal: {c.targetFormatted || `${c.targetAmount} ETH`}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{percent}%</span>
                </div>

                {/* Minimalist Flat Progress Bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden mb-5">
                  <div
                    className="h-full bg-brand-600 rounded-sm transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onDonateClick(c)}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                Contribute Now
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
          <p className="text-sm text-slate-500">No campaigns found matching your filter criteria.</p>
        </div>
      )}
    </div>
  );
}
