import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
    <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-slate-900 mb-4">404</h1>
    <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-8">Page not found</p>
    <Link
      to="/"
      className="rounded-full bg-blue-600 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40"
    >
      Go Home
    </Link>
  </div>
);

export default NotFound;
