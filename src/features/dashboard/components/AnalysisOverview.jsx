import { CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useAnalysis } from "../../../hooks/useAnalysis";
import { Skeleton, SkeletonFeedbackCard } from "../../../ui/common/Skeleton";

const AnalysisOverview = ({ analysisId = null, isDarkMode, lastUploadedFile, onUploadAnother, onViewFeedback }) => {
  // Fetch analysis data if analysisId is provided
  const { useSingleAnalysis, useFeedback } = useAnalysis();
  const { data: analysis, isLoading: analysisLoading } = useSingleAnalysis(analysisId);
  const { data: feedback, isLoading: feedbackLoading } = useFeedback(analysisId);

  // Transform feedback items to the format expected by the component
  const feedbackItems = feedback?.items || analysis?.feedbackItems || [];
  const positives = feedbackItems.filter((item) => item.type === "positive");
  const improvements = feedbackItems.filter((item) => item.type !== "positive");

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
          <div className="flex flex-wrap gap-3">
            {feedbackItems.length > 0 && onViewFeedback && (
              <button
                type="button"
                onClick={onViewFeedback}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-700"
              >
                <EyeIcon className="h-5 w-5" />
                View Detailed Feedback
              </button>
            )}
            <button
              type="button"
              onClick={onUploadAnother}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Analyze Another Session
            </button>
          </div>
        </div>
      </header>

      {analysisLoading || feedbackLoading ? (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className={`rounded-3xl border p-6 ${cardStyles}`}>
            <Skeleton height="1.5rem" width="40%" className="mb-4" isDarkMode={isDarkMode} />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonFeedbackCard key={i} isDarkMode={isDarkMode} />
              ))}
            </div>
          </div>
          <div className={`rounded-3xl border p-6 ${cardStyles}`}>
            <Skeleton height="1.5rem" width="50%" className="mb-4" isDarkMode={isDarkMode} />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonFeedbackCard key={i} isDarkMode={isDarkMode} />
              ))}
            </div>
          </div>
        </div>
      ) : feedbackItems.length === 0 ? (
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
                <div key={item.id || item.title} className="flex items-start gap-3 rounded-2xl border border-emerald-200/40 bg-emerald-50/60 p-4 text-sm text-emerald-700">
                  <CheckCircleIcon className="mt-1 h-5 w-5" />
                  <div>
                    <p className="font-semibold">{item.title || item.label}</p>
                    <p className="text-xs text-emerald-700/80">{item.message || item.description}</p>
                    {item.suggestion && (
                      <p className="mt-1 text-xs text-emerald-700/60">💡 {item.suggestion}</p>
                    )}
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
                <div key={item.id || item.title} className="flex items-start gap-3 rounded-2xl border border-rose-200/60 bg-rose-50/70 p-4 text-sm text-rose-700">
                  <ExclamationTriangleIcon className="mt-1 h-5 w-5" />
                  <div>
                    <p className="font-semibold">{item.title || item.label}</p>
                    <p className="text-xs text-rose-700/80">{item.message || item.description}</p>
                    {item.suggestion && (
                      <p className="mt-1 text-xs text-rose-700/60">💡 {item.suggestion}</p>
                    )}
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

      {feedbackItems.length > 0 && (
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
