import { useEffect } from "react";
import PrivacyAnim from "../../../Animations/PrivacyAnim";
import QAComponent from "../../../Custom/Q&A/QAComponent";
import "./privacy.css";
import { Link } from "react-router-dom";

const Privacy = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const privacyData = [
    {
      title: "What Information We Collect",
      content:
        "We collect information that you provide to us when signing up for an account. This includes your name, email address, and password. We do not collect any other personal information unless you voluntarily provide it.",
    },
    {
      title: "How We Use Your Information",
      content:
        "The information we collect is used to create and maintain your account, allow you to participate in our platform, and communicate with you regarding your activities and our services. We do not sell or share your personal information with third parties for marketing purposes.",
    },
    {
      title: "No Cookies Policy",
      content:
        "We do not use cookies on our website to track your activities or store personal data. Our website operates without the use of cookies to respect your privacy and provide a secure browsing experience.",
    },
    {
      title: "No User Tracking",
      content:
        "HelpWithFund respects your privacy by not tracking your online activities across different websites. We do not use tracking technologies or third-party services to monitor your behavior on the internet.",
    },
    {
      title: "Data Security",
      content:
        "We implement industry-standard security measures to protect your personal information from unauthorized access, use, or disclosure. Our security practices include encryption, firewalls, and secure server environments.",
    },
    {
      title: "Third-Party Services",
      content:
        "Our website may contain links to third-party websites or services that are not operated by us. We are not responsible for the privacy practices of these third-party sites. We encourage you to review their privacy policies before providing any personal information.",
    },
    {
      title: "Your Rights",
      content:
        "You have the right to access, update, or delete the personal information we hold about you. You can do this by logging into your account and updating your settings. If you need further assistance, please contact our support team.",
    },
    {
      title: "Changes to This Privacy Policy",
      content:
        "We may update our Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new policy on our website and updating the 'Last updated' date at the top of this page.",
    },
    {
      title: "Contact Us",
      content:
        "If you have any questions or concerns about our Privacy Policy or the handling of your personal information, please contact us at support@HelpWithFund.com.",
    },
  ];

  return (
    <div className="privacy-policy">
      <PrivacyAnim />

      <div>
        <h1>Privacy Policy</h1>
        <p>
          Last updated: August 1, 2024
          <br /> We value your privacy and are committed to protecting your
          personal information.
        </p>
      </div>

      <QAComponent itemArray={[privacyData]} />

      <div className="help-contact">
        <div>
          <h2>We got you</h2>
          <p>
            Need to reach out to us? Click on the Contact Us below and find
            different ways to reach us
          </p>

          <Link to="/contact-us">Contact Us</Link>
        </div>

        <div className="c-bg"></div>
      </div>
    </div>
  );
};

export default Privacy;
