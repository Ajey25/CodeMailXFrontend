// src/pages/campaign/Campaigns.jsx
import React, { useState } from "react";
import CampaignStepper from "./CampaignStepper";
import ExistingCampaigns from "./ExistingCampaigns";
import ViewTemplate from "./ViewTemplate"; // New component we'll create

const Campaigns = () => {
  const [activeView, setActiveView] = useState("home");
  const [campaignToEdit, setCampaignToEdit] = useState(null);
  const [templateToView, setTemplateToView] = useState(null); // New state for viewing templates

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-950 via-gray-700 to-purple-950 text-white p-8">
      {activeView === "home" && (
        <>
          <h1 className="text-4xl font-bold text-purple-400 mb-6">
            Campaign Control Center 📡
          </h1>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveView("campaigns")}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg shadow-lg border border-purple-400 transition-all"
            >
              Existing Campaigns
            </button>

            <button
              onClick={() => {
                setCampaignToEdit(null); // reset if creating new
                setActiveView("stepper");
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg shadow-lg border border-green-400 transition-all"
            >
              Create New Campaign
            </button>
          </div>

          {/* Scheduled Campaigns placeholder */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-purple-800 rounded-xl shadow-xl p-6 w-full max-w-4xl">
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">
              Scheduled Campaigns
            </h2>
            <p className="text-gray-400">No campaigns scheduled yet.</p>
          </div>
        </>
      )}

      {activeView === "stepper" && (
        <CampaignStepper
          onCancel={() => {
            setActiveView("home");
            setCampaignToEdit(null); // reset when canceling
          }}
          campaignToEdit={campaignToEdit} // pass campaign data if editing
        />
      )}

      {activeView === "campaigns" && (
        <ExistingCampaigns
          onClose={() => setActiveView("home")}
          onEdit={(campaign) => {
            console.log("Editing campaign:", campaign);
            setCampaignToEdit(campaign); // store campaign
            setActiveView("stepper"); // move to stepper with data
          }}
          onView={(template) => {
            console.log("Viewing template:", template);
            setTemplateToView(template); // store template
            setActiveView("view"); // navigate to view page
          }}
        />
      )}

      {activeView === "view" && (
        <ViewTemplate
          template={templateToView}
          onClose={() => {
            setTemplateToView(null);
            setActiveView("campaigns"); // go back to campaigns list
          }}
        />
      )}
    </div>
  );
};

export default Campaigns;
