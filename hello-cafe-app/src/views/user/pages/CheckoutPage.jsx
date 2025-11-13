import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  MapPin,
  CreditCard,
  Check,
  AlertCircle,
  Clock,
  DollarSign,
  User,
} from "lucide-react";
import UserLayout from "../layouts/UserLayout";
import api from "../../../api";
import { shoppingCartAPI } from "../../../api/shoppingCart";
import ToastNotification from "../../../components/ToastNotification";

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [orderNotes, setOrderNotes] = useState("");
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [estimatedDelivery, setEstimatedDelivery] = useState("30-40 minutes");

  // Get cart data from location state or fetch from API
  const getCartData = async () => {
    try {
      if (location.state?.cartItems) {
        // Use cart data passed from ShoppingCartPage
        setCartItems(location.state.cartItems);
        setLoading(false);
      } else {
        // Fallback: fetch from API
        const response = await shoppingCartAPI.getCart();
        if (response.data.code === 1) {
          setCartItems(response.data.data || []);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to load cart data:", error);
      setToast({
        message: "Failed to load cart data",
        isVisible: true,
      });
      setLoading(false);
    }
  };

  // Fetch user addresses
  const fetchAddresses = async () => {
    try {
      const response = await api.get("/user/addressBook/list");
      if (response.data.code === 1 && response.data.data) {
        setAddresses(response.data.data);
        // Set default address if available
        const defaultAddr = response.data.data.find(addr => addr.isDefault === 1);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr.id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  useEffect(() => {
    getCartData();
    fetchAddresses();
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.unitPrice * item.quantity);
  }, 0);

  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = 2.99;
  const total = subtotal + tax + deliveryFee;

  // Handle checkout
  const handleCheckout = async () => {
    if (!selectedAddress) {
      setToast({
        message: "Please select a delivery address",
        isVisible: true,
      });
      return;
    }

    if (cartItems.length === 0) {
      setToast({
        message: "Your cart is empty",
        isVisible: true,
      });
      return;
    }

    setProcessing(true);
    try {
      // Create order data
      const orderData = {
        addressId: selectedAddress,
        paymentMethod: paymentMethod,
        orderNotes: orderNotes,
        items: cartItems.map(item => ({
          menuItemId: item.menuItemId,
          comboId: item.comboId,
          quantity: item.quantity,
          flavor: item.flavor,
          unitPrice: item.unitPrice
        })),
        totalAmount: total,
        deliveryFee: deliveryFee,
        tax: tax
      };

      // Submit order (assuming there's an order creation API)
      const response = await api.post("/user/order", orderData);

      if (response.data.code === 1) {
        // Clear cart after successful order
        await shoppingCartAPI.clearCart();

        setToast({
          message: "Order placed successfully!",
          isVisible: true,
        });

        // Navigate to order confirmation or orders page
        setTimeout(() => {
          navigate("/user/orders");
        }, 2000);
      } else {
        setToast({
          message: response.data.message || "Failed to place order",
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      setToast({
        message: "Failed to place order. Please try again.",
        isVisible: true,
      });
    } finally {
      setProcessing(false);
    }
  };

  const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-amber-600">Loading checkout...</div>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/user/cart")}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
            <p className="text-gray-600 mt-1">Review your order and complete payment</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
            <button
              onClick={() => navigate("/user/menu")}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Delivery Address</h2>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No delivery addresses found</p>
                    <button
                      onClick={() => navigate("/user/addresses")}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={(e) => setSelectedAddress(Number(e.target.value))}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {address.name}
                            {address.isDefault === 1 && (
                              <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {address.phone}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {address.address}, {address.city}, {address.state} {address.zipcode}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Order Items</h2>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center gap-4 py-3 border-b last:border-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{item.name}</div>
                        {item.flavor && (
                          <div className="text-sm text-gray-600">Flavor: {item.flavor}</div>
                        )}
                        <div className="text-sm text-amber-600">
                          ${item.unitPrice?.toFixed(2)} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium text-gray-800">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Credit Card</div>
                        <div className="text-sm text-gray-600">Visa, Mastercard, Amex</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="debit_card"
                      checked={paymentMethod === "debit_card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Debit Card</div>
                        <div className="text-sm text-gray-600">Direct payment from bank account</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Order Notes</h2>
                </div>

                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Special instructions for your order..."
                  className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={3}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

                {/* Delivery Info */}
                {selectedAddressData && (
                  <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">Deliver to:</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      {selectedAddressData.address}, {selectedAddressData.city}
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-800">
                      <span>Total</span>
                      <span className="text-amber-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-800">Estimated Delivery</div>
                    <div className="text-xs text-gray-600">{estimatedDelivery}</div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!selectedAddress || processing}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Place Order
                    </>
                  )}
                </button>

                {!selectedAddress && (
                  <p className="text-sm text-red-600 mt-2 text-center">
                    Please select a delivery address
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default CheckoutPage;