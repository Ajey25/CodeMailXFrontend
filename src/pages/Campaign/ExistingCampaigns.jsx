// src/pages/campaign/ExistingCampaigns.jsx
import React, { useEffect, useState } from "react";
import { apiService } from "../../services/api";

import {
  FiEdit2,
  FiEye,
  FiX,
  FiMail,
  FiUsers,
  FiFileText,
  FiClock,
  FiSearch,
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

const ExistingCampaigns = ({ onClose, onEdit, onView }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const data = await apiService("get", "campaigns");
        setCampaigns(data || []);
        setFilteredCampaigns(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Filter campaigns
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCampaigns(campaigns);
    } else {
      const filtered = campaigns.filter(
        (campaign) =>
          campaign.campaignName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          campaign.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.template?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredCampaigns(filtered);
    }
  }, [searchQuery, campaigns]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-7xl mx-auto relative"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Campaigns</h2>
          <p className="text-gray-400 text-sm">
            Manage and review your outreach campaigns
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 text-gray-300 hover:text-white"
        >
          <FiX size={16} />
          Close
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search campaigns by name, company or template..."
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/70 border border-gray-700 rounded-xl p-5 animate-pulse"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1 flex items-start gap-4">
                    <div className="bg-gray-700 h-10 w-10 rounded-md" />
                    <div className="space-y-2 w-full">
                      <div className="h-4 bg-gray-700 rounded w-1/3" />
                      <div className="flex gap-6">
                        <div className="h-3 bg-gray-700 rounded w-20" />
                        <div className="h-3 bg-gray-700 rounded w-24" />
                        <div className="h-3 bg-gray-700 rounded w-16" />
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block bg-gray-700 h-6 w-32 rounded" />
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-700 rounded-md" />
                    <div className="h-8 w-8 bg-gray-700 rounded-md" />
                    <div className="h-6 w-20 bg-gray-700 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-10 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-500/10 rounded-full mb-3">
              <FiMail className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-1">
              {searchQuery ? "No matching campaigns" : "No campaigns yet"}
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search terms."
                : "Create your first outreach campaign to get started."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {[...filteredCampaigns].reverse().map((c, index) => (
                <motion.div
                  key={c._id}
                  className="bg-gray-800/70 border border-gray-700 rounded-xl p-4 transition-all hover:border-purple-500 hover:shadow-md hover:shadow-purple-500/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.02,
                    ease: "easeOut",
                  }}
                  layout="position"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Campaign Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-500/10 p-2.5 rounded-md">
                          <FiMail className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {c.campaignName}
                          </h3>
                          <div className="flex items-center font-semibold text-indigo-300 gap-6 mt-1 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <FaBuilding className="w-4 h-4 " />
                              {c.company}
                            </span>
                            <span className="flex items-center gap-1 ">
                              <FiUsers className="w-4 h-4 text-green-400" />
                              {c.hrList?.length || 0} recipients
                            </span>
                            <span className="flex items-center gap-1 ">
                              <FiClock className="w-4 h-4 text-yellow-400" />
                              {formatDate(c.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
                      <FiFileText className="w-4 h-4 text-blue-400" />
                      <span className="truncate max-w-[180px]">
                        {c.template?.name}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(c.template)}
                        className="p-2 rounded-md bg-gray-700 hover:bg-purple-600 transition-colors"
                        title="View template"
                      >
                        <FiEye className="w-5 h-5 text-gray-300 hover:text-white" />
                      </button>
                      <button
                        onClick={() => onEdit(c)}
                        className="p-2 rounded-md bg-gray-700 hover:bg-blue-600 transition-colors"
                        title="Edit campaign"
                      >
                        <FiEdit2 className="w-5 h-5 text-gray-300 hover:text-white" />
                      </button>
                      <div
                        className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          c.status === "Pending"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            c.status === "Pending"
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                          }`}
                        ></span>
                        {c.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExistingCampaigns;
