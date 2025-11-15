import { Heart, Star } from "lucide-react";
import useImageFallback from "../../../hooks/useImageFallback";

function MenuItemCard({
  item,
  onClick,
  onAddToCart,
  onToggleFavorite,
  isFavorite
}) {
  const { src, handleError } = useImageFallback(item.image);

  return (
    <div
      onClick={() => onClick(item)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      <div className="relative">
        <img
          src={src}
          alt={item.name}
          className="w-full h-48 object-cover"
          onError={handleError}
        />
        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(e, item)}
          className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </button>
        {/* Add to Cart Button */}
        <button
          onClick={(e) => onAddToCart(e, item)}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition hover:scale-110"
        >
          <span className="text-2xl">+</span>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${item.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">
              {item.rating.toFixed(1)}
            </span>
          </div>
        </div>
        {item.categoryName && (
          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
            {item.categoryName}
          </span>
        )}
      </div>
    </div>
  );
}

export default MenuItemCard;