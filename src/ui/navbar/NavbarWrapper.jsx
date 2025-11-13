const NavbarWrapper = ({ children }) => (
  <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
    <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 sm:px-4">
      {children}
    </div>
  </nav>
);

export default NavbarWrapper;
