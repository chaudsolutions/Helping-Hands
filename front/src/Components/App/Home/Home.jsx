import SEOComponent from "../../SEO/SEO";
import Article from "./Article";
import Hero from "./Hero";
import "./home.css";

const Home = () => {
  return (
    <div className="home">
      {/* define meta with react helmet */}
      <SEOComponent />

      <Hero />

      <Article />
    </div>
  );
};

export default Home;
