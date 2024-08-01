import { useEffect } from "react";
import SEOComponent from "../../SEO/SEO";
import Article from "./Article";
import Hero from "./Hero";
import "./home.css";

const Home = () => {
  // scroll up
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

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
