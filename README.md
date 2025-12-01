# CricTech Frontend

A modern, feature-rich cricket bowling analysis platform built with React and Vite. This application provides AI-powered feedback, performance tracking, and comprehensive analytics for cricket bowlers.

## 🚀 Tech Stack

- **Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 3.4.18
- **Routing**: React Router DOM 7.6.1
- **State Management**: React Context API
- **Charts**: Recharts 2.15.3
- **Icons**: Heroicons 2.2.0
- **Notifications**: React Toastify 11.0.5
- **HTTP Client**: Axios 1.9.0
- **Form Handling**: Formik 2.4.6 + Yup 1.6.1

## 📁 Project Structure

```
src/
├── features/                    # Feature-based modules
│   ├── auth/                    # Authentication feature
│   │   ├── components/
│   │   └── AuthProvide.jsx      # Auth context provider
│   │
│   ├── dashboard/               # Dashboard feature
│   │   ├── components/          # Shared dashboard components
│   │   │   ├── DashboardContent.jsx
│   │   │   ├── UploadWorkflow.jsx
│   │   │   └── AnalysisOverview.jsx
│   │   │
│   │   ├── feedback/            # AI Feedback feature
│   │   │   ├── FeedbackPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── ComparisonViewer.jsx
│   │   │   │   ├── VideoPanel.jsx
│   │   │   │   ├── PoseOverlay.jsx
│   │   │   │   ├── FeedbackCard.jsx
│   │   │   │   └── FeedbackCards.jsx
│   │   │   ├── constants/
│   │   │   │   └── feedbackConstants.js
│   │   │   └── utils/
│   │   │       └── poseUtils.js
│   │   │
│   │   ├── progress/            # Progress Tracker feature
│   │   │   ├── ProgressTrackerPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── PerformanceChart.jsx
│   │   │   │   ├── SessionHistoryTable.jsx
│   │   │   │   ├── QuickStats.jsx
│   │   │   │   └── AIInsightsCard.jsx
│   │   │   └── constants/
│   │   │       └── progressConstants.js
│   │   │
│   │   ├── settings/            # Settings feature
│   │   │   ├── SettingsPage.jsx
│   │   │   └── components/
│   │   │       ├── ProfileSection.jsx
│   │   │       ├── VideoPreferencesSection.jsx
│   │   │       ├── PrivacySection.jsx
│   │   │       └── LogoutSection.jsx
│   │   │
│   │   └── constants/
│   │       └── dashboardData.js
│   │
│   ├── landing/                 # Landing page feature
│   ├── navbar/                  # Navigation feature
│   └── auth/                    # Auth pages feature
│
├── pages/                       # Page components
│   ├── Auth/
│   ├── Dashboard/
│   └── LandingPage/
│
├── ui/                          # Reusable UI components
│   ├── auth/
│   ├── dashboard/
│   ├── landing/
│   └── navbar/
│
├── layouts/                     # Layout components
│   ├── AppLayout.jsx
│   ├── AdminLayout.jsx
│   └── ProtectedRoutes.js
│
├── routers/                     # Routing configuration
│   └── appRouter.jsx
│
├── provider/                    # Context providers
│   └── reactQueryProvider.jsx
│
└── main.jsx                     # Application entry point
```

## ✨ Features

### 1. **Dashboard Overview**
- Performance metrics cards
- Interactive progress charts
- Benchmark comparisons
- Quick feedback summaries

### 2. **Video Upload & Analysis**
- Drag & drop video upload
- Video preview with pose detection overlay
- Real-time analysis processing
- Joint angle detection visualization

### 3. **AI Feedback System**
- Side-by-side comparison viewer (User vs Expert)
- Pose overlay with joint angle annotations
- AI-generated feedback cards
- Detailed improvement suggestions

### 4. **Progress Tracker**
- Interactive performance graphs:
  - Bowling Speed
  - Wrist Alignment
  - Spin Consistency
  - Accuracy Index
- Session history table
- AI insights summary
- CSV export functionality

### 5. **Settings & Preferences**
- Profile customization (name, picture, preferred hand)
- Video upload preferences (resolution, frame rate)
- Privacy settings
- Data export
- Account management

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd crictech_frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

5. Preview production build
```bash
npm run preview
```

## 📦 Component Organization

### Feature-Based Architecture

Each major feature is organized in its own folder with:
- **Main Page Component**: The primary page component
- **components/**: Feature-specific components
- **constants/**: Default data and configuration
- **utils/**: Helper functions (if needed)

### Example: Feedback Feature

```
feedback/
├── FeedbackPage.jsx           # Main page (orchestrates components)
├── components/
│   ├── ComparisonViewer.jsx   # Video comparison section
│   ├── VideoPanel.jsx          # Individual video panel
│   ├── PoseOverlay.jsx         # Pose detection overlay
│   ├── FeedbackCard.jsx       # Single feedback card
│   └── FeedbackCards.jsx      # Feedback cards container
├── constants/
│   └── feedbackConstants.js   # Default/mock data
└── utils/
    └── poseUtils.js           # Pose calculation utilities
```

## 🔌 Backend Integration Guide

### API Endpoints Structure

The codebase is structured to easily integrate with backend APIs. Here's the recommended approach:

#### 1. **Feedback Feature**
```javascript
// In FeedbackPage.jsx or a service file
const fetchFeedbackData = async (sessionId) => {
  const response = await axios.get(`/api/feedback/${sessionId}`);
  return response.data;
};
```

**Expected API Response:**
```json
{
  "userVideoUrl": "https://...",
  "expertVideoUrl": "https://...",
  "jointAngles": [
    {
      "joint": "Elbow",
      "userAngle": 82,
      "expertAngle": 95,
      "status": "warning"
    }
  ],
  "feedbackItems": [...]
}
```

#### 2. **Progress Tracker**
```javascript
// Fetch progress data
const fetchProgressData = async (userId, timeRange) => {
  const response = await axios.get(`/api/progress/${userId}`, {
    params: { range: timeRange }
  });
  return response.data;
};
```

**Expected API Response:**
```json
{
  "bowlingSpeed": [{ "date": "Week 1", "value": 124 }, ...],
  "wristAlignment": [...],
  "spinConsistency": [...],
  "accuracyIndex": [...],
  "sessionHistory": [...],
  "aiInsights": {
    "improvement": "+14%",
    "metric": "delivery consistency",
    "period": "this month"
  }
}
```

#### 3. **Settings**
```javascript
// Update profile
const updateProfile = async (profileData) => {
  const response = await axios.put('/api/user/profile', profileData);
  return response.data;
};

// Update video preferences
const updateVideoPreferences = async (preferences) => {
  const response = await axios.put('/api/user/preferences', preferences);
  return response.data;
};
```

### Service Layer Pattern

Create service files for API calls:

```javascript
// src/services/feedbackService.js
import axios from 'axios';

export const feedbackService = {
  getFeedback: (sessionId) => 
    axios.get(`/api/feedback/${sessionId}`),
  
  getComparison: (sessionId) => 
    axios.get(`/api/feedback/${sessionId}/comparison`),
};
```

## 🎨 Styling Guidelines

### Design System

- **Colors**: 
  - Primary: Blue-600 (`#2563eb`)
  - Success: Emerald-500 (`#10b981`)
  - Warning: Rose-500 (`#f43f5e`)
  - Dark Mode: Slate-900/800

- **Border Radius**:
  - Cards: `rounded-3xl` (24px)
  - Buttons: `rounded-2xl` (16px)
  - Small elements: `rounded-xl` (12px)

- **Shadows**:
  - Cards: `shadow-[0_12px_30px_-25px_rgba(15,23,42,0.9)]`
  - Buttons: `shadow-md shadow-blue-600/30`

### Dark Mode

All components support dark mode via the `isDarkMode` prop. Use conditional classes:

```javascript
const cardStyles = isDarkMode
  ? "border-slate-800 bg-slate-900/70 text-slate-100"
  : "border-slate-200 bg-white text-slate-900";
```

## 🔐 Authentication

The app uses React Context for authentication:

```javascript
import { useAuth } from '../auth/AuthProvide';

const { user, login, logout, isAuthenticated } = useAuth();
```

**Auth Flow:**
1. User logs in → `login(userData, token)` called
2. Data stored in localStorage
3. Protected routes check authentication
4. Logout clears localStorage and redirects

## 📝 Development Guidelines

### Adding a New Feature

1. Create feature folder in `src/features/dashboard/`
2. Create main page component
3. Break down into smaller components in `components/` folder
4. Add constants in `constants/` folder
5. Import and use in `DashboardContent.jsx`

### Component Best Practices

- **Single Responsibility**: Each component should do one thing well
- **Props**: Keep props minimal and well-typed (consider PropTypes)
- **State**: Use local state for UI, context for global state
- **Reusability**: Extract common patterns into shared components

### Code Organization

- **Components**: Feature-specific components in feature folders
- **UI Components**: Reusable UI in `src/ui/`
- **Constants**: Default data and configuration
- **Utils**: Pure utility functions

## 🧪 Testing

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

1. Follow the feature-based folder structure
2. Maintain consistent styling with Tailwind CSS
3. Support both light and dark modes
4. Write clean, readable, and documented code
5. Test components before submitting

## 📞 Support

For questions or issues, please contact the development team.

---

**Built with ❤️ for Cricket Analysis**
