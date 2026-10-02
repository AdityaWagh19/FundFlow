import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function CategoryChart() {
  const data = [
    { name: 'Medical', value: 45, color: '#2563EB' },     // Electric Blue
    { name: 'Education', value: 28, color: '#1E293B' },   // Dark Slate
    { name: 'Disaster', value: 17, color: '#F59E0B' },    // Amber
    { name: 'Food', value: 10, color: '#A855F7' },        // Purple
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-3">
        Donation Categories
      </h3>

      <div className="flex items-center justify-between">
        {/* Donut Chart with Center Percentage */}
        <div className="relative w-32 h-32">
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
            <span className="text-lg font-bold text-slate-800 tracking-tight">73%</span>
          </div>
        </div>

        {/* Legend matching inspo */}
        <div className="space-y-2 pr-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-slate-600 text-xs">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
