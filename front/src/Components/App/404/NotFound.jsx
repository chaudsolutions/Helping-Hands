import { useNavigate } from "react-router-dom";
import "./notfound.css";
import Null from "../../Animations/Null";
import { useEffect } from "react";

const NotFound = () => {
  // scroll up
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="not-found">
      <h1>Page Not Found</h1>

      <Null />

      <div>
        <strong>{window.location.href}</strong>
        <p>Sorry, the page you are looking for does not exist.</p>

        <button onClick={goHome}>Go back to Home</button>
      </div>
    </div>
  );
};

export default NotFound;
