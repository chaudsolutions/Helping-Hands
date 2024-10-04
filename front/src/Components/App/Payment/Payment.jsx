import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./payment.css";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { serVer } from "../../Hooks/useVariable";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export const Success = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [ran, setRan] = useState(false);

  const { paymentType } = params;

  const donation = paymentType === "Donation";
  const oneToOnePayment = paymentType === "OneToOnePayment";

  useEffect(() => {
    let isMounted = true; // Track if component is mounted

    const sessionId = new URLSearchParams(location.search).get("session_id");

    const verifyPayment = async () => {
      setRan(true);
      try {
        const { data } = await axios.post(
          `${serVer}/verify-payment/verify-stripe`,
          {
            sessionId,
          }
        );

        // function for donation payment
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
            const res = await axios.put(
              `${serVer}/verify-payment/donate/${data.metadata.id}`,
              {
                donateData,
              }
            );

            toast.success(res.data);

            // Navigate to the campaign page
            navigate(`/campaign/${data.metadata.id}`);
          } catch (e) {
            toast.error("Error saving payment data to the database.");
          }
        }

        // function for one to one payment
        if (oneToOnePayment) {
          // Save payment details to database
          const paymentRequestData = {
            email: data.customer_email,
            name: data.customer_email.split("@")[0],
            customerPaymentId: sessionId,
            paymentMethod: "Stripe",
            amountReceivedViaPaymentMethod: data.amount_total / 100,
            paymentId: sessionId,
            currency: data.currency,
            amountToDonate: parseInt(data.amount_total / 100),
          };

          const paymentRequestUrl = `${serVer}/verify-payment/pay-request/${data.metadata.id}`;

          try {
            const response = await axios.put(paymentRequestUrl, {
              paymentRequestData,
            });

            toast.success(response.data);

            // Navigate to the one to one payment page
            navigate(`/request-funds/${data.metadata.id}`);
          } catch (error) {
            toast.error(error?.response?.data);
          }
        }
      } catch (error) {
        toast.error("Error processing the payment.");
      }
    };

    if (sessionId && isMounted && !ran) {
      verifyPayment();
    }

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false on unmount
    };
  }, [location, navigate, donation, oneToOnePayment, ran]);

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
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="payment">
      <h1>Failed Payment</h1>
      <Link to="/">Go Home</Link>
    </div>
  );
};
