import React, {useState} from "react";
import FundingCard from "./cards/CampaignCard.jsx";

const mockCategories = ["Education", "General", "Technology", "Kids"] // TODO: replace mock data by API call later - for demo reason
const mockCampaigns = [ // TODO: replace mock data by API call later - for demo reason
    {
        id: 1,
        category: [mockCategories[1]],
        name: "Potrebuji Monster",
        description: "Ahoj, muj kamos student mikes potrebuje hondne monsteru. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        goal: 50,
        withdraw: 8,
    },
    {
        id: 2,
        category: [mockCategories[0]],
        name: "Pomoc pro Studenta",
        description: "Student potrebuje podporu pro studium a zivotni naklady. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        goal: 120,
        withdraw: 45,
    },
    {
        id: 3,
        category: [mockCategories[2]],
        name: "Novy Notebook",
        description: "Sbirejeme na novy notebook pro programovani. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        goal: 9000,
        withdraw: 220,
    },     {
        id: 4,
        category: [mockCategories[2]],
        name: "Novy Server pro vyvoj AI",
        description: "Sbirejeme na novy server pro projekt ktery pomuze hledat na snimcich rakovinotvorne nadory. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        goal: 9000,
        withdraw: 220,
    }
];


export default function CampaignList() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredCampaigns =
        selectedCategory === "All"
            ? mockCampaigns
            : mockCampaigns.filter((c) => c.category.includes(selectedCategory));
    return (
        <div className="w-full lg:mx-8">
            <div className="flex items-center mb-6">
                <span className="text-2xl font-semibold mr-6">
                    Browse Campaigns
                </span>

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
                    {mockCategories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>
            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
            ">
                {filteredCampaigns.map((c) => (
                    <FundingCard
                        key={c.id}
                        id={c.id}
                        title={c.name}
                        description={c.description}
                        goal={c.goal}
                        status={c.withdraw}
                    />
                ))}
            </div>
        </div>
    );
}
