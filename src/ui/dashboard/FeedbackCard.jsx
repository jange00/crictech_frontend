const FeedbackCard = ({ title, message, isDarkMode }) => (
  <div
    className={`flex flex-col gap-3 rounded-2xl border-l-4 p-5 transition shadow-sm ${
      isDarkMode
        ? "border-l-blue-500 border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.9)]"
        : "border-l-blue-500 border-slate-200 bg-white text-slate-900 shadow-[0_15px_40px_-30px_rgba(15,23,42,0.2)]"
    }`}
  >
    <span className={isDarkMode ? "text-blue-300" : "text-blue-600"}>{title}</span>
    <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
      {message}
    </p>
  </div>
);

export default FeedbackCard;
