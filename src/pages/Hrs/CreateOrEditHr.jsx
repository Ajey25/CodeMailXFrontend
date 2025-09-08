import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { apiService } from "../../services/api";

const initialForm = {
  name: "",
  email: "",
  company: "",
  title: "",
  mobileNo: "",
  isGlobal: false,
  isVerified: false,
};

const CreateOrEditHr = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { state } = useLocation();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [pendingVerify, setPendingVerify] = useState(false);

  // Fill form instantly if HR data was passed via navigation
  useEffect(() => {
    if (isEdit && state?.hr) {
      const hr = state.hr;
      setForm({
        name: hr.name || "",
        email: hr.email || "",
        company: hr.company || "",
        title: hr.title || "",
        mobileNo: hr.mobileNo || "",
        isGlobal: !!hr.isGlobal,
        isVerified: !!hr.isVerified,
      });
    }
  }, [isEdit, state]);

  // Fallback fetch if editing and no state.hr
  useEffect(() => {
    if (!isEdit || state?.hr) return;

    const load = async () => {
      setFetching(true);
      try {
        const res = await apiService("get", `hr/${id}`);
        setForm({
          name: res.name || "",
          email: res.email || "",
          company: res.company || "",
          title: res.title || "",
          mobileNo: res.mobileNo || "",
          isGlobal: !!res.isGlobal,
          isVerified: !!res.isVerified,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load HR. Maybe it doesn't exist.");
        navigate("/layout/hrs");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, isEdit, state, navigate]);

  const handleVerifyChange = (e) => {
    if (e.target.checked) {
      setShowVerifyPopup(true);
    } else {
      setForm((prev) => ({ ...prev, isVerified: false }));
    }
  };

  const handleChange = (e) => {
    const { id: key, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [key]: type === "checkbox" ? checked : value,
    }));

    // Clear error for field when user types
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) newErrors.email = "Enter a valid email";
    }
    if (!form.mobileNo.trim()) newErrors.mobileNo = "Mobile number is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };

      if (isEdit) {
        const res = await apiService("put", `hr/${id}`, payload);
        toast.success(
          <div>
            <strong>{res.name || form.name}</strong> updated successfully!
          </div>
        );
      } else {
        const res = await apiService("post", "hr", payload);
        toast.success(
          <div>
            Added HR <strong>{res.name || form.name}</strong> successfully!
          </div>
        );
      }

      setTimeout(() => {
        navigate("/layout/hrs");
      }, 600);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to save HR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="min-h-screen flex items-start justify-center p-8 bg-gradient-to-br from-purple-950 via-gray-700 to-purple-950 text-white"
    >
      <div className="w-full max-w-3xl bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-purple-800 rounded-xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-purple-300">
            {isEdit ? "Edit HR" : "Add HR"}
          </h2>
          <button
            onClick={() => navigate("/layout/hrs")}
            className="text-sm text-gray-300 hover:text-white"
          >
            Cancel
          </button>
        </div>

        {fetching ? (
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-700 rounded" />
            ))}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="col-span-1 md:col-span-2">
              <label className="text-sm text-gray-300">Full name</label>
              <input
                id="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Ritesh P."
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                id="email"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="ritesh@company.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-300">Mobile</label>
              <input
                id="mobileNo"
                value={form.mobileNo}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="9876543210"
              />
              {errors.mobileNo && (
                <p className="text-red-400 text-xs mt-1">{errors.mobileNo}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-300">Company</label>
              <input
                id="company"
                value={form.company}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Company A"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Title</label>
              <input
                id="title"
                value={form.title}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="HR Head"
              />
            </div>

            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  id="isGlobal"
                  checked={form.isGlobal}
                  onChange={handleChange}
                  type="checkbox"
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-300">Global</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  id="isVerified"
                  checked={form.isVerified}
                  onChange={handleVerifyChange}
                  type="checkbox"
                  className="h-4 w-4"
                />

                <span className="text-sm text-gray-300">Verified</span>
              </label>
            </div>

            <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-3 mt-3">
              <button
                type="button"
                onClick={() => navigate("/layout/hrs")}
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 font-semibold disabled:opacity-50"
              >
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update HR"
                  : "Add HR"}
              </button>
            </div>
          </form>
        )}
      </div>
      {showVerifyPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">
              Verify Email
            </h3>
            <p className="text-gray-300 mb-4">
              Are you sure this email is already verified? If not, we can check
              it using the verification API.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
                onClick={() => {
                  setForm((prev) => ({ ...prev, isVerified: true }));
                  setShowVerifyPopup(false);
                }}
              >
                Yes, I’m sure
              </button>
              <button
                disabled={pendingVerify}
                className="px-3 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                onClick={async () => {
                  setPendingVerify(true);
                  try {
                    const res = await apiService("post", "hr/verify-emails", {
                      emails: [form.email],
                    });
                    if (res.results?.[0]?.status === "valid") {
                      setForm((prev) => ({ ...prev, isVerified: true }));
                      toast.success("Email verified successfully ✅");
                    } else {
                      setForm((prev) => ({ ...prev, isVerified: false }));
                      toast.error("Email is invalid ❌");
                    }
                  } catch (err) {
                    console.error(err.response);
                    if (err.response?.status === 429) {
                      toast.error(
                        err.response?.data?.error ||
                          "Daily verification limit reached 🚫"
                      );
                    }
                    // Fetch style (if apiService attaches status + data)
                    else if (err.status === 429) {
                      toast.error(
                        err.error || "Daily verification limit reached 🚫"
                      );
                    } else {
                      toast.error("Verification failed");
                    }

                    setForm((prev) => ({ ...prev, isVerified: false }));
                  } finally {
                    setPendingVerify(false);
                    setShowVerifyPopup(false);
                  }
                }}
              >
                Not sure, verify via API
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CreateOrEditHr;
