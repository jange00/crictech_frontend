import { useState, useRef } from "react";
import { UserCircleIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const ProfileSection = ({ user, isDarkMode, onSave }) => {
  const fileInputRef = useRef(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.username || "Rohit",
    preferredHand: localStorage.getItem("preferredHand") || "right",
    profilePicture: localStorage.getItem("profilePicture") || null,
  });
  const [isSaving, setIsSaving] = useState(false);

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

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

  const handleProfileUpdate = () => {
    setIsSaving(true);
    localStorage.setItem("preferredHand", profileData.preferredHand);
    if (profileData.profilePicture) {
      localStorage.setItem("profilePicture", profileData.profilePicture);
    }

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
      toast.success("Profile updated successfully");
      if (onSave) onSave();
    }, 500);
  };

  return (
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
  );
};

export default ProfileSection;




