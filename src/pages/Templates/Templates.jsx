import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TemplateList from "../Templates/TemplateList";
import { apiService } from "../../services/api";
import { useParams } from "react-router-dom";

const Templates = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await apiService("get", "templates");
      setTemplates(data || []);
    } catch (err) {
      toast.error("Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter((t) =>
    t.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Don't render anything if we're in edit mode (TemplateForm will handle this)
  if (id) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-br from-purple-950 via-gray-700 to-purple-950 text-white py-4 px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-purple-400">Templates 📝</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/layout/templates/AITemplateForm")}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
          >
            + AI Template
          </button>
          <button
            onClick={() => navigate("/layout/templates/new")}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
          >
            + Custom Template
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search templates..."
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Template List */}
      <div className="rounded-xl border border-purple-800 bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow-lg p-3">
        <TemplateList templates={filteredTemplates} loading={loading} />
      </div>
    </motion.div>
  );
};

export default Templates;
