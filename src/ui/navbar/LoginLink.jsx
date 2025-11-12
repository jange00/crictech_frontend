import { motion } from 'framer-motion';
import { NavLink } from "react-router-dom";

const LoginLink = () => (
  <NavLink
    to="/login"
    className={({ isActive }) =>
      `text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
        isActive
          ? "text-blue-600 underline underline-offset-4"
          : "text-slate-700 hover:text-blue-600"
      }`
    }
  >
    {({ isActive }) => (
      <motion.span
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        className="relative inline-block"
  >
    Login
        {!isActive && (
          <motion.span
            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600"
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.span>
    )}
  </NavLink>
);

export default LoginLink;
