import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { FOOTER_DATA } from "../constants/landingData";

const LandingFooter = () => (
  <footer className="mt-12 sm:mt-16 md:mt-20 border-t border-slate-200 bg-slate-50">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col sm:flex-row items-start justify-between gap-8 sm:gap-10 md:gap-12 px-3 sm:px-4 py-12 sm:py-14 md:py-16 text-slate-700 max-w-7xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 space-y-3 sm:space-y-4 text-xs sm:text-sm md:text-base leading-relaxed"
      >
        <h3 className="font-['Poppins'] text-xl sm:text-2xl font-bold text-blue-600">
          {FOOTER_DATA.brand}
        </h3>
        <p className="text-slate-600 max-w-md">
          {FOOTER_DATA.description}
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 sm:flex-initial"
      >
        <h4 className="font-['Poppins'] text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Quick Links</h4>
        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base">
          {FOOTER_DATA.links.map((link, idx) => (
            <motion.li
              key={link.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
            >
              <Link className="text-slate-600 transition-colors duration-200 hover:text-blue-600 hover:underline underline-offset-4" to={link.to}>
                {link.label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex-1 sm:flex-initial"
      >
        <h4 className="font-['Poppins'] text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Connect</h4>
        <div className="flex gap-2 sm:gap-3">
          {FOOTER_DATA.socialLinks.map((link, idx) => (
            <motion.a
              key={link.label}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.4, 
                delay: 0.4 + idx * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.15,
                rotate: [0, -10, 10, 0],
                y: -3,
                transition: { duration: 0.3 }
              }}
              href={link.href}
              aria-label={link.label}
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 place-items-center rounded-lg sm:rounded-xl bg-blue-100 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 transition-all duration-300 hover:bg-blue-200 hover:shadow-lg"
            >
              {link.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="border-t border-slate-200 py-4 sm:py-5 md:py-6"
    >
      <p className="text-center text-[10px] sm:text-xs md:text-sm text-slate-500">
        © {new Date().getFullYear()} {FOOTER_DATA.brand}. All rights reserved.
      </p>
    </motion.div>
  </footer>
);

export default LandingFooter;
