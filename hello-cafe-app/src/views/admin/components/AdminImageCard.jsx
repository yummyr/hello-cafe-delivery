import useImageFallback from "../../../hooks/useImageFallback";

function AdminImageCard({
  src,
  alt,
  className = "w-12 h-12 object-cover rounded-lg border border-gray-200",
  fallbackSrc = "/assets/default-no-img.png"
}) {
  // Handle null, undefined, or empty string by using fallbackSrc
  const initialSrc = (src && src.trim() !== '') ? src : fallbackSrc;
  const { src: imageSrc, handleError } = useImageFallback(initialSrc, fallbackSrc);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}

export default AdminImageCard;