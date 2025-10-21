import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BarChart3,
  Package,
  Gift,
  Utensils,
  Folder,
  Users,
  Settings,
} from "lucide-react";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <Home /> },
    { label: "Analytics", path: "/admin/analytics", icon: <BarChart3 /> },
    { label: "Orders", path: "/admin/orders", icon: <Package /> },
    { label: "Combos", path: "/admin/combos", icon: <Gift /> },
    { label: "Menu Items", path: "/admin/menu", icon: <Utensils /> },
    { label: "Categories", path: "/admin/categories", icon: <Folder /> },
    { label: "Employees", path: "/admin/employees", icon: <Users /> },
  ];

  return (
    <aside className="w-64 bg-[#2e2e2e] text-white flex flex-col shadow-lg fixed top-[72px] left-0 bottom-0">
      <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full py-2 px-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#b08968] text-white"
                  : "hover:bg-[#b08968] hover:text-white"
              }`}
            >
              {React.cloneElement(item.icon, { className: "w-5 h-5 shrink-0" })}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div
        onClick={() => navigate("/admin/settings")}
        className="px-4 py-4 border-t border-gray-700 flex items-center gap-2 hover:bg-[#3d3d3d] transition-all cursor-pointer"
      >
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </div>
    </aside>
  );
}

export default AdminSidebar;
