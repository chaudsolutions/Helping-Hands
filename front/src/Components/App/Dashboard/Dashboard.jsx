import SEOComponent from "../../SEO/SEO";
import Verify from "./verify/Verify";
import PageLoader from "../../Animations/PageLoader";
import "./dashboard.css";
import { Link } from "react-router-dom";
import CampaignList from "../../Custom/ItemList/CampaignList";
import Clock from "../../Custom/Clock/Clock";
import useResponsive from "../../Hooks/useResponsive";
import { IoIosAddCircleOutline } from "react-icons/io";
import Logout from "../../Custom/Buttons/Logout";
import {
  useUserCampaignData,
  useUserData,
} from "../../Hooks/useQueryFetch/useQueryData";

const Dashboard = () => {
  const isMobile = useResponsive();

  // fetch user data and campaign data
  const { userData, isUserDataLoading, isUserDataError, refetchUserData } =
    useUserData();

  const { campaignData, isCampaignDataLoading } = useUserCampaignData();

  // extract data
  const { active, name } = userData || {};

  const { campaigns } = campaignData || {};

  // map campaigns into DOM
  const campaignList = campaigns
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.map((campaign) => <CampaignList key={campaign._id} item={campaign} />);

  // display logout btn if fetch fail
  if (isUserDataError) {
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
      {isUserDataLoading ? (
        <PageLoader />
      ) : (
        !active && <Verify verifyProps={[{ refetchUserData }]} />
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
                {campaigns && campaigns.length > 0 ? (
                  <ul>{campaignList}</ul>
                ) : (
                  <>No Campaign Created Yet</>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
