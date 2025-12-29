import React, {useEffect, useState, useRef} from "react";
import FundingCard from "./cards/CampaignCard.jsx";
import {useApi} from "../api/apiClient.js";
import NoItemsDisplay from "./cards/NoItemsDisplay.jsx";

export default function CampaignList() {
    const fetchedRef = useRef(false);
    const api = useApi();

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [campaigns, setCampaigns] = useState([]);
    const [categories, setCategories] = useState([]);

    const fetchDashboardData = async () => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const resCat = await api("/categories", {method: "GET"});
        const resCam = await api("/projects", {method: "GET"});

        setCategories(resCat);
        setCampaigns(resCam);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const filteredCampaigns =
        selectedCategory === "All"
            ? campaigns
            : campaigns.filter(
                (c) => c.categoryId === selectedCategory
            );

    return (
        <div className="w-full lg:mx-8">
            <div className="flex items-center mb-6">
                <span className="text-2xl font-semibold mr-6">
                  Browse Campaigns
                </span>
                <select
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:outline-nonefocus:ring-2 focus:ring-purple-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>

                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            {filteredCampaigns.length === 0 && <NoItemsDisplay/>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCampaigns.length > 0 && filteredCampaigns.map((c) => (
                    <FundingCard
                        key={c._id}
                        id={c._id}
                        title={c.name}
                        description={c.description}
                        goal={c.goalAmount}
                        status={c.currentAmount}
                    />
                ))}
            </div>
        </div>
    );
}