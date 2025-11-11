import { Link } from "react-router-dom";

const GetStartedButton = () => (
  <Link
    to="/get-started"
    className="group relative inline-flex items-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/40 hover:scale-105 focus:outline-none focus:visible:ring-2 focus:visible:ring-blue-400 focus:visible:ring-offset-2 focus:visible:ring-offset-white md:px-7 md:py-3 md:text-base"
  >
    Get Started
  </Link>
);

export default GetStartedButton;
