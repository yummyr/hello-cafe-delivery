import { Heart, Plus, Info, Star } from "lucide-react";
import useImageFallback from "../../../hooks/useImageFallback";

function ComboCard({
  combo,
  onToggleFavorite,
  onAddToCart,
  onViewDetails,
  isFavorite
}) {
  const { src: comboImageSrc, handleError: handleComboImageError } = useImageFallback(combo.image);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={comboImageSrc}
          alt={combo.name}
          onError={handleComboImageError}
          className="w-full h-3/4 object-cover "
        />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(e, combo)}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </button>
        <button
          onClick={(e) => onAddToCart(e, combo)}
          className="absolute bottom-3 right-3 w-10 h-10 bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-700 transition hover:scale-110"
        >
          <span className="text-2xl">+</span>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">
          {combo.name}
        </h3>
        {combo.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {combo.description}
          </p>
        )}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-amber-600">
            ${combo.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1">
           
          </div>
        </div>
        <button
          onClick={() => onViewDetails(combo)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium"
        >
          <Info className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
}

export default ComboCard;