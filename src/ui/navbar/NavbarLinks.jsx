import LoginLink from "./LoginLink";
import GetStartedButton from "./GetStartedButton";

const NavbarLinks = () => (
  <div className="flex items-center gap-4 sm:gap-6">
    <LoginLink />
    <GetStartedButton />
  </div>
);

export default NavbarLinks;

