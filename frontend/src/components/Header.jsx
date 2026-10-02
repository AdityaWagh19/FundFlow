import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Mail,
  Wallet,
  LogOut,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  UserCheck,
  Heart,
  ShieldCheck,
  X,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import UserAvatar from './UserAvatar';
import { ETH_TO_INR_RATE, DEFAULT_CONTRACT_ADDRESS } from '../utils/constants';

export default function Header({
  searchQuery,
  setSearchQuery,
  roleMode = 'auto',
  setRoleMode,
  onSearchSubmit,
  onNavigateTab,
}) {
  const {
    account,
    balance,
    isConnecting,
    connectWallet,
    disconnectWallet,
    isSepolia,
    switchNetworkToSepolia,
  } = useWeb3();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [copied, setCopied] = useState(false);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const supportRef = useRef(null);

  const notifications = [
    {
      id: 1,
      title: 'Contribution Recorded',
      desc: '0.001 ETH verified on Sepolia for Pune ZP Schools',
      time: '12m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Milestone Disbursed',
      desc: 'Emergency Flood Relief funds released with IPFS proof',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Smart Contract Active',
      desc: `Sepolia EVM: ${DEFAULT_CONTRACT_ADDRESS.slice(0, 10)}...`,
      time: '3h ago',
      unread: false,
    },
  ];

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const copyAddress = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (supportRef.current && !supportRef.current.contains(e.target)) {
        setIsSupportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const inrBalance = (parseFloat(balance || 0) * ETH_TO_INR_RATE).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-20">
      {/* Title greeting */}
      <div>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          Welcome Let's Donate
        </h1>
      </div>

      {/* Central Search Bar with Form Submit */}
      <form onSubmit={handleSearchSubmit} className="relative w-80 lg:w-96 hidden md:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search Indian causes, categories (press Enter to browse)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white transition-all"
        />
      </form>

      {/* Right Controls: Role Simulator, Notifications, Mail, Web3 Profile */}
      <div className="flex items-center gap-2.5">
        {/* Presentation Role Switcher (Donor vs Organizer Demo View) */}
        {setRoleMode && (
          <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200/80 rounded-lg p-0.5 text-[11px] font-semibold">
            <button
              onClick={() => setRoleMode('donor')}
              title="View interface strictly as a Donor (Contribute only, no withdraw)"
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
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
              title="View interface as Campaign Organizer (Withdrawal & milestone controls enabled)"
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
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
              title="Automatically match role based on connected MetaMask wallet"
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                roleMode === 'auto'
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Auto
            </button>
          </div>
        )}

        {/* Network indicator */}
        {account && !isSepolia && (
          <button
            onClick={switchNetworkToSepolia}
            className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
          >
            Switch Sepolia
          </button>
        )}

        {/* 1. Notifications Button & Popover */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsSupportOpen(false);
              setHasUnreadNotifications(false);
            }}
            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {hasUnreadNotifications && (
              <span className="w-2 h-2 rounded-full bg-brand-600 absolute top-1.5 right-1.5"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-100 p-3 z-50 text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] text-brand-600 font-semibold cursor-pointer hover:underline" onClick={() => setHasUnreadNotifications(false)}>
                  Mark all read
                </span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-slate-50/70 hover:bg-slate-50 transition-colors text-left space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Support / Info Button & Popover */}
        <div className="relative" ref={supportRef}>
          <button
            onClick={() => {
              setIsSupportOpen(!isSupportOpen);
              setIsNotificationsOpen(false);
            }}
            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            title="Assistance & Support"
          >
            <Mail className="w-4 h-4" />
          </button>

          {isSupportOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 p-3 z-50 text-xs space-y-2.5">
              <div className="font-bold text-slate-800 pb-1.5 border-b border-slate-100">
                Support & Helpdesk
              </div>
              <div className="space-y-1.5 text-left">
                {onNavigateTab && (
                  <button
                    onClick={() => {
                      onNavigateTab('help');
                      setIsSupportOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
                    <span>Frequently Asked Questions</span>
                  </button>
                )}
                {onNavigateTab && (
                  <button
                    onClick={() => {
                      onNavigateTab('about');
                      setIsSupportOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>About FundFlow Protocol</span>
                  </button>
                )}
                <a
                  href={`https://sepolia.etherscan.io/address/${DEFAULT_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>Verify Contract on Sepolia</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 3. Profile / Web3 Wallet Button & Disconnect Dropdown */}
        {account ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsNotificationsOpen(false);
                setIsSupportOpen(false);
              }}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
            >
              <UserAvatar account={account} size="md" />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <span>{truncateAddress(account)}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-brand-600 font-medium">₹{inrBalance} ({balance} ETH)</div>
              </div>
            </button>

            {/* Profile Dropdown Popover */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 p-3 z-50 text-xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                  <UserAvatar account={account} size="lg" />
                  <div className="overflow-hidden">
                    <div className="font-mono font-bold text-slate-800 text-[11px] truncate">
                      {account}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Sepolia Connected</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg space-y-1">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Wallet Balance</span>
                    <span>INR Value</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800">
                    <span className="font-mono text-brand-600">{balance} ETH</span>
                    <span>₹{inrBalance}</span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <button
                    onClick={copyAddress}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Address Copied!' : 'Copy Wallet Address'}</span>
                    </span>
                  </button>

                  <a
                    href={`https://sepolia.etherscan.io/address/${account}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View on Etherscan</span>
                    </span>
                  </a>

                  <div className="border-t border-slate-100 my-1"></div>

                  {/* Explicit Disconnect Button */}
                  <button
                    onClick={() => {
                      disconnectWallet();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-50 text-rose-600 font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="flex items-center gap-2 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
          </button>
        )}
      </div>
    </header>
  );
}
