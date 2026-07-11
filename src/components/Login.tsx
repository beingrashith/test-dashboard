import testtubeman from "../assets/testtubeman.png";
import navicon from "../assets/navicon.png";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { login, saveAuth } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (!formData.userId.trim() || !formData.password.trim()) {
        alert("Please enter User ID and Password");
        return;
      }

      const response = await login(formData);

      if (response.status === "success") {
        saveAuth(response.data);
        navigate("/create-test");
      }

      console.log("Login response:", response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Login failed");
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-[#F4F8FF] items-center justify-center">
        <img
          src={testtubeman}
          alt="Login Illustration"
          className="w-[420px] object-contain"
        />
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <img src={navicon} alt="PrepRoute" className="h-10 mb-8" />

          <h2 className="text-2xl font-semibold text-gray-800">Login</h2>

          <p className="text-gray-500 text-sm mt-2 mb-8">
            Use your company provided Login credentials
          </p>

          {/* User ID */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>

            <input
              type="text"
              name="userId"
              placeholder="Enter User ID"
              value={formData.userId}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-gray-300 border border-gray-300-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              placeholder="Enter Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-gray-300 border border-gray-300-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <button className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-12 rounded-md bg-[#5B7CFA] hover:bg-[#4F70F3] text-white font-medium transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
