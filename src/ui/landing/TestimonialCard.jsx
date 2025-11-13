import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const TestimonialCard = ({ quote, name, role, avatar = null, index = 0 }) => (
  <motion.article
    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.8, 
      delay: index * 0.15,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{ 
      y: -10,
      scale: 1.02,
      rotateY: [0, 5, -5, 0],
      transition: { duration: 0.4 }
    }}
    style={{ perspective: 1000 }}
    className="group flex h-full flex-col justify-between gap-4 sm:gap-5 md:gap-6 rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 md:p-8 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10"
  >
    <div className="relative">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.15 + 0.2,
          type: "spring",
          stiffness: 200
        }}
      >
        <ChatBubbleLeftRightIcon className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 h-6 w-6 sm:h-8 sm:w-8 text-blue-100 opacity-50" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
        className="text-base sm:text-lg md:text-xl italic leading-relaxed text-slate-700 relative z-10"
      >
        "{quote}"
      </motion.p>
    </div>
    <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-100">
      <motion.div
        initial={{ scale: 0, rotate: 360 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.15 + 0.5,
          type: "spring",
          stiffness: 200
        }}
        whileHover={{ 
          scale: 1.2,
          rotate: [0, 360],
          transition: { duration: 0.6 }
        }}
        className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-sm sm:text-base md:text-lg shadow-md transition-transform duration-300"
      >
        {avatar ? <img className="h-full w-full rounded-full object-cover" src={avatar} alt={`${name} avatar`} /> : name[0]}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.6 }}
      >
        <p className="font-['Poppins'] text-sm sm:text-base font-bold text-slate-900">{name}</p>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{role}</p>
      </motion.div>
    </div>
  </motion.article>
);

export default TestimonialCard;
