/**
 * Reusable Skeleton Loading Components
 */

// Base skeleton with shimmer animation
const SkeletonBase = ({ className = "", isDarkMode = false, style = {} }) => {
  const baseClasses = `animate-pulse rounded ${className}`;
  const bgColor = isDarkMode ? "bg-slate-800" : "bg-slate-200";
  
  return (
    <div
      className={`${baseClasses} ${bgColor}`}
      style={style}
    />
  );
};

// Skeleton for Dashboard Summary Card
export const SkeletonCard = ({ isDarkMode = false }) => (
  <div
    className={`flex flex-col gap-4 rounded-2xl border p-5 transition shadow-sm ${
      isDarkMode
        ? "border-slate-800 bg-slate-900/70"
        : "border-slate-200 bg-white"
    }`}
  >
    <div className="flex items-center justify-between">
      <SkeletonBase className="h-4 w-32" isDarkMode={isDarkMode} />
      <SkeletonBase className="h-10 w-10 rounded-xl" isDarkMode={isDarkMode} />
    </div>
    <div className="flex items-baseline justify-between">
      <SkeletonBase className="h-8 w-24" isDarkMode={isDarkMode} />
      <SkeletonBase className="h-4 w-12" isDarkMode={isDarkMode} />
    </div>
    <SkeletonBase className="h-3 w-full" isDarkMode={isDarkMode} />
  </div>
);

// Skeleton for Chart
export const SkeletonChart = ({ isDarkMode = false, height = "300px" }) => (
  <div
    className={`rounded-2xl border p-6 transition shadow-sm ${
      isDarkMode
        ? "border-slate-800 bg-slate-900/70"
        : "border-slate-200 bg-white"
    }`}
    style={{ height }}
  >
    <div className="mb-4 flex items-center justify-between">
      <SkeletonBase className="h-6 w-40" isDarkMode={isDarkMode} />
      <SkeletonBase className="h-4 w-24" isDarkMode={isDarkMode} />
    </div>
    <div className="flex h-[calc(100%-3rem)] items-end justify-between gap-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonBase
          key={i}
          className="w-full"
          style={{
            height: `${Math.random() * 60 + 40}%`,
          }}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  </div>
);

// Skeleton for Feedback Card
export const SkeletonFeedbackCard = ({ isDarkMode = false }) => (
  <div
    className={`rounded-2xl border p-6 transition shadow-sm ${
      isDarkMode
        ? "border-slate-800 bg-slate-900/70"
        : "border-slate-200 bg-white"
    }`}
  >
    <div className="mb-4 flex items-center gap-3">
      <SkeletonBase className="h-5 w-5 rounded-full" isDarkMode={isDarkMode} />
      <SkeletonBase className="h-5 w-32" isDarkMode={isDarkMode} />
    </div>
    <SkeletonBase className="mb-2 h-4 w-full" isDarkMode={isDarkMode} />
    <SkeletonBase className="mb-2 h-4 w-3/4" isDarkMode={isDarkMode} />
    <SkeletonBase className="h-4 w-1/2" isDarkMode={isDarkMode} />
  </div>
);

// Skeleton for Table Row
export const SkeletonTableRow = ({ isDarkMode = false, columns = 4 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <SkeletonBase className="h-4 w-full" isDarkMode={isDarkMode} />
      </td>
    ))}
  </tr>
);

// Skeleton for List Item
export const SkeletonListItem = ({ isDarkMode = false }) => (
  <div className="flex items-center gap-4 p-4">
    <SkeletonBase className="h-12 w-12 rounded-full" isDarkMode={isDarkMode} />
    <div className="flex-1 space-y-2">
      <SkeletonBase className="h-4 w-3/4" isDarkMode={isDarkMode} />
      <SkeletonBase className="h-3 w-1/2" isDarkMode={isDarkMode} />
    </div>
  </div>
);

// Skeleton for Profile Section
export const SkeletonProfile = ({ isDarkMode = false }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <SkeletonBase className="h-24 w-24 rounded-2xl" isDarkMode={isDarkMode} />
      <div className="flex-1 space-y-2">
        <SkeletonBase className="h-5 w-32" isDarkMode={isDarkMode} />
        <SkeletonBase className="h-4 w-48" isDarkMode={isDarkMode} />
      </div>
    </div>
    <div className="space-y-4">
      <SkeletonBase className="h-10 w-full rounded-2xl" isDarkMode={isDarkMode} />
      <SkeletonBase className="h-10 w-full rounded-2xl" isDarkMode={isDarkMode} />
    </div>
  </div>
);

// Generic skeleton with custom dimensions
export const Skeleton = ({ width = "100%", height = "1rem", className = "", isDarkMode = false }) => (
  <SkeletonBase
    className={className}
    style={{ width, height }}
    isDarkMode={isDarkMode}
  />
);

export default SkeletonBase;
