import { motion } from 'framer-motion';
import { Link } from "react-router-dom";

const GetStartedButton = () => (
  <Link to="/get-started">
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="group relative inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-600/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-7 md:py-3 md:text-base overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      
      <motion.span
        className="relative z-10 flex items-center gap-2"
        whileHover={{ x: 2 }}
      >
        Get Started
        <motion.svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </motion.svg>
      </motion.span>
      
      {/* Ripple effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1.5 }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  </Link>
);

export default GetStartedButton;
