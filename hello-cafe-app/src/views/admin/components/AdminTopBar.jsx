import React, { useState, useEffect } from "react";
import { Coffee, User } from "lucide-react";
import api from "../../../api";
import {tokenManager} from "../../../utils/tokenManager";
import { isTokenExpired } from "../../../utils/tokenUtils";

function AdminTopBar({ onLogout }) {
  const [shopState, setShopState] = useState({
    status: null, // 'open' or 'closed'
    loading: false,
    error: null,
  });
  const [username, setUsername] = useState("");
  const [initialized, setInitialized] = useState(false);
   const [tokenStatus, setTokenStatus] = useState({
    isValid: true,
    lastRefresh: null,
  });

  // Initialize AdminTopBar
  useEffect(() => {
    try {
      console.log("AdminTopBar initializing...");

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
      console.log("AdminTopBar initialized successfully");
    } catch (error) {
      console.error("AdminTopBar initialization failed:", error);
      // setUsername("Admin");
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
  const fetchStatus = async () => {
    try {
      console.log("Fetching shop status...");
      const res = await api.get("/shop/status");
      console.log("Shop status response:", res.data);

      if (res.data.code === 1) {
        setShopState((prev) => ({
          ...prev,
          status: res.data.data === 1 ? "open" : "closed",
          error: null,
        }));
      } else {
        throw new Error(res.data.msg || "Failed to fetch status");
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

  useEffect(() => {
    if (initialized) {
      fetchStatus();
    }
  }, [initialized]);

  // Toggle shop status
  const toggleStatus = async () => {
    if (shopState.status === null || shopState.loading) return;

    const newStatus = shopState.status === "open" ? "closed" : "open";
    const statusValue = newStatus === "open" ? 1 : 0;

    // Optimistic update
    setShopState((prev) => ({
      ...prev,
      status: newStatus,
      loading: true,
      error: null,
    }));

    try {
      const response = await api.put("/shop/status", {
        status: statusValue,
      });

      console.log("Status update response:", response.data);

      if (response.data.code === 1) {
       
        const serverStatus = response.data.data === 1 ? "open" : "closed";
        setShopState((prev) => ({
          ...prev,
          status: serverStatus,
          loading: false,
          error: null,
        }));
        console.log("Status updated successfully to:", serverStatus);
      } else {
        throw new Error(response.data.msg || "Update failed");
      }
    } catch (err) {
      console.error("Failed to update status:", err);

      if (err.response?.status === 401) {
        handleTokenExpired();
        return;
      }

      // Rollback status on error
      setShopState((prev) => ({
        ...prev,
        status: shopState.status, // Revert to original status
        loading: false,
        error: err.response?.data?.msg || err.message,
      }));

      // Show error message
      const errorMessage =
        err.response?.data?.msg || "Failed to update status on server";
      alert(`Fail to update status: ${errorMessage}`);
    }
  };

  // Manual token refresh
  const handleManualRefresh = async () => {
    console.log("Manual token refresh triggered");
    const success = await tokenManager.refreshToken();
    if (success) {
      setTokenStatus({ isValid: true, lastRefresh: Date.now() });
      alert("Token refreshed successfully");
    } else {
      alert("Failed to refresh token");
      handleTokenExpired();
    }
  };

  // Handle logout button click
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.warn("No logout handler provided");
    }
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

  // Get button display text
  const getButtonText = () => {
    if (shopState.loading) return "Updating...";
    if (shopState.status === null) return "Loading...";
    return shopState.status.toUpperCase();
  };

  // Get button styles
  const getButtonStyles = () => {
    const baseStyles =
      "ml-2 px-3 py-1 text-sm font-medium rounded-md transition-all duration-200";

    if (shopState.loading || shopState.status === null) {
      return `${baseStyles} bg-gray-400 text-gray-600 cursor-not-allowed`;
    }

    return shopState.status === "open"
      ? `${baseStyles} bg-[#4b3b2b] text-white hover:bg-[#3a2f24] cursor-pointer`
      : `${baseStyles} bg-gray-300 text-gray-800 hover:bg-gray-400 cursor-pointer`;
  };

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

      {/* Shop status display */}
      <div className="flex items-center gap-2 ml-4">
        <Coffee className="text-[#4b3b2b] w-6 h-6" />
        <span className="font-semibold text-lg text-[#4b3b2b]">
          Shop Status:
        </span>

        <button
          onClick={toggleStatus}
          disabled={shopState.loading || shopState.status === null}
          className={getButtonStyles()}
        >
          {getButtonText()}
        </button>

        {/* Error display (optional) */}
        {shopState.error && (
          <span className="text-red-600 text-sm ml-2">({shopState.error})</span>
        )}
      </div>

      {/* Right: Admin controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <User className="w-5 h-5 text-[#4b3b2b]" />
          <span className="text-[#4b3b2b] font-medium">{username}</span>
        </div>

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

export default AdminTopBar;
