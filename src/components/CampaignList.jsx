import React from "react";
import FundingCard from "./cards/CampaignCard.jsx";


const mockCampaigns = [ // TODO: replace mock data by API call later - for demo reason
    {
        id: 1,
        name: "Potrebuji Monster",
        description: "Ahoj, muj kamos student mikes potrebuje hondne monsteru. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        goal: 50,
        withdraw: 8,
    },
    {
        id: 2,
        name: "Pomoc pro Studenta",
        description: "Student potrebuje podporu pro studium a zivotni naklady. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        goal: 120,
        withdraw: 45,
    },
    {
        id: 3,
        name: "Novy Notebook",
        description: "Sbirejeme na novy notebook pro programovani. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        goal: 9000,
        withdraw: 220,
    }
];

export default function CampaignList() {
    return (
        <div className="w-full lg:mx-8">
            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
            ">
                {mockCampaigns.map((c) => (
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
