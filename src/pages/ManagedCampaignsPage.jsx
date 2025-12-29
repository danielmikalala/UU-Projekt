import React from "react";
import GoBackButton from "../components/buttons/GoBackButton.jsx";
import ManagedCampaignList from "../components/lists/ManagedCampaignList.jsx";

export default function ManagedCampaignsPage() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-10">
            <GoBackButton/>
            <h3 className="text-2xl font-semibold mr-6">Managed Campaigns</h3>

            <ManagedCampaignList/>
        </div>
    );
}
