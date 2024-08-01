import { useEffect } from "react";
import SEOComponent from "../../../SEO/SEO";

// import react hook form for handling the form
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
//emailJs
import emailjs from "@emailjs/browser";
import ButtonLoad from "../../../Animations/ButtonLoad";

import "./contact.css";
import { IoIosSend } from "react-icons/io";
import { MdEmail, MdLocationPin } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import Socials from "../../../Custom/Footer/Socials";

const Contact = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  // react form
  const form = useForm();
  const { register, handleSubmit, formState, reset } = form;
  const { errors, isSubmitting } = formState;

  //  function to send a contact us message
  const onSubmit = async (data) => {
    try {
      await emailjs.send(
        "service_dxab7dq",
        "template_im1tk56",
        data,
        "bZ-33Nm3WNL2W4KBP"
      );

      // clear the inputs
      reset();

      toast.success("Message Sent Successfully");
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const onError = () => {
    toast.error("Failed to submit, check inputs and try again");
  };

  return (
    <div className="contact-us">
      <SEOComponent title="Helping Hands | Contact Us" />

      <div className="contact-bg"></div>

      <div className="contact-form">
        <h3>Get In Touch</h3>

        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div>
            <div className="inputBox">
              <input
                placeholder="Name"
                required
                type="text"
                {...register("user_name", { required: "Name is required" })}
              />
              <p>{errors.user_name?.message}</p>
            </div>
            <div className="inputBox">
              <input
                placeholder="Email"
                required
                type="email"
                {...register("user_email", { required: "Email is required" })}
              />
              <p>{errors.user_email?.message}</p>
            </div>
            <div className="inputBox">
              <input
                placeholder="Phone"
                required
                type="text"
                {...register("phone", { required: "Phone is required" })}
              />
              <p>{errors.phone?.message}</p>
            </div>
            <div className="inputBox">
              <input
                placeholder="Subject"
                required
                type="text"
                {...register("subject", { required: "Subject is required" })}
              />
              <p>{errors.subject?.message}</p>
            </div>
            <div className="inputBox">
              <textarea
                placeholder="Your Message"
                required
                type="text"
                {...register("message", {
                  required: "Your Message is required",
                })}
              />
              <p>{errors.message?.message}</p>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <ButtonLoad />
            ) : (
              <>
                SEND MESSAGE
                <IoIosSend size={30} />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="contact-info">
        <h4>Contact Information</h4>
        <ul className="info">
          <li>
            <MdLocationPin size={30} />
            <a href="geo:">1234 Main St, City, State, ZIP Code</a>
          </li>
          <li>
            <MdEmail size={30} />
            <a href="mailto:">helpinghandssource@example.com</a>
          </li>
          <li>
            <IoCall size={30} /> <a href="tel:">(123) 456-7890</a>
          </li>
        </ul>

        <Socials />
      </div>
    </div>
  );
};

export default Contact;
