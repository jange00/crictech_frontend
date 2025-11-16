import { useEffect, useMemo, useRef, useState } from "react";
import {
  CloudArrowUpIcon,
  VideoCameraIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  RocketLaunchIcon,
  SparklesIcon,
  BoltIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

const ACCEPTED_TYPES = ["video/mp4", "video/quicktime"];

const UploadWorkflow = ({ isDarkMode, onUploadComplete, onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const inputRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setVideoUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(
    () => () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    },
    []
  );

  const handleSelectFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      alert("Please upload an .mp4 or .mov video file.");
      return;
    }

    setFile(selectedFile);
    setAnalysisComplete(false);
    setIsUploading(true);
    setProgress(0);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current);
          setIsUploading(false);
          onUploadComplete?.(selectedFile.name);
          return 100;
        }
        return prev + 8;
      });
    }, 180);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    handleSelectFile(droppedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (event) => {
    const selectedFile = event.target.files?.[0];
    handleSelectFile(selectedFile);
  };

  const handleRecord = () => {
    alert("Recording support is not available yet. Upload an existing video instead.");
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    const results = [
      {
        label: "Shoulder Alignment",
        description: "Maintained optimal elevation through release.",
        status: "positive",
      },
      {
        label: "Elbow Extension",
        description: "Late extension detected. Initiate follow-through earlier.",
        status: "negative",
      },
      {
        label: "Wrist Position",
        description: "Wrist angle deviated by 12°. Focus on neutral orientation.",
        status: "negative",
      },
      {
        label: "Stride Timing",
        description: "Stride synced with release frame. Keep rhythm steady.",
        status: "positive",
      },
    ];

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      onAnalysisComplete?.(results);
    }, 2400);
  };

  const dragClasses = useMemo(
    () =>
      `${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : isDarkMode
          ? "border-slate-700 bg-slate-900"
          : "border-dashed border-slate-300 bg-white"
      }`,
    [isDarkMode, isDragging]
  );

  const currentStep = useMemo(() => {
    if (analysisComplete) return 3;
    if (videoUrl) return 2;
    return 1;
  }, [analysisComplete, videoUrl]);

  const demoSessions = [
    {
      id: "demo-session-1",
      title: "Session 1 — Right Arm Off Break",
      description: "Recorded at CricTech Lab • Nov 8, 2025",
      fileType: "video/mp4",
    },
    {
      id: "demo-session-2",
      title: "Session 2 — Slider Variation",
      description: "Recorded at CricTech Lab • Oct 28, 2025",
      fileType: "video/mp4",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className={`flex flex-wrap items-center gap-3 rounded-3xl border px-4 py-3 ${isDarkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
        {["Upload", "Preview", "Analyze"].map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;
          return (
            <div key={step} className="flex items-center gap-2 text-sm font-semibold">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs ${
                  isCompleted
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : isActive
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 bg-white text-slate-400"
                }`}
              >
                {stepNumber}
              </span>
              <span className={isActive ? "text-blue-600" : "text-slate-400"}>{step}</span>
              {index < 2 && <span className="text-slate-300">›</span>}
            </div>
          );
        })}
      </div>

      <section
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col gap-4 rounded-3xl border-2 border-dashed p-8 text-center transition ${dragClasses}`}
      >
        <CloudArrowUpIcon className={`mx-auto h-12 w-12 ${isDragging ? "text-blue-600" : "text-blue-500"}`} />
        <div className="space-y-2">
          <p className={`text-lg font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
            Drag & drop your bowling video
          </p>
          <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            or click the button below. Accepted formats: .mp4, .mov (max 500MB)
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
          >
            <CloudArrowUpIcon className="h-5 w-5" />
            Choose Video
          </button>
          <button
            type="button"
            onClick={handleRecord}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
              isDarkMode
                ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-blue-400"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            <VideoCameraIcon className="h-5 w-5" />
            Record Video
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime"
          className="hidden"
          onChange={handleInputChange}
        />
        {isUploading && (
          <div className="mx-auto mt-4 w-full max-w-xl">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </section>

      <div className={`flex items-start gap-3 rounded-3xl border p-5 ${isDarkMode ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}>
        <InformationCircleIcon className="mt-1 h-5 w-5 text-blue-500" />
        <div className="text-sm leading-relaxed">
          <p className="font-semibold text-blue-600">Best capture tips</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Record at 60fps or higher from the side-on angle covering gather to follow-through.</li>
            <li>Ensure the bowler occupies 70% of the frame and the crease is visible.</li>
            <li>Upload within 500MB for fastest analysis turnaround.</li>
          </ul>
        </div>
      </div>

      <section
        className={`rounded-3xl border p-6 ${
          isDarkMode ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">CricTech Demo Sessions</h3>
            <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Load a sample video to explore the full workflow before uploading your own footage.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-blue-500 px-4 py-2 text-xs font-semibold text-blue-500 transition hover:bg-blue-500 hover:text-white"
            onClick={() => {
              const demoFile = new File([""], "crictech-demo-session.mp4", { type: "video/mp4" });
              handleSelectFile(demoFile);
            }}
          >
            Try Full Demo
          </button>
        </header>
        <div className="space-y-3">
          {demoSessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => {
                const demoFile = new File([""], `${session.title.replace(/\s+/g, "-")}.mp4`, { type: session.fileType });
                handleSelectFile(demoFile);
              }}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                isDarkMode ? "border-slate-700 hover:border-blue-500 hover:text-blue-300" : "border-slate-200 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              <div>
                <p className="text-sm font-semibold">{session.title}</p>
                <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{session.description}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{session.fileType}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <PlayIcon className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {videoUrl && (
        <section
          className={`grid gap-6 rounded-3xl border p-6 transition ${
            isDarkMode ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900"
          }`}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,auto)_minmax(0,260px)]">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
                <video src={videoUrl} controls className="h-full w-full bg-black" />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative h-full w-full max-w-xl">
                    {["Shoulder", "Elbow", "Wrist"].map((joint, idx) => (
                      <div
                        key={joint}
                        className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${
                          idx % 2 === 0 ? "border-emerald-400 bg-emerald-300/60" : "border-red-400 bg-red-300/60"
                        }`}
                        style={{
                          top: `${30 + idx * 18}%`,
                          left: `${45 + idx * 12}%`,
                        }}
                      >
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/80 px-2 text-[10px] font-semibold text-white">
                          {joint}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  <PlayCircleIcon className="h-5 w-5" />
                  {isAnalyzing ? "Analyzing..." : "Analyze Now"}
                </button>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-blue-400"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  Replace Video
                </button>
              </div>
            </div>

            <div
              className={`rounded-2xl border p-4 ${
                isDarkMode ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-slate-50"
              }`}
            >
              <h4 className="mb-3 text-sm font-semibold text-blue-600">Detected joints</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "Shoulder", status: "correct" },
                  { label: "Elbow", status: "warning" },
                  { label: "Wrist", status: "warning" },
                ].map(({ label, status }) => (
                  <li key={label} className="flex items-center justify-between">
                    <span>{label}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                        status === "correct"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {status === "correct" ? "Aligned" : "Adjust"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {isAnalyzing && (
            <div
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                isDarkMode
                  ? "border-blue-900 bg-blue-950/50 text-blue-200"
                  : "border-blue-200 bg-blue-50 text-blue-700"
              }`}
            >
              <span
                className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
                  isDarkMode ? "border-blue-300" : "border-blue-500"
                }`}
              />
              Analyzing Bowling Mechanics…
            </div>
          )}

          {analysisComplete && (
            <div className="space-y-6">
              <div
                className={`grid gap-4 rounded-2xl border p-5 text-sm sm:grid-cols-2 ${
                  isDarkMode
                    ? "border-slate-800 bg-slate-900/80 text-slate-100"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                {[
                  {
                    label: "Shoulder Alignment",
                    description: "Maintained optimal elevation through release.",
                    status: "positive",
                  },
                  {
                    label: "Elbow Extension",
                    description: "Late extension detected. Initiate follow-through earlier.",
                    status: "negative",
                  },
                  {
                    label: "Wrist Position",
                    description: "Wrist angle deviated by 12°. Focus on neutral orientation.",
                    status: "negative",
                  },
                  {
                    label: "Stride Timing",
                    description: "Stride synced with release frame. Keep rhythm steady.",
                    status: "positive",
                  },
                ].map(({ label, description, status }) => (
                  <div
                    key={label}
                    className={`flex items-start gap-3 rounded-xl border p-4 ${
                      status === "positive"
                        ? "border-emerald-200/40 bg-emerald-50/60 text-emerald-700"
                        : "border-rose-200/60 bg-rose-50/70 text-rose-700"
                    }`}
                  >
                    {status === "positive" ? (
                      <CheckCircleIcon className="mt-1 h-5 w-5" />
                    ) : (
                      <ExclamationCircleIcon className="mt-1 h-5 w-5" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className={`text-xs ${status === "positive" ? "text-emerald-700/80" : "text-rose-700/80"}`}>
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={`grid gap-4 rounded-2xl border p-6 text-sm sm:grid-cols-2 ${
                  isDarkMode
                    ? "border-slate-800 bg-slate-900/80 text-slate-100"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                <div>
                  <h4 className="text-sm font-semibold text-blue-500">Performance vs Average</h4>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "Spin Rate", value: 85 },
                      { label: "Accuracy", value: 89 },
                      { label: "Body Alignment", value: 92 },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-400">
                          <span>{label}</span>
                          <span>{value}%</span>
                        </div>
                        <div className={`h-2 rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}>
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-500">Action Items for Next Session</h4>
                  <ul className={`mt-4 space-y-3 text-xs ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-500" />
                      Focus on extending your follow-through during release.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-500" />
                      Maintain current wrist angle consistency for optimal spin.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-500" />
                      Increase run-up pace to boost bowling velocity.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default UploadWorkflow;
