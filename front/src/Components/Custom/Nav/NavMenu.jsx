import { IoIosArrowForward } from "react-icons/io";
import useResponsive from "../../Hooks/useResponsive";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import { useUserData } from "../../Hooks/useQueryFetch/useQueryData";
import { CiSettings } from "react-icons/ci";

const NavMenu = () => {
  const { user } = useAuthContext();

  const { userData, isUserDataLoading } = useUserData();

  const { role } = userData || {};

  // responsive hook
  const isMobile = useResponsive();

  const navMenuArray = [
    {
      name: "Lend A Hand",
      content: "Discover Hands to support",
      link: "/campaigns",
    },
    {
      name: "Ask For Hand(s)",
      content: "Tips to get you started",
      link: user ? "/new/campaign" : "/create/campaign",
    },
    {
      name: "About",
      content: "Explore how the platform works",
      link: "/about",
    },
    {
      name: "Help Center",
      content: "Technical Help and support",
      link: "/help-center",
    },
  ];

  const navMenuOutput = navMenuArray.map((item, i) => (
    <li key={i}>
      <NavLink activeclassname="active" to={item.link}>
        <div>
          <h4>{item.name}</h4>
          {isMobile && <p>{item.content}</p>}
        </div>

        {isMobile && <IoIosArrowForward />}
      </NavLink>
    </li>
  ));

  return (
    <ul className="nav-menu-ul">
      {navMenuOutput}

      {!isUserDataLoading && role === "admin" && (
        <li>
          <NavLink activeclassname="active" to="/admin">
            <strong>Admin</strong>
            <CiSettings />
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavMenu;
