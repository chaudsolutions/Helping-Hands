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
import { useEffect, useState } from "react";
import Null from "../../Animations/Null";

const Dashboard = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const [view, setView] = useState("notFullySetCampaigns");

  const isMobile = useResponsive();

  // fetch user data and campaign data
  const { userData, isUserDataLoading, isUserDataError, refetchUserData } =
    useUserData();

  const { campaignData, isCampaignDataLoading } = useUserCampaignData();

  // extract data
  const { active, name, balance } = userData || {};

  const { campaigns } = campaignData || {};

  // sort campaigns
  const notFullySetCampaigns = campaigns?.filter(
    (campaign) => campaign.condition === "incomplete"
  );
  const activeCampaigns = campaigns?.filter(
    (campaign) => campaign.condition === "in-progress"
  );
  const completedCampaigns = campaigns?.filter(
    (campaign) => campaign.condition === "completed"
  );
  const cashedCampaigns = campaigns?.filter(
    (campaign) => campaign.condition === "cashed"
  );

  // count campaigns
  const totalNotFullySetCampaigns = notFullySetCampaigns?.length || 0;
  const totalActiveCampaigns = activeCampaigns?.length || 0;
  const totalCompletedCampaigns = completedCampaigns?.length || 0;
  const totalCashedCampaigns = cashedCampaigns?.length || 0;

  // Get filtered campaigns based on selected sub-view using if-else
  let filteredCampaigns = [];
  if (view === "notFullySetCampaigns") {
    filteredCampaigns = notFullySetCampaigns;
  } else if (view === "activeCampaigns") {
    filteredCampaigns = activeCampaigns;
  } else if (view === "completedCampaigns") {
    filteredCampaigns = completedCampaigns;
  }

  // map campaigns into DOM
  const campaignList = filteredCampaigns
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.map((campaign) => <CampaignList key={campaign._id} item={campaign} />);

  // display logout btn if fetch fail
  if (isUserDataError) {
    return (
      <div className="not-found">
        <h1>Session Expired?</h1>

        <Null />

        <div>
          <strong>Logout and restart your session</strong>
          <Logout />
        </div>
      </div>
    );
  }

  // display email verification box
  if (!isUserDataLoading && userData && !active) {
    return <Verify verifyProps={[{ refetchUserData }]} />;
  }

  return (
    <div className="dashboard">
      {/* SEO */}
      <SEOComponent />

      {isUserDataLoading && (
        <div className="loader-container">
          <PageLoader />
        </div>
      )}

      {/* main dashboard */}

      <div className="dashboard-greet">
        <div>
          <div>
            Balance: <strong>${balance}</strong>
          </div>
          <Clock userProp={[name]} />
          <h1>Welcome to Your Dashboard</h1>
        </div>
        <Link to="/new/campaign">
          {!isMobile && <span>Ask for Helping Hands</span>}
          <IoIosAddCircleOutline size={30} />
        </Link>
      </div>

      <div className="campaigns-ul">
        <div className="switch-buttons">
          <button
            onClick={() => setView("notFullySetCampaigns")}
            className={view === "notFullySetCampaigns" ? "activeBtn" : ""}>
            Incomplete Details ({totalNotFullySetCampaigns})
          </button>
          <button
            onClick={() => setView("activeCampaigns")}
            className={view === "activeCampaigns" ? "activeBtn" : ""}>
            Active Campaigns ({totalActiveCampaigns})
          </button>
          <button
            onClick={() => setView("completedCampaigns")}
            className={view === "completedCampaigns" ? "activeBtn" : ""}>
            Completed Campaigns ({totalCompletedCampaigns})
          </button>
          <button
            onClick={() => setView("cashedCampaigns")}
            className={view === "cashedCampaigns" ? "activeBtn" : ""}>
            Cashed in Campaigns ({totalCashedCampaigns})
          </button>
        </div>

        <h3>Your Campaigns</h3>

        {isCampaignDataLoading ? (
          <div className="loader-container">
            <PageLoader />
          </div>
        ) : (
          <>
            {campaigns && campaignList.length > 0 ? (
              <>
                <p>
                  {view === "notFullySetCampaigns" &&
                    "Update the image of your campaign to make it active and allow it be seen by donors"}

                  {view === "activeCampaigns" &&
                    "Your active campaigns can be seen by visitors and can accepts donations..."}

                  {view === "completedCampaigns" &&
                    "Completed Campaigns are campaigns that have met their goals or the creator ended it or they have elapsed their 30days duration... You can cash-out this campaigns and the balance will be added to your account balance"}

                  {view === "cashedCampaigns" &&
                    "Cashed Campaigns are campaigns that the earnings has been withdrawn to your balance"}
                </p>

                <ul>{campaignList}</ul>
              </>
            ) : (
              <div className="null">
                No Campaign Created Yet
                <Null />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
