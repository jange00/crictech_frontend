import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import {
  ArrowTrendingUpIcon,
  ChartBarIcon,
  BoltIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ChartPieIcon,
  CalendarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const ProgressTrackerPage = ({ isDarkMode, progressData = null }) => {
  // Default mock data if no progress data is provided
  const defaultProgressData = {
    bowlingSpeed: [
      { date: "Week 1", value: 124 },
      { date: "Week 2", value: 126 },
      { date: "Week 3", value: 129 },
      { date: "Week 4", value: 131 },
      { date: "Week 5", value: 133 },
    ],
    wristAlignment: [
      { date: "Week 1", value: 78 },
      { date: "Week 2", value: 81 },
      { date: "Week 3", value: 84 },
      { date: "Week 4", value: 87 },
      { date: "Week 5", value: 90 },
    ],
    spinConsistency: [
      { date: "Week 1", value: 82 },
      { date: "Week 2", value: 85 },
      { date: "Week 3", value: 88 },
      { date: "Week 4", value: 91 },
      { date: "Week 5", value: 94 },
    ],
    accuracyIndex: [
      { date: "Week 1", value: 75 },
      { date: "Week 2", value: 78 },
      { date: "Week 3", value: 82 },
      { date: "Week 4", value: 86 },
      { date: "Week 5", value: 92 },
    ],
    sessionHistory: [
      {
        id: "session-1",
        date: "2025-01-15",
        accuracy: "92%",
        spinRate: "1960 rpm",
        feedbackSummary: "Elbow angle improved, maintain follow-through",
      },
      {
        id: "session-2",
        date: "2025-01-12",
        accuracy: "89%",
        spinRate: "1920 rpm",
        feedbackSummary: "Good wrist alignment, focus on shoulder rotation",
      },
      {
        id: "session-3",
        date: "2025-01-10",
        accuracy: "87%",
        spinRate: "1880 rpm",
        feedbackSummary: "Speed increased, work on consistency",
      },
      {
        id: "session-4",
        date: "2025-01-08",
        accuracy: "85%",
        spinRate: "1850 rpm",
        feedbackSummary: "Stride timing improved, maintain rhythm",
      },
      {
        id: "session-5",
        date: "2025-01-05",
        accuracy: "82%",
        spinRate: "1820 rpm",
        feedbackSummary: "Overall form improving, continue practice",
      },
    ],
    aiInsights: {
      improvement: "+14%",
      metric: "delivery consistency",
      period: "this month",
    },
  };

  const data = progressData || defaultProgressData;

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

  const chartCardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)]";

  const renderLineChart = (chartData, title, subtitle, dataKey, color, unit = "", Icon) => {
    const currentValue = chartData[chartData.length - 1]?.value || 0;
    const previousValue = chartData[chartData.length - 2]?.value || 0;
    const change = currentValue - previousValue;
    const changePercent = previousValue > 0 ? ((change / previousValue) * 100).toFixed(1) : 0;
    const isPositive = change >= 0;

    return (
      <div className={`rounded-3xl border p-4 sm:p-6 transition shadow-sm ${chartCardStyles}`}>
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            {Icon && (
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isDarkMode ? "bg-slate-800 text-blue-300" : "bg-blue-50 text-blue-600"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className={`text-base font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                {title}
              </h3>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
              {currentValue}
              <span className="ml-1 text-sm font-normal text-slate-500">{unit}</span>
            </div>
            <span
              className={`text-xs font-semibold ${
                isPositive ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {changePercent}%
            </span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={isDarkMode ? "#1f2937" : "#e5e7eb"} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke={isDarkMode ? "#cbd5f5" : "#64748b"}
                tick={{ fontSize: 11, fill: isDarkMode ? "#cbd5f5" : "#64748b" }}
              />
              <YAxis
                stroke={isDarkMode ? "#cbd5f5" : "#64748b"}
                tick={{ fontSize: 11, fill: isDarkMode ? "#cbd5f5" : "#64748b" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#0f172a" : "#fff",
                  borderColor: isDarkMode ? "#1e293b" : "#e2e8f0",
                  borderRadius: 12,
                  padding: "12px",
                  fontSize: "12px",
                  color: isDarkMode ? "#e2e8f0" : "#0f172a",
                }}
                formatter={(value) => [`${value}${unit}`, title]}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, stroke: color, fill: "#fff" }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Calculate summary metrics
  const latestSession = data.sessionHistory[0];
  const totalSessions = data.sessionHistory.length;

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
            onClick={() => {
              // Create CSV download functionality
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
            }}
          >
            <ChartBarIcon className="h-5 w-5" />
            Download CSV
          </button>
        </div>
      </header>

      {/* AI Insights Summary */}
      <div
        className={`rounded-3xl border p-6 transition shadow-sm ${
          isDarkMode
            ? "border-slate-800 bg-gradient-to-br from-blue-950/40 via-slate-900/70 to-emerald-950/30 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
            : "border-slate-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              isDarkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-600"
            }`}
          >
            <SparklesIcon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                AI Insights Summary
              </h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  isDarkMode ? "bg-emerald-900/50 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                AI
              </span>
            </div>
            <p className={`mt-2 text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              Overall improvement {data.aiInsights.period}:{" "}
              <span className="font-bold text-emerald-600">{data.aiInsights.improvement}</span> in{" "}
              <span className="font-semibold">{data.aiInsights.metric}</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className={`flex flex-col gap-3 rounded-2xl border p-4 transition shadow-sm ${
            isDarkMode
              ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.9)]"
              : "border-slate-200 bg-white text-slate-900 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.25)]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Total Sessions
            </span>
            <CalendarIcon
              className={`h-5 w-5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            />
          </div>
          <div className="text-2xl font-bold">{totalSessions}</div>
        </div>
        <div
          className={`flex flex-col gap-3 rounded-2xl border p-4 transition shadow-sm ${
            isDarkMode
              ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.9)]"
              : "border-slate-200 bg-white text-slate-900 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.25)]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Latest Accuracy
            </span>
            <ChartPieIcon className={`h-5 w-5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
          </div>
          <div className="text-2xl font-bold">{latestSession?.accuracy}</div>
        </div>
        <div
          className={`flex flex-col gap-3 rounded-2xl border p-4 transition shadow-sm ${
            isDarkMode
              ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.9)]"
              : "border-slate-200 bg-white text-slate-900 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.25)]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Latest Spin Rate
            </span>
            <ArrowPathIcon className={`h-5 w-5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
          </div>
          <div className="text-2xl font-bold">{latestSession?.spinRate}</div>
        </div>
        <div
          className={`flex flex-col gap-3 rounded-2xl border p-4 transition shadow-sm ${
            isDarkMode
              ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.9)]"
              : "border-slate-200 bg-white text-slate-900 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.25)]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Improvement
            </span>
            <ArrowTrendingUpIcon className={`h-5 w-5 text-emerald-500`} />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{data.aiInsights.improvement}</div>
        </div>
      </section>

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
          {renderLineChart(data.bowlingSpeed, "Bowling Speed", "Speed trend over time", "value", "#2563eb", " km/h", BoltIcon)}
          {renderLineChart(
            data.wristAlignment,
            "Wrist Alignment",
            "Alignment consistency percentage",
            "value",
            "#16a34a",
            "%",
            AdjustmentsHorizontalIcon
          )}
          {renderLineChart(
            data.spinConsistency,
            "Spin Consistency",
            "Spin rate consistency index",
            "value",
            "#dc2626",
            "%",
            ArrowPathIcon
          )}
          {renderLineChart(
            data.accuracyIndex,
            "Accuracy Index",
            "Accuracy score progression",
            "value",
            "#7c3aed",
            "%",
            ChartPieIcon
          )}
        </div>
      </section>

      {/* Session History Table */}
      <section className={`rounded-3xl border p-6 transition shadow-sm ${cardStyles}`}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Session History</h3>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
              isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
            }`}
          >
            {totalSessions} Sessions
          </span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  isDarkMode
                    ? "border-slate-800 bg-slate-900/50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <th
                  className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Date
                </th>
                <th
                  className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Accuracy
                </th>
                <th
                  className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Spin Rate
                </th>
                <th
                  className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Feedback Summary
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {data.sessionHistory.map((session, index) => (
                <tr
                  key={session.id}
                  className={`transition ${
                    isDarkMode
                      ? "hover:bg-slate-800/50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className={`px-5 py-4 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <span
                          className={`inline-flex h-2 w-2 rounded-full ${
                            isDarkMode ? "bg-emerald-400" : "bg-emerald-500"
                          }`}
                        />
                      )}
                      {formatDate(session.date)}
                    </div>
                  </td>
                  <td className={`px-5 py-4 text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                    {session.accuracy}
                  </td>
                  <td className={`px-5 py-4 text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                    {session.spinRate}
                  </td>
                  <td className={`px-5 py-4 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    {session.feedbackSummary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProgressTrackerPage;
