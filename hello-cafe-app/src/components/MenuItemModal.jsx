import { useState, useEffect } from "react";
import { X, Plus, Star, Heart } from "lucide-react";
import FlavorSelector from "./FlavorSelector";
import { shoppingCartAPI } from "../api/shoppingCart";
import { refreshCartCount } from "../hooks/useShoppingCart";
import ToastNotification from "./ToastNotification";
import api from "../api";

function MenuItemModal({ item, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavors, setSelectedFlavors] = useState({});
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFlavorChange = (flavorName, value) => {
    setSelectedFlavors(prev => ({
      ...prev,
      [flavorName]: value
    }));
  };

  const handleAddToCart = async () => {
    // Check if flavors need to be selected but haven't been
    const requiredFlavors = item.flavors || [];
    const hasUnselectedFlavors = requiredFlavors.some(flavor => !selectedFlavors[flavor.name]);

    if (hasUnselectedFlavors) {
      setToast({
        message: "Please select flavors for all required options",
        isVisible: true,
      });
      return;
    }

    setIsAdding(true);
    try {
      // Convert flavor selections to string format
      const flavorString = Object.entries(selectedFlavors)
        .map(([name, value]) => `${name}:${value}`)
        .join(', ');

      // Add to cart multiple times (based on quantity)
      for (let i = 0; i < quantity; i++) {
        const response = await shoppingCartAPI.addItem(
          item.id,
          flavorString,
          null // Not a combo
        );

        if (response.data.code !== 1) {
          throw new Error(response.data.message || "Failed to add to cart");
        }
      }

      setToast({
        message: `${quantity} × ${item.name} added to cart!`,
        isVisible: true,
      });

      await refreshCartCount();

      // Delay closing modal to let user see success message
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error("Error adding item to cart:", error);
      setToast({
        message: error.message || "Failed to add item to cart",
        isVisible: true,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 99));
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const totalPrice = (item.price || 0) * quantity;

  const handleToggleFavorite = async () => {
    try {
      const response = await fetch(`/api/user/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          itemType: 'menu_item',
          itemId: item.id,
          itemName: item.name,
          itemImage: item.image,
          itemPrice: item.price
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.data.isFavorite);
        setToast({
          message: data.data.isFavorite ? `${item.name} added to favorites!` : `${item.name} removed from favorites`,
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setToast({
        message: "Failed to update favorites",
        isVisible: true,
      });
    }
  };

  // Get favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/api/user/favorites/status?itemType=menu_item&itemId=${item.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.data.isFavorite);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [item.id]);

  return (
    <>
      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="relative">
            <img
              src={item.image || "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80"}
              alt={item.name}
              className="w-full h-64 object-cover"
            />
              {/* Favorite Button */}
              <button
                onClick={handleToggleFavorite}
                disabled={isAdding}
                className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavorite
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Item Info */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {item.name}
              </h2>

              {item.description && (
                <p className="text-gray-600 mb-4">
                  {item.description}
                </p>
              )}

              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-amber-600">
                  ${item.price?.toFixed(2) || '0.00'}
                </span>
                {item.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {item.categoryName && (
                <span className="inline-block px-3 py-1 text-sm font-medium text-amber-700 bg-amber-100 rounded-full">
                  {item.categoryName}
                </span>
              )}
            </div>

            {/* Flavor Selection */}
            <FlavorSelector
              flavors={item.flavors || []}
              selectedFlavors={selectedFlavors}
              onFlavorChange={handleFlavorChange}
              disabled={isAdding}
              className="mb-6"
            />

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1 || isAdding}
                  className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −
                </button>
                <div className="w-16 text-center">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(Math.max(val, 1), 99));
                    }}
                    disabled={isAdding}
                    className="w-full text-center text-lg font-medium border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= 99 || isAdding}
                  className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuItemModal;