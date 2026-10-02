import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
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

// Pages
import CampaignsPage from './pages/CampaignsPage';
import MyDonationsPage from './pages/MyDonationsPage';
import WalletPage from './pages/WalletPage';
import AnalysisPage from './pages/AnalysisPage';
import CampaignAdminPage from './pages/CampaignAdminPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import AboutPage from './pages/AboutPage';

import {
  INITIAL_FEATURED_CAMPAIGN,
  INITIAL_CAMPAIGNS,
  INITIAL_DONATIONS,
  INITIAL_TRANSACTIONS,
  ETH_TO_INR_RATE,
} from './utils/constants';

export default function App() {
  const { contract, account, refreshBalance } = useWeb3();

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
    totalDonors: '1.106',
  });

  // Modal states
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Load real on-chain campaigns, platform overview, and real donations
  const loadBlockchainData = useCallback(async () => {
    if (!contract) return;
    try {
      const [totalEthRaw, totalDonationsRaw, campaignCountRaw] = await contract.getPlatformOverview();
      const allCampaignsRaw = await contract.getAllCampaigns();

      if (allCampaignsRaw && allCampaignsRaw.length > 0) {
        const parsed = allCampaignsRaw.map((c, idx) => {
          const target = Number(c.targetAmount) / 1e18;
          const collected = Number(c.amountCollected) / 1e18;
          const percent = Math.min(100, Math.round((collected / (target || 1)) * 100));

          return {
            id: Number(c.id),
            organizer: c.organizer,
            title: c.title,
            description: c.description,
            category: Number(c.category),
            targetAmount: target.toString(),
            amountCollected: collected.toFixed(3),
            image: c.imageIpfsHash || INITIAL_CAMPAIGNS[idx % INITIAL_CAMPAIGNS.length].image,
            percent,
            raisedFormatted: `₹${(collected * ETH_TO_INR_RATE).toLocaleString('en-IN')}`,
            targetFormatted: `₹${(target * ETH_TO_INR_RATE).toLocaleString('en-IN')}`,
          };
        });

        // Merge on-chain with India-centric initial campaigns
        const combined = [...parsed];
        INITIAL_CAMPAIGNS.forEach((initC) => {
          if (!combined.some((item) => item.id === initC.id)) {
            combined.push(initC);
          }
        });

        setCampaigns(combined);
        if (parsed[0]) setFeaturedCampaign(parsed[0]);

        // Query real on-chain donations from contract
        const onChainDonations = [];
        for (const c of allCampaignsRaw) {
          try {
            const donList = await contract.getDonations(c.id);
            if (donList && donList.length > 0) {
              donList.forEach((d) => {
                const ethVal = ethers.formatEther(d.amount);
                onChainDonations.push({
                  donor: d.donor,
                  name: d.donor ? `${d.donor.substring(0, 6)}...${d.donor.substring(d.donor.length - 4)}` : 'Donor',
                  address: d.donor,
                  campaign: c.title,
                  campaignId: Number(c.id),
                  amount: `${ethVal} ETH`,
                  inrAmount: `₹${(Number(ethVal) * ETH_TO_INR_RATE).toLocaleString('en-IN')}`,
                  start: new Date(Number(d.timestamp) * 1000).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                  end: 'Confirmed',
                  status: 'Completed',
                  txHash: `${d.donor.substring(0, 10)}...`,
                });
              });
            }
          } catch (e) {
            console.log(`Could not fetch donations for campaign ${c.id}:`, e);
          }
        }

        if (onChainDonations.length > 0) {
          // Put newest donations first
          setDonations(onChainDonations.reverse());
        }
      }

      if (Number(totalDonationsRaw) > 0) {
        const ethNum = Number(totalEthRaw) / 1e18;
        setStats({
          totalDonations: Number(totalDonationsRaw),
          totalEth: ethNum.toFixed(4),
          totalDonors: Math.max(1, Number(totalDonationsRaw)).toString(),
        });
      }
    } catch (err) {
      console.log('Contract read error:', err);
    }
  }, [contract]);

  useEffect(() => {
    loadBlockchainData();
  }, [loadBlockchainData]);

  // Compute real donations filtered specifically for the connected wallet
  const myDonations = account
    ? donations.filter(
        (d) => (d.address || d.donor || '').toLowerCase() === account.toLowerCase()
      )
    : [];

  // Compute campaigns owned by this organizer
  const ownedCampaigns = account
    ? campaigns.filter(
        (c) => (c.organizer || '').toLowerCase() === account.toLowerCase()
      )
    : campaigns;

  const handleOpenDonate = (campaignToDonate) => {
    setSelectedCampaign(campaignToDonate || featuredCampaign);
    setIsDonateOpen(true);
  };

  const handleOpenWithdraw = (campaignToWithdraw) => {
    setSelectedCampaign(campaignToWithdraw || campaigns[0]);
    setIsWithdrawOpen(true);
  };

  const handleDonationSuccess = async (campaignId, amountEth) => {
    const numEth = parseFloat(amountEth);
    const inrValue = (numEth * ETH_TO_INR_RATE).toLocaleString('en-IN');

    // Update trending campaigns local state immediately
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const updatedCollected = (parseFloat(c.amountCollected || 0) + numEth).toFixed(3);
          const percent = Math.min(100, Math.round((updatedCollected / parseFloat(c.targetAmount)) * 100));
          return {
            ...c,
            amountCollected: updatedCollected,
            percent,
            raisedFormatted: `₹${(parseFloat(updatedCollected) * ETH_TO_INR_RATE).toLocaleString('en-IN')}`,
          };
        }
        return c;
      })
    );

    // Add entry to donations state
    const newEntry = {
      name: account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'You',
      address: account || '0xLocal...Donor',
      donor: account,
      campaign: selectedCampaign?.title || 'Humanitarian Cause',
      campaignId,
      start: 'Just now',
      end: 'Confirmed',
      amount: `${amountEth} ETH`,
      inrAmount: `₹${inrValue}`,
      status: 'Completed',
      txHash: 'Confirmed on Sepolia',
    };
    setDonations((prev) => [newEntry, ...prev]);

    // Update stats
    setStats((prev) => ({
      ...prev,
      totalDonations: prev.totalDonations + 1,
      totalEth: (parseFloat(prev.totalEth) + numEth).toFixed(4),
    }));

    if (refreshBalance) refreshBalance();
    setTimeout(loadBlockchainData, 3000);
  };

  const handleCampaignCreated = (newCampaign) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
    setTimeout(loadBlockchainData, 3000);
  };

  // Filter campaigns by search query
  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* 1. Left Sidebar with Real Dynamic Badges */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        myDonationsCount={myDonations.length}
        ownedCampaignsCount={ownedCampaigns.length}
      />

      {/* 2. Main Content Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Dashboard Body */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            {/* View 1: Overview / Main Dashboard */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                  {/* Wallet Card with Real Web3 Telemetry */}
                  <WalletWidget />

                  {/* Donation Categories Donut Chart */}
                  <CategoryChart />

                  {/* Live Donation Micro-Transactions Feed */}
                  <LiveFeed transactions={transactions} />
                </div>
              </div>
            )}

            {/* View 2: List / All Campaigns */}
            {activeTab === 'campaigns' && (
              <CampaignsPage
                campaigns={filteredCampaigns}
                onDonateClick={handleOpenDonate}
              />
            )}

            {/* View 3: My Donations (100% Real on-chain data) */}
            {activeTab === 'my-donations' && (
              <MyDonationsPage
                myDonations={myDonations}
                onExploreClick={() => setActiveTab('campaigns')}
              />
            )}

            {/* View 4: Wallet & Treasury */}
            {activeTab === 'wallet' && <WalletPage />}

            {/* View 5: Analysis */}
            {activeTab === 'analysis' && <AnalysisPage />}

            {/* View 6: Campaign Admin / Organizer Portal */}
            {activeTab === 'campaign-admin' && (
              <CampaignAdminPage
                campaigns={ownedCampaigns}
                onOpenCreateModal={() => setIsCreateOpen(true)}
                onOpenWithdrawModal={handleOpenWithdraw}
              />
            )}

            {/* View 7: Settings */}
            {activeTab === 'settings' && <SettingsPage />}

            {/* View 8: Help & FAQs */}
            {activeTab === 'help' && <HelpPage />}

            {/* View 9: About / SPPU BCT Academic Project */}
            {activeTab === 'about' && <AboutPage />}
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
