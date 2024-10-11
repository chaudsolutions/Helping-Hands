import axios from "axios";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import toast from "react-hot-toast";
import { serVer } from "./useVariable";
import Logo from "/logo.png";

const useFlutterWavePayment = () => {
  const token = localStorage.getItem("HelpWithFundUser");

  const initiatePayment = ({
    paymentType,
    amountToDonate,
    convertedBalance,
    currency,
    donorEmail,
    refetch,
    campaignId,
    requestUserId,
    requestFundsId,
  }) => {
    const flutterwaveConfig = {
      public_key: "FLWPUBK_TEST-c5a5dcbad5ffc9107da775ce703e144f-X",
      tx_ref: Date.now().toString(),
      amount: convertedBalance,
      currency,
      customer: {
        email: donorEmail,
        phone_number: "",
        name: `${donorEmail.split("@")[0]}`,
      },
      customizations: {
        title: "HelpWithFund | CrowdFunding Platform",
        description: "",
        logo: Logo,
      },
    };

    const handleFlutterPayment = useFlutterwave(flutterwaveConfig);

    handleFlutterPayment({
      callback: async (response) => {
        if (response.status === "successful") {
          // Send transaction details to backend for verification
          try {
            const url = `${serVer}/verify-payment/flutterwave`;
            const transactionId = response.transaction_id;

            const verifyResponse = await axios.post(url, {
              transactionId,
              expectedAmount: convertedBalance,
              expectedCurrency: currency,
            });

            if (verifyResponse.data === "Payment verified successfully") {
              // Payment verified successfully
              toast.success(verifyResponse.data);

              const amountReceivedViaPaymentMethod = response.charged_amount;

              // NOTE: This is for donations
              if (paymentType === "donation") {
                // Save donate details to database
                const donateData = {
                  email: donorEmail,
                  name: donorEmail.split("@")[0],
                  customerPaymentId: response.flw_ref,
                  paymentMethod: "FlutterWave",
                  amountReceivedViaPaymentMethod,
                  paymentId: transactionId,
                  currency,
                  amountToDonate: parseInt(amountToDonate),
                };

                const donateUrl = `${serVer}/verify-payment/donate/${campaignId}`;

                //   send items to user purchased courses
                try {
                  const response = await axios.post(
                    donateUrl,
                    { donateData },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  toast.success(response.data);

                  // refetch the campaign
                  refetch();
                } catch (error) {
                  console.error(error);
                  toast.error(error?.response?.data);
                }
              }
              // NOTE: This is for one-to-one payments
              if (paymentType === "OneToOnePayment") {
                // Save payment details to database
                const paymentRequestData = {
                  email: donorEmail,
                  name: donorEmail.split("@")[0],
                  customerPaymentId: response.flw_ref,
                  paymentMethod: "FlutterWave",
                  amountReceivedViaPaymentMethod,
                  paymentId: transactionId,
                  currency,
                  amountToDonate: parseInt(amountToDonate),
                };

                const paymentRequestUrl = `${serVer}/verify-payment/pay-request/${requestUserId}/${requestFundsId}`;

                try {
                  const response = await axios.put(paymentRequestUrl, {
                    paymentRequestData,
                  });

                  toast.success(response.data);

                  // refetch the campaign
                  refetch();
                } catch (error) {
                  toast.error(error?.response?.data);
                }
              }
              toast.success("Payment successful and verified!");
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
