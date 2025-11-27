import React, { useMemo, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import PrimaryButton from "../buttons/PrimaryButton.jsx";
import CampaignsModal from "./CampaignsModal.jsx";

const STATUS_OPTIONS = ["Draft", "Active", "Completed", "Archived"];

const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    name: "Community gardens",
    status: "Active",
    description:
      "Help us expand the community garden to provide fresh produce for local families.",
    goalAmount: 12000,
    currentAmount: 4500,
    createdAt: "2024-04-02",
  },
  {
    id: 2,
    name: "Unicorn Mental Health Fund",
    status: "Draft",
    description:
      "Launching a fund to offer free counseling sessions during exam periods.",
    goalAmount: 10000000,
    currentAmount: 1,
    createdAt: "2024-03-15",
  },
];

const NEW_CAMPAIGN_TEMPLATE = {
  name: "",
  status: STATUS_OPTIONS[0],
  description: "",
  goalAmount: "",
  currentAmount: "",
  createdAt: new Date().toISOString().split("T")[0],
};

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [newCampaign, setNewCampaign] = useState(NEW_CAMPAIGN_TEMPLATE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const isAddDisabled = useMemo(() => {
    const trimmedName = newCampaign.name.trim();
    const trimmedDescription = newCampaign.description.trim();
    const goal = Number(newCampaign.goalAmount);

    return (
      !trimmedName ||
      !trimmedDescription ||
      Number.isNaN(goal) ||
      goal <= 0
    );
  }, [newCampaign]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setNewCampaign((prev) => ({
      ...prev,
      [field]: field.includes("Amount") ? value.replace(/[^\d.]/g, "") : value,
    }));
  };

  const handleAddCampaign = (event) => {
    event.preventDefault();
    if (isAddDisabled) return;

    const campaignToAdd = {
      id: Date.now(),
      name: newCampaign.name.trim(),
      status: newCampaign.status,
      description: newCampaign.description.trim(),
      goalAmount: Number(newCampaign.goalAmount),
      currentAmount: Number(newCampaign.currentAmount) || 0,
      createdAt: newCampaign.createdAt,
    };

    setCampaigns((prev) => [...prev, campaignToAdd]);
    setNewCampaign({
      ...NEW_CAMPAIGN_TEMPLATE,
      createdAt: new Date().toISOString().split("T")[0],
    });
  };

  const handleDeleteCampaign = (id) => {
    setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
  };

  const handleSaveCampaign = (updatedCampaign) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === updatedCampaign.id ? updatedCampaign : campaign,
      ),
    );
  };

  return (
    <>
      <section className="mt-8 space-y-6">
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Campaign
          </h2>
          <form
            className="mt-4 space-y-4"
            onSubmit={handleAddCampaign}
            autoComplete="off"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={handleInputChange("name")}
                  placeholder="Campaign Name"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={newCampaign.status}
                  onChange={handleInputChange("status")}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                value={newCampaign.description}
                onChange={handleInputChange("description")}
                placeholder="Share details about what this campaign will fund."
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Goal Amount
                </label>
                <input
                  type="number"
                  min="1"
                  value={newCampaign.goalAmount}
                  onChange={handleInputChange("goalAmount")}
                  placeholder="10000"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Current Amount
                </label>
                <input
                  type="number"
                  min="0"
                  value={newCampaign.currentAmount}
                  onChange={handleInputChange("currentAmount")}
                  placeholder="2500"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Created At
                </label>
                <input
                  type="date"
                  value={newCampaign.createdAt}
                  onChange={handleInputChange("createdAt")}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <PrimaryButton
                type={isAddDisabled ? "button" : "submit"}
                icon={<Plus className="h-4 w-4" strokeWidth={2} />}
                className={`${
                  isAddDisabled ? "pointer-events-none opacity-60" : ""
                } !bg-purple-600 !border-purple-600 hover:!bg-purple-700`}
              >
                Add Campaign
              </PrimaryButton>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-gray-900">
                    {campaign.name}
                  </p>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {campaign.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    Created {campaign.createdAt}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{campaign.description}</p>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">
                    ${campaign.currentAmount.toLocaleString()}
                  </span>{" "}
                  raised of ${campaign.goalAmount.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEditCampaign(campaign)}
                  aria-label={`Edit ${campaign.name}`}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCampaign(campaign.id)}
                  aria-label={`Delete ${campaign.name}`}
                  className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CampaignsModal
        campaign={editingCampaign}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCampaign}
        statusOptions={STATUS_OPTIONS}
      />
    </>
  );
}

