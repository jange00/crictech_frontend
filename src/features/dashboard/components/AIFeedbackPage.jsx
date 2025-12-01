import { useState, useRef, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

const AIFeedbackPage = ({ isDarkMode, feedbackData = null }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const userVideoRef = useRef(null);
  const expertVideoRef = useRef(null);

  // Default mock data if no feedback data is provided
  const defaultFeedbackData = {
    userVideoUrl: "",
    expertVideoUrl: "",
    jointAngles: [
      { joint: "Elbow", userAngle: 82, expertAngle: 95, status: "warning" },
      { joint: "Shoulder", userAngle: 145, expertAngle: 150, status: "warning" },
      { joint: "Wrist", userAngle: 12, expertAngle: 8, status: "warning" },
    ],
    feedbackItems: [
      {
        id: "feedback-1",
        type: "warning",
        title: "Elbow Angle During Delivery",
        message: "Elbow angle during delivery is lower than optimal (82° vs 95°).",
        suggestion: "Focus on maintaining a higher elbow position during the delivery stride.",
      },
      {
        id: "feedback-2",
        type: "warning",
        title: "Follow-through Motion",
        message: "Follow-through motion incomplete — rotate shoulder more.",
        suggestion: "Extend your follow-through by rotating your shoulder through the release point.",
      },
      {
        id: "feedback-3",
        type: "positive",
        title: "Wrist Position",
        message: "Wrist alignment is consistent throughout the delivery.",
        suggestion: "Maintain this wrist position for optimal spin generation.",
      },
    ],
  };

  const data = feedbackData || defaultFeedbackData;

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";

  const handlePlayPause = () => {
    if (userVideoRef.current && expertVideoRef.current) {
      if (isPlaying) {
        userVideoRef.current.pause();
        expertVideoRef.current.pause();
      } else {
        userVideoRef.current.play();
        expertVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRewatch = () => {
    if (userVideoRef.current && expertVideoRef.current) {
      userVideoRef.current.currentTime = 0;
      expertVideoRef.current.currentTime = 0;
      userVideoRef.current.play();
      expertVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const userVideo = userVideoRef.current;
    const expertVideo = expertVideoRef.current;

    const handleTimeUpdate = () => {
      if (userVideo && expertVideo) {
        const currentTime = userVideo.currentTime;
        setCurrentTime(currentTime);
        // Sync expert video with user video
        if (Math.abs(expertVideo.currentTime - currentTime) > 0.1) {
          expertVideo.currentTime = currentTime;
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (expertVideo) {
        expertVideo.play().catch(() => {
          // Handle play error silently
        });
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (expertVideo) {
        expertVideo.pause();
      }
    };

    if (userVideo) {
      userVideo.addEventListener("timeupdate", handleTimeUpdate);
      userVideo.addEventListener("play", handlePlay);
      userVideo.addEventListener("pause", handlePause);
    }

    return () => {
      if (userVideo) {
        userVideo.removeEventListener("timeupdate", handleTimeUpdate);
        userVideo.removeEventListener("play", handlePlay);
        userVideo.removeEventListener("pause", handlePause);
      }
    };
  }, []);

  // Mock pose overlay data - in real app, this would come from pose detection API
  const poseOverlayData = [
    { name: "Shoulder", x: 45, y: 25, angle: data.jointAngles.find((j) => j.joint === "Shoulder")?.userAngle || 145 },
    { name: "Elbow", x: 50, y: 40, angle: data.jointAngles.find((j) => j.joint === "Elbow")?.userAngle || 82 },
    { name: "Wrist", x: 52, y: 55, angle: data.jointAngles.find((j) => j.joint === "Wrist")?.userAngle || 12 },
  ];

  const expertPoseOverlayData = [
    { name: "Shoulder", x: 45, y: 25, angle: data.jointAngles.find((j) => j.joint === "Shoulder")?.expertAngle || 150 },
    { name: "Elbow", x: 50, y: 40, angle: data.jointAngles.find((j) => j.joint === "Elbow")?.expertAngle || 95 },
    { name: "Wrist", x: 52, y: 55, angle: data.jointAngles.find((j) => j.joint === "Wrist")?.expertAngle || 8 },
  ];

  const renderPoseOverlay = (overlayData, isExpert = false) => (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-full w-full">
        {/* Pose skeleton lines */}
        <svg className="absolute inset-0 h-full w-full" style={{ opacity: 0.6 }}>
          {/* Shoulder to Elbow */}
          <line
            x1={`${overlayData[0].x}%`}
            y1={`${overlayData[0].y}%`}
            x2={`${overlayData[1].x}%`}
            y2={`${overlayData[1].y}%`}
            stroke={isExpert ? "#10b981" : "#3b82f6"}
            strokeWidth="2"
          />
          {/* Elbow to Wrist */}
          <line
            x1={`${overlayData[1].x}%`}
            y1={`${overlayData[1].y}%`}
            x2={`${overlayData[2].x}%`}
            y2={`${overlayData[2].y}%`}
            stroke={isExpert ? "#10b981" : "#3b82f6"}
            strokeWidth="2"
          />
        </svg>

        {/* Joint markers and angles */}
        {overlayData.map((joint, idx) => {
          const jointData = data.jointAngles.find((j) => j.joint === joint.name);
          const isWarning = jointData?.status === "warning";
          return (
            <div
              key={joint.name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${joint.y}%`,
                left: `${joint.x}%`,
              }}
            >
              {/* Joint marker */}
              <div
                className={`relative h-4 w-4 rounded-full border-2 ${
                  isExpert
                    ? "border-emerald-400 bg-emerald-300/60"
                    : isWarning
                    ? "border-rose-400 bg-rose-300/60"
                    : "border-blue-400 bg-blue-300/60"
                }`}
              >
                <span
                  className={`absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-semibold ${
                    isDarkMode ? "bg-slate-900/90 text-white" : "bg-white/90 text-slate-900"
                  }`}
                >
                  {joint.name}: {joint.angle}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className={`rounded-3xl border p-6 ${cardStyles}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">AI Feedback Analysis</h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Compare your action with the expert model and review AI-generated suggestions for improvement.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRewatch}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Rewatch Feedback
          </button>
        </div>
      </header>

      {/* Comparison Viewer */}
      <section className={`rounded-3xl border p-6 ${cardStyles}`}>
        <h3 className="mb-4 text-lg font-semibold">Comparison Viewer</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User's Action Panel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-blue-600">Your Action</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <VideoCameraIcon className="h-4 w-4" />
                <span>Live Analysis</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-500/30 bg-slate-900">
              {data.userVideoUrl ? (
                <video
                  ref={userVideoRef}
                  src={data.userVideoUrl}
                  className="h-full w-full bg-black"
                  controls={false}
                  onTimeUpdate={handleTimeUpdate}
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-slate-800">
                  <div className="text-center">
                    <VideoCameraIcon className="mx-auto h-12 w-12 text-slate-500" />
                    <p className="mt-2 text-sm text-slate-400">User video placeholder</p>
                  </div>
                </div>
              )}
              {renderPoseOverlay(poseOverlayData, false)}
              {/* Play/Pause overlay button */}
              <button
                type="button"
                onClick={handlePlayPause}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600/90 p-3 text-white shadow-lg transition hover:bg-blue-700"
              >
                {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
              </button>
            </div>
            {/* Joint angles summary */}
            <div className={`rounded-xl border p-3 ${isDarkMode ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-slate-50"}`}>
              <p className="mb-2 text-xs font-semibold text-slate-500">Key Joint Angles</p>
              <div className="space-y-2">
                {data.jointAngles.map((joint) => (
                  <div key={joint.joint} className="flex items-center justify-between text-xs">
                    <span className={isDarkMode ? "text-slate-300" : "text-slate-600"}>{joint.joint}</span>
                    <span
                      className={`font-semibold ${
                        joint.status === "warning" ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      {joint.userAngle}°
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expert Model Panel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-emerald-600">Expert Model</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                <span>Optimal Form</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-slate-900">
              {data.expertVideoUrl ? (
                <video
                  ref={expertVideoRef}
                  src={data.expertVideoUrl}
                  className="h-full w-full bg-black"
                  controls={false}
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-slate-800">
                  <div className="text-center">
                    <CheckCircleIcon className="mx-auto h-12 w-12 text-emerald-500" />
                    <p className="mt-2 text-sm text-slate-400">Expert model reference</p>
                  </div>
                </div>
              )}
              {renderPoseOverlay(expertPoseOverlayData, true)}
            </div>
            {/* Expert joint angles summary */}
            <div className={`rounded-xl border p-3 ${isDarkMode ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-slate-50"}`}>
              <p className="mb-2 text-xs font-semibold text-slate-500">Optimal Angles</p>
              <div className="space-y-2">
                {data.jointAngles.map((joint) => (
                  <div key={joint.joint} className="flex items-center justify-between text-xs">
                    <span className={isDarkMode ? "text-slate-300" : "text-slate-600"}>{joint.joint}</span>
                    <span className="font-semibold text-emerald-600">{joint.expertAngle}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Textual Feedback Section */}
      <section className={`rounded-3xl border p-6 ${cardStyles}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">AI-Generated Suggestions</h3>
          <span className="text-xs text-slate-500">{data.feedbackItems.length} feedback items</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {data.feedbackItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col gap-3 rounded-2xl border-l-4 p-5 transition shadow-sm ${
                item.type === "positive"
                  ? isDarkMode
                    ? "border-l-emerald-500 border-slate-800 bg-emerald-950/20 text-slate-100"
                    : "border-l-emerald-500 border-slate-200 bg-emerald-50/60 text-slate-900"
                  : isDarkMode
                  ? "border-l-rose-500 border-slate-800 bg-rose-950/20 text-slate-100"
                  : "border-l-rose-500 border-slate-200 bg-rose-50/60 text-slate-900"
              }`}
            >
              <div className="flex items-start gap-3">
                {item.type === "positive" ? (
                  <CheckCircleIcon className="mt-1 h-5 w-5 text-emerald-600" />
                ) : (
                  <ExclamationTriangleIcon className="mt-1 h-5 w-5 text-rose-600" />
                )}
                <div className="flex-1">
                  <h4
                    className={`text-sm font-semibold ${
                      item.type === "positive" ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p className={`mt-1 text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {item.message}
                  </p>
                  {item.suggestion && (
                    <p className={`mt-2 text-xs italic ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      💡 {item.suggestion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleRewatch}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
        >
          <ArrowPathIcon className="h-5 w-5" />
          Rewatch Feedback
        </button>
        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
            isDarkMode
              ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-blue-400"
              : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600"
          }`}
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default AIFeedbackPage;

