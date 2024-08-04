import paystackLogo from "../../assets/images/payments/paystack-logo.png";
import flutterWaveLogo from "../../assets/images/payments/FlutterwaveLogo.png";

// backend api route
export const serVer = import.meta.env.VITE_API_LIVE;

export const supportedCountries = [
  "Nigeria",
  "United Kingdom",
  "United States",
];
export const categories = ["Animals", "Business", "Family", "Wishes"];

export const token = localStorage.getItem("helpingHandsUser");

export const paymentOptionsArray = [
  {
    name: "Paystack",
    image: paystackLogo,
  },
  {
    name: "Flutterwave",
    image: flutterWaveLogo,
  },
];

export const currencyArray = [
  {
    currency: "USD",
    name: "USD (US Dollar)",
  },
  {
    currency: "GBP",
    name: "GBP (Pound)",
  },
  {
    currency: "NGN",
    name: "NGN (Naira)",
  },
];
