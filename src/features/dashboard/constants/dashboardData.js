import { BoltIcon, ArrowPathIcon, AdjustmentsHorizontalIcon, ChartPieIcon } from "@heroicons/react/24/outline";

export const DASHBOARD_METRICS = [
  {
    id: "avg-speed",
    label: "Average Bowling Speed",
    value: "132 km/h",
    change: "+4.2%",
    changeType: "positive",
    icon: BoltIcon,
  },
  {
    id: "spin-rate",
    label: "Spin Rate",
    value: "1960 rpm",
    change: "+3.1%",
    changeType: "positive",
    icon: ArrowPathIcon,
  },
  {
    id: "wrist-alignment",
    label: "Wrist Angle Consistency",
    value: "88%",
    change: "+8%",
    changeType: "positive",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    id: "accuracy",
    label: "Accuracy Score",
    value: "92%",
    change: "-1.4%",
    changeType: "negative",
    icon: ChartPieIcon,
  },
];

export const PROGRESS_LINE_DATA = [
  { session: "Week 1", speed: 124, accuracy: 78 },
  { session: "Week 2", speed: 126, accuracy: 81 },
  { session: "Week 3", speed: 129, accuracy: 84 },
  { session: "Week 4", speed: 131, accuracy: 87 },
  { session: "Week 5", speed: 133, accuracy: 90 },
];

export const BENCHMARK_BAR_DATA = [
  { metric: "Speed", user: 132, expert: 138 },
  { metric: "Spin", user: 1960, expert: 2080 },
  { metric: "Wrist", user: 88, expert: 94 },
  { metric: "Accuracy", user: 92, expert: 96 },
];

export const AI_FEEDBACK_ITEMS = [
  {
    id: "feedback-1",
    title: "Wrist Alignment",
    message: "Your wrist alignment improved by 8%. Maintain the neutral wrist at release to keep the spin rate climbing.",
  },
  {
    id: "feedback-2",
    title: "Shoulder Elevation",
    message: "Try maintaining shoulder elevation during the gather phase for better spin and line consistency.",
  },
  {
    id: "feedback-3",
    title: "Release Timing",
    message: "Release timing varied after the 6th session. Focus on finishing higher to regain your previous accuracy peak.",
  },
];
