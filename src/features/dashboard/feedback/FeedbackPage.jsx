import { useState, useRef, useEffect, useMemo } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { generatePoseOverlayData } from "./utils/poseUtils";
import { DEFAULT_FEEDBACK_DATA } from "./constants/feedbackConstants";
import ComparisonViewer from "./components/ComparisonViewer";
import FeedbackCards from "./components/FeedbackCards";
import { useAnalysis } from "../../../hooks/useAnalysis";

const FeedbackPage = ({ isDarkMode, analysisId = null }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const userVideoRef = useRef(null);
  const expertVideoRef = useRef(null);

  // Fetch data
  const { useFeedback, useSingleAnalysis } = useAnalysis();
  const { data: feedbackData, isLoading: feedbackLoading } = useFeedback(analysisId);
  const { data: analysisData, isLoading: analysisLoading } = useSingleAnalysis(analysisId);

  // DEBUGGING: Check what the API is actually returning
  useEffect(() => {
    if (analysisData) console.log("📊 API Analysis Data:", analysisData);
    if (feedbackData) console.log("📊 API Feedback Data:", feedbackData);
  }, [analysisData, feedbackData]);

  const data = useMemo(() => {
    // 1. Determine the best source of truth
    // analysisData = The full document from DB (includes everything)
    // feedbackData = The result of /api/analysis/:id/feedback endpoint
    const source = analysisData || feedbackData;

    if (!source) {
      console.warn("⚠️ No data source found, using Defaults");
      return DEFAULT_FEEDBACK_DATA;
    }

    // 2. Extract specific fields safely (Handle different API response structures)

    // Joint Angles
    const rawJointAngles = source.jointAngles || source.feedback?.jointAngles || [];

    // Feedback Items (Handle 'feedbackItems' vs 'items' mismatch)
    const rawFeedbackItems =
      source.feedbackItems ||
      source.feedback?.items ||
      source.items ||
      [];

    // Metrics
    const metrics = source.metrics || source.feedback?.metrics || {};

    // Expert Comparison
    const expertComparison =
      source.expertComparison ||
      source.feedback?.expertComparison ||
      {};

    // Video URL (Usually in analysisData.sessionId.videoUrl)
    const userVideoUrl =
      source.sessionId?.videoUrl ||
      source.videoUrl ||
      "";

    // Normalise joint angles & feedback items so the UI can always render them
    const jointAngles =
      rawJointAngles && rawJointAngles.length > 0
        ? rawJointAngles.map((joint, idx) => ({
            id: joint.id || joint._id || `joint-${idx}`,
            ...joint,
          }))
        : DEFAULT_FEEDBACK_DATA.jointAngles;

    const feedbackItems =
      rawFeedbackItems && rawFeedbackItems.length > 0
        ? rawFeedbackItems.map((item, idx) => ({
            id: item.id || item._id || `feedback-${idx}`,
            ...item,
          }))
        : DEFAULT_FEEDBACK_DATA.feedbackItems;

    // 3. Validation: If data is empty, fallback to default to prevent white screen
    if (jointAngles.length === 0 && feedbackItems.length === 0) {
      console.warn("⚠️ Data source exists but arrays are empty. Analysis might be incomplete.");
      // You might want to return DEFAULT_FEEDBACK_DATA here, or keep empty to show "No Data" state
    }

    return {
      userVideoUrl,
      expertVideoUrl: expertComparison.expertVideoUrl || "", // Add a default expert video URL here if needed
      jointAngles,
      feedbackItems,
      metrics,
      expertComparison,
    };
  }, [feedbackData, analysisData]);

  // Generate overlays based on the computed data
  const poseOverlayData = useMemo(() => generatePoseOverlayData(data.jointAngles, false), [data.jointAngles]);
  const expertPoseOverlayData = useMemo(() => generatePoseOverlayData(data.jointAngles, true), [data.jointAngles]);

  const handlePlayPause = () => {
    const userVideo = userVideoRef.current;
    const expertVideo = expertVideoRef.current;

    if (!userVideo && !expertVideo) return;

    if (isPlaying) {
      if (userVideo) userVideo.pause();
      if (expertVideo) expertVideo.pause();
    } else {
      if (userVideo) userVideo.play();
      if (expertVideo) {
        // Do not block if expert video fails to play (e.g. no URL)
        expertVideo.play().catch(() => {});
      }
    }
  };

  const handleRewatch = () => {
    const userVideo = userVideoRef.current;
    const expertVideo = expertVideoRef.current;

    if (!userVideo && !expertVideo) return;

    if (userVideo) {
      userVideo.currentTime = 0;
      userVideo.play().catch(() => {});
    }
    if (expertVideo) {
      expertVideo.currentTime = 0;
      expertVideo.play().catch(() => {});
    }

    setIsPlaying(true);
  };

  // Synchronize Videos
  useEffect(() => {
    const userVideo = userVideoRef.current;
    const expertVideo = expertVideoRef.current;

    const handleTimeUpdate = () => {
      if (userVideo && expertVideo) {
        const currentTime = userVideo.currentTime;
        // Sync expert video if it drifts more than 0.1s
        if (Math.abs(expertVideo.currentTime - currentTime) > 0.1) {
          expertVideo.currentTime = currentTime;
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (expertVideo) expertVideo.play().catch(() => {});
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (expertVideo) expertVideo.pause();
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
  }, []); // Run once on mount

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

  // Loading State
  if (feedbackLoading || analysisLoading) {
    return (
      <div className={`rounded-3xl border p-6 ${cardStyles}`}>
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-blue-600" />
          <span>Loading feedback data...</span>
        </div>
      </div>
    );
  }

  // No Analysis Selected State
  if (!analysisId) {
    return (
      <div className={`rounded-3xl border p-6 ${cardStyles}`}>
        <h2 className="text-2xl font-semibold mb-2">AI Feedback Analysis</h2>
        <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          No analysis selected. Please complete an analysis first to view feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className={`rounded-3xl border p-6 ${cardStyles}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">AI Feedback Analysis</h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Compare your action with the expert model and review AI-generated suggestions.
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

      {/* Report Generation Button */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            try {
              const reportContent = `
CricTech AI Feedback Report
Generated: ${new Date().toLocaleString()}

=== METRICS ===
Speed: ${data.metrics?.bowlingSpeed || 0} km/h
Accuracy: ${data.metrics?.accuracy || 0}%
Spin Rate: ${data.metrics?.spinRate || 0} rpm

=== JOINT ANGLE ANALYSIS ===
${data.jointAngles
  .map(
    (joint) => `
${joint.joint}:
  Your Angle: ${joint.userAngle}°
  Expert Angle: ${joint.expertAngle}°
  Status: ${joint.status === "warning" ? "Needs Improvement" : joint.status === "critical" ? "Critical" : "Optimal"}
`
  )
  .join("")}

=== AI FEEDBACK ===
${data.feedbackItems
  .map(
    (item, idx) => `
${idx + 1}. ${item.title} (${item.type.toUpperCase()})
   ${item.message}
   Suggestion: ${item.suggestion || "N/A"}
`
  )
  .join("")}
              `.trim();

              const blob = new Blob([reportContent], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `crictech-analysis-${new Date().toISOString().split("T")[0]}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              toast.success("Feedback report downloaded");
            } catch (error) {
              console.error("Error generating report:", error);
              toast.error("Failed to generate report");
            }
          }}
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