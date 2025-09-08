import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiService } from "../services/api";
import { toast } from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

      // Save user + token
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Welcome Back, <span className="text-purple-500">Agent</span>
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
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
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="my-6">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <hr className="flex-grow border-gray-700" />
            <span className="mx-4">or continue with</span>
            <hr className="flex-grow border-gray-700" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-2 flex-1 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Google
            </button>

            <button className="flex items-center justify-center gap-2 flex-1 py-3 bg-gray-800 text-white font-semibold rounded-lg border border-gray-600 hover:bg-gray-700 transition">
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="GitHub"
                className="w-5 h-5"
              />
              GitHub
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400">
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
