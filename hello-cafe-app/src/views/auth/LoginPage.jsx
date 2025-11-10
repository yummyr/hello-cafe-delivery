import React, { useState } from "react";
import { login } from "@/api/auth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // "employee" | "customer"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968]";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  const handleGuestClick = () => navigate("/user/dashboard");

  const handleLogin = async (selectedRole) => {
    if (!username || !password) {
    setError("Please fill in all fields");
    return;
  } 

  setLoading(true);
  setError("");

  try {
    const res = await login(username, password, selectedRole);
    console.log("✅ Login Success:", res.data);

     if (!res.data || !res.data.data) {
      throw new Error("Invalid response format");
    }
    
    const responseData = res.data.data;
    
    if (!responseData.token) {
      throw new Error("No token received");
    }
   // clear old storage data
    localStorage.clear();

    // storage new data
    localStorage.setItem("token", responseData.token);
    localStorage.setItem("username", responseData.username);
    localStorage.setItem("role", selectedRole);
    localStorage.setItem("loginResponse", JSON.stringify(res.data));

    console.log("✅ Storage completed:");
    console.log("Token:", localStorage.getItem("token"));
    console.log("Username:", localStorage.getItem("username"));

  
    // navigate depending on different role
    if (selectedRole === "employee") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  } catch (err) {
    console.error("Login failed:", err);
    setError("Invalid username or password");
    localStorage.clear();
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#f8f4ef] text-gray-800">
      {/* background */}
      <div
        className="lg:w-1/2 w-full h-64 lg:h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/cafe-bg.png')",
        }}
      ></div>

      {/* form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 lg:px-24 py-12">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center text-[#6b4f3b] mb-8">
            Welcome Back ☕
          </h2>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className={labelStyle}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className={inputStyle}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelStyle}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={inputStyle}
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Buttons for different roles */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="button"
                onClick={() => handleLogin("employee")}
                disabled={loading}
                className="w-full bg-[#b08968] text-white py-2 rounded-lg font-medium hover:bg-[#8d6e52] transition-all duration-200 shadow-md"
              >
                {loading && role === "employee"
                  ? "Logging in..."
                  : "Login as Employee"}
              </button>

              <button
                type="button"
                onClick={() => handleLogin("customer")}
                disabled={loading}
                className="w-full bg-[#d3c4b7] text-[#4a3b2f] py-2 rounded-lg font-medium hover:bg-[#c2a98f] transition-all duration-200 shadow-md"
              >
                {loading && role === "customer"
                  ? "Logging in..."
                  : "Login as Customer"}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGuestClick}
              className="w-full bg-[#956c49] text-white py-2 rounded-lg font-medium hover:bg-[#8d6e52] transition-all duration-200 shadow-md"
            >
              Continue as a guest
            </button>
          </div>
          <p className="text-sm text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#b08968] font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-8">
          © 2025 Hello Café. All rights reserved.
        </p>
      </div>
    </div>
  );
}
export default LoginPage;
