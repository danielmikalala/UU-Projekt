import React, {useEffect, useState, useRef} from "react";
import FundingCard from "../cards/CampaignCard.jsx";
import {useApi} from "../../api/apiClient.js";
import NoItemsDisplay from "../cards/NoItemsDisplay.jsx";

export default function ManagedCampaignList() {
    const fetchedRef = useRef(false);
    const api = useApi();

    const [selectedPending, setSelectedPending] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    const fetchDashboardData = async () => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        const resCam = await api("/projects/my-projects/all", {method: "GET"});
        setCampaigns(resCam);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const filteredPendingCampaigns = campaigns.filter(c => c.status === "PendingApproval");
    const filteredApprovedCampaigns = campaigns.filter(c => c.status === "Approved");

    return (
        <>
            <div className="m-4 flex flex-wrap gap-2">
                <button
                    onClick={() => {
                        setSelectedPending(false);
                    }}
                    className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                        !selectedPending
                            ? "bg-gray-900 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    Approved({filteredApprovedCampaigns.length})
                </button>
                <button
                    onClick={() => {
                        setSelectedPending(true);
                    }}
                    className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                        selectedPending
                            ? "bg-gray-900 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    Pending({filteredPendingCampaigns.length})
                </button>
            </div>
            {!selectedPending && <div className="w-full lg:mx-8">
                {filteredApprovedCampaigns.length === 0 && <NoItemsDisplay/>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredApprovedCampaigns.length > 0 && filteredApprovedCampaigns.map((c, index) => (
                        <FundingCard
                            key={index}
                            id={c._id}
                            title={c.name}
                            description={c.description}
                            goal={c.goalAmount}
                            status={c.currentAmount}
                            manageable
                        />
                    ))}
                </div>
            </div>}

            {selectedPending && <div className="w-full lg:mx-8">
                {filteredPendingCampaigns.length === 0 && <NoItemsDisplay/>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPendingCampaigns.length > 0 && filteredPendingCampaigns.map((c, index) => (
                        <FundingCard
                            key={index}
                            id={c._id}
                            title={c.name}
                            description={c.description}
                            goal={c.goalAmount}
                            status={c.currentAmount}
                            manageable
                        />
                    ))}
                </div>
            </div>
            }
        </>

    );
}