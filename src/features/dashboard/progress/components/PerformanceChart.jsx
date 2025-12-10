import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const PerformanceChart = ({ chartData, title, subtitle, dataKey, color, unit = "", Icon, isDarkMode }) => {
  const currentValue = chartData[chartData.length - 1]?.value || 0;
  const previousValue = chartData[chartData.length - 2]?.value || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue > 0 ? ((change / previousValue) * 100).toFixed(1) : 0;
  const isPositive = change >= 0;

  const chartCardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)]";

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
            className={`text-xs font-semibold ${isPositive ? "text-emerald-500" : "text-rose-500"}`}
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

export default PerformanceChart;


