import { Outlet } from "react-router-dom";
import Navbar from "../features/navbar/components/Navbar";

const AppLayout = () => (
  <div className="flex min-h-screen flex-col bg-white">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
