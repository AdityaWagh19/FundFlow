import React, { useState } from 'react';
import { X, Heart, ShieldCheck, ArrowRight, Loader2, ExternalLink, AlertTriangle, Award } from 'lucide-react';
import { ethers } from 'ethers';
import confetti from 'canvas-confetti';
import { useWeb3 } from '../context/Web3Context';
import { storeDonation } from '../utils/storageDb';
import { ETH_TO_INR_RATE, CATEGORIES } from '../utils/constants';

export default function DonateModal({ isOpen, onClose, campaign, onDonationSuccess, onOpenReceipt }) {
  const { account, contract, connectWallet } = useWeb3();
  const [amount, setAmount] = useState('0.1');
  const [txStatus, setTxStatus] = useState('idle'); // 'idle' | 'broadcasting' | 'confirming' | 'confirmed' | 'failed'
  const [txHash, setTxHash] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen || !campaign) return null;

  const quickAmounts = ['0.01', '0.05', '0.1', '0.5', '1.0'];

  const resetAndClose = () => {
    setTxStatus('idle');
    setTxHash(null);
    setBlockNumber(null);
    setErrorMessage(null);
    onClose();
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid donation amount in ETH.');
      return;
    }

    if (!account) {
      await connectWallet();
      return;
    }

    try {
      setErrorMessage(null);
      setTxStatus('broadcasting');

      if (!contract) {
        throw new Error('Smart contract connection not available. Please verify your network.');
      }

      // 1. Submit transaction to MetaMask
      const tx = await contract.donate(campaign.id, {
        value: ethers.parseEther(amount),
      });

      // 2. Transaction broadcasted to mempool
      setTxHash(tx.hash);
      setTxStatus('confirming');

      // Store in persistent local database as Pending
      const inrEstimate = Math.round(parseFloat(amount) * ETH_TO_INR_RATE).toLocaleString('en-IN');
      const nowFormatted = new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });

      storeDonation({
        txHash: tx.hash,
        donor: account,
        name: `${account.substring(0, 6)}...${account.substring(account.length - 4)}`,
        campaign: campaign.title,
        campaignId: campaign.id,
        amount: `${amount} ETH`,
        inrAmount: `₹${inrEstimate}`,
        start: nowFormatted,
        end: 'Awaiting',
        status: 'Pending',
      });

      // 3. Wait for real on-chain block confirmation
      const receipt = await tx.wait(1);

      if (receipt.status === 1) {
        setBlockNumber(receipt.blockNumber);
        setTxStatus('confirmed');

        // Update donation status in db to Completed
        storeDonation({
          txHash: tx.hash,
          donor: account,
          name: `${account.substring(0, 6)}...${account.substring(account.length - 4)}`,
          campaign: campaign.title,
          campaignId: campaign.id,
          amount: `${amount} ETH`,
          inrAmount: `₹${inrEstimate}`,
          start: nowFormatted,
          end: 'Confirmed',
          status: 'Completed',
        });

        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#10B981', '#3B82F6'],
        });

        if (onDonationSuccess) {
          onDonationSuccess(campaign.id, amount, tx.hash);
        }
      } else {
        setTxStatus('failed');
        setErrorMessage('Transaction was reverted on-chain by the EVM.');
      }
    } catch (err) {
      console.error('Donation failed:', err);
      setTxStatus('failed');
      setErrorMessage(err.reason || err.message || 'Transaction rejected or failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* State 1: Confirmed State */}
        {txStatus === 'confirmed' ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Donation Confirmed on Chain</h3>
            <p className="text-xs text-slate-500 mb-4">
              Successfully contributed <span className="font-bold text-slate-800">{amount} ETH</span> to {campaign.title}. Verified in Block #{blockNumber}.
            </p>
            <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] font-mono text-slate-600 break-all mb-4 text-left">
              <div className="text-slate-400 text-[10px] mb-0.5">Transaction Hash:</div>
              {txHash}
            </div>
            <button
              type="button"
              onClick={() => {
                const inrEstimate = Math.round(parseFloat(amount) * ETH_TO_INR_RATE).toLocaleString('en-IN');
                const catName = CATEGORIES.find((c) => c.id === campaign.category)?.name || 'Humanitarian Cause';
                onClose();
                if (onOpenReceipt) {
                  onOpenReceipt({
                    donor: account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Verified Donor',
                    donorAddress: account || '0x...',
                    campaignTitle: campaign.title,
                    campaignCategory: catName,
                    ethAmount: `${amount} ETH`,
                    inrAmount: `₹${inrEstimate}`,
                    txHash: txHash || '0xSepoliaVerified...',
                    blockNumber: blockNumber || '6842918',
                    timestamp: new Date().toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }),
                  });
                }
              }}
              className="w-full py-2.5 mb-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-600 hover:opacity-95 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>Get Official Donation Receipt (PDF / Image)</span>
            </button>

            <div className="flex gap-2">
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View on Etherscan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={resetAndClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : txStatus === 'confirming' ? (
          /* State 2: Transaction Confirming in Mempool */
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-brand-600 rounded-lg flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Confirming on Sepolia</h3>
              <p className="text-xs text-slate-500">
                Transaction submitted to the mempool. Waiting for block validation...
              </p>
            </div>
            {txHash && (
              <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] font-mono text-slate-600 break-all text-left">
                <div className="text-slate-400 text-[10px] mb-0.5">Tx Broadcasted:</div>
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:underline flex items-center gap-1"
                >
                  <span className="truncate">{txHash}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}
            <div className="text-[11px] text-amber-600 font-medium bg-amber-50 py-1.5 px-3 rounded-lg inline-block">
              Please do not close this window
            </div>
          </div>
        ) : (
          /* State 3: Input Form / Broadcasting / Failed */
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
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
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
              <div className="text-[11px] text-slate-400 mt-1">
                ≈ ₹{(parseFloat(amount || 0) * ETH_TO_INR_RATE).toLocaleString('en-IN')} INR
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={txStatus === 'broadcasting'}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {txStatus === 'broadcasting' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Awaiting Wallet Signature...</span>
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
