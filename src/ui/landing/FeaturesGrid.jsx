import FeatureCard from "./FeatureCard";

const FeaturesGrid = ({ features }) => (
  <div className="flex flex-wrap items-stretch justify-center gap-4 sm:gap-5 md:gap-6 lg:justify-between">
    {features.map((feature, index) => (
      <div key={feature.title} className="flex-1 min-w-[280px] sm:min-w-[300px] lg:max-w-[32%]">
        <FeatureCard {...feature} index={index} />
      </div>
    ))}
  </div>
);

export default FeaturesGrid;
