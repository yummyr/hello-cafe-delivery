import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ErrorBoundary from "../components/ErrorBoundary";
import OrderNotificationModal from "../components/OrderNotificationModal";
import useOrderNotifications from "../../../hooks/useOrderNotifications";
import {
  Package,
  Gift,
  Utensils,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Bell,
} from "lucide-react";
import api from "../../../api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTotal, setActiveTotal] = useState(0);
  const [inactiveTotal, setInactiveTotal] = useState(0);
  const [businessData, setBusinessData] = useState({
    revenue: 0,
    validOrderCount: 0,
    orderCompletionRate: 0,
    unitPrice: 0,
    newUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveringOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // use OrderNotifications hook
  const {
    waitingOrders,
    isLoading: notificationLoading,
    error: notificationError,
    isModalOpen,
    closeModal,
    openModal,
    viewOrder,
    confirmOrder,
    refresh: refreshNotifications,
  } = useOrderNotifications();
  const orderStatus = [
    {
      name: "All Orders",
      value: null,
      icon: Package,
      color: "text-gray-800",
      count: businessData.totalOrders,
    },
    {
      name: "Pending",
      value: 1,
      icon: Clock,
      color: "text-yellow-800",
      count: businessData.pendingOrders,
    },
    {
      name: "Out for Delivery",
      value: 4,
      icon: Truck,
      color: " text-blue-800",
      count: businessData.deliveringOrders,
    },
    {
      name: "Completed",
      value: 5,
      icon: CheckCircle,
      color: " text-green-800",
      count: businessData.completedOrders,
    },
    {
      name: "Cancelled",
      value: 6,
      icon: XCircle,
      color: "text-red-800",
      count: businessData.cancelledOrders,
    },
  ];

  const handleAddNew = () => {
    navigate("/admin/menu/new");
  };

  // handle bell click
  const handleBellClick = () => {
    if (waitingOrders?.count > 0) {
      // if there are waiting orders open the modal
      openModal();
    } else {
      // if there are no waiting orders, refresh the notifications
      refreshNotifications();
    }
  };

  const fetchBusinessData = async () => {
    try {
      console.log("🔄 Fetching business data from /admin/report/businessData");
      const response = await api.get("/admin/report/businessData");
      console.log("📊 Business data response:", response.data);

      if (response.data.code === 1 && response.data.data) {
        console.log(
          "✅ Business data loaded successfully:",
          response.data.data
        );
        setBusinessData(response.data.data);
      } else {
        console.warn("⚠️ Failed to fetch business data:", response.data.msg);
        setError(
          `Business data error: ${response.data.msg || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("❌ Error fetching business data:", error);
      if (error.response) {
        console.error(
          "Response error:",
          error.response.status,
          error.response.data
        );
        setError(
          `Server error: ${error.response.status} - ${
            error.response.data?.msg || error.response.statusText
          }`
        );
      } else if (error.request) {
        console.error("Request error - no response received:", error.request);
        setError("Network error: Unable to reach server");
      } else {
        console.error("Request setup error:", error.message);
        setError(`Request error: ${error.message}`);
      }
    }
  };

  const fetchMenuItemInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      // console.log("Fetching menu item info...");
      const response = await api.get("/admin/menu/status");
      // console.log("Menu item info response:", response.data);
      if (response.data.code === 1) {
        const items = response.data.data;

        const activeCount = items.filter((item) => item.status === 1).length;
        const inactiveCount = items.filter((item) => item.status === 0).length;

        setActiveTotal(activeCount);
        setInactiveTotal(inactiveCount);
      } else {
        throw new Error(response.data.msg || "Failed to fetch menu items");
      }
    } catch (error) {
      console.error("Error fetching menu item info:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItemInfo();
    fetchBusinessData();
  }, []);
  const handleNavigate = (status) => {
    // if status is null, then navigate to all orders
    if (status === null) {
      navigate("/admin/orders");
    } else {
      // navigate with status
      navigate(`/admin/orders?searchStatus=${status}`);
    }
  };
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  const handleRetry = () => {
    fetchMenuItemInfo();
    fetchBusinessData();
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load data: {error}</p>
            <button
              onClick={handleRetry}
              className="bg-[#b08968] text-white px-4 py-2 rounded-md hover:bg-[#8d6e52]"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <ErrorBoundary>
      <AdminLayout>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#4b3b2b]">
            Dashboard Overview
          </h2>

          {/* notification button */}
          <button
            onClick={handleBellClick}
            className="relative bg-white p-3 rounded-full shadow hover:shadow-md transition-shadow group"
            title={waitingOrders?.count > 0 ? "click to view pending orders" : "click to check for new orders"}
          >
            <Bell
              className={`h-6 w-6 text-[#b08968] group-hover:text-[#8d6e52] transition-colors ${
                notificationLoading ? "animate-pulse" : ""
              }`}
            />

            {/* notification badge */}
            {waitingOrders?.count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
                {waitingOrders.count > 9 ? "9+" : waitingOrders.count}
              </span>
            )}

            {/* loading badge */}
            {notificationLoading && !waitingOrders?.count && (
              <span className="absolute -top-1 -right-1 bg-orange-400 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                •
              </span>
            )}
          </button>
        </div>

        {/* Today's Data */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#6b4f3b]">
              Today's Data{"  "}
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </h3>
            <div className="flex gap-2 items-center">
              <button
                onClick={handleRetry}
                className="text-[#b08968] hover:underline text-sm font-medium flex items-center gap-1"
                title="Refresh business data"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => navigate("/admin/analytics")}
                className="text-[#b08968] hover:underline text-sm font-medium"
              >
                View Detailed Data →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md border border-gray-100 transition">
              <p className="text-sm text-gray-500 mb-2">Revenue</p>
              <p className="text-2xl font-semibold text-[#4b3b2b]">
                $
                {businessData.revenue
                  ? businessData.revenue.toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md border border-gray-100 transition">
              <p className="text-sm text-gray-500 mb-2">Valid Orders</p>
              <p className="text-2xl font-semibold text-[#4b3b2b]">
                {businessData.validOrderCount || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md border border-gray-100 transition">
              <p className="text-sm text-gray-500 mb-2">Completion Rate</p>
              <p className="text-2xl font-semibold text-[#4b3b2b]">
                {businessData.orderCompletionRate
                  ? businessData.orderCompletionRate.toFixed(2)
                  : "0.0"}
                %
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md border border-gray-100 transition">
              <p className="text-sm text-gray-500 mb-2">New Users</p>
              <p className="text-2xl font-semibold text-[#4b3b2b]">
                {businessData.newUsers || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md border border-gray-100 transition">
              <p className="text-sm text-gray-500 mb-2">Avg Order Value</p>
              <p className="text-2xl font-semibold text-[#4b3b2b]">
                $
                {businessData.unitPrice
                  ? businessData.unitPrice.toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>
        </section>

        {/* ===== Order Management ===== */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#6b4f3b]">
              Order Management
            </h2>
            <button
              onClick={() => navigate("/admin/orders")}
              className="text-[#b08968] hover:underline text-sm font-medium"
            >
              View Order Details →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {orderStatus.map((status, i) => (
              <div
                onClick={() => handleNavigate(status.value)}
                key={i}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md border border-gray-100 flex flex-col items-center justify-center"
              >
                <status.icon
                  className={`w-6 h-6 font-semibold ${status.color}`}
                />
                <p className="mt-2 font-medium text-[#4b3b2b]">{status.name}</p>
                <p className={`text-md font-semibold ${status.color}`}>
                  {status.count}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Menu & Combo Overview ===== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Menu Overview",
              path: "menu",
              action: "Add Dish",
              icon: <Utensils />,
            },
            {
              title: "Combo Overview",
              path: "combos",
              action: "Add Combo",
              icon: <Gift />,
            },
          ].map((block, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-4 gap-6">
                <div className="flex items-center gap-2">
                  {React.cloneElement(block.icon, {
                    className: "w-5 h-5 text-[#b08968]",
                  })}
                  <h3 className="text-lg font-bold text-[#6b4f3b]">
                    {block.title}
                  </h3>
                </div>
                <button
                  onClick={() => navigate(`/admin/${block.path}`)}
                  className="text-[#b08968] hover:underline text-sm"
                >
                  Manage →
                </button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="text-gray-600 space-y-1">
                  <p className="cursor-pointer hover:text-[#b08968]">
                    Active: {activeTotal}
                  </p>
                  <p className="cursor-pointer hover:text-[#b08968]">
                    Inactive: {inactiveTotal}
                  </p>
                </div>
                <button
                  onClick={() => handleAddNew()}
                  className="bg-[#b08968] text-white px-4 py-2 rounded-md hover:bg-[#8d6e52] transition"
                >
                  + {block.action}
                </button>
              </div>
            </div>
          ))}
        </section>

        {/*  Order Notification Modal */}
        <OrderNotificationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          waitingOrders={waitingOrders}
          onViewOrder={viewOrder}
          onConfirmOrder={confirmOrder}
        />
      </AdminLayout>
    </ErrorBoundary>
  );
}

export default AdminDashboard;
