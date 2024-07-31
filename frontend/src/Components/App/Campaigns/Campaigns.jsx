import { useEffect, useState } from "react";
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

  // State to track the selected category
  const [selectedCategory, setSelectedCategory] = useState("");

  // Function to filter campaigns based on the selected category
  const filterCampaigns = (campaigns) => {
    if (!campaigns) return [];
    if (selectedCategory === "" || selectedCategory === "All") {
      return campaigns; // Return all campaigns if "All" or no category is selected
    }
    return campaigns.filter(
      (campaign) => campaign.category === selectedCategory
    );
  };

  const filteredCampaignData = filterCampaigns(activeCampaignData);

  const fundRaiseOutput = Array.isArray(activeCampaignData)
    ? filteredCampaignData?.map((item) => (
        <CampaignList item={item} key={item._id} />
      ))
    : [];

  // get all campaigns category
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const categoriesOutput = categories.map((item) => (
    <option value={item} key={item}>
      {item}
    </option>
  ));

  return (
    <div className="campaigns">
      {/* SEO */}
      <SEOComponent title="Helping Hands | Discover Campaigns to donate to" />

      <div>
        <h1>Discover Amazing Campaigns to Donate to</h1>
        <p>Help Others achieve their goals</p>
      </div>

      <div>
        <p>Sort by category</p>
        <select onChange={handleCategoryChange}>
          <option value="">All</option>
          {categoriesOutput}
        </select>
      </div>

      {/* campaigns output */}
      {isActiveCampaignDataLoading ? (
        <PageLoader />
      ) : (
        <>
          {filteredCampaignData && filteredCampaignData.length > 0 ? (
            <ul>{fundRaiseOutput}</ul>
          ) : (
            <>No campaign posted in this category yet</>
          )}
        </>
      )}
    </div>
  );
};

export default Campaigns;
