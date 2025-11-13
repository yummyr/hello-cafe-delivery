import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Check,
} from "lucide-react";
import UserLayout from "../layouts/UserLayout";
import { shoppingCartAPI } from "../../../api/shoppingCart";
import { refreshCartCount } from "../../../hooks/useShoppingCart";
import ToastNotification from "../../../components/ToastNotification";

function ShoppingCartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [toast, setToast] = useState({ message: "", isVisible: false });

  // 获取购物车数据
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await shoppingCartAPI.getCart();
      if (response.data.code === 1) {
        setCartItems(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setToast({
        message: "Failed to load shopping cart",
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 增加商品数量
  const handleIncreaseQuantity = async (item) => {
    const itemId = item.id;
    setUpdatingItems((prev) => new Set([...prev, itemId]));

    try {
      const response = await shoppingCartAPI.addItem(
        item.menuItemId,
        item.flavor,
        item.comboId
      );
      if (response.data.code === 1) {
        await fetchCart(); // 重新获取购物车数据
        await refreshCartCount(); // 更新顶部购物车数量
      } else {
        setToast({
          message: "Failed to update quantity",
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
      setToast({
        message: "Error updating quantity",
        isVisible: true,
      });
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // 减少商品数量
  const handleDecreaseQuantity = async (item) => {
    const itemId = item.id;
    setUpdatingItems((prev) => new Set([...prev, itemId]));

    try {
      const response = await shoppingCartAPI.removeItem(
        item.menuItemId,
        item.flavor,
        item.comboId
      );
      if (response.data.code === 1) {
        await fetchCart(); // 重新获取购物车数据
        await refreshCartCount(); // 更新顶部购物车数量
      } else {
        setToast({
          message: "Failed to update quantity",
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      setToast({
        message: "Error updating quantity",
        isVisible: true,
      });
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // 清空购物车
  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your shopping cart?")) {
      try {
        const response = await shoppingCartAPI.clearCart();
        if (response.data.code === 1) {
          setToast({
            message: "Shopping cart cleared",
            isVisible: true,
          });
          await fetchCart();
          await refreshCartCount(); // 更新顶部购物车数量
        } else {
          setToast({
            message: "Failed to clear cart",
            isVisible: true,
          });
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
        setToast({
          message: "Error clearing cart",
          isVisible: true,
        });
      }
    }
  };

  // 计算总价
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.unitPrice * item.quantity);
    }, 0);
  };

  const total = calculateTotal();

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <UserLayout>
      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/user/dashboard")}
              className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="w-8 h-8 text-amber-600" />
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cart
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-amber-600">Loading your shopping cart...</div>
          </div>
        ) : cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
              <ShoppingCart className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate("/user/dashboard")}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          // Cart Items
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
            <div className="p-6 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-amber-50 last:border-0 last:pb-0"
                >
                  {/* Item Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || "/api/placeholder/80/80"}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover bg-amber-50"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {item.name}
                    </h3>
                    {item.flavor && (
                      <p className="text-sm text-amber-600 mb-2">
                        Flavor: {item.flavor}
                      </p>
                    )}
                    <p className="text-lg font-medium text-amber-700">
                      ${parseFloat(item.unitPrice).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-1">
                      <button
                        onClick={() => handleDecreaseQuantity(item)}
                        disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                        className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-amber-600 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-12 text-center font-medium text-gray-800">
                        {updatingItems.has(item.id) ? "..." : item.quantity}
                      </span>

                      <button
                        onClick={() => handleIncreaseQuantity(item)}
                        disabled={updatingItems.has(item.id)}
                        className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-amber-600 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Item Subtotal */}
                    <div className="text-right min-w-[80px]">
                      <p className="text-lg font-semibold text-gray-800">
                        ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary and Checkout */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-t border-amber-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-gray-800">
                    ${total.toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/user/dashboard")}
                    className="px-6 py-3 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors font-medium"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => navigate("/user/checkout", { state: { cartItems } })}
                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default ShoppingCartPage;