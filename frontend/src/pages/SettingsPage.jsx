import React, { useState } from 'react';
import { Settings, Copy, Check, ExternalLink, ShieldCheck, Database, Sliders, LogOut, Wallet, UserCheck, Heart } from 'lucide-react';
import { DEFAULT_CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID_DECIMAL } from '../utils/constants';
import { useWeb3 } from '../context/Web3Context';
import UserAvatar from '../components/UserAvatar';

export default function SettingsPage({ roleMode = 'auto', setRoleMode }) {
  const { account, balance, connectWallet, disconnectWallet, isSepolia } = useWeb3();
  const [currency, setCurrency] = useState('INR');
  const [copied, setCopied] = useState(false);

  const copyContract = () => {
    navigator.clipboard.writeText(DEFAULT_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Platform Configuration & Settings</h2>
        <p className="text-xs text-slate-400">Manage blockchain RPC connections, network parameters, and display preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs space-y-6">
        {/* Connected Wallet Account & Disconnect Option */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-3">Connected Account</h3>
          {account ? (
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
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-between">
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

        {/* Presentation Role Mode */}
        {setRoleMode && (
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-1">Presentation Role Mode</h3>
            <p className="text-xs text-slate-400 mb-3">
              Switch between Donor and Organizer views to demonstrate how permissions change dynamically
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setRoleMode('donor')}
                className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  roleMode === 'donor'
                    ? 'border-brand-600 bg-blue-50/50 text-brand-700 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <Heart className="w-3.5 h-3.5 text-brand-600" />
                  <span>Donor Mode</span>
                </div>
                <div className="text-[11px] text-slate-400">Contribute funds only, no milestone withdraw access</div>
              </button>

              <button
                onClick={() => setRoleMode('organizer')}
                className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  roleMode === 'organizer'
                    ? 'border-amber-600 bg-amber-50/50 text-amber-700 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5 text-amber-700">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Organizer Mode</span>
                </div>
                <div className="text-[11px] text-slate-400">Unlock milestone withdrawals and IPFS proof submissions</div>
              </button>

              <button
                onClick={() => setRoleMode('auto')}
                className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  roleMode === 'auto'
                    ? 'border-slate-800 bg-slate-50 text-slate-800 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Auto-Detect</span>
                </div>
                <div className="text-[11px] text-slate-400">Determine role strictly based on connected wallet</div>
              </button>
            </div>
          </div>
        )}

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
            <button
              onClick={() => setCurrency('INR')}
              className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                currency === 'INR'
                  ? 'border-brand-600 bg-blue-50/50 text-brand-700 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="font-bold text-sm">INR (₹) - Indian Rupee</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Calculated at live ETH/INR exchange rates</div>
            </button>

            <button
              onClick={() => setCurrency('ETH')}
              className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                currency === 'ETH'
                  ? 'border-brand-600 bg-blue-50/50 text-brand-700 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="font-bold text-sm">ETH (Ξ) - Native Ether</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Direct on-chain denomination</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
