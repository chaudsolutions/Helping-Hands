import { useEffect, useState } from "react";
import {
  useAllUsersData,
  useUserData,
} from "../../Hooks/useQueryFetch/useQueryData";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import HeaderPage from "../../Custom/HeaderPage/HeaderPage";
import PageLoader from "../../Animations/PageLoader";
import Null from "../../Animations/Null";
import Logout from "../../Custom/Buttons/Logout";
import toast from "react-hot-toast";
import { serVer, token } from "../../Hooks/useVariable";
import axios from "axios";
import ButtonLoad from "../../Animations/ButtonLoad";

const Admin = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const [view, setView] = useState("Inventory");
  const [subView, setSubView] = useState("");
  const [approveWithdrawalBtn, setApproveWithdrawalBtn] = useState("Pay");

  const navigate = useNavigate();

  // fetch user data and campaign data
  const { userData, isUserDataLoading, isUserDataError } = useUserData();

  // fetch all users
  const { allUsersData, isAllUsersDataLoading, refetchAllUsersData } =
    useAllUsersData();

  // extract data
  const { role, adminCampaignPercentage, adminOneToOnePaymentPercentage } =
    userData || {};

  useEffect(() => {
    if (!isUserDataLoading && role !== "admin") {
      navigate("/");
    }
  }, [navigate, role, isUserDataLoading]);

  const earnings = [
    {
      title: "Total Earnings on Campaigns",
      earnings: adminCampaignPercentage,
    },
    {
      title: "Total Earnings on One To One Payment",
      earnings: adminOneToOnePaymentPercentage,
    },
  ];

  const earningList = earnings.map((item, i) => (
    <li key={i}>
      <h4>{item.title}</h4>
      <h5>{item.earnings}</h5>
    </li>
  ));

  // map all users into dom
  const usersList = allUsersData?.map((item) => {
    return (
      <li key={item._id}>
        <strong>Name: {item.name}</strong>
        <h5>Email: {item.email}</h5>
        <h5>Balance: ${item.balance}</h5>
      </li>
    );
  });
  // map all users into dom
  const withdrawalsRequestsList = allUsersData?.map((item) => {
    const { withdrawals } = item;

    // filter withdrawals
    const pendingWithdrawals = withdrawals.filter(
      (item) => item.state === "Pending"
    );
    const successfulWithdrawals = withdrawals.filter(
      (item) => item.state === "Success"
    );

    let filteredWithdrawals = [];
    if (subView === "pending") {
      filteredWithdrawals = pendingWithdrawals;
    } else if (subView === "success") {
      filteredWithdrawals = successfulWithdrawals;
    }

    return filteredWithdrawals.map((withdrawal) => {
      const approveWithdrawal = async () => {
        const confirmWithdrawal = confirm(
          "Are you sure you want to approve this withdrawal"
        );

        if (confirmWithdrawal) {
          setApproveWithdrawalBtn(<ButtonLoad />);

          const url = `${serVer}/admin/approve-withdrawal/${item._id}/${withdrawal._id}`;
          try {
            const res = await axios.put(
              url,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const { data } = res;

            refetchAllUsersData();

            toast.success(data);
          } catch (error) {
            toast.error(error.response.data);
          } finally {
            setApproveWithdrawalBtn("Pay");
          }
        }
      };

      return (
        <li key={withdrawal._id}>
          <div>Name: {item.name}</div>
          <div>Amount: {withdrawal.amountToWithdraw}</div>
          <div>
            Withdrawal Channel: {item.bank?.bankName} {item.bank?.accountNumber}
          </div>
          <div>Withdrawal Message: {item.bank?.message}</div>

          {subView === "pending" && (
            <button onClick={approveWithdrawal}>{approveWithdrawalBtn}</button>
          )}
        </li>
      );
    });
  });

  if (isUserDataLoading || isAllUsersDataLoading) {
    return (
      <div className="loader-container">
        <PageLoader />
      </div>
    );
  }

  // display logout btn if fetch fail
  if (isUserDataError) {
    return (
      <div className="not-found">
        <h1>Session Expired?</h1>

        <Null />

        <div>
          <strong>Logout and restart your session</strong>
          <Logout />
        </div>
      </div>
    );
  }

  return (
    <div className="about">
      <HeaderPage page="Admin Center" />

      <div>
        <div className="switch-buttons">
          <button
            onClick={() => setView("Inventory")}
            className={view === "Inventory" ? "activeBtn" : ""}>
            Inventory
          </button>
          <button
            onClick={() => setView("AllUsers")}
            className={view === "AllUsers" ? "activeBtn" : ""}>
            All Users
          </button>
          <button
            onClick={() => setView("Withdrawals")}
            className={view === "Withdrawals" ? "activeBtn" : ""}>
            Withdrawals
          </button>
        </div>

        {/* inventory */}
        {view === "Inventory" && <ul className="inventory">{earningList}</ul>}

        {/* all users */}
        {view === "AllUsers" && <ul className="users">{usersList}</ul>}

        {/* all users */}
        {view === "Withdrawals" && (
          <div className="withdrawals">
            <div className="switch-buttons">
              <button
                onClick={() => setSubView("pending")}
                className={subView === "pending" ? "activeBtn" : ""}>
                Pending
              </button>
              <button
                onClick={() => setSubView("success")}
                className={subView === "success" ? "activeBtn" : ""}>
                Successful
              </button>
            </div>
            <ul className="withdrawals-ul">{withdrawalsRequestsList}</ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
