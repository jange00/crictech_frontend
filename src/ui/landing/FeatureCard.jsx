import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, index = 0 }) => (
  <motion.article
    initial={{ opacity: 0, y: 50, rotateX: -90 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.7, 
      delay: index * 0.15,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{ 
      y: -12,
      rotateY: 5,
      scale: 1.02,
      transition: { duration: 0.3 }
    }}
    style={{ perspective: 1000 }}
    className="group relative rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 md:p-8 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10"
  >
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
      whileHover={{ 
        scale: 1.15,
        rotate: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      }}
      className="mb-4 sm:mb-5 md:mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-100 text-blue-700 transition-all duration-300 group-hover:bg-blue-200 group-hover:shadow-lg"
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
    </motion.div>
    <h3 className="font-['Poppins'] text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">{title}</h3>
    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-600">{description}</p>
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1, opacity: 1 }}
      className="absolute inset-0 rounded-xl sm:rounded-2xl bg-blue-50/50 transition-all duration-300 pointer-events-none"
    />
  </motion.article>
);

export default FeatureCard;
