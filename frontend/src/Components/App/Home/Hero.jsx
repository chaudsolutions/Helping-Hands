import { AuthContainer } from "../../Custom/Nav/NavSlide";

const Hero = () => {
  return (
    <header className="hero">
      <div>
        <h1>Helping Hands</h1>
        <p>
          Get help,
          <br /> Help Others
        </p>
      </div>
      <AuthContainer userProp={[]} />
    </header>
  );
};

export default Hero;
