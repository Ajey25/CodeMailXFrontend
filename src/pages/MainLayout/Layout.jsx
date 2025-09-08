import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../MainLayout/Sidebar";
import Navbar from "../MainLayout/Navbar";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState("Dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("hrs")) setCurrentTab("HRS");
    if (location.pathname.includes("campaigns")) setCurrentTab("Campaigns");
    if (location.pathname.includes("mailkeys")) setCurrentTab("Mailkeys");
    else if (location.pathname.includes("templates"))
      setCurrentTab("Templates");
    else setCurrentTab("Dashboard");
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.error("You have been logged out.");
    navigate("/signin");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Main layout */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar currentTab={currentTab} onLogout={handleLogout} />

        {/* Animated content area */}
        <main className="flex-1 overflow-auto relative bg-gradient-to-br from-purple-950 via-gray-800 to-purple-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
