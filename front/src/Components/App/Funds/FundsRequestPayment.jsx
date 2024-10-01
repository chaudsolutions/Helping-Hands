import { useParams } from "react-router-dom";
import PayRequestAnim from "../../Animations/PayRequestAnim";
import "./funds.css";
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentRequest } from "../../Hooks/useFetch";
import PageLoader from "../../Animations/PageLoader";
import Null from "../../Animations/Null";
import { currencyArray } from "../../Hooks/useVariable";
import toast from "react-hot-toast";
import { useState } from "react";
import useCurrencyConversion from "../../Hooks/useCurrencyConversion";
import SEOComponent from "../../SEO/SEO";
import useStripeCheckout from "../../Hooks/useStripe";
import ButtonLoad from "../../Animations/ButtonLoad";
import usePaystackPayment from "../../Hooks/usePaystack";

const FundsRequestPayment = () => {
  const url = window.location.origin;

  const [donorEmail, setDonorEmail] = useState("");
  const [currency, setCurrency] = useState("USD");

  const params = useParams();

  const { requestFundsId, requestUserId } = params;

  // stripe hook
  const { initiateCheckout, isStripeLoading } = useStripeCheckout();
  // paystack hook
  const { handlePayment, loading } = usePaystackPayment();

  // fetch payment request from DB with requestFundsId and requestUserId
  const {
    data: paymentRequestData,
    isLoading: isPaymentRequestDataLoading,
    isError,
    refetch: refetchPaymentRequest,
  } = useQuery({
    queryFn: () => fetchPaymentRequest(requestUserId, requestFundsId),
    queryKey: ["paymentRequest", requestUserId, requestFundsId],
    enabled: !!requestFundsId && !!requestUserId,
  });

  const { requestAmount, paymentDetails } = paymentRequestData || {};

  // amount conversation hook
  const { convertedBalance, isLoading } = useCurrencyConversion({
    amountToDonate: requestAmount,
    currency,
  });

  // function to donate
  const donateFunc = () => {
    if (!donorEmail) {
      return toast.error("Please provide email");
    }
    if (isLoading) {
      return toast.error("Please try again later");
    }

    // paystack
    if (currency === "NGN") {
      handlePayment({
        paymentType: "OneToOnePayment",
        amountToDonate: requestAmount,
        convertedBalance,
        currency,
        donorEmail,
        refetch: refetchPaymentRequest,
        requestUserId,
        requestFundsId,
      });
    }

    // stripe
    if (currency !== "NGN") {
      initiateCheckout({
        paymentType: "OneToOnePayment",
        amount: convertedBalance,
        currency,
        donorEmail,
        campaignId: `${requestUserId}/${requestFundsId}`,
        url,
      });
    }
  };

  return (
    <div className="fundsRequestPayment">
      {/* SEO */}
      <SEOComponent />

      <PayRequestAnim />

      <h1>One to One Helping Hands Payment</h1>

      {isPaymentRequestDataLoading && !isError ? (
        <PageLoader />
      ) : (
        <div className="fundsRequestPayment-details">
          <div className={`reqAmount ${paymentDetails && "paid"}`}>
            ${requestAmount}
          </div>

          {paymentDetails ? (
            <p>This Payment Link has already been paid</p>
          ) : (
            <div className="reqPay">
              <select onChange={(e) => setCurrency(e.target.value)}>
                {currencyArray.map((currency, i) => (
                  <option key={i} value={currency.currency}>
                    {currency.name}
                  </option>
                ))}
              </select>

              <input
                type="email"
                placeholder="Email address"
                onChange={(e) => setDonorEmail(e.target.value)}
              />

              <button
                onClick={donateFunc}
                style={{ backgroundColor: isStripeLoading && "black" }}>
                {isStripeLoading || loading ? <ButtonLoad /> : <>Pay Now</>}
              </button>
            </div>
          )}
        </div>
      )}

      {/* error */}
      {isError && (
        <div className="null">
          <div>
            Error fetching payment request or it may no longer exist or may have
            been deleted by the creator, kindly request for a new one to one
            payment link
          </div>
          <Null />
        </div>
      )}
    </div>
  );
};

export default FundsRequestPayment;
