import Popup from "reactjs-popup";
import "./floatingModal.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ButtonLoad from "../../Animations/ButtonLoad";

const PopupComponent = ({ open, onClose, context }) => {
  const withdraw = context === "Withdraw";
  const request = context === "Request";

  // react form
  const withdrawalForm = useForm();
  const {
    register: withdrawalRegister,
    handleSubmit: withdrawalHandleSubmit,
    formState: withdrawalFormState,
  } = withdrawalForm;
  const { errors, isSubmitting } = withdrawalFormState;

  //  function to request withdrawals
  const handleWithdraw = async (data) => {};

  const onWithdrawError = () => {
    toast.error("Failed to submit, check inputs and try again");
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
                <p>{errors.bankName?.message}</p>
              </div>
              <div className="inputBox">
                <input
                  placeholder="Acct No."
                  required
                  type="text"
                  {...withdrawalRegister("accountNumber", {
                    required: "Account Number is required",
                  })}
                />
                <p>{errors.accountNumber?.message}</p>
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
                <p>{errors.message?.message}</p>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <ButtonLoad /> : <>WITHDRAW</>}
            </button>
          </form>
        )}

        {request && (
          <form>
            <input type="number" placeholder="amount" />
          </form>
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
