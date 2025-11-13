import { motion } from 'framer-motion';
import SectionContainer from "../../../../ui/landing/SectionContainer";
import Testimonials from "../../../../ui/landing/Testimonials";
import SectionLoader from "../../../../ui/common/SectionLoader";
import { TESTIMONIALS_DATA } from "../../constants/landingData";

const TestimonialsSection = () => (
  <SectionContainer id="testimonials" variant="contrast">
    <SectionLoader>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center mb-12 sm:mb-14 md:mb-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 360 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 150 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-50 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-700 mb-4 sm:mb-5 md:mb-6"
        >
          <motion.span
            animate={{ 
              scale: [1, 1.5, 1],
              x: [0, 5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-600"
          />
          Testimonials
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 }}
          className="mt-3 sm:mt-4 font-['Poppins'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight text-center"
        >
          Trusted by coaches and emerging bowlers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 sm:mt-5 md:mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-slate-600 max-w-3xl text-center"
        >
          Stories from early adopters who use CricketAI to transform amateur right-arm spin bowlers into confident match
          performers.
        </motion.p>
      </motion.header>
      <div className="w-full">
        <Testimonials testimonials={TESTIMONIALS_DATA} />
      </div>
    </SectionLoader>
  </SectionContainer>
);

export default TestimonialsSection;
