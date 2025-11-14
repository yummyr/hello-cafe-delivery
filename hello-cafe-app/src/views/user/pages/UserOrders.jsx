import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import api from "../../../api";
import { formatDateTime } from "@/utils/date";

// Order status constants
const ORDER_STATUS = {
  PENDING_PAYMENT: 1,
  PENDING: 2,
  PROCESSING: 3,
  DELIVERED: 4,
  COMPLETED: 5,
  CANCELLED: 6,
};

const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING_PAYMENT]: "Pending Payment",
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.PROCESSING]: "Processing",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.COMPLETED]: "Completed",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
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
const cancelOrder = async (orderId) => {
  try {
    await api.put(`/user/order/cancel/${orderId}`);
  } catch (error) {
    console.error("Failed to cancel order:", error);
    throw error;
  }
};

// Repeat order
const repeatOrder = async (orderId) => {
  try {
    await api.post(`/user/order/repetition/${orderId}`);
  } catch (error) {
    console.error("Failed to repeat order:", error);
    throw error;
  }
};

// Send reminder for order
const reminderOrder = async (orderId) => {
  try {
    await api.get(`/user/order/reminder/${orderId}`);
  } catch (error) {
    console.error("Failed to send reminder:", error);
    throw error;
  }
};

function UserOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await getHistoryOrders(currentPage, 10, statusFilter);
      setOrders(result.records || []);
      setTotalPages(Math.ceil(result.total / result.pageSize));
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
      try {
        await cancelOrder(orderId);
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
    try {
      await repeatOrder(orderId);
      alert("Items have been added to your cart");
      navigate("/cart");
    } catch (error) {
      alert(
        "Failed to repeat order: " +
          (error.response?.data?.msg || error.message)
      );
    }
  };

  // Reminder order
  const handleReminderOrder = async (orderId) => {
    try {
      await reminderOrder(orderId);
      alert("Reminder sent successfully, please wait patiently");
    } catch (error) {
      alert(
        "Failed to send reminder: " +
          (error.response?.data?.msg || error.message)
      );
    }
  };

  // Status filter options
  const statusOptions = [
    { value: null, label: "All" },
    { value: ORDER_STATUS.PENDING_PAYMENT, label: "Pending Payment" },
    { value: ORDER_STATUS.PENDING, label: "Pending" },
    { value: ORDER_STATUS.PROCESSING, label: "Processing" },
    { value: ORDER_STATUS.DELIVERED, label: "Delivered" },
    { value: ORDER_STATUS.COMPLETED, label: "Completed" },
    { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
  ];

  // Get action buttons
  const getActionButtons = (order) => {
    const buttons = [];

    // View details button
    buttons.push(
      <button
        key="detail"
        onClick={() => viewOrderDetail(order.id)}
        className="text-[#8B6F47] hover:text-[#6B5637] text-sm font-medium transition-colors"
      >
        View Details
      </button>
    );

    // Different operations based on order status
    switch (order.status) {
      case ORDER_STATUS.PENDING_PAYMENT:
      case ORDER_STATUS.PENDING:
        buttons.push(
          <button
            key="cancel"
            onClick={() => handleCancelOrder(order.id)}
            className="text-[#A67B5B] hover:text-[#8B5A3C] text-sm font-medium ml-3 transition-colors"
          >
            Cancel Order
          </button>
        );
        break;
      case ORDER_STATUS.PROCESSING:
        buttons.push(
          <button
            key="reminder"
            onClick={() => handleReminderOrder(order.id)}
            className="text-[#D4A574] hover:text-[#B8935F] text-sm font-medium ml-3 transition-colors"
          >
            Send Reminder
          </button>
        );
        break;
      case ORDER_STATUS.COMPLETED:
        buttons.push(
          <button
            key="repeat"
            onClick={() => handleRepeatOrder(order.id)}
            className="text-[#8B7355] hover:text-[#6B5637] text-sm font-medium ml-3 transition-colors"
          >
            Order Again
          </button>
        );
        break;
    }

    return buttons;
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

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
                    setCurrentPage(1);
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
              {orders.map((order) => (
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
                          order.status === ORDER_STATUS.COMPLETED
                            ? "bg-[#D4E4D4] text-[#2D5016]"
                            : order.status === ORDER_STATUS.CANCELLED
                            ? "bg-[#F5D6D6] text-[#8B2A2A]"
                            : order.status === ORDER_STATUS.DELIVERED
                            ? "bg-[#D6E5F5] text-[#1E3A8A]"
                            : "bg-[#F4E4D4] text-[#8B4513]"
                        }`}
                      >
                        {ORDER_STATUS_TEXT[order.status] || "Unknown Status"}
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
                      <span className="font-medium"> Phone:</span> {order.addressPhone}
                    </div>
                    {order.estimatedDeliveryTime && (
                      <div className="text-sm text-[#8B7355] mt-1">
                        <span className="font-medium">Estimated Delivery:</span>{" "}
                        {formatDateTime(order.estimatedDeliveryTime)}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end items-center space-x-3">
                    {getActionButtons(order)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#F5EDE0] text-[#6B5B4A] rounded-lg border border-[#E5D4C1] disabled:bg-[#E5D4C1] disabled:text-[#A0A0A0] hover:bg-[#E8D5C0] transition-colors duration-200"
              >
                Previous
              </button>
              <span className="text-sm text-[#6B5B4A] font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#F5EDE0] text-[#6B5B4A] rounded-lg border border-[#E5D4C1] disabled:bg-[#E5D4C1] disabled:text-[#A0A0A0] hover:bg-[#E8D5C0] transition-colors duration-200"
              >
                Next
              </button>
            </div>
          )}
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
                      {selectedOrder.number}
                    </div>
                    <div>
                      <span className="font-medium text-[#6B5B4A]">
                        Status:
                      </span>{" "}
                      {ORDER_STATUS_TEXT[selectedOrder.status]}
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
                      {selectedOrder.payMethod === 1 ? "WeChat Pay" : "Alipay"}
                    </div>
                    <div>
                      <span className="font-medium text-[#6B5B4A]">
                        Payment Status:
                      </span>{" "}
                      {selectedOrder.payStatus === 1 ? "Paid" : "Unpaid"}
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
                    {selectedOrder.orderDetailList?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-[#E5D4C1]"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-[#4A4A4A]">
                            {item.name}
                          </div>
                          {item.dishFlavor && (
                            <div className="text-[#8B7355] mt-1">
                              Flavor: {item.dishFlavor}
                            </div>
                          )}
                          <div className="text-[#8B7355] mt-1">
                            Quantity: {item.number}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-[#4A4A4A]">
                            ${item.amount?.toFixed(2)}
                          </div>
                          <div className="text-[#8B7355] text-xs">
                            Unit Price: ${item.unitPrice?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.rejectionReason && (
                  <div className="bg-[#F5D6D6] rounded-lg p-4 border border-[#D4A5A5]">
                    <h3 className="font-semibold text-[#8B2A2A] mb-2 flex items-center">
                      <span className="mr-2">❌</span> Rejection Reason
                    </h3>
                    <div className="text-sm text-[#8B2A2A]">
                      {selectedOrder.rejectionReason}
                    </div>
                  </div>
                )}

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
                <div className="flex justify-end">
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
        )}
      </div>
    </UserLayout>
  );
}

export default UserOrders;
