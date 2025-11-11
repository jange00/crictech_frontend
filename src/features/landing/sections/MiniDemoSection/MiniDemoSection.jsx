import { motion } from 'framer-motion';
import SectionContainer from "../../../../ui/landing/SectionContainer";
import { DEMO_DATA } from "../../constants/landingData";

const MiniDemoSection = () => (
  <SectionContainer id="demo" variant="muted">
    <div className="grid items-center gap-8 sm:gap-10 md:gap-12 grid-cols-1 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -50, scale: 0.9 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
        className="self-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-50 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-700 mb-4 sm:mb-5 md:mb-6"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-600"
          />
          Demo
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-['Poppins'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-3 sm:mb-4"
        >
          {DEMO_DATA.title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-slate-600"
        >
          {DEMO_DATA.description}
        </motion.p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.8 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-slate-200 bg-white shadow-2xl shadow-blue-500/10 ring-1 ring-slate-200/50">
          <motion.img
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full w-full min-h-[240px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[360px] object-cover"
            src={DEMO_DATA.poster}
            alt="Cricket spin demo"
          />
          <div className="absolute inset-x-3 sm:inset-x-4 md:inset-x-5 bottom-3 sm:bottom-4 md:bottom-5 grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-3">
            {DEMO_DATA.metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, scale: 0.5, rotate: -10 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5 + idx * 0.15,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ 
                  y: -5,
                  scale: 1.05,
                  rotate: [0, -2, 2, 0],
                  transition: { duration: 0.3 }
                }}
                className={`rounded-lg sm:rounded-xl border px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm shadow-lg backdrop-blur-sm ${
                  metric.highlight
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-blue-300/60 bg-white/95 text-slate-800"
                }`}
              >
                <span className="block text-[9px] sm:text-xs uppercase tracking-[0.15em] font-medium mb-0.5 sm:mb-1">{metric.label}</span>
                <span className="text-sm sm:text-base md:text-lg font-bold">{metric.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </SectionContainer>
);

export default MiniDemoSection;
