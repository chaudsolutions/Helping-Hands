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
import CopyToClipboard from "react-copy-to-clipboard";
import Null from "../../Animations/Null";
import toast from "react-hot-toast";
import ReadMoreArea from "@foxeian/react-read-more";
import axios from "axios";
import { serVer, token } from "../../Hooks/useVariable";

const Profile = () => {
  const [view, setView] = useState("requests");
  const [subView, setSubView] = useState("unpaid");
  const [copiedText, setCopiedText] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState({ boolean: false, value: "" });
  const [deleteBtn, setDeleteBtn] = useState("Delete");

  const navigate = useNavigate();

  //   use responsive hook
  const isMobile = useResponsive();

  const { userData, isUserDataLoading, isUserDataError, refetchUserData } =
    useUserData();

  // extract data
  const { active, balance, requests, _id } = userData || {};

  // sort requests
  const unpaidRequests = requests?.filter((request) => !request.clientMail);
  const paidRequests = requests?.filter((request) => request.clientMail);

  // count requests
  const unpaidRequestsCount = unpaidRequests?.length || 0;

  // Get filtered requests based on selected sub-view using if-else
  let filteredRequests = [];
  if (subView === "unpaid") {
    filteredRequests = unpaidRequests;
  } else if (subView === "paid") {
    filteredRequests = paidRequests;
  }

  // map requests to list
  const requestList = filteredRequests
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.map((request) => {
      const domain = window.location.origin;
      const requestLink = request.link;
      const requestPaymentFullLink = `${domain}/request-funds/${_id}/${requestLink}`;

      const handleCopy = () => {
        setCopiedText(!copiedText);
        toast.success(`Copied`);
      };

      const deleteLink = async () => {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this link?"
        );

        if (confirmDelete) {
          setDeleteBtn(<ButtonLoad />);
          const deleteUrl = `${serVer}/funds/delete-link/${request._id}`;
          try {
            const res = await axios.delete(deleteUrl, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data } = res;

            refetchUserData();

            toast.success(data);
          } catch (error) {
            toast.error(error.response.data);
          } finally {
            setDeleteBtn("Delete");
          }
        }
      };

      return (
        <li key={request._id}>
          <span>${request.requestAmount}:</span>
          <ReadMoreArea
            lettersLimit={35} // limit of letters (100 letters)
          >
            {requestPaymentFullLink}
          </ReadMoreArea>
          {subView === "unpaid" && (
            <>
              <CopyToClipboard
                text={`${requestPaymentFullLink}`}
                onCopy={handleCopy}>
                <button className="copyBtn">Copy</button>
              </CopyToClipboard>
              <button onClick={deleteLink} className="deleteBtn">
                {deleteBtn}
              </button>
            </>
          )}
        </li>
      );
    });

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

        {view === "requests" && (
          <div className="requests">
            <div className="switch-buttons">
              <button
                onClick={() => setSubView("unpaid")}
                className={subView === "unpaid" ? "activeBtn" : ""}>
                Unpaid Requests ({unpaidRequestsCount})
              </button>
              <button
                onClick={() => setSubView("paid")}
                className={subView === "paid" ? "activeBtn" : ""}>
                Paid Requests
              </button>
            </div>

            {/* requests lists */}
            {userData && requests && requestList?.length > 0 ? (
              <ul>{requestList}</ul>
            ) : (
              <div className="null">
                <div>No requests here yet</div>
                <Null />
              </div>
            )}
          </div>
        )}

        {/* requests list */}
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