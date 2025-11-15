import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Clock } from "lucide-react";
import UserLayout from "../layouts/UserLayout";
import api from "../../../api";
import { refreshCartCount } from "../../../hooks/useShoppingCart";
import ToastNotification from "../components/ToastNotification";
import shoppingCartAPI from "../../../api/shoppingCart";

function NewMenuPage() {
  const navigate = useNavigate();
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", isVisible: false });

  // API functions
  const fetchNewItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/menu/newest");
      if (response.data.code === 1) {
        setNewItems(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching new menu items:", error);
      setToast({
        message: "Failed to load new menu items",
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Add item to shopping cart
  const handleAddToCart = async (e, item) => {
    e.stopPropagation();
    try {
      const response = await shoppingCartAPI.addItem(item.id, null, null); // setmealId null for menu item
      if (response.data.code === 1) {
        setToast({
          message: `${item.name} added to cart!`,
          isVisible: true,
        });
        await refreshCartCount();
      } else {
        setToast({
          message: "Failed to add item to cart",
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setToast({
        message: "Error adding item to cart",
        isVisible: true,
      });
    }
  };

  
  useEffect(() => {
    fetchNewItems();
  }, []);

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading new menu items...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate("/user/dashboard")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">What's New</h1>
            <p className="text-lg text-gray-600 mb-2">
              Discover our latest menu additions
            </p>
            <p className="text-sm text-gray-500">
              {newItems.length} new item{newItems.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {/* New Items Grid */}
        {newItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Item Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      NEW
                    </span>
                  </div>
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.categoryName || "Uncategorized"}
                    </p>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-2xl font-bold text-amber-600">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Added {new Date(item.updateTime).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No new items yet
            </h3>
            <p className="text-gray-600 mb-6">
              Check back soon for our latest menu additions!
            </p>
            <button
              onClick={() => navigate("/user/menu")}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Browse Full Menu
            </button>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default NewMenuPage;