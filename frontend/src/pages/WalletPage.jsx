import React, { useState } from 'react';
import { Wallet, Copy, Check, ExternalLink, RefreshCw, AlertCircle, Landmark, LogOut } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { DEFAULT_CONTRACT_ADDRESS, ETH_TO_INR_RATE } from '../utils/constants';
import UserAvatar from '../components/UserAvatar';

export default function WalletPage() {
  const { account, balance, contractBalance, chainId, connectWallet, disconnectWallet, isSepolia, refreshBalance } = useWeb3();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inrBalance = (parseFloat(balance || 0) * ETH_TO_INR_RATE).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });

  const contractInr = (parseFloat(contractBalance || 0) * ETH_TO_INR_RATE).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Web3 Wallet & Treasury Management</h2>
          <p className="text-xs text-slate-400">Non-custodial cryptographic wallet interface on Ethereum Sepolia</p>
        </div>
        {account && (
          <div className="flex items-center gap-2 self-start">
            <button
              onClick={refreshBalance}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-brand-500 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Balances</span>
            </button>
            <button
              onClick={disconnectWallet}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Wallet Overview Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserAvatar account={account} size="lg" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Connected MetaMask Account</h3>
                <p className="text-xs text-slate-400">Ethereum EIP-1193 Provider</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {isSepolia ? 'Sepolia Connected' : 'Chain Connected'}
            </span>
          </div>

          {account ? (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Public Wallet Address</span>
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Address'}</span>
                </button>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-slate-800 break-all select-all">
                {account}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center space-y-3">
              <p className="text-xs text-slate-500">No wallet currently connected to the dApp</p>
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect MetaMask</span>
              </button>
            </div>
          )}

          {/* Real Balance Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-100">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Your Sepolia ETH</div>
              <div className="text-xl font-bold text-brand-600 font-mono">{balance} ETH</div>
              <div className="text-xs text-slate-500 mt-1">Live wallet balance</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-100">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">INR Equivalent Value</div>
              <div className="text-xl font-bold text-slate-800">₹{inrBalance}</div>
              <div className="text-xs text-slate-400 mt-1">Live ETH/INR calculation</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-100">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Escrow Vault Holdings</div>
              <div className="text-xl font-bold text-indigo-600 font-mono">{contractBalance} ETH</div>
              <div className="text-xs text-slate-400 mt-1">≈ ₹{contractInr} locked</div>
            </div>
          </div>
        </div>

        {/* Free Testnet Faucets Card */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">Free Sepolia ETH Faucets</h3>
          <p className="text-xs text-slate-400">
            Need testnet ETH to donate or test contract execution? Claim free Sepolia ETH below:
          </p>

          <div className="space-y-2.5">
            <a
              href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-700"
            >
              <span>Google Cloud Web3 Faucet</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://sepoliafaucet.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-700"
            >
              <span>Alchemy Sepolia Faucet</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://sepolia-faucet.pk910.de/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-700"
            >
              <span>PoW Mining Faucet</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 leading-relaxed border-t border-slate-100">
            Contract Address:
            <div className="font-mono text-slate-600 truncate mt-0.5 select-all">
              {DEFAULT_CONTRACT_ADDRESS}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
