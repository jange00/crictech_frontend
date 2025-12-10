import { useState } from "react";
import { VideoCameraIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const VideoPreferencesSection = ({ isDarkMode }) => {
  const [videoPreferences, setVideoPreferences] = useState({
    resolution: localStorage.getItem("videoResolution") || "1080p",
    frameRate: localStorage.getItem("videoFrameRate") || "60fps",
  });
  const [isSaving, setIsSaving] = useState(false);

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

  const handleVideoPreferencesUpdate = () => {
    setIsSaving(true);
    localStorage.setItem("videoResolution", videoPreferences.resolution);
    localStorage.setItem("videoFrameRate", videoPreferences.frameRate);

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Video preferences updated successfully");
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
  );
};

export default VideoPreferencesSection;




