import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import ButtonLoad from "../../../Animations/ButtonLoad";
import { OtpInput } from "reactjs-otp-input";
import { useState } from "react";
import PropTypes from "prop-types";
import { serVer } from "../../../Hooks/useVariable";

const Verify = ({ verifyProps }) => {
  const token = localStorage.getItem("helpingHandsUser");

  const { refetchUserData } = verifyProps[0];

  const [otp, setOtp] = useState("");

  // React Hook Form
  const form = useForm();
  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  // Function to register
  const onSubmit = async () => {
    const url = `${serVer}/user/verify-token/${otp}`;

    try {
      const response = await axios.put(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refetch user data
      refetchUserData();

      toast.success(response.data);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const onError = () => {
    toast.error("Failed to submit, check inputs and try again");
  };

  return (
    <div className="verify">
      <div>
        <h1>Verify your email</h1>
        <p>
          A code has been sent to you mail box, enter the code here to verify
          your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <OtpInput
          value={otp}
          onChange={(otp) => setOtp(otp)}
          numInputs={6}
          separator={<span>-</span>}
          containerStyle={"otp-input"}
        />

        <button type="submit">
          {isSubmitting ? <ButtonLoad /> : <>Verify</>}
        </button>
      </form>
    </div>
  );
};

Verify.propTypes = {
  verifyProps: PropTypes.array.isRequired,
};

export default Verify;
