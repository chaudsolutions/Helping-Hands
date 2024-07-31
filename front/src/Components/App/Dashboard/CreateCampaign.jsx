import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import SEOComponent from "../../SEO/SEO";
import ButtonLoad from "../../Animations/ButtonLoad";
import { FaDollarSign, FaImage } from "react-icons/fa6";
import { useState } from "react";
import { categories, serVer } from "../../Hooks/useVariable";

const CreateCampaign = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  // React Hook Form
  const form = useForm();
  const { register, handleSubmit, formState, clearErrors, reset } = form;
  const { errors, isSubmitting } = formState;

  // Function to register
  const onSubmit = async (data) => {
    const token = localStorage.getItem("helpingHandsUser");

    try {
      const url = `${serVer}/user/new-campaign`;
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append("images", file));
      formData.append("campaignName", data.campaignName);
      formData.append("category", data.category);
      formData.append("amount", data.amount);
      formData.append("description", data.description);

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data);
      // Reset form after successful submission
      reset();
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  const onError = () => {
    toast.error("Failed to submit, check inputs and try again");
  };

  const handleFileChange = (event) => {
    setLoading(true);

    const files = Array.from(event.target.files);
    if (files.length > 0) {
      clearErrors("image");
    }
    setImageFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setLoading(false);
  };

  return (
    <div className="authentication">
      {/* SEO */}
      <SEOComponent />

      <div>
        <h1>Create a New Campaign</h1>
        <p>Start raising funds for your amazing project</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div className="inputContainer">
            <label htmlFor="imageOne" className="imageLabel">
              {loading ? (
                <ButtonLoad />
              ) : imagePreviews.length ? (
                imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Uploaded ${index}`}
                    width="100"
                  />
                ))
              ) : (
                <span>
                  Add Image
                  <FaImage />
                </span>
              )}
              <input
                id="imageOne"
                type="file"
                accept="image/*"
                {...register("image", { required: "Images are required" })}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
            <p>{errors.image?.message}</p>
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
            <label htmlFor="amount">
              <FaDollarSign /> Goal
            </label>
            <input
              id="amount"
              type="number"
              placeholder="Your goal in USD"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 1, message: "Amount must be at least $1" },
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

          <button type="submit" disabled={isSubmitting} className="submitBtn">
            {isSubmitting || loading ? <ButtonLoad /> : "Create Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
