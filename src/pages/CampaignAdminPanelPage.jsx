import React, { useState} from "react";
import {useParams} from "react-router-dom";
import GoBackButton from "../components/buttons/GoBackButton.jsx";
import CreateCampaignUpdatePostForm from "../components/forms/CreateCampaignUpdatePostForm.jsx";

const TABS = [
    {id: "edit", label: "Edit details"},
    {id: "update", label: "Post Update"},
    {id: "qa", label: "Questions"},
];

export default function CampaignAdminPanelPage() {
    const [activeTab, setActiveTab] = useState("edit");
    const {id} = useParams();
    return (
        <>
            <div className="mx-auto w-full max-w-7xl px-4 py-10">
                <GoBackButton/>
                <h3 className="text-2xl font-semibold mr-6">
                    Managed Campaign {id}
                </h3>
                <div className="mt-8 flex flex-wrap gap-2">
                    {TABS.map((tab) => {
                        const isActive = tab.id === activeTab;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                                    isActive
                                        ? "bg-gray-900 text-white shadow-sm"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {activeTab === "edit" && (
                    <section className="mt-8 space-y-6">
                        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Nothing there yet :) Under dev 👌
                            </h2>
                        </div>
                    </section>
                )}
                {activeTab === "update" && (
                    <section className="mt-8 space-y-6">
                            <CreateCampaignUpdatePostForm id={id}/>
                    </section>
                )}
                {activeTab === "qa" && (
                    <section className="mt-8 space-y-6">
                        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Nothing there yet :) Under dev 👌
                            </h3>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
