import React from 'react';
import { Wallet, ShieldCheck, Landmark, Globe, CheckCircle } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { ETH_TO_INR_RATE, DEFAULT_CONTRACT_ADDRESS } from '../utils/constants';

export default function WalletWidget() {
  const { account, balance, contractBalance, isSepolia } = useWeb3();

  const userInr = (parseFloat(balance || 0) * ETH_TO_INR_RATE).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });

  const contractInr = (parseFloat(contractBalance || 0) * ETH_TO_INR_RATE).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });

  const walletItems = [
    {
      id: 1,
      title: 'MetaMask Account',
      subtitle: account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Not connected',
      balance: account ? `${balance} ETH` : '0.00 ETH',
      inr: account ? `≈ ₹${userInr}` : '₹0',
      icon: Wallet,
      color: 'text-brand-600 bg-blue-50',
    },
    {
      id: 2,
      title: 'Escrow Vault',
      subtitle: `${DEFAULT_CONTRACT_ADDRESS.substring(0, 6)}...${DEFAULT_CONTRACT_ADDRESS.substring(DEFAULT_CONTRACT_ADDRESS.length - 4)}`,
      balance: `${contractBalance} ETH`,
      inr: `≈ ₹${contractInr}`,
      icon: Landmark,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      id: 3,
      title: 'Sepolia Network',
      subtitle: 'Chain ID: 11155111',
      balance: isSepolia ? 'Online' : 'Testnet',
      inr: 'EVM Validated',
      icon: Globe,
      color: 'text-emerald-600 bg-emerald-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Wallet & Escrow</h3>
        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
          Live On-Chain
        </span>
      </div>

      <div className="space-y-3">
        {walletItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50/60 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">{item.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.subtitle}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-brand-600 font-mono">{item.balance}</div>
                <div className="text-[10px] text-slate-400">{item.inr}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
