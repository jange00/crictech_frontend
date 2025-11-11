import { NavLink } from "react-router-dom";

const LoginLink = () => (
  <NavLink
    to="/login"
    className={({ isActive }) =>
      `text-sm font-semibold transition-all duration-200 focus:outline-none focus:visible:ring-2 focus:visible:ring-blue-300 focus:visible:ring-offset-2 focus:visible:ring-offset-white ${
        isActive
          ? "text-blue-600 underline underline-offset-4"
          : "text-slate-700 hover:text-blue-600"
      }`
    }
  >
    Login
  </NavLink>
);

export default LoginLink;
