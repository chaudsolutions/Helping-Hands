import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import NavMenu from "./NavMenu";
import Logout from "../Buttons/Logout";
import { fetchUser } from "../../Hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../../Animations/PageLoader";
import { CiCamera } from "react-icons/ci";
import { IoIosArrowForward } from "react-icons/io";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import ButtonLoad from "../../Animations/ButtonLoad";
import { useAuthContext } from "../../Context/AuthContext";

const NavSlide = ({ navFunc }) => {
  const { isNavActive } = navFunc[0];

  const { user } = useAuthContext();

  return (
    <div className={`navSlide ${isNavActive ? "activeNav" : ""}`}>
      <IoClose size={35} />

      <>
        {user && (
          <Suspense fallback={<PageLoader />}>
            <div className="profile-link">
              <UserProfile userProp={[user]} />
            </div>
          </Suspense>
        )}
        <NavMenu />
      </>

      <AuthContainer userProp={[user]} />
    </div>
  );
};

export const AuthContainer = ({ userProp }) => {
  const user = userProp[0];

  return (
    <>
      <div className="auth-btn">
        {user ? (
          <Logout />
        ) : (
          <>
            <Link to="/create/campaign">Ask for Helping Hands</Link>
            <Link to="/login">Sign in</Link>
          </>
        )}
      </div>
    </>
  );
};

export const UserProfile = ({ userProp }) => {
  const user = userProp[0];

  const [loading, setLoading] = useState(false);

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user"], // Use the new object-based syntax
    queryFn: fetchUser,
    enabled: !!user,
  });

  const { name, profilePicture } = userData || {};

  // function to update profile picture
  const handleProfilePicChange = async (e) => {
    setLoading(true);
    const files = Array.from(e.target.files);

    const formData = new FormData();
    formData.append("profilePicture", files[0]);

    try {
      const token = localStorage.getItem("helpingHandsUser");

      const url = "/user/profile-picture";
      const response = await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response;

      toast.success(data);
      refetch(); // refetch user data after successful profile picture update
    } catch (error) {
      console.error(error); // Log the error to see what went wrong
      toast.error(error.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-DP">
      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          <label htmlFor="profileDP" className="dp-toggle">
            {profilePicture && profilePicture !== null ? (
              <img src={profilePicture} />
            ) : (
              <>
                {loading ? <ButtonLoad /> : <CiCamera size={30} />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  style={{ display: "none" }}
                  id="profileDP"
                />
              </>
            )}
          </label>

          <Link to="/profile">
            <span>{name}</span>
            <IoIosArrowForward size={20} />
          </Link>
        </>
      )}
    </div>
  );
};

UserProfile.propTypes = {
  userProp: PropTypes.array,
};

AuthContainer.propTypes = {
  userProp: PropTypes.array,
};

NavSlide.propTypes = {
  navFunc: PropTypes.array.isRequired,
};

export default NavSlide;
