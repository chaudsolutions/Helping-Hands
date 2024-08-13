import useResponsive from "../../Hooks/useResponsive";
import logo from "/logo.png";
import { RxHamburgerMenu } from "react-icons/rx";
import "./nav.css";
import { useEffect, useState } from "react";
import NavSlide, { AuthContainer, UserProfile } from "./NavSlide";
import NavMenu from "./NavMenu";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuthContext } from "../../Context/AuthContext";

const Nav = () => {
  const { user } = useAuthContext();

  // responsive hook
  const isMobile = useResponsive();

  const navigate = useNavigate();

  // states
  const [isNavActive, setIsNavActive] = useState(false);

  useEffect(() => {
    const closeNav = (e) => {
      if (
        isNavActive &&
        !e.target.closest(".navBtn") &&
        !e.target.closest(".dp-toggle")
      ) {
        setIsNavActive(false);
      }
    };
    window.addEventListener("click", closeNav);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("click", closeNav);
    };
  }, [isNavActive]); // Add dependencies to effect

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
            {user && <UserProfile />}
          </>
        )}
      </div>

      {/* nav slider */}
      {isMobile && <NavSlide navFunc={[{ isNavActive }]} />}
    </>
  );
};

export const Logo = ({ navigate }) => {
  return (
    <div className="logo-contain" onClick={() => navigate && navigate("/")}>
      <img src={logo} alt="logo" />
      <h2>Helping Hands</h2>
    </div>
  );
};

Logo.propTypes = {
  navigate: PropTypes.func,
};

export default Nav;
