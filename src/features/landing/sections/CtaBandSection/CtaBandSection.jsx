import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import SectionContainer from "../../../../ui/landing/SectionContainer";

const CtaBandSection = () => (
  <SectionContainer id="cta" variant="default">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      className="relative w-full rounded-2xl sm:rounded-3xl border border-slate-200 bg-white px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-16 text-center shadow-xl shadow-blue-500/10 ring-1 ring-slate-200/50 overflow-hidden"
    >
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-blue-50/30 pointer-events-none"
      />
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-['Poppins'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-3 sm:mb-4"
        >
          Ready to level up your spin bowling?
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-slate-600 max-w-2xl"
        >
          Get personalized insights, session-by-session progress, and coach-ready reports—powered by AI.
        </motion.p>
        <div className="mt-6 sm:mt-7 md:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/signup"
              className="inline-block rounded-full bg-blue-600 px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 focus:outline-none focus:visible:ring-2 focus:visible:ring-blue-400 focus:visible:ring-offset-2"
            >
              Get Started
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/watch-demo"
              className="inline-block rounded-full border-2 border-slate-300 bg-white px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 text-sm sm:text-base font-semibold text-slate-700 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md focus:outline-none focus:visible:ring-2 focus:visible:ring-blue-400 focus:visible:ring-offset-2"
            >
              Watch Demo
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  </SectionContainer>
);

export default CtaBandSection;
