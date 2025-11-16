import { CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const AnalysisOverview = ({ results = [], isDarkMode, lastUploadedFile, onUploadAnother }) => {
  const positives = results.filter((item) => item.status === "positive");
  const improvements = results.filter((item) => item.status !== "positive");

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";

  return (
    <div className="flex flex-col gap-6">
      <header className={`rounded-3xl border p-6 ${cardStyles}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Session Analysis</h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              {lastUploadedFile ? (
                <>
                  Latest results for <span className="font-semibold text-blue-600">{lastUploadedFile}</span>. Review
                  highlights and improvement areas below.
                </>
              ) : (
                "Run an analysis from the Upload tab to view detailed biomechanics feedback."
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onUploadAnother}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Analyze Another Session
          </button>
        </div>
      </header>

      {results.length === 0 ? (
        <div className={`rounded-3xl border p-6 text-sm ${cardStyles}`}>
          <p className="font-semibold text-blue-600">No analysis yet</p>
          <p className={`mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Head to the upload section, submit a video, and run the analysis to populate this dashboard with AI-driven
            insights.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className={`rounded-3xl border p-6 ${cardStyles}`}>
            <h3 className="mb-4 text-lg font-semibold">Strength Highlights</h3>
            <div className="space-y-4">
              {positives.map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-emerald-200/40 bg-emerald-50/60 p-4 text-sm text-emerald-700">
                  <CheckCircleIcon className="mt-1 h-5 w-5" />
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-xs text-emerald-700/80">{item.description}</p>
                  </div>
                </div>
              ))}
              {positives.length === 0 && (
                <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  No perfect alignments were detected. Focus on the improvement plan to lift your metrics.
                </p>
              )}
            </div>
          </div>

          <div className={`rounded-3xl border p-6 ${cardStyles}`}>
            <h3 className="mb-4 text-lg font-semibold">Improvement Roadmap</h3>
            <div className="space-y-4">
              {improvements.map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-rose-200/60 bg-rose-50/70 p-4 text-sm text-rose-700">
                  <ExclamationTriangleIcon className="mt-1 h-5 w-5" />
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-xs text-rose-700/80">{item.description}</p>
                  </div>
                </div>
              ))}
              {improvements.length === 0 && (
                <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Great work! No major deviations were detected in this session.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className={`rounded-3xl border p-6 text-sm ${cardStyles}`}>
          <h3 className="text-lg font-semibold">Next Steps</h3>
          <ol className={`mt-3 space-y-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
            <li>1. Apply targeted drills focusing on the highlighted improvement areas.</li>
            <li>2. Record a fresh session after adjustments and re-run the analysis.</li>
            <li>3. Track week-over-week metrics in the Progress Tracker tab.</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default AnalysisOverview;

