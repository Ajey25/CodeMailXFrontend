import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/api";
import HrViewModal from "./HrViewModal";
import { FaEye, FaEdit, FaUpload } from "react-icons/fa";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const requiredColumns = ["name", "email", "company"];
const optionalColumns = ["mobileNo", "title"];

const SkeletonRow = ({ isMobile }) => (
  <tr className="animate-pulse">
    <td className={`p-${isMobile ? "2" : "4"}`}>
      <div
        className={`h-4 bg-gray-700 rounded ${isMobile ? "w-20" : "w-24"}`}
      />
    </td>
    <td className={`p-${isMobile ? "2" : "4"}`}>
      <div
        className={`h-4 bg-gray-700 rounded ${isMobile ? "w-28" : "w-40"}`}
      />
    </td>
    <td className={`p-${isMobile ? "2" : "4"}`}>
      <div
        className={`h-4 bg-gray-700 rounded ${isMobile ? "w-24" : "w-32"}`}
      />
    </td>
    <td className={`p-${isMobile ? "2" : "4"}`}>
      <div className={`h-4 bg-gray-700 rounded w-16`} />
    </td>
    <td className={`p-${isMobile ? "2" : "4"}`}>
      <div
        className={`h-6 bg-gray-700 rounded ${isMobile ? "w-16" : "w-20"}`}
      />
    </td>
  </tr>
);

const Hrs = () => {
  const navigate = useNavigate();
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewHr, setViewHr] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiService("get", "hr/user");
      setHrs(res || []);
    } catch (error) {
      toast.error("Failed to fetch HR data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Validate headers
  const validateHeaders = (headers) => {
    const lowerHeaders = headers.map((h) => h.trim().toLowerCase());

    // Required check
    for (let col of requiredColumns) {
      if (!lowerHeaders.includes(col.toLowerCase())) {
        return `Missing required column: ${col}`;
      }
    }

    // Optional check (must match exactly if present)
    for (let h of lowerHeaders) {
      if (
        !requiredColumns.map((c) => c.toLowerCase()).includes(h) &&
        !optionalColumns.map((c) => c.toLowerCase()).includes(h)
      ) {
        return `Unexpected column "${h}". Allowed optional: ${optionalColumns.join(
          ", "
        )}`;
      }
    }

    return null; // valid
  };

  // 🔹 Handle file parse
  const handleFile = async (file) => {
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    let headers = [];

    try {
      if (ext === ".csv") {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true });
        headers = parsed.meta.fields;
      } else if (ext === ".xlsx") {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });
        headers = sheet[0];
      } else {
        toast.error("Only CSV or XLSX files are allowed");
        return;
      }

      const errorMsg = validateHeaders(headers || []);
      if (errorMsg) {
        toast.error(errorMsg);
        return;
      }

      // If valid → send API
      const formData = new FormData();
      formData.append("file", file);

      toast.loading("Uploading file...", { id: "upload" });
      await apiService("post", "hr/upload-bulk", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Bulk HRs uploaded successfully", { id: "upload" });
      fetchData();
      setShowUploadModal(false);
    } catch (err) {
      toast.error("Failed to process file", { id: "upload" });
    }
  };

  const filteredHrs = hrs.filter(
    (hr) =>
      hr.name.toLowerCase().includes(search.toLowerCase()) ||
      hr.email.toLowerCase().includes(search.toLowerCase()) ||
      hr.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className={`min-h-screen flex flex-col bg-gradient-to-br from-purple-950 via-gray-700 to-purple-950 text-white p-${
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
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/layout/hrs/add")}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
          >
            + Add HRs Email
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium flex items-center gap-2"
          >
            <FaUpload /> Bulk Upload
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
                        {hr.title || "-"}
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

      {/* 🔹 Bulk Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-11/12 md:w-1/2">
            <h2 className="text-xl font-bold mb-4 text-purple-400">
              Bulk Upload HRs
            </h2>
            <p className="text-sm mb-4 text-gray-300">
              Required columns:{" "}
              <span className="font-bold">name, email, company</span>
              <br />
              Optional columns:{" "}
              <span className="font-bold">mobileNo, title</span>
              <br />
              Columns must match exactly as written above.
            </p>

            <div
              className="border-2 border-dashed border-purple-500 p-6 rounded-lg text-center cursor-pointer hover:bg-purple-900/20"
              onClick={() => document.getElementById("fileInput").click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length) {
                  handleFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <p className="mb-2">📂 Drag & Drop your CSV/XLSX file here</p>
              <p className="text-gray-400">or click to select file</p>
              <input
                type="file"
                id="fileInput"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files.length) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Hrs;
