import { useParams } from "react-router-dom";
import PayRequestAnim from "../../Animations/PayRequestAnim";
import "./funds.css";
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentRequest } from "../../Hooks/useFetch";
import PageLoader from "../../Animations/PageLoader";
import Null from "../../Animations/Null";

const FundsRequestPayment = () => {
  const params = useParams();

  const { requestFundsId, requestUserId } = params;

  // fetch payment request from DB with requestFundsId and requestUserId
  const {
    data: paymentRequestData,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => fetchPaymentRequest(requestUserId, requestFundsId),
    queryKey: ["paymentRequest", requestUserId, requestFundsId],
    enabled: !!requestFundsId && !!requestUserId,
  });

  console.log(paymentRequestData);

  return (
    <div className="fundsRequestPayment">
      <PayRequestAnim />

      <h1>One to One Helping Hands Payment</h1>

      {isLoading ? <PageLoader /> : <div></div>}

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
