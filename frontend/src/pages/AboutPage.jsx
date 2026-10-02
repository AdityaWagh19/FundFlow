import React from 'react';
import { ShieldCheck, HeartHandshake, Zap, Globe2, Eye, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';
import { DEFAULT_CONTRACT_ADDRESS } from '../utils/constants';

export default function AboutPage() {
  const coreValues = [
    {
      icon: ShieldCheck,
      title: 'Zero Intermediary Overhead',
      desc: 'Traditional charities lose 7% to 15% in administrative overhead. FundFlow executes on smart contracts with a 0% platform fee, delivering 100% of donations directly to the cause.',
    },
    {
      icon: Eye,
      title: '100% Public Verifiability',
      desc: 'Every single contribution, balance query, and withdrawal is cryptographically recorded on the Ethereum blockchain, making financial manipulation impossible.',
    },
    {
      icon: Lock,
      title: 'Milestone Escrow Vaults',
      desc: 'Funds are locked in non-reentrant smart contract vaults. Organizers disburse capital strictly in accordance with verified progress milestones and cryptographic IPFS receipts.',
    },
    {
      icon: Globe2,
      title: 'Grassroots Indian Impact',
      desc: 'Built specifically to fund verified Indian humanitarian initiatives—from flood relief in Kerala and Wayanad to rural digital education and pediatric care in Maharashtra.',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Cause Onboarding',
      desc: 'Campaign organizers initiate fundraising causes with clear funding targets, timelines, and verifiable social impact objectives.',
    },
    {
      step: '02',
      title: 'On-Chain Contribution',
      desc: 'Donors contribute ETH seamlessly via MetaMask. Transactions are validated on Ethereum Sepolia and locked in the smart contract escrow.',
    },
    {
      step: '03',
      title: 'IPFS Proof Submission',
      desc: 'Before requesting funds, organizers submit immutable receipts and expenditure proof anchored on decentralized IPFS storage.',
    },
    {
      step: '04',
      title: 'Direct Disbursement',
      desc: 'Funds disburse directly to verified vendors and beneficiaries with complete audit trails visible to any donor worldwide.',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">About FundFlow</h2>
        <p className="text-xs text-slate-400">
          Decentralized, trustless philanthropy powered by Ethereum smart contracts
        </p>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Our Mission</h3>
            <p className="text-xs text-slate-400">Restoring radical trust and efficiency in charitable giving</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          FundFlow was founded on a simple principle: <strong>charity should be entirely transparent, instant, and accountable</strong>. Traditional donation pipelines suffer from bureaucratic delays, high banking surcharges, and opaque financial reporting. FundFlow replaces third-party intermediaries with self-executing smart contracts, providing an unforgeable ledger of all donations and milestone-based disbursements.
        </p>

        {/* Highlight Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
            <div className="text-lg font-bold text-brand-600">0.00%</div>
            <div className="text-[10px] text-slate-400 font-medium">Platform Take-Rate</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
            <div className="text-lg font-bold text-emerald-600">100%</div>
            <div className="text-[10px] text-slate-400 font-medium">On-Chain Escrow</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
            <div className="text-lg font-bold text-slate-800">12 Sec</div>
            <div className="text-[10px] text-slate-400 font-medium">Block Settlement</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
            <div className="text-lg font-bold text-indigo-600">IPFS</div>
            <div className="text-[10px] text-slate-400 font-medium">Decentralized Receipts</div>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-3 tracking-tight">Core Pillars</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coreValues.map((val) => {
            const Icon = val.icon;
            return (
              <div key={val.title} className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">{val.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Pipeline */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">How FundFlow Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((step) => (
            <div key={step.step} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 relative">
              <span className="text-xs font-mono font-bold text-brand-600">{step.step}</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1 mb-1">{step.title}</h4>
              <p className="text-[11px] text-slate-500 leading-normal">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Contract Technical Verification */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 mb-1">Audited Smart Contract</h4>
          <p className="text-[11px] text-slate-400 font-mono">
            Ethereum Sepolia: {DEFAULT_CONTRACT_ADDRESS}
          </p>
        </div>
        <a
          href={`https://sepolia.etherscan.io/address/${DEFAULT_CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
        >
          <span>View on Etherscan</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
