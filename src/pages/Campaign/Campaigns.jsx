// src/pages/campaign/Campaigns.jsx
import React, { useState } from "react";
import CampaignStepper from "./CampaignStepper";
import ExistingCampaigns from "./ExistingCampaigns";
import ViewTemplate from "./ViewTemplate";
import RecentCampaigns from "./RecentCampaigns";

const Campaigns = () => {
  const [activeView, setActiveView] = useState("home");
  const [campaignToEdit, setCampaignToEdit] = useState(null);
  const [templateToView, setTemplateToView] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-gray-700 to-purple-950 text-white p-4">
      {activeView === "home" && (
        <>
          <h1 className="text-4xl font-bold text-purple-400 mb-6">
            Campaign Control Center 📡
          </h1>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 w-full">
            <button
              onClick={() => setActiveView("campaigns")}
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg shadow-lg border border-purple-400 transition-all text-center"
            >
              Existing Campaigns
            </button>

            <button
              onClick={() => {
                setCampaignToEdit(null);
                setActiveView("stepper");
              }}
              className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg shadow-lg border border-green-400 transition-all text-center"
            >
              Create New Campaign
            </button>
          </div>

          {/* ✅ Recent Campaigns section */}
          <div className="w-full max-w-3xl ">
            <RecentCampaigns
              onView={(c) => {
                setTemplateToView(c);
                setActiveView("view");
              }}
            />
          </div>
        </>
      )}

      {activeView === "stepper" && (
        <CampaignStepper
          onCancel={() => {
            setActiveView("home");
            setCampaignToEdit(null);
          }}
          campaignToEdit={campaignToEdit}
        />
      )}

      {activeView === "campaigns" && (
        <ExistingCampaigns
          onClose={() => setActiveView("home")}
          onEdit={(campaign) => {
            console.log("Editing campaign:", campaign);
            setCampaignToEdit(campaign);
            setActiveView("stepper");
          }}
          onView={(template) => {
            console.log("Viewing template:", template);
            setTemplateToView(template);
            setActiveView("view");
          }}
        />
      )}

      {activeView === "view" && (
        <ViewTemplate
          template={templateToView}
          onClose={() => {
            setTemplateToView(null);
            setActiveView("campaigns");
          }}
        />
      )}
    </div>
  );
};

export default Campaigns;
