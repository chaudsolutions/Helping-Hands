import { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { serVer } from "./useVariable";
import toast from "react-hot-toast";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const useStripeCheckout = () => {
  const [isStripeLoading, setIsStripeLoading] = useState(false);

  const initiateCheckout = async ({
    paymentType,
    amount,
    currency,
    donorEmail,
    campaignId,
    url,
  }) => {
    setIsStripeLoading(true);

    try {
      // Create checkout session via your backend
      const { data } = await axios.post(
        `${serVer}/verify-payment/stripe/create-checkout-session`,
        {
          amount,
          currency: currency.toLowerCase(),
          email: donorEmail,
          paymentType,
          url,
          id: campaignId,
        }
      );

      const stripe = await stripePromise;

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id,
      });

      if (error) {
        console.error(error);
        toast.error("Stripe Checkout error");
      }
    } catch (error) {
      toast.error(error.response?.data || "An error occurred");
    } finally {
      setIsStripeLoading(false);
    }
  };

  return { initiateCheckout, isStripeLoading };
};

export default useStripeCheckout;
