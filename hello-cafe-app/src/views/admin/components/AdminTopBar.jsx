import React, { useState, useEffect, useCallback } from "react";
import { Coffee, User } from "lucide-react";
import { useShopStatus } from "../../../hooks/useShopStatus";
import {tokenManager} from "../../../utils/tokenManager";
import { isTokenExpired } from "../../../utils/tokenUtils";

function AdminTopBar({ onLogout }) {
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
  const handleTokenExpired = useCallback(() => {
    console.log("Token expired or invalid, logging out...");
    localStorage.clear();
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/login";
    }
  }, [onLogout]);

  const { shopState, fetchStatus, toggleStatus, getButtonText, getButtonStyles } = useShopStatus(handleTokenExpired);

  useEffect(() => {
    if (initialized) {
      fetchStatus();
    }
  }, [initialized, fetchStatus]);

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
