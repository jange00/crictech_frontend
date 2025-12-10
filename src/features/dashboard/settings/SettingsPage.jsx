import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth";
import { toast } from "react-toastify";
import ProfileSection from "./components/ProfileSection";
import VideoPreferencesSection from "./components/VideoPreferencesSection";
import PrivacySection from "./components/PrivacySection";
import LogoutSection from "./components/LogoutSection";
import ConfirmationDialog from "../../../ui/common/ConfirmationDialog";

const SettingsPage = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

  const handleLogout = async () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
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
        </div>
      </header>

      {/* Profile Customization */}
      <ProfileSection user={user} isDarkMode={isDarkMode} />

      {/* Video Upload Preferences */}
      <VideoPreferencesSection isDarkMode={isDarkMode} />

      {/* Privacy Settings */}
      <PrivacySection
        profileData={{
          name: user?.name || user?.username || "Rohit",
          preferredHand: "right", // Only right hand is supported
        }}
        videoPreferences={{
          resolution: localStorage.getItem("videoResolution") || "1080p",
          frameRate: localStorage.getItem("videoFrameRate") || "60fps",
        }}
        isDarkMode={isDarkMode}
      />

      {/* Logout Section */}
      <LogoutSection onLogout={handleLogout} isDarkMode={isDarkMode} />

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
        title="Logout"
        message="Are you sure you want to logout? You will need to login again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonColor="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default SettingsPage;




