import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
import "./auth.css";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaDollarSign,
  FaEyeSlash,
} from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { MdOutlineCampaign } from "react-icons/md";
import ButtonLoad from "../Animations/ButtonLoad";
import SEOComponent from "../SEO/SEO";
import { categories, serVer, supportedCountries } from "../Hooks/useVariable";
import { useAuthContext } from "../Context/AuthContext";

const Register = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const { login } = useAuthContext();

  // Form state to track the current step
  const [currentStep, setCurrentStep] = useState(1);

  // Password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // React Hook Form
  const form = useForm();
  const { register, handleSubmit, trigger, formState } = form;
  const { errors, isSubmitting } = formState;

  // Function to register
  const onSubmit = async (data) => {
    const url = `${serVer}/auth/register`;
    const {
      email,
      name,
      password,
      campaignName,
      amount,
      category,
      country,
      description,
    } = data;

    try {
      const response = await axios.post(url, {
        email,
        name,
        password,
        campaignName,
        amount,
        category,
        country,
        description,
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

  // Handle step transition
  const handleProceed = async (e) => {
    e.preventDefault();
    const isValid = await trigger(["country", "category", "amount"]); // Validate fields

    if (isValid) {
      setCurrentStep(2); // Move to the next step
    } else {
      toast.error("Please fill out all fields correctly before proceeding.");
    }
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    setCurrentStep(1); // Move back to the first step
  };

  return (
    <div className="authentication">
      {/* SEO */}
      <SEOComponent />

      {currentStep === 1 && (
        <div>
          <h1>Follow the next steps</h1>
          <p>Let your Helping Hands Journey Begin</p>
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <h1>Great Progress</h1>
          <p>Create an account to make your campaign published</p>
        </div>
      )}

      <div className="form-container">
        <Link to="/login">Sign In</Link>

        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          {currentStep === 1 && (
            <>
              <div className="inputContainer">
                <label htmlFor="category">
                  What category best describes your campaign
                </label>
                <select
                  id="category"
                  {...register("category", {
                    required: "Category is required",
                  })}>
                  <option value="">Select a category</option>
                  {categories.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <p>{errors.category?.message}</p>
              </div>

              <div className="inputContainer">
                <label htmlFor="campaignName">Campaign Name</label>
                <input
                  id="campaignName"
                  type="text"
                  placeholder="Your Campaign Name"
                  {...register("campaignName", {
                    required: "Campaign Name is required",
                  })}
                />
                <p>{errors.campaignName?.message}</p>
              </div>

              <div className="inputContainer">
                <label htmlFor="amount">
                  <FaDollarSign /> Goal
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder="Your goal in USD"
                  {...register("amount", {
                    required: "Amount is required",
                  })}
                />
                <p>{errors.amount?.message}</p>
              </div>

              <div className="inputContainer">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  type="text"
                  placeholder="Write a story that would entice people to donate to your cause"
                  {...register("description", {
                    required: "A description is required",
                    minLength: {
                      value: 20,
                      message: "Description must be at least 20 characters",
                    },
                  })}
                />
                <p>{errors.description?.message}</p>
              </div>

              <button
                onClick={handleProceed}
                className="stepBtn"
                disabled={isSubmitting}>
                <span>Proceed</span>
                <FaArrowRight />
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <button onClick={handleGoBack} className="stepBtn">
                <FaArrowLeft />
                <span>Go Back</span>
              </button>
              <div className="inputContainer">
                <label htmlFor="country">Select your country</label>
                <select
                  id="country"
                  {...register("country", {
                    required: "Country is required",
                  })}>
                  <option value="">Select a country</option>
                  {supportedCountries.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <p>{errors.country?.message}</p>
              </div>

              <div className="inputContainer">
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("name", {
                    required: "Full Name is required",
                  })}
                />
                <p>{errors.name?.message}</p>
              </div>

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

              <button
                type="submit"
                disabled={isSubmitting}
                className="submitBtn">
                {isSubmitting ? (
                  <ButtonLoad />
                ) : (
                  <>
                    Create Account <MdOutlineCampaign size={20} />
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
