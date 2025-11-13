const MENU_ITEMS = [
  "Overview",
  "Upload Video",
  "Analysis",
  "Feedback",
  "Progress Tracker",
  "Settings",
];

const DashboardSidebar = ({ activeItem, onChange, isDarkMode }) => (
  <nav
    className={`flex h-full min-h-[24rem] flex-col gap-2 rounded-3xl border px-3 py-4 transition shadow-sm ${
      isDarkMode
        ? "border-slate-800 bg-slate-900/70 text-slate-200 shadow-[0_10px_30px_-25px_rgba(15,23,42,0.9)]"
        : "border-slate-200 bg-white text-slate-600 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.25)]"
    }`}
  >
    <span className="px-4 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Menu</span>
    {MENU_ITEMS.map((item) => {
      const isActive = activeItem === item;
      return (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
            isActive
              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
              : isDarkMode
              ? "hover:bg-slate-800"
              : "hover:bg-blue-50"
          }`}
        >
          {item}
        </button>
      );
    })}
  </nav>
);

export default DashboardSidebar;
