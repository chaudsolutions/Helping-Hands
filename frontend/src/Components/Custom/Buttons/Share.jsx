import PropTypes from "prop-types";
// react share
import {
  FaFacebookF,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaTelegram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  PinterestShareButton,
} from "react-share";

const Share = ({ domain }) => {
  const link = domain[0];
  const title = `Check out my campaign ${domain[1]} and kindly donate to my cause, every penny is appreciated! Click below link to get more insights`;
  const image = domain[2];

  return (
    <div className="share">
      <span>Share:</span>
      <div>
        <FacebookShareButton url={link} title={title} image={image}>
          <FaFacebookF size={30} style={{ color: "blue" }} />
        </FacebookShareButton>
        <TwitterShareButton url={link} title={title} image={image}>
          <FaXTwitter size={30} style={{ color: "brown" }} />
        </TwitterShareButton>
        <PinterestShareButton url={link} title={title} image={image}>
          <FaPinterest size={30} style={{ color: "orangered" }} />
        </PinterestShareButton>
        <LinkedinShareButton url={link} title={title} image={image}>
          <FaLinkedin size={30} style={{ color: "blue" }} />
        </LinkedinShareButton>
        <TelegramShareButton url={link} title={title} image={image}>
          <FaTelegram size={30} style={{ color: "rgb(111, 111, 255)" }} />
        </TelegramShareButton>
        <WhatsappShareButton url={link} title={title} image={image}>
          <FaWhatsapp size={30} style={{ color: "green" }} />
        </WhatsappShareButton>
        <RedditShareButton url={link} title={title} image={image}>
          <FaReddit size={30} style={{ color: "orangered" }} />
        </RedditShareButton>
      </div>
    </div>
  );
};

Share.propTypes = {
  domain: PropTypes.array.isRequired,
};

export default Share;
