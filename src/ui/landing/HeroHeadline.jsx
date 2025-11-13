import Typewriter from "./Typewriter";

const HeroHeadline = ({ title, subtitle }) => (
  <>
    <h1 className="font-['Poppins'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
      <Typewriter backspace="all" speed={100} delay={500}>
      {title}
      </Typewriter>
    </h1>
    <p className="mx-auto max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-slate-600 mt-4 sm:mt-5 md:mt-6 lg:mx-0">
      {subtitle}
    </p>
  </>
);

export default HeroHeadline;
