import { useCallback, useMemo, useState } from "react";
import DashboardTopNav from "../../../ui/dashboard/DashboardTopNav";
import DashboardSidebar from "../../../ui/dashboard/DashboardSidebar";
import DashboardSummaryCard from "../../../ui/dashboard/DashboardSummaryCard";
import PerformanceLineChart from "../../../ui/dashboard/PerformanceLineChart";
import BenchmarkBarChart from "../../../ui/dashboard/BenchmarkBarChart";
import FeedbackCard from "../../../ui/dashboard/FeedbackCard";
import PlaceholderPanel from "../../../ui/dashboard/PlaceholderPanel";
import UploadWorkflow from "./UploadWorkflow";
import AnalysisOverview from "./AnalysisOverview";
import AIFeedbackPage from "./AIFeedbackPage";
import ProgressTrackerPage from "./ProgressTrackerPage";
import {
  DASHBOARD_METRICS,
  PROGRESS_LINE_DATA,
  BENCHMARK_BAR_DATA,
  AI_FEEDBACK_ITEMS,
} from "../constants/dashboardData";

const MENU_UPLOAD = "Upload Video";

const DashboardContent = () => {
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState([]);

  const lastUpdated = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    []
  );

  const containerTone = isDarkMode
    ? "border-slate-800 bg-slate-950 text-slate-100 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_40px_100px_-45px_rgba(15,23,42,0.15)]";

  const handleUploadComplete = useCallback((fileName) => {
    setUploadedFile(fileName);
  }, []);

  const handleAnalysisComplete = useCallback((results) => {
    setAnalysisResults(results || []);
    setActiveMenu("Analysis");
  }, []);

  const overviewContent = (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">Dashboard Overview</h2>
          <p className="text-sm text-slate-400">Latest update: {lastUpdated}</p>
          {uploadedFile ? (
            <p className="mt-2 text-xs text-emerald-500">Last uploaded: {uploadedFile}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setActiveMenu(MENU_UPLOAD)}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
        >
          Upload Session
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {DASHBOARD_METRICS.map((metric) => (
          <DashboardSummaryCard key={metric.id} {...metric} isDarkMode={isDarkMode} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <PerformanceLineChart data={PROGRESS_LINE_DATA} isDarkMode={isDarkMode} />
        <BenchmarkBarChart data={BENCHMARK_BAR_DATA} isDarkMode={isDarkMode} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {AI_FEEDBACK_ITEMS.map((item) => (
          <FeedbackCard key={item.id} {...item} isDarkMode={isDarkMode} />
        ))}
      </section>
    </div>
  );

  const renderActiveContent = () => {
    switch (activeMenu) {
      case "Overview":
        return overviewContent;
      case MENU_UPLOAD:
        return (
          <UploadWorkflow
            isDarkMode={isDarkMode}
            onUploadComplete={handleUploadComplete}
            onAnalysisComplete={handleAnalysisComplete}
          />
        );
      case "Analysis":
        return (
          <AnalysisOverview
            results={analysisResults}
            isDarkMode={isDarkMode}
            lastUploadedFile={uploadedFile}
            onUploadAnother={() => setActiveMenu(MENU_UPLOAD)}
          />
        );
      case "Feedback":
        return (
          <AIFeedbackPage
            isDarkMode={isDarkMode}
            feedbackData={
              analysisResults.length > 0
                ? {
                    userVideoUrl: "",
                    expertVideoUrl: "",
                    jointAngles: [
                      { joint: "Elbow", userAngle: 82, expertAngle: 95, status: "warning" },
                      { joint: "Shoulder", userAngle: 145, expertAngle: 150, status: "warning" },
                      { joint: "Wrist", userAngle: 12, expertAngle: 8, status: "warning" },
                    ],
                    feedbackItems: analysisResults.map((result, idx) => ({
                      id: `feedback-${idx}`,
                      type: result.status === "positive" ? "positive" : "warning",
                      title: result.label,
                      message: result.description,
                      suggestion:
                        result.status === "positive"
                          ? "Maintain this technique for consistent performance."
                          : "Focus on improving this aspect in your next session.",
                    })),
                  }
                : null
            }
          />
        );
      case "Progress Tracker":
        return <ProgressTrackerPage isDarkMode={isDarkMode} />;
      case "Settings":
        return (
          <PlaceholderPanel
            title="Settings"
            description="Update notification preferences, export data, and manage academy invitations from here."
            actions={[
              { label: "Open Preferences", onClick: () => window.open("#", "_blank") },
            ]}
            isDarkMode={isDarkMode}
          />
        );
      default:
        return overviewContent;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-100 px-3 pb-10 pt-4 sm:px-4 sm:pt-6 lg:px-6 lg:pt-8">
      <div className={`flex min-h-[calc(100vh-5rem)] flex-col gap-6 rounded-3xl border ${containerTone} backdrop-blur-sm p-5 sm:p-7 lg:p-9`}>
        <DashboardTopNav
          userName="Rohit"
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        />

        <div className="grid flex-1 gap-6 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
          <DashboardSidebar activeItem={activeMenu} onChange={setActiveMenu} isDarkMode={isDarkMode} />
          <div className="flex flex-col gap-6">{renderActiveContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
