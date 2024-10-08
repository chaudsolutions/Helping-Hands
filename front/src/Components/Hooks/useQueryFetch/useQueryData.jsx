import { useQuery } from "@tanstack/react-query";
import {
  fetchActiveCampaigns,
  fetchUser,
  fetchUserCampaignDoc,
  fetchUsers,
} from "../useFetch";
import { useAuthContext } from "../../Context/AuthContext";

// fetch user campaigns data
export const useUserCampaignData = () => {
  const { data: campaignData, isLoading: isCampaignDataLoading } = useQuery({
    queryKey: ["userCampaigns"], // Use the new object-based syntax
    queryFn: fetchUserCampaignDoc,
  });

  return { campaignData, isCampaignDataLoading };
};

// fetch active campaigns
export const useActiveCampaignData = () => {
  const { data: activeCampaignData, isLoading: isActiveCampaignDataLoading } =
    useQuery({
      queryKey: ["activeCampaigns"], // Use the new object-based syntax
      queryFn: fetchActiveCampaigns,
    });

  return { activeCampaignData, isActiveCampaignDataLoading };
};

// fetch user details
export const useUserData = () => {
  const { user } = useAuthContext();

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: ["user"], // Use the new object-based syntax
    queryFn: fetchUser,
    enabled: !!user,
  });

  return { userData, isUserDataLoading, isUserDataError, refetchUserData };
};

// fetch all users details
export const useAllUsersData = () => {
  const { user } = useAuthContext();

  const {
    data: allUsersData,
    isLoading: isAllUsersDataLoading,
    isError: isAllUsersDataError,
    refetch: refetchAllUsersData,
  } = useQuery({
    queryKey: ["allUsers"], // Use the new object-based syntax
    queryFn: fetchUsers,
    enabled: !!user,
  });

  return {
    allUsersData,
    isAllUsersDataLoading,
    isAllUsersDataError,
    refetchAllUsersData,
  };
};
