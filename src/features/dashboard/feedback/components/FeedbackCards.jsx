import FeedbackCard from "./FeedbackCard";

const FeedbackCards = ({ feedbackItems, isDarkMode }) => {
  return (
    <section
      className={`rounded-3xl border p-6 ${
        isDarkMode
          ? "border-slate-800 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]"
          : "border-slate-200 bg-white text-slate-900 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.25)]"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI-Generated Suggestions</h3>
        <span className="text-xs text-slate-500">{feedbackItems.length} feedback items</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {feedbackItems.map((item) => (
          <FeedbackCard key={item.id} item={item} isDarkMode={isDarkMode} />
        ))}
      </div>
    </section>
  );
};

export default FeedbackCards;


