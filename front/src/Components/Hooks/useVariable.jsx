// backend api route
export const serVer = import.meta.env.VITE_API_LIVE;

export const supportedCountries = [
  "Nigeria",
  "United Kingdom",
  "United States",
];
export const categories = ["Animals", "Business", "Family", "Wishes"];

export const token = localStorage.getItem("helpingHandsUser");

export const currencyArray = [
  {
    currency: "USD",
    name: "USD (US Dollar)",
  },
  {
    currency: "GBP",
    name: "GBP (Pound)",
  },
];
