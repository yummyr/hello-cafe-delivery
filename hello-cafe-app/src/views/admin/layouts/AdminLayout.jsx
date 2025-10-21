import React from "react";
import AdminTopBar from "../components/AdminTopBar";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";

function AdminLayout({ children}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      console.log("Logging out...");
      // clear all user data
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("loginResponse");
      
      console.log("✅ Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login"); 
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#f5f2ef] text-gray-800 font-sans">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AdminTopBar onLogout={handleLogout}  />
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 pt-[72px]">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto space-y-6 bg-[#f8f4ef]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
