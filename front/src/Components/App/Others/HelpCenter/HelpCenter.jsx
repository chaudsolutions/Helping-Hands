import { Link } from "react-router-dom";
import QAComponent from "../../../Custom/Q&A/QAComponent";
import SEOComponent from "../../../SEO/SEO";
import "./help.css";
import { useEffect } from "react";
import HeaderPage from "../../../Custom/HeaderPage/HeaderPage";

const HelpCenter = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const helps = [
    {
      title: "Creating a Fundraiser",
      content:
        "To create a fundraiser, log into your HelpWithFund account and click on 'Start a Fundraiser'. Choose a catchy title and set a realistic goal amount. Write a compelling story to explain why you're raising money and add images or videos to make your fundraiser more engaging. Once done, click 'Create' to launch your campaign.",
    },
    {
      title: "Managing Your Fundraiser",
      content:
        "You can manage your fundraiser by navigating to your dashboard and clicking on 'My Fundraisers'. Here, you can edit your fundraiser details, post updates to keep your supporters informed, and monitor your progress toward your fundraising goal.",
    },
    {
      title: "Promoting Your Fundraiser",
      content:
        "Promote your fundraiser by clicking on 'Share' on your fundraiser page. You’ll find options to share your campaign directly to Facebook, Twitter, Instagram, and other platforms. We provide a tailored message to get you started, which you can customize as you wish.",
    },
    {
      title: "Withdrawing Your Earnings",
      content:
        "To withdraw your earnings, go to 'Withdraw Funds' in your account settings. Set up a withdrawal account by providing the necessary bank information. Once set up, you can request withdrawals, which typically take 3-5 business days to process.",
    },
    {
      title: "Fee Structure and Charges",
      content:
        "HelpWithFund charges a 10% platform fee on all funds raised. This fee is used to maintain the platform and also take care of payment method charges. The total fee is deducted from each donation automatically.",
    },
    {
      title: "Sharing Your Fundraiser",
      content:
        "To share your fundraiser, click the 'Share' button on your campaign page. Choose from a variety of social media platforms or copy the direct link to share it via email or messaging apps. Engaging with your network can significantly boost your campaign’s visibility.",
    },
    {
      title: "Keeping Your Fundraiser Secure",
      content:
        "We prioritize the security of your fundraiser. Ensure your account uses a strong password and be cautious about sharing personal information publicly. If you notice any suspicious activity, report it immediately through the 'Contact Support' section.",
    },
    {
      title: "Tips for Successful Fundraising",
      content:
        "Successful fundraising involves setting achievable goals, sharing your story authentically, and engaging regularly with your supporters. Provide updates on your campaign's progress to keep donors informed and involved.",
    },
    {
      title: "Understanding Fundraiser Analytics",
      content:
        "Access the analytics dashboard from your fundraiser page to view key metrics like total views, shares, and donations. Use this data to understand your campaign's performance and optimize your strategy for better results.",
    },
    {
      title: "Contacting Support",
      content:
        "If you need help, our support team is available 24/7. Visit the 'Contact Us' on our website to browse FAQs or use the 'Contact Us' form to send a message directly to our support team. We're here to assist you with any questions or issues.",
    },
  ];

  return (
    <div className="about">
      {/* SEO */}
      <SEOComponent title="HelpWithFund | Help Center" />

      <HeaderPage page="Help Center" />

      <div>
        <div className="help">
          <h1>Help Center</h1>
          <QAComponent itemArray={[helps]} />
        </div>

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
    </div>
  );
};

export default HelpCenter;
