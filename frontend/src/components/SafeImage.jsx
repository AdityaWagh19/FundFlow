import React, { useState } from 'react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=800&q=80';

export default function SafeImage({ src, alt, className, ...props }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Campaign Image'}
      onError={handleError}
      className={className}
      loading="lazy"
      {...props}
    />
  );
}
