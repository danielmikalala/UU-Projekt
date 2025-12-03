import { useContext } from "react";
import { CampaignContext } from "../context/CampaignContext.jsx";

export function useCampaigns() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaigns must be used within a CampaignProvider");
  }
  return context;
}
