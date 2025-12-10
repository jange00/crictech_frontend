import { useCallback, useMemo, useState, useEffect } from "react";
import { useAuth } from "../../../auth/useAuth";
import { useProgress } from "../../../hooks/useProgress";
import { useAnalysis } from "../../../hooks/useAnalysis";
import { useVideos } from "../../../hooks/useVideos";
import { useNotifications } from "../../../hooks/useNotifications";
import DashboardTopNav from "../../../ui/dashboard/DashboardTopNav";
import DashboardSidebar from "../../../ui/dashboard/DashboardSidebar";
import DashboardSummaryCard from "../../../ui/dashboard/DashboardSummaryCard";
import PerformanceLineChart from "../../../ui/dashboard/PerformanceLineChart";
import BenchmarkBarChart from "../../../ui/dashboard/BenchmarkBarChart";
import FeedbackCard from "../../../ui/dashboard/FeedbackCard";
import PlaceholderPanel from "../../../ui/dashboard/PlaceholderPanel";
import UploadWorkflow from "./UploadWorkflow";
import AnalysisOverview from "./AnalysisOverview";
import FeedbackPage from "../feedback/FeedbackPage";
import ProgressTrackerPage from "../progress/ProgressTrackerPage";
import SettingsPage from "../settings/SettingsPage";
import { DASHBOARD_METRICS, PROGRESS_LINE_DATA, BENCHMARK_BAR_DATA, AI_FEEDBACK_ITEMS } from "../constants/dashboardData";
import { BoltIcon, ArrowPathIcon, AdjustmentsHorizontalIcon, ChartPieIcon } from "@heroicons/react/24/outline";
import { SkeletonCard, SkeletonChart, SkeletonFeedbackCard } from "../../../ui/common/Skeleton";

const MENU_UPLOAD = "Upload Video";

const DashboardContent = () => {
  const [activeMenu, setActiveMenu] = useState("Overview");
  // Load dark mode from localStorage on mount
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [analysisId, setAnalysisId] = useState(null);
  
  // Get user from auth context
  const { user } = useAuth();
  const userName = user?.name || user?.username || "User";

  // Save dark mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    // Apply dark mode class to document root for global styling
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Prevent scroll restoration on page refresh
  useEffect(() => {
    // Disable automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Restore scroll position from sessionStorage after a short delay to ensure page is rendered
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedScrollPosition, 10),
            behavior: 'auto' // Instant scroll, not smooth
          });
        }, 100);
      });
    }

    // Save scroll position before page unload
    const handleBeforeUnload = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    // Save scroll position on scroll (throttled)
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      }, 100);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Fetch progress metrics - only fetch what's needed for overview
  const { useMetrics, useCharts } = useProgress();
  const { data: metricsData, isLoading: metricsLoading } = useMetrics("month");
  // Only fetch speed chart for overview - other charts can be lazy loaded
  const { data: speedChartData, isLoading: speedChartLoading } = useCharts("bowlingSpeed", "month");
  
  // Fetch recent analyses for feedback
  const { analyses, isLoading: analysesLoading } = useAnalysis({ page: 1, limit: 3, status: "completed" });
  
  // Fetch recent videos - only if needed
  const { videos, isLoading: videosLoading } = useVideos({ page: 1, limit: 1 });
  
  // Fetch notifications - with longer stale time
  const { unreadCount } = useNotifications({ page: 1, limit: 1 });

  // Transform API metrics data to dashboard format
  const dashboardMetrics = useMemo(() => {
    if (!metricsData?.metrics) return DASHBOARD_METRICS;
    
    const metrics = metricsData.metrics;
    const speedData = metrics.bowlingSpeed || [];
    const spinData = metrics.spinConsistency || [];
    const wristData = metrics.wristAlignment || [];
    const accuracyData = metrics.accuracyIndex || [];

    // Calculate averages and changes
    const getLatestValue = (data) => data.length > 0 ? data[data.length - 1]?.value : null;
    const getPreviousValue = (data) => data.length > 1 ? data[data.length - 2]?.value : null;
    const calculateChange = (current, previous) => {
      if (!current || !previous) return null;
      const change = ((current - previous) / previous) * 100;
      return {
        value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
        type: change >= 0 ? 'positive' : 'negative'
      };
    };

    const speedValue = getLatestValue(speedData);
    const speedChange = calculateChange(speedValue, getPreviousValue(speedData));
    const spinValue = getLatestValue(spinData);
    const spinChange = calculateChange(spinValue, getPreviousValue(spinData));
    const wristValue = getLatestValue(wristData);
    const wristChange = calculateChange(wristValue, getPreviousValue(wristData));
    const accuracyValue = getLatestValue(accuracyData);
    const accuracyChange = calculateChange(accuracyValue, getPreviousValue(accuracyData));

    return [
      {
        id: "avg-speed",
        label: "Average Bowling Speed",
        value: speedValue ? `${Math.round(speedValue)} km/h` : "N/A",
        change: speedChange?.value || "0%",
        changeType: speedChange?.type || "positive",
        icon: BoltIcon,
      },
      {
        id: "spin-rate",
        label: "Spin Rate",
        value: spinValue ? `${Math.round(spinValue)} rpm` : "N/A",
        change: spinChange?.value || "0%",
        changeType: spinChange?.type || "positive",
        icon: ArrowPathIcon,
      },
      {
        id: "wrist-alignment",
        label: "Wrist Angle Consistency",
        value: wristValue ? `${Math.round(wristValue)}%` : "N/A",
        change: wristChange?.value || "0%",
        changeType: wristChange?.type || "positive",
        icon: AdjustmentsHorizontalIcon,
      },
      {
        id: "accuracy",
        label: "Accuracy Score",
        value: accuracyValue ? `${Math.round(accuracyValue)}%` : "N/A",
        change: accuracyChange?.value || "0%",
        changeType: accuracyChange?.type || "negative",
        icon: ChartPieIcon,
      },
    ];
  }, [metricsData]);

  // Transform chart data from API
  const progressLineData = useMemo(() => {
    if (!speedChartData?.chartData || speedChartData.chartData.length === 0) {
      return PROGRESS_LINE_DATA;
    }
    
    // Transform API chart data to component format
    // Backend returns: Array<{ date: string (ISO), value: number }>
    return speedChartData.chartData.map((item, index) => ({
      session: `Week ${index + 1}`,
      speed: Math.round(item.value || 0),
      accuracy: 0, // Accuracy chart not loaded for overview to reduce requests
    }));
  }, [speedChartData]);

  // Transform feedback items from analyses
  const feedbackItems = useMemo(() => {
    if (!analyses || analyses.length === 0) {
      return AI_FEEDBACK_ITEMS;
    }

    // Get the most recent analysis with feedback
    const latestAnalysis = analyses[0];
    if (latestAnalysis?.feedbackItems && latestAnalysis.feedbackItems.length > 0) {
      return latestAnalysis.feedbackItems.slice(0, 3).map((item, idx) => ({
        id: item.id || `feedback-${idx}`,
        title: item.title || "Analysis Feedback",
        message: item.message || "",
        type: item.type || "warning",
      }));
    }
    
    return AI_FEEDBACK_ITEMS;
  }, [analyses]);

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
    if (results?.analysisId) {
      setAnalysisId(results.analysisId);
    }
    setActiveMenu("Analysis");
  }, []);

  useEffect(() => {
    const handleNavigateToSettings = () => {
      setActiveMenu("Settings");
    };

    window.addEventListener("navigateToSettings", handleNavigateToSettings);
    return () => {
      window.removeEventListener("navigateToSettings", handleNavigateToSettings);
    };
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
        {metricsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} isDarkMode={isDarkMode} />
          ))
        ) : (
          dashboardMetrics.map((metric) => (
            <DashboardSummaryCard key={metric.id} {...metric} isDarkMode={isDarkMode} />
          ))
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {speedChartLoading ? (
          <>
            <SkeletonChart isDarkMode={isDarkMode} height="300px" />
            <SkeletonChart isDarkMode={isDarkMode} height="300px" />
          </>
        ) : (
          <>
            <PerformanceLineChart data={progressLineData} isDarkMode={isDarkMode} />
            <BenchmarkBarChart data={BENCHMARK_BAR_DATA} isDarkMode={isDarkMode} />
          </>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {analysesLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <SkeletonFeedbackCard key={i} isDarkMode={isDarkMode} />
          ))
        ) : (
          feedbackItems.map((item) => (
            <FeedbackCard key={item.id} {...item} isDarkMode={isDarkMode} />
          ))
        )}
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
            analysisId={analysisId || (analyses.length > 0 ? analyses[0]._id : null)}
            isDarkMode={isDarkMode}
            lastUploadedFile={uploadedFile}
            onUploadAnother={() => setActiveMenu(MENU_UPLOAD)}
            onViewFeedback={() => setActiveMenu("Feedback")}
          />
        );
      case "Feedback":
        return (
          <FeedbackPage
            isDarkMode={isDarkMode}
            analysisId={analysisId || (analyses.length > 0 ? analyses[0]._id : null)}
          />
        );
      case "Progress Tracker":
        return <ProgressTrackerPage isDarkMode={isDarkMode} />;
      case "Settings":
        return <SettingsPage isDarkMode={isDarkMode} />;
      default:
        return overviewContent;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-100 px-3 pb-10 pt-4 sm:px-4 sm:pt-6 lg:px-6 lg:pt-8">
      <div className={`flex min-h-[calc(100vh-5rem)] flex-col gap-6 rounded-3xl border ${containerTone} backdrop-blur-sm p-5 sm:p-7 lg:p-9`}>
        <DashboardTopNav
          userName={userName}
          isDarkMode={isDarkMode}
          onToggleTheme={() => {
            setIsDarkMode((prev) => {
              const newValue = !prev;
              localStorage.setItem('darkMode', newValue.toString());
              return newValue;
            });
          }}
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
