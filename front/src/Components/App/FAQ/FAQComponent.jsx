import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import "./faq.css";
import SEOComponent from "../../SEO/SEO";

const FAQComponent = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const [activeFAQ, setActiveFAQ] = useState(null);

  const faqs = [
    {
      title: "How Can I Make a Donation?",
      content:
        "You can make a donation by clicking on the 'Donate Now' button on the campaign page. You will be guided through a simple process to complete your donation.",
    },
    {
      title: "Is My Donation Tax-Deductible?",
      content:
        "Yes, all donations made through our platform are tax-deductible. You will receive a receipt via email that you can use for tax purposes.",
    },
    {
      title: "Can I Donate In Honor or Memory of Someone?",
      content:
        "Absolutely! You can choose to make a donation in honor or memory of someone special. Just select the appropriate option during the donation process.",
    },
    {
      title: "How Will My Donation Be Used?",
      content:
        "Your donation will be used to support the specific cause or campaign you have chosen. Detailed information about the use of funds can be found on each campaign page.",
    },
    {
      title: "Can I Set Up a Recurring Donation?",
      content:
        "Yes, you can set up a recurring donation. This option is available during the donation process, and you can choose the frequency that works best for you.",
    },
    {
      title: "How Can I Start a Fundraiser?",
      content:
        "To start a fundraiser, click on the 'Start a Campaign' button on the homepage. Follow the steps to create and share your campaign with others.",
    },
    {
      title: "How Do I Withdraw Funds from My Campaign?",
      content:
        "To withdraw funds, log in to your account, go to your campaign dashboard, and select 'Withdraw Funds'. Follow the instructions to transfer funds to your bank account.",
    },
    {
      title: "What Happens If a Campaign Does Not Reach Its Goal?",
      content:
        "If a campaign does not reach its goal, the funds raised are still given to the campaign organizer to be used as intended, unless specified otherwise.",
    },
    {
      title: "How Do I Edit or Update My Campaign?",
      content:
        "To edit or update your campaign, log in to your account, navigate to your campaign dashboard, and select 'Edit Campaign'. Make your changes and save them.",
    },
    {
      title: "Is There a Fee for Using This Platform?",
      content:
        "Our platform charges a small processing fee for each donation to cover payment processing costs. The fee details are clearly outlined during the donation process.",
    },
    {
      title: "How Can I Share a Campaign?",
      content:
        "You can share a campaign by using the social media sharing buttons on the campaign page or by copying the campaign link and sharing it via email or other platforms.",
    },
    {
      title: "What Is the Refund Policy for Donations?",
      content:
        "Donations are generally non-refundable. However, if you believe a mistake was made, please contact our support team for assistance.",
    },
  ];

  const faqOutput = faqs.map((item, i) => (
    <li key={i} className="faq-item">
      <div
        className="faq-question"
        onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}>
        <h4>{item.title}</h4>
        {activeFAQ === i ? <FaMinus /> : <FaPlus />}
      </div>
      <p className={`faq-answer ${activeFAQ === i && "active-p"}`}>
        {item.content}
      </p>
    </li>
  ));

  return (
    <section className="faq">
      <SEOComponent />

      <h3>Frequently Asked Questions</h3>
      <ul>{faqOutput}</ul>
    </section>
  );
};

export default FAQComponent;