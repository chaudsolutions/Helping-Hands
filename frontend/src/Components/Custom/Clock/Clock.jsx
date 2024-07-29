import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Clock = ({ userProp }) => {
  const name = userProp[0];
  const [clock, setClock] = useState("");

  useEffect(() => {
    const time = new Date();
    let hour = time.getHours();
    let min = time.getMinutes();

    if (min < 60 && hour < 12) {
      setClock("Good Morning");
    } else if (min < 60 && hour < 16) {
      setClock("Good Day");
    } else if (min < 60 && hour < 24) {
      setClock("Good Evening");
    }
  }, []);

  return (
    <h2 className="clock">
      {clock}, {name}
    </h2>
  );
};

Clock.propTypes = {
  userProp: PropTypes.array.isRequired,
};

export default Clock;
