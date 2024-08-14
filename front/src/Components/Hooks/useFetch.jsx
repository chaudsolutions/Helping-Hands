import axios from "axios";
import { serVer } from "./useVariable";

// fetch user data from DB
export const fetchUser = async () => {
  const token = localStorage.getItem("helpingHandsUser");

  const response = await axios.get(`${serVer}/user/userObj`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Network response was not ok");
  }

  return response.data;
};

// fetch users from DB for admin
export const fetchUsers = async () => {
  const token = localStorage.getItem("helpingHandsUser");

  const response = await axios.get(`${serVer}/admin/all-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Network response was not ok");
  }

  return response.data;
};

// fetch user campaign doc data from DB
export const fetchUserCampaignDoc = async () => {
  const token = localStorage.getItem("helpingHandsUser");

  const response = await axios.get(`${serVer}/user/campaigns`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Network response was not ok");
  }

  return response.data;
};

// fetch all active campaigns from DB
export const fetchActiveCampaigns = async () => {
  const response = await axios.get(`${serVer}/get/active-campaigns`);

  if (response.status !== 200) {
    throw new Error("Network response was not ok");
  }

  return response.data;
};

//  fetch single campaign
export const fetchSingleCampaign = async (campaign) => {
  const response = await axios.get(`${serVer}/get/campaign/${campaign}`);

  if (response.status !== 200) {
    throw new Error("Network response was not ok");
  }

  return response.data;
};

// fetch payment request from DB with requestFundsId and requestUserId
export const fetchPaymentRequest = async (requestUserId, requestFundsId) => {
  const response = await axios.get(
    `${serVer}/get/payment-request/${requestUserId}/${requestFundsId}`
  );

  if (response.status !== 200) {
    throw new Error("Network response was not ok");
  }

  return response.data;
};

// fetch exchange rates
export const fetchExchangeRates = async () => {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/USD`
    );
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return {};
  }
};
