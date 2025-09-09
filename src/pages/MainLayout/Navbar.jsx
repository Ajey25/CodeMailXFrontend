import React, { useState, useRef, useEffect } from "react";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { tabMapping } from "./tabMapping";

const Navbar = ({ onLogout, setMobileOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation();

  const currentTab = tabMapping[location.pathname] || "ColdMailX";

  // ✅ Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Close dropdown on outside click
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
        .map((w) => w[0]?.toUpperCase())
        .join("")
        .slice(0, 2)
    : "??";

  return (
    <div className="w-full bg-gray-800 text-white px-3 sm:px-4 py-3 shadow-md">
      <div className="flex items-center justify-between relative">
        {/* Left: Menu (mobile only) */}
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center justify-center w-8 h-8 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              <FiMenu size={18} />
            </button>
          )}
        </div>

        {/* Center: Title (always centered) */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="font-semibold text-purple-400 text-lg sm:text-xl whitespace-nowrap">
            {currentTab}
          </h1>
        </div>

        {/* Right: Profile */}
        <div className="flex items-center" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 transition"
          >
            {initials}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-12 rounded-xl shadow-lg z-50 bg-white border border-gray-200 overflow-hidden w-48">
              <div className="flex gap-2 px-4 py-3 bg-purple-200 border-b border-gray-300">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
                <span className="text-sm text-gray-800 truncate">
                  {userName}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 w-full transition-colors duration-200"
              >
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
