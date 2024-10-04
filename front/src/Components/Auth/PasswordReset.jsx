import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { serVer } from "../Hooks/useVariable";
import SEOComponent from "../SEO/SEO";
import ButtonLoad from "../Animations/ButtonLoad";

const PasswordReset = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const { resetToken } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm();
  const { errors, isSubmitting } = formState;

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSubmit = async (data) => {
    const url = `${serVer}/auth/reset-password/${resetToken}`;
    const { password } = data;

    try {
      const response = await axios.post(url, { password });

      if (response.status === 200) {
        navigate("/login");
      }
      toast.success(response.data);
    } catch (error) {
      const { response } = error;
      toast.error(response.data);
    }
  };

  const onError = () => {
    toast.error("Failed to submit, check inputs and try again");
  };

  return (
    <div className="authentication">
      {/* SEO */}
      <SEOComponent />

      <div>
        <h1>Welcome Back</h1>
        <p>Reset Your Password</p>
      </div>

      <div className="form-container">
        <div>
          <Link to="/login">Back to login</Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div className="inputContainer">
            <input
              placeholder="New Password"
              required
              type={passwordVisible ? "text" : "password"}
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <div
              className="toggle"
              type="button"
              onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaRegEyeSlash /> : <FaEye />}
            </div>

            <p>{errors.password?.message}</p>
          </div>

          <button type="submit" disabled={isSubmitting} className="submitBtn">
            {isSubmitting ? <ButtonLoad /> : <>RESET PASSWORD</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
