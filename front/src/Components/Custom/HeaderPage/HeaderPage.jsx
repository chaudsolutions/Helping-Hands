import PropTypes from "prop-types";

import "./headPage.css";

const HeaderPage = ({ page }) => {
  return (
    <div className="head-page">
      <h1>{page}</h1>
    </div>
  );
};

HeaderPage.propTypes = {
  page: PropTypes.string.isRequired,
};

export default HeaderPage;
