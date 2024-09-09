import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./payment.css";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { serVer } from "../../Hooks/useVariable";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export const Success = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const { paymentType } = params;

  const donation = paymentType === "Donation";
  const oneToOnePayment = paymentType === "OneToOne";

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

        if (donation) {
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
        }
      } catch (error) {
        toast.error("Error processing the payment.");
      }
    };

    if (sessionId) {
      verifyPayment();
    }
  }, [location, navigate, donation]);

  return (
    <div className="payment">
      <h1>Payment Successful</h1>
      <p>
        Thank you for your {donation && <>Donation</>}
        {oneToOnePayment && <>Payment</>}!
      </p>
      <p>You will be redirected in few seconds</p>

      <CountdownCircleTimer
        size={100}
        isPlaying
        duration={7}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[7, 5, 2, 0]}
        onComplete={() => {
          // do your stuff here
          return { shouldRepeat: true, delay: 1.5 }; // repeat animation in 1.5 seconds
        }}>
        {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>
      <Link to="/">Go Home</Link>
    </div>
  );
};

export const Failed = () => {
  return <div className="payment">Failed Payment</div>;
};
