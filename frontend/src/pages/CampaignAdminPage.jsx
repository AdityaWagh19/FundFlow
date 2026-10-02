import React, { useState } from 'react';
import {
  Megaphone,
  PlusCircle,
  ArrowDownCircle,
  CheckCircle2,
  Lock,
  Heart,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  Copy,
  Check,
  Wallet,
  Building,
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import SafeImage from '../components/SafeImage';
import UserAvatar from '../components/UserAvatar';
import { getUserProfile, isCampaignOrganizer } from '../utils/storageDb';
import { ETH_TO_INR_RATE } from '../utils/constants';

export default function CampaignAdminPage({
  campaigns = [],
  onOpenCreateModal,
  onOpenWithdrawModal,
  onOpenDonateModal,
}) {
  const { account, connectWallet } = useWeb3();
  const [activeSubTab, setActiveSubTab] = useState('my-causes'); // 'my-causes' | 'all-causes'
  const [copied, setCopied] = useState(false);

  const profile = getUserProfile(account);

  // Filter campaigns strictly belonging to this connected wallet
  const myOwnedCampaigns = account
    ? campaigns.filter((c) => isCampaignOrganizer(c, account))
    : [];

  const copyAddress = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayedCampaigns = activeSubTab === 'my-causes' ? myOwnedCampaigns : campaigns;

  return (
    <div className="space-y-6">
      {/* Page Title & Launch Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Campaign Organizer Portal</h2>
          <p className="text-xs text-slate-400">
            Account management, on-chain campaign ownership, and milestone expenditure releases
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-2 self-start cursor-pointer shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Launch New Cause</span>
        </button>
      </div>

      {/* Connected Account & Identity Card */}
      {account ? (
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <UserAvatar account={account} size="lg" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-800">{profile.name}</h3>
                {myOwnedCampaigns.length > 0 ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>Verified Organizer ({myOwnedCampaigns.length} Causes)</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>Contributor / Donor</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{profile.organization}</span>
                <span>•</span>
                <span className="font-mono text-slate-600 font-semibold">{account.slice(0, 6)}...{account.slice(-4)}</span>
                <button onClick={copyAddress} className="text-brand-600 hover:underline cursor-pointer" title="Copy Address">
                  {copied ? <Check className="w-3 h-3 text-emerald-600 inline" /> : <Copy className="w-3 h-3 inline" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-2.5 rounded-lg shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-medium">Owned Causes Escrow</div>
              <div className="text-xs font-bold text-brand-600 font-mono">
                {myOwnedCampaigns.reduce((sum, c) => sum + parseFloat(c.amountCollected || 0), 0).toFixed(3)} ETH
              </div>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-medium">Created Causes</div>
              <div className="text-xs font-bold text-slate-800 font-mono">
                {myOwnedCampaigns.length}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-6 text-center space-y-3">
          <div className="w-10 h-10 bg-blue-50 text-brand-600 rounded-lg flex items-center justify-center mx-auto">
            <Wallet className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Connect Wallet to Manage Causes</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Campaign ownership and milestone withdrawal permissions are cryptographically attached to your Ethereum wallet address.
          </p>
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Connect MetaMask</span>
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs: My Causes vs All Causes */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('my-causes')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'my-causes'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>My Initiated Causes ({myOwnedCampaigns.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('all-causes')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'all-causes'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>All Platform Causes ({campaigns.length})</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:block">
          {activeSubTab === 'my-causes' ? 'Causes created by your connected wallet' : 'Public on-chain ledger'}
        </span>
      </div>

      {/* Campaigns Listing */}
      <div className="space-y-4">
        {displayedCampaigns.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-10 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Megaphone className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Campaigns Initiated by This Wallet</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your connected wallet ({account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Guest'}) is currently recognized as a Contributor. To withdraw funds, you must be the creator of the campaign.
            </p>
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Launch Your First Campaign</span>
            </button>
          </div>
        ) : (
          displayedCampaigns.map((c) => {
            const collected = parseFloat(c.amountCollected || 0);
            const target = parseFloat(c.targetAmount || 1);
            const percent = Math.min(100, Math.round((collected / target) * 100));
            const isOwner = isCampaignOrganizer(c, account);

            const inrRaised = Math.round(collected * ETH_TO_INR_RATE).toLocaleString('en-IN');
            const inrTarget = Math.round(target * ETH_TO_INR_RATE).toLocaleString('en-IN');

            return (
              <div
                key={c.id}
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all ${
                  isOwner ? 'border-indigo-200/80 ring-1 ring-indigo-50' : 'border-slate-100'
                }`}
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
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-mono">
                        Cause #{c.id}
                      </span>

                      {isOwner ? (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-sm flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>Your Campaign (You are Organizer)</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-sm flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Organizer: {c.organizer ? `${c.organizer.substring(0, 6)}...${c.organizer.substring(c.organizer.length - 4)}` : 'On-Chain'}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{c.title}</h4>
                    <div className="text-xs text-slate-500 mt-1">
                      Raised: <span className="font-bold text-brand-600">₹{inrRaised}</span> ({c.amountCollected} ETH) of ₹{inrTarget} ({percent}%)
                    </div>
                  </div>
                </div>

                {/* Progress & Actions */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-32 hidden lg:block">
                    <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden mb-1">
                      <div className="h-full bg-brand-600 rounded-sm" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="text-[10px] text-slate-400 text-right font-mono">{percent}% collected</div>
                  </div>

                  {isOwner ? (
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
                        <span>Contribute</span>
                      </button>
                      <span
                        title="Only the registered campaign creator can execute withdrawals on Ethereum"
                        className="px-3 py-2 bg-slate-100 text-slate-400 font-medium text-xs rounded-lg flex items-center gap-1.5 cursor-not-allowed select-none"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Withdraw Locked</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
