import TestimonialCard from "./TestimonialCard";

const Testimonials = ({ testimonials }) => (
  <div className="flex flex-wrap items-stretch justify-center gap-4 sm:gap-5 md:gap-6 lg:justify-between">
    {testimonials.map((testimonial, index) => (
      <div key={testimonial.name} className="flex-1 min-w-[280px] sm:min-w-[300px] lg:max-w-[32%]">
        <TestimonialCard {...testimonial} index={index} />
      </div>
    ))}
  </div>
);

export default Testimonials;
