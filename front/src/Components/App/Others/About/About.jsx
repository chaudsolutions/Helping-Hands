import { Link } from "react-router-dom";
import SEOComponent from "../../../SEO/SEO";
import "./about.css";
import imageOne from "../../../../assets/images/slider/one.png";
import imageTwo from "../../../../assets/images/slider/two.png";
import imageThree from "../../../../assets/images/slider/three.png";
import imageFour from "../../../../assets/images/slider/four.png";
import Slider from "../../../Custom/Slider/Slider";

const About = () => {
  const imagesObj = [imageOne, imageTwo, imageThree, imageFour];

  return (
    <div className="about">
      <SEOComponent title="Helping Hands | About" />

      <Slider itemData={[imagesObj]} />

      <div className="about-intro">
        <h1>The Number One Platform for getting help and helping others</h1>
        <Link>Get Started</Link>
      </div>

      <div>
        <h2>Why Helping Hands?</h2>
        <ul>
          <li>Trusted by 10,000+ people</li>
          <li>Crowdfunding, helping people achieve their goals</li>
          <li>Built for individuals and businesses</li>
        </ul>
      </div>

      <div>
        <h2>How It Works</h2>
        <ul>
          <li>Choose a campaign</li>
          <li>Contribute your funds</li>
          <li>Receive donations and updates</li>
        </ul>
      </div>

      <div>
        <h2>Help Others</h2>
        <ul>
          <li>Find financial help</li>
          <li>Offer financial advice</li>
          <li>Help others in need</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
