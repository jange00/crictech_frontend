import { CalendarIcon, ChartPieIcon, ArrowPathIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

const QuickStats = ({ sessionHistory, aiInsights, isDarkMode }) => {
  const latestSession = sessionHistory[0];
  const totalSessions = sessionHistory.length;

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.25)]";

  const stats = [
    {
      label: "Total Sessions",
      value: totalSessions,
      icon: CalendarIcon,
    },
    {
      label: "Latest Accuracy",
      value: latestSession?.accuracy || "N/A",
      icon: ChartPieIcon,
    },
    {
      label: "Latest Spin Rate",
      value: latestSession?.spinRate || "N/A",
      icon: ArrowPathIcon,
    },
    {
      label: "Improvement",
      value: aiInsights?.improvement || "+0%",
      icon: ArrowTrendingUpIcon,
      highlight: true,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`flex flex-col gap-3 rounded-2xl border p-4 transition shadow-sm ${cardStyles}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              {stat.label}
            </span>
            <stat.icon
              className={`h-5 w-5 ${stat.highlight ? "text-emerald-500" : isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            />
          </div>
          <div className={`text-2xl font-bold ${stat.highlight ? "text-emerald-600" : ""}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </section>
  );
};

export default QuickStats;

