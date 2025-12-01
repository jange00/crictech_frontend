import { useState, useRef, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { generatePoseOverlayData } from "./utils/poseUtils";
import { DEFAULT_FEEDBACK_DATA } from "./constants/feedbackConstants";
import ComparisonViewer from "./components/ComparisonViewer";
import FeedbackCards from "./components/FeedbackCards";

const FeedbackPage = ({ isDarkMode, feedbackData = null }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const userVideoRef = useRef(null);
  const expertVideoRef = useRef(null);

  const data = feedbackData || DEFAULT_FEEDBACK_DATA;

  const poseOverlayData = generatePoseOverlayData(data.jointAngles, false);
  const expertPoseOverlayData = generatePoseOverlayData(data.jointAngles, true);

  const handlePlayPause = () => {
    if (userVideoRef.current && expertVideoRef.current) {
      if (isPlaying) {
        userVideoRef.current.pause();
        expertVideoRef.current.pause();
      } else {
        userVideoRef.current.play();
        expertVideoRef.current.play();
      }
    }
  };

  const handleRewatch = () => {
    if (userVideoRef.current && expertVideoRef.current) {
      userVideoRef.current.currentTime = 0;
      expertVideoRef.current.currentTime = 0;
      userVideoRef.current.play();
      expertVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const userVideo = userVideoRef.current;
    const expertVideo = expertVideoRef.current;

    const handleTimeUpdate = () => {
      if (userVideo && expertVideo) {
        const currentTime = userVideo.currentTime;
        if (Math.abs(expertVideo.currentTime - currentTime) > 0.1) {
          expertVideo.currentTime = currentTime;
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (expertVideo) {
        expertVideo.play().catch(() => {});
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (expertVideo) {
        expertVideo.pause();
      }
    };

    if (userVideo) {
      userVideo.addEventListener("timeupdate", handleTimeUpdate);
      userVideo.addEventListener("play", handlePlay);
      userVideo.addEventListener("pause", handlePause);
    }

    return () => {
      if (userVideo) {
        userVideo.removeEventListener("timeupdate", handleTimeUpdate);
        userVideo.removeEventListener("play", handlePlay);
        userVideo.removeEventListener("pause", handlePause);
      }
    };
  }, []);

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className={`rounded-3xl border p-6 ${cardStyles}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">AI Feedback Analysis</h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Compare your action with the expert model and review AI-generated suggestions for improvement.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRewatch}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Rewatch Feedback
          </button>
        </div>
      </header>

      {/* Comparison Viewer */}
      <ComparisonViewer
        userVideoRef={userVideoRef}
        expertVideoRef={expertVideoRef}
        userVideoUrl={data.userVideoUrl}
        expertVideoUrl={data.expertVideoUrl}
        jointAngles={data.jointAngles}
        poseOverlayData={poseOverlayData}
        expertPoseOverlayData={expertPoseOverlayData}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        isDarkMode={isDarkMode}
      />

      {/* Textual Feedback Section */}
      <FeedbackCards feedbackItems={data.feedbackItems} isDarkMode={isDarkMode} />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleRewatch}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
        >
          <ArrowPathIcon className="h-5 w-5" />
          Rewatch Feedback
        </button>
        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
            isDarkMode
              ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-blue-400"
              : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600"
          }`}
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;

