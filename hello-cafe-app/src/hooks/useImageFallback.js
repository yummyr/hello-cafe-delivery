import { useState } from 'react';

/**
 * Custom hook to handle image loading errors with fallback
 * @param {string} initialSrc - Initial image source
 * @param {string} fallbackSrc - Fallback image source (default: "/assets/default-no-img.png")
 * @returns {Object} - { src, handleError }
 */
export const useImageFallback = (initialSrc, fallbackSrc = "/assets/default-no-img.png") => {
  const [src, setSrc] = useState(initialSrc);

  const handleError = () => {
    if (src !== fallbackSrc) {
      setSrc(fallbackSrc);
    }
  };

  return { src, handleError };
};

export default useImageFallback;