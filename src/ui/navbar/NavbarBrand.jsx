const NavbarBrand = ({ label }) => (
  <div className="flex items-center">
    <span className="text-blue-600 text-xl font-bold md:text-2xl transition-all duration-200 hover:text-blue-700">
      {label}
    </span>
  </div>
);

export default NavbarBrand;
