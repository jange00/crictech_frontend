import { PlayIcon, PauseIcon, VideoCameraIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import PoseOverlay from "./PoseOverlay";

const VideoPanel = ({
  videoRef,
  videoUrl,
  title,
  subtitle,
  icon: Icon,
  iconColor,
  isExpert = false,
  poseOverlayData,
  jointAngles,
  isPlaying,
  onPlayPause,
  isDarkMode,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className={`text-sm font-semibold ${iconColor}`}>{title}</h4>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {Icon && <Icon className={`h-4 w-4 ${isExpert ? "text-emerald-500" : ""}`} />}
          <span>{subtitle}</span>
        </div>
      </div>
      <div
        className={`relative overflow-hidden rounded-2xl border-2 bg-slate-900 ${
          isExpert ? "border-emerald-500/30" : "border-blue-500/30"
        }`}
      >
        {videoUrl ? (
          <video ref={videoRef} src={videoUrl} className="h-full w-full bg-black" controls={false} />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-slate-800">
            <div className="text-center">
              {isExpert ? (
                <CheckCircleIcon className="mx-auto h-12 w-12 text-emerald-500" />
              ) : (
                <VideoCameraIcon className="mx-auto h-12 w-12 text-slate-500" />
              )}
              <p className="mt-2 text-sm text-slate-400">
                {isExpert ? "Expert model reference" : "User video placeholder"}
              </p>
            </div>
          </div>
        )}
        {poseOverlayData && (
          <PoseOverlay
            overlayData={poseOverlayData}
            jointAngles={jointAngles}
            isExpert={isExpert}
            isDarkMode={isDarkMode}
          />
        )}
        {!isExpert && (
          <button
            type="button"
            onClick={onPlayPause}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600/90 p-3 text-white shadow-lg transition hover:bg-blue-700"
          >
            {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
          </button>
        )}
      </div>
      {/* Joint angles summary */}
      <div
        className={`rounded-xl border p-3 ${
          isDarkMode ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-slate-50"
        }`}
      >
        <p className="mb-2 text-xs font-semibold text-slate-500">
          {isExpert ? "Optimal Angles" : "Key Joint Angles"}
        </p>
        <div className="space-y-2">
          {jointAngles.map((joint) => (
            <div key={joint.joint} className="flex items-center justify-between text-xs">
              <span className={isDarkMode ? "text-slate-300" : "text-slate-600"}>{joint.joint}</span>
              <span
                className={`font-semibold ${
                  isExpert
                    ? "text-emerald-600"
                    : joint.status === "warning"
                    ? "text-rose-600"
                    : "text-emerald-600"
                }`}
              >
                {isExpert ? joint.expertAngle : joint.userAngle}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;


