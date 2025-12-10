import { ChartBarIcon } from "@heroicons/react/24/outline";
import { BoltIcon, AdjustmentsHorizontalIcon, ArrowPathIcon, ChartPieIcon } from "@heroicons/react/24/outline";
import { DEFAULT_PROGRESS_DATA } from "./constants/progressConstants";
import PerformanceChart from "./components/PerformanceChart";
import SessionHistoryTable from "./components/SessionHistoryTable";
import QuickStats from "./components/QuickStats";
import AIInsightsCard from "./components/AIInsightsCard";

const ProgressTrackerPage = ({ isDarkMode, progressData = null }) => {
  const data = progressData || DEFAULT_PROGRESS_DATA;

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

  const handleDownloadCSV = () => {
    const csvContent = [
      ["Date", "Accuracy", "Spin Rate", "Feedback Summary"],
      ...data.sessionHistory.map((session) => [
        session.date,
        session.accuracy,
        session.spinRate,
        session.feedbackSummary,
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

      {/* AI Insights Summary */}
      <AIInsightsCard aiInsights={data.aiInsights} isDarkMode={isDarkMode} />

      {/* Quick Stats */}
      <QuickStats sessionHistory={data.sessionHistory} aiInsights={data.aiInsights} isDarkMode={isDarkMode} />

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
      </section>

      {/* Session History Table */}
      <SessionHistoryTable sessionHistory={data.sessionHistory} isDarkMode={isDarkMode} />
    </div>
  );
};

export default ProgressTrackerPage;




