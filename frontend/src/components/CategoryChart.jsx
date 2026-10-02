import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function CategoryChart({ campaigns = [] }) {
  // Aggregate real amountCollected or active count by category
  const categoryTotals = {
    0: { name: 'Medical', value: 0, color: '#2563EB' },
    1: { name: 'Education', value: 0, color: '#10B981' },
    2: { name: 'Disaster', value: 0, color: '#F59E0B' },
    3: { name: 'Food & Aid', value: 0, color: '#EC4899' },
    4: { name: 'Community', value: 0, color: '#8B5CF6' },
  };

  campaigns.forEach((c) => {
    const catId = c.category !== undefined ? Number(c.category) : 0;
    const amt = parseFloat(c.amountCollected || 0);
    if (categoryTotals[catId]) {
      categoryTotals[catId].value += amt > 0 ? amt : 1;
    }
  });

  const totalSum = Object.values(categoryTotals).reduce((sum, item) => sum + item.value, 0) || 1;
  const filteredData = Object.values(categoryTotals).filter((item) => item.value > 0);

  const data = filteredData.map((item) => ({
    name: item.name,
    value: Math.round((item.value / totalSum) * 100),
    color: item.color,
  }));

  const topCategoryPercent = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          Donation Categories
        </h3>
        <span className="text-[10px] text-slate-400 font-medium">Real On-Chain Split</span>
      </div>

      <div className="flex items-center justify-between sm:justify-around lg:justify-between gap-4">
        {/* Donut Chart with Center Percentage */}
        <div className="relative w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={56}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-slate-800 tracking-tight">{topCategoryPercent}%</span>
            <span className="text-[9px] text-slate-400 -mt-0.5">Top Sector</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 pr-1 flex-1 max-w-[180px] lg:max-w-[130px]">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-xs shrink-0"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-slate-600 text-[11px] truncate">{item.name}</span>
              </div>
              <span className="font-bold text-slate-800 text-[11px] font-mono">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
