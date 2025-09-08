import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiKey,
  FiTarget,
  FiCalendar,
} from "react-icons/fi";

const navItems = [
  { label: "Dashboard", icon: <FiGrid />, path: "/layout/dashboard" },
  { label: "HRS", icon: <FiUsers />, path: "/layout/hrs" },
  { label: "Templates", icon: <FiFileText />, path: "/layout/templates" },
  { label: "Campaigns", icon: <FiCalendar />, path: "/layout/campaigns" },

  { label: "Mail Keys", icon: <FiKey />, path: "/layout/mailkeys" },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <div
      className={`bg-gray-900 text-white h-screen flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-15" : "w-50"
      }`}
    >
      {/* Top: Logo & Toggle */}
      <div>
        <div className="flex items-center justify-between px-4 py-5">
          {/* Logo */}
          <div className="text-purple-500 font-bold text-xl whitespace-nowrap">
            {collapsed ? (
              <button
                onClick={() => setCollapsed(false)}
                className="text-white text-2xl"
              >
                <FiMenu />
              </button>
            ) : (
              "ColdMailX"
            )}
          </div>

          {/* Collapse Arrow (only if not collapsed) */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="text-white text-xl"
            >
              <FiChevronLeft />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav className="space-y-2 px-2">
          {navItems.map(({ label, icon, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-gray-800 ${
                  isActive ? "bg-gray-800 text-purple-400" : "text-gray-300"
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {!collapsed && <span className="text-sm">{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom: Footer */}
      <div className="mb-4 px-4 text-sm text-gray-600">
        {!collapsed && <p className="text-xs">v1.0 © ColdMailX</p>}
      </div>
    </div>
  );
};

export default Sidebar;
