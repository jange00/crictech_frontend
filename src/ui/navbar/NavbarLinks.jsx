import { motion } from 'framer-motion';
import LoginLink from "./LoginLink";
import GetStartedButton from "./GetStartedButton";

const NavbarLinks = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="flex items-center gap-4 sm:gap-6"
  >
    <LoginLink />
    <GetStartedButton />
  </motion.div>
);

export default NavbarLinks;
