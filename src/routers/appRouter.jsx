import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import NotFound from "../components/NotFound/NotFound";
import ProtectedRoute from "./adminGuard";
import AdminLayout from "../layouts/AdminLayout";
import Placeholder from "../components/common/Placeholder";
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/register", element: <SignupPage /> },
      { path: "/get-started", element: <SignupPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/watch-demo", element: <Placeholder title="Watch Demo" /> },
      { path: "/about", element: <Placeholder title="About" /> },
      { path: "/contact", element: <Placeholder title="Contact" /> },
      { path: "/privacy", element: <Placeholder title="Privacy Policy" /> },
      { path: "/terms", element: <Placeholder title="Terms of Service" /> },
    ],
  },
  {
    element: (
      <ProtectedRoute requiredRole="Admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [],
  },
]);
