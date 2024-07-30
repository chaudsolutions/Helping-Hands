import { createContext, useContext } from "react";
import PropTypes from "prop-types";

const URLContext = createContext();

export const URLProvider = ({ children, url }) => {
  return <URLContext.Provider value={url}>{children}</URLContext.Provider>;
};

URLProvider.propTypes = {
  children: PropTypes.node.isRequired,
  url: PropTypes.string.isRequired,
};

export const useURL = () => {
  const context = useContext(URLContext);
  if (context === undefined) {
    throw new Error("useURL must be used within a URLProvider");
  }
  return context;
};
