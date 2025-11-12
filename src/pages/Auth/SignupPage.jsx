import SignupContent from "../../features/auth/components/SignupContent";
import LandingFooter from "../../features/landing/footer/LandingFooter";

const SignupPage = () => (
  <>
    <div className="relative flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <SignupContent />
    </div>
    <LandingFooter />
  </>
);

export default SignupPage;

