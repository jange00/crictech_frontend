import { VideoCameraIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import VideoPanel from "./VideoPanel";

const ComparisonViewer = ({
  userVideoRef,
  expertVideoRef,
  userVideoUrl,
  expertVideoUrl,
  jointAngles,
  poseOverlayData,
  expertPoseOverlayData,
  isPlaying,
  onPlayPause,
  isDarkMode,
}) => {
  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

  return (
    <section className={`rounded-3xl border p-6 ${cardStyles}`}>
      <h3 className="mb-4 text-lg font-semibold">Comparison Viewer</h3>
      <div className="grid gap-6 lg:grid-cols-2">
        <VideoPanel
          videoRef={userVideoRef}
          videoUrl={userVideoUrl}
          title="Your Action"
          subtitle="Live Analysis"
          icon={VideoCameraIcon}
          iconColor="text-blue-600"
          isExpert={false}
          poseOverlayData={poseOverlayData}
          jointAngles={jointAngles}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          isDarkMode={isDarkMode}
        />
        <VideoPanel
          videoRef={expertVideoRef}
          videoUrl={expertVideoUrl}
          title="Expert Model"
          subtitle="Optimal Form"
          icon={CheckCircleIcon}
          iconColor="text-emerald-600"
          isExpert={true}
          poseOverlayData={expertPoseOverlayData}
          jointAngles={jointAngles}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          isDarkMode={isDarkMode}
        />
      </div>
    </section>
  );
};

export default ComparisonViewer;

