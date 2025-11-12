import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Utensils,
  Gift,
  ShoppingCart,
  ClipboardList,
  MapPin,
  Heart,
  Settings,
} from "lucide-react";
import { useShoppingCart } from "../../../hooks/useShoppingCart";

function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount: cartItemCount } = useShoppingCart();

  const menuItems = [
    { label: "Dashboard", path: "/user/dashboard", icon: <Home /> },
    { label: "Menu", path: "/user/menu", icon: <Utensils /> },
    { label: "Combos", path: "/user/combos", icon: <Gift /> },
    {
      label: "Shopping Cart",
      path: "/user/cart",
      icon: <ShoppingCart />,
      badge: cartItemCount > 0 ? (cartItemCount > 99 ? "99+" : cartItemCount) : null
    },
    { label: "My Orders", path: "/user/orders", icon: <ClipboardList /> },
    { label: "Address Book", path: "/user/addresses", icon: <MapPin /> },
    { label: "Favorites", path: "/user/favorites", icon: <Heart /> },
  ];

  
  return (
    <aside className="w-64 bg-[#2e2e2e] text-white flex flex-col shadow-lg fixed top-[72px] left-0 bottom-0">
      <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path ||
                          (item.path !== "/user/dashboard" && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex items-center gap-3 w-full py-2 px-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#b08968] text-white"
                  : "hover:bg-[#b08968] hover:text-white"
              }`}
            >
              {React.cloneElement(item.icon, { className: "w-5 h-5 shrink-0" })}
              <span>{item.label}</span>

              {/* Cart item count badge */}
              {item.badge && (
                <span className="absolute top-1 right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div
        onClick={() => navigate("/user/settings")}
        className="px-4 py-4 border-t border-gray-700 flex items-center gap-2 hover:bg-[#3d3d3d] transition-all cursor-pointer"
      >
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </div>
    </aside>
  );
}

export default UserSidebar;
