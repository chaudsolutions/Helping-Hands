import { Link } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import { AuthContainer } from "../../Custom/Nav/NavSlide";

const Hero = () => {
  const { user } = useAuthContext();

  return (
    <header className="hero">
      <div>
        <h1>HelpWithFund</h1>
        <p>
          Get help,
          <br /> Help Others
        </p>
      </div>
      {user ? (
        <div className="dash-a">
          <Link to="/dashboard">Dashboard</Link>
        </div>
      ) : (
        <AuthContainer userProp={[]} />
      )}
    </header>
  );
};

export default Hero;
