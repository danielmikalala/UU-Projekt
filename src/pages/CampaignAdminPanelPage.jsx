import React, { useState } from "react";
import { useParams } from "react-router-dom";

import GoBackButton from "../components/buttons/GoBackButton.jsx";
import CreateCampaignUpdatePostForm from "../components/forms/CreateCampaignUpdatePostForm.jsx";
import ProjectUpdateForm from "../components/adminPanel/ProjectUpdateForm.jsx";

const TABS = [
  { id: "edit", label: "Edit details" },
  { id: "update", label: "Post Update" },
  { id: "qa", label: "Questions" },
];

export default function CampaignAdminPanelPage() {
  const [activeTab, setActiveTab] = useState("edit");
  const { id } = useParams();

  // 🔹 MOCK hodnoty pro formulář – dokud neběží backend
  const initialValues = {
    title: "Potřebuji Monster",
    description:
      "Ahoj,\n\nmůj kámoš student Mikes...\nPotřebuje hodně monsteru...\nProsím o support, jinak mě to položí a bez něj neudělá žádnou práci...",
    category: "Health",
    goalAmount: 50,
  };

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <GoBackButton />
        <h3 className="text-2xl font-semibold mr-6">Manage Campaign {id}</h3>

        {/* Taby */}
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

        {/* ---------- EDIT DETAILS TAB ---------- */}
        {activeTab === "edit" && (
          <section className="mt-8 space-y-6">
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Campaign Details
              </h2>

              {/* 🔥 ProjectUpdateForm teď dostává campaignId + initialValues */}
              <ProjectUpdateForm
                campaignId={id}
                initialValues={initialValues}
              />
            </div>
          </section>
        )}

        {/* ---------- POST UPDATE TAB ---------- */}
        {activeTab === "update" && (
          <section className="mt-8 space-y-6">
            <CreateCampaignUpdatePostForm id={id} />
          </section>
        )}

        {/* ---------- QUESTIONS TAB ---------- */}
        {activeTab === "qa" && (
          <section className="mt-8 space-y-6">
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">
                Questions (coming soon) 🙂
              </h3>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
