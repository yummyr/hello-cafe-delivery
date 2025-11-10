import React, { useState } from "react";
import UserTopBar from "../components/UserTopBar";
import UserSidebar from "../components/UserSidebar";

function UserLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    console.log("User logged out");
    // Clear localStorage
    localStorage.clear();
    setIsLoggedIn(false);
    // Redirect to login page
    window.location.href = "/login";
  };

  if (!isLoggedIn) {
    // This would redirect to login page
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f5f2ef]">
        <div className="text-center">
          <p className="text-xl font-semibold text-[#4b3b3b] mb-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#f5f2ef] text-gray-800 font-sans">
      {/* User TopBar */}
      <UserTopBar onLogout={handleLogout} />

      <div className="flex flex-1 overflow-hidden">
        {/* User Sidebar */}
        <UserSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}

export default UserLayout;