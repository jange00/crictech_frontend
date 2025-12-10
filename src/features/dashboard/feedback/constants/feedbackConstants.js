export const DEFAULT_FEEDBACK_DATA = {
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




