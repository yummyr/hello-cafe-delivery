import React, { useState, useEffect } from "react";
import { Coffee, User, ShoppingCart, Heart, Clock } from "lucide-react";
import api from "../../../api";
import {tokenManager} from "../../../utils/tokenManager";
import { isTokenExpired } from "../../../utils/tokenUtils";

function UserTopBar({ onLogout }) {
  const [shopState, setShopState] = useState({
    status: null, // 'open' or 'closed'
    loading: false,
    error: null,
  });
  const [username, setUsername] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
   const [tokenStatus, setTokenStatus] = useState({
    isValid: true,
    lastRefresh: null,
  });

  // Initialize UserTopBar
  useEffect(() => {
    try {
      console.log("UserTopBar initializing...");

      // Check if token is valid
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        console.warn("No valid token found, redirecting to login...");
        handleTokenExpired();
        return;
      }

      // Get username from localStorage
      const storedUsername = localStorage.getItem("username");
      console.log("Found username:", storedUsername);

      if (
        storedUsername &&
        storedUsername !== "undefined" &&
        storedUsername !== "null"
      ) {
        setUsername(storedUsername);
      } else {
        // Get username from response data
        try {
          const loginResponse = localStorage.getItem("loginResponse");
          if (loginResponse) {
            const parsed = JSON.parse(loginResponse);
            if (parsed.data && parsed.data.username) {
              setUsername(parsed.data.username);
              // Also save to localStorage for future use
              localStorage.setItem("username", parsed.data.username);
            }
          }
        } catch (parseError) {
          console.warn("Could not parse login response:", parseError);
        }
      }

       // Initialize token manager
      tokenManager.init(handleTokenExpired);
      setTokenStatus({ isValid: true, lastRefresh: Date.now() });

      setInitialized(true);
      console.log("UserTopBar initialized successfully");
    } catch (error) {
      console.error("UserTopBar initialization failed:", error);
      // setUsername("User");
      setInitialized(true);
    }
    // Cleanup on unmount
    return () => {
      tokenManager.cleanup();
    };
  }, []);

    // Handle token expiration
  const handleTokenExpired = () => {
    console.log("Token expired or invalid, logging out...");
    localStorage.clear();
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/login";
    }
  };

  // Fetch shop status
  const fetchShopStatus = async () => {
    try {
      console.log("Fetching shop status...");
      const res = await api.get("/user/shop/status");
      console.log("Shop status response:", res.data);

      if (res.data.code === 1) {
        setShopState((prev) => ({
          ...prev,
          status: res.data.data === 1 ? "open" : "closed",
          error: null,
        }));
      } else {
        throw new Error(res.data.msg || "Failed to fetch shop status");
      }
    } catch (err) {
      console.error("Failed to fetch shop status:", err);

       // If error is due to authentication, handle it
      if (err.response?.status === 401) {
        handleTokenExpired();
        return;
      }

      setShopState((prev) => ({
        ...prev,
        status: "closed", // default status
        error: err.response?.data?.msg || err.message,
      }));
    }
  };

  // Fetch cart item count
  const fetchCartItemCount = async () => {
    try {
      const response = await api.get("/user/shoppingCart/list");
      if (response.data.code === 1 && response.data.data) {
        const items = response.data.data;
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(totalItems);
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      // If error is due to authentication, handle it
      if (error.response?.status === 401) {
        handleTokenExpired();
        return;
      }
    }
  };

  useEffect(() => {
    if (initialized) {
      fetchShopStatus();
      fetchCartItemCount();
    }
  }, [initialized]);

  // Handle logout button click
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.warn("No logout handler provided");
    }
  };

  // Navigate to cart
  const navigateToCart = () => {
    window.location.href = "/user/cart";
  };

  // Navigate to favorites
  const navigateToFavorites = () => {
    window.location.href = "/user/favorites";
  };

  // Navigate to orders
  const navigateToOrders = () => {
    window.location.href = "/user/orders";
  };

  // If fail to initialize, render loading
  if (!initialized) {
    return (
      <header className="w-full bg-[#f5c16c] flex justify-between items-center px-8 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8d6e52] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">HC</span>
          </div>
          <h1 className="font-semibold text-lg text-[#4b3b2b]">Hello Café</h1>
        </div>
        <div className="text-[#4b3b2b]">Loading...</div>
      </header>
    );
  }

  return (
    <header className="w-full bg-[#f5c16c] flex justify-between items-center px-8 py-4 shadow-md">
      {/* Left: Brand logo + name */}
      <div className="flex items-center gap-3">
        <img
          src="/assets/logo.png"
          alt="logo"
          className="w-10 h-10 bg-[#8d6e52] rounded-full flex items-center justify-center"
        />
        <h1 className="font-semibold text-lg text-[#4b3b2b]">Hello Café</h1>
      </div>

      {/* Center: Shop status */}
      <div className="flex items-center gap-2">
        <Coffee className="text-[#4b3b2b] w-6 h-6" />
        <span className="font-semibold text-lg text-[#4b3b2b]">
          Shop Status:
        </span>
        <span className={`px-3 py-1 text-sm font-medium rounded-md ${
          shopState.status === "open"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}>
          {shopState.status === null ? "Loading..." : shopState.status.toUpperCase()}
        </span>
      </div>

      {/* Right: User controls */}
      <div className="flex items-center gap-4">
        {/* Cart */}
        <button
          onClick={navigateToCart}
          className="relative flex items-center gap-2 text-[#4b3b2b] hover:text-[#8d6e52] transition"
          title="Shopping Cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#b08968] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </span>
          )}
        </button>

        {/* Favorites */}
        <button
          onClick={navigateToFavorites}
          className="flex items-center gap-2 text-[#4b3b2b] hover:text-[#8d6e52] transition"
          title="Favorites"
        >
          <Heart className="w-5 h-5" />
        </button>

        {/* Orders */}
        <button
          onClick={navigateToOrders}
          className="flex items-center gap-2 text-[#4b3b2b] hover:text-[#8d6e52] transition"
          title="Order History"
        >
          <Clock className="w-5 h-5" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-1">
          <User className="w-5 h-5 text-[#4b3b2b]" />
          <span className="text-[#4b3b2b] font-medium">{username || "User"}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogoutClick}
          className="px-3 py-1 bg-[#b08968] text-white rounded-md hover:bg-[#8d6e52] transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default UserTopBar;