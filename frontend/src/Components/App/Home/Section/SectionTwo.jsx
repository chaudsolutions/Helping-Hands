import { useQuery } from "@tanstack/react-query";
import CampaignList from "../../../Custom/ItemList/CampaignList";
import { fetchActiveCampaigns } from "../../../Hooks/useFetch";
import PageLoader from "../../../Animations/PageLoader";

const SectionTwo = () => {
  const { data: campaignData, isLoading: isCampaignDataLoading } = useQuery({
    queryKey: ["campaigns"], // Use the new object-based syntax
    queryFn: fetchActiveCampaigns,
  });

  const fundRaiseOutput = campaignData?.map((item) => {
    return <CampaignList item={item} key={item._id} />;
  });

  return (
    <section className="section-one">
      <div>
        <h2>Urgent Fundraising!</h2>
        <p>
          Time is of the essence! Join our mission NOW to make an immediate
          impact. Every second counts
        </p>
      </div>

      {isCampaignDataLoading ? <PageLoader /> : <ul>{fundRaiseOutput}</ul>}
    </section>
  );
};

export default SectionTwo;
