import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvide";
import { toast } from "react-toastify";
import ProfileSection from "./components/ProfileSection";
import VideoPreferencesSection from "./components/VideoPreferencesSection";
import PrivacySection from "./components/PrivacySection";
import LogoutSection from "./components/LogoutSection";

const SettingsPage = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

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
          preferredHand: localStorage.getItem("preferredHand") || "right",
        }}
        videoPreferences={{
          resolution: localStorage.getItem("videoResolution") || "1080p",
          frameRate: localStorage.getItem("videoFrameRate") || "60fps",
        }}
        isDarkMode={isDarkMode}
      />

      {/* Logout Section */}
      <LogoutSection onLogout={handleLogout} isDarkMode={isDarkMode} />
    </div>
  );
};

export default SettingsPage;




