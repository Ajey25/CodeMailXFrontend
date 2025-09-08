// components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Navbar = ({ currentTab, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user.name || "User";
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("")
        .slice(0, 2)
    : "??";
  return (
    <div className="w-full bg-gray-800 text-white px-4 py-3 relative shadow-md flex items-center justify-end">
      {/* Centered Title */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-purple-400">
        {currentTab}
      </h1>

      {/* Profile Icon & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 transition"
        >
          {initials}
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-50 rounded-xl shadow-lg z-50 bg-white border border-gray-200 overflow-hidden">
            {/* User Info Header */}
            <div className="flex jurify-center gap-2 px-4 py-3 bg-purple-200 border-b border-gray-300">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold">
                {userName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <span className="text-s  text-gray-800">{userName}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 w-full transition-colors duration-200"
            >
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
