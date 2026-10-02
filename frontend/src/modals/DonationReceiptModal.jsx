import React, { useRef, useState } from 'react';
import {
  X,
  MoreHorizontal,
  Printer,
  ExternalLink,
  Share2,
  Check,
  Copy,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { DEFAULT_CONTRACT_ADDRESS } from '../utils/constants';

export default function DonationReceiptModal({ isOpen, onClose, receipt }) {
  const receiptRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !receipt) return null;

  const {
    donor = 'Verified Contributor',
    donorAddress = '0x...',
    campaignTitle = 'Humanitarian Cause',
    campaignCategory = 'Grassroots Relief',
    ethAmount = '0.05 ETH',
    inrAmount = '₹14,250',
    txHash = '0x...',
    blockNumber = '6842918',
    timestamp = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    receiptId = `FF-${Date.now().toString(36).toUpperCase()}`,
  } = receipt;

  const etherscanUrl =
    txHash && txHash.length > 20 && !txHash.includes('...')
      ? `https://sepolia.etherscan.io/tx/${txHash}`
      : `https://sepolia.etherscan.io/address/${DEFAULT_CONTRACT_ADDRESS}`;

  // 1. Download as High-Resolution PNG Image (matching receipt template)
  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;
    try {
      setIsGenerating(true);
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // High-DPI crisp capture
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Payment-Record-${receiptId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating receipt image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Browser Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  // 3. Share to Twitter / X
  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Official Payment Record: Contributed ${ethAmount} (${inrAmount}) to "${campaignTitle}" via @FundFlow!\n\n` +
      `Direct peer-to-contract escrow with 0% platform fee.\n\n` +
      `Audit link: ${etherscanUrl}\n\n` +
      `#FundFlow #Web3Philanthropy`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  // 4. Share to WhatsApp
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Payment Record: Verified contribution of ${ethAmount} (${inrAmount}) to "${campaignTitle}" on FundFlow with 0% intermediary fee! Audit link: ${etherscanUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // 5. Copy Verification Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(etherscanUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-auto max-h-[92vh] overflow-y-auto font-sans">
        {/* Printable & Exportable Canvas Area */}
        <div ref={receiptRef} className="bg-white font-sans">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Payment Record</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer print:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader: Company & Job */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Left Column: Company */}
            <div>
              <div className="text-xs text-slate-400 font-medium mb-1.5">Company</div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <div className="w-3.5 h-3.5 rounded-xs border-2 border-white"></div>
                </div>
                <span className="text-xs font-bold text-slate-800 truncate" title={campaignTitle}>
                  {campaignTitle}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Confirmed</span>
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-600">
                  Direct Escrow
                </span>
              </div>
            </div>

            {/* Right Column: Job */}
            <div>
              <div className="text-xs text-slate-400 font-medium mb-1.5">Job</div>
              <div className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2">
                {campaignCategory} / Verified Grant
              </div>
            </div>
          </div>

          {/* Middle Rounded Box with Timeline Line Items */}
          <div className="rounded-2xl border border-slate-200/90 p-4 space-y-3.5 mb-6 bg-white">
            {/* Row 1 */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">Smart Contract Escrow</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{timestamp}</div>
              </div>
              <div className="text-xs font-medium text-slate-700">Block #{blockNumber}</div>
            </div>

            <div className="border-b border-slate-100"></div>

            {/* Row 2 */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">Milestone Vault Allocation</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Grassroots Beneficiary Deployment</div>
              </div>
              <div className="text-xs font-medium text-slate-700">0% Intermediary</div>
            </div>

            <div className="border-b border-slate-100"></div>

            {/* Row 3 */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">Immutable Audit Ledger</div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[170px]">
                  {txHash && txHash.length > 18 ? `${txHash.slice(0, 16)}...` : txHash}
                </div>
              </div>
              <div className="text-xs font-semibold text-emerald-600">Verified</div>
            </div>

            <div className="border-b border-slate-100"></div>

            {/* Total Indicator in Emerald */}
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-600">Total Direct 100%</span>
            </div>
          </div>

          {/* Financial Breakdown Section */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="font-medium">Gross Contribution</span>
              <span className="font-bold text-slate-900">{inrAmount}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="font-medium">Platform Commission</span>
              <span className="text-slate-500 font-medium">- ₹0.00 (0%)</span>
            </div>

            <div className="pt-2 text-right">
              <div className="text-xs font-bold text-emerald-600">Take Home</div>
              <div className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-0.5">
                {inrAmount}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                {ethAmount} on Ethereum Sepolia
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 print:hidden relative">
          <button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
          >
            {isGenerating ? 'Exporting...' : 'Export Invoice'}
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              title="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 text-xs space-y-1 z-30">
                <button
                  onClick={() => {
                    handlePrint();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print / Save as PDF</span>
                </button>

                <button
                  onClick={() => {
                    handleShareTwitter();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share on X (Twitter)</span>
                </button>

                <button
                  onClick={() => {
                    handleShareWhatsApp();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  <span className="text-emerald-500 font-bold">💬</span>
                  <span>Share on WhatsApp</span>
                </button>

                <a
                  href={etherscanUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>View on Sepolia Etherscan</span>
                </a>

                <button
                  onClick={() => {
                    handleCopyLink();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Verification Link'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
