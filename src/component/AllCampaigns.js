import useAllCampaigns from "../hooks/useAllCampaigns";
import Campaign from "./Campaign";

const AllCampaigns = () => {
  const campaigns = useAllCampaigns();
  // console.log("css", campaigns[27].contributors);

  return (
    <div className="flex flex-wrap justify-center gap-10 px-5 py-10">
      {!!campaigns &&
        campaigns.map((campaign, index) => (
          <Campaign
            key={index}
            campaign={campaign}
            contributors={campaign?.contributors}
          />
        ))}
    </div>
  );
};

export default AllCampaigns;
