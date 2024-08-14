import { Link } from "react-router-dom";
import SEOComponent from "../../../SEO/SEO";
import "./about.css";
import { useAuthContext } from "../../../Context/AuthContext";
import AboutTextSlide from "./AboutTextSlide";
import { MdOutlineCampaign } from "react-icons/md";
import { GiCoins } from "react-icons/gi";
import { FaDonate } from "react-icons/fa";
import { useEffect } from "react";
import HeaderPage from "../../../Custom/HeaderPage/HeaderPage";

const About = () => {
  // scroll up
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const { user } = useAuthContext();

  return (
    <div className="about">
      <SEOComponent title="Helping Hands | About" />

      <HeaderPage page="About" />

      <div>
        <div className="about-intro">
          <h1>The Number One Platform for getting help and helping others</h1>
          <Link to={user ? "/new/campaign" : "/create/campaign"}>
            Get Started
          </Link>
        </div>

        <div className="about-paragraphs">
          <p>
            Welcome to Helping Hands, your trusted partner in crowdfunding,
            launched in 2023. Our mission is to empower individuals and
            communities by providing a platform where dreams and causes can come
            to life through the collective power of giving.
          </p>

          <p>
            At Helping Hands, we believe in the potential of every person to
            make a difference. Whether you&apos;re looking to fund a personal
            project, support a charitable cause, or help a friend in need, our
            platform is designed to connect you with a global network of
            compassionate supporters. We make it easy for you to share your
            story, set your goals, and achieve the support you need to succeed.
          </p>

          <p>
            Since our inception, we&apos;ve been committed to transparency,
            integrity, and innovation. Our user-friendly interface, secure
            transactions, and dedicated support team ensure that both
            fundraisers and donors have a seamless experience. We are proud to
            be a part of numerous success stories that have transformed lives
            and communities around the world.
          </p>

          <p>
            Join us on this journey to create positive change. Together, we can
            turn aspirations into reality and lend a helping hand to those who
            need it most.
          </p>

          <p>Thank you for being a part of the Helping Hands community.</p>
        </div>

        <AboutTextSlide />

        <div className="how-it-works">
          <h2>How It Works</h2>
          <ul>
            <li>
              <MdOutlineCampaign size={45} />
              Choose a campaign
            </li>
            <li>
              <GiCoins size={45} />
              Contribute your funds
            </li>
            <li>
              <FaDonate size={45} />
              Receive donations and updates
            </li>
          </ul>
        </div>

        <div className="help-others">
          <h2>Help Others</h2>
          <ul>
            <li>
              <Link to="/create/campaign">Find financial help</Link>
            </li>
            <li>
              <Link to="/donate">Help others in need</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
