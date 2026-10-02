import React, { useState } from 'react';
import { User, Sparkles } from 'lucide-react';

export default function UserAvatar({ account, size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-14 h-14 text-base',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  if (!account) {
    return (
      <div
        className={`${currentSizeClass} rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200/60 ${className}`}
      >
        <User className="w-1/2 h-1/2" />
      </div>
    );
  }

  // Generate deterministic modern web3 gradient colors and geometric pattern
  const cleanAddr = account.toLowerCase();
  const num = parseInt(cleanAddr.slice(2, 10), 16) || 0;

  const gradientPalettes = [
    { from: '#2563EB', via: '#7C3AED', to: '#EC4899', accent: '#60A5FA', light: '#EFF6FF' },
    { from: '#059669', via: '#0D9488', to: '#3B82F6', accent: '#34D399', light: '#ECFDF5' },
    { from: '#7C3AED', via: '#9333EA', to: '#4F46E5', accent: '#C084FC', light: '#FAF5FF' },
    { from: '#EA580C', via: '#F59E0B', to: '#E11D48', accent: '#FBBF24', light: '#FFFBEB' },
    { from: '#0284C7', via: '#2563EB', to: '#4F46E5', accent: '#38BDF8', light: '#F0F9FF' },
    { from: '#D97706', via: '#EA580C', to: '#DC2626', accent: '#FDE047', light: '#FEF3C7' },
  ];

  const palette = gradientPalettes[num % gradientPalettes.length];
  const initials = account.slice(2, 4).toUpperCase();

  // Modern SVG geometric avatar (inspired by modern web3 apps like Uniswap, Rainbow, ENS)
  return (
    <div
      className={`${currentSizeClass} rounded-full shrink-0 relative overflow-hidden ring-1.5 ring-white shadow-xs select-none ${className}`}
      style={{
        background: `linear-gradient(135deg, ${palette.from}, ${palette.via}, ${palette.to})`,
      }}
      title={`Account: ${account}`}
    >
      {!imgError ? (
        <img
          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${cleanAddr}&backgroundColor=transparent&shapeRotation=0,45,90`}
          alt="Avatar"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      ) : (
        /* Crisp Native SVG Geometric Avatar with Layered Depth */
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`grad-${num}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={palette.from} />
              <stop offset="50%" stopColor={palette.via} />
              <stop offset="100%" stopColor={palette.to} />
            </linearGradient>
            <radialGradient id={`glow-${num}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="40" height="40" fill={`url(#grad-${num})`} />
          <circle cx="20" cy="12" r="14" fill={`url(#glow-${num})`} />
          <circle cx="32" cy="32" r="12" fill={palette.accent} fillOpacity="0.4" />
          <circle cx="8" cy="34" r="10" fill="#FFFFFF" fillOpacity="0.25" />
          <text
            x="50%"
            y="54%"
            dominantBaseline="central"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="13"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
          >
            {initials}
          </text>
        </svg>
      )}
    </div>
  );
}
