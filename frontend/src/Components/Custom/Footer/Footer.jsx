import { Link } from "react-router-dom";
import { Logo } from "../Nav/Nav";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import "./footer.css";

const Footer = () => {
  const campaigns = [
    {
      name: "School Fees",
    },
    {
      name: "Global Warming",
    },
  ];
  const campaignsOutput = campaigns.slice(0, 3).map((item, i) => (
    <li key={i}>
      <Link>{item.name}</Link>
    </li>
  ));

  // socials
  const socials = [
    {
      name: "Instagram",
      icon: <FaInstagram />,
      link: "",
    },
    {
      name: "Facebook",
      icon: <FaFacebook />,
      link: "",
    },
    {
      name: "Twitter",
      icon: <FaXTwitter />,
      link: "",
    },
    {
      name: "Linkedin",
      icon: <FaLinkedin />,
      link: "",
    },
  ];
  const socialsOutput = socials.map((item, i) => (
    <li key={i}>
      <a href={item.link}>
        {item.icon}
        <span>{item.name}</span>
      </a>
    </li>
  ));

  return (
    <footer className="footer">
      <div>
        <div>
          <Logo navigate={null} />
          <div className="elevate">
            Elevating Experience & <br />
            Seize Control Of Your Life
          </div>
        </div>
        <div>
          <ul>
            <li>Donate</li>
            {campaignsOutput}
          </ul>
          <ul>
            <li>Help</li>
            <li>
              <Link to="/frequently-asked-questions">FAQ</Link>
            </li>
            <li>
              <Link>Privacy-Policy</Link>
            </li>
            <li>
              <Link>Contact Us</Link>
            </li>
          </ul>
          <ul>
            <li>Company</li>
            <li>
              <Link>About Us</Link>
            </li>
            <li>
              <Link>Services</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="line"></div>

      <div>
        <h6>
          HelpingHandsInc.2023
          <br />
          All rights reserved
        </h6>

        <ul>{socialsOutput}</ul>
      </div>
    </footer>
  );
};

export default Footer;
