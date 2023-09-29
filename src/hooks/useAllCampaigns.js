import { useEffect, useState } from "react";
import useCampaignCount from "./useCampaignCount";
import { useConnection } from "../context/connection";
import {
  getCrowdfundContract,
  getCrowdfundContractWithProvider,
} from "../utils";
import { toast } from "react-toastify";

const useAllCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const { provider } = useConnection();
  const campaignNo = useCampaignCount();

  useEffect(() => {
    const fetchAllCampaigns = async () => {
      try {
        const contract = await getCrowdfundContract(provider, false);
        const campaignsKeys = Array.from(
          { length: Number(campaignNo) },
          (_, i) => i + 1
        );
        const campaignPromises = campaignsKeys.map((id) => contract.crowd(id));
        const contributorPromises = campaignsKeys.map((id) =>
          contract.getContributors(id)
        );

        const campaignResults = await Promise.all(campaignPromises);
        const contributorResults = await Promise.all(contributorPromises);

        const campaignDetails = campaignResults.map((details, index) => ({
          id: campaignsKeys[index],
          title: details.title,
          fundingGoal: details.fundingGoal,
          owner: details.owner,
          durationTime: Number(details.durationTime),
          isActive: details.isActive,
          fundingBalance: details.fundingBalance,
          contributors: contributorResults[index],
        }));
        setCampaigns(campaignDetails);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchAllCampaigns();
    // console.log(campaigns);
  }, [campaignNo, provider]);

  // Listen for event and update

  useEffect(() => {
    const updateCampaigns = (id, title, fundingGoal, duration) => {
      const newCampaign = {
        id,
        title,
        fundingGoal,
        durationTime: Number(duration),
        isActive: true,
        fundingBalance: 0,
        contributors: [],
      };
      const newCampaigns = [...campaigns, newCampaign];
      setCampaigns(newCampaigns);
    };

    const handleProposeCampaignEvent = (id, title, amount, duration) => {
      toast.info("new campaign 🔽");
      console.log(id, title, amount, duration);
      updateCampaigns(id, title, amount, duration);
    };
    const contract = getCrowdfundContractWithProvider(provider);
    contract.on("ProposeCampaign", handleProposeCampaignEvent);

    return () => {
      contract.off("ProposeCampaign", handleProposeCampaignEvent);
    };
  }, [campaigns, provider]);

  return campaigns;
};

export default useAllCampaigns;
