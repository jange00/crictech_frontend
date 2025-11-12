import { motion } from 'framer-motion';
import SectionContainer from "../../../../ui/landing/SectionContainer";
import { LOGOS_DATA } from "../../constants/landingData";

const LogosStripSection = () => (
  <SectionContainer id="trusted" variant="default">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center"
    >
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 mb-6 sm:mb-8"
      >
        Trusted by academies and coaches
      </motion.p>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-between w-full">
        {LOGOS_DATA.map((name, idx) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: idx * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            whileHover={{ 
              y: -8, 
              scale: 1.1,
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 }
            }}
            className="flex h-12 sm:h-14 md:h-16 items-center justify-center flex-1 min-w-[120px] sm:min-w-[140px] md:min-w-[160px] lg:max-w-[16%] rounded-lg sm:rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-600 shadow-sm transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
          >
            {name}
          </motion.div>
        ))}
      </div>
    </motion.div>
  </SectionContainer>
);

export default LogosStripSection;
