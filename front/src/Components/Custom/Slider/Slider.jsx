import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import "./slider.css";
import PropTypes from "prop-types";

const Slider = ({ itemData }) => {
  const itemArray = itemData[0];

  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()]);

  return (
    <div className="embla-slider" ref={emblaRef}>
      <ul className="embla__container">
        {itemArray.map((item) => (
          <li key={item}>
            <img src={item} loading="lazy" />
          </li>
        ))}
      </ul>
    </div>
  );
};

Slider.propTypes = {
  itemData: PropTypes.array,
};

export default Slider;
