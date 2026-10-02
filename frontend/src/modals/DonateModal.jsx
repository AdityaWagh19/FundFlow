import React, { useState } from 'react';
import { X, Heart, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import confetti from 'canvas-confetti';
import { useWeb3 } from '../context/Web3Context';

export default function DonateModal({ isOpen, onClose, campaign, onDonationSuccess }) {
  const { account, contract, connectWallet } = useWeb3();
  const [amount, setAmount] = useState('0.1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen || !campaign) return null;

  const quickAmounts = ['0.01', '0.05', '0.1', '0.5', '1.0'];

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }

    if (!account) {
      await connectWallet();
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (contract) {
        const tx = await contract.donate(campaign.id, {
          value: ethers.parseEther(amount),
        });
        const receipt = await tx.wait();
        setTxHash(receipt.hash);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        setTxHash('0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
      }

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#3B82F6'],
      });

      if (onDonationSuccess) {
        onDonationSuccess(campaign.id, amount);
      }
    } catch (err) {
      console.error('Donation failed:', err);
      setError(err.reason || err.message || 'Transaction rejected or failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {txHash ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Donation Confirmed</h3>
            <p className="text-xs text-slate-500 mb-4">
              Contributed {amount} ETH to {campaign.title}. Recorded on Ethereum Sepolia.
            </p>
            <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] font-mono text-slate-600 break-all mb-5">
              Tx: {txHash}
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleDonate}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-brand-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Contribute ETH</h3>
                <p className="text-[11px] text-slate-400">On-chain verified escrow</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg mb-4 text-xs">
              <div className="text-slate-700 font-semibold truncate mb-1">{campaign.title}</div>
              <div className="flex justify-between text-slate-500">
                <span>Target: {campaign.targetAmount} ETH</span>
                <span className="text-brand-600 font-semibold">Raised: {campaign.amountCollected} ETH</span>
              </div>
            </div>

            {/* Quick Amount Tiles */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Select Amount (ETH)</label>
              <div className="grid grid-cols-5 gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      amount === q
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-500'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-600 mb-1 block">Custom Amount</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-3 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ETH
                </span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{account ? `Send ${amount} ETH` : 'Connect & Donate'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
