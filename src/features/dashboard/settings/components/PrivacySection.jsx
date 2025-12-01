import { useState } from "react";
import { ShieldCheckIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const PrivacySection = ({ profileData, videoPreferences, isDarkMode }) => {
  const [privacySettings, setPrivacySettings] = useState({
    shareAnalytics: localStorage.getItem("shareAnalytics") === "true" || false,
    emailNotifications: localStorage.getItem("emailNotifications") === "true" || true,
    dataCollection: localStorage.getItem("dataCollection") === "true" || true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

  const handlePrivacyUpdate = () => {
    setIsSaving(true);
    localStorage.setItem("shareAnalytics", privacySettings.shareAnalytics.toString());
    localStorage.setItem("emailNotifications", privacySettings.emailNotifications.toString());
    localStorage.setItem("dataCollection", privacySettings.dataCollection.toString());

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Privacy settings updated successfully");
    }, 500);
  };

  const handleDataExport = () => {
    try {
      const exportData = {
        profile: profileData,
        videoPreferences: videoPreferences,
        privacySettings: privacySettings,
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `crictech-settings-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <section className={`rounded-3xl border p-6 transition shadow-sm ${cardStyles}`}>
      <div className="mb-6 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isDarkMode ? "bg-slate-800 text-blue-300" : "bg-blue-50 text-blue-600"
          }`}
        >
          <ShieldCheckIcon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">Privacy Settings</h3>
      </div>

      <div className="space-y-4">
        {/* Share Analytics */}
        <div className="flex items-center justify-between rounded-2xl border p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:border-slate-800">
          <div className="flex-1">
            <p className={`text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
              Share Analytics Data
            </p>
            <p className={`mt-1 text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Help improve CricTech by sharing anonymous usage statistics
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPrivacySettings((prev) => ({ ...prev, shareAnalytics: !prev.shareAnalytics }))}
            className={`relative h-6 w-11 rounded-full transition ${
              privacySettings.shareAnalytics
                ? "bg-blue-600"
                : isDarkMode
                ? "bg-slate-700"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${
                privacySettings.shareAnalytics ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between rounded-2xl border p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:border-slate-800">
          <div className="flex-1">
            <p className={`text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
              Email Notifications
            </p>
            <p className={`mt-1 text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Receive updates about your analysis results and progress
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setPrivacySettings((prev) => ({ ...prev, emailNotifications: !prev.emailNotifications }))
            }
            className={`relative h-6 w-11 rounded-full transition ${
              privacySettings.emailNotifications
                ? "bg-blue-600"
                : isDarkMode
                ? "bg-slate-700"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${
                privacySettings.emailNotifications ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Data Collection */}
        <div className="flex items-center justify-between rounded-2xl border p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:border-slate-800">
          <div className="flex-1">
            <p className={`text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
              Data Collection
            </p>
            <p className={`mt-1 text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Allow CricTech to collect performance data for personalized insights
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPrivacySettings((prev) => ({ ...prev, dataCollection: !prev.dataCollection }))}
            className={`relative h-6 w-11 rounded-full transition ${
              privacySettings.dataCollection
                ? "bg-blue-600"
                : isDarkMode
                ? "bg-slate-700"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${
                privacySettings.dataCollection ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handlePrivacyUpdate}
            disabled={isSaving}
            className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 sm:px-6"
          >
            {isSaving ? "Saving..." : "Save Privacy Settings"}
          </button>
          <button
            type="button"
            onClick={handleDataExport}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              isDarkMode
                ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-blue-400"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600"
            } sm:px-6`}
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export Data
          </button>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;

