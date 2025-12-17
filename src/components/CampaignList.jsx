/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import FundingCard from "./cards/CampaignCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../api/apiClient.js";
export default function CampaignList() {
  const fetchedRef = React.useRef(false);
  const { token } = useAuth();
  const api = useApi();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [campaigns, setCampaigns] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchDashboardData = async () => {
    if (fetchedRef.current) return [categories, campaigns];
    fetchedRef.current = true;

    const resCat = await api("/categories", { method: "GET" });
    const resCam = await api("/projects", { method: "GET" });

    console.log("Fetched categories and campaigns:", resCat, resCam);

    return [await resCat, await resCam];

    /*
        const resCat = await fetch(`/categories`, {  //todo: use later - categories not implemented yet on BE
            method: "GET",
            headers: {"Content-Type": "application/json", 'Authorization': `Bearer ${token}`},
        });
         const resCam = await fetch(`/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return [await resCat.json(), await resCam.json()]; //Todo: return[await resCat.json(), await resCam.json()]
  */
  };

  useEffect(() => {
    fetchDashboardData().then((data) => {
      setCategories(data[0]);
      setCampaigns(data[1]);
    });
  }, []);

  const filteredCampaigns =
    selectedCategory === "All"
      ? campaigns
      : campaigns.filter((c) => c.category.includes(selectedCategory));
  return (
    <div className="w-full lg:mx-8">
      <div className="flex items-center mb-6">
        <span className="text-2xl font-semibold mr-6">Browse Campaigns</span>

        <select
          className="
                        border border-gray-300
                        rounded-lg
                        px-4 py-2
                        text-gray-700
                        shadow-sm
                        focus:outline-none
                        focus:ring-2 focus:ring-purple-500
                    "
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div
        className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
            "
      >
        {filteredCampaigns.map((c, index) => (
          <FundingCard
            key={index}
            id={c._id}
            title={c.name}
            description={c.description}
            goal={c.goalAmount}
            status={c.goalAmount / 2} //Todo: change to actual state
          />
        ))}
      </div>
    </div>
  );
}
