import React, { useState, useEffect } from "react";
import { Coffee, User } from "lucide-react";
import axios from "axios";

function AdminTopBar({ onLogout }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("Admin");
  const [initialized, setInitialized] = useState(false);

  // initilize AdminTopBar
  useEffect(() => {
    try {
      console.log(" AdminTopBar initializing...");

      // get username from localStorage
      const storedUsername = localStorage.getItem("username");
      console.log("Found username:", storedUsername);

      if (
        storedUsername &&
        storedUsername !== "undefined" &&
        storedUsername !== "null"
      ) {
        setUsername(storedUsername);
      } else {
        // get username from reponse data
        try {
          const loginResponse = localStorage.getItem("loginResponse");
          if (loginResponse) {
            const parsed = JSON.parse(loginResponse);
            if (parsed.data && parsed.data.username) {
              setUsername(parsed.data.username);
            }
          }
        } catch (parseError) {
          console.warn("Could not parse login response:", parseError);
        }
      }

      setInitialized(true);
      console.log(" AdminTopBar initialized successfully");
    } catch (error) {
      console.error("AdminTopBar initialization failed:", error);
      setUsername("Admin");
      setInitialized(true);
    }
  }, []);

  // fetch business status
  const fetchStatus = async () => {
    try {
      console.log("Fetching shop status...");
      const res = await axios.get("http://localhost:8080/user/shop/status");
      console.log("Shop status response:", res.data);
      setStatus(res.data.data === 1 ? "open" : "closed");
    } catch (err) {
      console.error("Failed to fetch shop status:", err);
      setStatus("closed"); // default status is closed
    }
  };

  useEffect(() => {
    if (initialized) {
      fetchStatus();
    }
  }, [initialized]);

  // toggle business status
  const toggleStatus = async () => {
    if (status === null || !initialized) return;

    const newStatus = status === "open" ? "closed" : "open";
    setStatus(newStatus);
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/business/status", {
        status: newStatus === "open" ? 1 : 0,
      });
      console.log("Status updated to:", newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status on server.");
      // rollback business status
      setStatus(status);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout button click
  // If logout handler is provided from parent component, call it directly
  // If no handler is provided, log a warning to the console
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.warn("No logout handler provided");
    }
  };

  // if fail to initialize, rendering loading
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
        <div className="w-10 h-10 bg-[#8d6e52] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">HC</span>
        </div>
        <h1 className="font-semibold text-lg text-[#4b3b2b]">Hello Café</h1>
      </div>

      {/* Business status display */}
      <div className="flex items-center gap-2 ml-4">
        <Coffee className="text-[#4b3b2b] w-6 h-6" />
        <span className="font-semibold text-lg text-[#4b3b2b]">
          Business Status
        </span>

        <button
          onClick={toggleStatus}
          disabled={loading || status === null}
          className={`ml-2 px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
            status === "open"
              ? "bg-[#4b3b2b] text-white hover:bg-[#3a2f24]"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          {loading
            ? "Updating..."
            : status === null
            ? "Loading..."
            : status.toUpperCase()}
        </button>
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
