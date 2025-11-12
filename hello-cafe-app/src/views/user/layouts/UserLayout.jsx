import { useState } from "react";
import UserTopBar from "../components/UserTopBar";
import UserSidebar from "../components/UserSidebar";
import { useNavigate } from "react-router-dom";

function UserLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      console.log("User logged out");
      // Clear all user data
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("loginResponse");

      console.log("✅ Logged out successfully");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
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
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <UserTopBar onLogout={handleLogout} />
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 pt-[72px]">
        <UserSidebar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto space-y-6 bg-[#f8f4ef]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default UserLayout;