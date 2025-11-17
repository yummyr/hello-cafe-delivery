import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, X, ShoppingCart, Star } from "lucide-react";
import UserLayout from "../layouts/UserLayout";
import api from "../../../api/index";
import { refreshCartCount } from "../../../hooks/useShoppingCart";
import ToastNotification from "../components/ToastNotification";
import shoppingCartAPI from "../../../api/shoppingCart";
import favoritesAPI from "../../../api/favorites";

// Menu API functions to get current prices
const menuAPI = {
  // Get all menu items
  getAllMenuItems: () => {
    return api.get("/user/menu/all");
  },

  // Get all combos
  getAllCombos: () => {
    return api.get("/user/combo/page",{
      params: {
        page: 1,
        pageSize: 10
      }
    });
  },
};

function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [addingToCart, setAddingToCart] = useState(new Set());

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesAPI.getUserFavorites();
      if (response.data.code === 1) {
        // Remove duplicates based on itemType and itemId combination
        let uniqueFavorites = Array.from(
          new Map(
            (response.data.data || []).map((item) => [
              `${item.itemType}-${item.itemId}`,
              item,
            ])
          ).values()
        );

        console.log("Favorites data:", uniqueFavorites); // Debug log to see the data structure

        // Fetch current prices and images for items without them
        const itemsNeedingUpdate = uniqueFavorites.filter(
          (item) =>
            (!item.itemPrice && !item.price) || (!item.itemImage && !item.image)
        );

        if (itemsNeedingUpdate.length > 0) {
          console.log(
            "Fetching prices and images for items needing updates:",
            itemsNeedingUpdate.map(
              (item) => `${item.itemName} (${item.itemType}-${item.itemId})`
            )
          );
          try {
            // Get menu items and combos to update prices
            const [menuResponse, comboResponse] = await Promise.all([
              menuAPI.getAllMenuItems(),
              menuAPI.getAllCombos(),
            ]);

            console.log("Menu API response:", menuResponse.data);
            console.log("Combo API response:", comboResponse.data);

            const menuItems =
              menuResponse.data.code === 1 ? menuResponse.data.data || [] : [];
            const combos =
              comboResponse.data.code === 1
                ? comboResponse.data.data || []
                : [];

            console.log("Menu items:", menuItems);
            console.log("Combos:", combos);

            // Create price and image lookup maps
            const menuInfoMap = new Map(
              menuItems.map((item) => [
                item.id,
                { price: item.price, image: item.image },
              ])
            );
            const comboInfoMap = new Map(
              combos.map((combo) => [
                combo.id,
                { price: combo.price, image: combo.image },
              ])
            );

            console.log("Menu info map:", menuInfoMap);
            console.log("Combo info map:", comboInfoMap);

            // Update favorites with current prices and images
            uniqueFavorites = uniqueFavorites.map((item) => {
              let updatedItem = { ...item };

              if (
                item.itemType === "menu_item" &&
                menuInfoMap.has(item.itemId)
              ) {
                const menuInfo = menuInfoMap.get(item.itemId);
                if (!item.itemPrice && !item.price) {
                  console.log(
                    `Updating price for ${item.itemName}: ${menuInfo.price}`
                  );
                  updatedItem.itemPrice = menuInfo.price;
                }
                if (!item.itemImage && !item.image) {
                  console.log(
                    `Updating image for ${item.itemName}: ${menuInfo.image}`
                  );
                  updatedItem.itemImage = menuInfo.image;
                }
              } else if (
                item.itemType === "combo" &&
                comboInfoMap.has(item.itemId)
              ) {
                const comboInfo = comboInfoMap.get(item.itemId);
                if (!item.itemPrice && !item.price) {
                  console.log(
                    `Updating price for combo ${item.itemName}: ${comboInfo.price}`
                  );
                  updatedItem.itemPrice = comboInfo.price;
                }
                if (!item.itemImage && !item.image) {
                  console.log(
                    `Updating image for combo ${item.itemName}: ${comboInfo.image}`
                  );
                  updatedItem.itemImage = comboInfo.image;
                }
              } else {
                console.warn(
                  `Info not found for ${item.itemName} (${item.itemType}-${item.itemId})`
                );
              }

              return updatedItem;
            });
          } catch (updateError) {
            console.warn(
              "Failed to fetch current prices and images:",
              updateError
            );
          }
        }

        setFavorites(uniqueFavorites);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setToast({
        message: "Failed to load favorites",
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (itemType, itemId, itemName) => {
    try {
      const favoriteData = {
        itemType,
        itemId,
        itemName,
      };

      const response = await favoritesAPI.toggleFavorite(favoriteData);
      if (response.data.code === 1) {
        setFavorites((prev) =>
          prev.filter(
            (fav) => !(fav.itemType === itemType && fav.itemId === itemId)
          )
        );
        setToast({
          message: `${itemName} removed from favorites`,
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      setToast({
        message: "Failed to remove from favorites",
        isVisible: true,
      });
    }
  };

  const handleAddToCart = async (item) => {
    if (addingToCart.has(`${item.itemType}-${item.itemId}`)) {
      return;
    }

    setAddingToCart((prev) =>
      new Set(prev).add(`${item.itemType}-${item.itemId}`)
    );

    try {
      if (item.itemType === "menu_item") {
        const response = await shoppingCartAPI.addItem(item.itemId, null, null);
        if (response.data.code === 1) {
          setToast({
            message: `${item.itemName} added to cart!`,
            isVisible: true,
          });
          await refreshCartCount();
        }
      } else if (item.itemType === "combo") {
        const response = await shoppingCartAPI.addItem(null, null, item.itemId);
        if (response.data.code === 1) {
          setToast({
            message: `${item.itemName} added to cart!`,
            isVisible: true,
          });
          await refreshCartCount();
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setToast({
        message: "Failed to add to cart",
        isVisible: true,
      });
    } finally {
      setAddingToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`${item.itemType}-${item.itemId}`);
        return newSet;
      });
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear all favorites?")) {
      try {
        const response = await favoritesAPI.clearFavorites();
        if (response.data.code === 1) {
          setFavorites([]);
          setToast({
            message: "All favorites cleared",
            isVisible: true,
          });
        }
      } catch (error) {
        console.error("Error clearing favorites:", error);
        setToast({
          message: "Failed to clear favorites",
          isVisible: true,
        });
      }
    }
  };

  return (
    <UserLayout>
      <ToastNotification
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Favorites
                </h1>
                <p className="text-gray-600 mt-2">
                  {favorites.length} {favorites.length === 1 ? "item" : "items"}{" "}
                  in your favorites
                </p>
              </div>

              {favorites.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {favorites.length === 0 ? (
                <div className="text-center py-20">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start adding your favorite menu items and combos!
                  </p>
                  <button
                    onClick={() => navigate("/user/menu")}
                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                /* Favorites Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((item, index) => (
                    <div
                      key={`${item.itemType}-${item.itemId}-${index}`}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                    >
                      {/* Item Image */}
                      <div className="relative">
                        <img
                          src={
                            item.itemImage ||
                            item.image ||
                            "/assets/default-no-img.png"
                          }
                          alt={item.itemName}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "/assets/default-no-img.png";
                          }}
                        />

                        {/* Remove Favorite Button */}
                        <button
                          onClick={() =>
                            handleRemoveFavorite(
                              item.itemType,
                              item.itemId,
                              item.itemName
                            )
                          }
                          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      {/* Item Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {item.itemName}
                        </h3>

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-bold text-amber-600">
                            {(() => {
                              const price = item.itemPrice || item.price;
                              if (price && price > 0) {
                                return `$${Number(price).toFixed(2)}`;
                              } else {
                                return (
                                  <span className="text-sm text-gray-500 italic">
                                    Price not available
                                  </span>
                                );
                              }
                            })()}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={addingToCart.has(
                            `${item.itemType}-${item.itemId}`
                          )}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingToCart.has(
                            `${item.itemType}-${item.itemId}`
                          ) ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </UserLayout>
  );
}

export default FavoritesPage;
