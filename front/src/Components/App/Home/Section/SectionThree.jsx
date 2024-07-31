// react count up
import CountUp from "react-countup";
import { FaPlus } from "react-icons/fa6";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

const SectionThree = () => {
  const { ref: ref1, inView: inView1 } = useInView({
    threshold: 1.0,
    triggerOnce: true,
  });

  return (
    <section className="section-three">
      <div className="impact">
        <div>
          <h2>Be The Part Of FundRaisers With Over</h2>

          <div ref={ref1} className="count-container">
            {inView1 && (
              <>
                <CountUp end={217924} duration={3} delay={0.5} />
                <FaPlus />
              </>
            )}
          </div>

          <h2>People From Around The World Joined</h2>
        </div>

        <Link to="/create/campaign">Join HelpingHands Now!</Link>
      </div>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </section>
  );
};

export default SectionThree;
