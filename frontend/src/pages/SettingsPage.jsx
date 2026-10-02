import React, { useState } from 'react';
import { Settings, Copy, Check, ExternalLink, ShieldCheck, Database, Sliders } from 'lucide-react';
import { DEFAULT_CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID_DECIMAL } from '../utils/constants';

export default function SettingsPage() {
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
        {/* Network & Contract Configuration */}
        <div>
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
              className={`p-3 rounded-lg border text-left text-xs transition-colors ${
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
              className={`p-3 rounded-lg border text-left text-xs transition-colors ${
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
