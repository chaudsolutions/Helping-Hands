import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
import "./auth.css";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaEyeSlash, FaHouseChimneyUser } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import ButtonLoad from "../Animations/ButtonLoad";
import SEOComponent from "../SEO/SEO";
import { useAuthContext } from "../Context/AuthContext";
import { serVer } from "../Hooks/useVariable";
import PopupComponent from "../Custom/Popup/PopupComponent";

const Login = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const { login } = useAuthContext();

  const [isPopupOpen, setIsPopupOpen] = useState({ boolean: false, value: "" });
  // Password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // React Hook Form
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  // Function to register
  const onSubmit = async (data) => {
    const url = `${serVer}/auth/login`;
    const { email, password } = data;

    try {
      const response = await axios.post(url, {
        email,
        password,
      });

      if (response.status === 200) {
        // Save the user to local storage
        localStorage.setItem("helpingHandsUser", JSON.stringify(response.data));

        // Update the auth Context
        login(response.data);
        toast.success("Welcome to Helping Hands");
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      const { response } = error;
      toast.error(response?.data || "An error occurred");
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
        <p>Login to manage your account</p>
      </div>

      <div className="form-container">
        <div>
          <Link to="/create/campaign">Create Account</Link>
          <button
            onClick={() =>
              setIsPopupOpen({ boolean: true, value: "ForgotPassword" })
            }>
            Forgot Password?
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div className="inputContainer">
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            <p>{errors.email?.message}</p>
          </div>

          <div className="inputContainer">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            <div onClick={togglePasswordVisibility} className="toggle">
              {passwordVisible ? <FaEyeSlash /> : <IoEyeSharp />}
            </div>
            <p>{errors.password?.message}</p>
          </div>

          <button type="submit" disabled={isSubmitting} className="submitBtn">
            {isSubmitting ? (
              <ButtonLoad />
            ) : (
              <>
                Login <FaHouseChimneyUser size={20} />
              </>
            )}
          </button>
        </form>
      </div>
      {/* pop up component */}
      <div>
        <PopupComponent
          open={isPopupOpen.boolean}
          onClose={() => setIsPopupOpen({ boolean: false, value: "" })}
          context={isPopupOpen.value}
        />
        <div id="popup-root" />
      </div>
    </div>
  );
};

export default Login;
