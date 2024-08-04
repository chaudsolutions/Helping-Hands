import { useParams } from "react-router-dom";
import PayRequestAnim from "../../Animations/PayRequestAnim";
import "./funds.css";
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentRequest } from "../../Hooks/useFetch";
import PageLoader from "../../Animations/PageLoader";
import Null from "../../Animations/Null";
import { currencyArray, paymentOptionsArray } from "../../Hooks/useVariable";
import toast from "react-hot-toast";
import { useState } from "react";
import useCurrencyConversion from "../../Hooks/useCurrencyConversion";
import SEOComponent from "../../SEO/SEO";
import usePaystackPayment from "../../Hooks/usePaystack";
import useFlutterWavePayment from "../../Hooks/useFlutterWave";
import ButtonLoad from "../../Animations/ButtonLoad";

const FundsRequestPayment = () => {
  const [donorEmail, setDonorEmail] = useState("");
  const [currency, setCurrency] = useState("");

  const params = useParams();

  const { requestFundsId, requestUserId } = params;

  // fetch payment request from DB with requestFundsId and requestUserId
  const {
    data: paymentRequestData,
    isLoading: isPaymentRequestDataLoading,
    isError,
    refetch,
  } = useQuery({
    queryFn: () => fetchPaymentRequest(requestUserId, requestFundsId),
    queryKey: ["paymentRequest", requestUserId, requestFundsId],
    enabled: !!requestFundsId && !!requestUserId,
  });

  const { requestAmount, paymentDetails } = paymentRequestData || {};

  // paystack hook
  const { handlePayment, loading } = usePaystackPayment();
  // use flutterWave hook
  const { initiatePayment } = useFlutterWavePayment();
  // amount conversation hook
  const { convertedBalance, isLoading } = useCurrencyConversion({
    amountToDonate: requestAmount,
    currency,
  });

  // map payment options into DOM
  const paymentOptionsList = paymentOptionsArray.map((item, i) => {
    // function to donate
    const donateFunc = (paymentOption) => {
      if (!donorEmail) {
        return toast.error("Please provide email");
      }
      if (isLoading) {
        return toast.error("Please try again later");
      }

      if (paymentOption === "Paystack") {
        if (currency !== "NGN") {
          return toast.error("Only NGN is supported");
        }

        handlePayment({
          paymentType: "OneToOnePayment",
          amountToDonate: requestAmount,
          convertedBalance,
          currency,
          donorEmail,
          refetch,
          requestUserId,
          requestFundsId,
        });
      }
      if (paymentOption === "Flutterwave") {
        // initiatePayment({
        //   amountToPay,
        //   convertedBalance,
        //   currency,
        //   donorEmail,
        //   refetch,
        //   campaignId,
        // });
      }
    };

    return (
      <li key={i} onClick={() => donateFunc(item.name)}>
        <img src={item.image} alt={item.name} />
      </li>
    );
  });

  return (
    <div className="fundsRequestPayment">
      {/* SEO */}
      <SEOComponent />

      <PayRequestAnim />

      <h1>One to One Helping Hands Payment</h1>

      {isPaymentRequestDataLoading ? (
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

              <div>
                <strong>Pay Now</strong>
                {loading ? <ButtonLoad /> : <ul>{paymentOptionsList}</ul>}
              </div>
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
