import LoginContent from "../../features/auth/components/LoginContent";
import LandingFooter from "../../features/landing/footer/LandingFooter";

const LoginPage = () => (
  <>
    <div className="relative flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <LoginContent />
    </div>
    <LandingFooter />
  </>
);

export default LoginPage;
