const DashboardSummaryCard = ({ label, value, change, changeType, icon: Icon, isDarkMode }) => (
  <div
    className={`flex flex-col gap-4 rounded-2xl border p-5 transition shadow-sm ${
      isDarkMode
        ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.9)]"
        : "border-slate-200 bg-white text-slate-900 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.25)]"
    }`}
  >
    <div className="flex items-center justify-between">
      <span className={`text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{label}</span>
      {Icon ? (
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isDarkMode ? "bg-slate-800 text-blue-300" : "bg-blue-50 text-blue-600"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
      ) : null}
    </div>
    <div className="flex items-baseline justify-between">
      <span className="text-2xl font-bold sm:text-3xl">{value}</span>
      <span
        className={`text-xs font-semibold uppercase tracking-wide ${
          changeType === "positive" ? "text-emerald-500" : "text-rose-500"
        }`}
      >
        {change}
      </span>
    </div>
    <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
      Session average compared to previous cycle
    </p>
  </div>
);

export default DashboardSummaryCard;
