import React, { useState } from 'react';
import { X, Megaphone, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { CATEGORIES } from '../utils/constants';

export default function CreateCampaignModal({ isOpen, onClose, onCampaignCreated }) {
  const { account, contract, connectWallet } = useWeb3();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(0);
  const [targetAmount, setTargetAmount] = useState('1.0');
  const [duration, setDuration] = useState('30');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !targetAmount) {
      setError('Please fill in all required fields');
      return;
    }

    if (!account) {
      await connectWallet();
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const finalImage = imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80';

      if (contract) {
        const tx = await contract.createCampaign(
          title,
          description,
          finalImage,
          category,
          ethers.parseEther(targetAmount),
          parseInt(duration, 10)
        );
        await tx.wait(1);
      }

      const inrTarget = Math.round(parseFloat(targetAmount) * 285000).toLocaleString('en-IN');
      const newCampaign = {
        id: Date.now(),
        title,
        description,
        category: parseInt(category, 10),
        targetAmount,
        amountCollected: '0.00',
        percent: 0,
        image: finalImage,
        organizer: account,
        isUserCreated: true,
        isPlatformSeed: false,
        raisedFormatted: '₹0',
        targetFormatted: `₹${inrTarget}`,
      };

      if (onCampaignCreated) {
        onCampaignCreated(newCampaign);
      }

      onClose();
    } catch (err) {
      console.error('Failed to create campaign:', err);
      setError(err.reason || err.message || 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Launch Fundraising Cause</h3>
            <p className="text-[11px] text-slate-400">Recorded on Ethereum Sepolia</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">Campaign Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Clean Water Wells in Arid Regions"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">Cause Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the humanitarian need and how collected funds will be disbursed..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Target Goal (ETH) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="1.0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="365"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
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
                <span>Broadcasting to Sepolia...</span>
              </>
            ) : (
              <span>Publish Campaign</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
