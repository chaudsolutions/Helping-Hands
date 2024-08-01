import { useState } from "react";
import PropTypes from "prop-types";
import { FaMinus, FaPlus } from "react-icons/fa6";
import "./qa.css";

const QAComponent = ({ itemArray }) => {
  const faqs = itemArray[0];

  const [activeFAQ, setActiveFAQ] = useState(null);

  const itemOutput = faqs.map((item, i) => (
    <li key={i} className="faq-item">
      <div
        className="faq-question"
        onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}>
        <h4>{item.title}</h4>
        {activeFAQ === i ? <FaMinus /> : <FaPlus />}
      </div>
      <p className={`faq-answer ${activeFAQ === i && "active-p"}`}>
        {item.content}
      </p>
    </li>
  ));

  return <ul className="qa-c">{itemOutput}</ul>;
};

QAComponent.propTypes = {
  itemArray: PropTypes.array,
};

export default QAComponent;
