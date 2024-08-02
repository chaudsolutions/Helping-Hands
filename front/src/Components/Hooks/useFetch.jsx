import axios from "axios";
import { serVer, token } from "./useVariable";

// fetch user data from DB
export const fetchUser = async () => {
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

// fetch user campaign doc data from DB
export const fetchUserCampaignDoc = async () => {
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

//  fetch single campaign by category
export const fetchSingleCampaign = async (campaign) => {
  const response = await axios.get(`${serVer}/get/campaign/${campaign}`);

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
