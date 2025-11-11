import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import SectionContainer from "../../../../ui/landing/SectionContainer";
import HeroLayout from "../../../../ui/landing/HeroLayout";
import HeroHeadline from "../../../../ui/landing/HeroHeadline";
import HeroActions from "../../../../ui/landing/HeroActions";
import HeroMedia from "../../../../ui/landing/HeroMedia";
import SectionLoader from "../../../../ui/common/SectionLoader";
import { HERO_DATA } from "../../constants/landingData";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-50/30 pointer-events-none z-0" />
      <SectionContainer id="hero" variant="default">
        <SectionLoader height={220}>
          <HeroLayout
            media={
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <HeroMedia posterSrc={HERO_DATA.poster} />
              </motion.div>
            }
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 sm:space-y-7 md:space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-50 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-sm"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-blue-600"
                />
                {HERO_DATA.badge}
              </motion.div>
              <HeroHeadline title={HERO_DATA.title} subtitle={HERO_DATA.subtitle} />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <HeroActions
                  primaryLabel={HERO_DATA.primaryAction.label}
                  primaryOnClick={() => navigate(HERO_DATA.primaryAction.path)}
                  secondaryLabel={HERO_DATA.secondaryAction.label}
                  secondaryOnClick={() => navigate(HERO_DATA.secondaryAction.path)}
                />
              </motion.div>
            </motion.div>
          </HeroLayout>
        </SectionLoader>
      </SectionContainer>
    </div>
  );
};

export default HeroSection;
