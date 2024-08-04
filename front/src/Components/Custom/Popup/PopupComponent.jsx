import Popup from "reactjs-popup";
import "./floatingModal.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ButtonLoad from "../../Animations/ButtonLoad";
import axios from "axios";
import { serVer, token } from "../../Hooks/useVariable";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReadMoreArea from "@foxeian/react-read-more";

const PopupComponent = ({ open, onClose, context }) => {
  const withdraw = context === "Withdraw";
  const request = context === "Request";

  const [fundsLink, setFundsLink] = useState("");
  const [copiedText, setCopiedText] = useState("");

  // react form
  const withdrawalForm = useForm();
  const {
    register: withdrawalRegister,
    handleSubmit: withdrawalHandleSubmit,
    formState: withdrawalFormState,
  } = withdrawalForm;
  const { errors: withdrawalErrors, isSubmitting: isWithdrawalSubmitting } =
    withdrawalFormState;

  const requestForm = useForm();
  const {
    register: requestRegister,
    handleSubmit: requestHandleSubmit,
    formState: requestFormState,
    reset: requestReset,
  } = requestForm;
  const { errors: requestErrors, isSubmitting: isRequestSubmitting } =
    requestFormState;

  //  function to request withdrawals
  const handleWithdraw = async (data) => {};

  const onWithdrawError = () => {
    toast.error("Failed to submit, check inputs and try again");
  };

  // function to request for funds by generating amount request link
  const handleRequest = async (data) => {
    const { requestAmount } = data;
    const url = `${serVer}/funds/request-funds/${requestAmount}`;

    try {
      const res = await axios.put(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { data } = res;

      setFundsLink(data.requestFundsLink);

      requestReset();

      toast.success("Link generated successfully");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const onRequestError = () => {
    toast.error("Failed to submit, check inputs and try again");
  };

  const handleCopy = () => {
    setCopiedText(!copiedText);
    toast.success(`Copied`);
  };

  return (
    <Popup open={open} onClose={onClose} modal nested>
      <div className="floating-Modal">
        <h3>
          {withdraw && `${context} your`}
          {request && `${context} for`} Funds
        </h3>
        <p>
          {withdraw && (
            <>
              Withdraw your balance straight to your bank account <br /> refer
              to our <Link to="/frequently-asked-questions">FAQ</Link> for more
              information on withdrawals
            </>
          )}

          {request && (
            <>
              Request for funds from anyone by generating a link and sending it
              to them, the Funds is added to your balance once the receiver
              pays. a 10% cut is attached
            </>
          )}
        </p>

        {withdraw && (
          <form
            onSubmit={withdrawalHandleSubmit(handleWithdraw, onWithdrawError)}
            noValidate>
            <div>
              <div className="inputBox">
                <input
                  placeholder="Bank Name"
                  required
                  type="text"
                  {...withdrawalRegister("bankName", {
                    required: "Bank Name is required",
                  })}
                />
                <p>{withdrawalErrors.bankName?.message}</p>
              </div>
              <div className="inputBox">
                <input
                  placeholder="Acct No."
                  required
                  type="number"
                  {...withdrawalRegister("accountNumber", {
                    required: "Account Number is required",
                  })}
                />
                <p>{withdrawalErrors.accountNumber?.message}</p>
              </div>

              <div className="inputBox">
                <textarea
                  placeholder="Notes: Routing if available or other reasons that should be noted"
                  required
                  type="text"
                  {...withdrawalRegister("message", {
                    required: "Your Message is required",
                  })}
                />
                <p>{withdrawalErrors.message?.message}</p>
              </div>
            </div>

            <button type="submit" disabled={isWithdrawalSubmitting}>
              {isWithdrawalSubmitting ? <ButtonLoad /> : <>WITHDRAW</>}
            </button>
          </form>
        )}

        {request && (
          <>
            {fundsLink && (
              <div className="requestFunds-link">
                <span>Your Funds Request Link:</span>
                <div>
                  <ReadMoreArea
                    lettersLimit={25} // limit of letters (100 letters)
                  >
                    {window.location.origin + "/request-funds/" + fundsLink}
                  </ReadMoreArea>
                  <CopyToClipboard text={`${fundsLink}`} onCopy={handleCopy}>
                    <button>Copy</button>
                  </CopyToClipboard>
                </div>
              </div>
            )}
            <form
              onSubmit={requestHandleSubmit(handleRequest, onRequestError)}
              noValidate>
              <div>
                <div className="inputBox">
                  <input
                    placeholder="Amount in USD"
                    required
                    type="number"
                    {...requestRegister("requestAmount", {
                      required: "Request Amount is required",
                    })}
                  />
                  <p>{requestErrors.requestAmount?.message}</p>
                </div>
              </div>

              <button type="submit" disabled={isRequestSubmitting}>
                {isRequestSubmitting ? <ButtonLoad /> : <>REQUEST</>}
              </button>
            </form>
          </>
        )}
        <button className="close" onClick={onClose}>
          CLOSE
        </button>
      </div>
    </Popup>
  );
};

PopupComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  context: PropTypes.any.isRequired,
};

export default PopupComponent;
