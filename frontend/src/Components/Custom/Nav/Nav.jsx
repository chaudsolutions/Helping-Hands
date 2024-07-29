import useResponsive from "../../Hooks/useResponsive";
import logo from "/logo.png";
import { RxHamburgerMenu } from "react-icons/rx";
import "./nav.css";
import { Suspense, useEffect, useState } from "react";
import NavSlide, { AuthContainer, UserProfile } from "./NavSlide";
import NavMenu from "./NavMenu";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuthContext } from "../../Context/AuthContext";
import PageLoader from "../../Animations/PageLoader";

const Nav = () => {
  const [client, setClient] = useState(false);
  const { user } = useAuthContext();

  // responsive hook
  const isMobile = useResponsive();

  const navigate = useNavigate();

  // states
  const [isNavActive, setIsNavActive] = useState(false);

  const closeNav = (e) => {
    if (
      isNavActive &&
      !e.target.closest(".navBtn") &&
      !e.target.closest(".dp-toggle")
    ) {
      setIsNavActive(false);
    }
  };

  useEffect(() => {
    setClient(true);
    // Check if window is defined (useful in SSR scenarios)
    if (typeof window !== "undefined") {
      window.addEventListener("click", closeNav);

      // Cleanup function to remove the event listener
      return () => {
        window.removeEventListener("click", closeNav);
      };
    }
  }, [isNavActive, setIsNavActive]); // Add dependencies to effect

  return (
    <>
      <div className="nav">
        <div>
          <Logo navigate={navigate} />
          {!isMobile && <NavMenu />}
        </div>

        {isMobile ? (
          <RxHamburgerMenu
            size={30}
            onClick={() => setIsNavActive(!isNavActive)}
            className="navBtn"
          />
        ) : (
          <>
            <AuthContainer userProp={[user]} />
            {client && user && (
              <Suspense fallback={<PageLoader />}>
                <UserProfile userProp={[user]} />
              </Suspense>
            )}
          </>
        )}
      </div>

      {/* nav slider */}
      {isMobile && <NavSlide navFunc={[{ isNavActive }]} />}
    </>
  );
};

export const Logo = ({ navigate }) => {
  const { user } = useAuthContext();
  const home = user ? "/dashboard" : "/";

  return (
    <div className="logo-contain" onClick={() => navigate && navigate(home)}>
      <img src={logo} alt="logo" />
      <h2>Helping Hands</h2>
    </div>
  );
};

Logo.propTypes = {
  navigate: PropTypes.func,
};

export default Nav;
