import React from "react";
import CampaignList from "../components/CampaignList.jsx";

export default function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to CrowdFund.</p>
        <div className="flex justify-center">
            <CampaignList/>
        </div>

    </div>
  );
}
