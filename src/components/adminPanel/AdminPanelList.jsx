import React, { useMemo, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import PrimaryButton from "../buttons/PrimaryButton.jsx";
import AdminPanelModal from "./AdminPanelModal.jsx";
import ProjectApprovalPanel from "./ProjectApprovalPanel.jsx";
import { useCampaigns } from "../../hooks/useCampaigns.js";

const TABS = [
  { id: "campaigns", label: "Campaigns" },
  { id: "categories", label: "Categories" },
  { id: "users", label: "Users" },
];

const INITIAL_CATEGORIES = [
  { id: 1, name: "Technology", slug: "Innovate with technology" },
  { id: 2, name: "Health", slug: "Support healthcare initiatives" },
  { id: 3, name: "Education", slug: "Expand access to education" },
  { id: 4, name: "Community", slug: "Build stronger communities" },
  { id: 5, name: "Environment", slug: "Protect our environment" },
];

export default function AdminPanelList() {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { campaigns } = useCampaigns();

  const isAddDisabled = useMemo(
    () => newCategoryName.trim().length === 0,
    [newCategoryName],
  );

  const handleAddCategory = (event) => {
    event.preventDefault();
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      return;
    }

    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const alreadyExists = categories.some((category) => category.slug === slug);

    if (alreadyExists) {
      setNewCategoryName("");
      return;
    }

    setCategories((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: trimmedName,
        slug,
      },
    ]);
    setNewCategoryName("");
  };

  const handleDeleteCategory = (id) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = (updatedCategory) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category,
      ),
    );
  };

  return (
    <>
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

      {activeTab === "categories" && (
        <section className="mt-8 space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Category
            </h2>
            <form
              className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
              onSubmit={handleAddCategory}
            >
              <input
                type="text"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="Category name"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <PrimaryButton
                type={isAddDisabled ? "button" : "submit"}
                icon={<Plus className="h-4 w-4" strokeWidth={2} />}
                className={`${isAddDisabled ? "pointer-events-none opacity-60" : ""} !bg-purple-600 !border-purple-600 hover:!bg-purple-700`}
              >
                Add
              </PrimaryButton>
            </form>
          </div>

          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-5 py-4 shadow-sm"
              >
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {category.name}
                  </p>
                  <p className="text-sm text-gray-500">{category.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditCategory(category)}
                    aria-label={`Edit ${category.name}`}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.id)}
                    aria-label={`Delete ${category.name}`}
                    className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "campaigns" && (
        <section className="mt-8 space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Campaign Management
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Review and approve submitted campaigns. Campaigns with "PendingApproval" status can be approved or rejected.
            </p>
            
            {campaigns.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
                No campaigns submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <ProjectApprovalPanel 
                    key={campaign.id}
                    project={{
                      _id: campaign.id,
                      title: campaign.title,
                      description: campaign.description,
                      category: campaign.category,
                      fundingGoal: campaign.fundingGoal,
                      status: campaign.status,
                      createdAt: campaign.createdAt
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === "users" && (
        <section className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
          User management is coming soon.
        </section>
      )}

      <AdminPanelModal
        category={editingCategory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
      />
    </>
  );
}
