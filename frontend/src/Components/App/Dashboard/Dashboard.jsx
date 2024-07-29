import { useQuery } from "@tanstack/react-query";
import SEOComponent from "../../SEO/SEO";
import { fetchUser, fetchUserCampaignDoc } from "../../Hooks/useFetch";
import Verify from "./verify/Verify";
import PageLoader from "../../Animations/PageLoader";
import "./dashboard.css";
import { Link } from "react-router-dom";
import CampaignList from "../../Custom/ItemList/CampaignList";
import Clock from "../../Custom/Clock/Clock";
import useResponsive from "../../Hooks/useResponsive";
import { IoIosAddCircleOutline } from "react-icons/io";
import Logout from "../../Custom/Buttons/Logout";

const Dashboard = () => {
  const isMobile = useResponsive();

  // fetch user data and campaign data
  const {
    data: userData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user"], // Use the new object-based syntax
    queryFn: fetchUser,
  });

  const { data: campaignData, isLoading: isCampaignDataLoading } = useQuery({
    queryKey: ["campaigns"], // Use the new object-based syntax
    queryFn: fetchUserCampaignDoc,
  });

  // extract data
  const { active, name } = userData || {};

  const { campaigns } = campaignData || {};

  // map campaigns into DOM
  const campaignList = campaigns?.map((campaign) => (
    <CampaignList key={campaign._id} item={campaign} />
  ));

  // display logout btn if fetch fail
  if (isError) {
    return (
      <div>
        <h1>Error fetching data, please try logout and login again</h1>
        <Logout />
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* SEO */}
      <SEOComponent />

      {/* display if account is not active */}
      {isLoading ? (
        <PageLoader />
      ) : (
        !active && <Verify verifyProps={[{ refetch }]} />
      )}

      {/* main dashboard */}
      {active && (
        <>
          <div className="dashboard-greet">
            <div>
              <Clock userProp={[name]} />
              <h1>Welcome to Your Dashboard</h1>
            </div>
            <Link to="/new/campaign">
              {!isMobile && <span>Ask for Helping Hands</span>}
              <IoIosAddCircleOutline size={30} />
            </Link>
          </div>

          <div className="campaigns">
            <h3>Your Campaigns</h3>

            {isCampaignDataLoading ? (
              <PageLoader />
            ) : (
              <>
                {campaigns && campaigns.length > 0 && <ul>{campaignList}</ul>}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
