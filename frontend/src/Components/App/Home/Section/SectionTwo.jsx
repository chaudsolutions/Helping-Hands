import CampaignList from "../../../Custom/ItemList/CampaignList";
import PageLoader from "../../../Animations/PageLoader";
import { useActiveCampaignData } from "../../../Hooks/useQueryFetch/useQueryData";

const SectionTwo = () => {
  const { activeCampaignData = [], isActiveCampaignDataLoading } =
    useActiveCampaignData();

  const fundRaiseOutput = Array.isArray(activeCampaignData)
    ? activeCampaignData.map((item) => (
        <CampaignList item={item} key={item._id} />
      ))
    : [];

  return (
    <section className="section-one">
      <div>
        <h2>Urgent Fundraising!</h2>
        <p>
          Time is of the essence! Join our mission NOW to make an immediate
          impact. Every second counts
        </p>
      </div>

      {isActiveCampaignDataLoading ? (
        <PageLoader />
      ) : (
        <>{fundRaiseOutput && <ul>{fundRaiseOutput}</ul>}</>
      )}
    </section>
  );
};

export default SectionTwo;
