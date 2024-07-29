import { useQuery } from "@tanstack/react-query";
import { fetchActiveCampaigns, fetchUserCampaignDoc } from "../useFetch";

export const useUserCampaignData = () => {
  const { data: campaignData, isLoading: isCampaignDataLoading } = useQuery({
    queryKey: ["userCampaigns"], // Use the new object-based syntax
    queryFn: fetchUserCampaignDoc,
    enabled: typeof window !== "undefined",
  });

  return { campaignData, isCampaignDataLoading };
};

export const useActiveCampaignData = () => {
  const { data: activeCampaignData, isLoading: isActiveCampaignDataLoading } =
    useQuery({
      queryKey: ["activeCampaigns"], // Use the new object-based syntax
      queryFn: fetchActiveCampaigns,
      enabled: typeof window !== "undefined",
    });

  return { activeCampaignData, isActiveCampaignDataLoading };
};
