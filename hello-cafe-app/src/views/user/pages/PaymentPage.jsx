import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import UserLayout from "../layouts/UserLayout";
import ToastNotification from "../components/ToastNotification";
import api from "../../../api";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import shoppingCartAPI from "../../../api/shoppingCart";

// Initialize Stripe 
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY );

function PaymentForm({ orderData, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent on backend
      const response = await api.post("/payment/create-payment-intent", {
        amount: Math.round(orderData.amount * 100), // Convert to cents
        currency: "usd",
        orderId: orderData.orderId,
      });

      if (response.data.code !== 1) {
        throw new Error(response.data.message || "Failed to create payment intent");
      }

      const { clientSecret } = response.data.data;

      // Confirm payment with client secret
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: orderData.customerName || "Customer",
            email: orderData.customerEmail || "",
          },
        },
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status === "succeeded") {
        // Update order status on backend
        await api.post(`/payment/confirm-payment`, {
          paymentIntentId: paymentIntent.id,
        });

        onSuccess({
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
        });
        shoppingCartAPI.clearCart();
      } else {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed");
      onError(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Element */}
      <div className="bg-white p-4 border border-gray-300 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
        <Lock className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-600">
          Your payment information is secure and encrypted
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={processing || !stripe || !elements}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay ${orderData.amount.toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
}

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Get order data from location state
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
      setLoading(false);
    } else {
      // No order data, redirect to cart
      setToast({
        message: "No order data found. Please start over.",
        isVisible: true,
      });
      setTimeout(() => {
        navigate("/user/cart");
      }, 2000);
    }
  }, [location.state, navigate]);

  const handlePaymentSuccess = (paymentResult) => {
    setPaymentSuccess(true);
    setToast({
      message: "Payment successful! Your order has been placed.",
      isVisible: true,
    });

    // Clear cart after successful payment
    localStorage.removeItem("cartItems");

    // Navigate to orders page after delay
    setTimeout(() => {
      navigate("/user/orders");
    }, 3000);
  };

  const handlePaymentError = (errorMessage) => {
    setToast({
      message: errorMessage,
      isVisible: true,
    });
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-amber-600">Loading payment page...</div>
        </div>
      </UserLayout>
    );
  }

  if (!orderData) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Order data not found</div>
        </div>
      </UserLayout>
    );
  }

  if (paymentSuccess) {
    return (
      <UserLayout>
        <ToastNotification
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={() => setToast({ ...toast, isVisible: false })}
        />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your order has been placed and will be delivered soon.
            </p>
            <button
              onClick={() => navigate("/user/orders")}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              View My Orders
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <ToastNotification
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/user/checkout")}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Checkout
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Payment</h1>
            <p className="text-gray-600 mt-1">Complete your secure payment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
              </div>

              <Elements stripe={stripePromise}>
                <PaymentForm
                  orderData={orderData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

              {/* Order Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">#{orderData.orderId}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-800">
                    <span>Total Amount</span>
                    <span className="text-amber-600">${orderData.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {orderData.deliveryAddress && (
                <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                  <h3 className="text-sm font-medium text-amber-800 mb-2">Delivery Address:</h3>
                  <div className="text-sm text-gray-700">
                    {orderData.deliveryAddress}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              {orderData.customerPhone && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Contact Information:</h3>
                  <div className="text-sm text-gray-700">
                    {orderData.customerName && <div>{orderData.customerName}</div>}
                    {orderData.customerPhone && <div>{orderData.customerPhone}</div>}
                    {orderData.customerEmail && <div>{orderData.customerEmail}</div>}
                  </div>
                </div>
              )}

              {/* Security Information */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-800">Secure Payment</span>
                </div>
                <p className="text-xs text-gray-600">
                  Your payment information is processed securely through Stripe. We never store your credit card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default PaymentPage;