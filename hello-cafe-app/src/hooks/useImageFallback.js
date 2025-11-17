import { useState } from 'react';

/**
 * Custom hook to handle image loading errors with fallback
 * @param {string} initialSrc - Initial image source
 * @param {string} fallbackSrc - Fallback image source (default: "/assets/default-no-img.png")
 * @returns {Object} - { src, handleError }
 */
export const useImageFallback = (initialSrc, fallbackSrc = "/assets/default-no-img.png") => {
  // If initialSrc is empty, null, undefined, or just whitespace, use fallback immediately
  const sanitizedInitialSrc = (!initialSrc || initialSrc.trim() === '') ? fallbackSrc : initialSrc;
  const [src, setSrc] = useState(sanitizedInitialSrc);

  const handleError = () => {
    if (src !== fallbackSrc) {
      setSrc(fallbackSrc);
    }
  };

  return { src, handleError };
};

export default useImageFallback;