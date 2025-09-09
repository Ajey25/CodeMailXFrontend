import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/api";
import HrViewModal from "./HrViewModal";
import { FaEye, FaEdit } from "react-icons/fa";

const SkeletonRow = ({ isMobile }) => (
  <tr className="animate-pulse">
    <td className={`p-${isMobile ? "2" : "4"}`}>
      <div
        className={`h-4 bg-gray-700 rounded ${isMobile ? "w-20" : "w-24"}`}
      ></div>
    </td>
    <td className={`p-${isMobile ? "2" : "4"}`}>
      <div
        className={`h-4 bg-gray-700 rounded ${isMobile ? "w-28" : "w-40"}`}
      ></div>
    </td>
    <td className={`p-${isMobile ? "2" : "4"}`}>
      <div
        className={`h-4 bg-gray-700 rounded ${isMobile ? "w-24" : "w-32"}`}
      ></div>
    </td>
    <td className={`p-${isMobile ? "2" : "4"}`}>
      <div
        className={`h-4 bg-gray-700 rounded ${isMobile ? "w-16" : "w-16"}`}
      ></div>
    </td>
    <td className={`p-${isMobile ? "2" : "4"}`}>
      <div
        className={`h-6 bg-gray-700 rounded ${isMobile ? "w-16" : "w-20"}`}
      ></div>
    </td>
  </tr>
);

const Hrs = () => {
  const navigate = useNavigate();
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewHr, setViewHr] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async (filter = "all") => {
    setLoading(true);
    try {
      let endpoint = "hr";
      if (filter === "global") endpoint = "hr/global";
      if (filter === "user") endpoint = "hr/user";

      const res = await apiService("get", endpoint);
      setHrs(res || []);
    } catch (error) {
      toast.error("Failed to fetch HR data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeFilter);
  }, [activeFilter]);

  const filteredHrs = hrs.filter(
    (hr) =>
      hr.name.toLowerCase().includes(search.toLowerCase()) ||
      hr.email.toLowerCase().includes(search.toLowerCase()) ||
      hr.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className={`min-h-screen flex flex-col bg-gradient-to-br from-purple-950 via-gray-700 to-purple-950 text-white py-${
        isMobile ? "2" : "4"
      } px-${isMobile ? "4" : "8"}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div
        className={`flex flex-col md:flex-row justify-between items-center mb-6 gap-${
          isMobile ? "2" : "4"
        }`}
      >
        <h1
          className={`text-${
            isMobile ? "2xl" : "3xl"
          } font-bold text-purple-400`}
        >
          HRs Email List 📃
        </h1>
        <button
          onClick={() => navigate("/layout/hrs/add")}
          className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium`}
        >
          + Add HRs Email
        </button>
      </div>

      {/* Filters & Search */}
      <div
        className={`flex flex-col md:flex-row justify-between items-center gap-${
          isMobile ? "2" : "4"
        } mb-6`}
      >
        <div className="flex gap-2">
          {["all", "global", "user"].map((filter) => (
            <button
              key={filter}
              className={`px-3 py-1 rounded-lg ${
                activeFilter === filter ? "bg-purple-500" : "bg-gray-700"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search..."
          className={`px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none w-full md:w-64`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table (Single view for all screen sizes) */}
      <div className="overflow-x-auto rounded-xl border border-purple-800 bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow-lg">
        <table className="w-full text-left text-sm md:text-base">
          <thead>
            <tr className="bg-gray-900 text-gray-300">
              <th className={`p-${isMobile ? "2" : "4"}`}>Name</th>
              <th className={`p-${isMobile ? "2" : "4"}`}>Email</th>
              <th className={`p-${isMobile ? "2" : "4"}`}>Company</th>
              <th className={`p-${isMobile ? "2" : "4"}`}>Title</th>
              <th className={`p-${isMobile ? "2" : "4"} text-center`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <SkeletonRow key={idx} isMobile={isMobile} />
                  ))
              : filteredHrs.length > 0
              ? filteredHrs.map((hr) => {
                  const canEdit =
                    user.role === "admin" ||
                    (user.role === "user" && hr.addedBy === user._id);

                  return (
                    <tr
                      key={hr._id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition"
                    >
                      <td className={`p-${isMobile ? "2" : "4"}`}>{hr.name}</td>
                      <td className={`p-${isMobile ? "2" : "4"}`}>
                        {hr.email}
                      </td>
                      <td className={`p-${isMobile ? "2" : "4"}`}>
                        {hr.company}
                      </td>
                      <td className={`p-${isMobile ? "2" : "4"}`}>
                        {hr.title}
                      </td>
                      <td
                        className={`p-${
                          isMobile ? "2" : "4"
                        } flex justify-center gap-2`}
                      >
                        <button
                          onClick={() => setViewHr(hr)}
                          className="px-3 py-1 flex items-center gap-1 bg-purple-600 hover:bg-purple-700 rounded-sm text-white text-sm"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() =>
                            canEdit &&
                            navigate(`/layout/hrs/edit/${hr._id}`, {
                              state: { hr },
                            })
                          }
                          disabled={!canEdit}
                          className={`px-3 py-1 flex items-center gap-1 rounded-sm text-sm ${
                            canEdit
                              ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                              : "bg-cyan-900 text-cyan-400 cursor-not-allowed"
                          }`}
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  );
                })
              : !loading && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-400">
                      No HRs found
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      <HrViewModal hr={viewHr} onClose={() => setViewHr(null)} />
    </motion.div>
  );
};

export default Hrs;
