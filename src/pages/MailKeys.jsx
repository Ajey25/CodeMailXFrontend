// pages/MailKeys.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { apiService } from "../services/api";
import { FiMail, FiKey, FiLoader } from "react-icons/fi";

const MailKeys = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const loggedInEmail = user.email || "";

  const [useLoggedEmail, setUseLoggedEmail] = useState(true);
  const [email, setEmail] = useState(loggedInEmail);
  const [appPassword, setAppPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", appPassword: "" });

  const validateFields = () => {
    let valid = true;
    let newErrors = { email: "", appPassword: "" };

    if (!useLoggedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Invalid email format";
        valid = false;
      }
    }

    const appPassRegex = /^[a-zA-Z0-9]{16}$/;
    if (!appPassword.trim()) {
      newErrors.appPassword = "App password is required";
      valid = false;
    } else if (!appPassRegex.test(appPassword)) {
      newErrors.appPassword = "Must be 16 characters (letters & numbers only)";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    try {
      await apiService("put", "users/smtp", { email, password: appPassword });
      toast.success("Mail keys saved successfully ✅");
      setAppPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save mail keys");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-8 bg-gradient-to-br from-purple-950 via-gray-700 to-purple-950 text-white py-16">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-purple-800 rounded-xl shadow-xl p-6 relative overflow-hidden"
      >
        {/* Glow Border */}
        <div className="absolute inset-0 rounded-xl border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.15)] pointer-events-none" />

        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-purple-400 mb-2 flex items-center gap-2"
        >
          <FiKey className="text-purple-300" /> Mail Keys Setup
        </motion.h1>
        <p className="text-sm text-gray-300 mb-6">
          Configure your Gmail & App Password for sending emails.
        </p>

        {/* Email Option */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm mb-2">
            <input
              type="checkbox"
              checked={useLoggedEmail}
              onChange={(e) => {
                const checked = e.target.checked;
                setUseLoggedEmail(checked);
                setEmail(checked ? loggedInEmail : "");
                setErrors({ ...errors, email: "" });
              }}
            />
            Use my login email ({loggedInEmail || "No email found"})
          </label>

          <AnimatePresence>
            {!useLoggedEmail && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="relative mb-6"
              >
                <div className="relative h-11">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-full pl-10 pr-4 rounded-lg bg-gray-900 border ${
                      errors.email
                        ? "border-red-500 focus:border-red-400"
                        : "border-purple-700 focus:border-purple-500"
                    } focus:outline-none`}
                  />
                </div>
                {errors.email && (
                  <p className="absolute text-xs text-red-400 mt-1">
                    {errors.email}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* App Password */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative mb-8"
        >
          <label className="block text-sm mb-2">Gmail App Password</label>
          <div className="relative h-11">
            <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter 16-character app password"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              className={`w-full h-full pl-10 pr-4 rounded-lg bg-gray-900 border ${
                errors.appPassword
                  ? "border-red-500 focus:border-red-400"
                  : "border-purple-700 focus:border-purple-500"
              } focus:outline-none`}
            />
          </div>
          {errors.appPassword && (
            <p className="absolute text-xs text-red-400 mt-1">
              {errors.appPassword}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-6">
            ⚠️{" "}
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 underline"
            >
              Create an app password here
            </a>{" "}
            (Enter app name → Copy app passwords → Paste it without spaces).
          </p>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" /> Saving...
            </>
          ) : (
            "Save Mail Keys"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MailKeys;
