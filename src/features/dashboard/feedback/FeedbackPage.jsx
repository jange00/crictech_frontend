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

  // Fetch analysis feedback from API
  const { useFeedback, useSingleAnalysis } = useAnalysis();
  const { data: feedbackData, isLoading: feedbackLoading } = useFeedback(analysisId);
  const { data: analysisData, isLoading: analysisLoading } = useSingleAnalysis(analysisId);

  // Transform API data to component format
  // Backend /api/analysis/:id/feedback returns: { success: true, feedback: { items, jointAngles, metrics, expertComparison } }
  // Backend /api/analysis/:id returns: { success: true, analysis: Analysis }
  const data = useMemo(() => {
    if (!feedbackData && !analysisData) {
      return DEFAULT_FEEDBACK_DATA;
    }

    // feedbackData structure: { items, jointAngles, metrics, expertComparison }
    // analysisData structure: Analysis object with sessionId populated
    if (feedbackData) {
      return {
        userVideoUrl: analysisData?.sessionId?.videoUrl || "",
        expertVideoUrl: feedbackData.expertComparison?.expertVideoUrl || "",
        jointAngles: feedbackData.jointAngles || [],
        feedbackItems: feedbackData.items || [],
        metrics: feedbackData.metrics || {},
        expertComparison: feedbackData.expertComparison || {},
      };
    }
    
    // Fallback to analysis data
    if (analysisData) {
      return {
        userVideoUrl: analysisData.sessionId?.videoUrl || "",
        expertVideoUrl: analysisData.expertComparison?.expertVideoUrl || "",
        jointAngles: analysisData.jointAngles || [],
        feedbackItems: analysisData.feedbackItems || [],
        metrics: analysisData.metrics || {},
        expertComparison: analysisData.expertComparison || {},
      };
    }
    
    return DEFAULT_FEEDBACK_DATA;
  }, [feedbackData, analysisData]);

  const poseOverlayData = useMemo(() => generatePoseOverlayData(data.jointAngles, false), [data.jointAngles]);
  const expertPoseOverlayData = useMemo(() => generatePoseOverlayData(data.jointAngles, true), [data.jointAngles]);

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
          onClick={() => {
            try {
              const reportData = {
                feedbackAnalysis: {
                  date: new Date().toISOString(),
                  jointAngles: data.jointAngles,
                  feedbackItems: data.feedbackItems,
                },
                summary: {
                  totalFeedbackItems: data.feedbackItems.length,
                  positiveItems: data.feedbackItems.filter((item) => item.type === "positive").length,
                  improvementItems: data.feedbackItems.filter((item) => item.type === "warning").length,
                },
              };

              const reportContent = `
CricTech AI Feedback Report
Generated: ${new Date().toLocaleString()}

=== JOINT ANGLE ANALYSIS ===
${data.jointAngles
  .map(
    (joint) => `
${joint.joint}:
  Your Angle: ${joint.userAngle}°
  Expert Angle: ${joint.expertAngle}°
  Status: ${joint.status === "warning" ? "Needs Improvement" : "Optimal"}
`
  )
  .join("")}

=== AI-GENERATED FEEDBACK ===
${data.feedbackItems
  .map(
    (item, idx) => `
${idx + 1}. ${item.title}
   ${item.message}
   💡 Suggestion: ${item.suggestion || "N/A"}
`
  )
  .join("")}

=== SUMMARY ===
Total Feedback Items: ${reportData.summary.totalFeedbackItems}
Positive Aspects: ${reportData.summary.positiveItems}
Areas for Improvement: ${reportData.summary.improvementItems}
              `.trim();

              const blob = new Blob([reportContent], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `crictech-feedback-report-${new Date().toISOString().split("T")[0]}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              toast.success("Feedback report downloaded successfully");
            } catch (error) {
              console.error("Error generating report:", error);
              toast.error("Failed to generate report. Please try again.");
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

