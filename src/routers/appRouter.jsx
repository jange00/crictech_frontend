import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import NotFound from "../components/NotFound/NotFound";
import ProtectedRoute from "./adminGuard";
import AdminLayout from "../layouts/AdminLayout";
import Placeholder from "../components/common/Placeholder";
import LandingPage from "../pages/LandingPage/LandingPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "/login", element: <Placeholder title="Login" /> },
      { path: "/get-started", element: <Placeholder title="Get Started" /> },
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
