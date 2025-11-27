import React from "react";
import GoBackButton from "../components/buttons/GoBackButton.jsx";
import PrimaryButton from "../components/buttons/PrimaryButton.jsx";

export default function ManagedCampaignsPage() {
    return (
        <>
            <div className="mx-auto w-full max-w-7xl px-4 py-10">
                <GoBackButton/>
                <h3 className="text-2xl font-semibold mr-6">
                    Managed Campaigns
                </h3>
                <p>In dev. Coming soon!</p>
                <a href="/campaign-admin/666"><PrimaryButton>Go to managed campaign</PrimaryButton></a>
            </div>
        </>
    );
}
