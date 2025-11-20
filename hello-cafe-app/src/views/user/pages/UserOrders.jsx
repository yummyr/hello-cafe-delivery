import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import api from "../../../api";
import { formatDateTime } from "@/utils/date";
import Pagination from "../../../components/Pagination";

// Order status constants
const ORDER_STATUS = {
  1: "Pending Payment",
  2: "Awaiting Acceptance",
  3: "Accepted",
  4: "Delivering",
  5: "Completed",
  6: "Cancelled",
};

// Get history orders
const getHistoryOrders = async (page = 1, pageSize = 10, status = null) => {
  try {
    const params = {
      page,
      pageSize,
    };

    if (status !== null) {
      params.status = status;
    }

    const response = await api.get("/user/order/historyOrders", { params });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch history orders:", error);
    throw error;
  }
};

// Get order details
const getOrderDetail = async (orderId) => {
  try {
    const response = await api.get(`/user/order/orderDetail/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw error;
  }
};

// Cancel order
const cancelOrder = async (orderId, reason) => {
  try {
    await api.put(
      `/user/order/cancel/${orderId}?reason=${encodeURIComponent(reason)}`
    );
  } catch (error) {
    console.error("Failed to cancel order:", error);
    throw error;
  }
};

// Repeat order
const repeatOrder = async (orderId) => {
  try {
    const url = `/user/order/repetition/${orderId}`;
      await api.post(url);
  } catch (error) {
    console.error("Failed to repeat order:", error);
    throw error;
  }
};

function UserOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await getHistoryOrders(page, pageSize, statusFilter);
      const ordersData = result.records || [];
      setOrders(ordersData);
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // View order details
  const viewOrderDetail = async (orderId) => {
    try {
      const orderDetail = await getOrderDetail(orderId);
      setSelectedOrder(orderDetail);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {if (isPaymentValid(orderId)) {
         const reason = prompt("Please enter cancellation reason:");
        await cancelOrder(orderId, reason);
      }else{
        await cancelOrder(orderId,"payment timeout");
      }
       
        alert("Order has been cancelled");
        fetchOrders();
      } catch (error) {
        alert(
          "Failed to cancel order: " +
            (error.response?.data?.msg || error.message)
        );
      }
    }
  };

  // Repeat order
  const handleRepeatOrder = async (orderId) => {
    if (!orderId) {
      console.error("Order ID is missing. Cannot repeat order.");
      alert("Order ID is missing. Cannot repeat order.");
      return;
    }
    try {
      await repeatOrder(orderId);
      alert("Items have been added to your cart");
      navigate("/user/cart", { replace: true });
    } catch (error) {
      alert(
        "Failed to repeat order: " +
          (error.response?.data?.msg || error.message)
      );
    }
  };

  // Continue payment
  const handleContinuePayment = async (orderId) => {
    try {
      console.log("🚀 Continuing payment for order:", orderId);

      const orderDetail = await getOrderDetail(orderId);

      const paymentData = {
        orderId: orderId,
        amount: orderDetail.amount,
        deliveryAddress: orderDetail.address || "",
        customerName: orderDetail.addressName || "",
        customerPhone: orderDetail.addressPhone || "",
      };
      console.log("get payment data: ", paymentData);

      navigate("/user/payment", { state: { orderData: paymentData } });

    } catch (error) {
      console.error("❌ Failed to continue payment:", error);
      console.error("❌ Error config:", error.config);
      console.error("❌ Error URL:", error.config?.baseURL + error.config?.url);

      throw error;
    }
  };

  // Check if payment is still valid (within 30 minutes)
  const isPaymentValid = (orderTime) => {
    if (!orderTime) return false;
    const orderDateTime = new Date(orderTime);
    const now = new Date();
    const diffInMinutes = (now - orderDateTime) / (1000 * 60);
    return diffInMinutes < 30;
  };

  // Status filter options
  const statusOptions = [
    { value: null, label: "All" },
    { value: 1, label: "Pending Payment" },
    { value: 2, label: "Awaiting to Acceptance" },
    { value: 3, label: "Accepted" },
    { value: 4, label: "Delivering" },
    { value: 5, label: "Completed" },
    { value: 6, label: "Cancelled" },
  ];

  // Get action buttons
  const getActionButtons = (order) => {
    const buttons = [];

    // Different operations based on order status

    // Add continue payment button if within 30 minutes
    if (isPaymentValid(order.orderTime) && order.status === 1) {
      buttons.push(
        <button
          key="continuePayment"
          onClick={() => handleContinuePayment(order.id)}
          className="text-[#2E7D32] hover:text-[#1B5E20] text-sm font-medium ml-3 transition-colors"
        >
          Continue Payment
        </button>
      );
    } else if (order.status === 1 || order.status === 2) {
      buttons.push(
        <button
          key="cancel"
          onClick={() => handleCancelOrder(order.id)}
          className="text-[#A67B5B] hover:text-[#8B5A3C] text-sm font-medium ml-3 transition-colors"
        >
          Cancel Order
        </button>
      );
    } else if (order.status === 4 || order.status === 5) {
      buttons.push(
        <button
          key="repeat"
          onClick={() => handleRepeatOrder(order.id)}
          className="text-[#8B7355] hover:text-[#6B5637] text-sm font-medium ml-3 transition-colors"
        >
          Order Again
        </button>
      );
    }

    return buttons;
  };

  useEffect(() => {
    fetchOrders();
  }, [page, pageSize, statusFilter]);

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#E5D4C1] p-6">
          <h1 className="text-3xl font-bold text-[#4A4A4A] mb-6 flex items-center">
            <span className="mr-3">📋</span> My Orders
          </h1>

          {/* Status Filter */}
          <div className="mb-8">
            <span className="text-[#6B5B4A] font-medium mb-3 block">
              Filter by Status:
            </span>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    statusFilter === option.value
                      ? "bg-[#8B6F47] text-white shadow-md"
                      : "bg-[#F5EDE0] text-[#6B5B4A] hover:bg-[#E8D5C0] border border-[#E5D4C1]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-[#8B7355]">Loading orders...</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[#8B7355]">No orders found</div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                console.log("🚀 Rendering order:", order);
                console.log("🚀 Order ID:", order.id, "Type:", typeof order.id);
                return (
                <div
                  key={order.id}
                  className="bg-[#FDFBF7] rounded-lg border border-[#E5D4C1] p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm text-[#6B5B4A] font-medium">
                        Order #: {order.number} 
                      </div>
                      <div className="text-sm text-[#8B7355] mt-1">
                        Order Time: {formatDateTime(order.orderTime)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 5
                            ? "bg-[#D4E4D4] text-[#2D5016]"
                            : order.status === 6
                            ? "bg-[#F5D6D6] text-[#8B2A2A]"
                            : order.status === 4
                            ? "bg-[#D6E5F5] text-[#1E3A8A]"
                            : "bg-[#F4E4D4] text-[#8B4513]"
                        }`}
                      >
                        {ORDER_STATUS[order.status] || "Unknown Status"}
                      </span>
                    
                      <div className="mt-2 text-xl font-bold text-[#4A4A4A]">
                        ${order.amount?.toFixed(2) || "0.00"}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-[#6B5B4A]">
                      <span className="font-medium">Delivery Address:</span>{" "}
                      {order.address} |
                      <span className="font-medium"> Phone:</span>{" "}
                      {order.addressPhone}
                    </div>
                    {order.estimatedDeliveryTime && (
                      <div className="text-sm text-[#8B7355] mt-1">
                        <span className="font-medium">Estimated Delivery:</span>{" "}
                        {formatDateTime(order.estimatedDeliveryTime)}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end items-center space-x-3">
                    <button
                      key="detail"
                      onClick={() => viewOrderDetail(order.id)}
                      className="text-[#8B6F47] hover:text-[#6B5637] text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                    {getActionButtons(order)}
                  </div>
                </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            totalItems={total}
            pageSize={pageSize}
            currentPage={page}
            onPageChange={(p) => {
              setPage(p);
            }}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1); // reset to first page
            }}
            showInfo={true}
          />
        </div>

        {/* Order Details Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[#E5D4C1]">
              <div className="sticky top-0 bg-white border-b border-[#E5D4C1] p-6 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#4A4A4A] flex items-center">
                    <span className="mr-2">📦</span> Order Details
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-[#8B7355] hover:text-[#4A4A4A] text-2xl leading-none transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-[#FDFBF7] rounded-lg p-4 border border-[#E5D4C1]">
                  <h3 className="font-semibold text-[#4A4A4A] mb-3 flex items-center">
                    <span className="mr-2">ℹ️</span> Order Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-[#6B5B4A]">
                        Order #:
                      </span>{" "}
                      {selectedOrder.orderNo}
                    </div>
                    <div>
                      <span className="font-medium text-[#6B5B4A]">
                        Status:
                      </span>{" "}
                      {ORDER_STATUS[selectedOrder.status]}
                    </div>
                    <div>
                      <span className="font-medium text-[#6B5B4A]">
                        Order Time:
                      </span>{" "}
                      {formatDateTime(selectedOrder.orderTime)}
                    </div>
                    <div>
                      <span className="font-medium text-[#6B5B4A]">
                        Amount:
                      </span>{" "}
                      ${selectedOrder.amount?.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium text-[#6B5B4A]">
                        Payment Method:
                      </span>{" "}
                      {selectedOrder.payMethod === 1 ? "Credit Card" : "PayPal"}
                    </div>
                    <div>
                      <span className="font-medium text-[#6B5B4A]">
                        Payment Status:
                      </span>{" "}
                      {selectedOrder.payStatus === 0
                        ? "Unpaid"
                        : selectedOrder.payStatus === 1
                        ? "Paid"
                        : "Refunded"}
                    </div>
                  </div>
                </div>

                <div className="bg-[#FDFBF7] rounded-lg p-4 border border-[#E5D4C1]">
                  <h3 className="font-semibold text-[#4A4A4A] mb-3 flex items-center">
                    <span className="mr-2">📍</span> Delivery Information
                  </h3>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium text-[#6B5B4A]">
                        Recipient:
                      </span>{" "}
                      {selectedOrder.addressName}
                    </div>
                    <div>
                      <span className="font-medium text-[#6B5B4A]">Phone:</span>{" "}
                      {selectedOrder.addressPhone}
                    </div>
                    <div>
                      <span className="font-medium text-[#6B5B4A]">
                        Address:
                      </span>{" "}
                      {selectedOrder.address}
                    </div>
                  </div>
                </div>

                <div className="bg-[#FDFBF7] rounded-lg p-4 border border-[#E5D4C1]">
                  <h3 className="font-semibold text-[#4A4A4A] mb-3 flex items-center">
                    <span className="mr-2">🍽️</span> Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-[#E5D4C1]"
                      >
                        <div className="flex-1">
                          {item.name && (
                            <div className="font-medium text-[#4A4A4A]">
                              {item.name}
                            </div>
                          )}
                          {item.flavor && Array.isArray(item.flavor) && item.flavor.length > 0 && (
                            <div className="text-[#8B7355] mt-1">
                              Flavors: {item.flavor.map(f => f.name || f.value || '').filter(Boolean).join(', ')}
                            </div>
                        )}
                          <div className="text-[#8B7355] mt-1">
                            Quantity: {item.quantity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-[#4A4A4A]">
                            ${item.quantity * item.unitPrice?.toFixed(2)}
                          </div>
                          <div className="text-[#8B7355] text-xs">
                            Unit Price: ${item.unitPrice?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.cancelReason && (
                  <div className="bg-[#F5D6D6] rounded-lg p-4 border border-[#D4A5A5]">
                    <h3 className="font-semibold text-[#8B2A2A] mb-2 flex items-center">
                      <span className="mr-2">🚫</span> Cancellation Reason
                    </h3>
                    <div className="text-sm text-[#8B2A2A]">
                      {selectedOrder.cancelReason}
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-[#E5D4C1] p-6 rounded-b-xl">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    {selectedOrder.status === 1 &&
                      isPaymentValid(selectedOrder.orderTime) && (
                        <button
                          onClick={() => {
                            handleContinuePayment(selectedOrder.id);
                            setShowDetailModal(false);
                          }}
                          className="px-6 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors duration-200 font-medium"
                        >
                          Continue Payment
                        </button>
                      )}
                    {(selectedOrder.status === 1 ||
                      selectedOrder.status === 2) && (
                      <button
                        onClick={() => {
                          handleCancelOrder(selectedOrder.id);
                          setShowDetailModal(false);
                        }}
                        className="px-6 py-2 bg-[#A67B5B] text-white rounded-lg hover:bg-[#8B5A3C] transition-colors duration-200 font-medium"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-3">
                  
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-6 py-2 bg-[#8B6F47] text-white rounded-lg hover:bg-[#6B5637] transition-colors duration-200 font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default UserOrders;
