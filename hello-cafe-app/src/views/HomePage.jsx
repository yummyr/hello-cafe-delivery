import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");
  const handleGuestClick = () => navigate("/customer-dashboard");

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat text-gray-800"
      style={{
        backgroundImage: "url('/assets/HomePage-bg.png')", 
      }}
    >
    
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center gap-8 px-8 h-full 
                      lg:items-end lg:pb-[10vh]">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 w-full lg:w-auto">
          <button
            type="button"
            onClick={handleLoginClick}
            className="w-56 bg-[#b08968] text-white py-3 rounded-lg text-lg shadow-md 
                       hover:bg-[#8d6e52] transition-all duration-200"
          >
            Continue to login
          </button>

          <button
            type="button"
            onClick={handleGuestClick}
            className="w-56 bg-[#b08968] text-white py-3 rounded-lg text-lg shadow-md 
                       hover:bg-[#8d6e52] transition-all duration-200"
          >
            Continue as a guest
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
