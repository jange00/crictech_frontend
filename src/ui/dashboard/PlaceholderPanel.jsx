const PlaceholderPanel = ({ title, description, actions = [], isDarkMode }) => (
  <div
    className={`flex flex-col gap-6 rounded-3xl border p-6 sm:p-8 transition shadow-sm ${
      isDarkMode
        ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_16px_44px_-30px_rgba(15,23,42,0.9)]"
        : "border-slate-200 bg-white text-slate-900 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.18)]"
    }`}
  >
    <div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className={`mt-2 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{description}</p>
    </div>
    {actions.length > 0 && (
      <div className="flex flex-wrap gap-3">
        {actions.map(({ label, onClick, variant = "primary" }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              variant === "primary"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 hover:bg-blue-700"
                : isDarkMode
                ? "border border-slate-700 bg-slate-900 text-slate-200 hover:border-blue-400"
                : "border border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default PlaceholderPanel;
