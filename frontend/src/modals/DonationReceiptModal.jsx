import React, { useRef, useState } from 'react';
import {
  X,
  Download,
  Share2,
  Printer,
  ExternalLink,
  ShieldCheck,
  Check,
  Award,
  Layers,
  Heart,
  QrCode,
  Sparkles,
  Copy,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { DEFAULT_CONTRACT_ADDRESS, ETH_TO_INR_RATE } from '../utils/constants';

export default function DonationReceiptModal({ isOpen, onClose, receipt }) {
  const receiptRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedProof, setCopiedProof] = useState(false);

  if (!isOpen || !receipt) return null;

  const {
    donor = 'Anonymous Philanthropist',
    donorAddress = '0x...',
    campaignTitle = 'Humanitarian Aid Initiative',
    campaignCategory = 'Social Impact',
    ethAmount = '0.05',
    inrAmount = '₹14,250',
    txHash = '0x...',
    blockNumber = '6842918',
    timestamp = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    receiptId = `FF-${Date.now().toString(36).toUpperCase()}`,
  } = receipt;

  const etherscanUrl =
    txHash && txHash.length > 20 && !txHash.includes('...')
      ? `https://sepolia.etherscan.io/tx/${txHash}`
      : `https://sepolia.etherscan.io/address/${DEFAULT_CONTRACT_ADDRESS}`;

  // 1. Download as High-Resolution PNG Image (Optimized for Social Sharing)
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
      link.download = `FundFlow-Donation-Certificate-${receiptId}.png`;
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
      `I just contributed ${ethAmount} (${inrAmount}) to support "${campaignTitle}" on @FundFlow!\n\n` +
      `Verified on Ethereum blockchain with 0% middleman fees.\n\n` +
      `Transparent receipt: ${etherscanUrl}\n\n` +
      `#FundFlow #Web3ForGood #EthereumPhilanthropy`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  // 4. Share to WhatsApp
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Proud to support "${campaignTitle}" with ${ethAmount} (${inrAmount}) via FundFlow! ` +
      `Every rupee is verified on Ethereum with 0% intermediary fee. View receipt: ${etherscanUrl}`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-slate-100 relative my-auto sm:my-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100 pr-8">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              Cryptographic Donation Certificate
            </h3>
            <p className="text-[11px] text-slate-400">
              Auditable on-chain proof of philanthropy ready for download and social sharing
            </p>
          </div>
        </div>

        {/* Printable & Exportable Certificate Canvas Container */}
        <div className="p-1 bg-gradient-to-br from-brand-600/10 via-indigo-600/5 to-emerald-500/10 rounded-xl mb-5">
          <div
            ref={receiptRef}
            className="bg-white p-4 sm:p-7 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden text-slate-800 print:shadow-none print:border-none"
          >
            {/* Top Subtle Watermark Banner */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-500/5 pointer-events-none"></div>

            {/* Certificate Header Row */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-bold tracking-tight text-slate-900">FundFlow</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Transparent Blockchain Philanthropy
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>100% On-Chain Escrow</span>
                </span>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  Cert #{receiptId}
                </div>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center py-5">
              <div className="text-[11px] uppercase tracking-widest font-bold text-brand-600 mb-1">
                Certificate of Contribution
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Verified Philanthropic Grant
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                This certifies that a direct, trustless contribution was recorded in the Ethereum smart contract escrow.
              </p>
            </div>

            {/* Highlighted Amount Card */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-4 rounded-xl border border-slate-100 text-center mb-5">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                Total Contribution Value
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-600 font-mono tracking-tight">
                {inrAmount}
              </div>
              <div className="text-xs font-semibold text-slate-600 font-mono mt-0.5">
                {ethAmount} on Ethereum Sepolia EVM
              </div>
            </div>

            {/* Grant Details Breakdown */}
            <div className="space-y-2.5 text-xs pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Beneficiary Cause:</span>
                <span className="font-bold text-slate-800 text-right max-w-[260px] truncate">
                  {campaignTitle}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Aid Sector:</span>
                <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm text-[11px]">
                  {campaignCategory}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contributing Wallet:</span>
                <span className="font-mono text-slate-700 font-semibold">
                  {donorAddress.length > 12 ? `${donorAddress.slice(0, 6)}...${donorAddress.slice(-4)}` : donorAddress}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Transaction Timestamp:</span>
                <span className="text-slate-600">{timestamp}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Intermediary Take-Rate:</span>
                <span className="font-bold text-emerald-600">0.00% (Direct Peer-to-Contract)</span>
              </div>
            </div>

            {/* Blockchain Technical Verification Footer */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
              <div className="space-y-1 text-slate-400 max-w-[280px]">
                <div className="flex items-center gap-1 text-slate-600 font-mono">
                  <span className="font-bold text-[10px] text-slate-400 uppercase">Smart Contract:</span>
                  <span className="truncate">{DEFAULT_CONTRACT_ADDRESS.slice(0, 8)}...{DEFAULT_CONTRACT_ADDRESS.slice(-6)}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <span>Tx Hash:</span>
                  <span className="text-slate-600 truncate">{txHash.slice(0, 16)}...</span>
                </div>
              </div>

              {/* Verified Hologram Emblem */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/80 border border-emerald-200/60 shrink-0">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase leading-none">
                    EVM Verified
                  </div>
                  <div className="text-[9px] text-emerald-600 font-mono mt-0.5">
                    Immutable Record
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Download PNG, Print PDF, Share on Socials */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Rendering Image...' : 'Download Image (PNG)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>

          {/* Social Share Bar */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-xs text-slate-500 mb-2">
              <span className="font-medium flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>Share Verification on Socials:</span>
              </span>
              <button
                onClick={handleCopyLink}
                className="text-brand-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer self-start xs:self-auto"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Explorer Link'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={handleShareTwitter}
                className="py-2 px-3 bg-slate-900 hover:bg-black text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Post on X (Twitter)</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="py-2 px-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>WhatsApp</span>
              </button>

              <a
                href={etherscanUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Sepolia Explorer</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
