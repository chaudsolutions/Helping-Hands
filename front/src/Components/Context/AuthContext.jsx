import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

// Create an AuthContext with default value
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const [user, setUser] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("helpingHandsUser")
      : null
  );
  // const [isLoading, setIsLoading] = useState(true);

  // Function to log in a user
  const login = (userData) => {
    setUser(userData);
    // Optionally store the token in local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("helpingHandsUser", JSON.stringify(userData));
    }
  };

  // Function to log out a user
  const logout = () => {
    setUser(null);
    // Clear user data from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("helpingHandsUser");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuthContext = () => {
  return useContext(AuthContext);
};
