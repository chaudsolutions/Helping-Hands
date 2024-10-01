import { useEffect, useState } from "react";
import "./viewCampaigns.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSingleCampaign } from "../../Hooks/useFetch";
import SEOComponent from "../../SEO/SEO";
import { useAuthContext } from "../../Context/AuthContext";
import ProgressBar from "@ramonak/react-progress-bar";
import { differenceInDays, differenceInHours } from "date-fns";
import Share from "../../Custom/Buttons/Share";
import { HiBadgeCheck } from "react-icons/hi";
import PageLoader from "../../Animations/PageLoader";
import safeCheckoutLogo from "../../../assets/images/payments/guaranteed-safe-checkout.png";
import toast from "react-hot-toast";
import useCurrencyConversion from "../../Hooks/useCurrencyConversion";
import ButtonLoad from "../../Animations/ButtonLoad";
import ReadMoreArea from "@foxeian/react-read-more";
import { FaUser } from "react-icons/fa6";
import { BsFlagFill } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  useActiveCampaignData,
  useUserData,
} from "../../Hooks/useQueryFetch/useQueryData";
import CampaignList from "../../Custom/ItemList/CampaignList";
import axios from "axios";
import { currencyArray, serVer, token } from "../../Hooks/useVariable";
import { GiMoneyStack } from "react-icons/gi";
import Null from "../../Animations/Null";
import { CiCamera } from "react-icons/ci";
import useStripeCheckout from "../../Hooks/useStripe";
import usePaystackPayment from "../../Hooks/usePaystack";

const ViewCampaign = () => {
  // get current url
  const link = window.location.href;
  const url = window.location.origin;

  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()]);
  const { initiateCheckout, isStripeLoading } = useStripeCheckout();

  const [donorEmail, setDonorEmail] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [amountToDonate, setAmountToDonate] = useState(0);
  const [deleteBtn, setDeleteBtn] = useState(
    <>
      Delete <MdDeleteForever />
    </>
  );
  const [cashOutBtn, setCashOutBtn] = useState(
    <>
      CashOut <GiMoneyStack size={20} />
    </>
  );
  const [imageLoading, setImageLoading] = useState(false);

  // fetch item from DB with params
  const params = useParams();

  const { campaignId } = params;

  const { user } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    window.scroll(0, 0);
  }, [campaignId]);

  // paystack hook
  const { handlePayment, loading } = usePaystackPayment();

  // amount conversation hook
  const { convertedBalance, isLoading } = useCurrencyConversion({
    amountToDonate,
    currency,
  });

  // fetch logged in user
  const { userData, isUserDataLoading, isUserDataError } = useUserData();

  const {
    data: campaignData,
    isLoading: isCampaignDataLoading,
    refetch,
  } = useQuery({
    queryKey: [{ campaignId }],
    queryFn: () => fetchSingleCampaign(campaignId),
    enabled: !!campaignId,
  });

  // fetch active campaigns
  const { activeCampaignData, isActiveCampaignDataLoading } =
    useActiveCampaignData();

  // extract data from fetched results
  const { _id, role } = userData || {};
  const {
    amount,
    amountRaised,
    campaignName,
    category,
    condition,
    createdAt,
    creatorRole,
    creator,
    creatorId,
    endDate,
    image,
    story,
    donors,
  } = campaignData || {};

  const ifAdmin = creatorRole === "admin";

  // navigate home if error
  if (isUserDataError) return navigate("/");

  // check if creator of campaign when logged in
  const creatorOfCampaign = user && creatorId === _id;

  // Calculate progress, days left, and expired status
  const currentDate = new Date();

  const progress = (amountRaised / amount) * 100;
  const daysLeft = differenceInDays(new Date(endDate), currentDate);
  const active = new Date(endDate) >= currentDate;
  const expired = active ? <>{daysLeft} days left</> : <>expired</>;

  // calculate created ago days and hours
  const createdAgoDays = differenceInDays(currentDate, new Date(createdAt));
  const createdAgoHours = differenceInHours(currentDate, new Date(createdAt));

  // function to donate
  const donateFunc = async () => {
    if (amountToDonate <= 0) {
      return toast.error("Please provide amount");
    }
    if (!donorEmail) {
      return toast.error("Please provide email");
    }
    if (isLoading) {
      return toast.error("Please try again later");
    }

    // paystack
    if (currency === "NGN") {
      handlePayment({
        paymentType: "Donation",
        amountToDonate,
        convertedBalance,
        currency,
        donorEmail,
        refetch,
        campaignId,
      });
    }

    // stripe
    if (currency !== "NGN") {
      initiateCheckout({
        paymentType: "Donation",
        amount: convertedBalance,
        currency,
        donorEmail,
        campaignId,
        url,
      });
    }
  };

  // map donors into DOM
  const donorsList = donors
    ?.sort((a, b) => new Date(b.date) - new Date(a.date))
    ?.map((donor) => (
      <li key={donor._id} className="donor">
        <FaUser size={20} />
        <div>
          <p>{donor.name}</p>
          <p>${donor.amountUSD}</p>
        </div>
      </li>
    ));

  // function to delete campaign
  const deleteCampaign = async () => {
    const userConfirmed = confirm(
      "Are you sure you want to delete this Campaign?. This action is irreversible"
    );

    if (userConfirmed) {
      setDeleteBtn(<ButtonLoad />);

      const url = `${serVer}/user/delete-campaign/${campaignId}`;
      try {
        const res = await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // navigate back to campaign
        navigate(-1 || "/dashboard");
        toast.success(res.data);
      } catch (error) {
        toast.error(error.response.data);
      } finally {
        {
          setDeleteBtn(
            <>
              Delete <MdDeleteForever />
            </>
          );
        }
      }
    }
  };

  // cash-out campaign
  const cashOutCampaign = async () => {
    const userConfirmed = confirm(
      "Are you sure you want to cash out this campaign? This action is irreversible"
    );
    if (userConfirmed) {
      setCashOutBtn(<ButtonLoad />);
      const url = `${serVer}/user/cash-out/${campaignId}`;

      try {
        const res = await axios.put(
          url,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { data } = res;

        refetch();

        toast.success(data);
      } catch (error) {
        toast.error(error.response.data);
      } finally {
        setCashOutBtn(
          <>
            CashOut <GiMoneyStack size={20} />
          </>
        );
      }
    }
  };

  // function to update profile picture
  const handleCampaignImage = async (e) => {
    setImageLoading(true);
    const files = Array.from(e.target.files);

    const formData = new FormData();
    formData.append("campaignImage", files[0]);

    try {
      const url = `${serVer}/user/campaign-image/${campaignId}`;
      const response = await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response;

      toast.success(data);
      refetch();
    } catch (error) {
      console.error(error); // Log the error to see what went wrong
      toast.error(error.response?.data || "An error occurred");
    } finally {
      setImageLoading(false);
    }
  };

  if ((!creatorOfCampaign || !ifAdmin) && condition === "cashed") {
    return (
      <div className="cash-out-message">
        <Null />
        <h1>This campaign has been closed</h1>
        <p>Thank you for your support.</p>

        <Link to="/campaigns">Check Other Campaigns</Link>
        <Link to="/">Home</Link>
      </div>
    );
  }

  if (isCampaignDataLoading) {
    return (
      <div className="loader-container">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="view-Campaign">
      <SEOComponent title={campaignName} description={story} image={image} />

      <div className="campaign-details">
        <div>
          {image ? (
            <img src={image} />
          ) : (
            <label htmlFor="campaignImage">
              <>
                <p>Click Here to add an image to your campaign</p>
                {imageLoading ? <ButtonLoad /> : <CiCamera size={50} />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCampaignImage}
                  style={{ display: "none" }}
                  id="campaignImage"
                />
              </>
            </label>
          )}
        </div>
        <div>
          <h1>
            {ifAdmin && <HiBadgeCheck size={25} className="icon" />}{" "}
            {campaignName}
          </h1>

          <ProgressBar
            completed={Math.round(progress)}
            className="progressBar"
          />

          <div className="campaign-details-b1">
            <p>
              ${amountRaised.toLocaleString()} of ${amount.toLocaleString()}{" "}
              goal
            </p>
            <p>{expired}</p>
          </div>

          <p>
            Created {createdAgoDays > 0 && createdAgoDays + ` day(s)`}{" "}
            {createdAgoHours < 24 && createdAgoHours + `hrs`} ago by{" "}
            {user && !isUserDataLoading && creatorOfCampaign ? (
              <>You</>
            ) : (
              creator
            )}
          </p>

          <strong>{category}</strong>

          {/* condition */}
          <p>
            This Campaign is: <strong>{condition}</strong>
          </p>
          <p></p>

          <Share domain={[link, campaignName, image]} />

          {/* donate BTN */}
          {condition !== "completed" && (
            <>
              <div className="donate">
                <input
                  type="number"
                  placeholder="Amount in USD"
                  onChange={(e) => setAmountToDonate(e.target.value)}
                />
                <select onChange={(e) => setCurrency(e.target.value)}>
                  {currencyArray.map((currency, i) => (
                    <option key={i} value={currency.currency}>
                      {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="paymentOptions">
                <input
                  type="email"
                  placeholder="Your Email"
                  onChange={(e) => setDonorEmail(e.target.value)}
                />
                <button
                  onClick={donateFunc}
                  style={{ backgroundColor: isStripeLoading && "black" }}>
                  {isStripeLoading || loading ? (
                    <ButtonLoad />
                  ) : (
                    <>Donate Now</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <img
        src={safeCheckoutLogo}
        alt="safe-checkout"
        className="safe-checkout"
      />
      {ifAdmin && (
        <div className="admin-vet">
          <HiBadgeCheck size={25} className="icon" /> This Campaign was created
          by the admin and is safe and trusted to donate
        </div>
      )}

      <div>
        <h3>Story</h3>

        <ReadMoreArea
          lettersLimit={10} // limit of letters (100 letters)
        >
          {story}
        </ReadMoreArea>
      </div>

      <div className="creator-div">
        <h3>Organizer</h3>

        <div>
          <FaUser size={30} />
          <h2>{ifAdmin ? "The Admin" : creator}</h2>
        </div>
      </div>

      <div className="donors-div">
        <h3>Donors</h3>
        {donors && donors.length > 0 ? (
          <ul>{donorsList}</ul>
        ) : (
          <p>
            No donors yet! Share your campaign link to your family and friends
            to help you achieve your goals
          </p>
        )}
      </div>

      <div className="feedback">
        <button onClick={() => toast.error("Report Submitted")}>
          <BsFlagFill />
          <span>Report Campaign</span>
        </button>
      </div>

      <div className="others">
        <h3>Discover Other Amazing Campaigns</h3>

        {isActiveCampaignDataLoading ? (
          <div className="loader-container">
            <PageLoader />
          </div>
        ) : (
          <div className="embla" ref={emblaRef}>
            <ul className="embla__container">
              {activeCampaignData.length > 0 &&
                activeCampaignData?.map((item) => (
                  <CampaignList item={item} key={item._id} />
                ))}
            </ul>
          </div>
        )}
      </div>

      {/* cash-out campaign when completed */}
      {campaignData &&
        creatorOfCampaign &&
        (condition === "completed" || condition === "cashed") && (
          <div className="delete">
            <h3>Cash Out</h3>
            <p>
              Your campaign has reached its goal and you have successfully
              raised the required amount. You can now proceed to cash out your
              donations.
              <br />
              <strong>NOTE:</strong> 10% will be deducted for contributions to
              the platform growth
            </p>

            {condition === "completed" && (
              <button onClick={cashOutCampaign} className="cashOutBtn">
                {cashOutBtn}
              </button>
            )}
          </div>
        )}

      {((campaignData && creatorOfCampaign) || role === "admin") &&
        donors.length < 1 && (
          <div className="delete">
            <h3>Delete this Fundraiser Campaign ?</h3>
            <p>
              This action cannot be undone. Are you sure you want to delete this
              campaign?
            </p>

            <button onClick={() => deleteCampaign()} className="deleteBtn">
              {deleteBtn}
            </button>
          </div>
        )}
    </div>
  );
};

export default ViewCampaign;
