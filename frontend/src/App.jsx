import React, { useState, useEffect } from 'react';
import { useWeb3 } from './context/Web3Context';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import StatCards from './components/StatCards';
import DonationTable from './components/DonationTable';
import TrendingCampaigns from './components/TrendingCampaigns';
import WalletWidget from './components/WalletWidget';
import CategoryChart from './components/CategoryChart';
import LiveFeed from './components/LiveFeed';
import DonateModal from './modals/DonateModal';
import CreateCampaignModal from './modals/CreateCampaignModal';
import WithdrawModal from './modals/WithdrawModal';
import {
  INITIAL_FEATURED_CAMPAIGN,
  INITIAL_CAMPAIGNS,
  INITIAL_DONATIONS,
  INITIAL_TRANSACTIONS,
} from './utils/constants';

export default function App() {
  const { contract, account } = useWeb3();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [featuredCampaign, setFeaturedCampaign] = useState(INITIAL_FEATURED_CAMPAIGN);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [donations, setDonations] = useState(INITIAL_DONATIONS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Platform stats
  const [stats, setStats] = useState({
    totalDonations: 259,
    totalEth: '4.299',
    totalDonors: '1,106',
  });

  // Modal states
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Fetch live on-chain data if contract is connected
  useEffect(() => {
    async function loadBlockchainData() {
      if (!contract) return;
      try {
        const [totalEthRaw, totalDonationsRaw, campaignCountRaw] = await contract.getPlatformOverview();
        const allCampaignsRaw = await contract.getAllCampaigns();

        if (allCampaignsRaw && allCampaignsRaw.length > 0) {
          const parsed = allCampaignsRaw.map((c) => ({
            id: Number(c.id),
            title: c.title,
            description: c.description,
            category: Number(c.category),
            targetAmount: Number(c.targetAmount) / 1e18,
            amountCollected: Number(c.amountCollected) / 1e18,
            image: c.imageIpfsHash || INITIAL_CAMPAIGNS[0].image,
            percent: Math.min(100, Math.round(((Number(c.amountCollected) / 1e18) / ((Number(c.targetAmount) / 1e18) || 1)) * 100)),
          }));

          setCampaigns(parsed);
          if (parsed[0]) setFeaturedCampaign(parsed[0]);
        }

        if (Number(totalDonationsRaw) > 0) {
          setStats((prev) => ({
            ...prev,
            totalDonations: Number(totalDonationsRaw),
            totalEth: (Number(totalEthRaw) / 1e18).toFixed(3),
          }));
        }
      } catch (err) {
        console.log('Contract read error (falling back to initial seed data):', err);
      }
    }

    loadBlockchainData();
  }, [contract]);

  const handleOpenDonate = (campaignToDonate) => {
    setSelectedCampaign(campaignToDonate || featuredCampaign);
    setIsDonateOpen(true);
  };

  const handleDonationSuccess = (campaignId, amountEth) => {
    const numEth = parseFloat(amountEth);
    // Update trending campaigns local state
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const updatedCollected = (parseFloat(c.amountCollected || 0) + numEth).toFixed(2);
          const percent = Math.min(100, Math.round((updatedCollected / parseFloat(c.targetAmount)) * 100));
          return { ...c, amountCollected: updatedCollected, percent };
        }
        return c;
      })
    );

    // Add to donation table
    const newEntry = {
      name: account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'You (Donor)',
      address: account || '0xLocal...Donor',
      campaign: selectedCampaign?.title || 'Emergency Fund',
      start: 'Just now',
      end: 'Pending Block',
      amount: `${amountEth} ETH`,
      status: 'Completed',
      txHash: '0x' + Math.random().toString(16).substring(2, 10),
    };
    setDonations((prev) => [newEntry, ...prev]);

    // Update stats
    setStats((prev) => ({
      ...prev,
      totalDonations: prev.totalDonations + 1,
    }));
  };

  const handleCampaignCreated = (newCampaign) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  // Filter campaigns by search query
  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />

      {/* 2. Main Content Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Dashboard Body */}
        <main className="p-8 flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Center Main Stage (8 Cols) */}
            <div className="lg:col-span-8">
              {/* Hero Urgent Appeal Banner */}
              <HeroBanner
                campaign={featuredCampaign}
                onDonateClick={handleOpenDonate}
              />

              {/* 3 Metric Statistic Cards */}
              <StatCards
                totalDonations={stats.totalDonations}
                totalEth={stats.totalEth}
                totalDonors={stats.totalDonors}
              />

              {/* "Anyone who donates" Ledger Table */}
              <DonationTable donations={donations} />

              {/* "Trending Campaign" 3-Card Grid */}
              <TrendingCampaigns
                campaigns={filteredCampaigns}
                onDonateClick={handleOpenDonate}
              />
            </div>

            {/* Right Intelligence Panel (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Wallet Card */}
              <WalletWidget />

              {/* Donation Categories Donut Chart */}
              <CategoryChart />

              {/* Live Donation Micro-Transactions Feed */}
              <LiveFeed transactions={transactions} />
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        campaign={selectedCampaign}
        onDonationSuccess={handleDonationSuccess}
      />

      <CreateCampaignModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCampaignCreated={handleCampaignCreated}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        campaign={selectedCampaign}
      />
    </div>
  );
}
