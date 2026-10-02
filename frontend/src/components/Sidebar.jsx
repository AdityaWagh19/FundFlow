import React from 'react';
import {
  LayoutDashboard,
  List,
  HeartHandshake,
  Wallet,
  BarChart3,
  Megaphone,
  Settings,
  HelpCircle,
  Info,
  PlusCircle,
  Layers,
  X,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  myDonationsCount = 0,
  ownedCampaignsCount = 0,
  isOpen = false,
  onClose = () => {},
}) {
  const generalNav = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'campaigns', label: 'List', icon: List },
    {
      id: 'my-donations',
      label: 'My Donate',
      icon: HeartHandshake,
      badge: myDonationsCount > 0 ? myDonationsCount : null,
    },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    {
      id: 'campaign-admin',
      label: 'Campaign',
      icon: Megaphone,
      badge: ownedCampaignsCount > 0 ? ownedCampaignsCount : null,
    },
  ];

  const settingsNav = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const handleCreateClick = () => {
    onOpenCreateModal();
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Responsive Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col justify-between py-6 px-5 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto shrink-0 min-h-screen ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo & Mobile Close Button */}
          <div className="flex items-center justify-between px-2 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">FundFlow</span>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Close Navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Create Campaign Action Button */}
          <div className="mb-6 px-1">
            <button
              onClick={handleCreateClick}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Launch Cause</span>
            </button>
          </div>

          {/* General Section */}
          <div className="mb-6">
            <p className="px-3 text-xs font-medium text-slate-400 mb-2">
              General
            </p>
            <nav className="space-y-1">
              {generalNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                          isActive ? 'bg-white/25' : 'bg-red-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Section */}
          <div>
            <p className="px-3 text-xs font-medium text-slate-400 mb-2">
              Settings
            </p>
            <nav className="space-y-1">
              {settingsNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Network & Protocol Status */}
        <a
          href="https://sepolia.etherscan.io/address/0x376a819Cf9e7dFAb537aE00e1063A9A17f63c497"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors text-xs block cursor-pointer group mt-4"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-500 text-[11px]">Contract Status</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active
            </span>
          </div>
          <div className="text-[10px] text-slate-400 group-hover:text-brand-600 flex items-center justify-between transition-colors">
            <span>Sepolia: 0x376a...c497</span>
            <span className="text-xs">↗</span>
          </div>
        </a>
      </aside>
    </>
  );
}
