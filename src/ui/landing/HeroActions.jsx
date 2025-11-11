import { motion } from 'framer-motion';

const HeroActions = ({ primaryLabel, primaryOnClick, secondaryLabel, secondaryOnClick }) => (
  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-full bg-blue-600 px-6 py-2.5 sm:px-7 sm:py-3 md:px-8 md:py-3.5 lg:px-10 lg:py-4 text-sm sm:text-base md:text-lg font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 focus:outline-none focus:visible:ring-2 focus:visible:ring-blue-400 focus:visible:ring-offset-2 focus:visible:ring-offset-white"
      onClick={primaryOnClick}
    >
      {primaryLabel}
    </motion.button>
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-full border-2 border-slate-300 bg-white px-6 py-2.5 sm:px-7 sm:py-3 md:px-8 md:py-3.5 lg:px-10 lg:py-4 text-sm sm:text-base md:text-lg font-semibold text-slate-700 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md focus:outline-none focus:visible:ring-2 focus:visible:ring-blue-400 focus:visible:ring-offset-2 focus:visible:ring-offset-white"
      onClick={secondaryOnClick}
    >
      {secondaryLabel}
    </motion.button>
  </div>
);

export default HeroActions;
