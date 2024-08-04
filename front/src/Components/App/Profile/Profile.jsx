import { useNavigate } from "react-router-dom";
import { useUserData } from "../../Hooks/useQueryFetch/useQueryData";
import { UserProfile } from "../../Custom/Nav/NavSlide";
import "./profile.css";
import useResponsive from "../../Hooks/useResponsive";
import { FaPlus } from "react-icons/fa6";
import { BiMoneyWithdraw } from "react-icons/bi";
import { useState } from "react";
import PopupComponent from "../../Custom/Popup/PopupComponent";
import ButtonLoad from "../../Animations/ButtonLoad";

const Profile = () => {
  const [view, setView] = useState("requests");
  const [isPopupOpen, setIsPopupOpen] = useState({ boolean: false, value: "" });

  const navigate = useNavigate();

  //   use responsive hook
  const isMobile = useResponsive();

  const { userData, isUserDataLoading, isUserDataError, refetchUserData } =
    useUserData();

  // extract data
  const { active, balance } = userData || {};

  // navigate to dashboard if error
  if (isUserDataError || (userData && !active)) {
    return navigate("/dashboard");
  }

  return (
    <div className="profile">
      <div className="profile-dash">
        <UserProfile />
        <div className="profile-bal">
          <h1>Balance: {isUserDataLoading ? <ButtonLoad /> : balance}</h1>
          <div className="btn">
            <button
              onClick={() =>
                setIsPopupOpen({ boolean: true, value: "Request" })
              }>
              Request {isMobile ? <FaPlus size={20} /> : "Funds"}
            </button>
            <button
              onClick={() =>
                setIsPopupOpen({ boolean: true, value: "Withdraw" })
              }>
              Withdraw {isMobile ? <BiMoneyWithdraw size={20} /> : "Funds"}
            </button>
          </div>
        </div>
      </div>

      <div className="profile-transactions">
        <div className="switch-buttons">
          <button
            onClick={() => setView("requests")}
            className={view === "requests" ? "activeBtn" : ""}>
            Requests
          </button>
          <button
            onClick={() => setView("withdrawals")}
            className={view === "withdrawals" ? "activeBtn" : ""}>
            Withdrawals
          </button>
        </div>
      </div>

      {/* pop up component */}
      <div>
        <PopupComponent
          open={isPopupOpen.boolean}
          onClose={() => setIsPopupOpen({ boolean: false, value: "" })}
          context={isPopupOpen.value}
          refetchUserData={refetchUserData}
        />
        <div id="popup-root" />
      </div>
    </div>
  );
};

export default Profile;
