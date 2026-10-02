import React from 'react';
import { CreditCard, Landmark, CircleDollarSign } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

export default function WalletWidget() {
  const { account, balance } = useWeb3();

  const walletItems = [
    {
      id: 1,
      title: 'Credit bank',
      subtitle: 'Visa bank',
      balance: '$8.531,80',
      icon: CreditCard,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 2,
      title: 'Bank',
      subtitle: 'WeBank',
      balance: '$7.970,80',
      icon: Landmark,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 3,
      title: 'Pay Pal',
      subtitle: 'Pay Pal Bank',
      balance: '$4.251,04',
      icon: CircleDollarSign,
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-4">Wallet</h3>

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
                  <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Balance</div>
                <div className="text-xs font-bold text-brand-600">{item.balance}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
