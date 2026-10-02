import React from 'react';
import { Megaphone, PlusCircle, ArrowDownCircle, ToggleLeft, ToggleRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import SafeImage from '../components/SafeImage';

export default function CampaignAdminPage({ campaigns, onOpenCreateModal, onOpenWithdrawModal }) {
  const { account } = useWeb3();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Campaign Organizer Portal</h2>
          <p className="text-xs text-slate-400">Manage your initiated causes, audit expenditures, and execute transparent milestone withdrawals</p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-2 self-start"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Launch New Cause</span>
        </button>
      </div>

      {/* Organizer Status Notice */}
      <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Transparent Milestone Escrow:</span> Funds can only be withdrawn upon providing a mandatory milestone reasoning description and an IPFS hash of verified expenditure invoices.
        </div>
      </div>

      {/* Campaigns Table / Cards */}
      <div className="space-y-4">
        {campaigns.map((c) => {
          const collected = parseFloat(c.amountCollected || 0);
          const target = parseFloat(c.targetAmount || 1);
          const percent = Math.min(100, Math.round((collected / target) * 100));

          return (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <SafeImage
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                      Campaign #{c.id}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active On-Chain
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{c.title}</h4>
                  <div className="text-xs text-slate-500 mt-1">
                    Raised: <span className="font-bold text-brand-600">{c.amountCollected} ETH</span> of {c.targetAmount} ETH ({percent}%)
                  </div>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="w-36 hidden lg:block">
                  <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden mb-1">
                    <div className="h-full bg-brand-600 rounded-sm" style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">{percent}% completed</div>
                </div>

                <button
                  onClick={() => onOpenWithdrawModal(c)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <ArrowDownCircle className="w-3.5 h-3.5" />
                  <span>Withdraw Funds</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
