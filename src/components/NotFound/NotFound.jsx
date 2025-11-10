import React from "react";
import { useNavigate } from "react-router-dom";
import { IMAGE_PATHS } from "../../common/imageConstant";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${IMAGE_PATHS.notfound})`, backgroundSize: "30%" }}
    >
      <button
        onClick={() => navigate("/")}
        className="mt-148 px-6 py-3 bg-yellow-500 text-black font-semibold text-lg rounded-lg shadow-lg hover:bg-black hover:text-yellow-500 transition-all duration-300 animate-bounce"
      >
        Back to Home
      </button>
    </div>
  );
};

export default NotFound;
