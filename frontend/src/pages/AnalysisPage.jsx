import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShieldCheck, Zap, DollarSign, Activity } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

export default function AnalysisPage() {
  const monthlyData = [
    { month: 'May', eth: 4.8, inr: 13.68 },
    { month: 'Jun', eth: 6.2, inr: 17.67 },
    { month: 'Jul', eth: 8.9, inr: 25.36 },
    { month: 'Aug', eth: 12.4, inr: 35.34 },
    { month: 'Sep', eth: 15.6, inr: 44.46 },
    { month: 'Oct', eth: 18.2, inr: 51.87 },
  ];

  const categoryDistribution = [
    { name: 'Medical', value: 45, color: '#2563EB' },
    { name: 'Education', value: 28, color: '#10B981' },
    { name: 'Disaster', value: 17, color: '#F59E0B' },
    { name: 'Food & Aid', value: 10, color: '#EC4899' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Ecosystem Analytics & Impact Metrics</h2>
        <p className="text-xs text-slate-400">Real-time cryptographic performance, distribution channels, and middleman cost savings</p>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
          <div className="text-slate-400 text-xs font-medium mb-1">Intermediary Take-Rate</div>
          <div className="text-2xl font-bold text-emerald-600">0.00%</div>
          <div className="text-[11px] text-slate-400 mt-1">Direct peer-to-contract escrow</div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
          <div className="text-slate-400 text-xs font-medium mb-1">Disbursement Transparency</div>
          <div className="text-2xl font-bold text-brand-600">100%</div>
          <div className="text-[11px] text-slate-400 mt-1">Cryptographic IPFS receipts</div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
          <div className="text-slate-400 text-xs font-medium mb-1">Average Block Confirmation</div>
          <div className="text-2xl font-bold text-slate-800">12.4s</div>
          <div className="text-[11px] text-slate-400 mt-1">Ethereum Sepolia EVM</div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
          <div className="text-slate-400 text-xs font-medium mb-1">Estimated Fees Saved</div>
          <div className="text-2xl font-bold text-slate-800">₹4,28,000</div>
          <div className="text-[11px] text-emerald-600 mt-1">Compared to 7% NGO overhead</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Volume Bar Chart */}
        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-4">
            Monthly On-Chain Volume (ETH)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip
                  formatter={(val) => [`${val} ETH (₹${(val * 2.85).toFixed(2)} Lakhs)`, 'Donated']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="eth" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Allocation Donut Chart */}
        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-4">
            Aid Sector Distribution (% of Total ETH)
          </h3>
          <div className="h-64 flex items-center justify-between">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-1/2 space-y-3 pl-4">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }}></span>
                    <span className="text-slate-600 font-medium">{cat.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
