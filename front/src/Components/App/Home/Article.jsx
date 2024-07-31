import Footer from "../../Custom/Footer/Footer";
import SectionOne from "./Section/SectionOne";
import SectionThree from "./Section/SectionThree";
import SectionTwo from "./Section/SectionTwo";
import "./Section/section.css";

const Article = () => {
  return (
    <article className="article">
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <Footer />
    </article>
  );
};

export default Article;
