import React, { useState, useEffect } from 'react';

// Generalized high-fidelity SVG fallback banner for humanitarian fundraising causes
const GENERALIZED_CAMPAIGN_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231E3A8A"/><stop offset="50%" stop-color="%232563EB"/><stop offset="100%" stop-color="%230284C7"/></linearGradient><linearGradient id="glow" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="%2338BDF8" stop-opacity="0.3"/><stop offset="100%" stop-color="%23FFFFFF" stop-opacity="0"/></linearGradient></defs><rect width="800" height="400" fill="url(%23bg)"/><circle cx="700" cy="80" r="180" fill="url(%23glow)"/><circle cx="100" cy="320" r="140" fill="url(%23glow)"/><g transform="translate(360, 140)" fill="none" stroke="%23FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M40 70 C20 40, -10 20, -30 40 C-50 60, -30 90, 0 120 L40 160 L80 120 C110 90, 130 60, 110 40 C90 20, 60 40, 40 70 Z" fill="%23FFFFFF" fill-opacity="0.25"/><path d="M-50 140 C-20 120, 20 130, 40 140 C60 150, 100 140, 130 160"/></g><text x="400" y="270" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="20" font-weight="700" fill="%23FFFFFF" text-anchor="middle" letter-spacing="1">FUNDFLOW HUMANITARIAN RELIEF</text><text x="400" y="300" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="500" fill="%23BAE6FD" text-anchor="middle">Transparent On-Chain Escrow Initiative</text></svg>`;

export default function SafeImage({ src, alt, className = '', ...props }) {
  // Resolve IPFS gateways or empty inputs
  const resolveUrl = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return GENERALIZED_CAMPAIGN_SVG;
    }
    const trimmed = url.trim();
    if (trimmed.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${trimmed.replace('ipfs://', '')}`;
    }
    if (trimmed.startsWith('Qm') && !trimmed.includes('/') && trimmed.length >= 44) {
      return `https://ipfs.io/ipfs/${trimmed}`;
    }
    return trimmed;
  };

  const [currentSrc, setCurrentSrc] = useState(() => resolveUrl(src));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(resolveUrl(src));
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(GENERALIZED_CAMPAIGN_SVG);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt || 'FundFlow Campaign'}
      onError={handleError}
      className={className}
      loading="lazy"
      {...props}
    />
  );
}
