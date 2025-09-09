import React, { useState } from "react";
import toast from "react-hot-toast";
import { apiService } from "../../services/api";
import { FiUsers, FiMail, FiAlertTriangle } from "react-icons/fi";

const SendCampaignPopup = ({ campaign, emailLimit, onClose, onSent }) => {
  const [isSending, setIsSending] = useState(false);

  const hrCount = campaign.hrList?.length || 0;
  const exceedsLimit = emailLimit && hrCount > emailLimit.remainingLimit;

  const handleSendNow = async () => {
    if (!campaign || isSending) return;

    if (exceedsLimit) {
      toast.error(
        "Selected HR count exceeds remaining email limit. Reduce HRs or try again tomorrow."
      );
      return;
    }

    setIsSending(true);
    try {
      await apiService("POST", `campaigns/${campaign._id}/send`);
      toast.success("Campaign sent successfully!");
      onSent && onSent(campaign._id);
      onClose();
    } catch (err) {
      console.error("Error sending campaign:", err);
      toast.error("Failed to send campaign, try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 px-4">
      <div className="bg-gray-900 border border-purple-700 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-bold text-purple-400 mb-4">
          Send Campaign Now?
        </h3>

        {/* Campaign Info */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
          <p className="text-gray-300 mb-3 text-sm sm:text-base">
            Campaign:{" "}
            <span className="font-semibold text-white">
              {campaign.campaignName}
            </span>
          </p>

          {/* HR Count Display */}
          <div className="flex items-center gap-2 mb-3">
            <FiUsers className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300 text-sm">
              Recipients:{" "}
              <span className="font-semibold text-white">{hrCount} HRs</span>
            </span>
          </div>

          {/* Email Limit Info */}
          {emailLimit && (
            <div className="flex items-center gap-2 mb-2">
              <FiMail className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 text-sm">
                Daily limit:{" "}
                <span className="font-medium text-white">
                  {emailLimit.remainingLimit} / {emailLimit.maxLimit}
                </span>
                <span className="text-gray-500 ml-1">remaining</span>
              </span>
            </div>
          )}
        </div>

        {/* Warning for Exceeding Limit */}
        {exceedsLimit && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <FiAlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium text-sm mb-1">
                  Exceeds Email Limit
                </p>
                <p className="text-red-300 text-xs">
                  This campaign requires {hrCount} emails, but you only have{" "}
                  {emailLimit.remainingLimit} emails remaining today.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Info */}
        {!exceedsLimit && emailLimit && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-green-400 text-sm">
                Ready to send! You'll have {emailLimit.remainingLimit - hrCount}{" "}
                emails remaining.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            disabled={isSending}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 text-sm sm:text-base ${
              isSending
                ? "border-gray-500 text-gray-400 cursor-not-allowed"
                : "border-gray-500 text-gray-300 hover:bg-gray-800"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSendNow}
            disabled={isSending || exceedsLimit}
            className={`px-4 py-2 rounded-lg flex items-center justify-center min-w-[100px] text-sm sm:text-base transition-all duration-200 ${
              isSending || exceedsLimit
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg"
            }`}
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              "Send Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendCampaignPopup;
