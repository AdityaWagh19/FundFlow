import React from 'react';
import { BookOpen, GraduationCap, CheckCircle2, Code2, Globe } from 'lucide-react';
import { DEFAULT_CONTRACT_ADDRESS } from '../utils/constants';

export default function AboutPage() {
  const syllabusUnits = [
    { unit: 'Unit I', title: 'Blockchain Fundamentals', desc: 'Immutable append-only distributed ledger and cryptographic SHA/Keccak hashing.' },
    { unit: 'Unit II', title: 'Ethereum Platform & EVM', desc: 'Gas mechanics, state variables, and transaction lifecycle on Sepolia testnet.' },
    { unit: 'Unit III', title: 'Smart Contract Development', desc: 'Solidity ^0.8.20 programming with payable functions, custom modifiers, and indexed events.' },
    { unit: 'Unit IV', title: 'Smart Contract Security', desc: 'Reentrancy protection with Checks-Effects-Interactions and mutex locks.' },
    { unit: 'Unit V', title: 'Decentralized Storage', desc: 'Content addressing and off-chain media/invoice hash anchoring via IPFS.' },
    { unit: 'Unit VI', title: 'dApp Engineering', desc: 'Client integration using Ethers.js v6, MetaMask browser wallet, and reactive state management.' },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Academic Overview & Project Details</h2>
        <p className="text-xs text-slate-400">Mini Project developed under the Savitribai Phule Pune University (SPPU) BCT Curriculum</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Savitribai Phule Pune University (SPPU)</h3>
            <p className="text-xs text-slate-400">Department of Computer Engineering / Information Technology</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            <strong>Course:</strong> Blockchain Technology (BCT)
          </p>
          <p>
            <strong>Project Title:</strong> FundFlow: Blockchain-Based Transparent Charity Donation System
          </p>
          <p>
            <strong>Core Objective:</strong> Replace opaque charitable donation pipelines with an automated smart contract escrow, enabling immutable tracking, zero platform take-rate, and milestone-based disbursement backed by cryptographic proof of expenditure.
          </p>
        </div>

        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Syllabus Mapping Matrix
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {syllabusUnits.map((u) => (
              <div key={u.unit} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-brand-600">{u.unit}</span>
                  <span className="text-[10px] text-slate-400 font-medium">BCT Syllabus</span>
                </div>
                <div className="font-semibold text-slate-800 mb-0.5">{u.title}</div>
                <div className="text-[11px] text-slate-500 leading-normal">{u.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
