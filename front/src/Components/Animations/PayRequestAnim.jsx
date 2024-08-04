import Lottie from "lottie-web";
import animation from "../../LottieFiles/payRequest.json";
import { useEffect, useRef } from "react";

const PayRequestAnim = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current = Lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animation,
    });

    // Clean up the animation when the component unmounts
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, []);

  return <div className="animation" ref={containerRef}></div>;
};

export default PayRequestAnim;
