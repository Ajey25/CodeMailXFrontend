// src/pages/campaign/RecentCampaigns.jsx
import React, { useEffect, useState } from "react";
import { FiClock, FiEye } from "react-icons/fi";

const formatDate = (date) => {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-gray-900/50 backdrop-blur-md border border-2xl border-purple-100/50 rounded-2xl shadow-xl p-5 ${className}`}
  >
    {children}
  </div>
);
const CardHeader = ({ title, subtitle, icon }) => (
  <div className="mb-4 flex items-center justify-between">
    <div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
      {icon}
    </div>
  </div>
);
const RecentCampaigns = ({ onView }) => {
  const [recentCampaigns, setRecentCampaigns] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentCampaigns")) || [];
    setRecentCampaigns(stored);
  }, []);

  return (
    <div className="">
      <Card>
        <CardHeader
          title="Recent Campaigns"
          subtitle="Latest outreach efforts"
          icon={<FiClock className="w-5 h-5 text-purple-300" />}
        />
        <div className="space-y-6 mb-1">
          {recentCampaigns && recentCampaigns.length > 0 ? (
            recentCampaigns.map((c, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/60 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">
                      {c.templateName}
                    </div>
                    <div className="text-sm text-gray-400">
                      {c.company} • {c.templateSubject}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Sent
                    </div>
                    {/* <button
                      title="View"
                      onClick={() => onView(c)}
                      className="p-2 rounded-lg bg-gray-700 hover:bg-purple-600 transition-colors"
                    >
                      <FiEye className="w-5 h-5 text-gray-200" />
                    </button> */}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Sent {formatDate(c.sendDate)}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400 italic">
              No recent campaigns found
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RecentCampaigns;
