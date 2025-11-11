import { useEffect, useState } from "react";

const SectionLoader = ({ height = 140, delayMs = 400, children }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  if (!showContent) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <div className="mb-4 h-6 w-48 rounded-md animate-fade-in bg-slate-200" />
        <div className="mb-8 h-8 w-3/4 rounded-md animate-shimmer" style={{ height }} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-40 rounded-2xl animate-shimmer" />
          <div className="h-40 rounded-2xl animate-shimmer" />
          <div className="h-40 rounded-2xl animate-shimmer" />
        </div>
      </div>
    );
  }

  return children;
};

export default SectionLoader;
