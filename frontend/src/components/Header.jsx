import React from 'react';
import { Search, Bell, Mail, Wallet, CheckCircle } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

export default function Header({ searchQuery, setSearchQuery }) {
  const { account, balance, isConnecting, connectWallet, disconnectWallet, isSepolia, switchNetworkToSepolia } = useWeb3();

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Title greeting from inspo */}
      <div>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          Welcome Let's Donate
        </h1>
      </div>

      {/* Central Search Bar */}
      <div className="relative w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white transition-all"
        />
      </div>

      {/* Right Controls: Notifications, Mail, Web3 Profile */}
      <div className="flex items-center gap-3">
        {/* Network indicator */}
        {account && !isSepolia && (
          <button
            onClick={switchNetworkToSepolia}
            className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg hover:bg-amber-100 transition-colors"
          >
            Switch Sepolia
          </button>
        )}

        <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 absolute top-2 right-2"></span>
        </button>

        <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
          <Mail className="w-4 h-4" />
        </button>

        {/* Profile / Web3 Wallet Button */}
        {account ? (
          <div className="flex items-center gap-2.5 pl-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100">
              <img
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account}`}
                alt="Avatar"
                className="w-full h-full"
              />
            </div>
            <div className="text-left cursor-pointer" onClick={disconnectWallet} title="Click to disconnect">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <span>{truncateAddress(account)}</span>
              </div>
              <div className="text-[10px] text-brand-600 font-medium">{balance} ETH</div>
            </div>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="flex items-center gap-2 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
          </button>
        )}
      </div>
    </header>
  );
}
