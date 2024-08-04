import PaystackPop from "@paystack/inline-js";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { serVer } from "./useVariable";

const usePaystackPayment = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = ({
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
    setLoading(true);

    const amount = convertedBalance * 100;
    const firstName = donorEmail.split("@")[0];

    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: "pk_test_88214b62e2f915fd2f0f2766fbdb7daca47416a1",
      cors: true,
      amount,
      currency,
      email: donorEmail,
      firstname: firstName,
      lastname: "",

      async onSuccess(transaction) {
        const reference = transaction.reference;
        toast.loading(`Verifying Payment`);

        if (reference) {
          // Backend endpoint
          const url = `${serVer}/verify-payment/paystack`;

          try {
            const response = await axios.post(`${url}?reference=${reference}`, {
              reference,
            });

            const { data } = response;

            toast.dismiss();
            toast.success(data?.message);

            const status = data?.data?.status;

            // add paid courses to db once payment is verified
            if (status === "success") {
              toast.success("Payment Received");
              const amountPaid = data?.data?.amount / 100;
              const customerId = data?.data?.customer.id;

              // check if user paid exact amount for order
              if (amountPaid < convertedBalance) {
                return toast.error("Incomplete payment");
              }

              // NOTE: This is for donations
              if (paymentType !== "OneToOnePayment") {
                // Save donate details to database
                const donateData = {
                  email: donorEmail,
                  name: firstName,
                  customerPaymentId: customerId,
                  paymentMethod: "Paystack",
                  amountReceivedViaPaymentMethod: amountPaid,
                  paymentId: reference,
                  currency,
                  amountToDonate: parseInt(amountToDonate),
                };

                const donateUrl = `${serVer}/verify-payment/donate/${campaignId}`;

                try {
                  const response = await axios.put(donateUrl, { donateData });

                  toast.success(response.data);

                  // refetch the campaign
                  refetch();
                } catch (error) {
                  toast.error(error?.response?.data);
                } finally {
                  setLoading(false);
                }
              }

              // NOTE: This is for one-to-one payments
              if (paymentType === "OneToOnePayment") {
                // Save payment details to database
                const paymentRequestData = {
                  email: donorEmail,
                  name: firstName,
                  customerPaymentId: customerId,
                  paymentMethod: "Paystack",
                  amountReceivedViaPaymentMethod: amountPaid,
                  paymentId: reference,
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
                } finally {
                  setLoading(false);
                }
              }
            }
          } catch (error) {
            console.log(error);
            toast.error("Payment verification failed");
          } finally {
            setLoading(false);
          }
        }
      },
      onCancel() {
        toast.error("You canceled the transaction");
        setLoading(false);
      },
    });
  };

  return {
    handlePayment,
    loading,
  };
};

export default usePaystackPayment;
