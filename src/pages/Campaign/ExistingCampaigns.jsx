// src/pages/campaign/ExistingCampaigns.jsx
import React, { useEffect, useState } from "react";
import { apiService } from "../../services/api";
import SendCampaignPopup from "./SendCampaignPopup";

import {
  FiEdit2,
  FiEye,
  FiX,
  FiMail,
  FiUsers,
  FiFileText,
  FiClock,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

const ExistingCampaigns = ({ onClose, onEdit, onView }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCampaigns, setExpandedCampaigns] = useState({});
  const [sendPopupCampaign, setSendPopupCampaign] = useState(null);
  const [emailLimit, setEmailLimit] = useState(null);

  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const data = await apiService("GET", "campaigns/email-limit");
        setEmailLimit(data);
      } catch (err) {
        console.error("Failed to fetch email limit", err);
      }
    };
    fetchLimit();
  }, []);
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

  const toggleCampaignExpansion = (campaignId) => {
    setExpandedCampaigns((prev) => ({
      ...prev,
      [campaignId]: !prev[campaignId],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-4 md:p-6 w-full max-w-7xl mx-auto relative"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Your Campaigns
          </h2>
          <p className="text-gray-400 text-sm">
            Manage and review your outreach campaigns
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 text-gray-300 hover:text-white w-full sm:w-auto"
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
          placeholder="Search campaigns..."
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
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
                className="bg-gray-800/70 border border-gray-700 rounded-xl p-4 animate-pulse"
              >
                <div className="flex flex-col gap-4">
                  {/* Top Section */}
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-700 h-10 w-10 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-700 rounded w-1/2 md:w-1/3" />
                      <div className="h-3 bg-gray-700 rounded w-3/4 md:w-1/2" />
                    </div>
                    <div className="hidden md:block bg-gray-700 h-6 w-32 rounded" />
                  </div>

                  {/* Bottom Section */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 md:gap-6 flex-wrap">
                      <div className="h-3 bg-gray-700 rounded w-20" />
                      <div className="h-3 bg-gray-700 rounded w-24" />
                      <div className="h-3 bg-gray-700 rounded w-16" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-700 rounded-md" />
                      <div className="h-8 w-8 bg-gray-700 rounded-md" />
                      <div className="h-6 w-20 bg-gray-700 rounded-full" />
                    </div>
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
            <p className="text-gray-500 text-sm max-w-md mx-auto px-4">
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
                  <div className="flex flex-col gap-4">
                    {/* Campaign Info - Top Row */}
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-500/10 p-2.5 rounded-md flex-shrink-0">
                        <FiMail className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">
                          {c.campaignName}
                        </h3>
                        <div className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                          <FaBuilding className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{c.company}</span>
                        </div>
                      </div>
                      <button
                        className="md:hidden p-1 text-gray-500 hover:text-white"
                        onClick={() => toggleCampaignExpansion(c._id)}
                      >
                        {expandedCampaigns[c._id] ? (
                          <FiChevronUp size={18} />
                        ) : (
                          <FiChevronDown size={18} />
                        )}
                      </button>
                    </div>

                    {/* Campaign Details - Initially hidden on mobile, shown when expanded */}
                    <div
                      className={`${
                        expandedCampaigns[c._id] ? "block" : "hidden md:block"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:flex md:items-center md:justify-between gap-4">
                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <FiUsers className="w-4 h-4 text-green-400 flex-shrink-0" />
                            {c.hrList?.length || 0} recipients
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            {formatDate(c.createdAt)}
                          </span>
                        </div>

                        {/* Template Info */}
                        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700 w-fit">
                          <FiFileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="truncate max-w-[140px] md:max-w-[180px]">
                            {c.template?.name || "No template"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                        <div
                          className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                            c.status === "Pending"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : c.status === "Sent"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              c.status === "Pending"
                                ? "bg-amber-400"
                                : c.status === "Sent"
                                ? "bg-emerald-400"
                                : "bg-red-400"
                            }`}
                          ></span>
                          {c.status}
                        </div>

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

                          {/* Send / Send Again Button */}
                          <button
                            onClick={() => setSendPopupCampaign(c)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              c.status === "Sent"
                                ? "bg-green-700 hover:bg-green-600 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                            }`}
                          >
                            {c.status === "Sent" ? "Send Again" : "Send"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        {sendPopupCampaign && (
          <SendCampaignPopup
            campaign={sendPopupCampaign}
            emailLimit={emailLimit} // or pass emailLimit if you fetch it here too
            onClose={() => setSendPopupCampaign(null)}
            onSent={(id) => {
              setCampaigns((prev) =>
                prev.map((c) => (c._id === id ? { ...c, status: "Sent" } : c))
              );
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ExistingCampaigns;
