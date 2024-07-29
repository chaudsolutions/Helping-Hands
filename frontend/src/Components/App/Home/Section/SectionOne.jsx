import { GiOpenChest } from "react-icons/gi";
import { IoMdFlash } from "react-icons/io";
import { FaEarthAmericas } from "react-icons/fa6";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay } from "swiper/modules";

import useResponsive from "../../../Hooks/useResponsive";

const SectionOne = () => {
  const isMobile = useResponsive();

  const points = [
    {
      name: "Ignite Impact",
      icon: <GiOpenChest size={50} />,
      content:
        "Spark joy by sharing your cause and the positive impact it brings. Clearly express how contributions will make a meaningful difference",
    },
    {
      name: "Spread The Word",
      icon: <IoMdFlash size={50} />,
      content:
        "Leverage the speed of social media and online networks. Share your fundraising campaign swiftly across various platforms",
    },
    {
      name: "Ignite Impact",
      icon: <FaEarthAmericas size={50} />,
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
    <section className="section-one">
      <div>
        <h2>Fund, Fast As flash</h2>
        <p>
          Fundraiser at the speed of thought! Elevate your cause in just a
          minute with our lightning-fast fundraising platform
        </p>
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

export default SectionOne;
