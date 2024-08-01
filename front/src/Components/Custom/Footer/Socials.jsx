import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import "./socials.css";

const Socials = () => {
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

  return <ul className="socials">{socialsOutput}</ul>;
};

export default Socials;
