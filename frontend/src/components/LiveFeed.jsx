import React from 'react';
import SafeImage from './SafeImage';
import { INITIAL_TRANSACTIONS } from '../utils/constants';

export default function LiveFeed({ transactions = INITIAL_TRANSACTIONS }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-4">
        Donate Transaction
      </h3>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                <SafeImage
                  src={tx.image}
                  alt={tx.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                  {tx.title}
                </div>
                <div className="text-[11px] text-slate-400 capitalize">
                  {tx.category}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-bold text-brand-600">
                {tx.amount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
