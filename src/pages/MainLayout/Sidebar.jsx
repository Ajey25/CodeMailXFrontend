import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiUsers,
  FiFileText,
  FiChevronLeft,
  FiMenu,
  FiKey,
  FiCalendar,
  FiX,
} from "react-icons/fi";
import { FaLock } from "react-icons/fa";

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detect mobile screen
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Close mobile sidebar when screen becomes desktop
  useEffect(() => {
    if (!isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [isMobile, mobileOpen, setMobileOpen]);

  // ✅ Check SMTP from localStorage
  const smtp = JSON.parse(localStorage.getItem("smtp")) || {};
  const hasSMTP = smtp?.email && smtp?.password;

  const navItems = [
    { label: "Dashboard", icon: <FiGrid />, path: "/layout/dashboard" },
    { label: "HRS", icon: <FiUsers />, path: "/layout/hrs" },
    { label: "Templates", icon: <FiFileText />, path: "/layout/templates" },
    {
      label: "Campaigns",
      icon: <FiCalendar />,
      path: hasSMTP ? "/layout/campaigns" : "#",
      locked: !hasSMTP,
    },
    { label: "Mail Keys", icon: <FiKey />, path: "/layout/mailkeys" },
  ];

  // Animation variants for mobile sidebar
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40,
        mass: 0.8,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40,
        mass: 0.8,
      },
    },
  };

  // Animation variants for overlay
  const overlayVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Animation variants for nav items (stagger effect)
  const navItemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const navContainerVariants = {
    open: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1,
      },
    },
  };

  // Desktop sidebar (no animation needed, just CSS transitions)
  if (!isMobile) {
    return (
      <div
        className={`bg-gray-900 text-white h-screen flex flex-col justify-between transition-all duration-300 relative ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Top: Logo & Toggle */}
        <div>
          <div className="flex items-center justify-between px-4 py-5">
            {/* Logo */}
            <div className="text-purple-500 font-bold text-xl whitespace-nowrap overflow-hidden">
              {collapsed ? (
                <button
                  onClick={() => setCollapsed(false)}
                  className="text-white text-2xl hover:text-gray-300 transition"
                >
                  <FiMenu />
                </button>
              ) : (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  ColdMailX
                </motion.span>
              )}
            </div>

            {/* Collapse Arrow (only if not collapsed) */}
            {!collapsed && (
              <motion.button
                onClick={() => setCollapsed(true)}
                className="text-white text-xl hover:text-gray-300 transition"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiChevronLeft />
              </motion.button>
            )}
          </div>

          {/* Nav Items */}
          <nav className="space-y-2 px-2">
            {navItems.map(({ label, icon, path, locked }, index) => (
              <NavLink
                key={label}
                to={path}
                onClick={(e) => {
                  if (locked) e.preventDefault();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 
                   ${
                     locked
                       ? "text-gray-500 cursor-not-allowed"
                       : "hover:bg-gray-800 hover:scale-105"
                   } 
                   ${isActive && !locked ? "bg-gray-800 text-purple-400" : ""}`
                }
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    className="text-lg"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {icon}
                  </motion.span>
                  {!collapsed && (
                    <motion.span
                      className="text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </div>
                {locked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                    }}
                  >
                    <FaLock className="text-xs text-gray-400 ml-2" />
                  </motion.div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom: Footer */}
        <div className="mb-4 px-4 text-sm text-gray-600">
          {!collapsed && (
            <motion.p
              className="text-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              v1.0 © ColdMailX
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  // Mobile sidebar with animations
  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          />

          {/* Mobile Sidebar */}
          <motion.div
            className="fixed top-0 left-0 z-50 w-64 bg-gray-900 text-white h-screen flex flex-col justify-between"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Top: Logo & Toggle */}
            <div>
              <motion.div
                className="flex items-center justify-between px-4 py-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {/* Logo */}
                <motion.div
                  className="text-purple-500 font-bold text-xl whitespace-nowrap"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  ColdMailX
                </motion.div>

                {/* Close Button */}
                <motion.button
                  onClick={() => setMobileOpen(false)}
                  className="text-white text-2xl hover:text-gray-300 transition"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX />
                </motion.button>
              </motion.div>

              {/* Nav Items with stagger animation */}
              <motion.nav
                className="space-y-2 px-2"
                variants={navContainerVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {navItems.map(({ label, icon, path, locked }) => (
                  <motion.div key={label} variants={navItemVariants}>
                    <NavLink
                      to={path}
                      onClick={(e) => {
                        if (locked) e.preventDefault();
                        else setMobileOpen(false); // Close sidebar on mobile after click
                      }}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 
                         ${
                           locked
                             ? "text-gray-500 cursor-not-allowed"
                             : "hover:bg-gray-800 active:scale-95"
                         } 
                         ${
                           isActive && !locked
                             ? "bg-gray-800 text-purple-400"
                             : ""
                         }`
                      }
                    >
                      <motion.div
                        className="flex items-center gap-3"
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.span
                          className="text-lg"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          {icon}
                        </motion.span>
                        <span className="text-sm">{label}</span>
                      </motion.div>
                      {locked && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: 0.3,
                            type: "spring",
                            stiffness: 500,
                            damping: 15,
                          }}
                        >
                          <FaLock className="text-xs text-gray-400 ml-2" />
                        </motion.div>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>
            </div>

            {/* Bottom: Footer */}
            <motion.div
              className="mb-4 px-4 text-sm text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <p className="text-xs">v1.0 © ColdMailX</p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
