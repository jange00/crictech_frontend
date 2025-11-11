const SectionContainer = ({ id, children, variant = "default" }) => {
  const variantClasses = {
    default: "bg-transparent",
    muted: "bg-slate-50",
    contrast: "bg-blue-50",
  };

  return (
    <section
      id={id}
      className={`relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 ${variantClasses[variant]}`}
    >
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4">
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
