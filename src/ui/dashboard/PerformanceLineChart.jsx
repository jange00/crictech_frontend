import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const PerformanceLineChart = ({ data, isDarkMode }) => (
  <div
    className={`h-72 w-full rounded-3xl border p-4 sm:p-6 transition shadow-sm ${
      isDarkMode
        ? "border-slate-800 bg-slate-900/70 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.9)]"
        : "border-slate-200 bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)]"
    }`}
  >
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className={`text-base font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
          Session Progress
        </h3>
        <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Speed & accuracy trend</p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
          isDarkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-600"
        }`}
      >
        Live Sync
      </span>
    </div>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid stroke={isDarkMode ? "#1f2937" : "#e5e7eb"} strokeDasharray="3 3" />
        <XAxis
          dataKey="session"
          stroke={isDarkMode ? "#cbd5f5" : "#64748b"}
          tick={{ fontSize: 12, fill: isDarkMode ? "#cbd5f5" : "#64748b" }}
        />
        <YAxis
          stroke={isDarkMode ? "#cbd5f5" : "#64748b"}
          tick={{ fontSize: 12, fill: isDarkMode ? "#cbd5f5" : "#64748b" }}
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
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: isDarkMode ? "#cbd5f5" : "#475569" }} />
        <Line
          type="monotone"
          dataKey="speed"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ r: 5, strokeWidth: 2, stroke: "#2563eb", fill: "#fff" }}
          name="Speed (km/h)"
        />
        <Line
          type="monotone"
          dataKey="accuracy"
          stroke="#16a34a"
          strokeWidth={3}
          dot={{ r: 5, strokeWidth: 2, stroke: "#16a34a", fill: "#fff" }}
          name="Accuracy (%)"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default PerformanceLineChart;
