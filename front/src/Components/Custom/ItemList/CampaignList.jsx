import ProgressBar from "@ramonak/react-progress-bar";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { differenceInDays, differenceInHours } from "date-fns";
import { HiBadgeCheck } from "react-icons/hi";
import "./campaignList.css";
import { useAuthContext } from "../../Context/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import { serVer } from "../../Hooks/useVariable";

const CampaignList = ({ item }) => {
  const { user } = useAuthContext();

  const currentDate = new Date();

  // Calculate progress, days left, and expired status
  const progress = (item.amountRaised / item.amount) * 100;
  const daysLeft = differenceInDays(new Date(item.endDate), new Date());
  const active = daysLeft > 0;
  const expired = active ? <>{daysLeft} days left</> : <>expired</>;

  // calculate created ago days and hours
  const createdAgoDays = differenceInDays(
    currentDate,
    new Date(item.createdAt)
  );
  const createdAgoHours = differenceInHours(
    currentDate,
    new Date(item.createdAt)
  );

  // TODO: write a function that updates the campaign when its expired
  useEffect(() => {
    if (!active) {
      const deactivateCampaign = async () => {
        const url = `${serVer}/api/expired-campaign/${item._id}`;

        try {
          await axios.put(url);
        } catch (error) {
          console.log(error.response.data);
        }
      };
      deactivateCampaign();
    }
  }, [active, item]);

  return (
    <li className="fundRaise-li">
      <Link to={`/campaign/${item._id}`}>
        <img src={item.image} alt={item.campaignName} />
        <h4>
          {item.creatorRole === "admin" && (
            <HiBadgeCheck size={25} className="icon" />
          )}
          {item.campaignName}
        </h4>

        <ProgressBar completed={parseInt(progress)} className="progressBar" />

        {user && (
          <p>
            Created {createdAgoDays > 0 && createdAgoDays + " days"}{" "}
            {createdAgoHours < 24 && createdAgoHours + "hrs"} Ago
          </p>
        )}

        <div>
          <div>
            ${item.amountRaised?.toLocaleString()} of $
            {item.amount?.toLocaleString()}
          </div>

          <div>{expired}</div>
        </div>
      </Link>
    </li>
  );
};

CampaignList.propTypes = {
  item: PropTypes.object.isRequired,
};

export default CampaignList;
