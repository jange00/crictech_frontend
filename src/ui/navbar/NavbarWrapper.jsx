import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const NavbarWrapper = ({ children }) => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.98)']
  );
  
  const shadowOpacity = useTransform(
    scrollY,
    [0, 50],
    [0.1, 0.2]
  );

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        backgroundColor,
        boxShadow: `0 1px 3px 0 rgba(0, 0, 0, ${shadowOpacity})`
      }}
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled 
          ? 'border-slate-300/80 shadow-md' 
          : 'border-slate-200/80 shadow-sm'
      } backdrop-blur-md supports-[backdrop-filter]:bg-white/90`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 sm:px-4">
        {children}
      </div>
    </motion.nav>
  );
};

export default NavbarWrapper;
