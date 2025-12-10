const SessionHistoryTable = ({ sessionHistory, isDarkMode }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]";

  return (
    <section className={`rounded-3xl border p-6 transition shadow-sm ${cardStyles}`}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Session History</h3>
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
            isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
          }`}
        >
          {sessionHistory.length} Sessions
        </span>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full">
          <thead>
            <tr
              className={`border-b ${
                isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"
              }`}
            >
              <th
                className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Date
              </th>
              <th
                className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Accuracy
              </th>
              <th
                className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Spin Rate
              </th>
              <th
                className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Feedback Summary
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {sessionHistory.map((session, index) => (
              <tr
                key={session.id}
                className={`transition ${
                  isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                }`}
              >
                <td className={`px-5 py-4 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <span
                        className={`inline-flex h-2 w-2 rounded-full ${
                          isDarkMode ? "bg-emerald-400" : "bg-emerald-500"
                        }`}
                      />
                    )}
                    {formatDate(session.date)}
                  </div>
                </td>
                <td className={`px-5 py-4 text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                  {session.accuracy}
                </td>
                <td className={`px-5 py-4 text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                  {session.spinRate}
                </td>
                <td className={`px-5 py-4 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  {session.feedbackSummary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SessionHistoryTable;




