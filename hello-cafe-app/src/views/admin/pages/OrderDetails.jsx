import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Truck,
  CheckSquare,
  Clock,
  User,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../../../api";

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    orderNo: "",
    orderTime: "",
    userName: "",
    phone: "",
    payStatus: 0,
    status: 0,
    address: "",
    paymentMethod: 0,
    orderItems: [],
  });
  const [loading, setLoading] = useState(false);
  const [tax, setTax] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [operation,setOperation] = useState({
    id:id,
    reason:""
  });

  const getActionButtons = (order) => {
    switch (order.status) {
      case 2: // awaiting acceptance
        return (
          <>
            <button
              onClick={() => handleConfirm(id)}
              className="text-green-600 hover:text-green-800 mr-2"
              title="Confirm"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleReject(id)}
              className="text-red-600 hover:text-red-800 mr-2"
              title="Reject"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </>
        );
      case 3: // Accepted
        return (
          <button
            onClick={() => handleDeliver(id)}
            className="text-blue-600 hover:text-blue-800"
            title="Start Delivery"
          >
            <Truck className="w-5 h-5" />
          </button>
        );
      case 4: // Delivering
        return (
          <button
            onClick={() => handleComplete(id)}
            className="text-green-600 hover:text-green-800"
            title="Complete"
          >
            <CheckSquare className="w-5 h-5" />
          </button>
        );
      default:
        return null;
    }
  };





  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async (orderId) => {
    try {
      console.log("Fetching order details...");
      setLoading(true);
      const response = await api.get(`/admin/orders/details/${id}`);
      if (response.data.code === 1 && response.data.data) {
        console.log("Order details fetched successfully:", response.data.data);
        const orderDetail = response.data.data;
        console.log("paymentMethod:", orderDetail.payMethod);

        setOrder({
          orderNo: orderDetail.orderNo,
          orderTime: orderDetail.orderTime,
          userName: orderDetail.userName,
          phone: orderDetail.phone,
          payStatus: orderDetail.payStatus,
          status: orderDetail.status,
          paymentMethod: orderDetail.payMethod,
          address: orderDetail.address,
          orderItems: orderDetail.orderItems,
        });
        if (orderDetail.orderItems) {
          let totalTax = 0;
          let totalSubTotal = 0;
          for (const item of orderDetail.orderItems) {
            totalTax += item.tax;
            totalSubTotal += item.unitPrice * item.quantity;
          }
          setTax(totalTax);
          setSubTotal(totalSubTotal);
          setTotalAmount(totalSubTotal + totalTax);
        }
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (err) {
      console.error("❌ Failed to fetch order details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await api.put("/admin/orders/confirm", operation);
      if (response.data.code === 1) {
        await fetchOrderDetails();
        alert("✅ Order confirmed successfully!");
          setOperation({...operation,reason:""});
      } else {
        alert("Failed to confirm order: " + response.data.msg);
      }
    } catch (err) {
      console.error("❌ Failed to confirm order:", err);
      alert("Failed to confirm order. Please try again.");
    }
  };

  const handleReject = async () => {
    const reason = prompt("Please enter rejection reason:");
    if (!reason) return;

    try {
      setOperation({...operation,reason:reason});

      const response = await api.put("/admin/orders/rejection", operation);
      if (response.data.code === 1) {
        await fetchOrderDetails();
        alert("✅ Order rejected successfully!");
          setOperation({...operation,reason:""});
      } else {
        alert("Failed to reject order: " + response.msg);
      }
    } catch (err) {
      console.error("❌ Failed to reject order:", err);
      alert("Failed to reject order. Please try again.");
    }
  };

  const handleCancel = async () => {
    const reason = prompt("Please enter cancellation reason:");
    if (!reason) return;

    try {
       setOperation({...operation,reason:reason});

      const response = await api.put("/admin/orders/cancel",operation);
      if (response.data.code === 1) {
        await fetchOrderDetails();
        alert("✅ Order cancelled successfully!");
        setOperation({...operation,reason:""});
      } else {
        alert("Failed to cancel order: " + response.data.msg);
      }
    } catch (err) {
      console.error("❌ Failed to cancel order:", err);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const handleDeliver = async () => {
    try {
      const response = await api.put("/admin/orders/delivery", operation);
      if (response.data.code === 1) {
        await fetchOrderDetails();
        alert("✅ Order delivered successfully!");
      } else {
        alert("Failed to deliver order: " + response.msg);
      }
    } catch (err) {
      console.error("❌ Failed to deliver order:", err);
      alert("Failed to deliver order. Please try again.");
    }
  };

  const handleComplete = async () => {
    try {
      const response = await api.put("/admin/orders/complete", operation);
      if (response.data.code === 1) {
        await fetchOrderDetails();
        alert("✅ Order completed successfully!");
      } else {
        alert("Failed to complete order: " + response.data.msg);
      }
    } catch (err) {
      console.error("❌ Failed to complete order:", err);
      alert("Failed to complete order. Please try again.");
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      1: "Pending Payment",
      2: "Awaiting Acceptance",
      3: "Accepted",
      4: "Delivering",
      5: "Completed",
      6: "Canceled",
    };
    return statusMap[status] || "Unknown";
  };

  const getStatusColor = (status) => {
    const colorMap = {
      1: "text-yellow-600 bg-yellow-100",
      2: "text-blue-600 bg-blue-100",
      3: "text-purple-600 bg-purple-100",
      4: "text-green-600 bg-green-100",
      5: "text-gray-600 bg-gray-100",
      6: "text-red-600 bg-red-100",
    };
    return colorMap[status] || "text-gray-600 bg-gray-100";
  };

  const getPayMethodText = (payMethod) => {
    console.log("Payment method parameter:", payMethod);

    const methodMap = {
      1: "Credit Card",
      2: "Debit Card",
      3: "PayPal",
      4: "Cash",
      5: "Digital Wallet",
    };
    return methodMap[payMethod] || "Unknown";
  };

  const getPayStatusText = (payStatus) => {
    const statusMap = {
      0: "Unpaid",
      1: "Paid",
      2: "Refunded",
    };
    return statusMap[payStatus] || "Unknown";
  };

  const getActionButton = () => {
    switch (order.status) {
      case 1: // pending payment
        return null;
      case 2: // Pending Acceptance
        return (
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm Order
            </button>
            <button
              onClick={handleReject}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Reject Order
            </button>
          </div>
        );
      case 3: // Accepted
        return (
          <button
            onClick={handleDeliver}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Truck className="w-5 h-5" />
            Start Delivery
          </button>
        );
      case 4: // Delivering
        return (
          <button
            onClick={handleComplete}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <CheckSquare className="w-5 h-5" />
            Complete Order
          </button>
        );
      case 5: // Completed
        return null;

      case 6: // Cancelled
        return null;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#b08968]"></div>
            <p className="mt-2 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-10">
          <p className="text-gray-500">Order not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/admin/orders")}
            className="mr-4 text-[#b08968] hover:text-[#8d6e52] flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-[#4b3b2b]">Order Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Overview */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#4b3b2b] mb-2">
                    Order# {order.orderNo}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Ordered:
                      {" " + new Date(order.orderTime).toLocaleString()}
                    </span>
                    {order.checkoutTime && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Checked out:{" "}
                        {new Date(order.orderTime).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>

              {/* Order Status Messages */}
              {order.cancelReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Cancelled Reason:</strong> {order.cancelReason}
                  </p>
                  {order.cancelTime && (
                    <p className="text-xs text-red-600 mt-1">
                      Cancelled at:{" "}
                      {new Date(order.cancelTime).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {order.rejectionReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Rejection Reason:</strong> {order.rejectionReason}
                  </p>
                </div>
              )}

              {order.estimatedDeliveryTime && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Estimated Delivery:</strong>{" "}
                    {new Date(order.estimatedDeliveryTime).toLocaleString()}
                  </p>
                </div>
              )}

              {order.deliveryTime && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Delivered at:</strong>{" "}
                    {new Date(order.deliveryTime).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#4b3b2b] mb-4">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Customer Name</p>
                    <p className="font-medium">{order.userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{order.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium">{order.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#4b3b2b] mb-4">
                Order Items
              </h3>
              <div className="space-y-3">
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.image || "/assets/default-no-img.png"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/default-no-img.png";
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-[#4b3b2b]">
                          {item.name}
                        </h4>
                        {item.flavor && item.flavor.length > 0 && (
                          <p className="text-sm text-gray-600">
                            Flavors: {item.flavor.map((f) => f.name).join(", ")}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          ${item.unitPrice} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#b08968]">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No items found
                  </p>
                )}
              </div>
            </div>

            {/* Order Notes */}
            {order.remark && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#4b3b2b] mb-2">
                  Order Notes
                </h3>
                <p className="text-gray-600">{order.remark}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#4b3b2b] mb-4">
                Payment Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">
                      {getPayMethodText(order.paymentMethod)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      order.payStatus === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {getPayStatusText(order.payStatus)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#4b3b2b] mb-4">
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#4b3b2b]">Total</span>
                    <span className="text-xl font-bold text-[#b08968]">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {getActionButton() && (
              <div className="bg-white shadow rounded-lg p-6">
                {getActionButton()}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default OrderDetailPage;
