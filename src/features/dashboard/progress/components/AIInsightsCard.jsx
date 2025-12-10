import { SparklesIcon } from "@heroicons/react/24/outline";

const AIInsightsCard = ({ aiInsights, isDarkMode }) => {
  const cardStyles = isDarkMode
    ? "border-slate-800 bg-gradient-to-br from-blue-950/40 via-slate-900/70 to-emerald-950/30 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

  return (
    <div className={`rounded-3xl border p-6 transition shadow-sm ${cardStyles}`}>
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
            Overall improvement {aiInsights.period}:{" "}
            <span className="font-bold text-emerald-600">{aiInsights.improvement}</span> in{" "}
            <span className="font-semibold">{aiInsights.metric}</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsCard;




