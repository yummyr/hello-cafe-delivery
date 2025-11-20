import React, { useState } from "react";
import { register } from "@/api/auth"; // connect to backend api/auth.js
import registerBg from "/assets/register-bg.png"; // background image
import defaultAvatar from "/assets/default-avatar.png"; // default avatar image
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    gender: "m",
    avatar: null,
  });

  const [preview, setPreview] = useState(defaultAvatar);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const Navigate = useNavigate();
  const inputBoxStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:border-transparent";
  const labelBoxStyle = "block text-sm font-medium text-gray-700 mb-1";

  // handle avatar file input change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(defaultAvatar);
    }
  };

  // submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setFormError("");

    const form = e.target;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // validate password matching
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match. Please re-enter.");
      form.password.value = "";
      form.confirmPassword.value = "";
      form.password.focus();
      return;
    }

    // prepare user data for submission
    const submitData = {
      email: form.email.value,
      username: form.username.value,
      password: password,
      name: `${form.firstName.value} ${form.lastName.value}`,
      phone: form.phone.value || "",
      gender: form.gender.value,
      avatar: form.avatar.files[0]?.name || "default-avatar.png",
    };

    try {
      setLoading(true);
      const res = await register(submitData); // call backend register API
      console.log("✅ Register success:", res.data);
      alert("Registration successful! You can now log in.");
      form.reset();
      setPreview(defaultAvatar);
      setUserData({
        name: "",
        email: "",
        username: "",
        password: "",
        phone: "",
        gender: "m",
        avatar: null,
      });
      Navigate("/login", { replace: true });
    } catch (err) {
      console.error("❌ Register failed:", err);
      setFormError(
        "Registration failed. Please check your input and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#f8f4ef] text-gray-800">
      {/* ===== background img on left ===== */}
      <div
        className="lg:w-1/2 w-full h-64 lg:h-full bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${registerBg})`,
        }}
      >
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10">
          <h1 className="text-5xl font-bold drop-shadow-md mb-2">Hello Café</h1>
          <p className="text-lg opacity-90">Join our cozy community ☕</p>
        </div>
      </div>

      {/* ===== register form on right ===== */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 lg:px-24 py-12 bg-white">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center text-[#6b4f3b] mb-8">
            Create Your Account ☕
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className={labelBoxStyle}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={inputBoxStyle}
                required
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className={labelBoxStyle}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                className={inputBoxStyle}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelBoxStyle}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="new-password"
                className={inputBoxStyle}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className={labelBoxStyle}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className={inputBoxStyle}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">{passwordError}</p>
              )}
            </div>

            {/* First & Last Name */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="firstName" className={labelBoxStyle}>
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Hello"
                  autoComplete="given-name"
                  className={inputBoxStyle}
                  required
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className={labelBoxStyle}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Cafe"
                  autoComplete="family-name"
                  className={inputBoxStyle}
                  required
                />
              </div>
            </div>

            {/* gender*/}
            <div>
              <label htmlFor="gender" className={labelBoxStyle}>
                Gender
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="gender"
                    value="m"
                    checked={userData.gender === "m"}
                    onChange={(e) =>
                      setUserData({ ...userData, gender: e.target.value })
                    }
                    className="w-4 h-4 accent-[#8d6e52]"
                  />
                  Male
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="gender"
                    value="f"
                    checked={userData.gender === "f"}
                    onChange={(e) =>
                      setUserData({ ...userData, gender: e.target.value })
                    }
                    className="w-4 h-4 accent-[#8d6e52]"
                  />
                  Female
                </label>
              </div>
            </div>

            {/* Avatar Upload */}
            <div>
              <label htmlFor="avatar" className={labelBoxStyle}>
                Avatar
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={preview}
                  alt="avatar preview"
                  className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
                />
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="text-sm text-gray-600"
                />
              </div>
            </div>

            {/* Phone (optional) */}
            <div>
              <label htmlFor="phone" className={labelBoxStyle}>
                Phone Number (optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(123) 456-7890"
                autoComplete="tel"
                className={inputBoxStyle}
              />
            </div>

            {/* error */}
            {formError && (
              <p className="text-red-500 text-sm text-center">{formError}</p>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#b08968] text-white py-2 rounded-lg font-medium transition-all duration-200 shadow-md ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#8d6e52] hover:scale-[1.02]"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
        <p className="text-sm text-gray-500 mt-8">
          © 2025 Hello Café. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
