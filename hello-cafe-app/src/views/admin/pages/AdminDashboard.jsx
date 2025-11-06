import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ErrorBoundary from "../components/ErrorBoundary";
import {
  Home,
  BarChart3,
  Package,
  Gift,
  Utensils,
  Folder,
  Users,
  X,
} from "lucide-react";
import api from "../../../api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTotal, setActiveTotal] = useState(0);
  const [inactiveTotal, setInactiveTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAddNew = () => {
    navigate("/admin/menu/new");
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
  }, []);
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load data: {error}</p>
            <button
              onClick={fetchMenuItemInfo}
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
        <h2 className="text-2xl font-bold text-[#4b3b2b] mb-6">
          Dashboard Overview
        </h2>

        {/* Today's Data */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#6b4f3b]">
              Today's Data{" "}
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </h3>
            <button
              onClick={() => navigate("/admin/analytics")}
              className="text-[#b08968] hover:underline text-sm font-medium"
            >
              View Detailed Data →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { title: "Revenue", value: "¥1200" },
              { title: "Valid Orders", value: "56" },
              { title: "Completion Rate", value: "98%" },
              { title: "New Users", value: "15" },
              { title: "Avg Order Value", value: "¥21.4" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md border border-gray-100 transition"
              >
                <p className="text-sm text-gray-500 mb-2">{item.title}</p>
                <p className="text-2xl font-semibold text-[#4b3b2b]">
                  {item.value}
                </p>
              </div>
            ))}
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
            {[
              "All Orders",
              "Pending",
              "Out for Delivery",
              "Completed",
              "Cancelled",
            ].map((status, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md border border-gray-100 flex flex-col items-center justify-center"
              >
                <Package className="w-6 h-6 text-[#b08968]" />
                <p className="mt-2 font-medium text-[#4b3b2b]">{status}</p>
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
      </AdminLayout>
    </ErrorBoundary>
  );
}

export default AdminDashboard;
