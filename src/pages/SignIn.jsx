import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiService } from "../services/api";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // 👀 icons

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁 toggle state

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiService("POST", "/users/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res));
      localStorage.setItem("token", res.token);

      setTimeout(() => {
        toast.success(
          <span>
            Welcome back, <strong>{res?.name}</strong>!
          </span>
        );
      }, 100);

      navigate("/layout/dashboard");
    } catch (err) {
      setError(
        err?.message ||
          err?.error ||
          "Invalid email or password. Try again, agent."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 py-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md shadow-2xl"
      >
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Welcome Back, <span className="text-purple-500">Agent</span>
        </h2>

        {/* Form */}
        <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm sm:text-base"
              placeholder="you@domain.com"
            />
          </div>

          {/* Password with Eye Toggle */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm sm:text-base"
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

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
            <hr className="flex-grow border-gray-700" />
            <span className="mx-2 sm:mx-4">or continue with</span>
            <hr className="flex-grow border-gray-700" />
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="flex items-center justify-center gap-2 flex-1 py-2.5 sm:py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition text-sm sm:text-base">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              Google
            </button>

            <button className="flex items-center justify-center gap-2 flex-1 py-2.5 sm:py-3 bg-gray-800 text-white font-semibold rounded-lg border border-gray-600 hover:bg-gray-700 transition text-sm sm:text-base">
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="GitHub"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              GitHub
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-400 hover:text-purple-200 underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;
