import React from 'react';
import {
  Megaphone,
  PlusCircle,
  ArrowDownCircle,
  CheckCircle2,
  Lock,
  Heart,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import SafeImage from '../components/SafeImage';

export default function CampaignAdminPage({
  campaigns = [],
  onOpenCreateModal,
  onOpenWithdrawModal,
  onOpenDonateModal,
  roleMode = 'auto',
  setRoleMode,
}) {
  const { account } = useWeb3();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Campaign Portal & Milestone Escrow</h2>
          <p className="text-xs text-slate-400">
            Cryptographic governance distinguishing donors from verified campaign organizers
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-2 self-start cursor-pointer shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Launch New Cause</span>
        </button>
      </div>

      {/* Role Explanation & Interactive Switcher Banner */}
      <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-800">Security Invariant:</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                EIP-1193 Access Control
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Donors can contribute funds and audit proof of expenditures. Only the authenticated organizer wallet that deployed the campaign on Ethereum can execute milestone withdrawals.
            </p>
          </div>
        </div>

        {/* Demo Switcher Controls */}
        {setRoleMode && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 p-1.5 rounded-lg shrink-0">
            <span className="text-[11px] font-bold text-slate-500 pl-1">Perspective:</span>
            <button
              onClick={() => setRoleMode('donor')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                roleMode === 'donor'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3 h-3" />
              <span>Donor Mode</span>
            </button>
            <button
              onClick={() => setRoleMode('organizer')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                roleMode === 'organizer'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Organizer Mode</span>
            </button>
            <button
              onClick={() => setRoleMode('auto')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                roleMode === 'auto'
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Auto
            </button>
          </div>
        )}
      </div>

      {/* Campaigns Listing */}
      <div className="space-y-4">
        {campaigns.map((c) => {
          const collected = parseFloat(c.amountCollected || 0);
          const target = parseFloat(c.targetAmount || 1);
          const percent = Math.min(100, Math.round((collected / target) * 100));

          // Real organizer check
          const isRealOrganizer = account && c.organizer && c.organizer.toLowerCase() === account.toLowerCase();
          const isOrganizerView = roleMode === 'organizer' || (roleMode !== 'donor' && isRealOrganizer);

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
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                      Campaign #{c.id}
                    </span>

                    {isOrganizerView ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-sm flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        <span>You Are Organizer (Withdrawals Enabled)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-sm flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Donor View (Withdrawals Restricted)</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{c.title}</h4>
                  <div className="text-xs text-slate-500 mt-1">
                    Raised: <span className="font-bold text-brand-600">{c.amountCollected} ETH</span> of {c.targetAmount} ETH ({percent}%)
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Organizer: {c.organizer ? `${c.organizer.substring(0, 6)}...${c.organizer.substring(c.organizer.length - 4)}` : 'On-Chain Vault'}
                  </div>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="w-32 hidden lg:block">
                  <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden mb-1">
                    <div className="h-full bg-brand-600 rounded-sm" style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">{percent}% completed</div>
                </div>

                {isOrganizerView ? (
                  <button
                    onClick={() => onOpenWithdrawModal(c)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ArrowDownCircle className="w-3.5 h-3.5" />
                    <span>Milestone Withdrawal</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDonateModal && onOpenDonateModal(c)}
                      className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Contribute Now</span>
                    </button>
                    <button
                      disabled
                      title="Only the registered campaign creator can execute withdrawals on Ethereum"
                      className="px-3 py-2 bg-slate-100 text-slate-400 font-medium text-xs rounded-lg flex items-center gap-1.5 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Withdraw Restricted</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
