import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function UserAvatar({ account, size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-14 h-14 text-base',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  // Generate deterministic pastel gradient based on account address
  const getGradientColors = (addr) => {
    if (!addr) return 'from-slate-200 to-slate-300';
    const num = parseInt(addr.slice(2, 8), 16) || 0;
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-violet-500 to-purple-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600',
      'from-cyan-500 to-blue-600',
    ];
    return gradients[num % gradients.length];
  };

  if (!account) {
    return (
      <div
        className={`${currentSizeClass} rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 ${className}`}
      >
        <User className="w-1/2 h-1/2" />
      </div>
    );
  }

  // If user has an account, render Dicebear with instant fallback to SVG identicon
  return (
    <div
      className={`${currentSizeClass} rounded-lg overflow-hidden shrink-0 bg-linear-to-br ${getGradientColors(
        account
      )} flex items-center justify-center text-white font-bold font-mono shadow-xs ${className}`}
    >
      {!imgError ? (
        <img
          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account.toLowerCase()}`}
          alt="Avatar"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span>{account.slice(2, 4).toUpperCase()}</span>
      )}
    </div>
  );
}
