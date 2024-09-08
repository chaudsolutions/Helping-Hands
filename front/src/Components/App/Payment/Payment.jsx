import { Link, useLocation, useNavigate } from "react-router-dom";
import "./payment.css";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { serVer } from "../../Hooks/useVariable";

export const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get("session_id");

    const verifyPayment = async () => {
      try {
        const { data } = await axios.post(
          `${serVer}/verify-payment/verify-stripe`,
          {
            sessionId,
          }
        );

        const donateData = {
          amount: data.amount_total / 100,
          email: data.customer_email,
          name: data.customer_email.split("@")[0],
          customerPaymentId: sessionId,
          paymentMethod: "stripe",
          amountReceivedViaPaymentMethod: data.amount_total / 100,
          paymentId: sessionId,
          currency: data.currency,
          amountToDonate: data.amount_total / 100,
        };

        try {
          // Save payment data to your database
          await axios.put(
            `${serVer}/verify-payment/donate/${data.metadata.id}`,
            {
              donateData,
            }
          );

          toast.success("Donation successful!");

          // Navigate to the campaign page
          navigate(`/campaign/${data.metadata.id}`);
        } catch (e) {
          toast.error("Error saving payment data to database.");
        }
      } catch (error) {
        toast.error("Error processing the payment.");
      }
    };

    if (sessionId) {
      verifyPayment();
    }
  }, [location, navigate]);

  return (
    <div className="payment">
      <h1>Payment Successful</h1>
      <p>Thank you for your payment!</p>
      <Link to="/">Go Home</Link>
    </div>
  );
};

export const Failed = () => {
  return <div className="payment">Failed Payment</div>;
};
