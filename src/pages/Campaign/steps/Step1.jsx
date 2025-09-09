import React, { useEffect, useState } from "react";
import Select from "react-select";
import { apiService } from "../../../services/api";
import { FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const Step1 = ({ formData, setFormData, onNext }) => {
  const [companies, setCompanies] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [scopeFilter, setScopeFilter] = useState("all");

  const [availableHrs, setAvailableHrs] = useState([]);
  const [hrFilter, setHrFilter] = useState("all");

  // ✅ Normalize hrList: convert objects → IDs
  useEffect(() => {
    if (formData.hrList && formData.hrList.length > 0) {
      const normalized = formData.hrList.map((hr) =>
        typeof hr === "string" ? hr : hr._id
      );
      if (JSON.stringify(normalized) !== JSON.stringify(formData.hrList)) {
        setFormData((prev) => ({ ...prev, hrList: normalized }));
      }
    }
  }, [formData.hrList, setFormData]);

  // ✅ Derive selected HRs correctly
  const selectedHrs = availableHrs.filter((hr) =>
    (formData.hrList || []).includes(hr._id)
  );

  // Custom styles for react-select (dark theme)
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#111827",
      borderColor: state.isFocused ? "#9333ea" : "#374151",
      boxShadow: "none",
      "&:hover": { borderColor: "#9333ea" },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1f2937",
      zIndex: 20,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#9333ea"
        : state.isFocused
        ? "#4b5563"
        : "transparent",
      color: "#fff",
      cursor: "pointer",
    }),
    input: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await apiService("get", "hr/companies");
        setCompanies(data || []);
        setCompanyOptions(
          (data || []).map((c) => ({ value: c.name, label: c.name }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch HRs when company changes
  useEffect(() => {
    const fetchHrs = async () => {
      if (!formData.company) return;
      try {
        const data = await apiService(
          "get",
          `hr/by-company?company=${formData.company}`
        );
        setAvailableHrs(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHrs();
  }, [formData.company]);

  // Filtering available HRs
  const filteredAvailableHrs = availableHrs.filter((hr) => {
    if ((formData.hrList || []).includes(hr._id)) return false; // already selected
    if (hrFilter === "verified") return hr.isVerified;
    if (hrFilter === "unverified") return !hr.isVerified;
    return true;
  });

  // Split by scope
  const globalHrs = filteredAvailableHrs.filter((hr) => hr.isGlobal);
  const userHrs = filteredAvailableHrs.filter((hr) => !hr.isGlobal);

  // Add/remove HRs
  const addHr = (hr) => {
    setFormData((prev) => ({
      ...prev,
      hrList: [...(prev.hrList || []), hr._id],
    }));
  };

  const removeHr = (id) => {
    setFormData((prev) => ({
      ...prev,
      hrList: (prev.hrList || []).filter((hrId) => hrId !== id),
    }));
  };

  const clearAllSelected = () => {
    setFormData((prev) => ({ ...prev, hrList: [] }));
  };

  const renderHrList = (hrs) => (
    <div className="space-y-1">
      {hrs.map((hr) => (
        <div
          key={hr._id}
          onClick={() => addHr(hr)}
          className="flex justify-between items-center p-2 hover:bg-gray-800 cursor-pointer rounded"
        >
          <div>
            <p className="text-sm font-medium">{hr.name}</p>
            <p className="text-xs text-gray-400">{hr.email}</p>
          </div>
          {hr.isVerified ? (
            <FiCheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <FiAlertCircle className="w-5 h-5 text-yellow-400" />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="text-white">
      <h4 className="text-xl font-bold text-purple-400 mb-6">
        Step 1: Campaign & Company Details
      </h4>

      {/* Campaign Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Campaign Name
        </label>
        <input
          type="text"
          placeholder="Enter campaign name"
          value={formData.campaignName || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, campaignName: e.target.value }))
          }
          className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white 
                 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
        />
      </div>

      {/* Company Name + Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Company Name
          </label>
          <Select
            options={companyOptions}
            value={
              companyOptions.find((c) => c.value === formData.company) || null
            }
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, company: selected?.value }))
            }
            placeholder="Select a company..."
            isSearchable
            styles={customSelectStyles}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Campaign Scope
          </label>
          <Select
            options={[
              { value: "all", label: "All" },
              { value: "global", label: "Global" },
              { value: "user", label: "User Added" },
            ]}
            value={{
              value: scopeFilter,
              label: scopeFilter.charAt(0).toUpperCase() + scopeFilter.slice(1),
            }}
            onChange={(selected) => setScopeFilter(selected.value)}
            isSearchable={false}
            styles={customSelectStyles}
          />
        </div>
      </div>

      {/* HR Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available HRs */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-purple-300">Available HRs</h5>
            <div className="space-x-2">
              {["all", "verified", "unverified"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setHrFilter(f)}
                  className={`px-2 py-1 rounded text-sm ${
                    hrFilter === f
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="border border-gray-700 rounded-md p-2 h-64 overflow-y-auto bg-gray-900">
            {scopeFilter === "all" && (
              <>
                <h6 className="text-xs uppercase text-gray-400 px-2 mb-1">
                  Global
                </h6>
                {renderHrList(globalHrs)}
                <h6 className="text-xs uppercase text-gray-400 px-2 mt-3 mb-1">
                  User Added
                </h6>
                {renderHrList(userHrs)}
              </>
            )}
            {scopeFilter === "global" && renderHrList(globalHrs)}
            {scopeFilter === "user" && renderHrList(userHrs)}
          </div>
        </div>

        {/* Selected HRs */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-purple-300">Selected HRs</h5>
            <button
              type="button"
              onClick={clearAllSelected}
              className="text-red-400 text-sm hover:underline"
            >
              Clear All
            </button>
          </div>
          <div className="border border-gray-700 rounded-md p-2 h-64 overflow-y-auto bg-gray-900">
            {selectedHrs.map((hr) => (
              <div
                key={hr._id}
                className="flex justify-between items-center p-2 hover:bg-gray-800 rounded"
              >
                <div>
                  <p className="text-sm font-medium">{hr.name}</p>
                  <p className="text-xs text-gray-400">{hr.email}</p>
                </div>
                <FiX
                  className="w-5 h-5 text-red-500 cursor-pointer"
                  onClick={() => removeHr(hr._id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
