import axios from "axios";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { serVer } from "./useVariable";

const useFlutterWavePayment = () => {
  const token = localStorage.getItem("helpingHandsUser");

  const navigate = useNavigate();

  const initiatePayment = ({
    clearCart,
    totalCartAmount,
    currency,
    email,
    phoneNumber,
    firstName,
    lastName,
    cartItems,
    referrerCoursePercentage,
  }) => {
    const flutterwaveConfig = {
      public_key: "FLWPUBK_TEST-c5a5dcbad5ffc9107da775ce703e144f-X",
      tx_ref: Date.now().toString(),
      amount: totalCartAmount,
      currency,
      customer: {
        email: email,
        phone_number: phoneNumber,
        name: `${firstName} ${lastName}`,
      },
      customizations: {
        title: "Euro Learn Course(s)",
        description: "Payment for items in cart",
        logo: "../../assets/euroLearnLogo.jpeg",
      },
    };

    const handleFlutterPayment = useFlutterwave(flutterwaveConfig);

    handleFlutterPayment({
      callback: async (response) => {
        if (response.status === "successful") {
          // Send transaction details to backend for verification
          try {
            const url = `/verify-payment/flutterwave`;
            const transactionId = response.transaction_id;

            const verifyResponse = await axios.post(url, {
              transactionId,
              expectedAmount: totalCartAmount,
              expectedCurrency: currency,
            });

            if (verifyResponse.data === "Payment verified successfully") {
              // Payment verified successfully
              toast.success(verifyResponse.data);

              const amountReceivedViaPaymentMethod = response.charged_amount;

              // Save order details to database
              const orderData = {
                customerPaymentId: response.flw_ref,
                cartItems,
                totalCartAmount,
                paymentMethod: "FlutterWave",
                amountReceivedViaPaymentMethod,
                paymentId: transactionId,
                currency,
                referrerCoursePercentage,
              };

              const purchaseUrl = `${serVer}/user/purchase-course`;

              //   send items to user purchased courses
              try {
                const response = await axios.post(
                  purchaseUrl,
                  { orderData },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                toast.success(response.data);

                // clear cart
                clearCart();

                // redirect to course page
                navigate(`/courses`);
              } catch (error) {
                console.error(error);
                toast.error(error?.response?.data);
              }
              toast.success("Payment successful and verified!");
              // Perform any further actions, e.g., save transaction details to the server
            } else {
              // Payment verification failed
              toast.error("Payment verification failed");
              console.log("Payment verification failed", verifyResponse.data);
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("An error occurred while verifying the payment");
          }
        } else {
          // Handle unsuccessful payment
          toast.error("Payment was not successful");
        }
        closePaymentModal(); // Close the payment modal after the transaction
      },
      onClose: () => {
        toast.error("Payment Cancelled");
      },
    });
  };

  return {
    initiatePayment,
  };
};

export default useFlutterWavePayment;
