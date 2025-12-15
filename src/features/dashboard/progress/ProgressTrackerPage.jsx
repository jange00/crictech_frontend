import { useState, useMemo } from "react";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { BoltIcon, AdjustmentsHorizontalIcon, ArrowPathIcon, ChartPieIcon } from "@heroicons/react/24/outline";
import { DEFAULT_PROGRESS_DATA } from "./constants/progressConstants";
import PerformanceChart from "./components/PerformanceChart";
import SessionHistoryTable from "./components/SessionHistoryTable";
import QuickStats from "./components/QuickStats";
import AIInsightsCard from "./components/AIInsightsCard";
import { useProgress } from "../../../hooks/useProgress";
import { SkeletonChart, Skeleton } from "../../../ui/common/Skeleton";

const ProgressTrackerPage = ({ isDarkMode }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Fetch progress data from API
  const { useSessions, useMetrics, useCharts, useInsights } = useProgress();
  const { data: sessionsData, isLoading: sessionsLoading } = useSessions({ page: 1, limit: 20 });
  const { data: metricsData, isLoading: metricsLoading } = useMetrics(selectedPeriod);
  const { data: insightsData, isLoading: insightsLoading } = useInsights(selectedPeriod);
  
  // Fetch chart data for each metric - these are cached on the backend, so multiple calls won't cause extra requests
  const { data: speedChartData } = useCharts('bowlingSpeed', selectedPeriod);
  const { data: wristChartData } = useCharts('wristAlignment', selectedPeriod);
  const { data: spinChartData } = useCharts('spinConsistency', selectedPeriod);
  const { data: accuracyChartData } = useCharts('accuracyIndex', selectedPeriod);

  // Transform API data to component format
  const data = useMemo(() => {
    // Transform sessions to sessionHistory format
    const rawSessions = sessionsData?.sessions || [];
    const sessionHistory =
      rawSessions.length > 0
        ? rawSessions.map((session) => {
            const dateValue = session.date || session.createdAt || session.startedAt;
            return {
              id: session._id || session.id,
              date: dateValue ? new Date(dateValue).toLocaleDateString() : "N/A",
              accuracy: session.accuracy ?? session.metrics?.accuracy ?? "N/A",
              spinRate: session.spinRate ?? session.metrics?.spinRate ?? "N/A",
              bowlingSpeed: session.bowlingSpeed ?? session.metrics?.bowlingSpeed ?? "N/A",
              feedbackSummary: session.feedbackSummary || "",
              sessionType: session.sessionType || session.type || "Practice",
              bowlingType: session.bowlingType || session.style || "Unknown",
            };
          })
        : DEFAULT_PROGRESS_DATA.sessionHistory;

    // Transform chart data
    const transformChartData = (chartData, fallback) => {
      if (!chartData?.chartData || chartData.chartData.length === 0) {
        return fallback;
      }
      return chartData.chartData.map((item, index) => ({
        date: item.date
          ? new Date(item.date).toLocaleDateString()
          : fallback?.[index]?.date || `Session ${index + 1}`,
        value: item.value ?? fallback?.[index]?.value ?? 0,
      }));
    };

    // Transform insights
    const aiInsights = insightsData?.insights || DEFAULT_PROGRESS_DATA.aiInsights;

    return {
      sessionHistory,
      bowlingSpeed: transformChartData(speedChartData, DEFAULT_PROGRESS_DATA.bowlingSpeed),
      wristAlignment: transformChartData(wristChartData, DEFAULT_PROGRESS_DATA.wristAlignment),
      spinConsistency: transformChartData(spinChartData, DEFAULT_PROGRESS_DATA.spinConsistency),
      accuracyIndex: transformChartData(accuracyChartData, DEFAULT_PROGRESS_DATA.accuracyIndex),
      aiInsights,
    };
  }, [sessionsData, speedChartData, wristChartData, spinChartData, accuracyChartData, insightsData]);

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

  const handleDownloadCSV = () => {
    if (!data.sessionHistory || data.sessionHistory.length === 0) {
      return;
    }

    const csvContent = [
      ["Date", "Accuracy", "Spin Rate", "Bowling Speed", "Session Type", "Bowling Type", "Feedback Summary"],
      ...data.sessionHistory.map((session) => [
        session.date,
        session.accuracy || "N/A",
        session.spinRate || "N/A",
        session.bowlingSpeed || "N/A",
        session.sessionType || "N/A",
        session.bowlingType || "N/A",
        session.feedbackSummary || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `progress-tracker-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className={`rounded-3xl border p-6 transition shadow-sm ${cardStyles}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Progress Tracker</h2>
            <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Compare week-on-week stats, benchmark against experts, and monitor consistency across the season.
            </p>
          </div>
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition shadow-sm ${
              isDarkMode
                ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-blue-400 hover:bg-slate-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={handleDownloadCSV}
          >
            <ChartBarIcon className="h-5 w-5" />
            Download CSV
          </button>
        </div>
      </header>

      {/* Period Selector */}
      <div className={`rounded-3xl border p-4 ${cardStyles}`}>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold">Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`rounded-xl border px-3 py-2 text-sm ${
              isDarkMode
                ? "border-slate-700 bg-slate-900 text-slate-200"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      {/* AI Insights Summary */}
      {insightsLoading ? (
        <div className={`rounded-3xl border p-6 ${cardStyles}`}>
          <div className="space-y-4">
            <Skeleton height="1.5rem" width="40%" isDarkMode={isDarkMode} />
            <Skeleton height="1rem" width="100%" isDarkMode={isDarkMode} />
            <Skeleton height="1rem" width="80%" isDarkMode={isDarkMode} />
            <div className="mt-4 space-y-2">
              <Skeleton height="0.75rem" width="100%" isDarkMode={isDarkMode} />
              <Skeleton height="0.75rem" width="90%" isDarkMode={isDarkMode} />
              <Skeleton height="0.75rem" width="95%" isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      ) : (
        <AIInsightsCard aiInsights={data.aiInsights} isDarkMode={isDarkMode} />
      )}

      {/* Quick Stats */}
      {sessionsLoading ? (
        <div className={`rounded-3xl border p-6 ${cardStyles}`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton height="0.75rem" width="60%" isDarkMode={isDarkMode} />
                <Skeleton height="2rem" width="80%" isDarkMode={isDarkMode} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <QuickStats sessionHistory={data.sessionHistory} aiInsights={data.aiInsights} isDarkMode={isDarkMode} />
      )}

      {/* Performance Graphs */}
      <section className={`rounded-3xl border p-6 transition shadow-sm ${cardStyles}`}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Performance Graphs</h3>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
              isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
            }`}
          >
            Interactive Charts
          </span>
        </div>
        {metricsLoading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonChart key={i} isDarkMode={isDarkMode} height="300px" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <PerformanceChart
              chartData={data.bowlingSpeed}
              title="Bowling Speed"
              subtitle="Speed trend over time"
              dataKey="value"
              color="#2563eb"
              unit=" km/h"
              Icon={BoltIcon}
              isDarkMode={isDarkMode}
            />
            <PerformanceChart
              chartData={data.wristAlignment}
              title="Wrist Alignment"
              subtitle="Alignment consistency percentage"
              dataKey="value"
              color="#16a34a"
              unit="%"
              Icon={AdjustmentsHorizontalIcon}
              isDarkMode={isDarkMode}
            />
            <PerformanceChart
              chartData={data.spinConsistency}
              title="Spin Consistency"
              subtitle="Spin rate consistency index"
              dataKey="value"
              color="#dc2626"
              unit="%"
              Icon={ArrowPathIcon}
              isDarkMode={isDarkMode}
            />
            <PerformanceChart
              chartData={data.accuracyIndex}
              title="Accuracy Index"
              subtitle="Accuracy score progression"
              dataKey="value"
              color="#7c3aed"
              unit="%"
              Icon={ChartPieIcon}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </section>

      {/* Session History Table */}
      {sessionsLoading ? (
        <div className={`rounded-3xl border p-6 ${cardStyles}`}>
          <div className="space-y-4">
            {/* Table Header Skeleton */}
            <div className="flex gap-4 border-b pb-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height="1rem" width="100%" isDarkMode={isDarkMode} />
              ))}
            </div>
            {/* Table Rows Skeleton */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 py-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} height="1rem" width="100%" isDarkMode={isDarkMode} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <SessionHistoryTable sessionHistory={data.sessionHistory} isDarkMode={isDarkMode} />
      )}
    </div>
  );
};

export default ProgressTrackerPage;




