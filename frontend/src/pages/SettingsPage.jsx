import React, { useState } from 'react';
import {
  Settings,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Database,
  Sliders,
  LogOut,
  Wallet,
  UserCheck,
  Save,
  Building,
} from 'lucide-react';
import { DEFAULT_CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID_DECIMAL } from '../utils/constants';
import { useWeb3 } from '../context/Web3Context';
import UserAvatar from '../components/UserAvatar';
import { getUserProfile, saveUserProfile } from '../utils/storageDb';

export default function SettingsPage() {
  const { account, balance, connectWallet, disconnectWallet } = useWeb3();
  const [currency, setCurrency] = useState('INR');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const initialProfile = getUserProfile(account);
  const [displayName, setDisplayName] = useState(initialProfile.name || '');
  const [organization, setOrganization] = useState(initialProfile.organization || '');

  const copyContract = () => {
    navigator.clipboard.writeText(DEFAULT_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!account) return;
    saveUserProfile(account, {
      ...initialProfile,
      name: displayName.trim() || `Benefactor (${account.slice(2, 6)})`,
      organization: organization.trim() || 'Independent Contributor',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Platform Configuration & Settings</h2>
        <p className="text-xs text-slate-400">Manage blockchain RPC connections, wallet account profiles, and display preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs space-y-6">
        {/* Connected Wallet Account & Disconnect Option */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-3">Connected Ethereum Account</h3>
          {account ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UserAvatar account={account} size="lg" />
                  <div>
                    <div className="font-mono text-xs font-bold text-slate-800 break-all">{account}</div>
                    <div className="text-[11px] text-brand-600 font-semibold mt-0.5">{balance} ETH on Sepolia</div>
                  </div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect Account</span>
                </button>
              </div>

              {/* Profile Editor Attached to this Wallet */}
              <form onSubmit={handleSaveProfile} className="p-4 bg-slate-50/60 rounded-xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">Account Identity Profile</h4>
                  <span className="text-[10px] text-slate-400">Linked to this public key</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 mb-1 block">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Aditya Wagh"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 mb-1 block">Organization / NGO Affiliation</label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. FundFlow Foundation"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {saveSuccess ? (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Profile updated successfully!</span>
                    </span>
                  ) : <div></div>}
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-5 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">No wallet currently connected</span>
              <button
                onClick={connectWallet}
                className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect MetaMask</span>
              </button>
            </div>
          )}
        </div>

        {/* Network & Contract Configuration */}
        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-3">Blockchain Environment</h3>
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-800">Target EVM Network</div>
                <div className="text-slate-400 text-[11px]">Ethereum Sepolia Testnet</div>
              </div>
              <span className="font-mono px-2.5 py-1 bg-white border border-slate-200 rounded-md font-semibold text-brand-600">
                Chain ID: {SEPOLIA_CHAIN_ID_DECIMAL}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold text-slate-800">Deployed Escrow Smart Contract</span>
                <button
                  onClick={copyContract}
                  className="text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-slate-700 text-xs break-all select-all font-semibold">
                {DEFAULT_CONTRACT_ADDRESS}
              </div>
              <div className="pt-1">
                <a
                  href={`https://sepolia.etherscan.io/address/${DEFAULT_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:text-brand-700 text-[11px] font-semibold inline-flex items-center gap-1"
                >
                  <span>View Contract on Etherscan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-800">Active Public JSON-RPC Gateway</div>
                <div className="text-slate-400 text-[11px]">https://ethereum-sepolia-rpc.publicnode.com</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* Currency Display Preference */}
        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-3">Currency Format</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-brand-600 bg-blue-50/50 text-brand-700 text-xs">
              <div className="font-bold text-sm">INR (₹) - Indian Rupee (Default)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Calculated at live ETH/INR rate (₹2,85,000 / ETH)</div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/40 text-slate-600 text-xs">
              <div className="font-bold text-sm">ETH (Ξ) - Native Ether</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Underlying EVM settlement currency</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
