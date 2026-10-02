import React from 'react';

export default function DonationTable({ donations }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm mb-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          Anyone who donates
        </h3>
      </div>

      {/* Mobile-friendly Card View (< sm) */}
      <div className="sm:hidden space-y-2.5">
        {donations.map((item, index) => (
          <div key={index} className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-slate-800 font-mono">{item.name}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                  item.status === 'Completed' || item.status === 'Confirmed'
                    ? 'text-emerald-700 bg-emerald-50'
                    : item.status === 'Pending'
                    ? 'text-amber-700 bg-amber-50 animate-pulse'
                    : 'text-rose-700 bg-rose-50'
                }`}
              >
                {item.status}
              </span>
            </div>
            <div className="text-xs text-slate-600 line-clamp-1">{item.campaign}</div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100/80">
              <span>{item.start}</span>
              <span>{item.end}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Table View (>= sm) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Campaign</th>
              <th className="pb-3 font-medium">Start</th>
              <th className="pb-3 font-medium">End</th>
              <th className="pb-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {donations.map((item, index) => {
              return (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-800">
                    {item.name}
                  </td>
                  <td className="py-3 pr-4 text-slate-500">
                    {item.campaign}
                  </td>
                  <td className="py-3 pr-4 text-slate-400">
                    {item.start}
                  </td>
                  <td className="py-3 pr-4 text-slate-400">
                    {item.end}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`font-semibold ${
                        item.status === 'Completed' || item.status === 'Confirmed'
                          ? 'text-brand-600'
                          : item.status === 'Pending'
                          ? 'text-amber-600 animate-pulse'
                          : 'text-rose-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
