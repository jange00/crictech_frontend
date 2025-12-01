import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvide";
import {
  UserCircleIcon,
  PhotoIcon,
  VideoCameraIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const SettingsPage = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const fileInputRef = useRef(null);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.username || "Rohit",
    preferredHand: localStorage.getItem("preferredHand") || "right",
    profilePicture: localStorage.getItem("profilePicture") || null,
  });

  // Video preferences state
  const [videoPreferences, setVideoPreferences] = useState({
    resolution: localStorage.getItem("videoResolution") || "1080p",
    frameRate: localStorage.getItem("videoFrameRate") || "60fps",
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    shareAnalytics: localStorage.getItem("shareAnalytics") === "true" || false,
    emailNotifications: localStorage.getItem("emailNotifications") === "true" || true,
    dataCollection: localStorage.getItem("dataCollection") === "true" || true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

  // Handle profile picture upload
  const handlePictureUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setProfileData((prev) => ({ ...prev, profilePicture: base64String }));
      localStorage.setItem("profilePicture", base64String);
      toast.success("Profile picture updated successfully");
    };
    reader.readAsDataURL(file);
  };

  // Handle profile update
  const handleProfileUpdate = () => {
    setIsSaving(true);
    localStorage.setItem("preferredHand", profileData.preferredHand);
    if (profileData.profilePicture) {
      localStorage.setItem("profilePicture", profileData.profilePicture);
    }
    
    // Update user in localStorage if exists
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        userData.name = profileData.name;
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus("saved");
      toast.success("Profile updated successfully");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 500);
  };

  // Handle video preferences update
  const handleVideoPreferencesUpdate = () => {
    setIsSaving(true);
    localStorage.setItem("videoResolution", videoPreferences.resolution);
    localStorage.setItem("videoFrameRate", videoPreferences.frameRate);
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus("saved");
      toast.success("Video preferences updated successfully");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 500);
  };

  // Handle privacy settings update
  const handlePrivacyUpdate = () => {
    setIsSaving(true);
    localStorage.setItem("shareAnalytics", privacySettings.shareAnalytics.toString());
    localStorage.setItem("emailNotifications", privacySettings.emailNotifications.toString());
    localStorage.setItem("dataCollection", privacySettings.dataCollection.toString());
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus("saved");
      toast.success("Privacy settings updated successfully");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 500);
  };

  // Handle data export
  const handleDataExport = () => {
    try {
      const exportData = {
        profile: {
          name: profileData.name,
          preferredHand: profileData.preferredHand,
        },
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

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className={`rounded-3xl border p-6 transition shadow-sm ${cardStyles}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Settings</h2>
            <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Update notification preferences, export data, and manage your account settings from here.
            </p>
          </div>
          {saveStatus === "saved" && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600">
              <CheckCircleIcon className="h-5 w-5" />
              Saved
            </div>
          )}
        </div>
      </header>

      {/* Profile Customization */}
      <section className={`rounded-3xl border p-6 transition shadow-sm ${cardStyles}`}>
        <div className="mb-6 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isDarkMode ? "bg-slate-800 text-blue-300" : "bg-blue-50 text-blue-600"
            }`}
          >
            <UserCircleIcon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold">Profile Customization</h3>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-shrink-0">
              <div className="relative">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="h-24 w-24 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div
                    className={`flex h-24 w-24 items-center justify-center rounded-2xl border-2 ${
                      isDarkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <UserCircleIcon className="h-12 w-12 text-slate-400" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    isDarkMode
                      ? "border-slate-800 bg-slate-900 text-blue-300"
                      : "border-white bg-blue-600 text-white"
                  } shadow-md transition hover:bg-blue-700`}
                >
                  <PhotoIcon className="h-4 w-4" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePictureUpload}
              />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                Profile Picture
              </p>
              <p className={`mt-1 text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Click the camera icon to upload a new profile picture. Recommended size: 400x400px
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className={`mb-2 block text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={profileData.name}
              onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
              className={`w-full rounded-2xl border px-4 py-3 text-sm transition ${
                isDarkMode
                  ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                  : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              }`}
              placeholder="Enter your full name"
            />
          </div>

          {/* Preferred Hand */}
          <div>
            <label
              htmlFor="preferredHand"
              className={`mb-2 block text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
            >
              Preferred Hand
            </label>
            <div className="flex gap-3">
              {["left", "right"].map((hand) => (
                <button
                  key={hand}
                  type="button"
                  onClick={() => setProfileData((prev) => ({ ...prev, preferredHand: hand }))}
                  className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    profileData.preferredHand === hand
                      ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : isDarkMode
                      ? "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {hand.charAt(0).toUpperCase() + hand.slice(1)} Hand
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleProfileUpdate}
            disabled={isSaving}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 sm:w-auto sm:px-6"
          >
            {isSaving ? "Saving..." : "Save Profile Changes"}
          </button>
        </div>
      </section>

      {/* Video Upload Preferences */}
      <section className={`rounded-3xl border p-6 transition shadow-sm ${cardStyles}`}>
        <div className="mb-6 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isDarkMode ? "bg-slate-800 text-blue-300" : "bg-blue-50 text-blue-600"
            }`}
          >
            <VideoCameraIcon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold">Video Upload Preferences</h3>
        </div>

        <div className="space-y-6">
          {/* Resolution */}
          <div>
            <label
              htmlFor="resolution"
              className={`mb-2 block text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
            >
              Preferred Resolution
            </label>
            <select
              id="resolution"
              value={videoPreferences.resolution}
              onChange={(e) => setVideoPreferences((prev) => ({ ...prev, resolution: e.target.value }))}
              className={`w-full rounded-2xl border px-4 py-3 text-sm transition ${
                isDarkMode
                  ? "border-slate-700 bg-slate-800 text-slate-100 focus:border-blue-500 focus:outline-none"
                  : "border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              }`}
            >
              <option value="720p">720p (HD)</option>
              <option value="1080p">1080p (Full HD)</option>
              <option value="1440p">1440p (2K)</option>
              <option value="2160p">2160p (4K)</option>
            </select>
            <p className={`mt-1 text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Higher resolution provides better analysis accuracy but requires more storage
            </p>
          </div>

          {/* Frame Rate */}
          <div>
            <label
              htmlFor="frameRate"
              className={`mb-2 block text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
            >
              Preferred Frame Rate
            </label>
            <select
              id="frameRate"
              value={videoPreferences.frameRate}
              onChange={(e) => setVideoPreferences((prev) => ({ ...prev, frameRate: e.target.value }))}
              className={`w-full rounded-2xl border px-4 py-3 text-sm transition ${
                isDarkMode
                  ? "border-slate-700 bg-slate-800 text-slate-100 focus:border-blue-500 focus:outline-none"
                  : "border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              }`}
            >
              <option value="30fps">30 fps</option>
              <option value="60fps">60 fps (Recommended)</option>
              <option value="120fps">120 fps</option>
            </select>
            <p className={`mt-1 text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Higher frame rates improve motion analysis precision
            </p>
          </div>

          <button
            type="button"
            onClick={handleVideoPreferencesUpdate}
            disabled={isSaving}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 sm:w-auto sm:px-6"
          >
            {isSaving ? "Saving..." : "Save Video Preferences"}
          </button>
        </div>
      </section>

      {/* Privacy Settings */}
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
              onClick={() =>
                setPrivacySettings((prev) => ({ ...prev, shareAnalytics: !prev.shareAnalytics }))
              }
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
              onClick={() =>
                setPrivacySettings((prev) => ({ ...prev, dataCollection: !prev.dataCollection }))
              }
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

      {/* Logout Section */}
      <section className={`rounded-3xl border p-6 transition shadow-sm ${cardStyles}`}>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
              Account Actions
            </h3>
            <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Sign out of your CricTech account
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-rose-500 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/50 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/30"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;

