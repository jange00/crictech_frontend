const PoseOverlay = ({ overlayData, jointAngles, isExpert = false, isDarkMode }) => {
  return (
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
        {overlayData.map((joint) => {
          const jointData = jointAngles.find((j) => j.joint === joint.name);
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
};

export default PoseOverlay;


