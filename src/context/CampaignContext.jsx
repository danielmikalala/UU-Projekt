import { createContext, useState } from "react";

const CampaignContext = createContext(null);

export function CampaignProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);

  const addCampaign = (campaignData) => {
    const newCampaign = {
      id: Date.now(), // Simple ID generation for now
      ...campaignData,
      status: "PendingApproval",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCampaigns((prev) => [...prev, newCampaign]);
    return newCampaign;
  };

  const updateCampaignStatus = (campaignId, newStatus) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === campaignId
          ? {
              ...campaign,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : campaign,
      ),
    );
  };

  const getCampaignById = (campaignId) => {
    return campaigns.find((campaign) => campaign.id === campaignId);
  };

  const getPendingCampaigns = () => {
    return campaigns.filter(
      (campaign) => campaign.status === "PendingApproval",
    );
  };

  const value = {
    campaigns,
    addCampaign,
    updateCampaignStatus,
    getCampaignById,
    getPendingCampaigns,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
}

// Export context for use in hooks
export { CampaignContext };
