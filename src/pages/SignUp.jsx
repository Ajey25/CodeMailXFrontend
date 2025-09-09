import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // 👀 icons
import { apiService } from "../services/api";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      };

      const res = await apiService("POST", "users/register", payload);

      if (res.token) {
        localStorage.setItem("user", JSON.stringify(res));
        navigate("/layout/dashboard");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 w-full max-w-4xl shadow-2xl"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Create your <span className="text-purple-500">MailBot</span> account
        </h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="you@domain.com"
            />
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-sm mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              required
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="+91 9876543210"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="col-span-1 md:col-span-2 text-center text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-purple-400 hover:text-purple-200 underline"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
