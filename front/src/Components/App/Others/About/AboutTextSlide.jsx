import { LuShieldCheck } from "react-icons/lu";
import { RiTeamLine } from "react-icons/ri";
import { PiFediverseLogo } from "react-icons/pi";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay } from "swiper/modules";
import useResponsive from "../../../Hooks/useResponsive";

const AboutTextSlide = () => {
  const isMobile = useResponsive();

  const points = [
    {
      name: "Trusted by 217,000+ people",
      icon: <LuShieldCheck size={40} />,
      content:
        "Spark joy by sharing your cause and the positive impact it brings. Clearly express how contributions will make a meaningful difference",
    },
    {
      name: "Crowdfunding, helping people achieve their goals",
      icon: <RiTeamLine size={40} />,
      content:
        "Leverage the speed of social media and online networks. Share your fundraising campaign swiftly across various platforms",
    },
    {
      name: "Built for individuals and businesses",
      icon: <PiFediverseLogo size={40} />,
      content:
        "Build a strong social network around your cause. Encourage supporters to share the campaign within their local communities",
    },
  ];

  //   map and display regularly for desktop view
  const pointsOutput = points.map((item, i) => (
    <li key={i} className="points-Li">
      {item.icon}
      <h4>{item.name}</h4>
      <p>{item.content}</p>
    </li>
  ));

  return (
    <section className="about-one">
      <div>
        <h2>Why HelpWithFund?</h2>
        <p>These are key reasons why HelpWithFund is a unique platform</p>
      </div>

      {/* desktop view */}
      {!isMobile ? (
        <ul>{pointsOutput}</ul>
      ) : (
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          navigation={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
          }}
          modules={[Autoplay]}
          className="mySwiper">
          {points.map((item, i) => (
            <SwiperSlide key={i} className="swiperSlide">
              <div className="points-Li">
                {item.icon}
                <h4>{item.name}</h4>
                <p>{item.content}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default AboutTextSlide;
