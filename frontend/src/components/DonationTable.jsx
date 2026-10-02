import React from 'react';

export default function DonationTable({ donations }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm mb-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          Anyone who donates
        </h3>
      </div>

      <div className="overflow-x-auto">
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
              const isCompleted = item.status === 'Completed';
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
