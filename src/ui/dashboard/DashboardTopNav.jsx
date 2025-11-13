import { BellIcon, SunIcon, MoonIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const DashboardTopNav = ({ userName, isDarkMode, onToggleTheme }) => (
  <header
    className={`grid h-16 w-full grid-cols-[auto,1fr,auto] items-center rounded-3xl border px-5 sm:px-6 transition shadow-sm ${
      isDarkMode
        ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_10px_30px_-25px_rgba(15,23,42,0.9)]"
        : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]"
    }`}
  >
    <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-blue-600">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-base shadow-sm">
        CT
      </span>
      CricTech
    </div>
    <div
      className={`hidden justify-self-center text-sm font-semibold sm:block ${
        isDarkMode ? "text-slate-300" : "text-slate-600"
      }`}
    >
      Hello, <span className={isDarkMode ? "text-slate-100" : "text-slate-900"}>{userName}</span>
    </div>
    <div className="flex items-center justify-end gap-3 sm:gap-4">
      <button
        type="button"
        onClick={onToggleTheme}
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
          isDarkMode
            ? "border-slate-700 bg-slate-800 text-amber-300 hover:border-slate-600"
            : "border-slate-200 bg-slate-50 text-blue-600 hover:border-blue-400"
        }`}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </button>
      <button
        type="button"
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
          isDarkMode
            ? "border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600"
            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-400"
        }`}
        aria-label="Notifications"
      >
        <BellIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
          isDarkMode
            ? "border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600"
            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-400"
        }`}
        aria-label="Profile"
      >
        <UserCircleIcon className="h-6 w-6" />
      </button>
    </div>
  </header>
);

export default DashboardTopNav;
