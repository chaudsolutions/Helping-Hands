import { useNavigate } from "react-router-dom";
import "./notfound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="not-found">
      <button onClick={goHome}>Go back to Home</button>
    </div>
  );
};

export default NotFound;
