import { useEffect, useState } from "react";
import "./viewCampaigns.css";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSingleCampaign, fetchUser } from "../../Hooks/useFetch";
import SEOComponent from "../../SEO/SEO";
import { useAuthContext } from "../../Context/AuthContext";
import ProgressBar from "@ramonak/react-progress-bar";
import { differenceInDays, differenceInHours } from "date-fns";
import Share from "../../Custom/Buttons/Share";
import { HiBadgeCheck } from "react-icons/hi";
import PageLoader from "../../Animations/PageLoader";
import paystackLogo from "../../../assets/images/payments/paystack-logo.png";
import flutterWaveLogo from "../../../assets/images/payments/FlutterwaveLogo.png";
import stripeLogo from "../../../assets/images/payments/stripe.png";
import safeCheckoutLogo from "../../../assets/images/payments/guaranteed-safe-checkout.png";
import toast from "react-hot-toast";
import usePaystackPayment from "../../Hooks/usePaystack";
import useFlutterWavePayment from "../../Hooks/useFlutterWave";
import useCurrencyConversion from "../../Hooks/useCurrencyConversion";
import ButtonLoad from "../../Animations/ButtonLoad";
import ReadMoreArea from "@foxeian/react-read-more";
import { FaUser } from "react-icons/fa6";
import { BsFlagFill } from "react-icons/bs";
import { MdDeleteForever, MdFeedback } from "react-icons/md";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  useActiveCampaignData,
  useUserData,
} from "../../Hooks/useQueryFetch/useQueryData";
import CampaignList from "../../Custom/ItemList/CampaignList";
import axios from "axios";
import { serVer } from "../../Hooks/useVariable";

const paymentOptionsArray = [
  {
    name: "Paystack",
    image: paystackLogo,
  },
  {
    name: "Flutterwave",
    image: flutterWaveLogo,
  },
  {
    name: "Stripe",
    image: stripeLogo,
  },
];

const ViewCampaign = () => {
  useEffect(() => {
    window.scroll(0, 0);
    setClient(true);
    setLink(window.location.href);
  }, []);

  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()]);

  const [donorEmail, setDonorEmail] = useState("");
  const [currency, setCurrency] = useState("");
  const [amountToDonate, setAmountToDonate] = useState(0);
  const [paymentOptions, setPaymentOptions] = useState(false);
  const [client, setClient] = useState(false);
  const [link, setLink] = useState("");
  const [deleteBtn, setDeleteBtn] = useState(
    <>
      Delete <MdDeleteForever />
    </>
  );

  // fetch item from DB with params
  const params = useParams();

  const { campaignId } = params;

  const { user } = useAuthContext();

  const navigate = useNavigate();

  // paystack hook
  const { handlePayment, loading } = usePaystackPayment();
  // use flutterWave hook
  const { initiatePayment } = useFlutterWavePayment();
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
  const { _id } = userData || {};
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
  const daysLeft = differenceInDays(new Date(endDate), new Date(createdAt));
  const active = daysLeft > 0;
  const expired = active ? <>{daysLeft} days left</> : <>expired</>;

  // calculate created ago days and hours
  const createdAgoDays = differenceInDays(currentDate, new Date(createdAt));
  const createdAgoHours = differenceInHours(currentDate, new Date(createdAt));

  // map payment options into DOM
  const paymentOptionsList = paymentOptionsArray.map((item, i) => {
    // function to donate
    const donateFunc = (paymentOption) => {
      if (amountToDonate <= 0) {
        return toast.error("Please provide amount");
      }
      if (!donorEmail) {
        return toast.error("Please provide email");
      }
      if (isLoading) {
        return toast.error("Please try again later");
      }

      if (paymentOption === "Paystack") {
        if (currency !== "NGN") {
          return toast.error("Only NGN is supported");
        }

        handlePayment({
          amountToDonate,
          convertedBalance,
          currency,
          donorEmail,
          refetch,
          campaignId,
        });
      }
      if (paymentOption === "Flutterwave") {
        initiatePayment({
          convertedBalance,
          currency,
          donorEmail,
          refetch,
          campaignId,
        });
      }
      if (paymentOption === "Stripe") {
        console.log("Stripe");
      }
    };

    return (
      <li key={i} onClick={() => donateFunc(item.name)}>
        <img src={item.image} alt={item.name} height="40" />
      </li>
    );
  });

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
    setDeleteBtn(<ButtonLoad />);

    const userConfirmed = confirm(
      "Are you sure you want to delete this Campaign?"
    );

    if (userConfirmed) {
      const url = `${serVer}/`;
      try {
        const res = await axios.delete();
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

  return (
    <div className="view-Campaign">
      <SEOComponent title={campaignName} description={story} image={image} />

      {isCampaignDataLoading && <PageLoader />}

      <div className="campaign-details">
        <img src={image} />
        <div>
          <h1>
            {ifAdmin && <HiBadgeCheck size={25} className="icon" />}{" "}
            {campaignName}
          </h1>
          {client && (
            <ProgressBar completed={progress} className="progressBar" />
          )}

          <div className="campaign-details-b1">
            <p>
              ${amountRaised} of ${amount} goal
            </p>
            <p>{expired}</p>
          </div>

          <p>
            Created {createdAgoDays > 0 && createdAgoDays + ` day(s),`}{" "}
            {createdAgoHours < 24 && createdAgoHours + `hrs`} ago by{" "}
            {user && !isUserDataLoading && creatorOfCampaign ? (
              <>You</>
            ) : (
              creator
            )}
          </p>

          <strong>{category}</strong>

          <Share domain={[link, campaignName, image]} />

          {/* donate BTN */}
          <div className="donate">
            <input
              type="number"
              placeholder="Amount in USD"
              onChange={(e) => setAmountToDonate(e.target.value)}
            />
            <select onChange={(e) => setCurrency(e.target.value)}>
              <option value="USD">USD (US Dollar)</option>
              <option value="GBP">GBP (Pound)</option>
              <option value="NGN">NGN (Naira)</option>
            </select>
            <button onClick={() => setPaymentOptions(!paymentOptions)}>
              Donate Now
            </button>
          </div>

          {paymentOptions && (
            <div className="paymentOptions">
              <input
                type="email"
                placeholder="Your Email"
                onChange={(e) => setDonorEmail(e.target.value)}
              />
              {loading ? <ButtonLoad /> : <ul>{paymentOptionsList}</ul>}
            </div>
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
          <HiBadgeCheck size={25} className="icon" /> This Campaign is created
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
        {donors && donors.length ? (
          <ul>{donorsList}</ul>
        ) : (
          <p>
            No donors yet! Share your campaign link to your family and friends
            to help you achieve your goals
          </p>
        )}
      </div>

      <div className="feedback">
        <button>
          <MdFeedback />
          <span>Submit Review or Feedback</span>
        </button>
        <button>
          <BsFlagFill />
          <span>Report Campaign</span>
        </button>
      </div>

      <div className="others">
        <h3>Discover Other Amazing Campaigns</h3>

        <div className="embla" ref={emblaRef}>
          {isActiveCampaignDataLoading ? (
            <PageLoader />
          ) : (
            <ul className="embla__container">
              {activeCampaignData.length > 0 &&
                activeCampaignData?.map((item) => (
                  <CampaignList item={item} key={item._id} />
                ))}
            </ul>
          )}
        </div>
        <ul></ul>
      </div>

      {ifAdmin && (
        <div className="delete">
          <h3>Delete this Fundraiser Campaign ?</h3>
          <p>
            This action cannot be undone. Are you sure you want to delete this
            campaign?
          </p>

          <button onClick={() => deleteCampaign()}>{deleteBtn}</button>
        </div>
      )}
    </div>
  );
};

export default ViewCampaign;
