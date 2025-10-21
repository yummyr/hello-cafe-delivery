import React from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ErrorBoundary from "../components/ErrorBoundary"
import {
  Home,
  BarChart3,
  Package,
  Gift,
  Utensils,
  Folder,
  Users,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "dashboard", icon: <Home /> },
    { label: "Analytics", path: "analytics", icon: <BarChart3 /> },
    { label: "Orders", path: "orders", icon: <Package /> },
    { label: "Combos", path: "combos", icon: <Gift /> },
    { label: "Menu Items", path: "menu", icon: <Utensils /> },
    { label: "Categories", path: "categories", icon: <Folder /> },
    { label: "Employees", path: "employees", icon: <Users /> },
  ];

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
              Today’s Data{" "}
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
        <section>
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
                  <p
                    onClick={() =>
                      navigate(`/admin/${block.path}?status=active`)
                    }
                    className="cursor-pointer hover:text-[#b08968]"
                  >
                    Active: 12
                  </p>
                  <p
                    onClick={() =>
                      navigate(`/admin/${block.path}?status=inactive`)
                    }
                    className="cursor-pointer hover:text-[#b08968]"
                  >
                    Inactive: 3
                  </p>
                </div>
                <button
                  onClick={() => console.log("Add new", block.action)}
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
