import { SparklesIcon, ChartBarIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';

export const HERO_DATA = {
  badge: "AI Biomechanics for Right-Arm Spin",
  title: "Enhancing Spin Bowling through Artificial Intelligence.",
  subtitle: "Analyze, improve, and perfect your right-arm spin bowling action with AI-powered biomechanical insights tailored for amateur cricketers and coaches.",
  primaryAction: {
    label: "Get Started",
    path: "/signup",
  },
  secondaryAction: {
    label: "Watch Demo",
    path: "/watch-demo",
  },
  poster: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
};

export const FEATURES_DATA = [
  {
    title: "Pose Detection with AI",
    description:
      "Capture 3D joint positions with precision using computer vision tuned for right-arm spin bowlers, highlighting deviations frame-by-frame.",
    icon: SparklesIcon,
  },
  {
    title: "Real-Time Performance Feedback",
    description:
      "Receive instant feedback on release angles, wrist position, spin rate, and stride alignment to make corrections during every session.",
    icon: ChartBarIcon,
  },
  {
    title: "Progress Tracking Dashboard",
    description:
      "Visualize improvements across training blocks with trend lines, day-by-day benchmarks, and personalized AI training agendas.",
    icon: PresentationChartLineIcon,
  },
];

export const HOW_IT_WORKS_DATA = [
  {
    title: "Capture",
    desc: "Record a bowling clip from your phone—no markers or special gear needed.",
  },
  {
    title: "Analyze",
    desc: "AI extracts joint positions and computes release angle, spin rate, and alignment.",
  },
  {
    title: "Correct",
    desc: "Get actionable drills and cues tailored to your specific deviations.",
  },
];

export const TESTIMONIALS_DATA = [
  {
    quote:
      "Within four weeks we corrected release timing and improved drift consistency. The AI feedback made remote coaching effortless.",
    name: "Coach Priya Sharma",
    role: "Level 2 Cricket Coach",
  },
  {
    quote:
      "I could finally see what my wrist was doing at release. The visual overlays and drills refined my control over flight and spin.",
    name: "Rohit Verma",
    role: "Amateur Right-Arm Spinner",
  },
  {
    quote:
      "The progress dashboard gave our academy clear metrics each session. It keeps bowlers accountable and motivated.",
    name: "Anita Das",
    role: "Academy Director",
  },
];

export const LOGOS_DATA = ["Academy Pro", "SpinLab", "CrickTech", "CoachNet", "BiomechX", "RightArm"];

export const DEMO_DATA = {
  poster: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
  title: "See AI analysis in action",
  description:
    "Watch how release angle, spin rate, and wrist alignment are measured frame-by-frame to guide real-time corrections for right-arm spin bowlers.",
  metrics: [
    { label: "Release Angle", value: "32°" },
    { label: "Spin Rate", value: "1850 rpm" },
    { label: "Accuracy Score", value: "92%", highlight: true },
  ],
};

export const FOOTER_DATA = {
  brand: "CricketAI",
  description: "Empowering amateur cricketers and coaches with AI-driven biomechanics to master right-arm spin bowling.",
  links: [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Privacy", to: "/privacy" },
    { label: "Terms", to: "/terms" },
  ],
  socialLinks: [
    { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
    { label: "YouTube", href: "https://youtube.com", icon: "yt" },
    { label: "GitHub", href: "https://github.com", icon: "gh" },
  ],
};
