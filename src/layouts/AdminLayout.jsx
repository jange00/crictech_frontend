import { Outlet } from "react-router-dom";

const AdminLayout = () => (
  <div className="flex min-h-screen flex-col bg-white">
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;

