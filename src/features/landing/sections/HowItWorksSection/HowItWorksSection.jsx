import { motion } from 'framer-motion';
import SectionContainer from "../../../../ui/landing/SectionContainer";
import { HOW_IT_WORKS_DATA } from "../../constants/landingData";

const HowItWorksSection = () => (
  <SectionContainer id="how-it-works" variant="default">
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center mb-8 sm:mb-10 md:mb-12"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-50 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-700 mb-4 sm:mb-5 md:mb-6"
      >
        <motion.span
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 3, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-600"
        />
        Process
      </motion.div>
      <h3 className="mt-3 sm:mt-4 font-['Poppins'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight text-center">
        From capture to correction in minutes
      </h3>
      <p className="mx-auto mt-4 sm:mt-5 md:mt-6 max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-slate-600 text-center">
        Each step is designed to be quick and coach-friendly so progress is measurable every session.
      </p>
    </motion.header>
    <div className="flex flex-wrap items-stretch justify-center gap-4 sm:gap-5 md:gap-6 lg:justify-between">
      {HOW_IT_WORKS_DATA.map((step, idx) => (
        <motion.article
          key={step.title}
          initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100, rotate: idx % 2 === 0 ? -15 : 15 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.7, 
            delay: idx * 0.2,
            type: "spring",
            stiffness: 100,
            damping: 12
          }}
          whileHover={{ 
            y: -12,
            rotate: [0, -3, 3, -3, 0],
            scale: 1.03,
            transition: { duration: 0.4 }
          }}
          className="group relative flex-1 min-w-[280px] sm:min-w-[300px] lg:max-w-[32%] rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 md:p-8 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -360 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: idx * 0.2 + 0.3,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ 
              scale: 1.2,
              rotate: 360,
              transition: { duration: 0.6 }
            }}
            className="mb-4 sm:mb-5 md:mb-6 flex h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-600 text-sm sm:text-base md:text-lg font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300"
          >
            {idx + 1}
          </motion.div>
          <h4 className="font-['Poppins'] text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">{step.title}</h4>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-600">{step.desc}</p>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 rounded-xl sm:rounded-2xl bg-blue-50/50 transition-all duration-300 pointer-events-none"
          />
        </motion.article>
      ))}
    </div>
  </SectionContainer>
);

export default HowItWorksSection;
