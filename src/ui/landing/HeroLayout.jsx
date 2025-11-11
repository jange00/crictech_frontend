const HeroLayout = ({ media, children }) => (
  <div className="grid items-center gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
    <div className="order-2 space-y-6 sm:space-y-7 text-center lg:order-1 lg:text-left lg:space-y-8">
      {children}
    </div>
    <div className="order-1 w-full lg:order-2">
      {media}
    </div>
  </div>
);

export default HeroLayout;
