import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

const BenchmarkBarChart = ({ data, isDarkMode }) => (
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
          User vs Expert Benchmark
        </h3>
        <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Current session averages</p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
          isDarkMode ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-700"
        }`}
      >
        Expert Avg
      </span>
    </div>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }} barCategoryGap="22%">
        <CartesianGrid stroke={isDarkMode ? "#1f2937" : "#e5e7eb"} strokeDasharray="3 3" />
        <XAxis
          dataKey="metric"
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
        <Bar dataKey="user" fill="#2563eb" radius={[12, 12, 0, 0]} name="You" />
        <Bar dataKey="expert" fill="#1e293b" radius={[12, 12, 0, 0]} name="Expert" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BenchmarkBarChart;
