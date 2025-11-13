import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NavbarBrand = ({ label }) => (
  <Link to="/" className="flex items-center group -ml-2">
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative inline-block"
      >
        <span className="text-blue-600 text-2xl font-bold md:text-3xl transition-all duration-300 group-hover:text-blue-700 relative z-10">
          {label}
        </span>
        <motion.span
          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute -inset-2 bg-blue-100/30 rounded-lg opacity-0 group-hover:opacity-100 blur-sm"
          transition={{ duration: 0.3 }}
        />
      </motion.span>
    </motion.div>
  </Link>
);

export default NavbarBrand;
