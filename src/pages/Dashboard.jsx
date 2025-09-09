// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import {
  FiMail,
  FiShield,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiActivity,
  FiEye,
  FiStar,
} from "react-icons/fi";
import { apiService } from "../services/api"; // Adjust path as needed
import { FaLock } from "react-icons/fa";
// ----- HELPERS -----
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatShortDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const getBadgeTier = (count) => {
  if (count >= 200) return { tier: "Gold", nextAt: null };
  if (count >= 100) return { tier: "Silver", nextAt: 200 };
  if (count >= 50) return { tier: "Bronze", nextAt: 100 };
  return { tier: "None", nextAt: 50 };
};

const progressColor = (value, max) => {
  const pct = value / max;
  if (pct < 0.5) return "bg-emerald-500";
  if (pct < 0.9) return "bg-amber-500";
  return "bg-red-500";
};

const PIE_COLORS = ["#3B82F6", "#10B981", "#EF4444"]; // Created (blue), Sent (green), Failed (red)

// ----- COMPONENT -----
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await apiService("get", "users/dashboard");
        setDashboardData(data);
        if (data?.smtp) {
          localStorage.setItem("smtp", JSON.stringify(data.smtp));
          localStorage.setItem(
            "recentCampaigns",
            JSON.stringify(data.recentCampaigns)
          );
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-gray-800 to-purple-950 text-white flex items-center justify-center">
        <div className="max-w-7xl w-full px-4 py-8 space-y-6 animate-pulse">
          {/* Fake Title */}
          {/* <div className="h-8 w-48 bg-gray-700 rounded-lg" /> */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-300">
              Mission Control 🚀
            </h1>
          </div>

          {/* Fake Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="lg:col-span-6 bg-gray-900/50 rounded-2xl border border-purple-100/20 p-6 space-y-4"
              >
                {/* Fake header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-5 w-32 bg-gray-700 rounded mb-2" />
                    <div className="h-3 w-20 bg-gray-700 rounded" />
                  </div>
                  <div className="h-8 w-8 bg-gray-700 rounded-lg" />
                </div>

                {/* Fake body */}
                <div className="h-40 w-full bg-gray-800/60 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-gray-800 to-purple-950 text-white flex items-center justify-center">
        <div className="text-xl text-red-300">
          {error || "Failed to load dashboard"}
        </div>
      </div>
    );
  }

  const {
    campaigns,
    emailsSent,
    emailsSentToday,
    emailsSentLast5Days,
    globalHrCount,
    smtp,
    topCompanies,
    recentCampaigns,
  } = dashboardData;

  // Campaign metrics for pie chart - Created, Sent, Failed order
  const pieData = [
    { name: "Created", value: campaigns.total },
    { name: "Sent", value: campaigns.successful },
    { name: "Failed", value: campaigns.failed },
  ];

  // Prepare email history data for bar chart
  const emailHistoryData = emailsSentLast5Days.map((item) => ({
    ...item,
    shortDate: formatShortDate(item.date),
  }));

  // Badge logic
  const { tier, nextAt } = getBadgeTier(globalHrCount);
  const nextMsg =
    tier === "None"
      ? `Contribute ${Math.max(0, 50 - globalHrCount)} more to earn Bronze`
      : tier === "Bronze"
      ? `Contribute ${Math.max(0, 100 - globalHrCount)} more to earn Silver`
      : tier === "Silver"
      ? `Contribute ${Math.max(0, 200 - globalHrCount)} more to earn Gold`
      : `You reached Gold. Respect.`;

  const badgeConfig = {
    None: {
      bg: "from-gray-600 to-gray-700",
      text: "text-gray-200",
      border: "border-gray-500",
      icon: "text-gray-300",
      name: "Rookie",
      glow: "shadow-lg",
    },
    Bronze: {
      bg: "from-amber-600 to-amber-800",
      text: "text-amber-100",
      border: "border-amber-400",
      icon: "text-amber-200",
      name: "Bronze",
      glow: "shadow-amber-500/20 shadow-2xl",
    },
    Silver: {
      bg: "from-gray-400 to-gray-500",
      text: "text-gray-100",
      border: "border-gray-300",
      icon: "text-gray-200",
      name: "Silver",
      glow: "shadow-gray-400/20 shadow-2xl",
    },
    Gold: {
      bg: "from-yellow-400 to-yellow-600",
      text: "text-yellow-100",
      border: "border-yellow-300",
      icon: "text-yellow-200",
      name: "Gold",
      glow: "shadow-yellow-400/30 shadow-2xl",
    },
  };

  const currentBadge = badgeConfig[tier];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-gray-800 to-purple-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-300">
            Mission Control 🚀
          </h1>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Campaign Pie */}
          <div className="lg:col-span-6">
            <Card className="min-h-[320px] flex flex-col">
              <CardHeader
                title="Campaign Status"
                subtitle="Created vs Sent vs Failed"
                icon={<FiActivity className="w-5 h-5 text-purple-300" />}
              />
              <div className="flex flex-col lg:flex-row flex-1 items-center justify-between">
                {/* Left: Pie Chart */}
                <div className="h-52 w-full lg:w-2/3 mb-4 lg:mb-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={
                          pieData.every((d) => d.value === 0)
                            ? [{ name: "empty", value: 1 }]
                            : pieData
                        }
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={3}
                      >
                        {pieData.every((d) => d.value === 0) ? (
                          <Cell
                            fill="transparent"
                            stroke="rgba(156, 163, 175, 0.2 )"
                            strokeWidth={1}
                          />
                        ) : (
                          pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[index]}
                            />
                          ))
                        )}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#e5e7eb",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Right: Stats */}
                <div className="w-full lg:w-1/2 flex flex-col space-y-3 text-lg font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400">● Created</span>
                    <span className="mr-5">{campaigns.total ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400">● Sent</span>
                    <span className="mr-5">{campaigns.successful ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-400">● Failed</span>
                    <span className="mr-5">{campaigns.failed ?? 0}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Mail Key Card */}
          <div className="lg:col-span-6">
            {!smtp?.email || !smtp?.password ? (
              <Card className="min-h-[320px] relative flex flex-col items-center justify-center text-center bg-gray-800 border border-gray-700">
                {/* 🔒 Overlay lock */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                  <FaLock className="w-12 h-12 text-gray-400 mb-3" />
                  <div className="text-lg text-gray-300 mb-4 px-4">
                    Mail keys are{" "}
                    <span className="font-semibold text-white">locked</span>.
                    <br />
                    Without them, you cannot create campaigns or send mails.
                  </div>
                  <a
                    href="https://cold-mail-x.vercel.app/layout/mailkeys"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md"
                  >
                    Configure Mail Keys
                  </a>
                </div>
              </Card>
            ) : (
              <Card className="min-h-[320px] flex flex-col">
                <CardHeader
                  title="Mail Card Key"
                  subtitle="Operational credentials (sanitized)"
                  icon={<FiShield className="w-5 h-5 text-purple-300" />}
                />
                <div className="grid grid-cols-1 gap-1 mb-2">
                  <InfoRow label="Mail" value={smtp.email} icon={<FiMail />} />
                  <InfoRow
                    label="Nodemailer Password"
                    value={smtp.password}
                    icon={<FiShield />}
                  />
                </div>

                {/* Only quota here */}
                <div className="mt-auto mb-2">
                  <div className="text-xl text-gray-300 mb-3">
                    Mails sent today:{" "}
                    <span className="font-semi-bold text-white ">
                      {emailsSentToday}/300
                    </span>
                  </div>
                  <QuotaBar used={emailsSentToday} limit={300} height="h-5" />
                </div>
              </Card>
            )}
          </div>

          {/* Total Emails Sent with History Graph */}
          <div className="lg:col-span-6">
            <Card className="min-h-[320px] flex flex-col">
              <CardHeader
                title="Email Activity"
                subtitle="All-time dispatches with 5-day history"
                icon={<FiTrendingUp className="w-5 h-5 text-purple-300" />}
              />
              <div className="flex-1 flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between mb-4"
                >
                  <div>
                    <div className="text-5xl font-extrabold text-purple-300 tracking-tight">
                      {emailsSent.toLocaleString()}
                    </div>
                    <div className="text-gray-400 mt-2">
                      Through {smtp.email}
                    </div>
                  </div>
                </motion.div>

                {/* Email History Bar Chart */}
                <div className="mt-auto h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={emailHistoryData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#4B5563"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="shortDate"
                        stroke="#9CA3AF"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                        width={25}
                        domain={[0, 50]}
                        ticks={[0, 10, 20, 30, 40, 50]}
                        interval={0}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#e5e7eb",
                        }}
                        formatter={(value) => [`${value} emails`, "Count"]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Bar
                        dataKey="count"
                        fill="#A78BFA"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </div>

          {/* HR Contribution Badge - Fixed */}
          <div className="lg:col-span-6">
            <Card className="min-h-[320px] flex flex-col">
              <CardHeader
                title="HR Contribution"
                subtitle="Your impact on the talent pool"
                icon={<FiAward className="w-5 h-5 text-purple-300" />}
              />
              <div className="flex-1 flex flex-col items-center justify-center">
                {/* Achievement Badge */}
                <div
                  className={`relative w-40 h-40 rounded-full bg-gradient-to-br ${currentBadge.bg} border-4 ${currentBadge.border} flex items-center justify-center ${currentBadge.glow} `}
                >
                  {/* Badge Icon */}
                  <FiAward className={`w-12 h-12 ${currentBadge.icon}`} />

                  {/* Badge Info */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-center bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
                    <div className={`text-sm font-bold ${currentBadge.text}`}>
                      {currentBadge.name}
                    </div>
                    <div className={`text-xs ${currentBadge.text} opacity-80`}>
                      {globalHrCount} HR
                    </div>
                  </div>

                  {/* Badge shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full"></div>
                </div>

                {/* Progress to next tier */}
                <div className="w-full max-w-xs ">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress to next tier</span>
                    <span>
                      {nextAt ? `${globalHrCount}/${nextAt}` : "Max level"}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-300 transition-all duration-500 ease-out"
                      style={{
                        width: nextAt
                          ? `${Math.min(100, (globalHrCount / nextAt) * 100)}%`
                          : "100%",
                      }}
                    ></div>
                  </div>
                  <p className="text-center text-gray-400 text-sm mt-1">
                    {nextMsg}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Companies by HR */}
          <div className="lg:col-span-6">
            <Card>
              <CardHeader
                title="Top Companies by HR Count"
                subtitle="Strongest pools first"
                icon={<FiStar className="w-5 h-5 text-purple-300" />}
              />
              <div className="space-y-3">
                {topCompanies.map((item, idx) => {
                  const max = topCompanies[0]?.hrCount || 1;
                  const pct = Math.round((item.hrCount / max) * 100);
                  return (
                    <div
                      key={item.company + idx}
                      className="flex items-center gap-3 bg-gray-800/40 p-3 rounded-xl border border-gray-700/60"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                        <span className="text-sm text-purple-300 font-semibold">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-white">
                            {item.company}
                          </span>
                          <span className="text-gray-400">{item.hrCount}</span>
                        </div>
                        <div className="h-2 mt-2 bg-gray-700/60 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-purple-400 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Recent Campaigns */}
          <div className="lg:col-span-6">
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
        </div>
      </div>
    </div>
  );
};

// ----- UI PRIMITIVES -----
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

const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-center gap-3 bg-gray-800/40 p-3 rounded-lg border border-gray-700/60">
    <div className="p-2 rounded-md bg-gray-700/20 flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="font-semibold text-white">{value}</div>
    </div>
  </div>
);

const QuotaBar = ({ used, limit }) => {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="w-full h-3 bg-gray-700/60 rounded-full overflow-hidden border border-gray-700/60">
      <div
        className={`h-3 ${progressColor(
          used,
          limit
        )} rounded-full transition-all`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default Dashboard;
