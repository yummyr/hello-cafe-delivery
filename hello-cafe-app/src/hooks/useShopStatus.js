import { useState, useCallback, useRef } from "react";
import api from "../api";

/**
 * Custom hook for managing shop status
 * Provides functionality to fetch and toggle shop status
 * @param {Function} handleTokenExpired - Function to handle token expiration
 * @param {Object} options - Configuration options
 * @param {string} options.endpoint - API endpoint to use (default: "/shop/status")
 * @param {boolean} options.canToggle - Whether the status can be toggled (default: true)
 */
export function useShopStatus(handleTokenExpired, options = {}) {
  const { endpoint = "/shop/status", canToggle = true } = options;
  const [shopState, setShopState] = useState({
    status: null, // 'open' or 'closed'
    loading: false,
    error: null,
  });

  // Use ref to store mutable values that don't trigger re-renders
  const shopStateRef = useRef(shopState);
  shopStateRef.current = shopState;

  // Fetch shop status
  const fetchStatus = useCallback(async () => {
    try {
      console.log("Fetching shop status from:", endpoint);
      const res = await api.get(endpoint);
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
        if (handleTokenExpired) {
          handleTokenExpired();
        }
        return;
      }

      setShopState((prev) => ({
        ...prev,
        status: "closed", // default status
        error: err.response?.data?.msg || err.message,
      }));
    }
  }, [handleTokenExpired, endpoint]);

  // Toggle shop status
  const toggleStatus = useCallback(async () => {
    const currentState = shopStateRef.current;
    if (!canToggle || currentState.status === null || currentState.loading) return;

    const currentStatus = currentState.status; // Store current status before state change
    const newStatus = currentStatus === "open" ? "closed" : "open";
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
        if (handleTokenExpired) {
          handleTokenExpired();
        }
        return;
      }

      // Rollback status on error using stored current status
      setShopState((prev) => ({
        ...prev,
        status: currentStatus, // Use stored current status
        loading: false,
        error: err.response?.data?.msg || err.message,
      }));

      // Show error message
      const errorMessage =
        err.response?.data?.msg || "Failed to update status on server";
      alert(`Fail to update status: ${errorMessage}`);
    }
  }, [canToggle, handleTokenExpired]);

  // Get button display text
  const getButtonText = useCallback(() => {
    const currentState = shopStateRef.current;
    if (currentState.loading) return "Updating...";
    if (currentState.status === null) return "Loading...";
    return currentState.status.toUpperCase();
  }, []);

  // Get button styles
  const getButtonStyles = useCallback(() => {
    const currentState = shopStateRef.current;
    const baseStyles =
      "ml-2 px-3 py-1 text-sm font-medium rounded-md transition-all duration-200";

    if (currentState.loading || currentState.status === null) {
      return `${baseStyles} bg-gray-400 text-gray-600 cursor-not-allowed`;
    }

    return currentState.status === "open"
      ? `${baseStyles} bg-[#4b3b2b] text-white hover:bg-[#3a2f24] cursor-pointer`
      : `${baseStyles} bg-gray-300 text-gray-800 hover:bg-gray-400 cursor-pointer`;
  }, []);

  return {
    shopState,
    fetchStatus,
    toggleStatus,
    getButtonText,
    getButtonStyles,
    canToggle,
  };
}