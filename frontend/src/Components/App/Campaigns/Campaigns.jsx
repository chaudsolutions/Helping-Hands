import { useEffect } from "react";
import { categories } from "../../Hooks/useVariable";
import SEOComponent from "../../SEO/SEO";
import "./campaigns.css";
import { useActiveCampaignData } from "../../Hooks/useQueryFetch/useQueryData";
import CampaignList from "../../Custom/ItemList/CampaignList";
import PageLoader from "../../Animations/PageLoader";

const Campaigns = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const { activeCampaignData, isActiveCampaignDataLoading } =
    useActiveCampaignData();

  const fundRaiseOutput = Array.isArray(activeCampaignData)
    ? activeCampaignData?.map((item) => (
        <CampaignList item={item} key={item._id} />
      ))
    : [];

  const categoriesOutput = categories.map((item, i) => (
    <option value={i} key={item}>
      {item}
    </option>
  ));

  return (
    <div className="campaigns">
      {/* SEO */}
      <SEOComponent title="Helping Hands | Discover Campaigns to donate to" />

      <h1>Discover Amazing Campaigns to Donate to</h1>
      <p>Help Others achieve their goals</p>

      <div>
        <p>Sort by category</p>
        <select>{categoriesOutput}</select>
      </div>

      {/* campaigns output */}
      {isActiveCampaignDataLoading ? (
        <PageLoader />
      ) : (
        <>{activeCampaignData && <ul>{fundRaiseOutput}</ul>}</>
      )}
    </div>
  );
};

export default Campaigns;
