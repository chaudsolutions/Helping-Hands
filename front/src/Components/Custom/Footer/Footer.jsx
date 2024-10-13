import { Link } from "react-router-dom";
import { Logo } from "../Nav/Nav";
import "./footer.css";
import { useActiveCampaignData } from "../../Hooks/useQueryFetch/useQueryData";
import ButtonLoad from "../../Animations/ButtonLoad";
import Socials from "./Socials";

const Footer = () => {
  const { activeCampaignData, isActiveCampaignDataLoading } =
    useActiveCampaignData();

  const campaignsOutput = Array.isArray(activeCampaignData)
    ? activeCampaignData?.slice(0, 3).map((item) => (
        <li key={item._id}>
          <Link to={`/campaign/${item._id}`}>{item.campaignName}</Link>
        </li>
      ))
    : [];

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
            {isActiveCampaignDataLoading ? (
              <ButtonLoad />
            ) : (
              <>{activeCampaignData && campaignsOutput}</>
            )}
          </ul>
          <ul>
            <li>Help</li>
            <li>
              <Link to="/frequently-asked-questions">FAQ</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy-Policy</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact Us</Link>
            </li>
          </ul>
          <ul>
            <li>Company</li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/help-center">Help Center</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="line"></div>

      <div>
        <p>
          HelpWithFundInc.2023
          <br />
          All rights reserved
        </p>

        <Socials />
      </div>
    </footer>
  );
};

export default Footer;
