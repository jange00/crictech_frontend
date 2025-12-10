import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const FeedbackCard = ({ item, isDarkMode }) => {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border-l-4 p-5 transition shadow-sm ${
        item.type === "positive"
          ? isDarkMode
            ? "border-l-emerald-500 border-slate-800 bg-emerald-950/20 text-slate-100"
            : "border-l-emerald-500 border-slate-200 bg-emerald-50/60 text-slate-900"
          : isDarkMode
          ? "border-l-rose-500 border-slate-800 bg-rose-950/20 text-slate-100"
          : "border-l-rose-500 border-slate-200 bg-rose-50/60 text-slate-900"
      }`}
    >
      <div className="flex items-start gap-3">
        {item.type === "positive" ? (
          <CheckCircleIcon className="mt-1 h-5 w-5 text-emerald-600" />
        ) : (
          <ExclamationTriangleIcon className="mt-1 h-5 w-5 text-rose-600" />
        )}
        <div className="flex-1">
          <h4
            className={`text-sm font-semibold ${
              item.type === "positive" ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {item.title}
          </h4>
          <p className={`mt-1 text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
            {item.message}
          </p>
          {item.suggestion && (
            <p className={`mt-2 text-xs italic ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              💡 {item.suggestion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;




